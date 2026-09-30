import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Sparkles, ShieldCheck, Zap, Download, Search, Award, Headphones, ArrowRight,
  ChevronLeft, ChevronRight, Star, CheckCircle2, HelpCircle, ChevronDown
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories')
      ]);
      const prods = prodRes.data.data || prodRes.data || [];
      const cats = catRes.data.data || catRes.data || [];
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category_id === selectedCategory || p.category_slug === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Reset to page 1 on search or category filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const catalogEl = document.getElementById('katalog-produk');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
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

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs'
              }`}
            >
              Semua Kategori ({products.length})
            </button>
            {categories.map(c => {
              const count = products.filter(p => p.category_id === c.id || p.category_slug === c.slug).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs'
                  }`}
                >
                  {c.name} {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Menampilkan <span className="font-semibold text-slate-900 dark:text-white">{startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}</span> dari <span className="font-semibold text-slate-900 dark:text-white">{filteredProducts.length}</span> software
                  </p>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                      aria-label="Halaman Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/20'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                      aria-label="Halaman Berikutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Trust & Guarantee Banner */}
      <section className="py-12 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white border-y border-indigo-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">100% Bebas Virus</h4>
                <p className="text-xs text-indigo-200/80">Installer resmi teruji bersih</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Gratis Remote AnyDesk</h4>
                <p className="text-xs text-emerald-200/80">Bantuan pasang & panduan printer</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Lisensi Permanen</h4>
                <p className="text-xs text-amber-200/80">Beli 1x pakai selamanya</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Tanpa Wajib Login</h4>
                <p className="text-xs text-sky-200/80">Pesan cepat, aktivasi instan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Customer Reviews */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Testimoni Klien</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Dipercaya Ribuan Pemilik Bisnis & Sekolah
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Ulasan nyata dari pengguna software kami di berbagai kota di Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed mb-4">
                  "PintarPOS sangat stabil! Koneksi PC kasir ke HP waiter Android lancar tanpa internet. Laporan rekonsiliasi kas laci saat tutup toko bikin keuangan resto kami anti-bocor."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Bpk. Hendra Wijaya</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Owner Resto & Cafe Mantap (Surabaya)</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Terverifikasi</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed mb-4">
                  "Bell Pintar otomatisnya sangat presisi. Suara narasi 3 bahasanya sangat jernih di speaker sekolah. Guru piket kami juga terbantu bisa remote dari HP Android saat apel pagi."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Ibu Ratna Dewi, S.Pd</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Wakasek SMP Terpadu (Bandung)</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Terverifikasi</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed mb-4">
                  "Aplikasi SiPintar Surat Desa sangat memudahkan staf kami. Cukup ketik NIK warga, surat langsung jadi dalam 1 menit lengkap dengan QR code verifikasi. Mantap sekali!"
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Bpk. H. Sukamto</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Sekretaris Desa (Jawa Tengah)</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Pusat Informasi</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Segala hal yang perlu Anda ketahui sebelum membeli lisensi software.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Apakah saya wajib membuat akun / login untuk membeli?',
                a: 'Tidak perlu. Anda dapat langsung memilih software yang diinginkan, klik "Beli Sekarang", dan mengisi nama serta nomor WhatsApp. Invoice resmi diterbitkan seketika, dan file installer dapat langsung diunduh.'
              },
              {
                q: 'Apakah aplikasi bisa berjalan offline tanpa koneksi internet?',
                a: 'Ya, mayoritas software kami (seperti PintarPOS, Bell Pintar, PintarStock, SiPintar Desa, PintarCBT) didesain dengan arsitektur Local-First yang 100% berjalan lancar tanpa koneksi internet maupun kuota data.'
              },
              {
                q: 'Bagaimana jika komputer saya rusak atau di-install ulang?',
                a: 'Kami memberikan garansi pemulihan lisensi. Anda cukup menghubungi CS WhatsApp resmi kami dengan menyertakan nomor invoice pembelian, dan tim kami akan membantu aktivasi ulang secara gratis.'
              },
              {
                q: 'Apakah ada bantuan teknis untuk setting printer dan jaringan LAN?',
                a: 'Tentu saja. Tim teknisi kami siap membantu Anda melakukan remote setup gratis melalui AnyDesk atau UltraViewer untuk konfigurasi printer thermal, barcode scanner, maupun koneksi jaringan antar perangkat.'
              },
              {
                q: 'Apakah ada biaya langganan bulanan atau tahunan tersembunyi?',
                a: 'Tidak ada. Paket lisensi kami bersifat Lifetime (Sekali Bayar Pakai Seumur Hidup) tanpa potongan komisi per transaksi maupun tagihan sewa bulanan.'
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

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
