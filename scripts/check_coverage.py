import json
import os

with open("scripts/unique_incomplete_phrases.json", "r", encoding="utf-8") as f:
    phrases = json.load(f)

with open("scripts/all_missing_words_in_audit.json", "r", encoding="utf-8") as f:
    missing_words = json.load(f)

print(f"Total phrases to translate: {len(phrases)}")
print(f"Total missing words: {len(missing_words)}")
