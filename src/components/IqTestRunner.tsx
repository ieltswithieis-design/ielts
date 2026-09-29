import React, { useState, useEffect } from "react";
import { IQ_QUESTIONS, calculateIqResults } from "../data/iqQuestions";
import { IqScoreBreakdown, IqQuestion } from "../types/iq";
import { useLanguage } from "../context/LanguageContext";
import { IqDiagramRenderer } from "./IqDiagramRenderer";
import { 
  Clock, 
  Brain, 
  CheckCircle2, 
  XCircle, 
  Flag, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ShieldCheck,
  Zap,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IqTestRunnerProps {
  onBack: () => void;
  onOpenCertificate: (results: IqScoreBreakdown) => void;
}

export const IqTestRunner: React.FC<IqTestRunnerProps> = ({ onBack, onOpenCertificate }) => {
  const { currentLanguage, t, speak, stopSpeaking, isSpeaking } = useLanguage();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20 * 60); // 20 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [results, setResults] = useState<IqScoreBreakdown | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning, isSubmitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const toggleFlag = (questionId: number) => {
    setFlagged(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmit = () => {
    stopSpeaking();
    setShowSubmitModal(false);
    setIsTimerRunning(false);
    setIsSubmitted(true);
    const scoreData = calculateIqResults(answers);
    setResults(scoreData);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetake = () => {
    stopSpeaking();
    setAnswers({});
    setFlagged({});
    setSecondsRemaining(20 * 60);
    setIsTimerRunning(true);
    setIsSubmitted(false);
    setResults(null);
    setCurrentIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentQ: IqQuestion = IQ_QUESTIONS[currentIndex];
  const questionText = currentQ.question[currentLanguage] || currentQ.question.en;

  const handleReadCurrentQuestion = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const optionsText = currentQ.options
      .map((opt, i) => `${i + 1}: ${opt.text?.[currentLanguage] || opt.text?.en || ""}`)
      .join(". ");
    const fullText = `${t("question")} ${currentIndex + 1}. ${questionText}. ${optionsText}`;
    speak(fullText);
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = IQ_QUESTIONS.length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title={t("backToHub")}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-extrabold text-blue-800 uppercase tracking-wide">
                  <Brain className="h-3.5 w-3.5" />
                  {t("iqTestTitle")}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500">
                  {t("iqStandardScale")}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {t("iqTestSubtitle")}
              </h1>
            </div>
          </div>

          {/* Timer & Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-black transition ${
              secondsRemaining < 180 
                ? "border-red-300 bg-red-50 text-red-700 animate-pulse" 
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}>
              <Clock className="h-4 w-4 text-blue-600" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            {!isSubmitted && (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition cursor-pointer"
              >
                {t("submitTest")}
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span>
              {answeredCount} {t("ofTotal")} {totalCount} {t("statusCompleted").toLowerCase()}
            </span>
            <span>{Math.round((answeredCount / totalCount) * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${(answeredCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* If Submitted: Full Comprehensive Results & Certificate CTA */}
      {isSubmitted && results && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-blue-600/30 bg-gradient-to-b from-blue-50/50 to-white p-6 shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-blue-100 pb-6">
            <div className="text-center md:text-left space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                <Sparkles className="h-3.5 w-3.5" />
                {t("iqScoreResult")}
              </span>
              <div className="flex items-baseline gap-3 justify-center md:justify-start">
                <span className="text-5xl font-black text-slate-900 tracking-tight">
                  IQ {results.iqScore}
                </span>
                <span className="text-sm font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
                  {results.percentile}th {t("percentile")}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-700">
                {results.classification}
              </p>
              {results.isMensaLevel && (
                <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 border border-amber-300 px-2.5 py-1 text-xs font-extrabold text-amber-900 mt-1">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span>{t("iqMensaCandidate")}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onOpenCertificate(results)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-black text-white shadow-md hover:from-amber-600 hover:to-amber-700 active:scale-95 transition cursor-pointer"
              >
                <Award className="h-4 w-4" />
                <span>{t("iqClaimCertificate")}</span>
              </button>
              <button
                onClick={handleRetake}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t("iqRetakeTest")}</span>
              </button>
            </div>
          </div>

          {/* Subdomain Breakdown */}
          <div className="mt-6">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
              {t("cognitiveSubDomains", "Cognitive Sub-Domain Performance")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <div className="text-[11px] font-bold text-slate-500">{t("iqCategoryMatrix")}</div>
                <div className="text-lg font-black text-blue-600 mt-0.5">{results.subScores.matrix}%</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <div className="text-[11px] font-bold text-slate-500">{t("iqCategoryNumerical")}</div>
                <div className="text-lg font-black text-indigo-600 mt-0.5">{results.subScores.numerical}%</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <div className="text-[11px] font-bold text-slate-500">{t("iqCategorySpatial")}</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">{results.subScores.spatial}%</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <div className="text-[11px] font-bold text-slate-500">{t("iqCategoryVerbal")}</div>
                <div className="text-lg font-black text-amber-600 mt-0.5">{results.subScores.verbal}%</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center col-span-2 sm:col-span-1">
                <div className="text-[11px] font-bold text-slate-500">{t("iqCategoryLogic")}</div>
                <div className="text-lg font-black text-purple-600 mt-0.5">{results.subScores.logic}%</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Question Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-xs">
              {currentIndex + 1}
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              {currentQ.category.toUpperCase()} REASONING
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Read Button */}
            <button
              onClick={handleReadCurrentQuestion}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                isSpeaking
                  ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              title="Read Question Aloud (Voice)"
            >
              {isSpeaking ? <VolumeX className="h-3.5 w-3.5 text-amber-700" /> : <Volume2 className="h-3.5 w-3.5 text-blue-600" />}
              <span>{isSpeaking ? t("stopVoice") : t("voiceReader")}</span>
            </button>

            {!isSubmitted && (
              <button
                onClick={() => toggleFlag(currentQ.id)}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  flagged[currentQ.id]
                    ? "text-amber-500 bg-amber-50 border border-amber-200"
                    : "text-slate-300 hover:text-slate-500"
                }`}
                title={t("flagQuestion")}
              >
                <Flag className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed whitespace-pre-line mb-4">
          {questionText}
        </div>

        {/* Visual SVG Diagram if available */}
        {currentQ.svgDiagram && (
          <IqDiagramRenderer type={currentQ.svgDiagram} />
        )}

        {/* Options List */}
        <div className="space-y-3 mt-5">
          {currentQ.options.map((opt, oIdx) => {
            const isSelected = answers[currentQ.id] === oIdx;
            const isCorrect = currentQ.correctAnswer === oIdx;
            const text = opt.text?.[currentLanguage] || opt.text?.en || "";

            let borderClass = "border-slate-200 hover:border-slate-300 bg-white";
            if (isSubmitted) {
              if (isCorrect) {
                borderClass = "border-emerald-500 bg-emerald-50/50 text-emerald-950 font-bold";
              } else if (isSelected && !isCorrect) {
                borderClass = "border-rose-400 bg-rose-50/50 text-rose-950";
              }
            } else if (isSelected) {
              borderClass = "border-blue-600 bg-blue-50/70 shadow-xs";
            }

            return (
              <button
                key={oIdx}
                type="button"
                disabled={isSubmitted}
                onClick={() => handleSelectAnswer(currentQ.id, oIdx)}
                className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-left text-xs sm:text-sm font-medium transition cursor-pointer ${borderClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span className="leading-snug">{text}</span>
                </div>

                {isSubmitted && isCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Solution Explanation (If submitted) */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 text-xs"
          >
            <div className="flex items-center gap-1.5 font-extrabold text-emerald-900 mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{t("iqExplanation")}</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {currentQ.explanation[currentLanguage] || currentQ.explanation.en}
            </p>
          </motion.div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => {
              stopSpeaking();
              setCurrentIndex(prev => Math.max(0, prev - 1));
            }}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t("prevQuestion")}</span>
          </button>

          <span className="text-xs font-bold text-slate-400">
            {currentIndex + 1} / {totalCount}
          </span>

          <button
            type="button"
            disabled={currentIndex === totalCount - 1}
            onClick={() => {
              stopSpeaking();
              setCurrentIndex(prev => Math.min(totalCount - 1, prev + 1));
            }}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
          >
            <span>{t("nextQuestion")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Question Palette Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">
          {t("questionPalette", "Question Palette Navigator")}
        </div>
        <div className="flex flex-wrap gap-2">
          {IQ_QUESTIONS.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isFlag = flagged[q.id];
            const isCurrent = currentIndex === idx;

            let btnClass = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
            if (isSubmitted) {
              const isRight = answers[q.id] === q.correctAnswer;
              btnClass = isRight
                ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold"
                : "border-rose-300 bg-rose-50 text-rose-800";
            } else if (isCurrent) {
              btnClass = "border-blue-600 bg-blue-600 text-white font-bold ring-2 ring-blue-300";
            } else if (isAnswered) {
              btnClass = "border-blue-300 bg-blue-50 text-blue-900 font-semibold";
            } else if (isFlag) {
              btnClass = "border-amber-300 bg-amber-50 text-amber-900";
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  stopSpeaking();
                  setCurrentIndex(idx);
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs transition cursor-pointer ${btnClass}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t("confirmSubmitTitle", "Submit Test")}</h3>
                  <p className="text-xs text-slate-500">
                    {t("confirmSubmitDesc", "You have answered")} {answeredCount} {t("ofTotal")} {totalCount} {t("navGuide", "Questions").toLowerCase()}.
                  </p>
                </div>
              </div>

              {answeredCount < totalCount && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                  ⚠️ {t("unansweredWarning", "Note: unanswered questions will receive 0 points.")}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {t("continueTest", "Continue Test")}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
                >
                  {t("submitNow", "Submit & Score Now")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
