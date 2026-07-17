import os
import pandas as pd
import numpy as np
import chromadb
from chromadb.utils import embedding_functions

class SymptomVectorDB:
    """
    Vector Database using ChromaDB and dense semantic embeddings (Sentence Transformers)
    for high-precision symptom similarity retrieval and RAG k-NN classification.
    """
    def __init__(self, data_path, cache_path=None):
        self.data_path = data_path
        self.cache_path = cache_path
        self.client = None
        self.collection = None
        self.metadata = None
        self.embedding_func = None
        
    def init_db(self):
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Dataset not found at {self.data_path}")
            
        df = pd.read_csv(self.data_path)
        if "Unnamed: 0" in df.columns:
            df = df.drop(columns=["Unnamed: 0"])
            
        self.metadata = df.to_dict(orient="records")
        
        # Initialize persistent storage directory for ChromaDB
        db_dir = os.path.join(os.path.dirname(self.cache_path or self.data_path), "chroma_db")
        os.makedirs(db_dir, exist_ok=True)
        
        # Initialize ChromaDB persistent client
        self.client = chromadb.PersistentClient(path=db_dir)
        
        # Use SentenceTransformer dense embedding model for deep semantic understanding
        self.embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        self.collection = self.client.get_or_create_collection(
            name="symptoms_semantic_rag",
            embedding_function=self.embedding_func,
            metadata={"hnsw:space": "cosine"}
        )
        
        # Check if index needs building or rebuilding
        if self.collection.count() != len(self.metadata):
            print(f"Indexing {len(self.metadata)} clinical cases into ChromaDB semantic space...")
            try:
                self.client.delete_collection("symptoms_semantic_rag")
                self.collection = self.client.create_collection(
                    name="symptoms_semantic_rag",
                    embedding_function=self.embedding_func,
                    metadata={"hnsw:space": "cosine"}
                )
            except Exception:
                pass
                
            documents = [row["text"] for row in self.metadata]
            ids = [str(i) for i in range(len(self.metadata))]
            metadatas = [{"label": row["label"], "case_id": i} for i, row in enumerate(self.metadata)]
            
            # Batch insertion into ChromaDB
            batch_size = 200
            for i in range(0, len(documents), batch_size):
                self.collection.add(
                    ids=ids[i:i+batch_size],
                    documents=documents[i:i+batch_size],
                    metadatas=metadatas[i:i+batch_size]
                )
            print(f"Successfully indexed {self.collection.count()} records into ChromaDB semantic space.")
        else:
            print(f"Loaded existing ChromaDB semantic index ({self.collection.count()} records).")
            
    def search(self, query_text, top_k=5):
        """
        Perform semantic vector similarity search (k-NN retrieval) using ChromaDB.
        """
        if self.collection is None:
            self.init_db()
            
        query_results = self.collection.query(
            query_texts=[query_text],
            n_results=min(top_k, self.collection.count())
        )
        
        results = []
        if not query_results["ids"] or not query_results["ids"][0]:
            return results
            
        ids_list = query_results["ids"][0]
        docs_list = query_results["documents"][0]
        metas_list = query_results["metadatas"][0]
        distances_list = query_results["distances"][0]
        
        for i in range(len(ids_list)):
            case_id = int(metas_list[i]["case_id"])
            disease = metas_list[i]["label"]
            matched_symptom = docs_list[i]
            # In ChromaDB with hnsw:space = "cosine", distance is (1 - cosine_similarity)
            sim = max(0.0, min(1.0, float(1.0 - distances_list[i])))
            results.append({
                "case_id": case_id,
                "disease": disease,
                "matched_symptom": matched_symptom,
                "similarity": sim
            })
        return results
        
    def predict_consensus(self, query_text, top_k=25):
        """
        Predict condition by computing consensus weighted voting over top vector neighbors.
        Uses quintic weighting with softmax normalization for sharper confidence separation.
        Returns deduplicated similar cases (best match per disease only).
        """
        results = self.search(query_text, top_k=top_k)
        scores = {}
        for r in results:
            dis = r["disease"]
            # Quintic weighting so closer semantic neighbors have significantly higher voting power
            scores[dis] = scores.get(dis, 0.0) + (r["similarity"] ** 5)
            
        # Softmax-style normalization for sharper confidence separation
        if scores:
            import math
            max_score = max(scores.values())
            exp_scores = {dis: math.exp(5.0 * (s - max_score)) for dis, s in scores.items()}
            total_exp = sum(exp_scores.values())
        else:
            exp_scores = {}
            total_exp = 1.0
            
        ranked = sorted(exp_scores.items(), key=lambda x: x[1], reverse=True)
        
        predictions = []
        seen_diseases = set()
        for dis, exp_s in ranked[:5]:  # scan top 5 to fill 3 unique slots
            if dis in seen_diseases:
                continue
            seen_diseases.add(dis)
            top_sim = max([r["similarity"] for r in results if r["disease"] == dis], default=0.0)
            predictions.append({
                "disease": dis,
                "confidence": min(1.0, float(exp_s / total_exp)),
                "top_match_similarity": float(top_sim)
            })
            if len(predictions) >= 3:
                break
        
        # Deduplicate similar cases: keep only the best (highest similarity) match per disease
        best_per_disease = {}
        for r in results:
            dis = r["disease"]
            if dis not in best_per_disease or r["similarity"] > best_per_disease[dis]["similarity"]:
                best_per_disease[dis] = r
        deduped_results = sorted(best_per_disease.values(), key=lambda x: x["similarity"], reverse=True)
        
        return predictions, deduped_results
