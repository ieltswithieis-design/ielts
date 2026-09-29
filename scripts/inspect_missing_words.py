import json

with open("scripts/missing_words.json", "r", encoding="utf-8") as f:
    missing_words = json.load(f)

print(f"Total missing words: {len(missing_words)}")
print("Sample first 30:", missing_words[:30])
print("Sample 30-60:", missing_words[30:60])
