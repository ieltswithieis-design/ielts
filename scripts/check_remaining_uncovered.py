import json
from translations_examiner import EXAMINER_PHRASES
from translations_blog_lexical import BLOG_LEXICAL_PHRASES
from translations_descriptors import DESCRIPTOR_PHRASES
from translations_trf_iq import TRF_IQ_PHRASES
from translations_director_creator import DIRECTOR_CREATOR_PHRASES
from translations_tests_nav import TESTS_NAV_PHRASES
from translations_trf_additional import TRF_ADDITIONAL_PHRASES
from translations_model_blog import MODEL_BLOG_PHRASES

with open("scripts/clean_ui_phrases_to_translate.json", "r", encoding="utf-8") as f:
    clean_phrases = json.load(f)

all_dicts = {}
for d in [
    EXAMINER_PHRASES, BLOG_LEXICAL_PHRASES, DESCRIPTOR_PHRASES,
    TRF_IQ_PHRASES, DIRECTOR_CREATOR_PHRASES, TESTS_NAV_PHRASES,
    TRF_ADDITIONAL_PHRASES, MODEL_BLOG_PHRASES
]:
    for k, v in d.items():
        all_dicts[k.lower().strip()] = v

covered = []
uncovered = []

for p in clean_phrases:
    pl = p.lower().strip()
    if pl in all_dicts:
        covered.append(p)
    else:
        uncovered.append(p)

print(f"Total clean phrases: {len(clean_phrases)}")
print(f"Covered: {len(covered)}")
print(f"Uncovered: {len(uncovered)}")

with open("scripts/uncovered_clean_phrases_2.json", "w", encoding="utf-8") as f:
    json.dump(uncovered, f, indent=2, ensure_ascii=False)
