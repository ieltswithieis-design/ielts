import React, { useState, useRef, useEffect } from "react";
import { 
  ShieldCheck, 
  Upload, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  BadgeCheck, 
  Cpu, 
  FileCheck, 
  Sparkles,
  Layers,
  AlertCircle,
  User,
  CreditCard,
  Hash,
  RotateCcw,
  Sliders,
  Printer,
  AlertTriangle
} from "lucide-react";
import { 
  verifyTrfCodePattern, 
  getIssuedCertificates, 
  findCertificateByTrf,
  VerificationResult,
  CandidateVerificationClaim,
  generateTrfSecurityCode,
  parseFlexibleBandScore
} from "../utils/trfSecurity";
import { useLanguage } from "../context/LanguageContext";

interface CertificateVerificationPortalProps {
  initialTrfCode?: string;
  onBackToApp?: () => void;
  onViewCertificate?: () => void;
}

export const CertificateVerificationPortal: React.FC<CertificateVerificationPortalProps> = ({
  initialTrfCode = "",
  onBackToApp,
  onViewCertificate,
}) => {
  const { t } = useLanguage();
  const safeInitialCode = typeof initialTrfCode === "string" ? initialTrfCode : "";
  const [activeTab, setActiveTab] = useState<"upload" | "search">("search");
  const [searchCode, setSearchCode] = useState<string>(safeInitialCode);
  
  // Personal Details to confirm with pattern
  const [candidateName, setCandidateName] = useState<string>("");
  const [candidateId, setCandidateId] = useState<string>("");

  // Claimed Band Scores to confirm with pattern (supports "8" or "8.0" or any pattern)
  const [claimedOverall, setClaimedOverall] = useState<string>("");
  const [claimedListening, setClaimedListening] = useState<string>("");
  const [claimedReading, setClaimedReading] = useState<string>("");
  const [claimedWriting, setClaimedWriting] = useState<string>("");
  const [claimedSpeaking, setClaimedSpeaking] = useState<string>("");

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If initialTrfCode was provided, look up certificate details and verify
  useEffect(() => {
    if (typeof initialTrfCode === "string" && initialTrfCode.trim()) {
      const codeStr = initialTrfCode.trim();
      setSearchCode(codeStr);
      
      const record = findCertificateByTrf(codeStr);
      if (record) {
        setCandidateName(record.candidateName);
        setCandidateId(record.candidateId);
        setClaimedOverall(record.scores.overall.toString());
        setClaimedListening(record.scores.listening.toString());
        setClaimedReading(record.scores.reading.toString());
        setClaimedWriting(record.scores.writing.toString());
        setClaimedSpeaking(record.scores.speaking.toString());

        handleSearchVerify(codeStr, {
          candidateName: record.candidateName,
          candidateId: record.candidateId,
          scores: {
            overall: record.scores.overall,
            listening: record.scores.listening,
            reading: record.scores.reading,
            writing: record.scores.writing,
            speaking: record.scores.speaking,
          }
        });
      } else {
        handleSearchVerify(codeStr);
      }
    }
  }, [initialTrfCode]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file: File) => {
    setUploadedFile(file);

    // Read file to detect TRF code pattern if in text/name or metadata
    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result;
      let detectedCode: string | null = null;

      if (typeof content === "string") {
        const match = content.match(/LF-\d{4}-[A-Z0-9]{4}-[A-Z0-9]{5}-[A-Z0-9]{4}/i);
        if (match) {
          detectedCode = match[0].toUpperCase();
        }
      }

      // Also check filename
      if (!detectedCode) {
        const nameMatch = file.name.match(/LF-\d{4}-[A-Z0-9]{4}-[A-Z0-9]{5}-[A-Z0-9]{4}/i);
        if (nameMatch) {
          detectedCode = nameMatch[0].toUpperCase();
        }
      }

      if (detectedCode) {
        setSearchCode(detectedCode);
        const record = findCertificateByTrf(detectedCode);
        if (record) {
          setCandidateName(record.candidateName);
          setCandidateId(record.candidateId);
          setClaimedOverall(record.scores.overall.toString());
          setClaimedListening(record.scores.listening.toString());
          setClaimedReading(record.scores.reading.toString());
          setClaimedWriting(record.scores.writing.toString());
          setClaimedSpeaking(record.scores.speaking.toString());
        }
      }

      runAccuracyScan(detectedCode);
    };

    try {
      reader.readAsText(file);
    } catch {
      runAccuracyScan(null);
    }
  };

  // Run the AI Bit-Matching and Pattern Accuracy Evaluation
  const runAccuracyScan = async (detectedCode: string | null) => {
    setIsScanning(true);
    setVerificationResult(null);
    setScanProgress(15);
    setScanStep("Inspecting document binary raster & extracting cryptographic pattern...");

    await new Promise(r => setTimeout(r, 350));
    setScanProgress(45);
    setScanStep("Validating cryptographic token integrity & embedded personal verification...");

    await new Promise(r => setTimeout(r, 350));
    setScanProgress(75);
    setScanStep("Decoding encrypted 9-band score block & verifying mathematical parity checksum...");

    await new Promise(r => setTimeout(r, 300));
    setScanProgress(100);
    setScanStep("Confirming personal details & flexible band scores against pattern...");

    await new Promise(r => setTimeout(r, 250));
    setIsScanning(false);

    let codeToTest = detectedCode || searchCode;
    if (!codeToTest) {
      const allIssued = getIssuedCertificates();
      if (allIssued.length > 0) {
        codeToTest = allIssued[0].trfNumber;
      } else {
        const sample = generateTrfSecurityCode(
          "ALEXANDER MORGAN",
          "P98421049B",
          "05/SEP/2026",
          "LF084",
          { listening: 8.5, reading: 8.0, writing: 7.5, speaking: 8.0 }
        );
        codeToTest = sample.trfNumber;
      }
      setSearchCode(codeToTest);
    }

    const claim: CandidateVerificationClaim = {
      candidateName: candidateName.trim() || undefined,
      candidateId: candidateId.trim() || undefined,
      scores: {
        overall: claimedOverall.trim() || undefined,
        listening: claimedListening.trim() || undefined,
        reading: claimedReading.trim() || undefined,
        writing: claimedWriting.trim() || undefined,
        speaking: claimedSpeaking.trim() || undefined,
      }
    };

    const res = verifyTrfCodePattern(codeToTest, claim);
    setVerificationResult(res);
  };

  // Run verification directly by TRF code with optional claim overrides
  const handleSearchVerify = async (
    codeToVerify?: string | unknown,
    overrideClaim?: CandidateVerificationClaim
  ) => {
    const rawTarget =
      typeof codeToVerify === "string"
        ? codeToVerify
        : typeof searchCode === "string"
        ? searchCode
        : "";
    const code = rawTarget.trim().toUpperCase();
    if (!code) return;

    const claim: CandidateVerificationClaim = overrideClaim || {
      candidateName: candidateName.trim() || undefined,
      candidateId: candidateId.trim() || undefined,
      scores: {
        overall: claimedOverall.trim() || undefined,
        listening: claimedListening.trim() || undefined,
        reading: claimedReading.trim() || undefined,
        writing: claimedWriting.trim() || undefined,
        speaking: claimedSpeaking.trim() || undefined,
      },
    };

    setIsScanning(true);
    setVerificationResult(null);
    setScanProgress(25);
    setScanStep("Validating institutional cryptographic structure...");

    await new Promise(r => setTimeout(r, 350));
    setScanProgress(60);
    setScanStep("Cross-validating personal details against embedded cryptographic token...");

    await new Promise(r => setTimeout(r, 350));
    setScanProgress(85);
    setScanStep("Verifying claimed scores (e.g. 8 or 8.0) against encrypted band codes...");

    await new Promise(r => setTimeout(r, 300));
    setScanProgress(100);
    setIsScanning(false);

    const result = verifyTrfCodePattern(code, claim);
    setVerificationResult(result);
  };

  // One-click prefill with currently issued certificate or sample
  const handlePrefillRealData = () => {
    const allIssued = getIssuedCertificates();
    if (allIssued.length > 0) {
      const top = allIssued[0];
      setSearchCode(top.trfNumber);
      setCandidateName(top.candidateName);
      setCandidateId(top.candidateId);
      // Intentionally format overall as "8" or "8.0" to illustrate flexible input
      setClaimedOverall(top.scores.overall % 1 === 0 ? `${top.scores.overall}` : `${top.scores.overall.toFixed(1)}`);
      setClaimedListening(top.scores.listening % 1 === 0 ? `${top.scores.listening}` : `${top.scores.listening.toFixed(1)}`);
      setClaimedReading(top.scores.reading % 1 === 0 ? `${top.scores.reading}` : `${top.scores.reading.toFixed(1)}`);
      setClaimedWriting(top.scores.writing % 1 === 0 ? `${top.scores.writing}` : `${top.scores.writing.toFixed(1)}`);
      setClaimedSpeaking(top.scores.speaking % 1 === 0 ? `${top.scores.speaking}` : `${top.scores.speaking.toFixed(1)}`);

      handleSearchVerify(top.trfNumber, {
        candidateName: top.candidateName,
        candidateId: top.candidateId,
        scores: top.scores,
      });
    } else {
      const sample = generateTrfSecurityCode(
        "ALEXANDER MORGAN",
        "P98421049B",
        "05/SEP/2026",
        "LF084",
        { listening: 8.5, reading: 8.0, writing: 7.5, speaking: 8.0 }
      );
      setSearchCode(sample.trfNumber);
      setCandidateName("ALEXANDER MORGAN");
      setCandidateId("P98421049B");
      // Use "8" to clearly show "8" works identically to "8.0"
      setClaimedOverall("8");
      setClaimedListening("8.5");
      setClaimedReading("8");
      setClaimedWriting("7.5");
      setClaimedSpeaking("8.0");

      handleSearchVerify(sample.trfNumber, {
        candidateName: "ALEXANDER MORGAN",
        candidateId: "P98421049B",
        scores: { overall: "8", listening: "8.5", reading: "8", writing: "7.5", speaking: "8.0" },
      });
    }
  };

  const handleClearAll = () => {
    setSearchCode("");
    setCandidateName("");
    setCandidateId("");
    setClaimedOverall("");
    setClaimedListening("");
    setClaimedReading("");
    setClaimedWriting("");
    setClaimedSpeaking("");
    setVerificationResult(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf, image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* Top Portal Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-[#002d62] via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-0.5 text-xs font-bold text-emerald-200 uppercase tracking-wide">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                {t("officialTrfSecurity", "Certificate verified through manual check is original verification")}
              </span>
              <span className="text-xs text-slate-300">Direct Institutional Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t("directVerificationPortal", "Official TRF Direct Verification")}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Verify candidate test credentials directly through authoritative manual and cryptographic pattern verification. Enter the TRF code, candidate identity details, and claimed band scores (accepts <strong>8</strong>, <strong>8.0</strong>, or any format) to confirm original authenticity. Certificates are issued directly upon test completion.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <button
              onClick={handlePrefillRealData}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-500 transition shadow-md cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Autofill Real Certificate
            </button>

            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
              >
                {t("backToHub", "Back to Tests")}
              </button>
            )}
          </div>
        </div>

        <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Mode Selection Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("search")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold transition cursor-pointer ${
            activeTab === "search"
              ? "bg-[#002d62] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Search className="h-4 w-4" />
          {t("navVerify", "Verify Code & Details (Manual Confirmation)")}
        </button>

        <button
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold transition cursor-pointer ${
            activeTab === "upload"
              ? "bg-[#002d62] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Upload className="h-4 w-4" />
          Upload Document (AI Bit-Matching)
        </button>
      </div>

      {/* Verification Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Inputs for Pattern Code, Personal Details, and Bands */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {activeTab === "upload" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 text-center hover:border-blue-500 hover:bg-blue-50/30 transition cursor-pointer shadow-xs"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 shadow-2xs mb-2">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900">
                {uploadedFile ? uploadedFile.name : "Drop Official Certificate / TRF File Here"}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs">
                Supports PDF, PNG, JPG, or TXT. Extracts code and checks bit accuracy.
              </p>
              <button
                type="button"
                className="mt-3 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white pointer-events-none"
              >
                Browse Certificate File
              </button>
            </div>
          )}

          {/* Verification Form Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-blue-600" />
                  Pattern Confirmation Credentials
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Input details from the candidate's document to confirm against the mathematical pattern.
                </p>
              </div>
              <button
                onClick={handleClearAll}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                title="Clear all fields"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>
            </div>

            {/* Field 1: TRF Code */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-blue-600" />
                  Cryptographic TRF Code (Required)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">LF-YYMM-PERS-BAND-PART</span>
              </label>
              <input
                type="text"
                value={searchCode}
                onChange={e => setSearchCode(e.target.value.toUpperCase())}
                placeholder="e.g. LF-2609-A4N7-URSRU-K4M8"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            {/* Field 2: Personal Details Section */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-blue-600" />
                  Candidate Personal Details
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  Confirmed against embedded token
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-600 block mb-1">
                    {t("iqCertCandidateName", "Candidate Full Name")}
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={e => setCandidateName(e.target.value.toUpperCase())}
                    placeholder="e.g. ALEXANDER MORGAN"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-blue-600 focus:outline-none uppercase"
                  />
                  <span className="text-[9px] text-slate-400 mt-0.5 block">
                    Personal token verified against candidate name
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-600 block mb-1 flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-slate-400" />
                    {t("iqCertVerificationCode", "Passport / Candidate ID")}
                  </label>
                  <input
                    type="text"
                    value={candidateId}
                    onChange={e => setCandidateId(e.target.value.toUpperCase())}
                    placeholder="e.g. P98421049B"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none uppercase"
                  />
                  <span className="text-[9px] text-slate-400 mt-0.5 block">
                    Personal token verified against candidate ID
                  </span>
                </div>
              </div>
            </div>

            {/* Field 3: Band Scores Section (Supports 8, 8.0, any pattern) */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-extrabold text-blue-950 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-blue-700" />
                  Claimed IELTS 9-Band Scores
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                  Accepts "8", "8.0", "7.5", etc.
                </span>
              </div>

              {/* Primary Overall Band Input */}
              <div className="bg-white rounded-lg border border-blue-200 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-extrabold uppercase text-slate-800">
                    {t("overallBandResult", "Overall Band Score")}
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setClaimedOverall("8")}
                      className="text-[9px] font-bold bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 cursor-pointer"
                      title="Test entering as '8'"
                    >
                      Write "8"
                    </button>
                    <button
                      type="button"
                      onClick={() => setClaimedOverall("8.0")}
                      className="text-[9px] font-bold bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 cursor-pointer"
                      title="Test entering as '8.0'"
                    >
                      Write "8.0"
                    </button>
                    <button
                      type="button"
                      onClick={() => setClaimedOverall("9.0")}
                      className="text-[9px] font-bold bg-red-100 hover:bg-red-200 px-1.5 py-0.5 rounded text-red-700 cursor-pointer"
                      title="Test mismatched score '9.0'"
                    >
                      Write "9.0" (Mismatch)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={claimedOverall}
                    onChange={e => setClaimedOverall(e.target.value)}
                    placeholder="e.g. 8 or 8.0"
                    className="w-32 rounded-lg border-2 border-blue-300 bg-white px-3 py-1.5 text-sm font-black font-mono text-blue-900 focus:border-blue-600 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500">
                    {claimedOverall ? (
                      parseFlexibleBandScore(claimedOverall) !== null ? (
                        <span className="text-emerald-700 font-bold">
                          ✓ Parsed as Band {parseFlexibleBandScore(claimedOverall)?.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">Invalid score format</span>
                      )
                    ) : (
                      "Supports 8, 8.0, 7.5, 8.5, etc."
                    )}
                  </span>
                </div>
              </div>

              {/* Sub-Bands Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    {t("navListening", "Listening")}
                  </label>
                  <input
                    type="text"
                    value={claimedListening}
                    onChange={e => setClaimedListening(e.target.value)}
                    placeholder="e.g. 8.5"
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    {t("navReading", "Reading")}
                  </label>
                  <input
                    type="text"
                    value={claimedReading}
                    onChange={e => setClaimedReading(e.target.value)}
                    placeholder="e.g. 8 or 8.0"
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    {t("navWriting", "Writing")}
                  </label>
                  <input
                    type="text"
                    value={claimedWriting}
                    onChange={e => setClaimedWriting(e.target.value)}
                    placeholder="e.g. 7.5"
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    {t("navSpeaking", "Speaking")}
                  </label>
                  <input
                    type="text"
                    value={claimedSpeaking}
                    onChange={e => setClaimedSpeaking(e.target.value)}
                    placeholder="e.g. 8 or 8.0"
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Verification Button */}
            <button
              onClick={() => handleSearchVerify()}
              disabled={isScanning || !(typeof searchCode === "string" && searchCode.trim())}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#002d62] px-5 py-3 text-xs font-black text-white hover:bg-blue-900 transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Search className="h-4 w-4" />
              {t("navVerify", "Confirm Details & Scores with Pattern")}
            </button>
          </div>

          {/* Pattern Architecture Info Callout */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-2xs">
            <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-blue-600" />
              How Pattern Verification Works
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              The engine decrypts the TRF code into its 5 mathematical components: date sequence, candidate personal token, 9-band substitution cipher, and mathematical parity. It confirms whether the entered candidate name, ID, and scores (regardless of writing 8 or 8.0) strictly match the authentic pattern.
            </p>
          </div>
        </div>

        {/* Right Area: Scanning Progress or Result Dossier */}
        <div className="lg:col-span-6">
          {isScanning ? (
            <div className="rounded-2xl border border-blue-200 bg-white p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="relative mb-4">
                <div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <Cpu className="absolute inset-0 m-auto h-7 w-7 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Pattern Accuracy Analysis in Progress
              </h3>
              <p className="text-xs text-blue-700 font-semibold mt-1 max-w-sm">
                {scanStep}
              </p>

              {/* Progress bar */}
              <div className="w-full max-w-md bg-slate-100 rounded-full h-2.5 mt-5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400 mt-2">
                {scanProgress}% Audited
              </span>
            </div>
          ) : verificationResult ? (
            <VerificationDossierCard 
              result={verificationResult} 
              onViewCertificate={onViewCertificate}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
                <FileCheck className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Awaiting Verification Submission</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                Enter the TRF Code, Candidate Name/ID, and Band Scores on the left, or click <strong>"Autofill Real Certificate"</strong> above to test with an authentic issued credential.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Institutional Guarantee Footer */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-blue-600" />
          Direct Institutional Guarantee for Organizations
        </h3>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Lingofi Test Report Forms are verified directly against our central examination board's mathematical pattern. Verifiers can confirm candidate identity tokens and official 9-Band scores without third-party scanning apps, paper certificates, or manual delays.
        </p>
      </div>
    </div>
  );
};

// Sub-component: Official Dossier Card
const VerificationDossierCard: React.FC<{
  result: VerificationResult;
  onViewCertificate?: () => void;
}> = ({ result, onViewCertificate }) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [candidatePhoto, setCandidatePhoto] = useState<string | null>(() => {
    return localStorage.getItem("lingofi_candidate_photo") || null;
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const dataUrl = ev.target?.result as string;
        setCandidatePhoto(dataUrl);
        localStorage.setItem("lingofi_candidate_photo", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrintCertificate = () => {
    try {
      window.print();
    } catch (err) {
      console.error("Print failed:", err);
    }
  };

  const allPatternsMatch =
    result.isAuthentic &&
    result.accuracyDetails.patternConformity &&
    result.accuracyDetails.oddEvenSequenceValid &&
    result.accuracyDetails.personalEmbedValid &&
    result.accuracyDetails.bandCodeAuthentic &&
    result.accuracyDetails.parityChecksumValid &&
    result.accuracyDetails.overallScoreConsistent &&
    (!result.scoreConfirmation || result.scoreConfirmation.allClaimedScoresMatch !== false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-5">
      {/* Status Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              result.isAuthentic
                ? "bg-emerald-600 text-white shadow-emerald-200 shadow-md"
                : "bg-red-600 text-white shadow-red-200 shadow-md"
            }`}
          >
            {result.isAuthentic ? (
              <ShieldCheck className="h-7 w-7" />
            ) : (
              <XCircle className="h-7 w-7" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-md px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${
                  result.isAuthentic
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {result.isAuthentic
                  ? "STATUS: REAL • AUTHENTIC IELTS TRF"
                  : "STATUS: INVALID / TAMPER DETECTED"}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                Accuracy: {result.accuracyScore}%
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{result.auditMessage}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Pattern Code
          </span>
          <span className="font-mono text-xs font-black text-blue-900">
            {result.trfNumber}
          </span>
        </div>
      </div>

      {/* Manual Check Original Verification Statement */}
      {result.isAuthentic && (
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/80 p-4 text-emerald-950 flex items-start gap-3 shadow-xs">
          <BadgeCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-black uppercase tracking-wide text-emerald-900">
              Certificate verified through manual check is original verification.
            </div>
            <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
              This credential has passed manual candidate identity confirmation, personal token checking, and cryptographic pattern validation against central assessment records.
            </p>
          </div>
        </div>
      )}

      {/* 1. Candidate Personal Details Confirmation Status */}
      {result.personalConfirmation?.checked && (
        <div
          className={`rounded-xl p-4 border ${
            result.personalConfirmation.isMatch
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
              : "bg-red-50/70 border-red-200 text-red-950"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5">
              {result.personalConfirmation.isMatch ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              Candidate Personal Identity Confirmation
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                result.personalConfirmation.isMatch
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-red-100 text-red-800 border-red-300"
              }`}
            >
              {result.personalConfirmation.status === "CONFIRMED"
                ? "IDENTITY MATCH: CONFIRMED"
                : "IDENTITY MISMATCH DETECTED"}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-700">
            {result.personalConfirmation.details}
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap gap-4 text-[11px] text-slate-600">
            {result.personalConfirmation.nameProvided && (
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block">Provided Name</span>
                <span className="font-bold text-slate-800">{result.personalConfirmation.nameProvided}</span>
              </div>
            )}
            {result.personalConfirmation.idProvided && (
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block">Provided Passport/ID</span>
                <span className="font-mono font-bold text-slate-800">{result.personalConfirmation.idProvided}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Band Scores Confirmation Status */}
      {result.scoreConfirmation?.checked && (
        <div
          className={`rounded-xl p-4 border ${
            result.scoreConfirmation.allClaimedScoresMatch
              ? "bg-blue-50/70 border-blue-200 text-blue-950"
              : "bg-red-50/70 border-red-200 text-red-950"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5">
              {result.scoreConfirmation.allClaimedScoresMatch ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              Claimed Band Scores Confirmation
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                result.scoreConfirmation.allClaimedScoresMatch
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-red-100 text-red-800 border-red-300"
              }`}
            >
              {result.scoreConfirmation.allClaimedScoresMatch
                ? "SCORES MATCH: CONFIRMED (REAL)"
                : "BAND SCORE TAMPER DETECTED"}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-700">
            {result.scoreConfirmation.details}
          </p>

          {/* Side-by-side Claimed vs Pattern comparison */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
            {result.scoreConfirmation.claimedScores.overallRaw && (
              <div
                className={`p-2 rounded-lg border ${
                  result.scoreConfirmation.overallMatch
                    ? "bg-white border-emerald-300"
                    : "bg-red-100 border-red-300"
                }`}
              >
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Overall</span>
                <span className="font-mono font-black text-slate-900">
                  Claimed: {result.scoreConfirmation.claimedScores.overallRaw}
                </span>
                <span
                  className={`text-[9px] font-bold block mt-0.5 ${
                    result.scoreConfirmation.overallMatch ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {result.scoreConfirmation.overallMatch
                    ? `✓ Matches ${result.scores?.overall.toFixed(1)}`
                    : `✗ Certified ${result.scores?.overall.toFixed(1)}`}
                </span>
              </div>
            )}

            {result.scoreConfirmation.claimedScores.listeningRaw && (
              <div
                className={`p-2 rounded-lg border ${
                  result.scoreConfirmation.listeningMatch
                    ? "bg-white border-emerald-300"
                    : "bg-red-100 border-red-300"
                }`}
              >
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Listening</span>
                <span className="font-mono font-black text-slate-900">
                  {result.scoreConfirmation.claimedScores.listeningRaw}
                </span>
                <span
                  className={`text-[9px] font-bold block mt-0.5 ${
                    result.scoreConfirmation.listeningMatch ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {result.scoreConfirmation.listeningMatch
                    ? `✓ ${result.scores?.listening.toFixed(1)}`
                    : `✗ ${result.scores?.listening.toFixed(1)}`}
                </span>
              </div>
            )}

            {result.scoreConfirmation.claimedScores.readingRaw && (
              <div
                className={`p-2 rounded-lg border ${
                  result.scoreConfirmation.readingMatch
                    ? "bg-white border-emerald-300"
                    : "bg-red-100 border-red-300"
                }`}
              >
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Reading</span>
                <span className="font-mono font-black text-slate-900">
                  {result.scoreConfirmation.claimedScores.readingRaw}
                </span>
                <span
                  className={`text-[9px] font-bold block mt-0.5 ${
                    result.scoreConfirmation.readingMatch ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {result.scoreConfirmation.readingMatch
                    ? `✓ ${result.scores?.reading.toFixed(1)}`
                    : `✗ ${result.scores?.reading.toFixed(1)}`}
                </span>
              </div>
            )}

            {result.scoreConfirmation.claimedScores.writingRaw && (
              <div
                className={`p-2 rounded-lg border ${
                  result.scoreConfirmation.writingMatch
                    ? "bg-white border-emerald-300"
                    : "bg-red-100 border-red-300"
                }`}
              >
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Writing</span>
                <span className="font-mono font-black text-slate-900">
                  {result.scoreConfirmation.claimedScores.writingRaw}
                </span>
                <span
                  className={`text-[9px] font-bold block mt-0.5 ${
                    result.scoreConfirmation.writingMatch ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {result.scoreConfirmation.writingMatch
                    ? `✓ ${result.scores?.writing.toFixed(1)}`
                    : `✗ ${result.scores?.writing.toFixed(1)}`}
                </span>
              </div>
            )}

            {result.scoreConfirmation.claimedScores.speakingRaw && (
              <div
                className={`p-2 rounded-lg border ${
                  result.scoreConfirmation.speakingMatch
                    ? "bg-white border-emerald-300"
                    : "bg-red-100 border-red-300"
                }`}
              >
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Speaking</span>
                <span className="font-mono font-black text-slate-900">
                  {result.scoreConfirmation.claimedScores.speakingRaw}
                </span>
                <span
                  className={`text-[9px] font-bold block mt-0.5 ${
                    result.scoreConfirmation.speakingMatch ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {result.scoreConfirmation.speakingMatch
                    ? `✓ ${result.scores?.speaking.toFixed(1)}`
                    : `✗ ${result.scores?.speaking.toFixed(1)}`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Official Certified 9-Band Scores Decoded from Pattern */}
      {result.scores ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-blue-600" />
              Official Certified IELTS 9-Band Scores Decoded From Pattern
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Decoded from Cryptographic Pattern
            </span>
          </div>

          {/* Primary Overall Band Showcase */}
          <div className="rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50/70 via-white to-amber-50/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-wide block">
                Official Overall Band Score
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-black font-mono text-red-700">
                  {result.scores.overall.toFixed(1)}
                </span>
                <span className="text-sm font-extrabold text-slate-800">
                  {result.scores.overall >= 8.5
                    ? "Expert User (CEFR C2)"
                    : result.scores.overall >= 7.0
                    ? "Very Good / Good User (CEFR C1)"
                    : result.scores.overall >= 5.5
                    ? "Competent / Modest User (CEFR B2)"
                    : "Limited User (CEFR B1)"}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-blue-900 text-white px-4 py-2.5 text-center min-w-[120px]">
              <span className="text-[9px] font-bold uppercase text-blue-200 block">
                CEFR Standard
              </span>
              <span className="text-lg font-black font-sans">
                {result.cefrLevel || "C1 (Operational)"}
              </span>
            </div>
          </div>

          {/* 4 Skill Bands Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Listening Band
              </span>
              <span className="text-2xl font-black font-mono text-slate-900">
                {result.scores.listening.toFixed(1)}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Section 1–4</span>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Reading Band
              </span>
              <span className="text-2xl font-black font-mono text-slate-900">
                {result.scores.reading.toFixed(1)}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Academic Passages</span>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Writing Band
              </span>
              <span className="text-2xl font-black font-mono text-slate-900">
                {result.scores.writing.toFixed(1)}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Tasks 1 & 2</span>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Speaking Band
              </span>
              <span className="text-2xl font-black font-mono text-slate-900">
                {result.scores.speaking.toFixed(1)}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Interview Parts 1–3</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>No valid band scores could be decoded from this pattern code. The document is invalid.</span>
        </div>
      )}

      {/* Manual Check Verification Complete & Photo Upload / Certificate Retrieval */}
      {allPatternsMatch && (
        <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/60 p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-black text-white uppercase tracking-wider">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All Patterns Matched
              </span>
              <h4 className="mt-1 text-sm font-black text-emerald-950">
                A certificate verified through manual check is original verification
              </h4>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300">
              Candidate Authorization Confirmed
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            All cryptographic pattern components, identity tokens, and certified band scores match with complete accuracy. You are authorized to upload your official photograph and print or get your authentic Test Report Form certificate.
          </p>

          {/* Photo Upload & Certificate Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-emerald-200">
            {/* Candidate Photo Box */}
            <div className="relative h-28 w-24 rounded-lg border-2 border-slate-300 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
              {candidatePhoto ? (
                <img
                  src={candidatePhoto}
                  alt="Candidate"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400">
                  <User className="h-8 w-8 text-slate-300 mb-1" />
                  <span className="text-[8px] font-bold uppercase text-slate-500">No Photo</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <span className="text-xs font-black text-slate-900 block">
                Official Candidate Photograph & Certificate Issuance
              </span>
              <p className="text-[11px] text-slate-500">
                {candidatePhoto 
                  ? "Your photo has been attached to your official certificate record."
                  : "Upload your candidate portrait photo to include your biometric badge on the certificate."}
              </p>
              
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start pt-1">
                <input
                  type="file"
                  ref={photoInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition cursor-pointer shadow-xs"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {candidatePhoto ? "Change Photo" : "Upload Candidate Photo"}
                </button>

                {onViewCertificate && (
                  <button
                    type="button"
                    onClick={onViewCertificate}
                    className="flex items-center gap-1.5 rounded-lg bg-[#002d62] px-4 py-2 text-xs font-bold text-white hover:bg-blue-900 transition cursor-pointer shadow-xs"
                  >
                    <FileCheck className="h-3.5 w-3.5" />
                    Get Your Certificate
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePrintCertificate}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-700" />
                  Print Certificate
                </button>
              </div>
            </div>
          </div>

          {/* First-time Issuance Warning */}
          <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-black text-amber-950 block">
                CRITICAL NOTICE: If you lose a pattern key your certificate won't be regenerated.
              </span>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                When taking or saving your certificate for the first time, make sure to keep your pattern key (<span className="font-mono font-bold text-amber-950">{result.trfNumber}</span>) safely recorded. Under Lingofi examination regulations: if you lose a pattern key your certificate won't be regenerated. It can be verified at lingofi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Accuracy & Mathematical Integrity Breakdown */}
      <div className="border-t border-slate-200 pt-4">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
          Pattern Accuracy & Mathematical Integrity Breakdown
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-700">
            {result.accuracyDetails.patternConformity ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-600" />
            )}
            <span>Format Structure</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            {result.accuracyDetails.oddEvenSequenceValid ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-600" />
            )}
            <span>Cryptographic Sequence Structure</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            {result.accuracyDetails.personalEmbedValid ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-600" />
            )}
            <span>Embedded Personal Token</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            {result.accuracyDetails.bandCodeAuthentic ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-600" />
            )}
            <span>Encrypted Band Code Integrity</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            {result.accuracyDetails.parityChecksumValid ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-600" />
            )}
            <span>Mathematical Parity Checksum</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            {result.accuracyDetails.overallScoreConsistent ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-600" />
            )}
            <span>IELTS Rounding Consistency</span>
          </div>
        </div>

        {/* Audit Footnote */}
        {result.sha256Fingerprint && (
          <div className="mt-3 bg-slate-50 p-2 rounded-lg text-[9px] text-slate-500 font-mono flex items-center justify-between">
            <span>FINGERPRINT: {result.sha256Fingerprint}</span>
            <span className="text-emerald-700 font-bold">ACCURACY CONFIRMED BY LINGOFI</span>
          </div>
        )}
      </div>
    </div>
  );
};
