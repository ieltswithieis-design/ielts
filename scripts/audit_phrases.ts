import fs from "fs";
import { translateTextToLanguage } from "../src/utils/universalTranslator";

const phrases: string[] = JSON.parse(fs.readFileSync("scripts/clean_ui_phrases.json", "utf8"));
const langs = ["ur", "ar", "zh", "es", "fr", "de", "hi", "pt", "ru", "ja", "bn"] as const;
const allowedProperNouns = new Set([
  "vocabino", "ielts", "iiui", "trf", "iq", "qr", "idp", "british", "council",
  "hamid", "ali", "islamabad", "rawalpindi", "pakistan", "jpg", "png", "c1", "c2", "b1", "b2"
]);

const results: Record<string, { total: number; incomplete: number; incompleteList: { phrase: string; translated: string; missingWords: string[] }[] }> = {};

for (const lang of langs) {
  results[lang] = { total: phrases.length, incomplete: 0, incompleteList: [] };
  for (const phrase of phrases) {
    const translated = translateTextToLanguage(phrase, lang);
    const words = (translated.match(/\b[a-zA-Z]{3,}\b/g) || [])
      .filter((w) => !allowedProperNouns.has(w.toLowerCase()));

    // For non-Latin languages, any English words (except allowed proper nouns) means incomplete
    if (["ur", "ar", "zh", "hi", "ru", "ja", "bn"].includes(lang)) {
      if (words.length > 0) {
        results[lang].incomplete++;
        results[lang].incompleteList.push({
          phrase,
          translated,
          missingWords: words,
        });
      }
    } else {
      // For Latin languages (es, fr, de, pt), check if translation is identical to English input
      if (translated.toLowerCase() === phrase.toLowerCase() && /[a-zA-Z]{4,}/.test(phrase)) {
        results[lang].incomplete++;
        results[lang].incompleteList.push({
          phrase,
          translated,
          missingWords: [phrase],
        });
      }
    }
  }
  console.log(`[${lang}] Incomplete: ${results[lang].incomplete} / ${phrases.length} (${((results[lang].incomplete / phrases.length) * 100).toFixed(1)}%)`);
}

fs.writeFileSync("scripts/translation_audit.json", JSON.stringify(results, null, 2));
