import os
import sys
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
from contextlib import asynccontextmanager

# Add root directory to sys.path to import vector_db
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.append(root_dir)

from vector_db import SymptomVectorDB

# Clinical Severity Mapping
SEVERITY = {
    "Dengue": "high", "Malaria": "high", "Pneumonia": "high", "Typhoid": "high", "Hypertension": "high",
    "Physical Trauma / Laceration": "high",
    "Jaundice": "medium", "Bronchial Asthma": "medium", "diabetes": "medium", "Cervical spondylosis": "medium",
    "Arthritis": "medium", "peptic ulcer disease": "medium", "urinary tract infection": "medium",
    "gastroesophageal reflux disease": "medium", "Dimorphic Hemorrhoids": "medium", "Migraine": "medium",
    "drug reaction": "medium", "Psoriasis": "low", "Varicose Veins": "low", "Chicken pox": "low",
    "Impetigo": "low", "Fungal infection": "low", "Common Cold": "low", "Acne": "low", "allergy": "low",
}

# Friendly Medical Specialty Names
SPECIALTIES = {
    "Dengue": "General Physician / Infectious Disease Doctor",
    "Malaria": "General Physician / Infectious Disease Doctor",
    "Pneumonia": "Pulmonologist / Lung Specialist",
    "Typhoid": "General Physician / Internal Medicine",
    "Hypertension": "Cardiologist / Heart Specialist",
    "Physical Trauma / Laceration": "Emergency Surgeon / Wound Care Specialist / Orthopedist",
    "Jaundice": "Gastroenterologist / Liver Specialist",
    "Bronchial Asthma": "Pulmonologist / Asthma & Allergy Doctor",
    "diabetes": "Endocrinologist / Diabetes Specialist",
    "Cervical spondylosis": "Orthopedic Doctor / Neurologist",
    "Arthritis": "Rheumatologist / Joint Specialist",
    "peptic ulcer disease": "Gastroenterologist / Stomach Specialist",
    "urinary tract infection": "Urologist / Kidney Specialist",
    "gastroesophageal reflux disease": "Gastroenterologist / Stomach Specialist",
    "Dimorphic Hemorrhoids": "General Surgeon / Proctologist",
    "Migraine": "Neurologist / Headache Specialist",
    "drug reaction": "Allergist / Dermatologist",
    "Psoriasis": "Dermatologist (Skin Specialist)",
    "Varicose Veins": "Vascular Specialist / Vein Doctor",
    "Chicken pox": "General Physician",
    "Impetigo": "Dermatologist / Pediatrician",
    "Fungal infection": "Dermatologist (Skin Specialist)",
    "Common Cold": "General Physician / Family Doctor",
    "Acne": "Dermatologist (Skin Specialist)",
    "allergy": "Allergy Specialist / Immunologist"
}

# Health keyword patterns for XAI
HEALTH_KEYWORDS = [
    r'skin', r'pain', r'fever', r'neck', r'cough', r'chest', r'headache', r'throat', 
    r'rash', r'hurt', r'body', r'itch', r'back', r'weak', r'chill', r'stomach', 
    r'nausea', r'muscle', r'leg', r'exhaust', r'breath', r'appetite', r'nose', 
    r'vomit', r'weight', r'stiff', r'joint', r'arm', r'swell', r'swollen', 
    r'sore', r'eye', r'temperature', r'urine', r'ache', r'dizzi', r'tire', 
    r'heart', r'blood', r'burn', r'sweat', r'shiver', r'cramp', r'diarrhea', 
    r'constipat', r'sick', r'ill', r'symptom', r'bleed', r'infect', r'allerg', 
    r'asthma', r'vision', r'numb', r'depress', r'anxiet', r'stress', r'sleep',
    r'cut', r'wound', r'lacerat', r'fracture', r'broken', r'injury', r'trauma', r'stich', r'sprain', r'bruis', r'accident',
    r'dard', r'bukhar', r'thand', r'sar', r'pet', r'khansi', r'jukam', r'chakkar', r'chot', r'ghav', r'khoon', r'kat',
    r'बुखार', r'दर्द', r'सिरदर्द', r'खांसी', r'जुकाम', r'चक्कर', r'उल्टी', r'जलन', r'ठंड', r'कमजोरी', r'चोट', r'घाव', r'खून', r'कट'
]

