import fs from "fs";
import path from "path";
import { CORE_WORDS_DICT } from "../src/utils/multilingualCoreLexicon";
import { VOCABULARY_DICT } from "../src/utils/universalTranslator";

function getFiles(dir: string): string[] {
  const subdirs = fs.readdirSync(dir);
  const files: string[] = [];
  for (const f of subdirs) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      files.push(...getFiles(full));
    } else if (full.endsWith(".tsx") || full.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = getFiles(path.join(process.cwd(), "src"));
const knownWords = new Set([
  ...Object.keys(CORE_WORDS_DICT).map((w) => w.toLowerCase()),
  ...Object.keys(VOCABULARY_DICT).map((w) => w.toLowerCase())
]);

const wordCounts = new Map<string, number>();

for (const file of allFiles) {
  if (
    file.includes("multilingual") ||
    file.includes("translations") ||
    file.includes("universalTranslator")
  ) {
    continue;
  }

  const content = fs.readFileSync(file, "utf8");
  const words = content.match(/\b[a-zA-Z]{2,}\b/g) || [];
  for (const w of words) {
    const lower = w.toLowerCase();
    // Filter out common code identifiers
    if (
      [
        "const", "let", "var", "function", "return", "import", "export", "from",
        "interface", "type", "string", "number", "boolean", "null", "undefined",
        "true", "false", "async", "await", "promise", "class", "this", "new",
        "react", "useeffect", "usestate", "usememo", "usecallback", "useref",
        "div", "span", "button", "input", "textarea", "svg", "path", "classname",
        "style", "props", "children", "key", "id", "ref", "index", "item", "items",
        "map", "filter", "reduce", "length", "push", "slice", "splice", "split",
        "join", "replace", "match", "test", "includes", "indexof", "settimeout",
        "cleartimeout", "setinterval", "clearinterval", "window", "document",
        "localstorage", "getelementbyid", "queryselector", "addeventlistener",
        "removeeventlistener", "customevent", "dispatchevent", "json", "parse",
        "stringify", "math", "floor", "ceil", "round", "random", "max", "min",
        "console", "log", "warn", "error", "lucide", "motion", "tailwind",
        "px", "rem", "em", "col", "row", "flex", "grid", "bg", "border", "rounded"
      ].includes(lower)
    ) {
      continue;
    }

    if (!knownWords.has(lower)) {
      wordCounts.set(lower, (wordCounts.get(lower) || 0) + 1);
    }
  }
}

const missingList = Array.from(wordCounts.entries())
  .sort((a, b) => b[1] - a[1])
  .filter(([word, count]) => count >= 1 && word.length > 2);

console.log("Total missing English words:", missingList.length);
fs.writeFileSync("scripts/missing_words.json", JSON.stringify(missingList, null, 2));
console.log("Top 100 missing words written to scripts/missing_words.json");
