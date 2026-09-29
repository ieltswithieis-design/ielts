import fs from "fs";
import path from "path";

// Load incomplete phrases and missing words
const phrases: string[] = JSON.parse(fs.readFileSync("scripts/unique_incomplete_phrases.json", "utf8"));
const missingWords: string[] = JSON.parse(fs.readFileSync("scripts/all_missing_words_in_audit.json", "utf8"));

console.log(`Processing ${phrases.length} phrases and ${missingWords.length} words...`);
