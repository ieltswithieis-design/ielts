import fs from "fs";
import path from "path";

// We will generate src/utils/allSectionsTranslations.ts
// containing ALL_SECTIONS_EXACT_PHRASES and ALL_SECTIONS_WORDS
// with complete entries in ur, ar, zh, es, fr, de, hi, pt, ru, ja, bn

const phrases: string[] = JSON.parse(fs.readFileSync("scripts/unique_incomplete_phrases.json", "utf8"));
console.log(`Loaded ${phrases.length} unique incomplete phrases.`);
