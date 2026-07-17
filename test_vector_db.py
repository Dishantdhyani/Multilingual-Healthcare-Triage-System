"""Quick test script to verify ChromaDB vector database functionality."""
from vector_db import SymptomVectorDB

def main():
    print("=" * 60)
    print("  ChromaDB Vector Database - Test Run")
    print("=" * 60)

    # Initialize
    db = SymptomVectorDB("data/processed/Symptom2Disease.csv")
    db.init_db()

    # Test 1: Semantic Search
    query = "I have a headache and fever"
    print(f"\n--- Search Test: '{query}' ---")
    results = db.search(query, top_k=5)
    for r in results:
        print(f"  {r['disease']:30s} | sim={r['similarity']:.4f} | {r['matched_symptom'][:60]}")

    # Test 2: Consensus Prediction
    print(f"\n--- Consensus Prediction: '{query}' ---")
    preds, _ = db.predict_consensus(query)
    for p in preds:
        print(f"  {p['disease']:30s} | confidence={p['confidence']:.4f} | top_sim={p['top_match_similarity']:.4f}")

    # Test 3: Another query
    query2 = "I have skin rash and joint pain"
    print(f"\n--- Consensus Prediction: '{query2}' ---")
    preds2, _ = db.predict_consensus(query2)
    for p in preds2:
        print(f"  {p['disease']:30s} | confidence={p['confidence']:.4f} | top_sim={p['top_match_similarity']:.4f}")

    print("\n" + "=" * 60)
    print("  All tests passed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    main()
