import React, { useState } from 'react';
import axios from 'axios';
import { Search, Package, ShieldCheck, CheckCircle2, Clock, AlertCircle, Download, MessageCircle, FileText } from 'lucide-react';
import SEO from '../components/SEO';

export default function TrackingPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setOrder(null);
      const res = await axios.get(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      setOrder(res.data.data || res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Pesanan tidak ditemukan. Periksa kembali No. Invoice / No. WhatsApp Anda.');
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  return (
    <div className="min-h-screen py-12 transition-colors duration-200">
      <SEO 
        title="Lacak Pesanan & Download Software"
        description="Cek status pesanan, unduh invoice, dan akses link download resmi software Anda secara instan menggunakan No. Invoice atau WhatsApp."
        canonical="https://labspintar.com/track"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Lacak Pesanan & Unduhan</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Masukkan Nomor Invoice (misal: INV-202609-XXXX) atau No. WhatsApp saat checkout.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: INV-202609-3212 atau 08123456789"
              className="w-full pl-4 pr-32 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 shadow-md"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors disabled:opacity-50"
            >
              {loading ? 'Mencari...' : 'Lacak'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-300 text-xs flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Nomor Invoice</span>
                <h2 className="text-lg font-mono font-bold text-indigo-600 dark:text-white">{order.order_number || order.invoice_number}</h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                order.status === 'COMPLETED' || order.status === 'PAID'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
              }`}>
                {order.status === 'COMPLETED' || order.status === 'PAID' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Software:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{order.product_name}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Paket:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{order.plan_name}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Pemesan:</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{order.customer_name} ({order.customer_phone})</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Total Tagihan:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatRupiah(order.total_amount)}</span>
              </div>
            </div>

            {/* Direct Official Download Links */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                <Download className="w-4 h-4" />
                <span>Link Download File Software Resmi:</span>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {order.windows_installer_url && (
                  <a
                    href={order.windows_installer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Installer Windows (.exe)</span>
                  </a>
                )}
                {order.android_apk_url && (
                  <a
                    href={order.android_apk_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>APK Android (.apk)</span>
                  </a>
                )}
                {order.user_manual_pdf_url && (
                  <a
                    href={order.user_manual_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Buku Panduan PDF</span>
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/6282132935169?text=${encodeURIComponent(
                  `Halo CS PintarLabs, saya ingin konfirmasi status pesanan Invoice: ${order.order_number || order.invoice_number}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi ke WhatsApp CS</span>
              </a>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
