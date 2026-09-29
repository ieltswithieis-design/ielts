import json
import re

# Load master strings
with open("scripts/master_strings_to_translate.json", "r", encoding="utf-8") as f:
    master_strings = json.load(f)

print(f"Read {len(master_strings)} strings.")
