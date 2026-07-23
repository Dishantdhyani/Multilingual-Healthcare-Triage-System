import os
import sys
import re
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from contextlib import asynccontextmanager

# Load environment variables from .env file if available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


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
    # --- Hindi Devanagari (General & Fever) ---
    "बुखार": "fever", "तेज बुखार": "high fever", "हल्का बुखार": "mild fever",
    "कंपकपी": "shivering chills", "ठंड": "chills", "कमजोरी": "weakness fatigue",
    "थकान": "fatigue exhaustion", "थकावट": "fatigue", "पसीना": "sweating",
    "रात में पसीना": "night sweats", "बेचैनी": "restlessness discomfort",
    "घबराहट": "anxiety palpitations", "सूजन": "swelling",
    
    # --- Hindi Devanagari (Cardiovascular & Respiratory) ---
    "सिरदर्द": "headache", "सिर दर्द": "headache", "छाती में दर्द": "chest pain",
    "सीने में दर्द": "chest pain", "सीने में जलन": "heartburn acidity",
    "दिल की धड़कन": "heart palpitations", "सांस": "breath",
    "सांस फूलना": "shortness of breath breathlessness",
    "सांस लेने में तकलीफ": "difficulty breathing asthma",
    "खांसी": "cough", "सूखी खांसी": "dry cough", "बलगम": "phlegm sputum",
    "गले": "throat", "गले में खराश": "sore throat throat pain",
    "जुकाम": "cold", "नाक बहना": "runny nose", "छींक": "sneezing allergy",
    
    # --- Hindi Devanagari (Gastrointestinal & Renal) ---
    "दर्द": "pain", "उल्टी": "vomiting nausea", "मतली": "nausea",
    "चक्कर": "dizziness vertigo", "चक्कर आना": "dizziness",
    "पेट": "stomach", "पेट दर्द": "stomach ache abdominal pain",
    "कब्ज": "constipation", "दस्त": "diarrhea loose motions",
    "जलन": "burning", "एसिडिटी": "acidity indigestion gerd",
    "भूख न लगना": "loss of appetite", "वजन घटना": "weight loss",
    "पीलिया": "jaundice yellowing of eyes", "पेशाब": "urine",
    "पेशाब में जलन": "burning urination uti", "पेशाब में खून": "blood in urine",
    
    # --- Hindi Devanagari (Musculoskeletal & Neurological) ---
    "बदन": "body ache", "बदन दर्द": "body ache muscle pain",
    "कमर दर्द": "back pain", "गर्दन में दर्द": "neck pain cervical",
    "जोड़ों में दर्द": "joint pain arthritis", "मांसपेशियों में दर्द": "muscle pain",
    "हाथ पैर में दर्द": "limb pain body ache", "सुन्न": "numbness",
    "सुन्न होना": "numbness", "झुनझुनी": "tingling", "बेहोशी": "fainting unconsciousness",
    
    # --- Hindi Devanagari (Dermatological & Injuries) ---
    "खुजली": "itching", "चकत्ते": "rash skin rash", "त्वचा पर दाने": "skin rash eruptions",
    "दाने": "pimples bumps rash", "मुंहासे": "acne pimples",
    "फोड़ा": "boil abscess pus", "दाद": "ringworm fungal infection",
    "लाल धब्बे": "red spots skin spots", "एलर्जी": "allergy",
    "चोट": "injury", "घाव": "wound", "खून": "bleeding blood", "कट": "cut",
    
    # --- Hinglish / Romanized Hindi (General & Fever) ---
    "bukhar": "fever", "tezz bukhar": "high fever", "tez bukhar": "high fever",
    "halka bukhar": "mild fever", "kampkapi": "shivering chills",
    "shivering": "shivering chills", "thand": "chills",
    "kamzori": "weakness fatigue", "kamzori mehsoos": "weakness fatigue",
    "thakan": "fatigue exhaustion", "thakawat": "fatigue",
    "paseena": "sweating", "raat me paseena": "night sweats",
    "bechaini": "restlessness discomfort", "ghabrahat": "anxiety palpitations",
    "soojan": "swelling", "sujan": "swelling", "swelling": "swelling",
    
    # --- Hinglish (Cardiovascular & Respiratory) ---
    "sar me dard": "headache", "sar dard": "headache", "sardard": "headache",
    "chaati me dard": "chest pain", "chati me dard": "chest pain",
    "seene me dard": "chest pain", "chest me dard": "chest pain",
    "seene me jalan": "heartburn acidity", "dil ki dhadkan": "heart palpitations",
    "saans": "breath", "saans phoolna": "shortness of breath breathlessness",
    "saans lene me takleef": "difficulty breathing asthma",
    "khansi": "cough", "sookhi khansi": "dry cough", "sukhi khansi": "dry cough",
    "balgam": "phlegm sputum", "phlegm": "phlegm",
    "gale me": "throat", "gale me kharash": "sore throat throat pain",
    "gale me dard": "sore throat", "jukam": "cold", "zukaam": "cold",
    "naak behna": "runny nose", "runny nose": "runny nose",
    "cheenk": "sneezing allergy", "sneezing": "sneezing",
    
    # --- Hinglish (Gastrointestinal & Renal) ---
    "dard": "pain", "ulti": "vomiting nausea", "vomit": "vomiting",
    "matli": "nausea", "chakkar": "dizziness vertigo",
    "chakkar aana": "dizziness", "sar ghoomna": "dizziness vertigo",
    "pet": "stomach", "pet me dard": "stomach ache abdominal pain",
    "pet dard": "stomach ache", "pet kharab": "stomach infection diarrhea",
    "kabz": "constipation", "dast": "diarrhea loose motions",
    "loose motion": "diarrhea loose motions", "loose motions": "diarrhea",
    "jalan": "burning", "acidity": "acidity indigestion gerd",
    "gas": "indigestion acidity", "bhookh nahi lag rahi": "loss of appetite",
    "bhook na lagna": "loss of appetite", "weight loss": "weight loss",
    "vajan ghatna": "weight loss", "peeliya": "jaundice yellowing of eyes",
    "jaundice": "jaundice yellowing of eyes", "peshab": "urine",
    "peshab me jalan": "burning urination uti", "peshab me khoon": "blood in urine",
    
    # --- Hinglish (Musculoskeletal & Neurological) ---
    "badan me dard": "body ache muscle pain", "body ache": "body ache",
    "body pain": "body pain", "kamar dard": "back pain",
    "kamar me dard": "back pain", "gardan me dard": "neck pain cervical",
    "jodo me dard": "joint pain arthritis", "joint pain": "joint pain arthritis",
    "muscles me dard": "muscle pain", "haath pair me dard": "limb pain body ache",
    "sunn hona": "numbness", "sunn": "numbness", "jhunjhuni": "tingling",
    "behosh": "fainting unconsciousness", "behoshi": "fainting unconsciousness",
    
    # --- Hinglish (Dermatological & Injuries) ---
    "khujli": "itching", "itching": "itching", "chakatte": "rash skin rash",
    "skin par daane": "skin rash eruptions", "daane": "pimples bumps rash",
    "pimples": "acne pimples", "phoda": "boil abscess pus",
    "daad": "ringworm fungal infection", "fungal infection": "fungal infection",
    "laal dhabbe": "red spots skin spots", "red spots": "red spots",
    "allergy": "allergy", "rashes": "skin rash",
    "chot": "injury", "ghav": "wound", "khoon": "bleeding blood", "kat": "cut"
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
    predictions_raw, retrieved_cases = vdb.predict_consensus(enriched_text, top_k=25)

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

