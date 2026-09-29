import json

with open("scripts/uncovered_clean_phrases_3.json", "r", encoding="utf-8") as f:
    uncovered = json.load(f)

print(f"Remaining uncovered: {len(uncovered)}")
for i, p in enumerate(uncovered[:40]):
    print(f"{i+1}: {repr(p)}")
