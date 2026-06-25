"""
03_predict.py
=============
Loads the trained TF-IDF + SVM model and predicts diseases from symptom text.

Usage:
    cd <project_root>
    python notebooks/03_predict.py
"""

import os
import json
import joblib
import numpy as np

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_DIR = os.path.join(PROJECT_ROOT, "models", "symptom_model")

# ---------------------------------------------------------------------------
# Load Model & Label Mapping
# ---------------------------------------------------------------------------
print("Loading model...")
pipeline = joblib.load(os.path.join(MODEL_DIR, "tfidf_svm_pipeline.joblib"))

with open(os.path.join(MODEL_DIR, "label_mapping.json"), "r") as f:
    label_mapping = json.load(f)

print(f"Model loaded! ({len(label_mapping)} diseases)\n")


def predict(symptom_text):
    """Predict disease from symptom description."""
    # Predict class
    pred_id = pipeline.predict([symptom_text])[0]
    disease = label_mapping[str(pred_id)]

    # Get probability scores
    probs = pipeline.predict_proba([symptom_text])[0]
    confidence = probs[pred_id]

    # Top 3 predictions
    top_indices = np.argsort(probs)[::-1][:3]
    top_3 = []
    for idx in top_indices:
        top_3.append({
            "disease": label_mapping[str(idx)],
            "confidence": f"{probs[idx] * 100:.1f}%",
        })

    return disease, confidence, top_3


# ---------------------------------------------------------------------------
# Test Predictions
# ---------------------------------------------------------------------------
test_cases = [
    "I have been experiencing severe headache, high fever, and chills for the past 3 days. My body aches all over.",
    "I have red, itchy rashes on my arms and legs. My skin is peeling and my nails have small dents.",
    "I have been sneezing a lot, runny nose, mild fever and sore throat for the past 2 days.",
    "My blood sugar levels are very high. I feel thirsty all the time and urinate frequently.",
    "I have severe stomach pain, vomiting and diarrhea. I also have a high fever.",
    "My joints are very stiff and painful, especially in the morning. It is hard to move my fingers.",
    "I have swollen veins on my legs. My calves cramp when I walk and my legs feel heavy.",
    "I have difficulty breathing, wheezing and tightness in my chest. It gets worse at night.",
    "I have pimples and blackheads on my face, especially on my forehead and cheeks.",
    "I have a severe headache on one side of my head with nausea and sensitivity to light.",
]

print("=" * 70)
print("DISEASE PREDICTIONS")
print("=" * 70)

for i, symptoms in enumerate(test_cases, 1):
    disease, confidence, top_3 = predict(symptoms)

    print(f"\n--- Test Case {i} ---")
    print(f"Symptoms: {symptoms[:80]}...")
    print(f"Prediction: {disease} ({confidence * 100:.1f}% confidence)")
    print(f"Top 3:")
    for rank, pred in enumerate(top_3, 1):
        print(f"   {rank}. {pred['disease']} - {pred['confidence']}")

print("\n" + "=" * 70)
print("INTERACTIVE MODE - Type your symptoms (or 'quit' to exit)")
print("=" * 70)

while True:
    user_input = input("\nDescribe your symptoms: ").strip()
    if user_input.lower() in ("quit", "exit", "q"):
        print("Goodbye!")
        break
    if not user_input:
        print("Please enter your symptoms.")
        continue

    disease, confidence, top_3 = predict(user_input)
    print(f"\n  Predicted Disease: {disease}")
    print(f"  Confidence: {confidence * 100:.1f}%")
    print(f"  Top 3:")
    for rank, pred in enumerate(top_3, 1):
        print(f"    {rank}. {pred['disease']} - {pred['confidence']}")