class ChatMessageModel(BaseModel):
    sender: str
    text: str
    timestamp: Optional[str] = None

class MindEaseChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessageModel]] = []
    api_key: Optional[str] = None

@app.post("/mindease/chat")
async def mindease_chat(request: MindEaseChatRequest):
    # Determine which API key to use (request or env)
    api_key = (request.api_key or "").strip() or os.getenv("GROQ_API_KEY", "").strip()
    
    # If no key provided anywhere, return helpful instructions
    if not api_key:
        return {
            "reply": "I'm right here with you! To unlock my live neural **Groq AI (`llama-3.3-70b-versatile`)** conversational engine, please add your Groq API Key (`GROQ_API_KEY=gsk_...`) to a `.env` file in the project directory, or paste your key directly into the **Groq API Key** setting bar right above our chat box.",
            "status": "missing_key"
        }
    
    # Construct system prompt and messages array for Groq
    system_prompt = (
        "You are 'Joy', a compassionate, empathetic, and warm AI companion inside the 'MindEase Companion & Wellness Suite' of the Multilingual Healthcare Triage System. "
        "Your role is to provide emotional support, active listening, mindfulness advice, and gentle guidance when users feel stressed, anxious, lonely, or overwhelmed. "
        "\n\n"
        "OUTPUT FORMAT & FORMATTING RULES:\n"
        "1. Respond directly with a rich, beautifully formatted, warm, and structured **Markdown text message** (no JSON wrapper).\n"
        "2. Use **bold emphasis** (`**Key Phrase**`) for soothing affirmations, important tips, and section headers.\n"
        "3. Use clean **bullet points** or numbered lists whenever sharing multi-step grounding exercises (like 4-4-4-4 box breathing), coping strategies, or reflection questions so your advice is scannable and easy to follow.\n"
        "4. Structure your response into 2-3 short, soothing paragraphs to make it feel natural, human-like, and deeply supportive.\n"
        "5. Important: You are NOT a doctor and cannot diagnose medical conditions or prescribe medications. If someone expresses severe mental distress or self-harm, "
        "gently and urgently advise them to contact crisis support or emergency services immediately.\n"
        "CRITICAL LANGUAGE & DIALECT RULE:\n"
        "1. Base your language selection STRICTLY and SOLELY on the user's NEWEST/LATEST message right now. Do NOT be influenced by what language was used in previous messages in the conversation history.\n"
        "2. If the user's newest message is in pure English (e.g., 'i am not feeling well', 'I feel sad today', 'what can I do to calm down?'), you MUST write your reply in **pure English ONLY**. NEVER reply in Hindi or Hinglish when the user's latest message is in English.\n"
        "3. If the user's newest message is in Hinglish (Hindi words written using English/Latin script, such as 'mujhe bahut stress ho raha hai', 'sar me dard hai', 'zindagi me tension hai'), you MUST write your reply in **Hinglish using English (Latin) script ONLY** (e.g., 'Mujhe samajh aa raha hai ki aapko bahut stress ho raha hai. **Please ek gehra saans lijiye**...'). NEVER use Devanagari (Hindi) script when the user types in English script.\n"
        "4. If the user's newest message is in Devanagari Hindi script (e.g., 'मुझे अच्छा नहीं लग रहा'), write your reply in Devanagari Hindi script.\n"
    )
    
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add conversation history (up to last 10 messages)
    if request.history:
        for msg in request.history[-10:]:
            role = "assistant" if msg.sender == "bot" else "user"
            messages.append({"role": role, "content": msg.text})
            
    messages.append({"role": "user", "content": request.message})
    
    # Call Groq API endpoint directly via httpx
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 800
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                raw_content = data["choices"][0]["message"]["content"]
                # In case model still outputs a JSON object wrapper, parse safely or return direct markdown
                try:
                    import json
                    parsed_json = json.loads(raw_content)
                    reply = parsed_json.get("message", raw_content)
                    return {"reply": reply, "status": "success"}
                except Exception:
                    return {"reply": raw_content, "status": "success"}
            else:
                err_text = resp.text
                return {
                    "reply": f"I couldn't reach the Groq AI service right now (HTTP {resp.status_code}: {err_text}). Please verify that your `GROQ_API_KEY` is valid.",
                    "status": "error"
                }
    except Exception as e:
        return {
            "reply": f"I encountered a network or connection error while trying to reach Groq AI: {str(e)}",
            "status": "error"
        }

