import React from "react";
import { fullIeltsTests } from "../data/fullTestsData";
import { FullIeltsTest } from "../types/ielts";
import { ProgressState } from "../utils/storage";
import { useLanguage } from "../context/LanguageContext";
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Award, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from "lucide-react";

interface FullTestListViewProps {
  progress: ProgressState;
  tests?: FullIeltsTest[];
  onSelectFullTest: (test: FullIeltsTest) => void;
  onOpenCertificate: () => void;
}

export const FullTestListView: React.FC<FullTestListViewProps> = ({
  progress,
  tests = fullIeltsTests,
  onSelectFullTest,
  onOpenCertificate,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-[#002d62] via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-0.5 text-xs font-black text-white uppercase tracking-wider">
                {t("examSimulationBadge")}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {t("practiceTestsRange")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t("fullMockBannerTitle")}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t("fullMockBannerDesc")}
            </p>
          </div>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-black text-white hover:bg-red-700 transition shadow-md shrink-0 cursor-pointer"
          >
            <Award className="h-4 w-4" />
            {t("viewOfficialTrf")}
          </button>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Test Grid (20 Tests) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tests.map((test) => {
          // Check completed sections for this test ID
          const isReadingDone = !!progress.attempts[`reading_${test.readingId}`];
          const isListeningDone = !!progress.attempts[`listening_${test.listeningId}`];
          const isWritingDone = !!progress.attempts[`writing_${test.writingId}`];
          const isSpeakingDone = !!progress.attempts[`speaking_${test.speakingId}`];

          const completedCount = [isReadingDone, isListeningDone, isWritingDone, isSpeakingDone].filter(Boolean).length;
          const isFullyComplete = completedCount === 4;

          return (
            <div
              key={test.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-400 hover:shadow-md group"
            >
              <div>
                {/* Header row with Test Number and Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-black text-[#002d62]">
                    TEST {test.id.toString().padStart(2, "0")}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {test.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {test.subTitle}
                </p>

                {/* 4 Skill Badges */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
                  <div className={`flex items-center gap-1.5 rounded-lg p-1.5 border ${
                    isListeningDone ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <Headphones className="h-3.5 w-3.5 text-cyan-600" />
                    <span>{t("navListening")} (40)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 rounded-lg p-1.5 border ${
                    isReadingDone ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                    <span>{t("navReading")} (40)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 rounded-lg p-1.5 border ${
                    isWritingDone ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <PenTool className="h-3.5 w-3.5 text-amber-700" />
                    <span>{t("navWriting")} (1 & 2)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 rounded-lg p-1.5 border ${
                    isSpeakingDone ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <Mic className="h-3.5 w-3.5 text-emerald-700" />
                    <span>{t("navSpeaking")} (1-3)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{test.estimatedTime}</span>
                  </div>
                  <span className="font-bold text-slate-700">
                    {completedCount} / 4 {t("statusCompleted")}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectFullTest(test)}
                className={`mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
                  isFullyComplete
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                    : "bg-[#002d62] text-white hover:bg-blue-900 shadow-xs"
                }`}
              >
                {isFullyComplete ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    {t("iqRetakeTest")}
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    {t("startPractice")}
                  </>
                )}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
