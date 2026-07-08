import os
import pandas as pd
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class SymptomVectorDB:
    """
    Vector Database for symptom embeddings and semantic similarity search.
    Indexes historical patient symptom descriptions from Symptom2Disease.csv.
    """
    def __init__(self, data_path, cache_path=None):
        self.data_path = data_path
        self.cache_path = cache_path
        self.vectorizer = None
        self.embeddings = None
        self.metadata = None
        
    def init_db(self):
        if self.cache_path and os.path.exists(self.cache_path):
            try:
                data = joblib.load(self.cache_path)
                self.vectorizer = data["vectorizer"]
                self.embeddings = data["embeddings"]
                self.metadata = data["metadata"]
                print(f"Loaded Vector DB from cache ({len(self.metadata)} records)")
                return
            except Exception as e:
                print(f"Cache load failed: {e}. Rebuilding Vector DB...")
                
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Dataset not found at {self.data_path}")
            
        df = pd.read_csv(self.data_path)
        if "Unnamed: 0" in df.columns:
            df = df.drop(columns=["Unnamed: 0"])
            
        self.metadata = df.to_dict(orient="records")
        texts = [row["text"] for row in self.metadata]
        
        # Build n-gram vector space embedding index (unigrams, bigrams, trigrams)
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),
            max_features=25000,
            sublinear_tf=True,
            strip_accents="unicode"
        )
        self.embeddings = self.vectorizer.fit_transform(texts)
        print(f"Indexed {len(self.metadata)} records into Vector DB ({self.embeddings.shape[1]} vector dimensions)")
        
        if self.cache_path:
            os.makedirs(os.path.dirname(self.cache_path), exist_ok=True)
            joblib.dump({
                "vectorizer": self.vectorizer,
                "embeddings": self.embeddings,
                "metadata": self.metadata
            }, self.cache_path)
            
    def search(self, query_text, top_k=5):
        """
        Perform vector similarity search (k-NN retrieval) over indexed symptom embeddings.
        """
        if self.vectorizer is None or self.embeddings is None:
            self.init_db()
            
        query_vec = self.vectorizer.transform([query_text])
        similarities = cosine_similarity(query_vec, self.embeddings).flatten()
        
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            results.append({
                "case_id": int(idx),
                "disease": self.metadata[idx]["label"],
                "matched_symptom": self.metadata[idx]["text"],
                "similarity": float(similarities[idx])
            })
        return results
        
    def predict_consensus(self, query_text, top_k=15):
        """
        Predict condition by computing consensus weighted voting over top vector neighbors.
        """
        results = self.search(query_text, top_k=top_k)
        scores = {}
        for r in results:
            dis = r["disease"]
            # Quadratic weighting so closer semantic neighbors have significantly higher voting power
            scores[dis] = scores.get(dis, 0.0) + (r["similarity"] ** 2)
            
        total_score = sum(scores.values()) if sum(scores.values()) > 0 else 1.0
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        predictions = []
        for dis, score in ranked[:3]:
            top_sim = max([r["similarity"] for r in results if r["disease"] == dis], default=0.0)
            predictions.append({
                "disease": dis,
                "confidence": min(1.0, float(score / total_score)),
                "top_match_similarity": float(top_sim)
            })
        return predictions, results
