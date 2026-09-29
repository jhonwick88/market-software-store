import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, ShoppingCart, DollarSign, Package, CheckCircle2, 
  Clock, XCircle, Search, RefreshCw, MessageCircle, Lock, LogOut,
  Edit, Play, Video, ExternalLink, Save, X, Eye, FileText, Check,
  AlertTriangle, Sparkles, Youtube, Upload, Trash2, Plus, Image as ImageIcon,
  ArrowUp, ArrowDown, Star
} from 'lucide-react';
import SEO from '../components/SEO';

export default function AdminDashboardPage() {
  const [token, setToken] = useState(localStorage.getItem('pintarlabs_store_admin_token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'catalog'
  const [overview, setOverview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    tagline: '',
    version: '',
    video_tutorial_url: '',
    windows_installer_url: '',
    android_apk_url: '',
    user_manual_pdf_url: '',
    trial_download_url: '',
    is_published: 1,
    is_featured: 0,
    media: []
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [manualImageCaption, setManualImageCaption] = useState('');

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

  const openEditModal = (p) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name || '',
      tagline: p.tagline || '',
      version: p.version || 'v1.0.0',
      video_tutorial_url: p.video_tutorial_url || '',
      windows_installer_url: p.windows_installer_url || '',
      android_apk_url: p.android_apk_url || '',
      user_manual_pdf_url: p.user_manual_pdf_url || '',
      trial_download_url: p.trial_download_url || '',
      is_published: p.is_published ?? 1,
      is_featured: p.is_featured ?? 0,
      media: Array.isArray(p.media) ? p.media.map(m => ({ id: m.id, url: m.url, caption: m.caption || '', type: m.type || 'screenshot' })) : []
    });
    setSaveSuccessMessage('');
    setManualImageUrl('');
    setManualImageCaption('');
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      
      const res = await axios.post('/api/upload', formData, { headers });
      const fileUrl = res.data.data.url;
      
      setEditForm(prev => ({
        ...prev,
        media: [
          ...prev.media,
          {
            id: 'med-' + Date.now(),
            url: fileUrl,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            type: 'screenshot'
          }
        ]
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengunggah file screenshot');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddManualImage = () => {
    if (!manualImageUrl.trim()) return;
    setEditForm(prev => ({
      ...prev,
      media: [
        ...prev.media,
        {
          id: 'med-' + Date.now(),
          url: manualImageUrl.trim(),
          caption: manualImageCaption.trim() || 'Tampilan Screenshot Aplikasi',
          type: 'screenshot'
        }
      ]
    }));
    setManualImageUrl('');
    setManualImageCaption('');
  };

  const handleRemoveMedia = (index) => {
    setEditForm(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const handleMoveMedia = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= editForm.media.length) return;
    const newMedia = [...editForm.media];
    const [moved] = newMedia.splice(fromIndex, 1);
    newMedia.splice(toIndex, 0, moved);
    setEditForm(prev => ({ ...prev, media: newMedia }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      setSavingProduct(true);
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        ...editingProduct,
        ...editForm
      };
      await axios.put(`/api/products/${editingProduct.id}`, payload, { headers });
      setSaveSuccessMessage('Data software, screenshot & video demo berhasil diperbarui!');
      await fetchDashboardData();
      setTimeout(() => {
        setEditingProduct(null);
        setSaveSuccessMessage('');
      }, 1200);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan data produk');
    } finally {
      setSavingProduct(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, ordersRes, prodsRes] = await Promise.all([
        axios.get('/api/stats/overview', { headers }).catch(() => ({ data: { data: {} } })),
        axios.get('/api/orders/admin/list', { headers }).catch(() => ({ data: { data: [] } })),
        axios.get('/api/products')
      ]);

      setOverview(statsRes.data.data || {});
      setOrders(ordersRes.data.data || []);
      setProducts(prodsRes.data.data || prodsRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.status === 'success' && res.data.data.token) {
        localStorage.setItem('pintarlabs_store_admin_token', res.data.data.token);
        setToken(res.data.data.token);
      } else {
        setAuthError('Login gagal. Email atau kata sandi tidak valid.');
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Email atau password salah.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pintarlabs_store_admin_token');
    setToken('');
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`/api/orders/admin/${orderId}/status`, { status }, { headers });
      fetchDashboardData();
    } catch (err) {
      alert('Gagal memperbarui status pesanan');
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  // Login Form if unauthenticated
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <SEO title="Admin Toko Software - PintarLabs" />
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Marketplace Toko</h1>
            <p className="text-xs text-slate-400 mt-1">Masuk untuk mengelola pesanan & omset software</p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs mb-4">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Admin</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pintarlabs.id"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Masuk ke Dashboard Toko
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center mt-6">
            Default Admin: <span className="text-slate-400 font-mono">admin@pintarlabs.id / admin123</span>
          </p>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => 
    o.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_phone?.includes(searchTerm) ||
    o.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10">
      <SEO title="Dashboard Admin Marketplace - PintarLabs" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Panel Manajemen Toko</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Marketplace Jual Beli Software</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Ringkasan & Omset</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Pesanan Masuk ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Katalog Software ({products.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview & Omset */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium mb-1">Total Omset Penjualan</span>
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  {formatRupiah(overview?.total_revenue)}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Dari transaksi status LUNAS</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium mb-1">Total Transaksi</span>
                <span className="text-2xl font-extrabold text-white">
                  {overview?.total_orders || 0}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Seluruh pesanan masuk</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium mb-1">Pesanan Lunas</span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  {overview?.paid_orders || 0}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Pembayaran terverifikasi</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium mb-1">Menunggu Pembayaran</span>
                <span className="text-2xl font-extrabold text-amber-400">
                  {overview?.pending_orders || 0}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Invoice belum diverifikasi</p>
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-4">5 Transaksi Terbaru</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-800 pb-2">
                    <tr>
                      <th className="py-2.5">Invoice</th>
                      <th className="py-2.5">Software</th>
                      <th className="py-2.5">Customer</th>
                      <th className="py-2.5">Total</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(overview?.recent_orders || []).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-950/40">
                        <td className="py-3 font-mono font-semibold text-indigo-300">{order.invoice_number}</td>
                        <td className="py-3 text-white">{order.product_name} ({order.plan_name})</td>
                        <td className="py-3 text-slate-300">{order.customer_name}</td>
                        <td className="py-3 font-bold text-emerald-400">{formatRupiah(order.total_amount)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.payment_status === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {order.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari invoice, nama, HP, atau software..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Invoice</th>
                      <th className="p-3.5">Customer / WhatsApp</th>
                      <th className="p-3.5">Software & Paket</th>
                      <th className="p-3.5">Total & Metode</th>
                      <th className="p-3.5">Status Pembayaran</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-slate-500">Tidak ada pesanan yang sesuai</td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-950/40">
                          <td className="p-3.5 font-mono font-bold text-indigo-300">
                            {order.invoice_number}
                            <span className="block text-[10px] text-slate-500 font-sans">{new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-white block">{order.customer_name}</span>
                            <a 
                              href={`https://wa.me/${order.customer_phone?.replace(/\D/g,'')}?text=Halo%20${encodeURIComponent(order.customer_name)},%20terima%20kasih%20telah%20memesan%20${encodeURIComponent(order.product_name)}%20di%20PintarLabs.`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <MessageCircle className="w-3 h-3" />
                              {order.customer_phone}
                            </a>
                          </td>
                          <td className="p-3.5">
                            <span className="text-white font-medium block">{order.product_name}</span>
                            <span className="text-[11px] text-slate-400">{order.plan_name}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-emerald-400 block">{formatRupiah(order.total_amount)}</span>
                            <span className="text-[10px] text-slate-400 uppercase">{order.payment_method || 'QRIS'}</span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                              order.payment_status === 'PAID'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : order.payment_status === 'CANCELLED'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {order.payment_status === 'PAID' ? 'LUNAS' : order.payment_status === 'CANCELLED' ? 'BATAL' : 'MENUNGGU'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            {order.payment_status !== 'PAID' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'PAID')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold"
                              >
                                Tandai Lunas
                              </button>
                            )}
                            {order.payment_status === 'PAID' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'PENDING')}
                                className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 text-[11px] font-semibold"
                              >
                                Ubah Pending
                              </button>
                            )}
                            {order.payment_status !== 'CANCELLED' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-[11px] font-semibold"
                              >
                                Batalkan
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Catalog Software */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Katalog Software & Video Demo</h2>
                <p className="text-xs text-slate-400">Kelola informasi produk, tautan download installer, dan link video YouTube demo aplikasi.</p>
              </div>
              <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                Total: <strong className="text-white">{products.length}</strong> Software
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => {
                const hasVideo = !!(p.video_tutorial_url && p.video_tutorial_url.trim() !== '' && !p.video_tutorial_url.includes('playlist'));
                return (
                  <div key={p.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {p.product_code}
                        </span>
                        <span className="text-xs text-slate-400">v{p.version || '1.0'}</span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white line-clamp-1">{p.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.tagline}</p>
                      </div>

                      {/* Video Status Badge */}
                      <div className="pt-2">
                        {hasVideo ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-medium">
                            <Play className="w-3 h-3 fill-current" />
                            <span className="truncate max-w-[200px]">Video Demo Aktif</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px]">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Belum ada video demo</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Link Video & Data</span>
                      </button>

                      <a
                        href={`/product/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white text-xs font-medium inline-flex items-center gap-1"
                        title="Lihat halaman detail produk"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Edit Software & Video Demo */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Edit className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Edit Software & Video Demo</h3>
                    <p className="text-xs text-slate-400 font-mono">{editingProduct.product_code} • {editingProduct.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {saveSuccessMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{saveSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4">
                {/* 1. Video Tutorial / Demo URL Section */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <Play className="w-4 h-4 fill-current text-red-500" />
                    <span>Link Video Demo YouTube (Embed Interaktif)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      URL Video YouTube Demo:
                    </label>
                    <input
                      type="url"
                      placeholder="Contoh: https://youtu.be/HAe2PFy6zjM atau https://www.youtube.com/watch?v=..."
                      value={editForm.video_tutorial_url}
                      onChange={(e) => setEditForm({ ...editForm, video_tutorial_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500 font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Masukkan URL video dari YouTube. Video ini akan otomatis ditampilkan sebagai pemutar video interaktif di halaman detail produk. Jika dikosongkan, pemutar video tidak akan ditampilkan.
                    </p>
                  </div>

                  {/* Live YouTube Preview in Modal */}
                  {editForm.video_tutorial_url && (
                    <div className="pt-2">
                      <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                        Pratinjau Pemutar Video:
                      </span>
                      {getYouTubeEmbedUrl(editForm.video_tutorial_url) ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 max-h-56">
                          <iframe
                            src={getYouTubeEmbedUrl(editForm.video_tutorial_url)}
                            title="Pratinjau Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          ></iframe>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Format link video tidak terdeteksi sebagai YouTube yang valid. Gunakan format <code>https://youtu.be/ID</code> atau <code>https://youtube.com/watch?v=ID</code>.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Screenshots & Product Media Gallery */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      <ImageIcon className="w-4 h-4 text-sky-400" />
                      <span>Screenshot Aplikasi & Media Galeri</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {editForm.media.length} Gambar terpasang
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Unggah screenshot tampilan antarmuka (UI) software Anda atau masukkan tautan URL gambar. Gambar pertama (Posisi 1) akan otomatis dijadikan sebagai sampul utama produk.
                  </p>

                  {/* Upload Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* File Upload */}
                    <div>
                      <label className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                          {uploadingImage ? (
                            <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 text-indigo-400" />
                          )}
                          <span>{uploadingImage ? 'Mengunggah...' : 'Upload Gambar dari Komputer'}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WebP (Maks. 50MB)</span>
                      </label>
                    </div>

                    {/* Manual URL Input */}
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Atau tempel URL gambar (https://...)"
                          value={manualImageUrl}
                          onChange={(e) => setManualImageUrl(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-hidden focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddManualImage}
                          disabled={!manualImageUrl.trim()}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Keterangan gambar (opsional)"
                        value={manualImageCaption}
                        onChange={(e) => setManualImageCaption(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-[11px] focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Screenshots Grid & Reordering */}
                  {editForm.media.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {editForm.media.map((m, idx) => (
                        <div
                          key={m.id || idx}
                          className={`group relative rounded-xl overflow-hidden border bg-slate-900 ${
                            idx === 0 ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-slate-800'
                          }`}
                        >
                          <div className="relative aspect-video bg-slate-950">
                            <img
                              src={m.url}
                              alt={m.caption || 'Screenshot'}
                              className="w-full h-full object-cover"
                            />
                            {idx === 0 && (
                              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>Sampul Utama</span>
                              </div>
                            )}
                          </div>

                          <div className="p-2 space-y-1.5 bg-slate-900">
                            <input
                              type="text"
                              value={m.caption}
                              placeholder="Keterangan..."
                              onChange={(e) => {
                                const newMedia = [...editForm.media];
                                newMedia[idx].caption = e.target.value;
                                setEditForm({ ...editForm, media: newMedia });
                              }}
                              className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-white focus:outline-hidden focus:border-indigo-500"
                            />

                            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveMedia(idx, idx - 1)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 text-[10px]"
                                  title="Geser ke kiri / jadikan prioritas"
                                >
                                  <ArrowUp className="w-3 h-3 -rotate-90" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === editForm.media.length - 1}
                                  onClick={() => handleMoveMedia(idx, idx + 1)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 text-[10px]"
                                  title="Geser ke kanan"
                                >
                                  <ArrowDown className="w-3 h-3 -rotate-90" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveMedia(idx)}
                                className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] flex items-center gap-1"
                                title="Hapus gambar"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span className="text-[10px]">Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-center">
                      <p className="text-xs text-slate-400">Belum ada screenshot yang diunggah. Silakan upload gambar di atas.</p>
                    </div>
                  )}
                </div>

                {/* 3. Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Nama Software</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Versi</label>
                    <input
                      type="text"
                      value={editForm.version}
                      onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tagline / Slogan</label>
                  <input
                    type="text"
                    value={editForm.tagline}
                    onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                {/* 3. Download Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Link Trial / Demo Installer</label>
                    <input
                      type="url"
                      placeholder="https://downloads.../trial.exe"
                      value={editForm.trial_download_url}
                      onChange={(e) => setEditForm({ ...editForm, trial_download_url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Link Windows Installer (.exe)</label>
                    <input
                      type="url"
                      placeholder="https://downloads.../setup.exe"
                      value={editForm.windows_installer_url}
                      onChange={(e) => setEditForm({ ...editForm, windows_installer_url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Link Android APK (.apk)</label>
                    <input
                      type="url"
                      placeholder="https://downloads.../app.apk"
                      value={editForm.android_apk_url}
                      onChange={(e) => setEditForm({ ...editForm, android_apk_url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Link Panduan E-Book (PDF)</label>
                    <input
                      type="url"
                      placeholder="https://downloads.../panduan.pdf"
                      value={editForm.user_manual_pdf_url}
                      onChange={(e) => setEditForm({ ...editForm, user_manual_pdf_url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                {/* 4. Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={editForm.is_published === 1}
                      onChange={(e) => setEditForm({ ...editForm, is_published: e.target.checked ? 1 : 0 })}
                      className="w-4 h-4 rounded-sm bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Publikasikan di Marketplace (Aktif)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={editForm.is_featured === 1}
                      onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked ? 1 : 0 })}
                      className="w-4 h-4 rounded-sm bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Produk Unggulan (Featured)</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-600/20"
                  >
                    {savingProduct ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{savingProduct ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
