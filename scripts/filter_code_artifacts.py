import json
import re

with open("scripts/unique_incomplete_phrases.json", "r", encoding="utf-8") as f:
    phrases = json.load(f)

def is_code_artifact(s: str) -> bool:
    s = s.strip()
    if s.startswith(")") or s.startswith("(") or s.startswith("="):
        return True
    if "iframeDoc" in s or "outerHTML" in s:
        return True
    if re.search(r"(\?\s*\(|\:\s*\(|=>|\$\{|\}\s*\))", s):
        return True
    if re.search(r"\b(let|const|var|return|function|import|export)\b", s):
        return True
    if "passageQuestionRanges" in s:
        return True
    if len(s) < 2:
        return True
    return False

code_items = [p for p in phrases if is_code_artifact(p)]
ui_items = [p for p in phrases if not is_code_artifact(p)]

print(f"Total phrases: {len(phrases)}")
print(f"Code artifacts: {len(code_items)}")
print(f"Real UI strings: {len(ui_items)}")
print("\nCode items found:")
for c in code_items:
    print(repr(c))
