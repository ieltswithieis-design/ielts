import React, { useState, useMemo, useEffect } from "react";
import { IeltsStory, StoryCategory } from "../types/blog";
import { allIeltsStories } from "../data/blogStoriesData";
import { TestSection } from "../types/ielts";
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  Heart, 
  Share2, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Eye, 
  Award, 
  CheckCircle2, 
  GraduationCap, 
  X, 
  ChevronRight,
  Filter,
  Flame,
  Bookmark,
  ExternalLink,
  ThumbsUp,
  Globe,
  Tag,
  BookMarked,
  Volume2,
  Copy,
  Check,
  Zap,
  Brain,
  ArrowLeft,
  RotateCw,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { academicVocabularyBank, ACADEMIC_VOCABULARY_TOPICS, AcademicVocabItem } from "../data/academicVocabData";
import { useLanguage } from "../context/LanguageContext";

interface BlogStoriesViewProps {
  onNavigateToTest: (section: TestSection | "fulltests", testId: number) => void;
}

const CATEGORIES: { label: string; value: StoryCategory | "All" }[] = [
  { label: "All Masterclasses (110)", value: "All" },
  { label: "Band 9 Journeys", value: "Band 9 Journeys" },
  { label: "Reading Speed & TFNG", value: "Reading Speed & TFNG" },
  { label: "Writing Task 2", value: "Writing Task 2 Masterclass" },
  { label: "Writing Task 1 Visuals", value: "Writing Task 1 Visuals" },
  { label: "Speaking Fluency", value: "Speaking Fluency & Pronunciation" },
  { label: "Listening 40/40", value: "Listening 40/40 Tactics" },
  { label: "University Admissions", value: "Study Abroad & University Admissions" },
  { label: "Examiner Insights", value: "Examiner Insights & Criteria" },
  { label: "Band 6.0 to 8.5 Jumps", value: "From Band 6.0 to 8.5 Transformations" },
  { label: "Grammar & Lexicon", value: "Grammar & Academic Lexicon" }
];

