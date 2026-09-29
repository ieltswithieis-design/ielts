import React, { useState } from "react";
import { getReadingBand, getListeningBand, calculateOverallBand, getBandDescription } from "../utils/ieltsScoring";
import { Award, BookOpen, Headphones, PenTool, Mic, Calculator, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const FormatGuide: React.FC = () => {
  const { t } = useLanguage();
  const [readingRaw, setReadingRaw] = useState<number>(33);
  const [listeningRaw, setListeningRaw] = useState<number>(34);
  const [writingBand, setWritingBand] = useState<number>(7.0);
  const [speakingBand, setSpeakingBand] = useState<number>(7.5);

  const calcReadingBand = parseFloat(getReadingBand(readingRaw));
  const calcListeningBand = parseFloat(getListeningBand(listeningRaw));
  const overallBand = calculateOverallBand([calcReadingBand, calcListeningBand, writingBand, speakingBand]);

  const bandScale = [
    { band: "9.0", level: "Expert User", desc: "Has fully operational command: appropriate, accurate and fluent with complete understanding." },
    { band: "8.0", level: "Very Good User", desc: "Operational command with occasional unsystematic inaccuracies. Handles complex argument well." },
    { band: "7.0", level: "Good User", desc: "Operational command despite occasional inaccuracies. Generally handles complex language well." },
    { band: "6.0", level: "Competent User", desc: "Generally effective command despite some inaccuracies. Can use and understand fairly complex language." },
    { band: "5.0", level: "Modest User", desc: "Partial command; copes with overall meaning in most situations, though likely to make many mistakes." },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 uppercase tracking-wider">
          {t("instituteName", "Official IELTS Standards")}
        </span>
        <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
          {t("formatGuideTitle", "Format Specifications & Band Calculator")}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {t("formatGuideSubtitle", "Understand how each section is structured, how raw scores convert to 9-band ratings, and calculate your target overall score.")}
        </p>
      </div>

      {/* Interactive Band Calculator */}
      <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/40 via-white to-slate-50 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">{t("bandCalculatorTitle", "Overall Band Score Calculator")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Reading */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-blue-600" /> {t("navReading", "Reading")}
              </span>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-extrabold text-blue-800">
                Band {calcReadingBand.toFixed(1)}
              </span>
            </div>
            <label className="block text-[11px] text-slate-500">{t("correctAnswersOutOf40", "Correct answers (out of 40):")}</label>
            <input
              type="number"
              min="0"
              max="40"
              value={readingRaw}
              onChange={e => setReadingRaw(Math.min(40, Math.max(0, Number(e.target.value))))}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm font-bold text-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Listening */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Headphones className="h-4 w-4 text-cyan-600" /> {t("navListening", "Listening")}
              </span>
              <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-extrabold text-cyan-800">
                Band {calcListeningBand.toFixed(1)}
              </span>
            </div>
            <label className="block text-[11px] text-slate-500">{t("correctAnswersOutOf40", "Correct answers (out of 40):")}</label>
            <input
              type="number"
              min="0"
              max="40"
              value={listeningRaw}
              onChange={e => setListeningRaw(Math.min(40, Math.max(0, Number(e.target.value))))}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm font-bold text-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Writing */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <PenTool className="h-4 w-4 text-amber-600" /> {t("navWriting", "Writing")}
              </span>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-extrabold text-amber-800">
                Band {writingBand.toFixed(1)}
              </span>
            </div>
            <label className="block text-[11px] text-slate-500">{t("targetWritingBand", "Target Writing Band:")}</label>
            <select
              value={writingBand}
              onChange={e => setWritingBand(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm font-bold text-slate-900 focus:outline-hidden bg-white"
            >
              {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(b => (
                <option key={b} value={b}>Band {b.toFixed(1)}</option>
              ))}
            </select>
          </div>

          {/* Speaking */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mic className="h-4 w-4 text-emerald-600" /> {t("navSpeaking", "Speaking")}
              </span>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-800">
                Band {speakingBand.toFixed(1)}
              </span>
            </div>
            <label className="block text-[11px] text-slate-500">{t("targetSpeakingBand", "Target Speaking Band:")}</label>
            <select
              value={speakingBand}
              onChange={e => setSpeakingBand(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm font-bold text-slate-900 focus:outline-hidden bg-white"
            >
              {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(b => (
                <option key={b} value={b}>Band {b.toFixed(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Total Overall Band display */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between rounded-xl bg-slate-900 p-5 text-white gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              {t("overallBandResult", "Calculated Overall IELTS Band")}
            </span>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-4xl font-black text-white">Band {overallBand}</span>
              <span className="text-sm font-semibold text-blue-300">
                {getBandDescription(overallBand).split(":")[0]}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            IELTS calculates the average of all four components rounded to the nearest half band (.25 rounds up to .5; .75 rounds up to the next whole band).
          </p>
        </div>
      </section>

      {/* 4 Section Structures */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Reading Spec */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">{t("navReading", "Academic Reading")} Format</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>3 Authentic Passages:</strong> Total of 2,150–2,750 words taken from journals, books, and magazines.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>40 Questions:</strong> Multiple choice, True/False/Not Given, Yes/No/Not Given, Matching headings, Sentence completion.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>60 Minutes:</strong> No extra transfer time is allowed in computer-delivered IELTS.</span>
            </li>
          </ul>
        </div>

        {/* Listening Spec */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-cyan-600" />
            <h3 className="font-bold text-slate-900">{t("navListening", "Listening")} Format</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>4 Parts:</strong> Part 1 (social dialogue), Part 2 (social monologue), Part 3 (academic discussion), Part 4 (academic lecture).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>40 Questions:</strong> 10 questions per part with multiple accents (British, Australian, American).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>~30 Minutes:</strong> Plus 2 minutes checking time at the end.</span>
            </li>
          </ul>
        </div>

        {/* Writing Spec */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-amber-600" />
            <h3 className="font-bold text-slate-900">{t("navWriting", "Academic Writing")} Format</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Task 1 (at least 150 words, ~20 mins):</strong> Describe, summarise, or explain visual data (graphs, tables, charts, diagrams).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Task 2 (at least 250 words, ~40 mins):</strong> Write an essay in response to a point of view, argument, or problem. Worth twice as much as Task 1.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Assessment:</strong> Task Achievement/Response (25%), Coherence & Cohesion (25%), Lexical Resource (25%), Grammatical Range & Accuracy (25%).</span>
            </li>
          </ul>
        </div>

        {/* Speaking Spec */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900">{t("navSpeaking", "Speaking")} Format</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Part 1 (4–5 mins):</strong> General interview on familiar topics.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Part 2 (3–4 mins):</strong> Individual long turn with cue card. 1 minute prep + up to 2 minutes speaking.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Part 3 (4–5 mins):</strong> Two-way discussion on abstract issues connected to Part 2.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Official Band Descriptors */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">{t("bandScaleTitle", "IELTS 9-Band Scale Overview")}</h3>
        <div className="space-y-3">
          {bandScale.map(item => (
            <div key={item.band} className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
              <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-md bg-blue-50 font-black text-sm text-blue-700">
                {item.band}
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm">{item.level}</span>
                <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
