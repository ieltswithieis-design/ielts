import fs from "fs";

const rawSentences: string[] = JSON.parse(fs.readFileSync("scripts/ui_sentences.json", "utf8"));

const cleanPhrases = rawSentences.filter((s) => {
  if (!s || s.length < 2) return false;
  if (
    s.includes("useState") ||
    s.includes("useRef") ||
    s.includes("Record<") ||
    s.includes("=>") ||
    s.includes("const ") ||
    s.includes("let ") ||
    s.includes("import ")
  ) {
    return false;
  }
  if (
    s.startsWith("//") ||
    s.startsWith("/*") ||
    s.startsWith("{/*") ||
    s.startsWith(");") ||
    s.startsWith("0 &&") ||
    s.startsWith(") : (") ||
    s.includes("className=")
  ) {
    return false;
  }
  if (/^[\d\s.,;:!?()\-+*\/\\%#@&^|~`"'\${}\[\]<>]+$/.test(s)) return false;
  if (!/[a-zA-Z]/.test(s)) return false;
  return true;
}).map((s) => s.trim()).filter((s) => s.length > 1);

const unique = Array.from(new Set(cleanPhrases));
console.log("Filtered clean UI phrases count:", unique.length);
fs.writeFileSync("scripts/clean_ui_phrases.json", JSON.stringify(unique, null, 2));