export const BlogStoriesView: React.FC<BlogStoriesViewProps> = ({ onNavigateToTest }) => {
  const { speak } = useLanguage();
  // Navigation mode within Stories Hub
  const [activeStoryTab, setActiveStoryTab] = useState<"stories" | "vocab" | "rubric">("stories");

  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "likes">("popular");
  const [selectedStory, setSelectedStory] = useState<IeltsStory | null>(null);

  // Lexical Vault State
  const [selectedVocabTopic, setSelectedVocabTopic] = useState<string>("All Domains");
  const [selectedCefr, setSelectedCefr] = useState<"All" | "C1" | "C2">("All");
  const [vocabSearch, setVocabSearch] = useState("");
  const [copiedWordId, setCopiedWordId] = useState<string | null>(null);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);

  // Flashcard Mode State
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Exactly 1 like per person per story, saved locally
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("lingofi_user_liked_stories");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [recentlyLikedId, setRecentlyLikedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Speech Synthesis for pronunciation with multilingual voice matching
  const speakText = (text: string, id?: string) => {
    if (id) {
      setSpeakingWordId(id);
      speak(text, {
        rate: 0.88,
        onEnd: () => setSpeakingWordId(null),
        onError: () => setSpeakingWordId(null),
      });
    } else {
      speak(text, { rate: 0.88 });
    }
  };

  const handleCopyVocab = (item: AcademicVocabItem) => {
    const textToCopy = `${item.word} (${item.pos}, ${item.cefr}) ${item.phonetic}\nDefinition: ${item.definition}\nCollocations: ${item.collocations.join(", ")}\nIELTS Context: ${item.ieltsExample}\nExaminer Tip: ${item.examinerTip}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedWordId(item.id);
      setTimeout(() => setCopiedWordId(null), 2000);
    }
  };

  // Keyboard shortcut: close story modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedStory) {
        setSelectedStory(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedStory]);

  // SEO Schema injection
  useEffect(() => {
    const existingScript = document.getElementById("lingofi-stories-schema");
    if (existingScript) existingScript.remove();

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "IELTS Academic Preparation Stories & Masterclasses - Lingofi",
      "description": "Comprehensive library of 100+ IELTS Academic candidate journeys, examiner strategy guides, band 9 sample answers, and reading/writing tactics.",
      "url": window.location.href,
      "provider": {
        "@type": "Organization",
        "name": "LingoFi IELTS",
        "alternateName": "LingoFi Institute of Language & Testing"
      },
      "hasPart": allIeltsStories.slice(0, 20).map(story => ({
        "@type": "Article",
        "headline": story.title,
        "description": story.summary,
        "image": story.heroImage,
        "datePublished": "2026-01-15",
        "author": {
          "@type": "Person",
          "name": story.author.name,
          "jobTitle": story.author.role
        }
      }))
    };

    const script = document.createElement("script");
    script.id = "lingofi-stories-schema";
    script.type = "application/ld+json";
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById("lingofi-stories-schema");
      if (s) s.remove();
    };
  }, []);

  // One person can add one like (+1) or toggle off their like
  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlyLiked = !!likedStories[id];
    const nextState = !isCurrentlyLiked;
    const updated = { ...likedStories, [id]: nextState };
    setLikedStories(updated);

    if (nextState) {
      setRecentlyLikedId(id);
      setTimeout(() => setRecentlyLikedId(null), 1400);
    }

    try {
      localStorage.setItem("lingofi_user_liked_stories", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Exact number of total likes: original count + 1 if user liked
  const getEffectiveLikes = (story: IeltsStory) => {
    return story.likes + (likedStories[story.id] ? 1 : 0);
  };

  const formatMillions = (views: number) => {
    return (views / 1000000).toFixed(1) + "M";
  };

  const formatThousands = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return count.toLocaleString();
  };

  const handleShare = (story: IeltsStory) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}#story-${story.slug}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const filteredStories = useMemo(() => {
    return allIeltsStories
      .filter(story => {
        const matchesCategory = selectedCategory === "All" || story.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        if (!q) return matchesCategory;

        const matchesSearch = 
          story.title.toLowerCase().includes(q) ||
          story.summary.toLowerCase().includes(q) ||
          story.author.name.toLowerCase().includes(q) ||
          story.tags.some(t => t.toLowerCase().includes(q)) ||
          story.vocabularyBank.some(v => v.word.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.views - a.views;
        if (sortBy === "likes") return getEffectiveLikes(b) - getEffectiveLikes(a);
        return 0; // maintain newest order from generator
      });
  }, [selectedCategory, searchQuery, sortBy, likedStories]);

  const filteredVocab = useMemo(() => {
    return academicVocabularyBank.filter(item => {
      const matchesTopic = selectedVocabTopic === "All Domains" || item.topic === selectedVocabTopic;
      const matchesCefr = selectedCefr === "All" || item.cefr === selectedCefr;
      const q = vocabSearch.toLowerCase().trim();
      if (!q) return matchesTopic && matchesCefr;

      const matchesSearch =
        item.word.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.collocations.some(c => c.toLowerCase().includes(q)) ||
        item.ieltsExample.toLowerCase().includes(q);

      return matchesTopic && matchesCefr && matchesSearch;
    });
  }, [selectedVocabTopic, selectedCefr, vocabSearch]);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. HERO BANNER FOR STORIES & BLOG PORTAL */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-10 text-white shadow-lg">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>SEO Optimized IELTS Knowledge Base</span>
            <span className="text-slate-400">•</span>
            <span>110+ In-Depth Masterclasses & Candidate Journeys</span>
          </div>

          <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            IELTS Academic Stories, Tactics & Band 9.0 Field Guides
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Explore authentic case studies, examiner scoring debriefs, and real preparation routines from candidates who achieved Band 8.0–9.0. Each story features verified vocabulary banks, high-band sample answers, and direct test simulation links.
          </p>

          {/* Quick Search & Sort Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by topic, keyword, or author (e.g., TFNG, Task 2, Oxford, Fluency)..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                aria-label="Sort masterclasses"
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="likes">Top Rated</option>
                <option value="newest">Recent Releases</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HIGH-LEVEL LEARNING SUITE SELECTOR TABS */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300 shadow-2xs">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveStoryTab("stories")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeStoryTab === "stories"
              ? "bg-[#002d62] text-white shadow-xs"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <BookOpen className={`h-4 w-4 ${activeStoryTab === "stories" ? "text-blue-300" : "text-blue-600"}`} />
          <span>Candidate Masterclasses ({allIeltsStories.length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveStoryTab("vocab")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeStoryTab === "vocab"
              ? "bg-[#002d62] text-white shadow-xs"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <Brain className={`h-4 w-4 ${activeStoryTab === "vocab" ? "text-amber-300" : "text-amber-600"}`} />
          <span>Band 9 Lexical Vault & Audio ({academicVocabularyBank.length})</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveStoryTab("rubric")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeStoryTab === "rubric"
              ? "bg-[#002d62] text-white shadow-xs"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <Award className={`h-4 w-4 ${activeStoryTab === "rubric" ? "text-emerald-300" : "text-emerald-600"}`} />
          <span>Examiner Scoring Matrix & Traps</span>
        </motion.button>
      </section>

      {/* 3A. CANDIDATE MASTERCLASSES TAB */}
      {activeStoryTab === "stories" && (
        <div className="space-y-6">
          {/* CATEGORY PILL NAVIGATION */}
          <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
            <Filter className="h-3.5 w-3.5 text-blue-600" />
            <span>Curated Topics</span>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Showing {filteredStories.length} of {allIeltsStories.length} articles
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#002d62] text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. STORIES GRID */}
      {filteredStories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="text-base font-bold text-slate-800">No matching articles found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords or select "All Masterclasses" to browse the full library.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="rounded-xl bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-950 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map(story => {
            const isLiked = !!likedStories[story.id];
            const effectiveLikes = getEffectiveLikes(story);
            const isRecentlyLiked = recentlyLikedId === story.id;

            return (
              <motion.article
                key={story.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedStory(story)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={story.heroImage}
                    alt={story.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 rounded-lg bg-blue-900/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white border border-blue-400/30">
                    {story.category}
                  </span>

                  {/* Target Band Pill */}
                  <span className="absolute top-3 right-3 rounded-lg bg-emerald-700/90 backdrop-blur-md px-2 py-1 text-[11px] font-black text-white">
                    {story.targetBand}
                  </span>

                  {/* Read Time & Views overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3 text-amber-300" />
                      {story.readTime}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-blue-200">
                      <Eye className="h-3.5 w-3.5 text-blue-300" />
                      {formatMillions(story.views)} views
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="flex flex-1 flex-col p-5 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-900 transition-colors">
                    {story.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {story.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {story.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Author Card & Actions */}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={story.author.avatar}
                        alt={story.author.name}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          {story.author.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[130px]">
                          {story.author.universityOrInstitution || story.author.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleToggleLike(story.id, e)}
                        className={`relative flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                          isLiked 
                            ? "text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 shadow-2xs" 
                            : "text-slate-600 hover:text-red-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                        title={isLiked ? "You liked this (Click to remove your like)" : "Click to add your like (1 like per person)"}
                      >
                        <motion.div
                          animate={isRecentlyLiked ? { scale: [1, 1.45, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-red-600 text-red-600" : "text-slate-400"}`} />
                        </motion.div>
                        <span className="font-mono font-bold text-slate-800">{effectiveLikes.toLocaleString()}</span>
                        {isLiked && (
                          <span className="text-[9px] font-black uppercase text-red-700 bg-red-100 px-1 py-0.2 rounded">Liked</span>
                        )}

                        {/* Floating +1 animation when user likes */}
                        <AnimatePresence>
                          {isRecentlyLiked && (
                            <motion.span
                              initial={{ opacity: 0, y: 0, scale: 0.6 }}
                              animate={{ opacity: 1, y: -20, scale: 1.1 }}
                              exit={{ opacity: 0, y: -28, scale: 0.8 }}
                              transition={{ duration: 0.5 }}
                              className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-black text-white shadow-xs whitespace-nowrap z-20"
                            >
                              +1 Like
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      <motion.span 
                        whileHover={{ x: 2 }}
                        className="flex items-center text-xs font-extrabold text-blue-900 group-hover:translate-x-0.5 transition-transform"
                      >
                        Read <ChevronRight className="h-4 w-4" />
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
        </div>
      )}

      {/* 3B. BAND 9 LEXICAL VAULT & AUDIO PRONUNCIATION TAB */}
      {activeStoryTab === "vocab" && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-slate-50 p-5 space-y-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-600 text-white px-2.5 py-0.5 text-xs font-black uppercase">
                    C1 / C2 Academic Lexicon
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {filteredVocab.length} words with native British audio & collocations
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Band 9.0 Lexical Resource Mastery Vault
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
                  Lexical Resource accounts for 25% of your IELTS score. Master these high-precision collocations, academic nouns, and evaluative adjectives that examiners award Band 8.5–9.0.
                </p>
              </div>

              {/* View Mode Toggle: Grid vs Flashcard */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsFlashcardMode(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    !isFlashcardMode
                      ? "bg-indigo-900 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Bento Grid View
                </button>
                <button
                  onClick={() => {
                    setIsFlashcardMode(true);
                    setIsCardFlipped(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    isFlashcardMode
                      ? "bg-indigo-900 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>Flashcard Mode</span>
                </button>
              </div>
            </div>

            {/* Filter Bar: Topic Pills & CEFR Selector */}
            <div className="space-y-3 pt-2 border-t border-indigo-100/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={vocabSearch}
                    onChange={e => setVocabSearch(e.target.value)}
                    placeholder="Search by word, definition, or collocation (e.g., exacerbate, ubiquity, climate)..."
                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {vocabSearch && (
                    <button
                      onClick={() => setVocabSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* CEFR Level filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Level:</span>
                  {(["All", "C1", "C2"] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedCefr(lvl)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-black transition cursor-pointer ${
                        selectedCefr === lvl
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Pills */}
              <div className="flex flex-wrap gap-1.5">
                {ACADEMIC_VOCABULARY_TOPICS.map(top => (
                  <button
                    key={top}
                    onClick={() => setSelectedVocabTopic(top)}
                    className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                      selectedVocabTopic === top
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {top}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FLASHCARD MODE */}
          {isFlashcardMode ? (
            <div className="max-w-2xl mx-auto space-y-4">
              {filteredVocab.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 text-xs">
                  No vocabulary matches the current filter. Try selecting "All Domains".
                </div>
              ) : (
                (() => {
                  const safeIndex = Math.min(currentFlashcardIndex, filteredVocab.length - 1);
                  const currentItem = filteredVocab[safeIndex];

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Card {safeIndex + 1} of {filteredVocab.length}</span>
                        <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5">
                          {currentItem.topic}
                        </span>
                      </div>

                      {/* Interactive Flip Card */}
                      <motion.div
                        key={currentItem.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsCardFlipped(!isCardFlipped)}
                        className="relative min-h-[320px] rounded-3xl border-2 border-indigo-200 bg-white p-6 sm:p-8 shadow-md hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between"
                      >
                        {!isCardFlipped ? (
                          // Front of card
                          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 py-6">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-md px-2 py-0.5 text-xs font-black ${
                                currentItem.cefr === "C2" ? "bg-purple-100 text-purple-900 border border-purple-200" : "bg-blue-100 text-blue-900 border border-blue-200"
                              }`}>
                                {currentItem.cefr}
                              </span>
                              <span className="text-xs text-slate-400 italic">
                                {currentItem.pos}
                              </span>
                            </div>

                            <h3 className="font-serif text-3xl sm:text-4xl font-black text-slate-900">
                              {currentItem.word}
                            </h3>

                            <p className="font-mono text-sm text-slate-500">
                              {currentItem.phonetic}
                            </p>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                speakText(`${currentItem.word}. ${currentItem.ieltsExample}`, currentItem.id);
                              }}
                              className="flex items-center gap-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 text-xs font-bold transition cursor-pointer"
                            >
                              <Volume2 className={`h-4 w-4 ${speakingWordId === currentItem.id ? "animate-pulse text-indigo-600" : ""}`} />
                              <span>Listen UK Audio</span>
                            </motion.button>

                            <p className="text-xs text-indigo-600 font-bold pt-4">
                              Click card to reveal definition & collocations ↻
                            </p>
                          </div>
                        ) : (
                          // Back of card
                          <div className="flex-1 flex flex-col justify-between space-y-4 text-left">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="font-serif text-2xl font-black text-indigo-900">
                                  {currentItem.word}
                                </span>
                                <span className="text-xs font-mono text-slate-400">
                                  {currentItem.phonetic}
                                </span>
                              </div>
                              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                                {currentItem.definition}
                              </p>
                            </div>

                            {/* Collocations */}
                            <div className="space-y-1.5">
                              <p className="text-[11px] font-black uppercase text-indigo-900">
                                High-Band Collocations:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {currentItem.collocations.map((col, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-xs font-bold text-indigo-800"
                                  >
                                    {col}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Context Sentence */}
                            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 italic leading-relaxed">
                              "{currentItem.ieltsExample}"
                            </div>

                            {/* Examiner Tip */}
                            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-950">
                              <span className="font-black text-emerald-900 block mb-0.5">Examiner Band 9 Advice:</span>
                              {currentItem.examinerTip}
                            </div>
                          </div>
                        )}
                      </motion.div>

                      {/* Navigation Controls for Flashcards */}
                      <div className="flex items-center justify-between gap-3 pt-2">
                        <button
                          disabled={safeIndex === 0}
                          onClick={() => {
                            setCurrentFlashcardIndex(Math.max(0, safeIndex - 1));
                            setIsCardFlipped(false);
                          }}
                          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                        >
                          ← Previous Word
                        </button>

                        <button
                          onClick={() => {
                            const randomIndex = Math.floor(Math.random() * filteredVocab.length);
                            setCurrentFlashcardIndex(randomIndex);
                            setIsCardFlipped(false);
                          }}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1"
                        >
                          <RotateCw className="h-3.5 w-3.5" />
                          <span>Shuffle</span>
                        </button>

                        <button
                          disabled={safeIndex >= filteredVocab.length - 1}
                          onClick={() => {
                            setCurrentFlashcardIndex(Math.min(filteredVocab.length - 1, safeIndex + 1));
                            setIsCardFlipped(false);
                          }}
                          className="flex-1 rounded-xl bg-indigo-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-950 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-xs"
                        >
                          Next Word →
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          ) : (
            // BENTO GRID VIEW OF ACADEMIC VOCABULARY
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVocab.map(item => {
                const isCopied = copiedWordId === item.id;
                const isSpeaking = speakingWordId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all space-y-3"
                  >
                    {/* Header: Word, POS, CEFR */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg font-black text-slate-900">
                            {item.word}
                          </h3>
                          <span className={`rounded px-1.5 py-0.2 text-[10px] font-black uppercase ${
                            item.cefr === "C2" ? "bg-purple-100 text-purple-800 border border-purple-200" : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}>
                            {item.cefr}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                          <span>{item.phonetic}</span>
                          <span>•</span>
                          <span className="italic font-sans">{item.pos}</span>
                        </div>
                      </div>

                      {/* Action buttons: Pronounce & Copy */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => speakText(`${item.word}. ${item.ieltsExample}`, item.id)}
                          title="Listen to native British pronunciation"
                          className="rounded-lg p-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer border border-indigo-200/60"
                        >
                          <Volume2 className={`h-4 w-4 ${isSpeaking ? "animate-pulse text-indigo-600" : ""}`} />
                        </button>
                        <button
                          onClick={() => handleCopyVocab(item)}
                          title="Copy word and collocations"
                          className="rounded-lg p-1.5 text-slate-500 bg-slate-50 hover:bg-slate-100 transition cursor-pointer border border-slate-200"
                        >
                          {isCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Definition */}
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.definition}
                    </p>

                    {/* High-Band Collocations */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-black uppercase text-indigo-900 tracking-wider">
                        Key Collocations:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.collocations.map((col, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 border border-slate-200"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* IELTS Context Sentence */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-700 italic leading-relaxed">
                      "{item.ieltsExample}"
                    </div>

                    {/* Examiner Tip */}
                    <div className="mt-auto pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-emerald-900 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60">
                      <Award className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-emerald-950 block">Examiner Tip:</span>
                        <span className="text-emerald-900">{item.examinerTip}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3C. EXAMINER SCORING MATRIX & BAND TRAPS TAB */}
      {activeStoryTab === "rubric" && (
        <div className="space-y-8">
          {/* Rubric Header */}
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-900 via-slate-900 to-blue-950 p-6 sm:p-8 text-white space-y-3 shadow-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>Official Cambridge / IDP Assessment Standard</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold">
              IELTS Examiner Scoring Criteria & Band Descriptors
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Every IELTS Academic Writing and Speaking response is assessed across 4 equally weighted criteria (25% each). Compare what separates Band 6.0 candidates from true Band 8.5–9.0 master performers.
            </p>
          </div>

          {/* The 4 Criteria Descriptors Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Criterion 1: Task Response */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">1. Task Achievement & Response (25%)</h3>
                  <p className="text-xs text-slate-500">How thoroughly you address prompt questions & support ideas</p>
                </div>
                <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-black text-blue-900">TR / TA</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>Band 6.0 (Competent)</span>
                    <span className="text-slate-500">Unbalanced Focus</span>
                  </div>
                  <p className="text-slate-600">
                    Addresses all parts of prompt, but some parts may be more fully covered than others. Positions may become unclear or lack justified supporting examples.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                    <span>Band 7.0 (Good)</span>
                    <span className="text-blue-700">Clear Stance</span>
                  </div>
                  <p className="text-slate-600">
                    Presents a clear position throughout. Extends main ideas, but there may be a tendency to over-generalize or produce slightly repetitive supporting points.
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-200">
                  <div className="flex items-center justify-between font-bold text-emerald-950 mb-1">
                    <span>Band 8.5–9.0 (Expert)</span>
                    <span className="text-emerald-800">Nuanced Mastery</span>
                  </div>
                  <p className="text-emerald-900">
                    Fully satisfies all requirements with a mature, fully developed response. Arguments are nuanced, counter-balanced, and supported with precise empirical context.
                  </p>
                </div>
              </div>
            </div>

            {/* Criterion 2: Coherence & Cohesion */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">2. Coherence & Cohesion (25%)</h3>
                  <p className="text-xs text-slate-500">Logical paragraph flow and sophisticated thematic referencing</p>
                </div>
                <span className="rounded-lg bg-indigo-100 px-2 py-1 text-xs font-black text-indigo-900">CC</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>Band 6.0 (Competent)</span>
                    <span className="text-slate-500">Mechanical Linkers</span>
                  </div>
                  <p className="text-slate-600">
                    Cohesive devices used effectively but can feel repetitive or mechanical ("First of all", "Moreover", "In conclusion"). Paragraphing may be arbitrary.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                    <span>Band 7.0 (Good)</span>
                    <span className="text-blue-700">Logical Progression</span>
                  </div>
                  <p className="text-slate-600">
                    Logically organizes information with clear progression throughout. Uses a range of cohesive devices with some minor under- or over-use.
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-200">
                  <div className="flex items-center justify-between font-bold text-emerald-950 mb-1">
                    <span>Band 8.5–9.0 (Expert)</span>
                    <span className="text-emerald-800">Effortless Referencing</span>
                  </div>
                  <p className="text-emerald-900">
                    Uses cohesion in such a way that it attracts no attention. Sequences information seamlessly using anaphoric nouns, thematic continuity, and skillful paragraphing.
                  </p>
                </div>
              </div>
            </div>

            {/* Criterion 3: Lexical Resource */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">3. Lexical Resource (25%)</h3>
                  <p className="text-xs text-slate-500">Range, precision, style, and natural academic collocations</p>
                </div>
                <span className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-black text-amber-900">LR</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>Band 6.0 (Competent)</span>
                    <span className="text-slate-500">Adequate Vocabulary</span>
                  </div>
                  <p className="text-slate-600">
                    Uses adequate vocabulary for the task. Attempts less common words with occasional inaccuracies in word choice, spelling, and word formation.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                    <span>Band 7.0 (Good)</span>
                    <span className="text-blue-700">Flexible Repertoire</span>
                  </div>
                  <p className="text-slate-600">
                    Sufficient range of vocabulary allowing flexibility and precision. Uses less common lexical items with awareness of style and collocation.
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-200">
                  <div className="flex items-center justify-between font-bold text-emerald-950 mb-1">
                    <span>Band 8.5–9.0 (Expert)</span>
                    <span className="text-emerald-800">Flawless Precision</span>
                  </div>
                  <p className="text-emerald-900">
                    Wide lexical repertoire used with complete naturalness and sophisticated control. Rare minor slips occur only as slips of the tongue or non-systematic variations.
                  </p>
                </div>
              </div>
            </div>

            {/* Criterion 4: Grammatical Range & Accuracy */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">4. Grammatical Range & Accuracy (25%)</h3>
                  <p className="text-xs text-slate-500">Variety of complex sentence structures and error-free execution</p>
                </div>
                <span className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-black text-rose-900">GRA</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>Band 6.0 (Competent)</span>
                    <span className="text-slate-500">Mix of Simple & Complex</span>
                  </div>
                  <p className="text-slate-600">
                    Uses a mix of simple and complex sentence forms. Makes some errors in grammar and punctuation, but these rarely reduce overall communication.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                    <span>Band 7.0 (Good)</span>
                    <span className="text-blue-700">Frequent Error-Free Sentences</span>
                  </div>
                  <p className="text-slate-600">
                    Uses a variety of complex structures. Produces frequent error-free sentences with good control of grammar and punctuation.
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-200">
                  <div className="flex items-center justify-between font-bold text-emerald-950 mb-1">
                    <span>Band 8.5–9.0 (Expert)</span>
                    <span className="text-emerald-800">Complete Syntactic Mastery</span>
                  </div>
                  <p className="text-emerald-900">
                    Wide range of structures deployed with full flexibility and accuracy. Natural usage of cleft sentences, inverted conditionals, and participial phrases without strain.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Senior Examiner Diagnostics: How to Break the 6.5 Ceiling */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-950 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span>Diagnostic: Why 68% of Candidates Get Stuck at Band 6.5</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl bg-white p-4 border border-amber-200 space-y-1.5 shadow-2xs">
                <span className="font-bold text-red-700 block">1. The "List of Points" Trap</span>
                <p className="text-slate-600 leading-relaxed">
                  Listing 4 or 5 superficial arguments rather than taking 2 strong arguments and developing each with causal links, counter-perspectives, and empirical evidence.
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 border border-amber-200 space-y-1.5 shadow-2xs">
                <span className="font-bold text-red-700 block">2. Forced Thesaurus Synonyms</span>
                <p className="text-slate-600 leading-relaxed">
                  Inserting obscure words without understanding their natural collocations (e.g., using "ubiquitous" where "prevalent" or "widespread" was required).
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 border border-amber-200 space-y-1.5 shadow-2xs">
                <span className="font-bold text-red-700 block">3. Weak Task 1 Overview</span>
                <p className="text-slate-600 leading-relaxed">
                  Failing to write a distinct, clear Overview paragraph that highlights main trends without copying specific data points, immediately capping Task Achievement at Band 5 or 6.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FULL STORY MODAL READER */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200"
            >
              {/* Top Sticky Bar */}
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5">
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStory(null)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-black text-slate-800 transition cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <ArrowLeft className="h-4 w-4 text-blue-700" />
                    <span>Back</span>
                  </motion.button>
                  <span className="hidden sm:inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-black text-blue-900 border border-blue-200">
                    {selectedStory.category}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-800 border border-emerald-200">
                    {selectedStory.targetBand}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare(selectedStory)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>{copiedLink ? "Copied!" : "Share"}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleToggleLike(selectedStory.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      likedStories[selectedStory.id]
                        ? "border-red-300 bg-red-50 text-red-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-red-200"
                    }`}
                    title={likedStories[selectedStory.id] ? "Click to remove your like" : "Click to add your like (1 like per person)"}
                  >
                    <motion.div
                      animate={recentlyLikedId === selectedStory.id ? { scale: [1, 1.45, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart className={`h-4 w-4 ${likedStories[selectedStory.id] ? "fill-red-600 text-red-600" : "text-slate-400"}`} />
                    </motion.div>
                    <span className="font-mono font-bold text-slate-900">
                      {getEffectiveLikes(selectedStory).toLocaleString()} Likes
                    </span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-black ${
                      likedStories[selectedStory.id] ? "bg-red-200 text-red-800" : "bg-slate-100 text-slate-600"
                    }`}>
                      {likedStories[selectedStory.id] ? "Liked (1/1)" : "+1"}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedStory(null)}
                    aria-label="Close story modal"
                    className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Story Content Body */}
              <div className="p-6 sm:p-10 space-y-8">
                {/* Header Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {selectedStory.publishedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {selectedStory.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <Eye className="h-3.5 w-3.5 text-blue-600" />
                      {formatMillions(selectedStory.views)} Views ({selectedStory.views.toLocaleString()} Total Reads)
                    </span>
                  </div>

                  <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                    {selectedStory.title}
                  </h1>

                  <p className="text-base text-slate-600 leading-relaxed font-medium">
                    {selectedStory.subtitle}
                  </p>

                  {/* Author Card */}
                  <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <img
                      src={selectedStory.author.avatar}
                      alt={selectedStory.author.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">
                          {selectedStory.author.name}
                        </span>
                        {selectedStory.author.verifiedScore && (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-black text-emerald-800">
                            Verified {selectedStory.author.verifiedScore}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        {selectedStory.author.role} • {selectedStory.author.universityOrInstitution || selectedStory.author.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hero Feature Image */}
                <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-slate-100 shadow-md">
                  <img
                    src={selectedStory.heroImage}
                    alt={selectedStory.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 rounded-lg bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    Photographed at {selectedStory.author.universityOrInstitution || "International IELTS Test Centre"}
                  </div>
                </div>

                {/* 1. Introduction & Context */}
                <div className="prose prose-slate max-w-none space-y-4">
                  <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                    1. The Preparation Context
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {selectedStory.introduction}
                  </p>
                </div>

                {/* 2. Challenge & Frustration */}
                <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50/60 p-5 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-amber-600" />
                    The Primary Challenge & Score Hurdle
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                    {selectedStory.challengeFaced}
                  </p>
                </div>

                {/* Secondary Photo Gallery Strip */}
                {selectedStory.secondaryImages && selectedStory.secondaryImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedStory.secondaryImages.map((img, idx) => (
                      <div key={idx} className="overflow-hidden rounded-xl aspect-[4/3] bg-slate-100 border border-slate-200 shadow-xs">
                        <img src={img} alt="Preparation materials" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Breakthrough Methodology Checklist */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                    2. The Breakthrough Strategic Blueprint
                  </h3>
                  <ul className="space-y-2.5">
                    {selectedStory.breakthroughStrategy.map((strat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{strat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Real Band 9 Sample Excerpt & Examiner Commentary */}
                {selectedStory.sampleBand9Excerpts && selectedStory.sampleBand9Excerpts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                      3. Official Band 9.0 Analysis & Model Response
                    </h3>
                    {selectedStory.sampleBand9Excerpts.map((ex, idx) => (
                      <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-900">
                            {ex.context}
                          </span>
                          <span className="rounded bg-blue-900 text-white px-2 py-0.5 text-[10px] font-black uppercase">
                            Band 9.0 Benchmark
                          </span>
                        </div>

                        <blockquote className="rounded-xl bg-white border border-slate-200 p-4 text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                          "{ex.sampleText}"
                        </blockquote>

                        <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-3.5 space-y-1">
                          <p className="text-[11px] font-black text-emerald-900 flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5 text-emerald-600" />
                            Official Examiner Commentary
                          </p>
                          <p className="text-xs text-emerald-950 leading-relaxed">
                            {ex.examinerComment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. C1/C2 Academic Vocabulary Bank with Audio Pronunciation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-indigo-600" />
                      <span>4. High-Scoring Academic Vocabulary Bank</span>
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      Click <Volume2 className="inline h-3.5 w-3.5 text-blue-600" /> for UK Audio
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedStory.vocabularyBank.map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1.5 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-blue-900">
                              {item.word}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 italic">
                              {item.pos}
                            </span>
                          </div>
                          <button
                            onClick={() => speakText(`${item.word}. ${item.example}`)}
                            title="Listen to native British pronunciation and sentence"
                            className="flex items-center gap-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 text-[11px] font-bold cursor-pointer transition active:scale-95 border border-blue-200/60"
                          >
                            <Volume2 className="h-3.5 w-3.5 text-blue-600" />
                            <span>Listen</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.definition}
                        </p>
                        <p className="text-[11px] text-slate-500 italic pt-1.5 border-t border-slate-100">
                          Ex: "{item.example}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Official Examiner Scoring Criteria Matrix */}
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-emerald-600" />
                      <span>5. Official Examiner Scoring Criteria Breakdown</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Verified {selectedStory.targetBand} Benchmark
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">Task Achievement / Response</span>
                        <span className="text-xs font-mono font-bold text-blue-700">Band 9.0</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Fully addresses all requirements of the prompt with a fully developed position, substantive arguments, and nuanced justification.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">Coherence & Cohesion</span>
                        <span className="text-xs font-mono font-bold text-blue-700">Band 8.5–9.0</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Skillfully structures paragraphs with effortless conceptual referencing, utilizing seamless thematic transitions instead of mechanical signposts.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">Lexical Resource</span>
                        <span className="text-xs font-mono font-bold text-blue-700">Band 9.0</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Wide lexical repertoire deployed with full flexibility and precision. Rare minor slips only as 'slips of the tongue' or stylistic variations.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">Grammatical Range & Accuracy</span>
                        <span className="text-xs font-mono font-bold text-blue-700">Band 9.0</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Wide range of structures deployed with full flexibility and complete accuracy. Natural use of inversions, reduced relative clauses, and subjunctive forms.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. Diagnostic: Band 6.5 Trap vs Band 9.0 Solution */}
                <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 to-orange-50/40 p-4 sm:p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span>Examiner Diagnostic: Band 6.5 Trap vs Band 9.0 Solution</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-red-200 bg-red-50/80 p-3 space-y-1">
                      <p className="font-black text-red-900">❌ Band 6.5 Common Pitfall</p>
                      <p className="text-red-950 leading-relaxed">
                        Over-relying on robotic sentence starters ("Furthermore", "In addition", "On the one hand") and writing overly broad generalizations without empirical evidence.
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 space-y-1">
                      <p className="font-black text-emerald-900">✓ Verified Band 9.0 Solution</p>
                      <p className="text-emerald-950 leading-relaxed">
                        Using anaphoric noun phrases ("This structural shift...", "Such systemic disparities...") to link paragraphs, supported by concrete contextual examples and precise academic collocations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 7. Key Takeaways */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-700" />
                    Essential Summary Points
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-blue-900">
                    {selectedStory.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-blue-700">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Like Banner inside Modal */}
                <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50/90 via-pink-50/40 to-amber-50/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 6 }}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-xs"
                    >
                      <Heart className="h-5 w-5 fill-white" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Did you find this candidate story helpful?</p>
                      <p className="text-xs text-slate-600">
                        Over <strong className="font-mono text-slate-900 font-bold">{getEffectiveLikes(selectedStory).toLocaleString()}</strong> candidates found this guide valuable. (1 like per candidate)
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleToggleLike(selectedStory.id)}
                    className={`shrink-0 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer ${
                      likedStories[selectedStory.id]
                        ? "bg-slate-900 hover:bg-slate-800 text-white"
                        : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-500/20"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${likedStories[selectedStory.id] ? "fill-red-400 text-red-400" : "fill-white text-white"}`} />
                    <span>{likedStories[selectedStory.id] ? "Liked by You" : "Add Your Like"}</span>
                    <span className="rounded bg-white/20 px-2 py-0.5 font-mono text-[11px] font-black">
                      {getEffectiveLikes(selectedStory).toLocaleString()}
                    </span>
                  </motion.button>
                </div>

                {/* 7. Practice Test Integration CTA */}
                <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Apply These Strategies Right Now
                    </p>
                    <h4 className="text-lg font-bold text-white">
                      Practice with {selectedStory.recommendedPracticeTest.title}
                    </h4>
                    <p className="text-xs text-slate-300">
                      Authentic computer-delivered interface with instant timer and automated assessment.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const { section, id } = selectedStory.recommendedPracticeTest;
                      setSelectedStory(null);
                      onNavigateToTest(section, id);
                    }}
                    className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 px-6 py-3.5 text-xs sm:text-sm font-black text-white transition-all shadow-md cursor-pointer"
                  >
                    <span>Start This Practice Test</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
