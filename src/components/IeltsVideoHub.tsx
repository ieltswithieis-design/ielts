import React, { useState, useMemo } from "react";
import { 
  allIeltsYoutubeTrends, 
  IELTS_TRENDING_CATEGORIES, 
  IeltsTrendingTopic 
} from "../data/ieltsYoutubeTrendsData";
import { TestSection } from "../types/ielts";
import { 
  Search, 
  Youtube, 
  ExternalLink, 
  TrendingUp, 
  Filter, 
  Sparkles, 
  Flame,
  CheckCircle2,
  Copy,
  SlidersHorizontal,
  Compass,
  Zap,
  ArrowUpRight,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IeltsVideoHubProps {
  onNavigateToTest: (section: TestSection | "fulltests", testId: number) => void;
}

export const IeltsVideoHub: React.FC<IeltsVideoHubProps> = ({ onNavigateToTest }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);
  const [itemsPerCategoryLimit, setItemsPerCategoryLimit] = useState<number | "all">("all");

  // Directly launches query search on YouTube in a new tab
  const handleOpenYoutubeSearch = (query: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const encoded = encodeURIComponent(query);
    try {
      window.open(`https://www.youtube.com/results?search_query=${encoded}`, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.warn("Popup blocked or not allowed in iframe sandbox:", err);
    }
  };

  const handleCopyQuery = (topic: IeltsTrendingTopic, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(topic.query);
      setCopiedQueryId(topic.id);
      setTimeout(() => setCopiedQueryId(null), 2000);
    }
  };

  // Compute maximum number of topics in each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "All Categories": allIeltsYoutubeTrends.length
    };
    allIeltsYoutubeTrends.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter topics based on category and search query, respecting max limit
  const filteredTopics = useMemo(() => {
    let list = allIeltsYoutubeTrends.filter(topic => {
      const matchesCategory = 
        selectedCategory === "All Categories" || topic.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch = 
        topic.title.toLowerCase().includes(q) ||
        topic.query.toLowerCase().includes(q) ||
        topic.category.toLowerCase().includes(q) ||
        topic.keyFocus.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    if (itemsPerCategoryLimit !== "all") {
      list = list.slice(0, itemsPerCategoryLimit);
    }

    return list;
  }, [selectedCategory, searchQuery, itemsPerCategoryLimit]);

  // Generate dynamic contextual YouTube search query boxes based on user's search
  const dynamicSearchBoxes = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    return [
      {
        title: `Direct: "${q}"`,
        query: `IELTS ${q}`,
        tag: "Direct Match",
        iconColor: "text-red-500",
        bgHover: "hover:border-red-500"
      },
      {
        title: `Band 9 Walkthrough: "${q}"`,
        query: `IELTS ${q} Band 9 Model Answer`,
        tag: "Band 9 Masterclass",
        iconColor: "text-amber-400",
        bgHover: "hover:border-amber-400"
      },
      {
        title: `Examiner Scoring Secrets: "${q}"`,
        query: `IELTS Examiner Secrets ${q}`,
        tag: "Examiner Breakdown",
        iconColor: "text-purple-400",
        bgHover: "hover:border-purple-400"
      },
      {
        title: `Cambridge Practice: "${q}"`,
        query: `Cambridge IELTS ${q} Solved`,
        tag: "Cambridge Official",
        iconColor: "text-blue-400",
        bgHover: "hover:border-blue-400"
      },
      {
        title: `Top Mistakes to Avoid: "${q}"`,
        query: `Common Mistakes IELTS ${q} Band 6 vs Band 8`,
        tag: "Mistakes to Avoid",
        iconColor: "text-emerald-400",
        bgHover: "hover:border-emerald-400"
      },
      {
        title: `Speed & Strategy: "${q}"`,
        query: `Fast Strategy Tricks IELTS ${q}`,
        tag: "Speed Tactics",
        iconColor: "text-cyan-400",
        bgHover: "hover:border-cyan-400"
      }
    ];
  }, [searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. HERO BANNER: IELTS YOUTUBE SEARCH DIRECTORY (IMAGES ONLY, NO EMBEDDED VIDEOS) */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-red-950/90 to-slate-900 p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(239,68,68,0.22),transparent_65%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/20 px-3.5 py-1 text-xs font-bold text-red-300 backdrop-blur-md">
            <Youtube className="h-4 w-4 text-red-400 fill-red-400" />
            <span>Official IELTS YouTube Search Directory</span>
            <span className="text-slate-400">•</span>
            <span>Top Trending Topics</span>
          </div>

          <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            IELTS Trending Topics & Direct YouTube Search Launcher
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            No video playback delays — only curated high-yield trending IELTS topics and image briefings. Click any card or relevant search box to open real-time lessons, tutorials, and examiner walkthroughs directly on YouTube.
          </p>

          {/* Quick Stats Grid with Interactive Animation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-left">
            <motion.div 
              whileHover={{ scale: 1.03, y: -2 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm shadow-xs"
            >
              <span className="text-xs text-slate-400 font-medium">Curated Topics</span>
              <p className="text-xl sm:text-2xl font-black text-white">{allIeltsYoutubeTrends.length} Topics</p>
              <span className="text-[10px] text-red-300 font-semibold">Across 9 Categories</span>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03, y: -2 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm shadow-xs"
            >
              <span className="text-xs text-slate-400 font-medium">Monthly Searches</span>
              <p className="text-xl sm:text-2xl font-black text-amber-300">50M+ On YouTube</p>
              <span className="text-[10px] text-amber-200/70 font-semibold">Real Candidate Volume</span>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03, y: -2 }}
              className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm shadow-xs"
            >
              <span className="text-xs text-slate-400 font-medium">Integration Mode</span>
              <p className="text-xl sm:text-2xl font-black text-red-400">Direct Search</p>
              <span className="text-[10px] text-slate-300 font-semibold">Instant New Tab</span>
            </motion.div>
          </div>

          {/* SEARCH BOX: DYNAMIC RELEVANT SEARCH BOXES */}
          <div className="pt-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    handleOpenYoutubeSearch(searchQuery.trim());
                  }
                }}
                placeholder="Type any IELTS topic (e.g. True False Not Given, Cue Card, Bar Chart, Band 9 Speaking)..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/95 pl-12 pr-28 py-3.5 text-sm text-white placeholder-slate-400 focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-500/30 transition shadow-inner"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="rounded-lg px-2 py-1 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                {searchQuery.trim() && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenYoutubeSearch(searchQuery.trim())}
                    className="flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-black text-white hover:bg-red-500 transition shadow-xs cursor-pointer"
                  >
                    <span>Search</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* DYNAMIC RELEVANT SEARCH BOXES: Appears when typing query */}
            <AnimatePresence>
              {searchQuery.trim().length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-red-500/40 bg-slate-900/95 p-4 shadow-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      Relevant YouTube Search Launchers for "{searchQuery}":
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                      Click any box to open search on YouTube
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {dynamicSearchBoxes.map((box, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleOpenYoutubeSearch(box.query)}
                        className={`flex flex-col justify-between rounded-xl bg-slate-800/90 hover:bg-slate-750 p-3 text-left border border-slate-700 ${box.bgHover} transition-all cursor-pointer group shadow-xs`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {box.tag}
                          </span>
                          <Youtube className={`h-3.5 w-3.5 ${box.iconColor} fill-current`} />
                        </div>
                        <div className="font-bold text-xs text-white group-hover:text-red-300 transition-colors truncate">
                          {box.title}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                          <span className="truncate font-mono text-[10px] text-slate-300">
                            "{box.query}"
                          </span>
                          <ArrowUpRight className="h-3 w-3 text-slate-400 group-hover:text-white shrink-0 ml-1" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SELECTOR PILLS WITH MAX NUMBER DISPLAY IN EACH CATEGORY */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600">
            <Filter className="h-4 w-4 text-red-600" />
            <span>IELTS Categories & Max Topics</span>
          </div>

          {/* Max Items Limit Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Display Limit:
            </span>
            <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setItemsPerCategoryLimit(4)}
                className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                  itemsPerCategoryLimit === 4
                    ? "bg-red-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Top 4
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setItemsPerCategoryLimit(6)}
                className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                  itemsPerCategoryLimit === 6
                    ? "bg-red-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Top 6
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setItemsPerCategoryLimit("all")}
                className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                  itemsPerCategoryLimit === "all"
                    ? "bg-red-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All (Max)
              </motion.button>
            </div>
          </div>
        </div>

        {/* Category Pills showing exact max item numbers */}
        <div className="flex flex-wrap gap-2">
          {IELTS_TRENDING_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-red-600 text-white shadow-sm ring-2 ring-red-500/30"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span>{cat}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING TOPICS GRID (IMAGE ONLY, NO VIDEOS, DIRECT YOUTUBE OPEN) */}
      {filteredTopics.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <Search className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="text-base font-bold text-slate-800">No matching trending topics</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try searching for another keyword or select "All Categories" to view all available topics.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Categories");
              setItemsPerCategoryLimit("all");
            }}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer"
          >
            Reset Filters
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.3) }}
              whileHover={{ y: -6 }}
              onClick={() => handleOpenYoutubeSearch(topic.query)}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs hover:shadow-xl hover:border-red-300 transition-all cursor-pointer"
            >
              {/* Card Image (Strictly Image, No Video Player) */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  src={topic.image}
                  alt={topic.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-xl bg-red-600/90 px-2.5 py-1 text-[11px] font-black tracking-wide text-white backdrop-blur-md shadow-xs flex items-center gap-1">
                    <Flame className="h-3 w-3 fill-white" />
                    {topic.trendBadge}
                  </span>

                  <span className="rounded-xl bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold text-slate-200 backdrop-blur-md border border-white/10">
                    {topic.category}
                  </span>
                </div>

                {/* Bottom Search Volume on Image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {topic.searchVolume}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-200 bg-black/60 px-2.5 py-0.5 rounded-lg backdrop-blur-xs">
                    {topic.recommendedFor}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-5 space-y-3">
                <h3 className="font-serif text-base font-bold text-slate-900 leading-snug group-hover:text-red-600 transition-colors">
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {topic.keyFocus}
                </p>

                {/* Search Query Preview Box with Copy action */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] font-mono font-bold text-slate-700 truncate">
                      "{topic.query}"
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleCopyQuery(topic, e)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition shrink-0 cursor-pointer"
                    title="Copy search query"
                  >
                    {copiedQueryId === topic.id ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>

                {/* Direct Action Button to Launch YouTube */}
                <div className="mt-auto pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => handleOpenYoutubeSearch(topic.query, e)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-xs font-black transition shadow-2xs group-hover:shadow-md cursor-pointer"
                  >
                    <Youtube className="h-4 w-4 fill-white" />
                    <span>Search on YouTube</span>
                    <ExternalLink className="h-3.5 w-3.5 ml-0.5 opacity-80" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 4. IELTS STUDY FAQ & SEARCH GUIDE */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-red-600" />
          <h2 className="text-lg font-bold text-slate-900">How to Use YouTube IELTS Trends for Preparation</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <motion.div 
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-2"
          >
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-black">1</span>
              Watch High-Band Mocks
            </h4>
            <p className="leading-relaxed">
              Use the Speaking Band 9 and Cambridge Walkthrough queries to observe candidates responding naturally without rehearsed or robotic pauses.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-2"
          >
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-black">2</span>
              Understand Official Descriptors
            </h4>
            <p className="leading-relaxed">
              Former British Council and IDP examiners explain the subtle differences between Band 6.5 and Band 7.0 that students often miss.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-2"
          >
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-black">3</span>
              Practice Real Tests on Lingofi
            </h4>
            <p className="leading-relaxed">
              After researching strategies on YouTube, reinforce your skills immediately by taking the full computer-delivered mock-test library on Lingofi.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
