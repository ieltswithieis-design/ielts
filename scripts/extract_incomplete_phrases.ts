import fs from "fs";

const audit = JSON.parse(fs.readFileSync("scripts/translation_audit.json", "utf8"));
const incompletePhrases = new Set<string>();

for (const lang of Object.keys(audit)) {
  for (const item of audit[lang].incompleteList) {
    incompletePhrases.add(item.phrase);
  }
}

console.log("Total unique incomplete phrases across all languages:", incompletePhrases.size);
fs.writeFileSync("scripts/unique_incomplete_phrases.json", JSON.stringify(Array.from(incompletePhrases), null, 2));
