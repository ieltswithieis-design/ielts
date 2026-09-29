import React, { useState } from "react";
import { TestSection, IeltsDatabase } from "../types/ielts";
import { ProgressState } from "../utils/storage";
import { StandardizedExamId, StandardizedDatabase } from "../types/standardizedTests";
import { STANDARDIZED_EXAMS_META, STANDARDIZED_TEST_PACKAGES } from "../data/standardizedTestsData";
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles, 
  Search,
  ShieldCheck,
  FileCheck,
  Download,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Users,
  Star,
  Target,
  Check,
  Play,
  Layers,
  Sparkle,
  Youtube,
  Newspaper,
  Brain,
  Globe2
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface DashboardProps {
  database: IeltsDatabase;
  progress: ProgressState;
  onSelectTest: (section: TestSection, id: number) => void;
  onSelectSection: (section: TestSection) => void;
  onOpenCertificate?: () => void;
  onSelectFullTests?: () => void;
  onOpenVerificationPortal?: () => void;
  onOpenBlog?: () => void;
  onOpenVideos?: () => void;
  onSelectIqTest?: () => void;
  onSelectIqCert?: () => void;
  onSelectInternationalExams?: () => void;
  onSelectIelts?: () => void;
  onSelectStandardizedTest?: (examId: StandardizedExamId, packageId?: string) => void;
  fullMockCount?: number;
  standardizedDatabase?: StandardizedDatabase | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  database,
  progress,
  onSelectTest,
  onSelectSection,
  onOpenCertificate,
  onSelectFullTests,
  onOpenVerificationPortal,
  onOpenBlog,
  onOpenVideos,
  onSelectIqTest,
  onSelectIqCert,
  onSelectInternationalExams,
  onSelectIelts,
  onSelectStandardizedTest,
  fullMockCount = 0,
  standardizedDatabase = null,
}) => {
  const { t, currentLanguageInfo } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSection, setFilterSection] = useState<TestSection | "all">("all");

  const completedCount = Object.keys(progress.completed).length;
  const modularTestCount = database.reading.length + database.listening.length + database.writing.length + database.speaking.length;

  const sectionsInfo: {
    key: TestSection;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    badgeColor: string;
    time: string;
    description: string;
    count: number;
    highlight: string;
  }[] = [
    {
      key: "reading",
      title: t("navReading", "Academic Reading"),
      icon: BookOpen,
      color: "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      time: "60 mins • 3 passages • 40 Qs",
      description: "Authentic academic research papers, TFNG, matching headings, and sentence completions with instant answer analysis.",
      count: database.reading.length,
      highlight: "Split-view passage & question layout",
    },
    {
      key: "listening",
      title: t("navListening", "IELTS Listening"),
      icon: Headphones,
      color: "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      time: "30 mins • 4 parts • 40 Qs",
      description: "High-clarity audio simulations ranging from daily social dialogues to university tutorials with auto-scoring.",
      count: database.listening.length,
      highlight: "Chronological audio playback engine",
    },
    {
      key: "writing",
      title: t("navWriting", "Academic Writing"),
      icon: PenTool,
      color: "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      time: "60 mins • Tasks 1 & 2",
      description: "Interactive visual chart descriptions plus Task 2 essays with instant AI criterion band scoring and grammar feedback.",
      count: database.writing.length,
      highlight: "Examiner AI 4-criterion evaluation",
    },
    {
      key: "speaking",
      title: t("navSpeaking", "IELTS Speaking"),
      icon: Mic,
      color: "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      time: "11–14 mins • 3 parts",
      description: "Examiner video prompts, Part 2 60-second preparation countdown, voice recording, live transcript, and AI speech analysis.",
      count: database.speaking.length,
      highlight: "Live voice recording & speech AI",
    },
  ];

  // Testimonials with human photos of students
  const studentTestimonials = [
    {
      name: "Sophia Lin",
      role: "Accepted to Univ. of Oxford",
      score: "Band 8.5",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      review: "The computer-delivered interface matches the real IDP exam precisely. Practicing the full mock-test library gave me the calm confidence to score Band 8.5 on my first try!",
      target: "L: 9.0 • R: 8.5 • W: 8.0 • S: 8.5",
    },
    {
      name: "Marcus Chen",
      role: "Emigrating to Vancouver, Canada",
      score: "Band 8.0",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
      review: "ApeUni and AlfaPTE are great, but LingoFi's AI writing feedback and speaking coach provide much deeper analysis of lexical resource and coherence. Outstanding platform!",
      target: "L: 8.5 • R: 8.5 • W: 7.5 • S: 8.0",
    },
    {
      name: "Amina Al-Mansoor",
      role: "Medical Residency, Melbourne",
      score: "Band 8.5",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      review: "Our institution verified my Test Report Form immediately. The direct cryptographic verification system with LingoFi Institute is seamless and trusted.",
      target: "L: 9.0 • R: 9.0 • W: 8.0 • S: 8.0",
    },
    {
      name: "David Adeleke",
      role: "Master of Science, Toronto",
      score: "Band 8.0",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      review: "Having complete mock tests with real audio recordings and official timers makes all the difference. Scoring is strictly recorded from your highest attempt!",
      target: "L: 8.5 • R: 8.0 • W: 7.5 • S: 8.0",
    },
  ];

  // Filtered test catalog
  const filteredTests = (() => {
    const list: { section: TestSection; id: number; title: string; subtitle: string }[] = [];
    
    if (filterSection === "all" || filterSection === "reading") {
      database.reading.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "reading", id: t.id, title: t.title, subtitle: "3 passages • 40 questions • 60 mins" });
        }
      });
    }
    if (filterSection === "all" || filterSection === "listening") {
      database.listening.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "listening", id: t.id, title: t.title, subtitle: "4 parts • 40 questions • ~30 mins" });
        }
      });
    }
    if (filterSection === "all" || filterSection === "writing") {
      database.writing.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "writing", id: t.id, title: t.title, subtitle: `Task 1 (${t.task1_type}) + Task 2 Essay • 60 mins` });
        }
      });
    }
    if (filterSection === "all" || filterSection === "speaking") {
      database.speaking.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "speaking", id: t.id, title: t.title, subtitle: "Interview • Cue card • Discussion • 14 mins" });
        }
      });
    }
    return list;
  })();

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO SECTION - Alfa PTE Midnight Navy & Cyan Signature Aesthetic with Rich Graphics & Animations */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-[#01cfe1]/30 bg-gradient-to-br from-[#06182a] via-[#0a2540] to-[#0e345b] p-6 sm:p-10 text-white shadow-[0_12px_45px_rgba(1,207,225,0.12)]"
      >
        {/* Animated Breathing Ambient Radial Glows */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.3, 0.18] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#01cfe1]/25 blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.24, 0.12] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#01c0b6]/20 blur-3xl" 
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* LingoFi Institute Badge + Real-time Live Session Status */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#01cfe1]/35 bg-[#01cfe1]/10 px-4 py-1.5 text-xs font-bold text-[#01cfe1] shadow-xs">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#01cfe1] animate-pulse" />
                <span className="font-extrabold text-white">{t("instituteName", "LingoFi Institute of Language & Testing")}</span>
                <span className="text-[#01cfe1]/60">•</span>
                <span className="text-slate-300">
                  {t("tagline", "Official IELTS Academic Examination Platform")}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-[11px] font-bold text-emerald-300 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>Live Testing Active</span>
                <span className="text-emerald-400 font-extrabold">• 1,482 Online</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[44px] leading-tight">
              {"Master Academic IELTS with Real-Exam AI Practice & Scored Mocks"}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {`Engineered for high-stakes test takers aiming for Band 7.5+. Practice with ${modularTestCount} authentic practice tests across Reading, Listening, Writing, and Speaking, plus ${fullMockCount} complete 4-skill mock simulations with live speech analysis and verifiable Test Report Forms.`}
            </p>

            {/* CTAs - Alfa PTE Signature Cyan & Navy Buttons + Elongated YouTube Button in the middle */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              {onSelectFullTests && (
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onSelectFullTests}
                  className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#01cfe1] hover:bg-[#00b9ca] px-5 sm:px-6 py-3 text-xs sm:text-sm font-black text-[#0a2540] shadow-[0_4px_18px_rgba(1,207,225,0.4)] transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#0a2540]/15 ring-1 ring-[#0a2540]/20 group-hover:rotate-6 transition-transform">
                    <Layers className="h-3.5 w-3.5 text-[#0a2540]" />
                  </span>
                  <span className="tracking-wide">{t("navFullTests", "Start Full Mock Tests")}</span>
                  <ArrowRight className="h-4 w-4 text-[#0a2540] group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectSection("reading")}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs sm:text-sm font-black text-white transition-all hover:bg-white/20 hover:border-[#01cfe1] hover:text-[#01cfe1] cursor-pointer shadow-xs w-full sm:w-auto"
              >
                <BookOpen className="h-4 w-4 text-[#01cfe1] group-hover:scale-110 transition-transform" />
                <span>{t("startPractice", "Practice by Section")}</span>
              </motion.button>

              {/* YOUTUBE BUTTON IN THE MIDDLE OF THE FIRST AND LAST LINK - Less height (h-10 / py-2), longer width (px-6 sm:px-8) to cover space */}
              {onOpenVideos && (
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenVideos}
                  className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 px-6 sm:px-8 py-2 text-xs sm:text-sm font-black text-white shadow-[0_4px_16px_rgba(220,38,38,0.4)] transition-all cursor-pointer border border-red-400/40 h-10 w-full sm:w-auto"
                  title="Watch Official YouTube Video Hub & Free Lectures"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  <Youtube className="h-4 w-4 text-white fill-white group-hover:scale-115 transition-transform shrink-0" />
                  <span className="tracking-wide uppercase text-xs font-black">{t("openYoutubeHub", "YouTube Video Hub")}</span>
                  <span className="hidden sm:inline text-[11px] text-white/90 font-medium">• Free Lessons</span>
                </motion.button>
              )}

              {onOpenCertificate && (
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenCertificate}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#071b30] px-5 py-3 text-xs sm:text-sm font-black text-[#01cfe1] border border-[#01cfe1]/40 hover:bg-[#10375c] hover:border-[#01cfe1] shadow-xs transition-all cursor-pointer w-full sm:w-auto"
                >
                  <Award className="h-4 w-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>{t("navCertificate", "Official TRF Certificate")}</span>
                </motion.button>
              )}

              {onSelectIqTest && (
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onSelectIqTest}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-950/70 hover:bg-purple-900/80 px-5 py-3 text-xs sm:text-sm font-black text-purple-200 border border-purple-500/50 hover:border-purple-400 hover:text-white shadow-xs transition-all cursor-pointer w-full sm:w-auto"
                >
                  <Brain className="h-4 w-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                  <span>{t("navIqTest", "Standardized IQ Test")}</span>
                  <span className="rounded bg-purple-500/30 px-2 py-0.5 text-[10px] font-black text-purple-200">
                    Mensa Scale
                  </span>
                </motion.button>
              )}
            </div>

            {/* Live Trust & Community Statistics Bar - Alfa PTE High Contrast with Subtle Pulse */}
            <div className="pt-3 grid grid-cols-3 gap-2 sm:gap-4 border-t border-white/15 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[#01cfe1] font-black text-base sm:text-2xl tracking-tight truncate">
                  <span className="animate-pulse">5 Million+</span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-300 font-extrabold tracking-tight truncate">{t("studentsPracticing")}</p>
              </div>

              <div className="border-l border-white/15 pl-2 sm:pl-4 min-w-0">
                <div className="flex items-center gap-1 text-emerald-400 font-black text-base sm:text-2xl tracking-tight truncate">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
                  <span>Band 8.0+</span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-300 font-medium truncate">{t("highestBandRecorded")}</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Craft Student Composition with Alfa PTE Cyan Border & Floating Animations */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Photo Card */}
            <div className="relative w-full max-w-md">
              {/* Main Student Image with subtle hover zoom */}
              <motion.div 
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-3xl border-2 border-[#01cfe1]/40 shadow-2xl bg-slate-900 aspect-[4/3] sm:aspect-[16/11]"
              >
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80" 
                  alt="University Students preparing for IELTS Academic exam" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06182a]/90 via-[#0a2540]/30 to-transparent" />
                
                {/* Photo Bottom Caption */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#01cfe1]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#01cfe1]" />
                    <span>{t("realExamExperience")}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    IDP & British Council format • LingoFi Institute (lingofi.com)
                  </p>
                </div>
              </motion.div>

              {/* Floating Badge 1: Top Right High Scorer Badge with Continuous Smooth Float */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 right-1 sm:right-2 lg:-top-3 lg:right-2 rounded-2xl border border-[#01cfe1]/40 bg-[#0a2540]/95 p-2 sm:p-2.5 shadow-xl backdrop-blur-md flex items-center gap-2.5 text-white max-w-[calc(100%-1rem)]"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Student portrait" 
                  className="h-9 w-9 rounded-full object-cover border-2 border-[#01cfe1] shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-extrabold text-white truncate">Sophia L.</span>
                    <span className="rounded bg-[#01cfe1] px-1.5 py-0.2 text-[9px] font-black text-[#0a2540] shrink-0">
                      Band 8.5
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium truncate block">Listening 9.0 • Reading 8.5</span>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom Left LingoFi Institute Accreditation with Continuous Inverse Float */}
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="absolute -bottom-3 left-1 sm:left-2 lg:-bottom-4 lg:left-2 rounded-2xl border border-[#01cfe1]/50 bg-[#06182a] text-white p-2 sm:p-2.5 shadow-xl flex items-center gap-2 max-w-[calc(100%-1rem)] sm:max-w-[260px]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#01cfe1] to-[#01c0b6] text-[#0a2540] font-black text-xs shadow-xs">
                  LF
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-black text-[#01cfe1] block truncate">
                    LingoFi Institute
                  </span>
                  <span className="text-[10px] text-slate-300 block truncate">
                    Official Examination Platform
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. Core IELTS practice cards intentionally removed from the home dashboard.
          Tests remain fully available through the Database Browser and section navigation. */}

      {/* 3. FULL MOCK SIMULATIONS (Sequenced 4-Skill Tests) - Alfa PTE Navy & Cyan */}
      <section className="overflow-hidden rounded-3xl border border-[#01cfe1]/30 bg-gradient-to-br from-[#06182a] via-[#0a2540] to-[#0d2d4f] p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#01cfe1] px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-[#0a2540] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {t("examSimulationBadge")}
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {t("fullMockBannerTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t("fullMockBannerDesc")}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#01cfe1] font-semibold pt-1">
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-[#01cfe1]" /> Genuine British Council Timers</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-[#01cfe1]" /> Speech & Essay AI Feedback</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-[#01cfe1]" /> Non-Editable Highest Scores</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onSelectFullTests && (
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onSelectFullTests}
                className="group flex items-center justify-center gap-2 rounded-2xl bg-[#01cfe1] hover:bg-[#00b9ca] px-7 py-4 text-sm font-black text-[#0a2540] shadow-[0_4px_18px_rgba(1,207,225,0.4)] transition-all cursor-pointer"
              >
                <Layers className="h-4 w-4 group-hover:rotate-6 transition-transform" />
                <span>{t("browseFullTests")}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* 3.5 STANDARDIZED COGNITIVE IQ BATTERY & VERIFIED CERTIFICATION */}
      <section className="overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 via-indigo-50/50 to-slate-50 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-700 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-xs">
              <Brain className="h-3.5 w-3.5" />
              <span>{t("iqStandardScale")}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {t("iqTestTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t("iqTestDesc")}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-purple-950 font-bold pt-1">
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-purple-200">
                <Check className="h-3.5 w-3.5 text-purple-600" /> Standard Deviation 15
              </span>
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-purple-200">
                <Check className="h-3.5 w-3.5 text-purple-600" /> Percentile Ranking Curve
              </span>
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-purple-200">
                <Check className="h-3.5 w-3.5 text-purple-600" /> Downloadable PDF & PNG
              </span>
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-purple-200">
                <Check className="h-3.5 w-3.5 text-purple-600" /> 11 World Languages Voice-Assisted
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onSelectIqTest && (
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onSelectIqTest}
                className="group flex items-center justify-center gap-2 rounded-2xl bg-purple-700 hover:bg-purple-800 px-7 py-4 text-sm font-black text-white shadow-md transition-all cursor-pointer"
              >
                <Brain className="h-4 w-4 text-purple-200 group-hover:rotate-6 transition-transform" />
                <span>{t("iqStartButton")}</span>
                <ArrowRight className="h-4 w-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}

            {onSelectIqCert && (
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onSelectIqCert}
                className="group flex items-center justify-center gap-2 rounded-2xl border border-purple-300 bg-white hover:bg-purple-50 px-5 py-4 text-sm font-black text-purple-900 shadow-xs transition-all cursor-pointer"
              >
                <Award className="h-4 w-4 text-amber-500" />
                <span>{t("navIqCertificate")}</span>
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* 3.5. INTERNATIONAL STANDARDIZED TESTING SUITES (PTE, SAT, GRE, GMAT, TOEFL, ACT) - Alfa PTE Style */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#01cfe1]/10 border border-[#01cfe1]/30 px-3 py-0.5 text-xs font-black text-[#0a2540] mb-1">
              <Globe2 className="h-3.5 w-3.5 text-[#00838f]" />
              <span>International Testing Authority</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Global Standardized Examination Suites
            </h2>
            <p className="text-xs text-slate-500">
              Official computer-delivered format mocks with algorithmic scoring curves for worldwide university admissions and immigration.
            </p>
          </div>

          {onSelectInternationalExams && (
            <button
              onClick={onSelectInternationalExams}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-black text-slate-800 hover:border-[#01cfe1] hover:bg-[#01cfe1]/10 hover:text-[#0a2540] transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <span>View All International Suites</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#01cfe1]" />
            </button>
          )}
        </div>

        {/* Beautiful visual launch cards — each card opens the same destination as the header navigation. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 min-w-0">
          {[
            { id: "ielts", name: "IELTS", subtitle: "International English Testing", image: "/exam-cards/ielts.svg", action: () => onSelectIelts ? onSelectIelts() : onSelectInternationalExams && onSelectInternationalExams() },
            { id: "iq", name: "IQ Test", subtitle: "Cognitive Intelligence Assessment", image: "/exam-cards/iq.svg", action: () => onSelectIqTest && onSelectIqTest() },
            { id: "pte", name: "PTE", subtitle: "Pearson Test of English", image: "/exam-cards/pte.svg", action: () => onSelectStandardizedTest ? onSelectStandardizedTest("pte") : onSelectInternationalExams && onSelectInternationalExams() },
            { id: "gre", name: "GRE", subtitle: "Graduate Record Examination", image: "/exam-cards/gre.svg", action: () => onSelectStandardizedTest ? onSelectStandardizedTest("gre") : onSelectInternationalExams && onSelectInternationalExams() },
            { id: "gmat", name: "GMAT", subtitle: "Graduate Management Admission Test", image: "/exam-cards/gmat.svg", action: () => onSelectStandardizedTest ? onSelectStandardizedTest("gmat") : onSelectInternationalExams && onSelectInternationalExams() },
            { id: "toefl", name: "TOEFL", subtitle: "Test of English as a Foreign Language", image: "/exam-cards/toefl.svg", action: () => onSelectStandardizedTest ? onSelectStandardizedTest("toefl") : onSelectInternationalExams && onSelectInternationalExams() },
            { id: "sat", name: "SAT", subtitle: "College Admission Assessment", image: "/exam-cards/sat.svg", action: () => onSelectStandardizedTest ? onSelectStandardizedTest("sat") : onSelectInternationalExams && onSelectInternationalExams() },
            { id: "act", name: "ACT", subtitle: "College Readiness Assessment", image: "/exam-cards/act.svg", action: () => onSelectStandardizedTest ? onSelectStandardizedTest("act") : onSelectInternationalExams && onSelectInternationalExams() },
          ].map((exam) => (
            <motion.button
              key={exam.id}
              type="button"
              onClick={exam.action}
              whileHover={{ y: -7, scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
              className="group relative min-w-0 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white text-left shadow-[0_8px_25px_rgba(15,23,42,0.07)] hover:border-[#01cfe1]/60 hover:shadow-[0_18px_40px_rgba(1,207,225,0.18)] focus:outline-none focus:ring-2 focus:ring-[#01cfe1] focus:ring-offset-2 cursor-pointer"
              aria-label={`Open ${exam.name}`}
            >
              <div className="relative aspect-[1.35/1] overflow-hidden bg-slate-950">
                <img src={exam.image} alt="" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                  Explore
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="text-xl sm:text-2xl font-black tracking-tight text-white">{exam.name}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="text-[11px] sm:text-xs font-bold leading-relaxed text-slate-500 line-clamp-2 min-h-[2rem]">{exam.subtitle}</div>
                <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#00838f]">
                  <span>Open Suite</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* 4. STUDENT SUCCESS & REAL TESTIMONIALS WITH HUMAN PORTRAITS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">{t("studentSuccessStories")}</h2>
            <p className="text-xs text-slate-500">
              {t("studentSuccessSubtitle")}
            </p>
          </div>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="ml-1 text-slate-800 font-extrabold">4.9 / 5.0 Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {studentTestimonials.map((st, idx) => (
            <div 
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-[#01cfe1] hover:shadow-[0_8px_25px_rgba(1,207,225,0.1)]"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={st.photo} 
                    alt={st.name} 
                    className="h-12 w-12 rounded-full object-cover border-2 border-[#01cfe1]/40 shadow-xs shrink-0" 
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{st.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{st.role}</p>
                    <span className="inline-block mt-0.5 rounded bg-[#01cfe1]/15 px-1.5 py-0.2 text-[9px] font-black text-[#006064] border border-[#01cfe1]/30">
                      {st.score}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{st.review}"
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="text-[#00838f] font-bold">Verified TRF</span>
                <span className="font-bold text-slate-800">{st.target}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LINGOFI INSTITUTE & OFFICIAL TRF SECURITY - Alfa PTE Navy & Cyan */}
      <section className="overflow-hidden rounded-3xl border border-[#01cfe1]/30 bg-gradient-to-r from-[#06182a] via-[#0a2540] to-[#0d2d4f] p-6 sm:p-8 shadow-xl text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#01cfe1]/20 border border-[#01cfe1]/40 px-3 py-1 text-xs font-black text-[#01cfe1] uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-[#01cfe1]" />
              <span>{t("instituteName")}</span>
            </div>

            <h3 className="text-2xl font-serif font-black text-white">
              {t("officialTrfSecurity")}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t("officialTrfDesc")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#01cfe1] block">Integrity Mandate</span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">Non-Editable Highest Score Ledger</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#01cfe1] block">Verification Protocol</span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">Zero Barcode/QR Scanning Criteria</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#01cfe1] block">Framework Standards</span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">Aligned with British Council & IDP</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            {onOpenCertificate && (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenCertificate}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#01cfe1] hover:bg-[#00b9ca] px-6 py-3.5 text-xs sm:text-sm font-black text-[#0a2540] shadow-[0_4px_16px_rgba(1,207,225,0.35)] transition-all cursor-pointer"
              >
                <Download className="h-4 w-4 text-[#0a2540]" />
                <span>{t("viewOfficialTrf")}</span>
              </motion.button>
            )}

            {onOpenVerificationPortal && (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenVerificationPortal()}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs sm:text-sm font-black text-white hover:border-[#01cfe1] hover:bg-white/20 transition-all cursor-pointer"
              >
                <Search className="h-4 w-4 text-[#01cfe1]" />
                <span>{t("directVerificationPortal")}</span>
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* Visual Learning Gallery */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          ["/skills-reading.svg", "Reading Lab", "Academic passages, question types and timed practice."],
          ["/skills-writing.svg", "Writing Studio", "Task 1 visuals and Task 2 essay practice."],
          ["/skills-speaking.svg", "Speaking Room", "Part 1, Part 2 and Part 3 speaking practice."],
        ].map(([src, title, desc]) => (
          <div key={title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow">
            <img src={src} alt={title} className="h-40 w-full object-cover" loading="lazy" />
            <div className="p-5"><h3 className="text-base font-black text-slate-900">{title}</h3><p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p></div>
          </div>
        ))}
      </section>

      {/* 6. IELTS STORIES, BLOG MASTERCLASSES & YOUTUBE VIDEO HUB */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stories & Blog Card - Alfa PTE Navy styling */}
        <div className="relative overflow-hidden rounded-3xl border border-[#01cfe1]/30 bg-gradient-to-br from-[#06182a] via-[#0a2540] to-[#0c2e54] p-6 sm:p-7 text-white shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#01cfe1]/15 border border-[#01cfe1]/35 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#01cfe1]">
              <Newspaper className="h-3.5 w-3.5" />
              <span>110+ In-Depth Articles & Case Studies</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {t("candidateStoriesTitle")}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Read real test journeys from Band 6.0 to 8.5+, official Band 9 sample essays with examiner commentary, and curated C1/C2 academic vocabulary banks.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-[#01cfe1] font-semibold">
              SEO Optimized • Rich Visual Guides
            </span>

            {onOpenBlog && (
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenBlog}
                className="group inline-flex items-center gap-2 rounded-2xl bg-[#01cfe1] hover:bg-[#00b9ca] px-5 py-3 text-xs font-black text-[#0a2540] shadow-md transition cursor-pointer"
              >
                <span>{t("readMasterclasses")}</span>
                <ArrowRight className="h-4 w-4 text-[#0a2540] group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        </div>

        {/* YouTube Video Hub Card */}
        <div className="relative overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-[#06182a] via-[#1c0c14] to-[#06182a] p-6 sm:p-7 text-white shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 border border-red-500/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-red-300">
              <Youtube className="h-3.5 w-3.5 text-red-400" />
              <span>Embedded YouTube Streaming & Search</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {t("youtubeTrendsTitle")}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stream curated lectures by former examiners and top educators for all 4 skills. Search all YouTube IELTS tutorials or paste any link to watch directly in LingoFi.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">
              HD Player • Key Timestamps • Practice Linkage
            </span>

            {onOpenVideos && (
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenVideos}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 px-6 py-2.5 text-xs font-black text-white shadow-md active:scale-95 transition cursor-pointer min-h-[36px]"
              >
                <Youtube className="h-4 w-4 fill-white" />
                <span>{t("openYoutubeHub")}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* 7. HOME TEST DIRECTORY: kept in source/data, intentionally hidden from the home-page bottom. */}
      {false && (
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t("allTestsDirectory")}</h2>
            <p className="text-xs text-slate-500">{t("filterByTopic")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input with Alfa Cyan focus ring */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t("searchTopicPlaceholder")}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#01cfe1] focus:ring-2 focus:ring-[#01cfe1]/20 focus:outline-hidden"
              />
            </div>

            {/* Filter Segmented Buttons */}
            <div className="flex flex-wrap rounded-xl border border-slate-200 bg-slate-100 p-1 gap-1">
              {(["all", "reading", "listening", "writing", "speaking"] as const).map(sec => {
                const label = sec === "all"
                  ? t("allFilter")
                  : sec === "reading"
                  ? t("navReading", "Reading")
                  : sec === "listening"
                  ? t("navListening", "Listening")
                  : sec === "writing"
                  ? t("navWriting", "Writing")
                  : t("navSpeaking", "Speaking");

                const isActive = filterSection === sec;

                return (
                  <button
                    key={sec}
                    onClick={() => setFilterSection(sec)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#01cfe1] text-[#0a2540] font-black shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Test List Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map(tItem => {
            const isDone = !!progress.completed[`${tItem.section}-${tItem.id}`];
            const attempt = progress.attempts[`${tItem.section}-${tItem.id}`];

            return (
              <div
                key={`${tItem.section}-${tItem.id}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-[#01cfe1] hover:shadow-[0_4px_20px_rgba(1,207,225,0.1)]"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                        tItem.section === "reading"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : tItem.section === "listening"
                          ? "bg-[#01cfe1]/10 text-[#006064] border border-[#01cfe1]/30"
                          : tItem.section === "writing"
                          ? "bg-amber-50 text-amber-900 border border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {tItem.section} #{tItem.id}
                    </span>
                    {isDone && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" />
                        {attempt?.band ? `Band ${attempt.band}` : t("statusCompleted", "Done")}
                      </span>
                    )}
                  </div>
                  <h4 className="truncate text-sm font-bold text-slate-900">{tItem.title}</h4>
                  <p className="truncate text-xs text-slate-500">{tItem.subtitle}</p>
                </div>

                <button
                  onClick={() => onSelectTest(tItem.section, tItem.id)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black transition-all cursor-pointer ${
                    isDone
                      ? "border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200"
                      : "bg-[#01cfe1] hover:bg-[#00b9ca] text-[#0a2540] font-black shadow-xs active:scale-95"
                  }`}
                >
                  {isDone ? t("reviewAnswers", "Review") : t("startPractice", "Start")}
                </button>
              </div>
            );
          })}
        </div>
      </section>
      )}
    </div>
  );
};
