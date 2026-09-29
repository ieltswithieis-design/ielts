import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TestSection } from "../types/ielts";
import { stopAllActiveMedia } from "../utils/audioControl";
import { LingofiLogo } from "./LingofiLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  BookOpen, Headphones, PenTool, Mic, LayoutDashboard, Award, CheckCircle2, RotateCcw,
  FileCheck, ShieldCheck, Sparkles, Layers, Search, Menu, X, ArrowLeft, GraduationCap,
  ExternalLink, ChevronRight, Youtube, Newspaper, Flame, Brain, Globe2, Database, User, LogIn
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export type NavTab =
  | "dashboard" | TestSection | "guide" | "certificate" | "fulltests" | "verify" | "blog"
  | "videos" | "iqtest" | "iqcert" | "international-exams" | "pte" | "sat" | "gre"
  | "gmat" | "toefl" | "act" | "database-studio" | "director-leads";

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  completedCount: number;
  totalTests: number;
  fullMockCount?: number;
  sectionCounts?: { reading: number; listening: number; writing: number; speaking: number };
  onResetProgress: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab, onSelectTab, completedCount, totalTests, fullMockCount = 0, sectionCounts = { reading: 0, listening: 0, writing: 0, speaking: 0 }, onResetProgress, onBack, canGoBack = false,
}) => {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const percent = Math.round((completedCount / totalTests) * 100) || 0;

  const handleNavClick = (tab: NavTab) => {
    stopAllActiveMedia();
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  const examTabs: { id: NavTab; label: string }[] = [
    { id: "fulltests", label: "IELTS" },
    { id: "pte", label: "PTE" },
    { id: "gre", label: "GRE" },
    { id: "gmat", label: "GMAT" },
    { id: "toefl", label: "TOEFL" },
    { id: "sat", label: "SAT" },
    { id: "act", label: "ACT" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#01cfe1]/20 bg-[#06182a]/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.22)]">
      <div className="w-full px-3 py-2.5 sm:px-5">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Persistent brand */}
          <button
            type="button"
            onClick={() => handleNavClick("dashboard")}
            className="shrink-0 rounded-xl p-0.5 hover:bg-white/5 transition cursor-pointer"
            aria-label="Go to IELTS home"
          >
            <LingofiLogo size="sm" variant="white" />
          </button>

          {/* Persistent exam-type navigation */}
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-none" aria-label="Test types">
            {examTabs.map((exam) => {
              const active = exam.id === "fulltests"
                ? ["reading", "listening", "writing", "speaking", "fulltests", "guide"].includes(currentTab)
                : currentTab === exam.id;
              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => handleNavClick(exam.id)}
                  className={`shrink-0 rounded-lg px-2.5 py-2 text-[10px] sm:text-xs font-black tracking-wide transition-all cursor-pointer ${
                    active
                      ? "bg-[#01cfe1] text-[#06182a] shadow-[0_3px_12px_rgba(1,207,225,0.28)]"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {exam.label}
                </button>
              );
            })}
          </nav>

          {/* Persistent controls */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher compact variant="dark" />

            {canGoBack && onBack && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onBack}
                aria-label="Go back"
                title={t("backToHub", "Back")}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 text-xs font-black text-blue-200 hover:bg-blue-500/20 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden md:inline">Back</span>
              </motion.button>
            )}

            {/* Menu Hub */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open Menu Hub"
            className="relative group rounded-full p-[1.5px] bg-gradient-to-r from-cyan-500 via-blue-600 to-slate-900 shadow-lg transition-all cursor-pointer"
          >
            <div className={`relative flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-black transition-colors ${
              isMobileMenuOpen ? "bg-slate-950 text-white" : "bg-slate-900 text-white group-hover:bg-slate-800"
            }`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300" />
              </span>
              <div className="flex flex-col justify-center items-center gap-0.5 w-4 h-3">
                <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? "w-4 rotate-45 translate-y-0.5" : "w-4"}`} />
                <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? "w-4 -rotate-45 -translate-y-0.5" : "w-4"}`} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-200">
                {isMobileMenuOpen ? t("closeHub", "Close Hub") : t("menuHub", "Menu Hub")}
              </span>
              <span className="rounded-full bg-cyan-400/15 px-1.5 py-0.5 text-[8px] font-extrabold text-cyan-200 border border-cyan-400/30">{fullMockCount} Mocks</span>
            </div>
          </motion.button>

          {/* Login / Sign Up: the only account control retained */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-white">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#01cfe1] text-[10px] font-black text-[#0a2540]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-black max-w-[120px] truncate">Lingofi</span>
              <button onClick={logout} className="text-[10px] text-slate-300 hover:text-rose-400 font-bold cursor-pointer">Out</button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-1.5 rounded-xl bg-[#01cfe1] hover:bg-[#00bed0] text-[#0a2540] font-black px-4 py-2 text-xs shadow-lg shadow-[#01cfe1]/25 transition cursor-pointer"
              title="Candidate & Teacher Login Portal"
            >
              <User className="h-4 w-4" />
              <span>Login / Sign Up</span>
            </motion.button>
          )}
          {user?.role === "admin" && (
            <>
              <button type="button" onClick={() => handleNavClick("database-studio")} className="hidden lg:inline-flex h-9 items-center rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-2.5 text-[10px] font-black text-emerald-200 hover:bg-emerald-500/20 cursor-pointer" title="Director Database">Director</button>
              <button type="button" onClick={() => handleNavClick("director-leads")} className="hidden xl:inline-flex h-9 items-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-2.5 text-[10px] font-black text-cyan-200 hover:bg-cyan-500/20 cursor-pointer" title="Director Leads">Leads</button>
            </>
          )}
          </div>
        </div>
      </div>

      {/* FULL-SCREEN IMMERSIVE HAMBURGER MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] w-screen h-screen bg-slate-950/95 backdrop-blur-md flex flex-col justify-between overflow-hidden"
          >
            {/* Top Navigation Bar inside Full-Screen Menu */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 py-4">
              <div className="flex items-center gap-2">
                <LingofiLogo size="md" variant="white" />
                <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400 border-l border-slate-700 pl-2 ml-2">
                  Full Screen Portal
                </span>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white hover:bg-slate-700 active:scale-95 transition-all cursor-pointer border border-slate-700"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Scrollable Body: Full Screen Categorized Navigation Cards */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6 max-w-4xl mx-auto w-full">
              {/* Back to Previous Screen option if in test or detail */}
              {canGoBack && onBack && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onBack();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-blue-950/70 border border-blue-600/40 text-blue-200 font-bold text-xs cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <ArrowLeft className="h-4 w-4 text-blue-400" />
                    <span>{t("backToHub", "Return to Previous Screen / Test Catalog")}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-blue-400" />
                </motion.button>
              )}

              {/* SECTION 1: Mock Exams & Skills Practice */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-blue-400" />
                    <span>Mock Exams & Skills Practice</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-bold">{fullMockCount} Full Sets</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("dashboard")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "dashboard"
                        ? "bg-blue-600 text-white border-blue-400 shadow-md"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                        <LayoutDashboard className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold">{t("navDashboard", "Overview & Hub")}</div>
                        <div className="text-[10px] text-slate-400 font-normal">Catalog & Test Tracker</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("fulltests")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "fulltests"
                        ? "bg-blue-900 text-white border-blue-500 shadow-md"
                        : "bg-gradient-to-r from-blue-950/60 to-slate-900 text-slate-100 border-blue-900/50 hover:border-blue-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navFullTests", "Full Academic Tests")}</div>
                        <div className="text-[10px] text-amber-300 font-semibold">Timed Mock Battery</div>
                      </div>
                    </div>
                    <span className="rounded-md bg-amber-400 text-slate-950 px-2 py-0.5 text-[10px] font-black">
                      Scored
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("reading")}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "reading"
                        ? "bg-blue-600 text-white border-blue-400"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div>{t("navReading", "Academic Reading")}</div>
                        <div className="text-[10px] text-slate-400">{sectionCounts.reading} Tests • 60 mins each</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">40 Qs</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("listening")}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "listening"
                        ? "bg-cyan-700 text-white border-cyan-400"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                        <Headphones className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div>{t("navListening", "Listening Lab")}</div>
                        <div className="text-[10px] text-slate-400">{sectionCounts.listening} Audio Tests • 40 mins</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Sections 1–4</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("writing")}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "writing"
                        ? "bg-amber-600 text-white border-amber-400"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                        <PenTool className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div>{t("navWriting", "Writing AI Grader")}</div>
                        <div className="text-[10px] text-slate-400">{sectionCounts.writing} Tests • Task 1 & 2</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Instant AI</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("speaking")}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "speaking"
                        ? "bg-emerald-600 text-white border-emerald-400"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Mic className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div>{t("navSpeaking", "Speaking AI Coach")}</div>
                        <div className="text-[10px] text-slate-400">{sectionCounts.speaking} Tests • Interactive Mic</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Parts 1–3</span>
                  </motion.button>
                </div>
              </div>

              {/* SECTION 2: Guides, Stories & Search Trends */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Learning & Search Trends</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-bold">110+ Posts & Real-time Trends</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* PROMINENT EXAM FORMAT GUIDE BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("guide")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "guide"
                        ? "bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/30"
                        : "bg-gradient-to-br from-slate-900 to-blue-950 text-slate-100 border-blue-800/40 hover:border-blue-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navGuide", "Exam Format Guide")}</div>
                        <div className="text-[10px] text-blue-300">Band Scoring & Structure</div>
                      </div>
                    </div>
                    <span className="rounded bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 text-[9px] font-black uppercase">
                      Official
                    </span>
                  </motion.button>

                  {/* Candidate Stories (110+) */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("blog")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "blog"
                        ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800 hover:border-indigo-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                        <Newspaper className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold">{t("navBlog", "Candidate Stories")}</div>
                        <div className="text-[10px] text-slate-400">Band 9 Guides & Tips</div>
                      </div>
                    </div>
                    <span className="rounded bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 text-[10px] font-black">
                      110+ Posts
                    </span>
                  </motion.button>

                  {/* YouTube Trends */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("videos")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "videos"
                        ? "bg-red-600 text-white border-red-400 shadow-md"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800 hover:border-red-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                        <Youtube className="h-4 w-4 fill-red-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold">{t("navVideos", "YouTube Search Trends")}</div>
                        <div className="text-[10px] text-slate-400">Instant Topic Launcher</div>
                      </div>
                    </div>
                    <span className="rounded bg-red-500/30 text-red-200 px-1.5 py-0.5 text-[10px] font-black">
                      Hot
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* SECTION 3: Official TRF Certification & Direct Verification */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-red-400" />
                    <span>Official Certification & Verification</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-bold">Cryptographic TRF</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("certificate")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                      currentTab === "certificate"
                        ? "bg-red-600 text-white border-red-400 shadow-lg"
                        : "bg-gradient-to-r from-red-950/40 to-slate-900 text-slate-200 border-red-900/40 hover:border-red-600/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navCertificate", "Official TRF Certificate")}</div>
                        <div className="text-[10px] text-red-300">Candidate Test Report Form</div>
                      </div>
                    </div>
                    <span className="rounded bg-red-600/30 text-red-200 border border-red-500/40 px-2 py-0.5 text-[10px] font-bold">
                      Highest Band
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("verify")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                      currentTab === "verify"
                        ? "bg-emerald-600 text-white border-emerald-400 shadow-lg"
                        : "bg-gradient-to-r from-emerald-950/40 to-slate-900 text-slate-200 border-emerald-900/40 hover:border-emerald-600/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navVerify", "Direct Verification Portal")}</div>
                        <div className="text-[10px] text-emerald-300">No QR Scanning Needed</div>
                      </div>
                    </div>
                    <span className="rounded bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold">
                      Instant
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* SECTION 4: Standardized Cognitive IQ Testing & Verified Credentials */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Brain className="h-3.5 w-3.5 text-purple-400" />
                    <span>Cognitive IQ Battery & Psychometrics</span>
                  </p>
                  <span className="text-[10px] text-purple-300 font-bold">Mensa Scale Norms</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("iqtest")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                      currentTab === "iqtest"
                        ? "bg-purple-700 text-white border-purple-400 shadow-lg"
                        : "bg-gradient-to-r from-purple-950/40 to-slate-900 text-slate-200 border-purple-900/40 hover:border-purple-600/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                        <Brain className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navIqTest", "Take Standardized IQ Test")}</div>
                        <div className="text-[10px] text-purple-300">Timed • Matrix & Abstract Logic</div>
                      </div>
                    </div>
                    <span className="rounded bg-purple-600/30 text-purple-200 border border-purple-500/40 px-2 py-0.5 text-[10px] font-bold">
                      Test
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("iqcert")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                      currentTab === "iqcert"
                        ? "bg-amber-600 text-white border-amber-400 shadow-lg"
                        : "bg-gradient-to-r from-amber-950/40 to-slate-900 text-slate-200 border-amber-900/40 hover:border-amber-600/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navIqCertificate", "Official IQ Certificate")}</div>
                        <div className="text-[10px] text-amber-300">Verified Credentials & PDF</div>
                      </div>
                    </div>
                    <span className="rounded bg-amber-600/30 text-amber-200 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold">
                      Cert
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* SECTION 5: International Standardized Examination Suites (PTE, SAT, GRE, GMAT, TOEFL, ACT) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Globe2 className="h-3.5 w-3.5 text-blue-400" />
                    <span>International Standardized Testing Suites</span>
                  </p>
                  <button
                    onClick={() => handleNavClick("international-exams")}
                    className="text-[10px] text-blue-300 font-bold hover:underline cursor-pointer"
                  >
                    View All Suites →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("pte")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-amber-500/20 text-amber-300 px-1.5 py-0.5 text-[9px] font-black">Pearson</span>
                      <div className="text-xs font-black text-white mt-1.5">PTE Academic</div>
                      <div className="text-[10px] text-slate-400">10-90 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("sat")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-blue-500/20 text-blue-300 px-1.5 py-0.5 text-[9px] font-black">College Board</span>
                      <div className="text-xs font-black text-white mt-1.5">Digital SAT</div>
                      <div className="text-[10px] text-slate-400">400-1600 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("gre")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 text-[9px] font-black">ETS</span>
                      <div className="text-xs font-black text-white mt-1.5">GRE General</div>
                      <div className="text-[10px] text-slate-400">260-340 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("gmat")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[9px] font-black">GMAC</span>
                      <div className="text-xs font-black text-white mt-1.5">GMAT Focus</div>
                      <div className="text-[10px] text-slate-400">205-805 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("toefl")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-rose-500/20 text-rose-300 px-1.5 py-0.5 text-[9px] font-black">ETS</span>
                      <div className="text-xs font-black text-white mt-1.5">TOEFL iBT</div>
                      <div className="text-[10px] text-slate-400">0-120 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("act")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-teal-500/20 text-teal-300 px-1.5 py-0.5 text-[9px] font-black">ACT, Inc.</span>
                      <div className="text-xs font-black text-white mt-1.5">ACT Assessment</div>
                      <div className="text-[10px] text-slate-400">1-36 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Bottom Progress & Reset Status Footer in Full-Screen Menu */}
            <div className="border-t border-slate-800 bg-slate-900/95 px-4 sm:px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-24 sm:w-36 overflow-hidden rounded-full bg-slate-800 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-white">
                    {completedCount} of {totalTests} Tests Done ({percent}%)
                  </span>
                </div>
              </div>

              {completedCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onResetProgress();
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-red-800/60 bg-red-950/40 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-900/50 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t("resetProgress", "Reset Progress")}</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

