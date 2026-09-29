import fs from "fs";
import path from "path";
import { CORE_WORDS_DICT } from "../src/utils/multilingualCoreLexicon";
import { VOCABULARY_DICT } from "../src/utils/universalTranslator";

const compDir = path.join(process.cwd(), "src", "components");
const files = fs.readdirSync(compDir).filter((f) => f.endsWith(".tsx"));

const knownWords = new Set([
  ...Object.keys(CORE_WORDS_DICT).map((w) => w.toLowerCase()),
  ...Object.keys(VOCABULARY_DICT).map((w) => w.toLowerCase())
]);

const uiWordCounts = new Map<string, number>();
const uiSentences: string[] = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(compDir, file), "utf8");

  // JSX text nodes
  const matches = content.match(/>\s*([^<>{}]+?)\s*</g) || [];
  for (const m of matches) {
    const text = m.slice(1, -1).trim();
    if (text.length > 1 && !text.startsWith("//") && !text.startsWith("/*") && !text.includes("className")) {
      uiSentences.push(text);
      const words = text.match(/\b[a-zA-Z]{2,}\b/g) || [];
      for (const w of words) {
        const lower = w.toLowerCase();
        if (!knownWords.has(lower)) {
          uiWordCounts.set(lower, (uiWordCounts.get(lower) || 0) + 1);
        }
      }
    }
  }

  // Common UI attributes
  const attrMatches = content.match(/(title|placeholder|aria-label)="([^"]+)"/g) || [];
  for (const a of attrMatches) {
    const text = a.split("=")[1].replace(/"/g, "").trim();
    if (text.length > 1) {
      uiSentences.push(text);
      const words = text.match(/\b[a-zA-Z]{2,}\b/g) || [];
      for (const w of words) {
        const lower = w.toLowerCase();
        if (!knownWords.has(lower)) {
          uiWordCounts.set(lower, (uiWordCounts.get(lower) || 0) + 1);
        }
      }
    }
  }
}

const missingUiWords = Array.from(uiWordCounts.entries())
  .sort((a, b) => b[1] - a[1]);

console.log("Total unique missing words in UI components:", missingUiWords.length);
console.log("Total UI sentences collected:", uiSentences.length);

fs.writeFileSync("scripts/missing_ui_words.json", JSON.stringify(missingUiWords, null, 2));
fs.writeFileSync("scripts/ui_sentences.json", JSON.stringify(Array.from(new Set(uiSentences)), null, 2));
