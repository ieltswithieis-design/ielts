import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Mail, User, Phone, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, signup, isAuthModalRequired } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(authModalMode || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"candidate" | "teacher" | "admin">("candidate");
  const [targetBand, setTargetBand] = useState<number>(7.5);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Keep the visible form synchronized with the global auth modal request.
  // This prevents a previous Sign Up state from being submitted when Login is opened.
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || "login");
      setErrorMessage("");
    }
  }, [isAuthModalOpen, authModalMode, isAuthModalRequired]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMessage(res.error || "Login failed. Check your email and password.");
        }
      } else {
        const res = await signup({
          name,
          email,
          whatsapp,
          password,
          role,
          targetBand,
        });
        if (!res.success) {
          setErrorMessage(res.error || "Failed to create account.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await login(demoEmail, demoPass);
      if (!res.success) {
        setErrorMessage(res.error || "Quick login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl text-white"
        >
          {/* Header Graphic */}
          <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 px-6 pt-6 pb-5 text-white">
            {!isAuthModalRequired && (
              <button
                onClick={closeAuthModal}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs font-black text-white shadow-inner">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">
                  Lingofi Candidate Portal
                </span>
                <h3 className="text-xl font-black">
                  {mode === "login" ? "Sign In to LingoFi" : "Create Your LingoFi Account"}
                </h3>
              </div>
            </div>
            <p className="text-xs text-blue-100">
              Sign in to your existing account or create a new account to continue using LingoFi.
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-900/60 p-1.5">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage("");
              }}
              className={`py-2 text-xs font-black rounded-xl transition cursor-pointer ${
                mode === "login"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage("");
              }}
              className={`py-2 text-xs font-black rounded-xl transition cursor-pointer ${
                mode === "signup"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300 font-medium">
                {errorMessage}
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. John Doe / Hamid Ali"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Official Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="Enter your WhatsApp number"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-slate-500">Any format is accepted. Enter the WhatsApp number exactly as you use it.</p>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target IELTS Band Score: <span className="text-amber-400 font-black">{targetBand.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="5.0"
                    max="9.0"
                    step="0.5"
                    value={targetBand}
                    onChange={e => setTargetBand(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>5.0</span>
                    <span>6.5</span>
                    <span>7.5</span>
                    <span>8.5</span>
                    <span>9.0</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-black text-white shadow-lg transition active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : mode === "login" ? (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <CheckCircle2 className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="border-t border-slate-800 bg-slate-950/60 p-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              ⚡ Instant 1-Click Demo Accounts
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("candidate@student.com", "student123")}
                className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-left hover:border-slate-700 hover:bg-slate-850 transition cursor-pointer"
              >
                <div className="text-[11px] font-bold text-blue-400">Candidate</div>
                <div className="text-[9px] text-slate-500">Student Portal</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("teacher@cambridge.edu", "teacher123")}
                className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-left hover:border-slate-700 hover:bg-slate-850 transition cursor-pointer"
              >
                <div className="text-[11px] font-bold text-amber-400">Teacher</div>
                <div className="text-[9px] text-slate-500">Test Creator</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin@lingofi.org", "admin123")}
                className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-left hover:border-slate-700 hover:bg-slate-850 transition cursor-pointer"
              >
                <div className="text-[11px] font-bold text-emerald-400">Administrator</div>
                <div className="text-[9px] text-slate-500">Full Database</div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
