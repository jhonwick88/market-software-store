import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Download, Key, FileText, Video, MessageCircle, Copy, Check } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, product, selectedPlan }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company_name: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !product || !selectedPlan) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg('Nama dan No. WhatsApp wajib diisi');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          company_name: formData.company_name,
          product_id: product.id,
          plan_id: selectedPlan.id,
          payment_method: 'whatsapp',
          notes: formData.notes
        })
      });

      const json = await res.json();
      if (json.status === 'success') {
        setOrderResult(json.data);
      } else {
        setErrorMsg(json.message || 'Gagal memproses pesanan');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (orderResult?.license?.license_key) {
      navigator.clipboard.writeText(orderResult.license.license_key);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl glass-card rounded-2xl p-6 sm:p-8 bg-[#0F172A] border border-white/10 shadow-2xl text-slate-100 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!orderResult ? (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Pemesanan Langsung
              </span>
              <h3 className="text-xl font-bold text-white mt-2">Dapatkan {product.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Paket: <span className="font-semibold text-indigo-300">{selectedPlan.name}</span> — 
                <span className="font-bold text-emerald-400 ml-1">Rp {selectedPlan.price.toLocaleString('id-ID')}</span>
                <span className="text-slate-500 text-[11px] ml-1">({selectedPlan.billing_type === 'lifetime' ? 'Bayar Sekali Selamanya' : selectedPlan.billing_type})</span>
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Lengkap / Nama Pemilik *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">No. WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email (Opsional)</label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Usaha / Toko (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Cafe Kenangan Senja"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm"
                />
              </div>

              {/* What is included badge */}
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs space-y-1 text-slate-300">
                <p className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> Yang Anda Dapatkan Instan:
                </p>
                <p>✓ Installer Windows Desktop (.exe) & APK Android</p>
                <p>✓ Serial / License Key Resmi PintarLabs</p>
                <p>✓ Buku Panduan E-Book PDF & Akses Video Tutorial</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Memproses Pesanan & Generate Lisensi...' : 'Lanjutkan & Dapatkan Serial Key Sekarang'}
              </button>
            </form>
          </div>
        ) : (
          /* Order Success Screen */
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">Pesanan Berhasil Dibuat!</h3>
            <p className="text-xs text-slate-400 mb-6">
              No. Pesanan: <span className="font-mono text-indigo-300 font-semibold">{orderResult.order_number}</span>
            </p>

            {/* License Key Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/40 text-left mb-6 relative group">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-indigo-400" /> Serial License Key Anda
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-base sm:text-lg font-extrabold text-amber-300 tracking-wide select-all">
                  {orderResult.license.license_key}
                </span>
                <button
                  onClick={handleCopyKey}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-semibold border border-indigo-500/30 transition-colors"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey ? 'Tersalin' : 'Salin'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Maksimal Perangkat: <span className="font-semibold text-white">{orderResult.license.max_devices} Device</span> (Windows & Android)
              </p>
            </div>

            {/* Direct Downloads */}
            <div className="space-y-2.5 mb-6 text-left">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">File Software Siap Download:</p>
              
              {orderResult.product.windows_installer_url && (
                <a
                  href={orderResult.product.windows_installer_url}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 transition-colors text-xs"
                >
                  <span className="flex items-center gap-2 font-semibold text-sky-300">
                    <Download className="w-4 h-4 text-sky-400" /> Installer Windows (.exe)
                  </span>
                  <span className="text-[11px] text-slate-400">Download</span>
                </a>
              )}

              {orderResult.product.android_apk_url && (
                <a
                  href={orderResult.product.android_apk_url}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 transition-colors text-xs"
                >
                  <span className="flex items-center gap-2 font-semibold text-emerald-300">
                    <Download className="w-4 h-4 text-emerald-400" /> Aplikasi Android (.apk)
                  </span>
                  <span className="text-[11px] text-slate-400">Download</span>
                </a>
              )}

              {orderResult.product.user_manual_pdf_url && (
                <a
                  href={orderResult.product.user_manual_pdf_url}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 transition-colors text-xs"
                >
                  <span className="flex items-center gap-2 font-semibold text-pink-300">
                    <FileText className="w-4 h-4 text-pink-400" /> E-Book Panduan Penggunaan (PDF)
                  </span>
                  <span className="text-[11px] text-slate-400">Buka PDF</span>
                </a>
              )}
            </div>

            {/* WhatsApp Confirmation Button */}
            {orderResult.whatsapp_url && (
              <a
                href={orderResult.whatsapp_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Konfirmasi Pesanan ke WhatsApp PintarLabs
              </a>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
