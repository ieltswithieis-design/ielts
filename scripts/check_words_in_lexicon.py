import re

with open("src/utils/multilingualCoreLexicon.ts", "r", encoding="utf-8") as f:
    core_lexicon_content = f.read()

with open("src/utils/universalTranslator.ts", "r", encoding="utf-8") as f:
    universal_content = f.read()

# Let's see some words in core lexicon
test_words = ['empirical', 'transition', 'diagnostics', 'options', 'study', 'evidence', 'context', 'analytical', 'requires', 'indispensable', 'system', 'category', 'sample', 'laboratory', 'frameworks', 'systematic', 'achieve', 'weeks', 'complexity', 'discover', 'corroborates', 'prerequisite', 'beyond', 'analysis']

for w in test_words:
    in_core = f'"{w}":' in core_lexicon_content or f"'{w}':" in core_lexicon_content
    in_uni = f'"{w}":' in universal_content or f"'{w}':" in universal_content
    print(f"{w}: in_core={in_core}, in_uni={in_uni}")
