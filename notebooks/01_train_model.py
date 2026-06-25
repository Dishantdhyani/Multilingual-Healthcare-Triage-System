"""
01_train_model.py
=================
Fine-tunes distilbert-base-uncased on the Symptom2Disease dataset
for 24-class disease classification.

Usage:
    cd <project_root>
    python notebooks/01_train_model.py
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score

import torch
from torch.utils.data import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "Symptom2Disease.csv")
MODEL_SAVE_DIR = os.path.join(PROJECT_ROOT, "models", "symptom_model")
BASE_MODEL = "emilyalsentzer/Bio_ClinicalBERT"

SEED = 42
MAX_LENGTH = 128
EPOCHS = 25
BATCH_SIZE = 16
LEARNING_RATE = 3e-5
WARMUP_RATIO = 0.1

# ---------------------------------------------------------------------------
# 1. Load & Explore
# ---------------------------------------------------------------------------
print("=" * 60)
print("1. LOADING DATASET")
print("=" * 60)

df = pd.read_csv(DATA_PATH)
# Drop the unnamed index column if present
if "Unnamed: 0" in df.columns:
    df = df.drop(columns=["Unnamed: 0"])

print(f"   Shape: {df.shape}")
print(f"   Columns: {df.columns.tolist()}")
print(f"   Diseases: {df['label'].nunique()}")
print(f"\n   Class distribution:\n{df['label'].value_counts().to_string()}")
print(f"\n   Avg text length: {df['text'].str.len().mean():.0f} chars")
print(f"   Max text length: {df['text'].str.len().max()} chars")

# ---------------------------------------------------------------------------
# 2. Preprocess — Label Encoding & Splits
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print("2. PREPROCESSING")
print("=" * 60)

le = LabelEncoder()
df["label_id"] = le.fit_transform(df["label"])

label_mapping = {int(i): name for i, name in enumerate(le.classes_)}
print(f"   Label mapping: {label_mapping}")

# Stratified split: 70% train, 15% val, 15% test
train_df, temp_df = train_test_split(
    df, test_size=0.3, stratify=df["label_id"], random_state=SEED
)
val_df, test_df = train_test_split(
    temp_df, test_size=0.5, stratify=temp_df["label_id"], random_state=SEED
)

print(f"   Train: {len(train_df)} | Val: {len(val_df)} | Test: {len(test_df)}")

# ---------------------------------------------------------------------------
# 3. Tokenization & Dataset
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print("3. TOKENIZING")
print("=" * 60)

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)


class SymptomDataset(Dataset):
    """PyTorch dataset for symptom texts."""

    def __init__(self, texts, labels, tokenizer, max_length):
        self.encodings = tokenizer(
            texts.tolist(),
            truncation=True,
            padding="max_length",
            max_length=max_length,
            return_tensors="pt",
        )
        self.labels = torch.tensor(labels.tolist(), dtype=torch.long)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {key: val[idx] for key, val in self.encodings.items()}
        item["labels"] = self.labels[idx]
        return item


train_dataset = SymptomDataset(train_df["text"], train_df["label_id"], tokenizer, MAX_LENGTH)
val_dataset = SymptomDataset(val_df["text"], val_df["label_id"], tokenizer, MAX_LENGTH)
test_dataset = SymptomDataset(test_df["text"], test_df["label_id"], tokenizer, MAX_LENGTH)

print(f"   Tokenized — max_length={MAX_LENGTH}")

# ---------------------------------------------------------------------------
# 4. Model & Training
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print("4. TRAINING")
print("=" * 60)

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"   Device: {device}")

model = AutoModelForSequenceClassification.from_pretrained(
    BASE_MODEL,
    num_labels=len(label_mapping),
)


def compute_metrics(eval_pred):
    """Compute accuracy for the Trainer."""
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    acc = accuracy_score(labels, predictions)
    return {"accuracy": acc}


training_args = TrainingArguments(
    output_dir=os.path.join(PROJECT_ROOT, "models", "checkpoints"),
    num_train_epochs=EPOCHS,
    per_device_train_batch_size=BATCH_SIZE,
    per_device_eval_batch_size=BATCH_SIZE,
    learning_rate=LEARNING_RATE,
    warmup_ratio=WARMUP_RATIO,
    weight_decay=0.01,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="accuracy",
    logging_steps=10,
    seed=SEED,
    report_to="none",  # disable wandb/tensorboard
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
)

trainer.train()

# ---------------------------------------------------------------------------
# 5. Evaluate on Test Set
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print("5. EVALUATION ON TEST SET")
print("=" * 60)

predictions = trainer.predict(test_dataset)
preds = np.argmax(predictions.predictions, axis=-1)
true_labels = test_df["label_id"].values

acc = accuracy_score(true_labels, preds)
print(f"\n   Test Accuracy: {acc:.4f}")

target_names = [label_mapping[i] for i in range(len(label_mapping))]
report = classification_report(true_labels, preds, target_names=target_names)
print(f"\n   Classification Report:\n{report}")

# ---------------------------------------------------------------------------
# 6. Save Model, Tokenizer & Label Mapping
# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
print("6. SAVING MODEL")
print("=" * 60)

os.makedirs(MODEL_SAVE_DIR, exist_ok=True)

trainer.save_model(MODEL_SAVE_DIR)
tokenizer.save_pretrained(MODEL_SAVE_DIR)

label_map_path = os.path.join(MODEL_SAVE_DIR, "label_mapping.json")
with open(label_map_path, "w") as f:
    json.dump(label_mapping, f, indent=2)

print(f"   Model saved to: {MODEL_SAVE_DIR}")
print(f"   Label mapping saved to: {label_map_path}")
print("\n[DONE] Training complete!")
