import React, { useState } from 'react';
import { Search, Key, Download, FileText, CheckCircle2, ShieldCheck, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';

export default function CustomerPortalPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await fetch(`/api/orders/lookup/by-contact?q=${encodeURIComponent(query.trim())}`);
      const json = await res.json();
      if (json.status === 'success') {
        setResult(json.data);
      } else {
        setErrorMsg(json.message || 'Data tidak ditemukan');
      }
    } catch (err) {
      setErrorMsg('Gagal menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Key className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Portal Download & Lisensi Saya</h1>
        <p className="text-xs text-slate-400 mt-2">
          Masukkan No. WhatsApp atau Email saat pembelian untuk melihat seluruh riwayat lisensi dan mengunduh ulang software Anda.
        </p>
      </div>

      {/* Search Lookup Form */}
      <div className="max-w-xl mx-auto mb-12">
        <form onSubmit={handleLookup} className="glass-card p-2 rounded-2xl border border-white/10 flex gap-2">
          <input
            type="text"
            required
            placeholder="Ketik No. WhatsApp (0812...) atau Email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-white/5 focus:border-indigo-500 focus:outline-none text-white text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-colors"
          >
            {loading ? 'Mencari...' : 'Cek Lisensi'}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="p-6 rounded-2xl glass-card border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Pemilik Akun</span>
              <h3 className="text-lg font-bold text-white">{result.customer?.name}</h3>
              <p className="text-xs text-slate-400">{result.customer?.phone} • {result.customer?.email || 'No email'}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {result.licenses?.length || 0} Lisensi Aktif
            </span>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Daftar Software & Kode Lisensi</h3>

            {result.licenses?.map((lic) => (
              <div key={lic.id} className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400">{lic.plan_name}</span>
                    <h4 className="text-lg font-bold text-white">{lic.product_name}</h4>
                    <span className="text-xs text-slate-500">Versi: {lic.version}</span>
                  </div>

                  <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    lic.status === 'ACTIVE' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    Status: {lic.status}
                  </span>
                </div>

                {/* License Key Box */}
                <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Serial License Key:</span>
                    <span className="font-mono text-sm sm:text-base font-extrabold text-amber-300 select-all">
                      {lic.license_key}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(lic.license_key)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-semibold border border-indigo-500/30 transition-colors"
                  >
                    {copiedKey === lic.license_key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === lic.license_key ? 'Tersalin' : 'Salin'}
                  </button>
                </div>

                {/* Download Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {lic.windows_installer_url && (
                    <a
                      href={lic.windows_installer_url}
                      className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center border border-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4 text-sky-400" /> Installer Windows (.exe)
                    </a>
                  )}

                  {lic.android_apk_url && (
                    <a
                      href={lic.android_apk_url}
                      className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center border border-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4 text-emerald-400" /> Aplikasi Android (.apk)
                    </a>
                  )}

                  {lic.user_manual_pdf_url && (
                    <a
                      href={lic.user_manual_pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center border border-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-pink-400" /> Buku Panduan (PDF)
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
