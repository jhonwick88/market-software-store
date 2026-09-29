import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Check, Star, ShieldCheck, Download, Monitor, Smartphone, 
  ChevronRight, Zap, RefreshCw, AlertCircle, ShoppingCart,
  Play, Video, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import SEO from '../components/SEO';
import { handleImageError } from '../utils/imageFallback';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMediaTab, setActiveMediaTab] = useState('screenshot'); // 'screenshot' | 'video'
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Modal checkout state
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/api/products/${slug}`);
      const prod = res.data.data || res.data;
      setProduct(prod);

      const plans = prod.plans || prod.tiers || [];
      if (plans.length > 0) {
        setSelectedPlan(plans[0]);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Software tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedPlan) return;

    try {
      setSubmitting(true);
      const payload = {
        product_id: product.id,
        plan_id: selectedPlan.id,
        tier_id: selectedPlan.id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_company: companyName,
        payment_method: paymentMethod
      };

      const res = await axios.post('/api/orders/checkout', payload);
      setOrderSuccess(res.data.data || res.data);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Gagal memproses pesanan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Software Tidak Ditemukan</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Produk software yang Anda cari mungkin telah dipindahkan atau dinonaktifkan.</p>
        <Link to="/" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[1] && match[1].length === 11) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0`;
    }
    if (url.includes('youtube.com/embed/')) return url;
    return null;
  };

  const platforms = typeof product.platforms === 'string' ? JSON.parse(product.platforms || '[]') : (product.platforms || []);
  const hardware = typeof product.hardware_compat === 'string' ? JSON.parse(product.hardware_compat || '[]') : (product.hardware_compat || []);
  const primaryMedia = product.media && product.media.length > 0 ? product.media[0].url : '/images/pintarpos_resto.jpg';
  const plans = product.plans || product.tiers || [];
  const minPrice = plans.length > 0 ? Math.min(...plans.map(t => Number(t.price) || 0)) : 0;
  const maxPrice = plans.length > 0 ? Math.max(...plans.map(t => Number(t.price) || 0)) : 0;
  const categoryName = product.category ? product.category.name : (product.category_name || 'Software Bisnis');
  const youtubeEmbedUrl = getYouTubeEmbedUrl(product.video_tutorial_url);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": product.name,
    "headline": product.tagline || product.name,
    "description": product.description,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": platforms.join(', ') || "Windows, Android",
    "softwareVersion": product.version || "1.0.0",
    "image": `https://labspintar.com${primaryMedia}`,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "IDR",
      "lowPrice": minPrice,
      "highPrice": maxPrice,
      "offerCount": plans.length || 1,
      "offers": plans.map(t => ({
        "@type": "Offer",
        "name": `${product.name} - ${t.name}`,
        "price": t.price,
        "priceCurrency": "IDR",
        "availability": "https://schema.org/InStock",
        "url": `https://labspintar.com/product/${product.slug}`
      }))
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating ? Number(product.rating).toFixed(1) : "5.0",
      "reviewCount": product.review_count || 15
    },
    "publisher": {
      "@type": "Organization",
      "name": "PintarLabs Indonesia",
      "url": "https://labspintar.com"
    }
  };

  return (
    <div className="relative min-h-screen py-10 transition-colors duration-200 overflow-hidden">
      {/* Background Ambient Decorative Light Gradients */}
      <div className="pointer-events-none absolute -top-32 right-10 w-96 h-96 bg-gradient-to-br from-indigo-200/40 via-purple-100/30 to-transparent dark:from-indigo-600/10 dark:to-transparent rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-96 -left-20 w-80 h-80 bg-gradient-to-tr from-pink-200/30 via-sky-100/30 to-transparent dark:from-pink-600/10 dark:to-transparent rounded-full blur-3xl -z-10" />

      <SEO 
        title={`${product.name} - Download Installer & Beli Software`}
        description={`${product.name}: ${product.tagline || product.description}. Unduh installer trial dan beli paket resmi.`}
        canonical={`https://labspintar.com/product/${product.slug}`}
        ogImage={`https://labspintar.com${primaryMedia}`}
        ogType="product"
        schema={productSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md text-xs text-slate-500 dark:text-slate-400 mb-8 shadow-xs" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link to="/explore" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Katalog Software</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Info Column */}
          <main className="lg:col-span-8 space-y-8">
            <div>
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 text-xs font-bold shadow-xs">
                  <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  {categoryName}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  Versi {product.version || '1.0.0'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
                  <span className="font-normal text-amber-700/80 dark:text-amber-400/80">({product.review_count || 15}+ Ulasan)</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Lisensi Resmi
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                {product.name}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Media Tabs & Display Container */}
            <div className="space-y-3">
              {youtubeEmbedUrl && (
                <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 w-fit">
                  <button
                    onClick={() => setActiveMediaTab('screenshot')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeMediaTab === 'screenshot'
                        ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md shadow-slate-200 dark:shadow-indigo-600/30 border border-slate-200/60 dark:border-transparent'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-white" />
                    <span>Screenshot Aplikasi ({product.media?.length || 1})</span>
                  </button>

                  <button
                    onClick={() => setActiveMediaTab('video')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeMediaTab === 'video'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-rose-500 dark:text-white" />
                    <span>Video Demo (YouTube)</span>
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                  </button>
                </div>
              )}

              {/* Product Screenshot / Video Frame with Zoom Feature */}
              <div className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-none group">
                {activeMediaTab === 'video' && youtubeEmbedUrl ? (
                  <iframe
                    src={youtubeEmbedUrl}
                    title={`Video Demo ${product.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                ) : (
                  <>
                    <img 
                      src={product.media && product.media[selectedImageIndex] ? product.media[selectedImageIndex].url : primaryMedia} 
                      alt={`Tampilan Aplikasi ${product.name} - Software PintarLabs`}
                      title={product.media && product.media[selectedImageIndex]?.caption || product.name}
                      onError={(e) => handleImageError(e, '/images/pintarpos_resto.jpg')}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none">
                      <p className="text-white text-xs font-semibold drop-shadow-md">
                        {product.media && product.media[selectedImageIndex]?.caption || product.name}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip if Multiple Screenshots */}
              {activeMediaTab === 'screenshot' && product.media && product.media.length > 1 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                    {product.media.map((m, idx) => (
                      <button
                        key={m.id || idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative shrink-0 w-24 h-15 sm:w-28 sm:h-18 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedImageIndex === idx
                            ? 'border-indigo-600 ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-500/15 scale-105 opacity-100'
                            : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={m.url}
                          alt={m.caption || `Screenshot ${idx + 1}`}
                          onError={(e) => handleImageError(e, '/images/pintarpos_resto.jpg')}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    💡 Klik thumbnail di atas untuk melihat pratinjau {product.media.length} screenshot tampilan aplikasi secara lengkap.
                  </p>
                </div>
              )}
            </div>

            {/* Key Value Propositions / USP Cards (Anti-Bocor, 100% Offline, Multi-Device, Lifetime) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 text-left">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold mb-2">
                  ⚡
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% Offline</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Bebas kuota, tanpa butuh internet</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold mb-2">
                  🛡️
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Anti-Bocor Kas</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Rekonsiliasi shift laci kasir</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent border border-sky-500/20 text-left">
                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold mb-2">
                  📱
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Multi-Device LAN</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">PC Windows + HP Android</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 text-left">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold mb-2">
                  💎
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">1x Bayar Selamanya</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Tanpa sewa bulanan / komisi</p>
              </div>
            </div>

            {/* Description & Features Section */}
            <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/80 dark:shadow-none space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/80 dark:border-indigo-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Deskripsi & Kemampuan Software
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Solusi teknologi handal untuk mendukung operasional bisnis Anda</p>
                </div>
              </div>

              <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {product.description}
              </div>

              {product.features && product.features.length > 0 && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Fitur & Modul Unggulan:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/20 dark:from-slate-950/60 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all hover:shadow-xs">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60 dark:border-emerald-500/30">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{feat.name || feat.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{feat.description || feat.group_name || 'Modul siap pakai dan terintegrasi'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Dedicated Video Demo Section (if available) */}
            {youtubeEmbedUrl && (
              <section id="demo-video-section" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/80 dark:shadow-none space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 flex items-center justify-center border border-rose-200/80 dark:border-rose-500/20 shrink-0">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Video Demo & Panduan Pengoperasian</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">YouTube Demo</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Tonton langsung kemudahan alur kerja & interface {product.name}.
                      </p>
                    </div>
                  </div>
                  <a
                    href={product.video_tutorial_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors shrink-0 border border-slate-200 dark:border-slate-700"
                  >
                    <span>Buka di YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-md">
                  <iframe
                    src={youtubeEmbedUrl}
                    title={`Video Demo ${product.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                </div>
              </section>
            )}

            {/* Compatibility & Requirements */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/80 dark:shadow-none">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3.5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 flex items-center justify-center border border-sky-200/80 dark:border-sky-500/20">
                    <Monitor className="w-4 h-4" />
                  </div>
                  Platform & Spesifikasi
                </h3>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">OS Didukung:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{platforms.join(', ') || 'Windows 10/11, Android 8+'}</span>
                  </p>
                  <p className="flex justify-between py-1">
                    <span className="text-slate-500 dark:text-slate-400">Min. Hardware:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{typeof product.min_requirements === 'string' ? product.min_requirements : 'Intel Core i3 / RAM 4GB'}</span>
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/80 dark:shadow-none">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3.5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/80 dark:border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  Dukungan Perangkat Keras
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hardware.length > 0 ? hardware.map((h, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
                      {h}
                    </span>
                  )) : (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Printer Thermal 58/80mm, Barcode Scanner, Cash Drawer, Sound System</span>
                  )}
                </div>
              </div>
            </section>
          </main>

          {/* Pricing & Checkout Column */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-none sticky top-24">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Pilih Paket Lisensi</h2>
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/20">
                  Sekali Bayar
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {plans.map((plan) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-2 border-indigo-600 bg-gradient-to-br from-indigo-50/90 via-indigo-50/40 to-white dark:from-indigo-500/15 dark:to-slate-900/90 shadow-md shadow-indigo-600/10 ring-2 ring-indigo-500/20'
                          : 'border border-slate-200/90 bg-white hover:bg-slate-50/80 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>}
                          {plan.name}
                        </span>
                        <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(plan.price)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {plan.description || 'Paket siap pakai dengan dukungan penuh'}
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {plan.device_limit ? plan.device_limit.max_workstations + ' Workstation' : 'Unlimited Device'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                          {plan.code || 'LIFETIME'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                disabled={!selectedPlan}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Beli Sekarang ({selectedPlan ? formatRupiah(selectedPlan.price) : 'Pilih Paket'})</span>
              </button>

              {/* Trial Download Link */}
              {product.trial_download_url && (
                <a
                  href={product.trial_download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200/90 dark:border-slate-700 shadow-xs"
                >
                  <Download className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Download Demo / Trial Installer</span>
                </a>
              )}

              {/* Video Demo Quick Link */}
              {youtubeEmbedUrl && (
                <button
                  onClick={() => {
                    setActiveMediaTab('video');
                    const el = document.getElementById('demo-video-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full mt-2 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-rose-200/80 dark:border-rose-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Tonton Video Demo YouTube</span>
                </button>
              )}

              {/* Guarantees */}
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>Installer Resmi Bebas Virus & Bergaransi</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span>Invoice Otomatis & Link Download Instan</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>
                  <span>Bantuan Panduan WhatsApp CS Resmi</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            {orderSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-500/30">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pesanan Berhasil Dibuat!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Invoice <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{orderSuccess.invoice_number}</span> telah diterbitkan.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 text-left space-y-2 text-xs mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Software:</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Paket:</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">Total Tagihan:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{formatRupiah(orderSuccess.total_amount)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href={`https://wa.me/6282132935169?text=${encodeURIComponent(
                      `Halo CS PintarLabs, saya ingin konfirmasi pembayaran Invoice: ${orderSuccess.invoice_number} untuk ${product.name} (${selectedPlan.name}). Total: ${formatRupiah(orderSuccess.total_amount)}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                  >
                    <span>Konfirmasi via WhatsApp CS (0821-3293-5169)</span>
                  </a>
                  <button
                    onClick={() => {
                      setShowCheckout(false);
                      setOrderSuccess(null);
                    }}
                    className="py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Checkout Pemesanan</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Lengkapi data untuk penerbitan invoice & lisensi</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowCheckout(false)}
                    className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200/80 dark:border-indigo-500/20 text-xs">
                  <p className="font-semibold text-indigo-950 dark:text-white">{product.name} - {selectedPlan?.name}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base mt-0.5">{formatRupiah(selectedPlan?.price || 0)}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email (Opsional)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Contoh: budi@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Usaha / Toko (Opsional)</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Contoh: Resto Mie Mantap"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Metode Pembayaran</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  >
                    <option value="QRIS">QRIS (BCA, Mandiri, GoPay, OVO, ShopeePay)</option>
                    <option value="BCA">Transfer Bank BCA</option>
                    <option value="MANDIRI">Transfer Bank Mandiri</option>
                    <option value="BRI">Transfer Bank BRI</option>
                  </select>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Memproses Pesanan...' : 'Lanjutkan Pembayaran'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
