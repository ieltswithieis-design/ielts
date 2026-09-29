# coding: utf-8
import json
import os

def norm(s):
    return s.strip().lower()

# Dictionary to hold the 371 translations
DATA = {}

def add(key, es, fr, de, zh, ar, hi, pt, ru, ja, ur, bn):
    DATA[norm(key)] = {
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

print("Script framework ready.")
