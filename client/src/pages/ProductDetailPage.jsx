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
    <div className="min-h-screen py-10 transition-colors duration-200">
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
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-slate-200">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/explore" className="hover:text-slate-900 dark:hover:text-slate-200">Software</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Info Column */}
          <main className="lg:col-span-8 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 text-xs font-semibold mb-3">
                <span>{categoryName}</span>
                <span>•</span>
                <span>v{product.version || '1.0.0'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                {product.name}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Media Tabs & Display */}
            <div className="space-y-3">
              {youtubeEmbedUrl && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveMediaTab('screenshot')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeMediaTab === 'screenshot'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Screenshot Aplikasi ({product.media?.length || 1})</span>
                  </button>

                  <button
                    onClick={() => setActiveMediaTab('video')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeMediaTab === 'video'
                        ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Video Demo (YouTube)</span>
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                  </button>
                </div>
              )}

              {/* Product Screenshot / Video View */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md">
                {activeMediaTab === 'video' && youtubeEmbedUrl ? (
                  <iframe
                    src={youtubeEmbedUrl}
                    title={`Video Demo ${product.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                ) : (
                  <img 
                    src={product.media && product.media[selectedImageIndex] ? product.media[selectedImageIndex].url : primaryMedia} 
                    alt={`Tampilan Aplikasi ${product.name} - Software PintarLabs`}
                    title={product.media && product.media[selectedImageIndex]?.caption || product.name}
                    onError={(e) => handleImageError(e, '/images/pintarpos_resto.jpg')}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                )}
              </div>

              {/* Thumbnail Strip if Multiple Screenshots */}
              {activeMediaTab === 'screenshot' && product.media && product.media.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5">
                  {product.media.map((m, idx) => (
                    <button
                      key={m.id || idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative shrink-0 w-20 h-13 sm:w-24 sm:h-15 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-indigo-600 ring-2 ring-indigo-600/30 shadow-md scale-105'
                          : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
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
              )}
            </div>

            {/* Description & Features */}
            <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Deskripsi & Kemampuan Software
              </h2>
              <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </div>

              {product.features && product.features.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Fitur Utama:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{feat.name || feat.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{feat.description || feat.group_name || 'Fitur terintegrasi'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Dedicated Video Demo Section (if available) */}
            {youtubeEmbedUrl && (
              <section id="demo-video-section" className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-500/20 shrink-0">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Video Demo & Tutorial Aplikasi</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300">YouTube</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Tonton demonstrasi lengkap fitur dan kemudahan pengoperasian {product.name}.
                      </p>
                    </div>
                  </div>
                  <a
                    href={product.video_tutorial_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors shrink-0"
                  >
                    <span>Tonton di YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
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
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Platform & Spesifikasi
                </h3>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p><span className="text-slate-400">Platform:</span> {platforms.join(', ') || 'Windows 10/11, Android 8+'}</p>
                  <p><span className="text-slate-400">Kebutuhan:</span> {typeof product.min_requirements === 'string' ? product.min_requirements : 'Intel Core i3 / RAM 4GB / Storage 10GB'}</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Dukungan Perangkat Keras
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {hardware.length > 0 ? hardware.map((h, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                      {h}
                    </span>
                  )) : (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Printer Thermal 58/80mm, Barcode Scanner, Cash Drawer</span>
                  )}
                </div>
              </div>
            </section>
          </main>

          {/* Pricing & Checkout Column */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Pilih Paket Software</h2>

              <div className="space-y-3 mb-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan?.id === plan.id
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm dark:border-indigo-500 dark:bg-indigo-500/10'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{plan.name}</span>
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(plan.price)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {plan.description || 'Paket siap pakai dengan dukungan penuh'}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-indigo-700 dark:text-indigo-300 font-medium">
                      <span>{plan.device_limit ? plan.device_limit.max_workstations + ' Device' : 'Siap Pakai'}</span>
                      <span>•</span>
                      <span>{plan.code || 'LIFETIME'}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                disabled={!selectedPlan}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Beli Sekarang</span>
              </button>

              {/* Trial Download Link */}
              {product.trial_download_url && (
                <a
                  href={product.trial_download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
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
                  className="w-full mt-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-red-200 dark:border-red-500/20"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Tonton Video Demo YouTube</span>
                </button>
              )}

              {/* Guarantees */}
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Garansi Installer Resmi Bebas Virus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>Invoice & Link Download Instan</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                  <span>Bantuan Panduan WhatsApp CS 24/7</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {orderSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-500/30">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pesanan Berhasil Dibuat!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Invoice <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{orderSuccess.invoice_number}</span> telah diterbitkan.
                </p>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Software:</span>
                    <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Paket:</span>
                    <span className="text-slate-900 dark:text-white font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Tagihan:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{formatRupiah(orderSuccess.total_amount)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href={`https://wa.me/6282132935169?text=${encodeURIComponent(
                      `Halo CS PintarLabs, saya ingin konfirmasi pembayaran Invoice: ${orderSuccess.invoice_number} untuk ${product.name} (${selectedPlan.name}). Total: ${formatRupiah(orderSuccess.total_amount)}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Konfirmasi via WhatsApp CS (0821-3293-5169)</span>
                  </a>
                  <button
                    onClick={() => {
                      setShowCheckout(false);
                      setOrderSuccess(null);
                    }}
                    className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Checkout Pemesanan Software</h3>
                  <button 
                    type="button" 
                    onClick={() => setShowCheckout(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/20 text-xs">
                  <p className="font-semibold text-indigo-900 dark:text-white">{product.name} - {selectedPlan?.name}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mt-0.5">{formatRupiah(selectedPlan?.price || 0)}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email (Opsional)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Contoh: budi@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Usaha / Toko (Opsional)</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Contoh: Resto Mie Mantap"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Metode Pembayaran</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
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
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
