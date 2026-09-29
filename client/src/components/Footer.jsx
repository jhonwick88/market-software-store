import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, MessageCircle, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070A11] mt-20 pt-16 pb-12 text-slate-600 dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                Pintar<span className="text-indigo-600 dark:text-indigo-400">Labs</span> Store
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mb-6">
              Pusat download & marketplace resmi penjualan aplikasi software siap pakai berkualitas tinggi untuk Windows PC dan Android Mobile. Garansi installer resmi dan dukungan bantuan CS 24/7.
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% Bebas Virus & Teruji
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Garansi Aktivasi Resmi
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Kategori Software</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/explore" className="hover:text-indigo-600 dark:hover:text-white transition-colors">POS & Kasir Resto</Link></li>
              <li><Link to="/explore" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Stok Gudang & Inventori</Link></li>
              <li><Link to="/explore" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Absensi Biometrik & GPS</Link></li>
              <li><Link to="/explore" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Bell Otomatis Sekolah & Pabrik</Link></li>
              <li><Link to="/explore" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Tiket Travel & Denah Bus</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Layanan & Bantuan</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/track" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Lacak Status Pesanan</Link></li>
              <li>
                <a 
                  href="https://wa.me/6282132935169" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp: 0821-3293-5169</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PintarLabs Software Marketplace Indonesia. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk UKM & Bisnis Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
