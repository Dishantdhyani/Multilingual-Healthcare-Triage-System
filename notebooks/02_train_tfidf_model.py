"""
02_train_tfidf_model.py
=======================
Trains a TF-IDF + SVM classifier on the Symptom2Disease dataset.
Classical ML often outperforms fine-tuned transformers on small datasets.

Usage:
    cd <project_root>
    python notebooks/02_train_tfidf_model.py
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
from sklearn.pipeline import Pipeline

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "Symptom2Disease.csv")
MODEL_SAVE_DIR = os.path.join(PROJECT_ROOT, "models", "symptom_model")
SEED = 42

# ---------------------------------------------------------------------------
# 1. Load & Explore
# ---------------------------------------------------------------------------
print("=" * 60)
print("1. LOADING DATASET")
print("=" * 60)

df = pd.read_csv(DATA_PATH)
if "Unnamed: 0" in df.columns:
    df = df.drop(columns=["Unnamed: 0"])

print(f"   Shape: {df.shape}")
print(f"   Diseases: {df['label'].nunique()}")
print(f"   Avg text length: {df['text'].str.len().mean():.0f} chars")

# ---------------------------------------------------------------------------
# 2. Preprocess
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print("2. PREPROCESSING")
print("=" * 60)

le = LabelEncoder()
df["label_id"] = le.fit_transform(df["label"])

label_mapping = {int(i): name for i, name in enumerate(le.classes_)}
print(f"   Classes: {len(label_mapping)}")

# Stratified split: 70% train, 15% val, 15% test
train_df, temp_df = train_test_split(
    df, test_size=0.3, stratify=df["label_id"], random_state=SEED
)
val_df, test_df = train_test_split(
    temp_df, test_size=0.5, stratify=temp_df["label_id"], random_state=SEED
)

print(f"   Train: {len(train_df)} | Val: {len(val_df)} | Test: {len(test_df)}")

# ---------------------------------------------------------------------------
# 3. Build Pipeline & Grid Search
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print("3. TRAINING TF-IDF + SVM")
print("=" * 60)

# Pipeline: TF-IDF vectorizer -> Calibrated LinearSVC (for probability estimates)
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(
        ngram_range=(1, 2),      # unigrams + bigrams
        max_features=10000,
        sublinear_tf=True,       # apply log normalization
        strip_accents="unicode",
    )),
    ("clf", CalibratedClassifierCV(
        LinearSVC(
            max_iter=5000,
            random_state=SEED,
        ),
        cv=5,
    )),
])

# Grid search over key parameters
param_grid = {
    "tfidf__ngram_range": [(1, 1), (1, 2), (1, 3)],
    "tfidf__max_features": [5000, 10000, 15000],
    "clf__estimator__C": [0.1, 0.5, 1.0, 5.0, 10.0],
}

print("   Running grid search (this may take a minute)...")

grid_search = GridSearchCV(
    pipeline,
    param_grid,
    cv=5,
    scoring="accuracy",
    n_jobs=-1,
    verbose=0,
)

grid_search.fit(train_df["text"], train_df["label_id"])

print(f"   Best CV Accuracy: {grid_search.best_score_:.4f}")
print(f"   Best Params: {grid_search.best_params_}")

best_model = grid_search.best_estimator_

# ---------------------------------------------------------------------------
# 4. Evaluate on Validation Set
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print("4. VALIDATION SET RESULTS")
print("=" * 60)

val_preds = best_model.predict(val_df["text"])
val_acc = accuracy_score(val_df["label_id"], val_preds)
print(f"   Val Accuracy: {val_acc:.4f}")

# ---------------------------------------------------------------------------
# 5. Evaluate on Test Set
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print("5. TEST SET RESULTS")
print("=" * 60)

test_preds = best_model.predict(test_df["text"])
test_acc = accuracy_score(test_df["label_id"], test_preds)
print(f"\n   Test Accuracy: {test_acc:.4f}")

target_names = [label_mapping[i] for i in range(len(label_mapping))]
report = classification_report(test_df["label_id"], test_preds, target_names=target_names)
print(f"\n   Classification Report:\n{report}")

# ---------------------------------------------------------------------------
# 6. Save Model & Label Mapping
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print("6. SAVING MODEL")
print("=" * 60)

os.makedirs(MODEL_SAVE_DIR, exist_ok=True)

model_path = os.path.join(MODEL_SAVE_DIR, "tfidf_svm_pipeline.joblib")
joblib.dump(best_model, model_path)

label_map_path = os.path.join(MODEL_SAVE_DIR, "label_mapping.json")
with open(label_map_path, "w") as f:
    json.dump(label_mapping, f, indent=2)

# Save model type indicator so the backend knows which model to load
model_info = {
    "model_type": "tfidf_svm",
    "test_accuracy": float(test_acc),
    "best_params": {str(k): str(v) for k, v in grid_search.best_params_.items()},
    "num_classes": len(label_mapping),
}
with open(os.path.join(MODEL_SAVE_DIR, "model_info.json"), "w") as f:
    json.dump(model_info, f, indent=2)

print(f"   Pipeline saved to: {model_path}")
print(f"   Label mapping saved to: {label_map_path}")
print("\n[DONE] Training complete!")
