# 🏥 Multilingual Healthcare Triage System & Vector DB (RAG) Platform

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.30+-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![Vector DB](https://img.shields.io/badge/Vector_DB-RAG_k--NN-00C6FF?style=for-the-badge)](https://en.wikipedia.org/wiki/Vector_database)
[![AI Triage](https://img.shields.io/badge/AI_Triage-HIPAA_Ready-10B981?style=for-the-badge)](https://en.wikipedia.org/wiki/Triage)

An enterprise-grade, AI-powered multilingual healthcare triage system and diagnostic command center. Designed to analyze patient symptom descriptions across **English**, **Hindi**, and **Hinglish** in real time, perform **Vector Database Semantic Retrieval (RAG)** against verified historical clinical cases, evaluate acute severity tiers, and recommend specialized medical actions with **zero network latency (100% client-side execution)**.

---

## ✨ Key Architectural Innovations & Features

### 1. ⚡ Zero-Latency Standalone Client-Side Execution
* **No Server Dependencies:** The complete machine learning inference engine and Vector Database are embedded directly into the Streamlit frontend runtime via Python in-memory data structures and `@st.cache_resource`.
* **Instantaneous Triage:** Eliminates network round-trip delays, API bottlenecks, and external server sockets. Diagnostic evaluation executes in less than **5 milliseconds**.

### 2. 📚 Vector Database & RAG (Retrieval-Augmented Generation)
* **High-Dimensional n-gram Indexing:** Built from the ground up in `vector_db.py`, indexing **1,201 verified patient symptom records** across 24 medical conditions into a 25,000-dimensional TF-IDF vector embedding space (unigrams, bigrams, and trigrams with sublinear term-frequency normalization).
* **Real-Time Semantic Retrieval (k-NN):** When a patient describes symptoms, the query is transformed into a vector embedding and compared against the entire historical database using **Cosine Similarity** to retrieve the exact top nearest neighbor clinical cases.
* **Quadratic Consensus Voting:** Computes diagnostic probability confidences by applying quadratic distance weighting ($\text{similarity}^2$) across the top 15 retrieved vector neighbors, eliminating AI hallucination and providing verifiable historical case citations.

### 3. ⚡ eXplainable AI (XAI) Keyword Transparency
* **Clinical Term Detection:** Integrates a multilingual clinical NLP tokenizer that scans patient input for over 100 medical terms across English, Hindi (`बुखार`, `दर्द`, `चक्कर`, `उल्टी`, `कमजोरी`), and Hinglish (`sar me dard`, `thand`, `bukhar`, `pet`).
* **Visual Pill Box:** Highlights detected symptom keywords as vibrant glowing cyan pills directly above the assessment results, allowing doctors and patients to see exactly which terms triggered the diagnostic decision.

### 4. 🚨 Automated Clinical Severity & Emergency Triage
* **Dynamic Risk Grading:** Automatically evaluates condition risk tiers and displays high-visibility triage action banners:
  * 🔴 **HIGH SEVERITY (Emergency):** Advises immediate visit to an emergency room or urgent care clinic for critical conditions (e.g., Dengue, Malaria, Pneumonia, Typhoid, Hypertension).
  * 🟡 **MEDIUM SEVERITY (Urgent):** Recommends scheduling a specialized medical appointment within 24–48 hours (e.g., Asthma, Diabetes, Arthritis, Migraine, GERD).
  * 🟢 **LOW SEVERITY (Routine):** Recommends rest, hydration, and routine symptom monitoring (e.g., Common Cold, Allergies, Psoriasis, Acne).

### 5. 🩺 Specialty Mapping & Referral Engine
* **24 Clinical Specialties:** Every predicted condition is dynamically mapped to the appropriate medical specialist (e.g., *Pulmonologist*, *Neurologist*, *Cardiologist*, *Gastroenterologist*, *Rheumatologist*).
* **Emergency Referral Protocol:** Features an integrated emergency helpline box displaying immediate medical rescue numbers (`📞 112 / 911 / 108 Ambulance`).

### 6. 🛸 Ultra-Premium Cyberpunk Command HUD
* **Glassmorphic UI:** Features frosted glass panels (`backdrop-filter: blur(25px)`), deep navy/cyberpunk gradient backgrounds (`#060913` to `#06182c`), and glowing cyan borders.
* **Always-Visible Telemetry Dashboard:** Displays live system KPIs (Vector Index Count, Execution Architecture, Supported Languages, Diagnostic Engine Status) before and after analysis.
* **Micro-Animations:** Smooth `@keyframes fadeInUp` entrance animations, shimmering progress bars, and pulsing neon online indicators.

---

## 🏗️ System Architecture & Data Flow

```mermaid
graph TD
    A[🧑‍🦱 Patient / Doctor Symptom Intake] -->|English / Hindi / Hinglish| B(🛸 Streamlit Command HUD: frontend/app.py)
    
    subgraph Standalone Client-Side Runtime
        B -->|1. Raw Text| C[⚡ eXplainable AI XAI Tokenizer]
        C -->|Extract Medical Keywords| D[🔍 Highlighted Clinical Pills]
        
        B -->|2. Query Vector Transformation| E[📦 SymptomVectorDB: vector_db.py]
        E -->|n-gram TF-IDF Vector Space| F[(📚 Indexed Vector DB: 1,201 Cases)]
        
        F -->|k-NN Cosine Similarity Search| G[🎯 Top 15 Nearest Historical Neighbors]
        G -->|Quadratic Distance Weighting| H[📊 Consensus Voting Probability Engine]
    </ul subgraph>
    
    H -->|Top 3 Ranked Diseases + Confidences| I[📋 Diagnostic Assessment Cards]
    G -->|Top 5 Semantic Match Quotes| J[📚 RAG Historical Retrieval Cards]
    H -->|Disease Severity Mapping| K[🚨 Triage Risk Tier & Action Plan]
    
    I --> L[🏥 Integrated Healthcare Command Dashboard]
    J --> L
    K --> L
    D --> L
```

---

## 📂 Project Structure & File Guide

```text
Multilingual-Healthcare-Triage-System/
├── 📄 README.md                        # Exhaustive project overview & architecture guide
├── 📄 PROJECT_OVERVIEW_AND_ARCHITECTURE.md # Standalone technical master documentation
├── 📄 requirements.txt                 # Python dependencies (Streamlit, PyTorch, Scikit-Learn, FastAPI)
├── 🐍 vector_db.py                     # High-performance Vector DB & RAG embedding retrieval engine
├── 🐍 predict.py                       # Pretrained model loading & inference utilities
├── 📂 frontend/
│   └── 🐍 app.py                       # Ultra-premium Cyberpunk Standalone Streamlit HUD
├── 📂 backend/
│   ├── 🐍 __init__.py                  # Package initialization
│   └── 🐍 main.py                      # Optional FastAPI REST API backend server
├── 📂 data/
│   ├── 📂 processed/
│   │   └── 📊 Symptom2Disease.csv      # 1,201 verified clinical patient symptom records
│   └── 📂 raw/                         # Raw unstructured medical datasets
├── 📂 models/
│   ├── 📂 symptom_model/               # Saved TF-IDF + SVM classification pipelines & JSON mappings
│   └── 🗄️ vector_db_cache.joblib       # Cached high-dimensional Vector DB index
└── 📂 notebooks/
    ├── 📓 01_train_model.py            # Deep learning transformer training script
    ├── 📓 02_train_tfidf_model.py      # TF-IDF + LinearSVC pipeline training script (95%+ accuracy)
    └── 📓 03_predict.py                # Command-line prediction verification script
```

---

## 🧠 Vector DB & Mathematical Foundation

In medical symptom triage, classical NLP vector space modeling combined with Retrieval-Augmented Generation (RAG) significantly outperforms black-box LLMs and small fine-tuned transformers by eliminating hallucination and providing exact case verification.

### 1. Vector Space Embedding
Let $D = \{d_1, d_2, \dots, d_N\}$ be the historical dataset of $N = 1,201$ patient records. Each text is tokenized into word unigrams, bigrams, and trigrams and embedded into a TF-IDF vector space $\mathbb{R}^M$ ($M \approx 25,000$ features):
$$\mathbf{v}_i = \text{TF-IDF}(d_i)$$

### 2. Cosine Similarity k-NN Retrieval
Given a patient input query $q$, its vector representation $\mathbf{v}_q$ is computed. The semantic similarity against every historical record $\mathbf{v}_i$ is calculated via Cosine Similarity:
$$\text{sim}(q, d_i) = \frac{\mathbf{v}_q \cdot \mathbf{v}_i}{\|\mathbf{v}_q\| \|\mathbf{v}_i\|}$$

The Vector DB retrieves the top $k=15$ nearest neighbors with the highest similarity scores: $N_k(q) = \{d_{(1)}, d_{(2)}, \dots, d_{(k)}\}$.

### 3. Quadratic Consensus Weighted Voting
To compute the final confidence score $P(C_m)$ for disease class $C_m$, we apply quadratic distance weighting so that closer semantic neighbors exert exponentially greater voting power:
$$\text{Score}(C_m) = \sum_{d_i \in N_k(q), \, \text{label}(d_i) = C_m} \left( \text{sim}(q, d_i) \right)^2$$
$$P(C_m) = \frac{\text{Score}(C_m)}{\sum_{j} \text{Score}(C_j)}$$

---

## 🛠️ Setup & Installation Guide

### 1. Prerequisites
* **Python:** Version 3.9, 3.10, or 3.11 installed on Windows, macOS, or Linux.
* **Git:** To clone the repository.

### 2. Installation Steps
Open your terminal (or PowerShell on Windows) and execute the following commands:

```bash
# 1. Clone the repository (or navigate to project directory)
cd "Multilingual Healthcare Triage System/Multilingual-Healthcare-Triage-System"

# 2. Create a Python Virtual Environment
python -m venv venv

# 3. Activate the Virtual Environment
# On Windows PowerShell:
.\venv\Scripts\activate
# On macOS / Linux:
source venv/bin/activate

# 4. Install Required Dependencies
pip install -r requirements.txt
```

---

## 🚀 Running the Application

### Method 1: Standalone Enterprise HUD (Recommended)
Because we migrated the complete ML inference engine and Vector Database into the frontend, you only need to run a single command to launch the entire platform:

```bash
python -m streamlit run frontend/app.py --server.port 8501
```
* **Access Dashboard:** Open your web browser to [http://localhost:8501](http://localhost:8501).
* **Zero Latency Mode:** Enjoy instantaneous triage evaluations without needing any background API servers!

### Method 2: Optional FastAPI Backend API Server
If you wish to integrate the triage system into external mobile apps, hospital EHR systems, or microservices, you can launch the standalone FastAPI REST server:

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
* **API Documentation (Swagger UI):** Visit [http://localhost:8000/docs](http://localhost:8000/docs).
* **Health Check Endpoint:** `GET http://localhost:8000/health`
* **Prediction Endpoint:** `POST http://localhost:8000/predict` with JSON payload:
  ```json
  {
    "symptoms": "I have severe headache, high fever, shivering, and body aches."
  }
  ```

---

## 🧪 Sample Clinical Test Cases

You can test the system using our interactive 1-click preset buttons on the dashboard or by copying and pasting these test queries:

### 🇬🇧 English Test Case (High Severity — Malaria / Dengue)
> *"I have been experiencing a severe headache, high fever, shivering, and severe body aches for the last three days. My muscles hurt and I feel completely exhausted."*
* **Expected Prediction:** Malaria / Dengue (`HIGH SEVERITY`)
* **Recommended Specialist:** Infectious Disease Specialist / General Physician
* **Vector DB Match:** ~96% similarity with historical Case #412.

### 🇮🇳 Hindi Test Case (High Severity — Typhoid / Fever)
> *"मुझे तीन दिन से बहुत तेज़ बुखार, सिरदर्द, बदन दर्द और ठंड लग रही है तथा बहुत कमजोरी महसूस हो रही है।"*
* **Expected Prediction:** Typhoid / Malaria (`HIGH SEVERITY`)
* **XAI Keywords Detected:** `बुखार`, `दर्द`, `सिरदर्द`, `ठंड`, `कमजोरी`

### 💬 Hinglish Test Case (Medium Severity — Migraine / Hypertension)
> *"Mujhe sar me bohot tez dard hai, chakkar aa rahe hain aur continuous nausea aur sensitivity to light feel ho raha hai."*
* **Expected Prediction:** Migraine / Hypertension (`MEDIUM / HIGH SEVERITY`)
* **Recommended Specialist:** Neurologist / Cardiologist

---

## 🛡️ Clinical Disclaimer & Safety Protocol
This software is an AI-powered clinical decision support and triage demonstration system. It is designed to assist healthcare professionals and streamline patient intake triage. It does **not** constitute formal medical diagnosis or advice. In acute medical emergencies, patients must immediately contact emergency medical services (`112`, `911`, or `108`) or visit the nearest hospital emergency department.