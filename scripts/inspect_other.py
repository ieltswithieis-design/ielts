import json

with open("scripts/unique_incomplete_phrases.json", "r", encoding="utf-8") as f:
    phrases = json.load(f)

# Filter those that were in other
keywords = ["examiner", "speaking", "transcript", "cue card", "recording",
    "lexical", "bento", "flashcard", "collocation", "vault", "c1", "c2",
    "story", "stories", "case studies", "masterclasses", "routine", "candidate journeys", "guide",
    "band", "descriptor", "cohesion", "coherence", "syntactic", "grammatical", "task achievement", "trap", "thesaurus",
    "certificate", "trf", "cryptographic", "security", "pattern key", "bit-matching", "lingofi", "seal", "credentials",
    "hamid", "director", "creator", "portrait", "campus", "iiui", "author", "rawalpindi", "pakistan",
    "listening", "reading", "writing", "passage", "task 1", "task 2", "monologue", "dialogue",
    "iq", "mensa", "cognitive", "matrix", "wechsler",
    "youtube", "search", "menu", "toggle", "esc", "navigation"
]

other = [p for p in phrases if not any(k in p.lower() for k in keywords)]
print(f"Count of other: {len(other)}")
for idx, o in enumerate(other[:50]):
    print(f"{idx+1}: {repr(o)}")
