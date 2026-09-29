import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Sparkles, ShieldCheck, Zap, Download, Search, Award, Headphones, ArrowRight
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/products');
      const data = res.data.data || res.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Katalog Software Siap Pakai PintarLabs",
    "description": "Daftar software kasir POS, stok gudang, absensi biometrik, bell otomatis, surat desa, dan tiket bus.",
    "itemListElement": products.map((prod, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": prod.name,
        "description": prod.tagline || prod.description,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Windows, Android",
        "url": `https://labspintar.com/product/${prod.slug}`
      }
    }))
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Marketplace Software & Lisensi Aplikasi Siap Pakai Indonesia"
        description="Download software kasir POS resto, manajemen stok gudang, absensi biometrik GPS, bell sekolah, tiket bus, surat desa SiPintar, dan retribusi pasar. Lisensi resmi & aktif instan."
        canonical="https://labspintar.com/"
        schema={homeSchema}
      />

      {/* Hero Section */}
      <header className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Pusat Software Bisnis & Aplikasi Siap Pakai</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              Download Software Resmi & Beli Aplikasi <span className="text-indigo-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Siap Pakai</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Solusi aplikasi desktop Windows (.exe) dan Android (.apk) untuk POS Kasir, Stok Gudang, Absensi Biometrik GPS, Bell Otomatis, Surat Digital, dan Tiket Travel. Unduh gratis trial dan beli paket resmi.
            </p>

            {/* Quick Search */}
            <div className="max-w-xl mx-auto relative mb-10">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari software (misal: POS Resto, Hompimpa, Bell, Biometrik, Surat)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-md transition-all"
                />
              </div>
            </div>

            {/* Key Value Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Instan & Siap Pakai</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Tanpa ribet coding</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Download Resmi</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Installer .exe & .apk</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Garansi 100%</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Jaminan berjalan lancar</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-xs flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">CS WhatsApp</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Panduan & bantuan cepat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Product Catalog Section */}
      <main className="py-14 bg-slate-50 dark:bg-slate-950 transition-colors duration-200" id="katalog-produk">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Katalog Unggulan ({products.length} Software)</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Pilihan Software Aplikasi Siap Pakai
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 md:mt-0 max-w-md">
              Semua aplikasi dilengkapi installer offline/online, panduan PDF lengkap, dan opsi paket harga fleksibel.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-80 rounded-2xl bg-white dark:bg-slate-900/50 animate-pulse border border-slate-200 dark:border-slate-800" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 text-base">Tidak ada software yang cocok dengan kata kunci "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* How to Buy Guide */}
      <section className="py-16 bg-white dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/60 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Cara Kerja</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              3 Langkah Mudah Pembelian Software
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center mb-4 border border-indigo-200 dark:border-indigo-500/30">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Pilih Software & Paket</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Pilih aplikasi yang sesuai kebutuhan bisnis Anda dan tentukan paket (Single Outlet, Multi-Device, atau Lifetime).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center mb-4 border border-purple-200 dark:border-purple-500/30">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Checkout & Bayar Instan</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Lakukan pembayaran melalui QRIS atau Transfer Bank. Nomor Invoice resmi diterbitkan seketika.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-500/30">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Unduh & Jalankan</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Unduh file installer (.exe/.apk) dan panduan PDF lengkap untuk langsung digunakan di perangkat Anda.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
