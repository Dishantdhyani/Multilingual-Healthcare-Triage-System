# Multilingual Healthcare Triage System

An AI-powered multilingual healthcare triage system designed to understand patient symptom descriptions in multiple languages (English, Hindi, Hinglish), assess condition severity, recommend medical specialties, and generate alerts for high-risk cases.

## Tech Stack & Architecture

- **Machine Learning & NLP**: Python, PyTorch, Hugging Face `transformers` (pretrained multilingual models like XLM-RoBERTa or mBERT).
- **Backend**: FastAPI (for building high-performance APIs).
- **Frontend**: Streamlit (for building interactive web interfaces rapidly).
- **Data Handling**: Pandas, NumPy, Scikit-learn.

## Project Structure

- `data/`: Contains raw and processed datasets.
- `notebooks/`: Jupyter notebooks for data exploration, model training, and evaluation.
- `backend/`: FastAPI application server.
- `frontend/`: Streamlit web application.
- `models/`: Saved model weights and tokenizers.

## Setup Instructions

1. Clone the repository.
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment.
4. Install dependencies: `pip install -r requirements.txt`