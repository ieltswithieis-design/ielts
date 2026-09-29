import React, { useState, useRef, useEffect } from "react";
import { FullIeltsTest, IeltsDatabase } from "../types/ielts";
import { ProgressState } from "../utils/storage";
import { stopAllActiveMedia } from "../utils/audioControl";
import { ReadingRunner } from "./ReadingRunner";
import { ListeningRunner } from "./ListeningRunner";
import { WritingRunner } from "./WritingRunner";
import { SpeakingRunner } from "./SpeakingRunner";
import { CertificateTRF } from "./CertificateTRF";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  Award, 
  User, 
  Upload, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  ChevronRight
} from "lucide-react";

interface FullTestRunnerProps {
  test: FullIeltsTest;
  database: IeltsDatabase;
  progress: ProgressState;
  onBack: () => void;
  onComplete: () => void;
  onOpenCertificate?: () => void;
  onOpenVerificationPortal?: (trfCode?: string) => void;
}

type StepType = "listening" | "reading" | "writing" | "speaking" | "certification";

export const FullTestRunner: React.FC<FullTestRunnerProps> = ({
  test,
  database,
  progress,
  onBack,
  onComplete,
  onOpenCertificate,
  onOpenVerificationPortal,
}) => {
  const [currentStep, setCurrentStep] = useState<StepType>("listening");

  // Candidate Details for final certification
  const [candidateName, setCandidateName] = useState("ALEXANDER MORGAN");
  const [candidateId, setCandidateId] = useState("P98421049B");
  const [dob, setDob] = useState("18/05/1997");
  const [sex, setSex] = useState<"M" | "F">("M");
  const [countryOrigin, setCountryOrigin] = useState("UNITED KINGDOM");
  const [firstLanguage, setFirstLanguage] = useState("ENGLISH");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isCertificateReady, setIsCertificateReady] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Retrieve underlying tests from database
  const listeningTest = database.listening.find(t => t.id === test.listeningId) || database.listening[0];
  const readingTest = database.reading.find(t => t.id === test.readingId) || database.reading[0];
  const writingTest = database.writing.find(t => t.id === test.writingId) || database.writing[0];
  const speakingTest = database.speaking.find(t => t.id === test.speakingId) || database.speaking[0];

  // Check which sections are done
  const isListeningDone = !!progress.attempts[`listening_${test.listeningId}`];
  const isReadingDone = !!progress.attempts[`reading_${test.readingId}`];
  const isWritingDone = !!progress.attempts[`writing_${test.writingId}`];
  const isSpeakingDone = !!progress.attempts[`speaking_${test.speakingId}`];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setPhotoUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStepTransition = (targetStep: StepType) => {
    stopAllActiveMedia();
    setCurrentStep(targetStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    stopAllActiveMedia();
    onBack();
  };

  useEffect(() => {
    return () => {
      stopAllActiveMedia();
    };
  }, []);

  const steps = [
    { id: "listening" as StepType, label: "1. Listening", icon: Headphones, done: isListeningDone },
    { id: "reading" as StepType, label: "2. Reading", icon: BookOpen, done: isReadingDone },
    { id: "writing" as StepType, label: "3. Writing", icon: PenTool, done: isWritingDone },
    { id: "speaking" as StepType, label: "4. Speaking", icon: Mic, done: isSpeakingDone },
    { id: "certification" as StepType, label: "5. TRF Certificate", icon: Award, done: isCertificateReady },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden Photo Upload Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* Top Breadcrumb & Step Navigation Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Full Tests
            </button>
            <div>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">
                Full IELTS Simulation
              </span>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {test.title} • {test.subTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Official Sequence:</span>
            <span className="font-mono font-bold text-[#002d62]">Listening → Reading → Writing → Speaking → TRF</span>
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map(step => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => handleStepTransition(step.id)}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-[#002d62] text-white shadow-xs"
                    : step.done
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="truncate">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Runner Area */}
      <div>
        {currentStep === "listening" && (
          <ListeningRunner
            test={listeningTest}
            onBack={() => handleStepTransition("reading")}
            onComplete={() => {
              stopAllActiveMedia();
              onComplete();
              handleStepTransition("reading");
            }}
          />
        )}

        {currentStep === "reading" && (
          <ReadingRunner
            test={readingTest}
            onBack={() => handleStepTransition("writing")}
            onComplete={() => {
              stopAllActiveMedia();
              onComplete();
              handleStepTransition("writing");
            }}
          />
        )}

        {currentStep === "writing" && (
          <WritingRunner
            test={writingTest}
            onBack={() => handleStepTransition("speaking")}
            onComplete={() => {
              stopAllActiveMedia();
              onComplete();
              handleStepTransition("speaking");
            }}
          />
        )}

        {currentStep === "speaking" && (
          <SpeakingRunner
            test={speakingTest}
            onBack={() => handleStepTransition("writing")}
            onComplete={() => {
              stopAllActiveMedia();
              onComplete();
              if (onOpenCertificate) {
                onOpenCertificate();
              } else {
                handleStepTransition("certification");
              }
            }}
            onOpenCertificate={() => {
              stopAllActiveMedia();
              if (onOpenCertificate) {
                onOpenCertificate();
              } else {
                handleStepTransition("certification");
              }
            }}
          />
        )}

        {/* Step 5: Official Certification Ceremony & Candidate Details Setup */}
        {currentStep === "certification" && (
          <div className="flex flex-col gap-6">
            {!isCertificateReady ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-800 uppercase tracking-wide">
                      Examination Completed
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-0.5">
                      Candidate Details & Biometric Photo Verification
                    </h2>
                    <p className="text-xs text-slate-500">
                      Please enter your candidate credentials and upload your passport photo to generate your official Lingofi Test Report Form.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Photo upload column */}
                  <div className="md:col-span-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-6 flex flex-col items-center justify-center text-center">
                    <div className="relative h-36 w-28 rounded-lg overflow-hidden border-2 border-slate-400 bg-slate-200 flex items-center justify-center shadow-xs">
                      {photoUrl ? (
                        <img src={photoUrl} alt="Candidate" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <User className="h-16 w-16 text-slate-400" />
                          <span className="text-[9px] font-bold text-slate-500 uppercase mt-1">
                            PHOTO
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#002d62] px-4 py-2 text-xs font-bold text-white hover:bg-blue-950 transition cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {photoUrl ? "Change Photo" : "Upload Passport Photo"}
                    </button>
                    <span className="text-[10px] text-slate-400 mt-1">PNG or JPG (standard passport ratio)</span>
                  </div>

                  {/* Form Details */}
                  <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase">
                        Candidate Full Name
                      </label>
                      <input
                        type="text"
                        value={candidateName}
                        onChange={e => setCandidateName(e.target.value.toUpperCase())}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase">
                        Passport Number (Candidate Number)
                      </label>
                      <input
                        type="text"
                        value={candidateId}
                        onChange={e => setCandidateId(e.target.value.toUpperCase())}
                        placeholder="e.g. P98421049B"
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-red-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Your passport number is used as your official Candidate Number on the TRF certificate.
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase">
                        Date of Birth (DD/MM/YYYY)
                      </label>
                      <input
                        type="text"
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase">
                        Sex
                      </label>
                      <select
                        value={sex}
                        onChange={e => setSex(e.target.value as "M" | "F")}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                      >
                        <option value="M">Male (M)</option>
                        <option value="F">Female (F)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase">
                        Country or Region of Origin
                      </label>
                      <input
                        type="text"
                        value={countryOrigin}
                        onChange={e => setCountryOrigin(e.target.value.toUpperCase())}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase">
                        First Language
                      </label>
                      <input
                        type="text"
                        value={firstLanguage}
                        onChange={e => setFirstLanguage(e.target.value.toUpperCase())}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>Dynamic Cryptographic TRF ID assigned automatically</span>
                      </div>

                      <button
                        onClick={() => setIsCertificateReady(true)}
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-red-700 transition cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        Generate & View Official Certificate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <CertificateTRF
                progress={progress}
                onOpenVerificationPortal={onOpenVerificationPortal}
                initialCandidateDetails={{
                  candidateName,
                  candidateId,
                  dob,
                  sex,
                  countryOrigin,
                  firstLanguage,
                  photoUrl: photoUrl || undefined,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
