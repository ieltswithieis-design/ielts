import React from "react";

interface IqDiagramRendererProps {
  type: string;
}

export const IqDiagramRenderer: React.FC<IqDiagramRendererProps> = ({ type }) => {
  if (type === "matrix-rotation") {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-800 my-3">
        <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
          3×3 Abstract Matrix
        </div>
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
          {/* Row 1 */}
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
              <line x1="18" y1="4" x2="18" y2="18" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="18" cy="18" r="3" fill="#ffffff" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
              <line x1="18" y1="18" x2="32" y2="18" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="18" cy="18" r="3" fill="#ffffff" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
              <line x1="18" y1="18" x2="18" y2="32" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="18" cy="18" r="3" fill="#ffffff" />
            </svg>
          </div>

          {/* Row 2 */}
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <rect x="5" y="5" width="26" height="26" fill="none" stroke="#34d399" strokeWidth="2.5" />
              <line x1="5" y1="5" x2="18" y2="18" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              <circle cx="18" cy="18" r="2.5" fill="#f43f5e" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <rect x="5" y="5" width="26" height="26" fill="none" stroke="#34d399" strokeWidth="2.5" />
              <line x1="18" y1="18" x2="31" y2="31" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              <circle cx="18" cy="18" r="2.5" fill="#f43f5e" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <rect x="5" y="5" width="26" height="26" fill="none" stroke="#34d399" strokeWidth="2.5" />
              <line x1="5" y1="31" x2="18" y2="18" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              <circle cx="18" cy="18" r="2.5" fill="#f43f5e" />
            </svg>
          </div>

          {/* Row 3 */}
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#c084fc" strokeWidth="2.5" />
              <line x1="18" y1="18" x2="18" y2="4" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
              <circle cx="18" cy="18" r="2.5" fill="#c084fc" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-md flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#c084fc" strokeWidth="2.5" />
              <line x1="4" y1="18" x2="18" y2="18" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
              <circle cx="18" cy="18" r="2.5" fill="#c084fc" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-amber-500/10 border-2 border-dashed border-amber-400 rounded-md flex items-center justify-center">
            <span className="text-xl font-black text-amber-400 animate-pulse">?</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "cube-net") {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-800 my-3">
        <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
          Flat 3D Cube Net (Fold along lines)
        </div>
        <div className="flex flex-col items-center">
          {/* Top row */}
          <div className="w-10 h-10 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-amber-400 font-bold">
            ▲
          </div>
          {/* Middle row */}
          <div className="flex">
            <div className="w-10 h-10 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-emerald-400 font-bold">
              ●
            </div>
            <div className="w-10 h-10 bg-blue-900/80 border-2 border-blue-400 rounded flex items-center justify-center text-yellow-300 font-black text-lg">
              ★
            </div>
            <div className="w-10 h-10 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-rose-400 font-bold">
              ♦
            </div>
            <div className="w-10 h-10 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-purple-400 font-bold">
              ■
            </div>
          </div>
          {/* Bottom row */}
          <div className="w-10 h-10 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-indigo-400 font-bold">
            ✦
          </div>
        </div>
      </div>
    );
  }

  if (type === "matrix-xor") {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-800 my-3">
        <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
          Column 1 ⊕ Column 2 = Column 3 (Overlay rule)
        </div>
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <line x1="16" y1="4" x2="16" y2="28" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="4" y1="16" x2="28" y2="16" stroke="#38bdf8" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <line x1="4" y1="16" x2="28" y2="16" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="6" y1="6" x2="26" y2="26" stroke="#38bdf8" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <line x1="16" y1="4" x2="16" y2="28" stroke="#fbbf24" strokeWidth="2.5" />
              <line x1="6" y1="6" x2="26" y2="26" stroke="#fbbf24" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <rect x="6" y="6" width="20" height="20" fill="none" stroke="#a7f3d0" strokeWidth="2" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <line x1="6" y1="6" x2="26" y2="26" stroke="#a7f3d0" strokeWidth="2" />
              <line x1="26" y1="6" x2="6" y2="26" stroke="#a7f3d0" strokeWidth="2" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <rect x="6" y="6" width="20" height="20" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <line x1="6" y1="6" x2="26" y2="26" stroke="#fbbf24" strokeWidth="2" />
              <line x1="26" y1="6" x2="6" y2="26" stroke="#fbbf24" strokeWidth="2" />
            </svg>
          </div>

          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <line x1="16" y1="4" x2="16" y2="28" stroke="#f472b6" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <polygon points="16,4 4,14 16,14" fill="#f472b6" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-amber-500/10 border-2 border-dashed border-amber-400 rounded flex items-center justify-center">
            <span className="text-xl font-black text-amber-400 animate-pulse">?</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
