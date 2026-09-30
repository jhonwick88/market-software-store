import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, PackageCheck, MessageCircle, Sun, Moon, BookOpen } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Pintar<span className="text-indigo-600 dark:text-indigo-400">Labs</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">Store</span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Marketplace Software Siap Pakai</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname === '/' 
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white dark:shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/explore"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname === '/explore' 
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white dark:shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              Jelajahi Software
            </Link>
            <Link
              to="/docs"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                location.pathname === '/docs' || location.pathname === '/panduan'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white dark:shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pusat Panduan</span>
            </Link>
            <Link
              to="/track"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                location.pathname === '/track' || location.pathname === '/portal'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-indigo-600 dark:text-white dark:shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Lacak Pesanan</span>
            </Link>
          </div>

          {/* Right Action: Theme Switcher & WhatsApp CS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Beralih ke tema ${theme === 'light' ? 'Gelap (Dark)' : 'Terang (Light)'}`}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline text-[11px] font-medium text-slate-700">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-[11px] font-medium text-slate-200">Light</span>
                </>
              )}
            </button>

            {/* WhatsApp CS Button */}
            <a
              href="https://wa.me/6282132935169?text=Halo%20CS%20PintarLabs,%20saya%20ingin%20tanya%20seputar%20software%20aplikasi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 dark:border-emerald-500/30 dark:text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden lg:inline">CS WA: 0821-3293-5169</span>
              <span className="lg:hidden">CS WA</span>
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}
