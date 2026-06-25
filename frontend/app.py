import streamlit as st
import requests

# Configure page
st.set_page_config(
    page_title="Healthcare Triage System",
    page_icon="🏥",
    layout="centered"
)

# Custom CSS for better aesthetics
st.markdown("""
<style>
    .stApp {
        max-width: 900px;
        margin: 0 auto;
    }
    .severity-high {
        color: #ff4b4b;
        font-weight: bold;
    }
    .severity-medium {
        color: #ffa421;
        font-weight: bold;
    }
    .severity-low {
        color: #21c354;
        font-weight: bold;
    }
    .prediction-card {
        padding: 1.5rem;
        border-radius: 10px;
        background-color: #f0f2f6;
        margin-bottom: 1rem;
        border-left: 5px solid #1f77b4;
    }
    [data-theme="dark"] .prediction-card {
        background-color: #262730;
    }
    .dev-step {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #4CAF50;
        margin-bottom: 15px;
    }
    [data-theme="dark"] .dev-step {
        background-color: #1e1e1e;
    }
</style>
""", unsafe_allow_html=True)

# Application Header
st.title("🏥 Multilingual Healthcare Triage System")

# Create tabs
tab1, tab2 = st.tabs(["🩺 Triage Tool", "👩‍💻 Backend Integration Guide"])

with tab1:
    st.markdown("Describe your symptoms below, and our AI will assess the potential conditions and their severity.")

    # Sidebar for Configuration
    st.sidebar.header("⚙️ Configuration")
    BACKEND_URL = st.sidebar.text_input(
        "Backend API URL", 
        value="http://localhost:8000/predict",
        help="Enter the URL where the FastAPI backend is running."
    )

    # Main Input Section
    symptoms_text = st.text_area("What are your symptoms?", height=150, placeholder="E.g., I have been experiencing a severe headache, high fever, and body aches for the last two days...")

    if st.button("Analyze Symptoms", type="primary"):
        if not symptoms_text.strip():
            st.warning("Please enter your symptoms before analyzing.")
        else:
            with st.spinner("Analyzing your symptoms..."):
                try:
                    payload = {"text": symptoms_text}
                    response = requests.post(BACKEND_URL, json=payload, timeout=10)
                    
                    if response.status_code == 200:
                        data = response.json()
                        predictions = data.get("predictions", [])
                        
                        if not predictions:
                            st.info("No health-related conditions detected or returned by the backend.")
                        else:
                            st.subheader("📋 Assessment Results")
                            
                            for i, pred in enumerate(predictions):
                                disease = pred.get("disease", "Unknown")
                                confidence = pred.get("confidence", 0.0)
                                severity = str(pred.get("severity", "")).upper()
                                
                                sev_class = "low"
                                if severity == "HIGH": sev_class = "high"
                                elif severity == "MEDIUM": sev_class = "medium"
                                
                                st.markdown(f"""
                                <div class="prediction-card">
                                    <h3>{disease}</h3>
                                    <p>Confidence: <strong>{confidence:.1%}</strong></p>
                                    <p>Severity: <span class="severity-{sev_class}">{severity}</span></p>
                                </div>
                                """, unsafe_allow_html=True)
                                
                    else:
                        st.error(f"Backend Error: Received status code {response.status_code}")
                        st.json(response.text)
                        
                except requests.exceptions.ConnectionError:
                    st.error(f"Failed to connect to the backend at {BACKEND_URL}.")
                    st.info("💡 Make sure the backend server is running and the URL in the sidebar is correct.")
                except Exception as e:
                    st.error(f"An unexpected error occurred: {str(e)}")

with tab2:
    st.markdown("""
    ## 👋 Hello Backend Developer!
    
    This guide will help you build the FastAPI backend that connects to this frontend UI. Your goal is to build an API that accepts symptoms, runs them through the existing AI model (see `predict.py` in the root folder), and returns the results.
    """)
    
    st.markdown('<div class="dev-step">', unsafe_allow_html=True)
    st.markdown("""
    ### 📌 Step 1: Install Dependencies
    Ensure you have the required backend libraries installed. In the terminal, run:
    ```bash
    pip install fastapi uvicorn pydantic torch transformers
    ```
    """)
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="dev-step">', unsafe_allow_html=True)
    st.markdown("""
    ### 📌 Step 2: Create `backend/main.py`
    Create a new folder named `backend` and a file named `main.py` inside it. This will be your FastAPI server.
    """)
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="dev-step">', unsafe_allow_html=True)
    st.markdown("""
    ### 📌 Step 3: Define the API Schema
    In `main.py`, use Pydantic to define what the frontend will send and receive. 
    
    **The frontend sends:**
    ```json
    { "text": "I have a headache and fever" }
    ```
    
    **So you need a Pydantic model like this:**
    ```python
    from pydantic import BaseModel
    
    class SymptomRequest(BaseModel):
        text: str
    ```
    """)
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="dev-step">', unsafe_allow_html=True)
    st.markdown("""
    ### 📌 Step 4: Create the `/predict` Endpoint
    You need to create a POST endpoint that matches the `BACKEND_URL` in the sidebar (default is `http://localhost:8000/predict`).
    
    The frontend strictly expects the response to look EXACTLY like this:
    ```json
    {
      "predictions": [
        {
          "disease": "Malaria",
          "confidence": 0.95,
          "severity": "HIGH"
        },
        {
          "disease": "Dengue",
          "confidence": 0.82,
          "severity": "HIGH"
        }
      ]
    }
    ```
    """)
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="dev-step">', unsafe_allow_html=True)
    st.markdown("""
    ### 📌 Step 5: Adapt the Existing `predict.py` Logic
    Look at the existing `predict.py` file in the root folder. You need to:
    1. Load the model from `models/symptom_model` when FastAPI starts up (use `@app.on_event("startup")` or FastAPI lifespan).
    2. Import the `HEALTH_REGEX` and `SEVERITY` mapping from `predict.py`.
    3. Inside your `/predict` endpoint, run the tokenizer and model on `request.text`.
    4. Format the top 3 results into the JSON structure shown in Step 4 and return it.
    """)
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="dev-step">', unsafe_allow_html=True)
    st.markdown("""
    ### 📌 Step 6: Run the Server
    To start the backend server, open a terminal and run:
    ```bash
    uvicorn backend.main:app --reload
    ```
    Once it's running, you can test it directly from the **Triage Tool** tab!
    """)
    st.markdown('</div>', unsafe_allow_html=True)
