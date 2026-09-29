"""Audit the live standardized exam database for basic structural errors."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "database/tests/standardized_tests.json"
EXPECTED = {"pte": 200, "sat": 200, "gre": 200, "gmat": 200, "toefl": 200, "act": 200}
SINGLE = {"multiple-choice-single", "quantitative-comparison", "data-sufficiency", "select_missing_word", "highlight_correct_summary", "complete_words", "read_daily_life", "read_academic_passage", "listen_choose_response", "conversation", "announcement", "academic_talk", "audio-lecture-mcq"}
MULTI = {"multiple-choice-multiple", "sentence-equivalence", "mcq_multiple", "listening_mcq_multiple", "two-part-analysis", "rw_fill_blanks", "reading_fill_blanks"}

D = json.loads(DB.read_text(encoding="utf-8"))
errors = []
counts = {k: 0 for k in EXPECTED}

for pack in D.get("packages", []):
    exam = pack.get("examId")
    if exam not in counts:
        errors.append(f"Unknown exam: {exam}")
        continue
    counts[exam] += 1
    if not pack.get("sections"):
        errors.append(f"No sections: {pack.get('id')}")
        continue
    for sec in pack["sections"]:
        if not sec.get("questions"):
            errors.append(f"No questions: {pack.get('id')} / {sec.get('id')}")
        for q in sec.get("questions", []):
            for field in ("id", "type", "prompt", "correctAnswer", "explanation"):
                if field not in q:
                    errors.append(f"Missing {field}: {q.get('id')}")
            opts = q.get("options")
            ans = q.get("correctAnswer")
            if opts:
                answers = ans if isinstance(ans, list) else [ans]
                if any(a not in opts for a in answers if a not in (None, "")):
                    errors.append(f"Answer not in options: {q.get('id')}")
            if q.get("type") in SINGLE and not opts:
                errors.append(f"Single-choice task has no options: {q.get('id')}")
            if q.get("type") in MULTI and not opts and q.get("type") != "two-part-analysis":
                errors.append(f"Multi-choice task has no options: {q.get('id')}")

for exam, expected in EXPECTED.items():
    if counts[exam] != expected:
        errors.append(f"{exam}: expected {expected} packages, found {counts[exam]}")

# Learner-facing generated filler should never appear.
for pack in D["packages"]:
    for sec in pack["sections"]:
        for q in sec["questions"]:
            text = " ".join(str(q.get(k, "")) for k in ("prompt", "passage", "audioScript", "displayText"))
            for marker in ("unique item", "Original variant", "This is original Lingofi variant", "Context:", "Practice variation"):
                if marker in text:
                    errors.append(f"Generated filler remains: {q.get('id')}")
                    break

print("Package counts:", counts)
print("Total questions:", sum(len(s.get("questions", [])) for p in D["packages"] for s in p.get("sections", [])))
if errors:
    print("ERRORS:", len(errors))
    for e in errors[:100]: print("-", e)
    raise SystemExit(1)
print("AUDIT PASSED: no structural errors found.")
