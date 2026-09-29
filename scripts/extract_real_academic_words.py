import json
import re

with open("scripts/missing_words.json", "r", encoding="utf-8") as f:
    items = json.load(f)

# Filter out CSS/HTML/JS tokens
css_js_tokens = {
    'text', 'slate', 'font', 'center', 'gap', 'white', 'images', 'com', 'https',
    'crop', 'fit', 'unsplash', 'bold', 'pos', 'title', 'blue', 'emerald', 'tfng',
    'hover', 'justify', 'shadow', 'amber', 'onclick', 'pointer', 'cursor', 'true',
    'false', 'null', 'undefined', 'div', 'span', 'class', 'classname', 'src', 'alt',
    'border', 'rounded', 'px', 'py', 'mx', 'my', 'w', 'h', 'min', 'max', 'flex',
    'grid', 'items', 'space', 'cols', 'rows', 'opacity', 'transition', 'duration',
    'svg', 'path', 'fill', 'stroke', 'viewbox', 'xmlns', 'http', 'href', 'button',
    'input', 'label', 'icon', 'lucide', 'react', 'id', 'key', 'type', 'value', 'name',
    'mcq', 'red', 'gray', 'black', 'green', 'yellow', 'indigo', 'purple', 'rose'
}

real_words = []
for word, count in items:
    word = word.lower().strip()
    if len(word) < 3:
        continue
    if word in css_js_tokens:
        continue
    if not re.match(r'^[a-z]+$', word):
        continue
    real_words.append((word, count))

print(f"Total candidate real words: {len(real_words)}")
print("Top 80 real academic words:", [w for w, c in real_words[:80]])
