import os
import sys
import json
import torch
import numpy as np
import re
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models", "symptom_model")

HEALTH_KEYWORDS = [
    r'skin', r'pain', r'fever', r'experienc', r'neck', r'cough', r'chest', r'headache', r'throat', 
    r'rash', r'hurt', r'red', r'severe', r'body', r'itch', r'back', r'weak', r'chill', r'stomach', 
    r'discomfort', r'nausea', r'uncomfortable', r'muscle', r'leg', r'exhaust', r'breath', 
    r'appetite', r'nose', r'vomit', r'weight', r'stiff', r'joint', r'arm', r'swell', r'swollen', 
    r'yellow', r'pimple', r'sore', r'anus', r'eye', r'temperature', r'urine', r'ache', r'spot', 
    r'indigestion', r'dizzi', r'tire', r'face', r'pus', r'blackhead', r'heart', r'suffer', 
    r'phlegm', r'pee', r'blood', r'burn', r'sweat', r'shiver', r'cramp', r'bruis', r'diarrhea', 
    r'constipat', r'diseas', r'sick', r'ill', r'symptom', r'lump', r'bump', r'bleed', r'infect', 
    r'doctor', r'hospital', r'clinic', r'medicin', r'pill', r'drug', r'allerg', r'asthma', 
    r'vision', r'hear', r'swallow', r'numb', r'tingl', r'depress', r'anxiet', r'stress', r'sleep'
]
HEALTH_REGEX = re.compile(r'\b(?:' + '|'.join(HEALTH_KEYWORDS) + r')\w*\b', re.IGNORECASE)

SEVERITY = {
    "Dengue": "high",
    "Malaria": "high",
    "Pneumonia": "high",
    "Typhoid": "high",
    "Hypertension": "high",
    "Jaundice": "medium",
    "Bronchial Asthma": "medium",
    "diabetes": "medium",
    "Cervical spondylosis": "medium",
    "Arthritis": "medium",
    "peptic ulcer disease": "medium",
    "urinary tract infection": "medium",
    "gastroesophageal reflux disease": "medium",
    "Dimorphic Hemorrhoids": "medium",
    "Migraine": "medium",
    "drug reaction": "medium",
    "Psoriasis": "low",
    "Varicose Veins": "low",
    "Chicken pox": "low",
    "Impetigo": "low",
    "Fungal infection": "low",
    "Common Cold": "low",
    "Acne": "low",
    "allergy": "low",
}

def load_model():
    if not os.path.exists(MODEL_DIR):
        print(f"Error: Model directory not found at {MODEL_DIR}")
        print("Please ensure the model is trained and saved in 'models/symptom_model'")
        sys.exit(1)
        
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Loading model on {device}...")
    
    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    model.to(device)
    model.eval()

    label_map_path = os.path.join(MODEL_DIR, "label_mapping.json")
    with open(label_map_path, "r") as f:
        label_mapping = json.load(f)

    return model, tokenizer, label_mapping, device

def predict(text, model, tokenizer, label_mapping, device):
    if not HEALTH_REGEX.search(text):
        print("\n" + "="*50)
        print("PREDICTION RESULTS")
        print("="*50)
        print(f"Symptoms: {text}\n")
        print("-> Status: No health-related symptoms detected.")
        print("   Please describe your physical symptoms in more detail.")
        print("="*50 + "\n")
        return

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding="max_length",
        max_length=128,
    ).to(device)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probabilities = torch.nn.functional.softmax(logits, dim=-1)

    probs = probabilities[0].cpu().numpy()
    top_indices = np.argsort(probs)[::-1][:3]
    
    print("\n" + "="*50)
    print("PREDICTION RESULTS")
    print("="*50)
    print(f"Symptoms: {text}\n")
    
    for i, idx in enumerate(top_indices):
        disease_name = label_mapping[str(idx)]
        confidence = probs[idx]
        severity = SEVERITY.get(disease_name, "unknown").upper()
        
        prefix = "-> Best Match:" if i == 0 else f"   Alternative {i}:"
        print(f"{prefix} {disease_name}")
        print(f"   Confidence: {confidence:.2%}")
        print(f"   Severity:   {severity}")
        print("-" * 30)
    print("="*50 + "\n")

def main():
    print("Initializing Healthcare Triage System...")
    model, tokenizer, label_mapping, device = load_model()
    
    print("\nSystem ready! Type your symptoms below (or type 'quit' to exit).")
    
    while True:
        try:
            text = input("\nEnter symptoms: ").strip()
            if text.lower() in ['quit', 'exit', 'q']:
                break
            if not text:
                continue
            
            predict(text, model, tokenizer, label_mapping, device)
            
        except EOFError:
            break
        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"Error occurred: {e}")

if __name__ == "__main__":
    main()
