import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Monitor, Smartphone, Download, ArrowRight } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

export default function ProductCard({ product }) {
  const mediaList = product.media || [];
  const primaryMedia = mediaList.length > 0 ? mediaList[0].url : '/images/pintarpos_resto.jpg';
  
  const tiers = product.plans || product.tiers || [];
  const lowestPrice = tiers.length > 0 
    ? Math.min(...tiers.map(t => Number(t.price) || 0))
    : 0;

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const platforms = typeof product.platforms === 'string' ? JSON.parse(product.platforms || '[]') : (product.platforms || []);
  const categoryName = product.category ? product.category.name : (product.category_name || 'Software Bisnis');

  return (
    <article className="group bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img 
            src={primaryMedia} 
            alt={`Screenshot ${product.name} - Software Lisensi PintarLabs`}
            title={product.name}
            loading="lazy"
            onError={(e) => handleImageError(e, '/images/pintarpos_resto.jpg')}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-xs font-semibold text-amber-500 dark:text-amber-400 shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-slate-800 dark:text-amber-400">{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
            <span className="text-slate-400 text-[10px]">({product.review_count || 12})</span>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {platforms.map((p, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 shadow-xs">
                {String(p).toLowerCase().includes('win') ? <Monitor className="w-3 h-3 text-sky-500 dark:text-sky-400" /> : <Smartphone className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />}
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5">
          <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-500/20 inline-block mb-2">
            {categoryName}
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
            <Link to={`/product/${product.slug}`} title={product.name}>
              {product.name}
            </Link>
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
            {product.tagline || product.description}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Mulai dari</span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-emerald-400 dark:to-teal-300">
            {lowestPrice > 0 ? formatRupiah(lowestPrice) : 'Free Trial'}
          </span>
        </div>
        <Link 
          to={`/product/${product.slug}`}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm hover:shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
        >
          <span>Detail & Beli</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
