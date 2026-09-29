import React, { useState, useRef } from "react";
import { IqScoreBreakdown } from "../types/iq";
import { useLanguage } from "../context/LanguageContext";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { 
  Award, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Edit3, 
  Check, 
  ExternalLink,
  QrCode,
  Lock,
  Building,
  RotateCcw
} from "lucide-react";
import { motion } from "motion/react";

interface IqCertificateProps {
  scoreData?: IqScoreBreakdown;
  onBack: () => void;
  onOpenVerificationPortal?: (code: string) => void;
  onRetake?: () => void;
}

export const IqCertificate: React.FC<IqCertificateProps> = ({
  scoreData,
  onBack,
  onOpenVerificationPortal,
  onRetake
}) => {
  const { t } = useLanguage();
  const certRef = useRef<HTMLDivElement>(null);

  // Default demo score if accessed directly without running test
  const results: IqScoreBreakdown = scoreData || {
    rawScore: 9,
    totalQuestions: 10,
    iqScore: 138,
    percentile: 99.4,
    classification: "Very Superior / Mensa Candidate (Top 2%)",
    isMensaLevel: true,
    subScores: {
      matrix: 100,
      numerical: 100,
      spatial: 100,
      verbal: 80,
      logic: 100
    }
  };

  const [candidateName, setCandidateName] = useState<string>("Alex Morgan");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Deterministic verifiable serial number
  const serialCode = `IQ-LINGOFI-2026-${results.iqScore}-${Math.abs((candidateName.length * 97) + results.iqScore * 13).toString(16).toUpperCase().padStart(4, "0")}`;
  const issueDate = "15 September 2026";

  const handleDownloadPng = async () => {
    if (!certRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(certRef.current, { quality: 0.98, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `LingoFi_IQ_Certificate_${candidateName.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(certRef.current, { quality: 0.98, pixelRatio: 2 });
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [certRef.current.offsetWidth, certRef.current.offsetHeight]
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, certRef.current.offsetWidth, certRef.current.offsetHeight);
      pdf.save(`LingoFi_IQ_Certificate_${candidateName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn("Print not supported or blocked in iframe sandbox", e);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Top Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title={t("backToHub")}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Psychometric Assessment
            </span>
            <h1 className="text-base sm:text-lg font-black text-slate-900">
              Official Cognitive IQ Certificate
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isDownloading ? "Rendering..." : t("iqCertDownloadPdf")}</span>
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-blue-600" />
            <span>{t("iqCertDownloadImage")}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>{t("iqCertPrint")}</span>
          </button>

          {onOpenVerificationPortal && (
            <button
              onClick={() => onOpenVerificationPortal(serialCode)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t("iqCertVerifyOnline")}</span>
            </button>
          )}

          {onRetake && (
            <button
              onClick={onRetake}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retake</span>
            </button>
          )}
        </div>
      </div>

      {/* Candidate Name Customization Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Edit3 className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="font-semibold text-blue-900">
            Customize Certificate Legal Name:
          </span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={candidateName}
            onChange={e => setCandidateName(e.target.value)}
            placeholder={t("iqCertEnterName")}
            className="w-full sm:w-64 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md shrink-0 flex items-center gap-1">
            <Check className="h-3 w-3" /> Live
          </span>
        </div>
      </div>

      {/* High-Resolution Printable Certificate Frame */}
      <div className="overflow-x-auto pb-4">
        <div
          ref={certRef}
          id="iq-official-certificate"
          className="min-w-[780px] sm:min-w-[840px] rounded-3xl border-8 border-slate-900 bg-gradient-to-br from-amber-50/40 via-white to-slate-50 p-8 sm:p-12 shadow-2xl relative select-none overflow-hidden"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {/* Inner Guilloche Ornamental Border */}
          <div className="absolute inset-3 rounded-2xl border-2 border-amber-600/40 pointer-events-none" />
          <div className="absolute inset-4 rounded-xl border border-slate-800/20 pointer-events-none" />

          {/* Watermark Crest */}
          <div className="absolute right-12 bottom-12 opacity-5 pointer-events-none flex items-center justify-center">
            <Award className="w-80 h-80 text-slate-900" />
          </div>

          {/* Header Block */}
          <div className="text-center space-y-2 relative z-10">
            <div className="flex items-center justify-center gap-2 text-amber-700 font-sans text-xs font-extrabold tracking-widest uppercase">
              <Sparkles className="h-4 w-4" />
              <span>International Psychometric Assessment Board</span>
              <Sparkles className="h-4 w-4" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              CERTIFICATE OF COGNITIVE ASSESSMENT & STANDARDIZED IQ
            </h2>

            <p className="font-sans text-xs text-slate-500 uppercase tracking-widest">
              Standardized Psychometric Battery • Wechsler & Mensa Normative Model (SD 15)
            </p>
          </div>

          {/* Candidate Name Section */}
          <div className="my-8 text-center relative z-10">
            <p className="font-sans text-xs text-slate-400 uppercase tracking-widest mb-1">
              This is officially awarded and accredited to:
            </p>
            <div className="inline-block border-b-2 border-slate-900 px-8 py-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 italic">
                {candidateName || "Candidate Name"}
              </span>
            </div>
            <p className="font-sans text-xs text-slate-600 max-w-xl mx-auto mt-3 leading-relaxed">
              for successfully completing the supervised Standardized Multilingual Cognitive IQ Examination,
              demonstrating validated analytical precision, abstract matrix reasoning, and high deductive aptitude.
            </p>
          </div>

          {/* Core Verified IQ Metrics Card */}
          <div className="my-6 relative z-10 font-sans">
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 p-5 shadow-xs text-center">
              <div>
                <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Verified IQ Score
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                  IQ {results.iqScore}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Scale: Mean 100, SD 15</div>
              </div>

              <div className="border-x border-amber-300/60 px-2">
                <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Percentile Rank
                </div>
                <div className="text-3xl sm:text-4xl font-black text-blue-700 mt-1">
                  {results.percentile}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Top {((100 - results.percentile)).toFixed(1)}% Worldwide</div>
              </div>

              <div>
                <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Cognitive Tier
                </div>
                <div className="text-sm sm:text-base font-black text-slate-900 mt-2 leading-tight">
                  {results.isMensaLevel ? "Mensa Qualifying Candidate" : results.classification}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1">
                  {results.isMensaLevel ? "★ Very Superior (Top 2%)" : "Standardized Pass"}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-scale Breakdown Bar Graph */}
          <div className="my-6 font-sans relative z-10 max-w-xl mx-auto">
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-white/80 border border-slate-200 rounded-lg p-2">
                <div className="text-[10px] font-bold text-slate-400">Matrix</div>
                <div className="text-sm font-black text-blue-600">{results.subScores.matrix}%</div>
              </div>
              <div className="bg-white/80 border border-slate-200 rounded-lg p-2">
                <div className="text-[10px] font-bold text-slate-400">Numerical</div>
                <div className="text-sm font-black text-indigo-600">{results.subScores.numerical}%</div>
              </div>
              <div className="bg-white/80 border border-slate-200 rounded-lg p-2">
                <div className="text-[10px] font-bold text-slate-400">Spatial</div>
                <div className="text-sm font-black text-emerald-600">{results.subScores.spatial}%</div>
              </div>
              <div className="bg-white/80 border border-slate-200 rounded-lg p-2">
                <div className="text-[10px] font-bold text-slate-400">Verbal</div>
                <div className="text-sm font-black text-amber-600">{results.subScores.verbal}%</div>
              </div>
              <div className="bg-white/80 border border-slate-200 rounded-lg p-2">
                <div className="text-[10px] font-bold text-slate-400">Logic</div>
                <div className="text-sm font-black text-purple-600">{results.subScores.logic}%</div>
              </div>
            </div>
          </div>

          {/* Signatures and Seals Footer */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 flex items-end justify-between font-sans relative z-10">
            {/* Left: Verification QR & Security Code */}
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 rounded-lg border border-slate-300 bg-white p-1 flex items-center justify-center">
                  <QrCode className="h-10 w-10 text-slate-800" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Credential Serial ID
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-900 tracking-tight">
                    {serialCode}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Session Date: {issueDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Official Gold Seal */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-full border-4 border-amber-500 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 shadow-md flex items-center justify-center mx-auto text-white">
                <Award className="h-9 w-9 text-slate-950" />
              </div>
              <div className="text-[9px] font-black text-amber-800 uppercase tracking-widest mt-1">
                LingoFi Seal
              </div>
            </div>

            {/* Right: Board Signatures */}
            <div className="text-right space-y-3">
              <div>
                <div className="font-serif italic text-base font-bold text-slate-800 border-b border-slate-400 pb-0.5 inline-block">
                  Dr. A. Sterling, Ph.D.
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                  President & Chief Psychometrician
                </div>
              </div>
              <div>
                <div className="font-serif italic text-base font-bold text-slate-800 border-b border-slate-400 pb-0.5 inline-block">
                  Prof. E. R. Harrison
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Registrar of Cognitive Examinations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
