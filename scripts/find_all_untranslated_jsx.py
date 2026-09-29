import os
import re
import subprocess
import json

# Extract text strings from TSX files
tsx_dir = "src"
jsx_text_pattern = re.compile(r'>\s*([^<{}>$\n][^<{}>$]*?)\s*<')
string_prop_pattern = re.compile(r'(?:title|placeholder|label|alt|aria-label)=["\']([^"\']+)["\']')

all_texts = set()

for root, dirs, files in os.walk(tsx_dir):
    for f in files:
        if f.endswith(".tsx") or (f.endswith(".ts") and not f.endswith(".d.ts") and "translations" not in root):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
                
                # Match JSX text
                for match in jsx_text_pattern.findall(content):
                    t = match.strip()
                    if t and len(t) > 1 and re.search(r'[a-zA-Z]', t):
                        # Filter out code, imports, variable names, class names
                        if not t.startswith("{") and not t.endswith("}") and not "className" in t:
                            all_texts.add(t)
                            
                # Match attributes
                for match in string_prop_pattern.findall(content):
                    t = match.strip()
                    if t and len(t) > 1 and re.search(r'[a-zA-Z]', t):
                        all_texts.add(t)

print(f"Extracted {len(all_texts)} distinct UI text candidates from src/.")

# Save to json
with open("scripts/extracted_all_ui_candidates.json", "w", encoding="utf-8") as out:
    json.dump(sorted(list(all_texts)), out, indent=2, ensure_ascii=False)
