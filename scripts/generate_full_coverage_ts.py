import json
from part1 import PART1
from part2 import PART2
from part3 import PART3
from part4 import PART4
from extra_creator_phrases import EXTRA

merged = {}
merged.update(PART1)
merged.update(PART2)
merged.update(PART3)
merged.update(PART4)
merged.update(EXTRA)

print(f"Total phrases to write into TS: {len(merged)}")

lines = []
lines.append('import { SupportedLanguage } from "../../types/language";')
lines.append('')
lines.append('export const UI_REMAINING_FULL_COVERAGE_PHRASES: Record<string, Partial<Record<SupportedLanguage, string>>> = {')

# Sort keys for deterministic output
sorted_keys = sorted(merged.keys())
for key in sorted_keys:
    val = merged[key]
    key_escaped = json.dumps(key, ensure_ascii=False)
    val_json = json.dumps(val, ensure_ascii=False, indent=2)
    # indent each line of val_json
    val_indented = "\n".join("    " + l for l in val_json.split("\n"))
    lines.append(f'  {key_escaped}: {val_indented.strip()},')

lines.append('};')
lines.append('')

out_path = "src/utils/translations/uiRemainingFullCoveragePhrases.ts"
with open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Successfully wrote {out_path}")
