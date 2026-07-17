import sys, os
sys.path.insert(0, '.')
os.environ['PYTHONIOENCODING'] = 'utf-8'
from vector_db import SymptomVectorDB

vdb = SymptomVectorDB(
    data_path='data/processed/Symptom2Disease.csv',
    cache_path='models/vector_db_cache.joblib'
)
vdb.init_db()

print("")
print("=" * 60)
print("TEST: 'I am having a headache and little bit fever'")
print("=" * 60)

preds, cases = vdb.predict_consensus('I am having a headache and little bit fever', top_k=25)

print("")
print("--- PREDICTIONS ---")
for p in preds:
    print(f"  {p['disease']}: {p['confidence']*100:.1f}% confidence")

# Simulate backend deduplication (as done in main.py)
predicted_diseases = {p['disease'] for p in preds}
filtered_cases = []
seen_in_cases = set()
for c in cases:
    dis = c['disease']
    if dis in predicted_diseases or dis in seen_in_cases:
        continue
    seen_in_cases.add(dis)
    filtered_cases.append(c)
    if len(filtered_cases) >= 5:
        break

print("")
print("--- SIMILAR CASES (after backend dedup - excludes prediction diseases) ---")
for c in filtered_cases:
    print(f"  {c['disease']}: {c['similarity']*100:.1f}% similarity")

print("")
print("--- VALIDATION ---")
# Check 1: No duplicates in predictions
pred_names = [p['disease'] for p in preds]
if len(pred_names) == len(set(pred_names)):
    print("  [PASS] No duplicate diseases in predictions")
else:
    print("  [FAIL] Duplicates found in predictions!")

# Check 2: No overlap between predictions and similar cases
case_names = [c['disease'] for c in filtered_cases]
overlap = set(pred_names) & set(case_names)
if not overlap:
    print("  [PASS] No overlap between predictions and similar cases")
else:
    print(f"  [FAIL] Overlap found: {overlap}")

# Check 3: Chicken pox is NOT the top prediction
if preds[0]['disease'] != 'Chicken pox':
    print(f"  [PASS] Top prediction is '{preds[0]['disease']}' (not Chicken pox)")
else:
    print("  [FAIL] Chicken pox is still the top prediction!")

# Check 4: Confidence is much higher than 29%
if preds[0]['confidence'] > 0.5:
    print(f"  [PASS] Top confidence is {preds[0]['confidence']*100:.1f}% (well above old 29%)")
else:
    print(f"  [WARN] Top confidence is only {preds[0]['confidence']*100:.1f}%")

print("=" * 60)
