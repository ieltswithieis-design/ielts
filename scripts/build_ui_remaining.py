import json
import os

# Helper to normalize key for dictionary lookup
def norm_key(s):
    return s.strip().lower()

# Master translation dictionary
D = {}

def add(en_phrase, es, fr, de, zh, ar, hi, pt, ru, ja, ur, bn):
    key = norm_key(en_phrase)
    D[key] = {
        "es": es,
        "fr": fr,
        "de": de,
        "zh": zh,
        "ar": ar,
        "hi": hi,
        "pt": pt,
        "ru": ru,
        "ja": ja,
        "ur": ur,
        "bn": bn
    }

print("Loading builder definitions...")
