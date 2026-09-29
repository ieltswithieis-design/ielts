import json

with open("scripts/uncovered_clean_phrases.json", "r", encoding="utf-8") as f:
    uncovered = json.load(f)

print(f"Total uncovered: {len(uncovered)}")

# Let's inspect the lengths and first 40 phrases
for i, p in enumerate(uncovered[:40]):
    print(f"{i+1}: {repr(p)}")
