import React, { useState, useEffect } from "react";
import { TestSection, IeltsDatabase, FullIeltsTest } from "./types/ielts";
import { ieltsDatabase as defaultIeltsDatabase } from "./data/ieltsData";
import { fullIeltsTests as defaultFullTests } from "./data/fullTestsData";
import { loadProgress, resetSectionProgress, ProgressState } from "./utils/storage";
import { Header, NavTab } from "./components/Header";
import { stopAllActiveMedia } from "./utils/audioControl";
import { Dashboard } from "./components/Dashboard";
import { SectionListView } from "./components/SectionListView";
import { ReadingRunner } from "./components/ReadingRunner";
import { ListeningRunner } from "./components/ListeningRunner";
import { WritingRunner } from "./components/WritingRunner";
import { SpeakingRunner } from "./components/SpeakingRunner";
import { FormatGuide } from "./components/FormatGuide";
import { CertificateTRF } from "./components/CertificateTRF";
import { FullTestListView } from "./components/FullTestListView";
import { FullTestRunner } from "./components/FullTestRunner";
import { CertificateVerificationPortal } from "./components/CertificateVerificationPortal";
import { BlogStoriesView } from "./components/BlogStoriesView";
import { IeltsVideoHub } from "./components/IeltsVideoHub";
import { IqTestRunner } from "./components/IqTestRunner";
import { IqCertificate } from "./components/IqCertificate";
import { IqScoreBreakdown } from "./types/iq";
import { useLanguage } from "./context/LanguageContext";
import { useAuth } from "./context/AuthContext";
import {
  loadDatabaseFromBackend,
  loadFullTestsFromBackend,
  recordTestSubmission,
  loadStandardizedDatabase,
} from "./services/databaseService";
import { DirectorDatabaseStudio } from "./components/DirectorDatabaseStudio";
import { DirectorLeadsStudio } from "./components/DirectorLeadsStudio";
import { AuthModal } from "./components/AuthModal";
import { StandardizedExamsHub } from "./components/StandardizedExamsHub";
import { StandardizedTestRunner } from "./components/StandardizedTestRunner";
import { PteAcademicHub } from "./components/PteAcademicHub";
import { StandardizedScoreReport } from "./components/StandardizedScoreReport";
import { StandardizedExamId, StandardizedTestResult, StandardizedDatabase } from "./types/standardizedTests";
import { STANDARDIZED_TEST_PACKAGES } from "./data/standardizedTestsData";

