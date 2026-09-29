import React, { useEffect, useState } from "react";
import { Download, Trash2, Users, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";

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

type Lead = { id:string; name:string; email:string; whatsapp:string; role:string; targetBand?:number; createdAt?:string; lastActivityAt?:string|null; lastLoginAt?:string|null; inactiveDays?:number };

export const DirectorLeadsStudio: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ok:boolean;text:string}|null>(null);
  const [retentionDays, setRetentionDays] = useState(30);

  const load = async () => {
    setBusy(true); setMessage(null);
    try {
      const res = await fetch("/api/leads", { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load leads.");
      setLeads(Array.isArray(data.leads) ? data.leads : []);
      setRetentionDays(Number(data.retentionDays) || 30);
    } catch (e:any) { setMessage({ok:false,text:e.message || "Could not load leads."}); }
    finally { setBusy(false); }
  };

  useEffect(() => { void load(); }, []);

  const download = async (format: "csv"|"json") => {
    setBusy(true); setMessage(null);
    try {
      const res = await fetch(`/api/leads/export?format=${format}`, { headers: authHeaders() });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Lead export failed.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url;
      a.download = `lingofi_student_signups_${new Date().toISOString().slice(0,10)}.${format}`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      setMessage({ok:true,text:`Student signup data exported as ${format.toUpperCase()}. Passwords are never included.`});
    } catch (e:any) { setMessage({ok:false,text:e.message || "Export failed."}); }
    finally { setBusy(false); }
  };

  const downloadContacts = async () => {
    setBusy(true); setMessage(null);
    try {
      const res = await fetch("/api/leads/export-contacts", { headers: authHeaders() });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Contact export failed.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `lingofi_student_names_numbers_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      setMessage({ok:true,text:"Student names and WhatsApp numbers downloaded."});
    } catch (e:any) { setMessage({ok:false,text:e.message || "Contact export failed."}); }
    finally { setBusy(false); }
  };

  const deleteLead = async (id:string) => {
    if (!window.confirm("Delete this candidate account and its stored lead data? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, { method:"DELETE", headers:authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      setLeads(prev => prev.filter(x => x.id !== id));
      setMessage({ok:true,text:"Candidate lead/account deleted."});
    } catch (e:any) { setMessage({ok:false,text:e.message || "Delete failed."}); }
    finally { setBusy(false); }
  };

  const deleteCandidates = async () => {
    if (!leads.length) return;
    if (!window.confirm(`Delete all ${leads.filter(l => l.role === "candidate").length} candidate accounts/leads? Director and teacher accounts will be kept.`)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/leads", { method:"DELETE", headers:authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      setMessage({ok:true,text:`Deleted ${data.removed || 0} candidate lead(s).`});
      await load();
    } catch (e:any) { setMessage({ok:false,text:e.message || "Delete failed."}); setBusy(false); }
  };

  return <div className="mx-auto max-w-6xl space-y-6 pb-16">
    <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300"><Users className="h-7 w-7"/></div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-300"><ShieldCheck className="h-4 w-4"/> Director Leads</div>
            <h1 className="mt-1 text-2xl font-black">Candidate Contact Leads</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">All signup/contact fields are stored with activity timestamps. Student accounts are automatically deleted after {retentionDays} days without activity. Passwords are never shown or exported.</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black text-slate-200 hover:bg-slate-900">Close</button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button disabled={busy} onClick={() => void download("csv")} className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 text-sm font-black text-slate-950 disabled:opacity-50"><Download className="h-5 w-5"/> Download Excel / CSV</button>
        <button disabled={busy} onClick={() => void download("json")} className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-4 text-sm font-black text-white disabled:opacity-50"><Download className="h-5 w-5"/> Download JSON</button>
        <button disabled={busy} onClick={() => void downloadContacts()} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black text-slate-950 disabled:opacity-50"><Download className="h-5 w-5"/> Names & Numbers</button>
        <button disabled={busy || leads.filter(l => l.role === "candidate").length === 0} onClick={() => void deleteCandidates()} className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-4 text-sm font-black text-white disabled:opacity-50"><Trash2 className="h-5 w-5"/> Delete Candidate Leads</button>
      </div>
      {message && <div className={`mt-4 rounded-xl px-4 py-3 text-xs font-bold ${message.ok ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"}`}>{message.text}</div>}
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <div><h2 className="text-base font-black text-slate-900">Stored Signups ({leads.length})</h2><p className="text-xs text-slate-500">WhatsApp accepts any entered format. Student accounts with no activity for {retentionDays} days are automatically removed.</p></div>
        <button disabled={busy} onClick={() => void load()} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"><RefreshCw className="mr-1 inline h-4 w-4"/> Refresh</button>
      </div>
      {leads.length === 0 ? <div className="p-10 text-center text-sm text-slate-500">No leads stored yet.</div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">WhatsApp</th><th className="p-4">Created</th><th className="p-4">Last Activity</th><th className="p-4">Action</th></tr></thead><tbody>{leads.map(l => <tr key={l.id} className="border-t border-slate-100"><td className="p-4 font-bold text-slate-900">{l.name}</td><td className="p-4 text-slate-700">{l.email}</td><td className="p-4 text-slate-700">{l.whatsapp || "—"}</td><td className="p-4 text-slate-500">{l.createdAt ? new Date(l.createdAt).toLocaleString() : "—"}</td><td className="p-4 text-slate-500">{l.lastActivityAt ? new Date(l.lastActivityAt).toLocaleString() : "—"}{l.role === "candidate" && typeof l.inactiveDays === "number" ? <span className="ml-2 text-[10px] font-black text-slate-400">({l.inactiveDays}d inactive)</span> : null}</td><td className="p-4"><button disabled={busy || l.role !== "candidate"} onClick={() => void deleteLead(l.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-black text-rose-600 hover:bg-rose-50 disabled:opacity-40"><Trash2 className="mr-1 inline h-3.5 w-3.5"/> Delete</button></td></tr>)}</tbody></table></div>}
    </section>

    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-900"><AlertTriangle className="mr-1 inline h-4 w-4"/> Passwords are not available as lead data. The system stores a one-way password representation for authentication; neither the Director nor an export can recover the original password.</div>
  </div>;
};
