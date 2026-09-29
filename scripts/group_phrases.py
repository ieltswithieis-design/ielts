import json

with open("scripts/unique_incomplete_phrases.json", "r", encoding="utf-8") as f:
    phrases = json.load(f)

print(f"Total phrases: {len(phrases)}")

# Group by keywords
groups = {
    "examiner_speaking": [],
    "lexical_vault_flashcards": [],
    "blog_stories": [],
    "band_descriptors_matrix": [],
    "security_certificate_trf": [],
    "director_creator_profile": [],
    "tests_listening_reading_writing": [],
    "iq_test": [],
    "youtube_and_navigation": [],
    "other": []
}

for p in phrases:
    pl = p.lower()
    if any(k in pl for k in ["examiner", "speaking", "transcript", "cue card", "recording"]):
        groups["examiner_speaking"].append(p)
    elif any(k in pl for k in ["lexical", "bento", "flashcard", "collocation", "vault", "c1", "c2"]):
        groups["lexical_vault_flashcards"].append(p)
    elif any(k in pl for k in ["story", "stories", "case studies", "masterclasses", "routine", "candidate journeys", "guide"]):
        groups["blog_stories"].append(p)
    elif any(k in pl for k in ["band", "descriptor", "cohesion", "coherence", "syntactic", "grammatical", "task achievement", "trap", "thesaurus"]):
        groups["band_descriptors_matrix"].append(p)
    elif any(k in pl for k in ["certificate", "trf", "cryptographic", "security", "pattern key", "bit-matching", "lingofi", "seal", "credentials"]):
        groups["security_certificate_trf"].append(p)
    elif any(k in pl for k in ["hamid", "director", "creator", "portrait", "campus", "iiui", "author", "rawalpindi", "pakistan"]):
        groups["director_creator_profile"].append(p)
    elif any(k in pl for k in ["listening", "reading", "writing", "passage", "task 1", "task 2", "monologue", "dialogue"]):
        groups["tests_listening_reading_writing"].append(p)
    elif any(k in pl for k in ["iq", "mensa", "cognitive", "matrix", "wechsler"]):
        groups["iq_test"].append(p)
    elif any(k in pl for k in ["youtube", "search", "menu", "toggle", "esc", "navigation"]):
        groups["youtube_and_navigation"].append(p)
    else:
        groups["other"].append(p)

for g, items in groups.items():
    print(f"Group {g}: {len(items)}")