# Multilingual Symptom Dictionary Mapping for Vector DB Alignment
HINDI_TO_ENGLISH_MAP = {
    # Hindi Devanagari
    "बुखार": "fever",
    "दर्द": "pain",
    "सिरदर्द": "headache",
    "सिर दर्द": "headache",
    "खांसी": "cough",
    "जुकाम": "cold",
    "चक्कर": "dizziness",
    "उल्टी": "vomiting",
    "जलन": "burning",
    "ठंड": "chills",
    "कमजोरी": "weakness",
    "खुजली": "itching",
    "चकत्ते": "rash",
    "सांस": "breath",
    "गले": "throat",
    "बदन": "body ache",
    "थकावट": "fatigue",
    "कब्ज": "constipation",
    "दस्त": "diarrhea",
    "पेट": "stomach",
    "चोट": "injury",
    "घाव": "wound",
    "खून": "bleeding",
    "कट": "cut",
    
    # Hinglish / Romanized Hindi
    "bukhar": "fever",
    "dard": "pain",
    "sar me dard": "headache",
    "sar dard": "headache",
    "khansi": "cough",
    "jukam": "cold",
    "chakkar": "dizziness",
    "ulti": "vomiting",
    "jalan": "burning",
    "thand": "chills",
    "kamzori": "weakness",
    "khujli": "itching",
    "saans": "breath",
    "gale me": "throat",
    "body ache": "body ache",
    "body pain": "body pain",
    "thakawat": "fatigue",
    "kabz": "constipation",
    "dast": "diarrhea",
    "pet": "stomach",
    "chot": "injury",
    "ghav": "wound",
    "khoon": "bleeding",
    "kat": "cut"
}

def translate_query(text: str) -> str:
    """Translate or append English terms for Hindi/Hinglish keywords to assist Vector DB matching."""
    enriched = text.lower()
    matched = []
    for source_term, target_term in HINDI_TO_ENGLISH_MAP.items():
        if source_term in enriched:
            matched.append(target_term)
    
    if matched:
        unique_matches = list(set(matched))
        return text + " " + " ".join(unique_matches)
    return text

vdb = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global vdb
    data_path = os.path.join(root_dir, "data", "processed", "Symptom2Disease.csv")
    cache_path = os.path.join(root_dir, "models", "vector_db_cache.joblib")
    vdb = SymptomVectorDB(data_path=data_path, cache_path=cache_path)
    vdb.init_db()
    print("Vector DB engine loaded and ready.")
    yield
    print("Shutting down Healthcare Triage API...")

app = FastAPI(
    title="Multilingual Healthcare Triage API",
    description="API for evaluating symptoms using Vector DB semantic retrieval.",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SymptomRequest(BaseModel):
    text: Optional[str] = None
    query: Optional[str] = None
    top_k: Optional[int] = 15
    language: Optional[str] = "en"

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Multilingual Healthcare Triage System API",
        "version": "2.0.0"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "engine": "VectorDB-RAG",
        "records_indexed": len(vdb.metadata) if vdb and vdb.metadata else 0
    }

@app.post("/predict")
def predict_symptoms(request: SymptomRequest):
    raw_text = request.text or request.query or ""
    text = raw_text.strip()
    if not text:
        return {"predictions": [], "similar_cases": [], "detected_symptoms": []}
    
    # Translate Hindi/Hinglish components to support vector similarity retrieval
    enriched_text = translate_query(text)
    
    # Run Vector DB prediction
    predictions_raw, retrieved_cases = vdb.predict_consensus(enriched_text, top_k=15)
    
    if not predictions_raw or predictions_raw[0]["confidence"] < 0.05:
        return {"predictions": [], "similar_cases": [], "detected_symptoms": []}
    
    # Enrich predictions with severity and specialty
    predictions = []
    for pred in predictions_raw:
        disease = pred["disease"]
        predictions.append({
            "disease": disease,
            "confidence": pred["confidence"],
            "similarity": pred["top_match_similarity"],
            "severity": SEVERITY.get(disease, "unknown"),
            "specialty": SPECIALTIES.get(disease, "General Physician / Family Doctor")
        })
    
    # Extract detected symptom keywords
    words = re.findall(r'\w+', text.lower(), re.UNICODE)
    detected = set()
    for w in words:
        for kw in HEALTH_KEYWORDS:
            if re.search(kw, w, re.IGNORECASE | re.UNICODE):
                detected.add(w)
                break
    
    # Similar cases (top 5)
    similar_cases = []
    for case in retrieved_cases[:5]:
        similar_cases.append({
            "case_id": case["case_id"],
            "disease": case["disease"],
            "symptom_text": case["matched_symptom"],
            "similarity": case["similarity"]
        })
    
    return {
        "predictions": predictions,
        "similar_cases": similar_cases,
        "detected_symptoms": sorted(list(detected))
    }