export default function App() {
  const { t, isRTL } = useLanguage();
  const { user, isAuthenticated, requireSignup, isAuthModalRequired } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [activeTest, setActiveTest] = useState<{ section: TestSection; id: number } | null>(null);
  const [activeFullTest, setActiveFullTest] = useState<FullIeltsTest | null>(null);
  const [activeStandardizedExam, setActiveStandardizedExam] = useState<StandardizedExamId | null>(null);
  const [activeStandardizedPackageId, setActiveStandardizedPackageId] = useState<string | null>(null);
  const [standardizedResult, setStandardizedResult] = useState<StandardizedTestResult | null>(null);
  const [standardizedDatabase, setStandardizedDatabase] = useState<StandardizedDatabase | null>(null);
  const [verificationTrfCode, setVerificationTrfCode] = useState<string>("");
  const [progress, setProgress] = useState<ProgressState>({ completed: {}, attempts: {} });
  const [iqScoreData, setIqScoreData] = useState<IqScoreBreakdown | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  // Decoupled Database State (served live from /database)
  const [database, setDatabase] = useState<IeltsDatabase>(defaultIeltsDatabase);
  const [fullTests, setFullTests] = useState<FullIeltsTest[]>(defaultFullTests);

  const refreshDatabase = async () => {
    try {
      const [db, ft, standardized] = await Promise.all([
        loadDatabaseFromBackend(),
        loadFullTestsFromBackend(),
        loadStandardizedDatabase().catch(() => null),
      ]);
      setDatabase(db);
      setFullTests(ft);
      if (standardized) setStandardizedDatabase(standardized);
    } catch (err) {
      console.warn("Using offline bundled database:", err);
    }
  };

  useEffect(() => {
    setProgress(loadProgress());
    refreshDatabase();
  }, []);
  // Require an account after 40 seconds of site use. Once authenticated,
  // the candidate has unlimited access for the active session and this gate
  // is permanently bypassed until they log out.
  useEffect(() => {
    const timerKey = "lingofi_site_access_started_at";

    if (isAuthenticated) {
      sessionStorage.removeItem(timerKey);
      return;
    }

    let startedAt = Number(sessionStorage.getItem(timerKey) || 0);
    if (!startedAt || !Number.isFinite(startedAt)) {
      startedAt = Date.now();
      sessionStorage.setItem(timerKey, String(startedAt));
    }

    const checkLimit = () => {
      if (!isAuthenticated && Date.now() - startedAt >= 40 * 1000) {
        requireSignup();
      }
    };

    checkLimit();
    const interval = window.setInterval(checkLimit, 1000);
    return () => window.clearInterval(interval);
  }, [isAuthenticated, requireSignup]);


  // Database studio is Director-only. Any stale navigation state is immediately removed for other roles.
  useEffect(() => {
    if ((currentTab === "database-studio" || currentTab === "director-leads") && user?.role !== "admin") {
      setCurrentTab("dashboard");
      stopAllActiveMedia();
    }
  }, [currentTab, user?.role]);

  // Changing sections always terminates the previous test's speech, audio and media immediately.
  useEffect(() => {
    stopAllActiveMedia();
  }, [currentTab]);

  const handleRefreshProgress = () => {
    setProgress(loadProgress());
  };

  const handleSelectTest = (section: TestSection, id: number) => {
    stopAllActiveMedia();
    setActiveFullTest(null);
    setActiveStandardizedExam(null);
    setStandardizedResult(null);
    setActiveTest({ section, id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectFullTest = (fullTest: FullIeltsTest) => {
    stopAllActiveMedia();
    setActiveTest(null);
    setActiveStandardizedExam(null);
    setStandardizedResult(null);
    setActiveFullTest(fullTest);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectStandardizedExam = (examId: StandardizedExamId, packageId?: string) => {
    stopAllActiveMedia();
    setActiveTest(null);
    setActiveFullTest(null);
    setStandardizedResult(null);
    setActiveStandardizedPackageId(packageId || null);
    if (examId === "pte" && !packageId) {
      setActiveStandardizedExam(null);
      setCurrentTab("pte");
    } else {
      setActiveStandardizedExam(examId);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToCatalog = () => {
    stopAllActiveMedia();
    setActiveTest(null);
    setActiveFullTest(null);
    setActiveStandardizedExam(null);
    setActiveStandardizedPackageId(null);
    setStandardizedResult(null);
    handleRefreshProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenCertificate = () => {
    handleRefreshProgress();
    setActiveTest(null);
    setActiveFullTest(null);
    setActiveStandardizedExam(null);
    setStandardizedResult(null);
    setCurrentTab("certificate");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTestCompleteAndRedirectToTRF = () => {
    handleRefreshProgress();
    // Save submission to /database
    if (activeFullTest) {
      recordTestSubmission({
        trfCode: `26GB${Date.now().toString().slice(-6)}LING901A`,
        candidateName: user?.name || "Official Candidate",
        userEmail: user?.email || "candidate@student.com",
        testId: activeFullTest.id,
        testTitle: activeFullTest.title,
        overallBand: 7.5,
        scores: { reading: 7.5, listening: 7.5, writing: 7.0, speaking: 7.5 },
      });
    }
    setActiveTest(null);
    setActiveFullTest(null);
    setCurrentTab("certificate");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenVerificationPortal = (trfCode?: string | unknown) => {
    setActiveTest(null);
    setActiveFullTest(null);
    setActiveStandardizedExam(null);
    setStandardizedResult(null);
    if (typeof trfCode === "string" && trfCode.trim()) {
      setVerificationTrfCode(trfCode.trim());
    } else {
      setVerificationTrfCode("");
    }
    setCurrentTab("verify");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetAllProgress = () => {
    setShowResetConfirmModal(true);
  };

  const handleConfirmReset = () => {
    localStorage.removeItem("ielts_mastery_progress_v2");
    setProgress({ completed: {}, attempts: {} });
    setShowResetConfirmModal(false);
  };

  const handleNavigateFromContent = (section: TestSection | "fulltests", testId: number) => {
    if (section === "fulltests") {
      const ft = fullTests.find(t => t.id === testId) || fullTests[0];
      handleSelectFullTest(ft);
    } else {
      handleSelectTest(section, testId);
    }
  };

  const totalModularTests =
    (database.reading?.length || 0) +
    (database.listening?.length || 0) +
    (database.writing?.length || 0) +
    (database.speaking?.length || 0);

  const completedCount = Object.keys(progress.completed).length;

  const canGoBack = Boolean(
    activeTest ||
      activeFullTest ||
      activeStandardizedExam ||
      standardizedResult ||
      currentTab !== "dashboard"
  );

  const handleUniversalBack = () => {
    if (activeTest || activeFullTest || activeStandardizedExam || standardizedResult) {
      handleBackToCatalog();
    } else {
      setCurrentTab("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Keyboard shortcut: Press Escape to trigger Universal Back on PC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (e.key === "Escape" && canGoBack && !isInput && !isAuthModalRequired) {
        handleUniversalBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canGoBack, activeTest, activeFullTest, activeStandardizedExam, standardizedResult, currentTab, isAuthModalRequired]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans max-w-full overflow-x-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Top Navigation */}
      <Header
        currentTab={
          activeFullTest
            ? "fulltests"
            : activeTest
            ? activeTest.section
            : activeStandardizedExam
            ? activeStandardizedExam
            : currentTab
        }
        onSelectTab={tab => {
          setActiveTest(null);
          setActiveFullTest(null);
          setActiveStandardizedExam(null);
          setStandardizedResult(null);

          // Direct jump to international exams
          if (["pte", "sat", "gre", "gmat", "toefl", "act"].includes(tab)) {
            // Exam headings always open their subtype/package catalogue first.
            // A test only starts after the user explicitly selects a package.
            setActiveStandardizedExam(null);
            setActiveStandardizedPackageId(null);
            setCurrentTab(tab);
          } else {
            setCurrentTab(tab);
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        completedCount={completedCount}
        totalTests={totalModularTests}
        fullMockCount={fullTests.length}
        sectionCounts={{ reading: database.reading.length, listening: database.listening.length, writing: database.writing.length, speaking: database.speaking.length }}
        onResetProgress={handleResetAllProgress}
        canGoBack={canGoBack}
        onBack={handleUniversalBack}
      />

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-6 sm:py-6 max-w-full overflow-x-hidden">
        {/* Dedicated Mobile Back Button Bar when in Test Mode */}
        {(activeTest || activeFullTest || activeStandardizedExam || standardizedResult) && (
          <div className="sm:hidden mb-3 flex items-center justify-between rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-2.5 shadow-xs">
            <button
              onClick={handleBackToCatalog}
              className="flex items-center gap-2 text-xs font-black text-blue-900 active:scale-95 transition cursor-pointer"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-black shadow-xs">
                ←
              </span>
              <span>{t("backToHub", "Back to Practice Hub")}</span>
            </button>
            <span className="rounded-md bg-white border border-blue-200/80 px-2 py-0.5 text-[10px] font-black text-blue-800 uppercase">
              {activeFullTest
                ? "Full Mock"
                : activeStandardizedExam
                ? `${activeStandardizedExam.toUpperCase()} Exam`
                : `${activeTest?.section.toUpperCase()} #${activeTest?.id}`}
            </span>
          </div>
        )}

        {/* 1. Standardized Score Report View */}
        {standardizedResult ? (
          <StandardizedScoreReport
            result={standardizedResult}
            onRetake={() => {
              setActiveStandardizedExam(standardizedResult?.examId || "pte");
              setStandardizedResult(null);
            }}
            onBackToHub={() => {
              setStandardizedResult(null);
              setActiveStandardizedExam(null);
              setCurrentTab("international-exams");
            }}
          />
        ) : activeStandardizedExam ? (
          /* 2. Standardized Exam Runner (PTE, SAT, GRE, GMAT, TOEFL, ACT) */
          <StandardizedTestRunner
            key={activeStandardizedPackageId || activeStandardizedExam || "standardized-new"}
            testPackage={
              (activeStandardizedPackageId && standardizedDatabase?.packages?.find(p => p.id === activeStandardizedPackageId)) ||
              (activeStandardizedExam && standardizedDatabase?.packages?.find(p => p?.examId === activeStandardizedExam && p.published !== false)) ||
              (activeStandardizedPackageId && STANDARDIZED_TEST_PACKAGES.find(p => p.id === activeStandardizedPackageId)) ||
              (activeStandardizedExam && STANDARDIZED_TEST_PACKAGES.find(p => p?.examId === activeStandardizedExam)) ||
              STANDARDIZED_TEST_PACKAGES[0]
            }
            onBack={handleBackToCatalog}
            onCompleteTest={res => {
              setStandardizedResult(res);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : activeFullTest ? (
          /* 3. Full IELTS Simulation Runner (Using database state) */
          <FullTestRunner
            key={`full-${activeFullTest.id}`}
            test={activeFullTest}
            database={database}
            progress={progress}
            onBack={handleBackToCatalog}
            onComplete={handleRefreshProgress}
            onOpenCertificate={handleTestCompleteAndRedirectToTRF}
            onOpenVerificationPortal={handleOpenVerificationPortal}
          />
        ) : activeTest ? (
          /* 4. Single Section Runner View (Reading, Listening, Writing, Speaking) */
          <div>
            {activeTest.section === "reading" && (
              <ReadingRunner
                key={`reading-${activeTest.id}`}
                test={database.reading.find(t => t.id === activeTest.id) || database.reading[0]}
                onBack={handleBackToCatalog}
                onComplete={handleTestCompleteAndRedirectToTRF}
              />
            )}

            {activeTest.section === "listening" && (
              <ListeningRunner
                key={`listening-${activeTest.id}`}
                test={database.listening.find(t => t.id === activeTest.id) || database.listening[0]}
                onBack={handleBackToCatalog}
                onComplete={handleTestCompleteAndRedirectToTRF}
              />
            )}

            {activeTest.section === "writing" && (
              <WritingRunner
                key={`writing-${activeTest.id}`}
                test={database.writing.find(t => t.id === activeTest.id) || database.writing[0]}
                onBack={handleBackToCatalog}
                onComplete={handleTestCompleteAndRedirectToTRF}
              />
            )}

            {activeTest.section === "speaking" && (
              <SpeakingRunner
                key={`speaking-${activeTest.id}`}
                test={database.speaking.find(t => t.id === activeTest.id) || database.speaking[0]}
                onBack={handleBackToCatalog}
                onComplete={handleTestCompleteAndRedirectToTRF}
                onOpenCertificate={handleTestCompleteAndRedirectToTRF}
              />
            )}
          </div>
        ) : (
          /* 5. Tabbed Views */
          <div>
            {currentTab === "dashboard" && (
              <Dashboard
                database={database}
                progress={progress}
                onSelectTest={handleSelectTest}
                fullMockCount={fullTests.length}
                standardizedDatabase={standardizedDatabase}
                sectionCounts={{ reading: database.reading.length, listening: database.listening.length, writing: database.writing.length, speaking: database.speaking.length }}
                onSelectSection={sec => {
                  setCurrentTab(sec);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenCertificate={handleOpenCertificate}
                onSelectFullTests={() => {
                  setCurrentTab("fulltests");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenVerificationPortal={handleOpenVerificationPortal}
                onOpenBlog={() => {
                  setCurrentTab("blog");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenVideos={() => {
                  setCurrentTab("videos");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onSelectIqTest={() => {
                  setCurrentTab("iqtest");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onSelectIqCert={() => {
                  setCurrentTab("iqcert");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onSelectInternationalExams={() => {
                  setCurrentTab("international-exams");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onSelectIelts={() => {
                  setCurrentTab("fulltests");
                  setActiveStandardizedExam(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onSelectStandardizedTest={(examId, packageId) => {
                  handleSelectStandardizedExam(examId, packageId);
                }}
              />
            )}

            {/* Director-only database import/export studio */}
            {currentTab === "database-studio" && user?.role === "admin" && (
              <DirectorDatabaseStudio
                onClose={() => { setCurrentTab("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onImported={() => { void refreshDatabase(); }}
              />
            )}

            {currentTab === "director-leads" && user?.role === "admin" && (
              <DirectorLeadsStudio onClose={() => { setCurrentTab("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
            )}

            {currentTab === "pte" && standardizedDatabase?.exams?.pte && (
              <PteAcademicHub
                meta={standardizedDatabase.exams.pte}
                packages={standardizedDatabase.packages.filter(p => p.examId === "pte" && p.published !== false)}
                onStart={(packageId) => handleSelectStandardizedExam("pte", packageId)}
                onBack={() => setCurrentTab("international-exams")}
              />
            )}

            {["sat", "gre", "gmat", "toefl", "act"].includes(currentTab) && standardizedDatabase?.exams?.[currentTab] && (
              <StandardizedExamsHub
                database={standardizedDatabase}
                initialExamId={currentTab}
                onSelectStandardizedTest={handleSelectStandardizedExam}
                onSelectIelts={() => { setCurrentTab("fulltests"); setActiveStandardizedExam(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onSelectIqTest={() => setCurrentTab("iqtest")}
              />
            )}

            {/* International Standardized Exams Portal */}
            {currentTab === "international-exams" && (
              <StandardizedExamsHub
                onSelectStandardizedTest={handleSelectStandardizedExam}
                onSelectIelts={() => {
                  setCurrentTab("fulltests");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onSelectIqTest={() => {
                  setCurrentTab("iqtest");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {currentTab === "blog" && (
              <BlogStoriesView onNavigateToTest={handleNavigateFromContent} />
            )}

            {currentTab === "videos" && (
              <IeltsVideoHub onNavigateToTest={handleNavigateFromContent} />
            )}

            {currentTab === "fulltests" && (
              <FullTestListView
                progress={progress}
                tests={fullTests}
                onSelectFullTest={handleSelectFullTest}
                onOpenCertificate={handleOpenCertificate}
              />
            )}

            {(currentTab === "reading" ||
              currentTab === "listening" ||
              currentTab === "writing" ||
              currentTab === "speaking") && (
              <SectionListView
                section={currentTab}
                database={database}
                progress={progress}
                onSelectTest={handleSelectTest}
              />
            )}

            {currentTab === "guide" && <FormatGuide />}

            {currentTab === "certificate" && (
              <CertificateTRF
                progress={progress}
                onClose={() => {
                  setCurrentTab("dashboard");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenVerificationPortal={handleOpenVerificationPortal}
                onNavigateToTest={sec => {
                  setCurrentTab(sec);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {currentTab === "verify" && (
              <CertificateVerificationPortal
                initialTrfCode={verificationTrfCode}
                onBackToApp={() => {
                  setCurrentTab("dashboard");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onViewCertificate={() => {
                  setCurrentTab("certificate");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {currentTab === "iqtest" && (
              <IqTestRunner
                onBack={() => {
                  setCurrentTab("dashboard");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenCertificate={results => {
                  setIqScoreData(results);
                  setCurrentTab("iqcert");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {currentTab === "iqcert" && (
              <IqCertificate
                scoreData={iqScoreData || undefined}
                onBack={() => {
                  setCurrentTab("iqtest");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenVerificationPortal={handleOpenVerificationPortal}
                onRetake={() => {
                  setCurrentTab("iqtest");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Candidate / Teacher / Admin Auth Modal */}
      <AuthModal />

      {/* Footer - Alfa PTE Style */}
      <footer className="border-t border-[#01cfe1]/20 bg-[#06182a] py-8 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-slate-300">
            <button onClick={() => { setCurrentTab("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-[#01cfe1] transition cursor-pointer">{t("navDashboard", "Overview")}</button>
            {user?.role === "admin" && (
              <button onClick={() => { setCurrentTab("database-studio"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-emerald-400 font-black hover:underline cursor-pointer">Director Database</button>
            )}
            <button onClick={() => { setCurrentTab("international-exams"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-[#01cfe1] font-black hover:underline cursor-pointer">PTE • SAT • GRE • GMAT</button>
            <button onClick={() => { setCurrentTab("fulltests"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-[#01cfe1] transition cursor-pointer">{t("navFullTests", "Full Mocks")}</button>
            <button onClick={() => { setCurrentTab("reading"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-[#01cfe1] transition cursor-pointer">{t("navReading", "Reading Bank")}</button>
            <button onClick={() => { setCurrentTab("listening"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-[#01cfe1] transition cursor-pointer">{t("navListening", "Listening Lab")}</button>
            <button onClick={() => { setCurrentTab("writing"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-[#01cfe1] transition cursor-pointer">{t("navWriting", "Writing Grader")}</button>
            <button onClick={() => { setCurrentTab("speaking"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-[#01cfe1] transition cursor-pointer">{t("navSpeaking", "Speaking Coach")}</button>
            <button onClick={() => { setCurrentTab("iqtest"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-purple-300 font-extrabold hover:underline cursor-pointer">{t("navIqTest", "Standardized IQ Test")}</button>
            <button onClick={() => { setCurrentTab("iqcert"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-amber-400 font-extrabold hover:underline cursor-pointer">{t("navIqCertificate", "Official IQ Certificate")}</button>
            <button onClick={() => { setCurrentTab("blog"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-indigo-300 hover:underline cursor-pointer">{t("navBlog", "Stories & Guides")}</button>
            <button onClick={() => { setCurrentTab("videos"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-red-400 hover:underline cursor-pointer">{t("navVideos", "Video Masterclasses")}</button>
            <button onClick={() => { setCurrentTab("certificate"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-[#01cfe1] transition cursor-pointer">{t("navCertificate", "TRF Certificate")}</button>
            <button onClick={() => { setCurrentTab("verify"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-emerald-400 hover:underline cursor-pointer">{t("navVerify", "Direct Verification Portal")}</button>
            <button onClick={() => { setCurrentTab("guide"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-[#01cfe1] transition cursor-pointer">{t("navGuide", "Exam Format Guide")}</button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 text-[11px]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-bold text-white">
                LingoFi • Official International Testing Platform & Examination Institute
              </span>
            </div>
            <span className="text-slate-400">Decoupled Database Storage (/database) • Real-time Test Uploader • Multi-Role Auth</span>
          </div>
        </div>
      </footer>

      {/* Reset Progress Confirmation Dialog */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Reset All Exam Progress?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will wipe all completed tests, score breakdowns, and saved session tokens. This action is irreversible.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-black text-white shadow-md transition active:scale-95 cursor-pointer"
              >
                Yes, Reset All Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
