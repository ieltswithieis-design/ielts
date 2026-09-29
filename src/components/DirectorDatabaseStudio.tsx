import React, { useRef, useState } from "react";
import { Database, Download, Upload, ShieldCheck, FileJson, Bot, CheckCircle2, AlertTriangle, Trash2, Users } from "lucide-react";
import { importDatabaseBundle } from "../services/databaseService";

function authHeaders(): Record<string,string> {
  const token = sessionStorage.getItem("lingofi_auth_token") || "";
  const raw = sessionStorage.getItem("lingofi_auth_user") || "";
  let email = "";
  try { email = raw ? JSON.parse(raw).email || "" : ""; } catch {}
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(email ? { "x-user-email": email } : {}),
  };
}

export const DirectorDatabaseStudio: React.FC<{ onClose: () => void; onImported?: () => void }> = ({ onClose, onImported }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ok:boolean;text:string}|null>(null);

  const exportDatabase = async () => {
    setBusy(true); setMessage(null);
    try {
      const res = await fetch("/api/database/export", { headers: authHeaders() });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Database export failed.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lingofi_complete_test_database_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      setMessage({ok:true,text:"Complete database exported successfully. This JSON is the editable master copy."});
    } catch (e:any) { setMessage({ok:false,text:e.message || "Export failed."}); }
    finally { setBusy(false); }
  };

  const exportStudentSignups = async () => {
    setBusy(true); setMessage(null);
    try {
      const res = await fetch("/api/leads/export?format=csv", { headers: authHeaders() });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Student signup export failed.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url;
      a.download = `lingofi_student_signups_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      setMessage({ok:true,text:"Student signup data exported successfully."});
    } catch (e:any) { setMessage({ok:false,text:e.message || "Student signup export failed."}); }
    finally { setBusy(false); }
  };

  const deleteStudentSignups = async () => {
    if (!window.confirm("Delete ALL student signup accounts from Lingofi and Supabase? Director and teacher accounts will be kept. This cannot be undone.")) return;
    setBusy(true); setMessage(null);
    try {
      const res = await fetch("/api/leads", { method:"DELETE", headers:authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Student deletion failed.");
      setMessage({ok:true,text:`Deleted ${data.removed || 0} student signup account(s).`});
    } catch (e:any) { setMessage({ok:false,text:e.message || "Student deletion failed."}); }
    finally { setBusy(false); }
  };

  const importDatabase = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".json")) { setMessage({ok:false,text:"Please select a JSON database export."}); return; }
    const confirmed = window.confirm("Importing replaces the complete live test database. Export a backup first and continue only with a validated JSON file. Continue?");
    if (!confirmed) return;
    setBusy(true); setMessage(null);
    try {
      const parsed = JSON.parse(await file.text());
      const result = await importDatabaseBundle(parsed);
      setMessage({ok:true,text:result.message || "Complete database imported successfully."});
      onImported?.();
    } catch (e:any) { setMessage({ok:false,text:e.message || "Database import failed. No database changes were made."}); }
    finally { setBusy(false); }
  };

  return <div className="mx-auto max-w-5xl space-y-6 pb-16">
    <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300"><Database className="h-7 w-7"/></div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-300"><ShieldCheck className="h-4 w-4"/> Director Database</div>
            <h1 className="mt-1 text-2xl font-black">Lingofi Master Test Database</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">Complete database Import/Export plus dedicated student signup export and deletion controls. Student signup records are retained in Supabase until you explicitly delete them or the 30-day inactivity rule removes them.</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black text-slate-200 hover:bg-slate-900">Close</button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button disabled={busy} onClick={exportDatabase} className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 text-sm font-black text-slate-950 disabled:opacity-50"><Download className="h-5 w-5"/> Export Complete Database</button>
        <button disabled={busy} onClick={() => inputRef.current?.click()} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black text-slate-950 disabled:opacity-50"><Upload className="h-5 w-5"/> Import Complete Database</button>
        <button disabled={busy} onClick={() => void exportStudentSignups()} className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-4 text-sm font-black text-white disabled:opacity-50"><Users className="h-5 w-5"/> Export Student Signups</button>
        <button disabled={busy} onClick={() => void deleteStudentSignups()} className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-4 text-sm font-black text-white disabled:opacity-50"><Trash2 className="h-5 w-5"/> Delete Student Signups</button>
        <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={e => { const f=e.target.files?.[0]; e.currentTarget.value=""; if(f) void importDatabase(f); }}/>
      </div>
      {message && <div className={`mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-xs font-bold ${message.ok ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"}`}><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0"/>{message.text}</div>}
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900"><Bot className="h-5 w-5 text-blue-600"/><h2 className="text-base font-black">How to give the database to AI for modification</h2></div>
        <ol className="mt-4 space-y-3 text-sm text-slate-700">
          <li><b>1.</b> Click <b>Export Complete Database</b>.</li>
          <li><b>2.</b> Give the downloaded JSON to the AI together with the exact changes you want.</li>
          <li><b>3.</b> Tell the AI: <b>“Modify this database only. Preserve every existing record unless I explicitly ask you to change/delete it. Return the complete JSON in the same Lingofi database format.”</b></li>
          <li><b>4.</b> Ask the AI to validate the complete JSON before returning it. Do not import a partial database.</li>
          <li><b>5.</b> Save the returned file as <b>.json</b> and import it here.</li>
        </ol>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900"><FileJson className="h-5 w-5 text-emerald-600"/><h2 className="text-base font-black">What can be changed</h2></div>
        <p className="mt-3 text-sm leading-6 text-slate-600">The complete JSON is the master editable database. You can change existing questions, answers, passages, scripts, writing tasks, speaking questions, visuals, audio scripts, titles, instructions, exam packages, add new tests, or remove tests. The application code does not need to be edited for ordinary database changes.</p>
        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-xs font-bold text-amber-900"><AlertTriangle className="mr-1 inline h-4 w-4"/> Always export a backup before importing a modified database. Import is complete-replacement mode, not a partial merge.</div>
      </div>
    </section>
  </div>;
};
