import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, ShoppingCart, DollarSign, Package, CheckCircle2, 
  Clock, XCircle, Search, RefreshCw, MessageCircle, Lock, LogOut,
  Edit, Play, Video, ExternalLink, Save, X, Eye, FileText, Check,
  AlertTriangle, Sparkles, Youtube, Upload, Trash2, Plus, Image as ImageIcon,
  ArrowUp, ArrowDown, Star, KeyRound, User, Settings, ShieldCheck
} from 'lucide-react';
import SEO from '../components/SEO';

export default function AdminDashboardPage() {
  const [token, setToken] = useState(localStorage.getItem('pintarlabs_store_admin_token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'catalog', 'profile'
  const [overview, setOverview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Profile / Password Change State
  const [profileForm, setProfileForm] = useState({
    name: 'Admin PintarLabs',
    email: 'admin@pintarlabs.id',
    phone: '081234567890',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (profileForm.new_password) {
      if (profileForm.new_password !== profileForm.confirm_password) {
        setProfileError('Konfirmasi kata sandi baru tidak cocok!');
        return;
      }
      if (profileForm.new_password.length < 6) {
        setProfileError('Kata sandi baru minimal 6 karakter!');
        return;
      }
      if (!profileForm.current_password) {
        setProfileError('Harap masukkan kata sandi saat ini untuk konfirmasi keamanan.');
        return;
      }
    }

    try {
      setProfileLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.put('/api/auth/profile', profileForm, { headers });
      if (res.data.data?.token) {
        localStorage.setItem('pintarlabs_store_admin_token', res.data.data.token);
        setToken(res.data.data.token);
      }
      setProfileSuccess('Profil dan kredensial admin berhasil diperbarui!');
      setProfileForm(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Gagal memperbarui profil admin');
    } finally {
      setProfileLoading(false);
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
      
      const [statsRes, ordersRes, prodsRes, meRes] = await Promise.all([
        axios.get('/api/stats/overview', { headers }).catch(() => ({ data: { data: {} } })),
        axios.get('/api/orders/admin/list', { headers }).catch(() => ({ data: { data: [] } })),
        axios.get('/api/products'),
        axios.get('/api/auth/me', { headers }).catch(() => ({ data: { data: null } }))
      ]);

      setOverview(statsRes.data.data || {});
      setOrders(ordersRes.data.data || []);
      setProducts(prodsRes.data.data || prodsRes.data || []);

      if (meRes.data?.data) {
        setProfileForm(prev => ({
          ...prev,
          name: meRes.data.data.name || 'Admin PintarLabs',
          email: meRes.data.data.email || 'admin@pintarlabs.id',
          phone: meRes.data.data.phone || '081234567890'
        }));
      }
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
      <div className="relative min-h-[85vh] flex items-center justify-center p-4 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-10 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-600/10 rounded-full blur-3xl -z-10" />
        <div className="pointer-events-none absolute bottom-10 -left-10 w-80 h-80 bg-purple-200/30 dark:bg-purple-600/10 rounded-full blur-3xl -z-10" />

        <SEO title="Admin Toko Software - PintarLabs" />
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/80 dark:bg-indigo-500/10 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Toko Software</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Masuk untuk mengelola pesanan & omset marketplace</p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-300 text-xs mb-4">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Admin</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pintarlabs.id"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all"
            >
              Masuk ke Dashboard Toko
            </button>
          </form>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-6">
            Akun Bawaan: <span className="text-slate-700 dark:text-slate-300 font-mono font-semibold">admin@pintarlabs.id / admin123</span>
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
    <div className="relative min-h-screen py-10 transition-colors duration-200">
      <SEO title="Dashboard Admin Marketplace - PintarLabs" />

      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute -top-20 right-0 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-600/10 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-80 -left-20 w-80 h-80 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-slate-800 gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Panel Manajemen Toko</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">Marketplace Jual Beli Software</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchDashboardData}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Segarkan Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:border-rose-500/20 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 mb-8 w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md shadow-slate-200 dark:shadow-indigo-600/30 border border-slate-200/60 dark:border-transparent'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-white" />
            <span>Ringkasan & Omset</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md shadow-slate-200 dark:shadow-indigo-600/30 border border-slate-200/60 dark:border-transparent'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-indigo-600 dark:text-white" />
            <span>Pesanan Masuk ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md shadow-slate-200 dark:shadow-indigo-600/30 border border-slate-200/60 dark:border-transparent'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4 text-indigo-600 dark:text-white" />
            <span>Katalog Software ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md shadow-slate-200 dark:shadow-indigo-600/30 border border-slate-200/60 dark:border-transparent'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <KeyRound className="w-4 h-4 text-indigo-600 dark:text-white" />
            <span>Ganti Password & Profil</span>
          </button>
        </div>

        {/* Tab 1: Overview & Omset */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/80 dark:shadow-none">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold mb-1">Total Omset Penjualan</span>
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
                  {formatRupiah(overview?.total_revenue)}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Dari transaksi terverifikasi LUNAS</span>
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/80 dark:shadow-none">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold mb-1">Total Transaksi</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {overview?.total_orders || 0}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">Seluruh pesanan masuk</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/80 dark:shadow-none">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold mb-1">Pesanan Lunas</span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {overview?.paid_orders || 0}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">Pembayaran terverifikasi</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/80 dark:shadow-none">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold mb-1">Menunggu Pembayaran</span>
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {overview?.pending_orders || 0}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">Invoice belum diverifikasi</p>
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/80 dark:shadow-none">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">5 Transaksi Terbaru</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2 bg-slate-50/50 dark:bg-slate-950/40">
                    <tr>
                      <th className="py-3 px-3">Invoice</th>
                      <th className="py-3 px-3">Software</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {(overview?.recent_orders || []).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-950/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-300">{order.invoice_number}</td>
                        <td className="py-3 px-3 text-slate-900 dark:text-white font-medium">{order.product_name} ({order.plan_name})</td>
                        <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{order.customer_name}</td>
                        <td className="py-3 px-3 font-extrabold text-emerald-600 dark:text-emerald-400">{formatRupiah(order.total_amount)}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.payment_status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
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
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari invoice, nama customer, nomor WhatsApp..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/80 dark:shadow-none overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Invoice</th>
                      <th className="p-4">Customer / WhatsApp</th>
                      <th className="p-4">Software & Paket</th>
                      <th className="p-4">Total & Metode</th>
                      <th className="p-4">Status Pembayaran</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-slate-500 dark:text-slate-400">Tidak ada pesanan yang sesuai</td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-950/40 transition-colors">
                          <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-300">
                            {order.invoice_number}
                            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">{new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-slate-900 dark:text-white block">{order.customer_name}</span>
                            <a 
                              href={`https://wa.me/${order.customer_phone?.replace(/\D/g,'')}?text=Halo%20${encodeURIComponent(order.customer_name)},%20terima%20kasih%20telah%20memesan%20${encodeURIComponent(order.product_name)}%20di%20PintarLabs.`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 mt-0.5 font-semibold"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              {order.customer_phone}
                            </a>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-900 dark:text-white font-semibold block">{order.product_name}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{order.plan_name}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">{formatRupiah(order.total_amount)}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">{order.payment_method || 'QRIS'}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-block ${
                              order.payment_status === 'PAID'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                : order.payment_status === 'CANCELLED'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                            }`}>
                              {order.payment_status === 'PAID' ? 'LUNAS' : order.payment_status === 'CANCELLED' ? 'BATAL' : 'MENUNGGU'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1.5">
                            {order.payment_status !== 'PAID' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'PAID')}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs transition-colors"
                              >
                                Tandai Lunas
                              </button>
                            )}
                            {order.payment_status === 'PAID' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'PENDING')}
                                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-amber-300 text-[11px] font-semibold transition-colors"
                              >
                                Ubah Pending
                              </button>
                            )}
                            {order.payment_status !== 'CANCELLED' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 dark:text-rose-300 text-[11px] font-semibold transition-colors"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Katalog Software & Video Demo</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Kelola informasi produk, tautan download installer, dan link video YouTube demo aplikasi.</p>
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-xl shadow-2xs">
                Total: <strong className="text-indigo-600 dark:text-white font-bold">{products.length}</strong> Software
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => {
                const hasVideo = !!(p.video_tutorial_url && p.video_tutorial_url.trim() !== '' && !p.video_tutorial_url.includes('playlist'));
                return (
                  <div key={p.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-xl shadow-slate-100/80 dark:shadow-none hover:border-indigo-300 dark:hover:border-slate-700 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                          {p.product_code}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">v{p.version || '1.0'}</span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">{p.tagline}</p>
                      </div>

                      {/* Video Status Badge */}
                      <div className="pt-1">
                        {hasVideo ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 text-xs font-semibold">
                            <Play className="w-3.5 h-3.5 fill-current text-rose-600" />
                            <span className="truncate max-w-[200px]">Video Demo Aktif</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400 text-xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            <span>Belum ada video demo</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 dark:bg-indigo-600/20 dark:hover:bg-indigo-600/30 dark:border-indigo-500/30 dark:text-indigo-300 text-xs font-bold transition-colors shadow-2xs"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Video & Media</span>
                      </button>

                      <a
                        href={`/product/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white text-xs font-semibold inline-flex items-center gap-1"
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

        {/* Tab 4: Pengaturan Akun & Ganti Password */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/80 dark:shadow-none space-y-6">
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200/80 dark:bg-indigo-500/10 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pengaturan Akun & Kata Sandi</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ubah email login, nama profil, dan perbarui kata sandi admin.</p>
                </div>
              </div>

              {profileSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Admin</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor WhatsApp / HP</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Login Admin</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Email ini akan digunakan untuk login berikutnya ke dashboard admin.</p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ubah Kata Sandi (Opsional)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kata Sandi Saat Ini (Lama)</label>
                    <input
                      type="password"
                      placeholder="Masukkan kata sandi lama jika ingin mengganti sandi"
                      value={profileForm.current_password}
                      onChange={(e) => setProfileForm({ ...profileForm, current_password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kata Sandi Baru</label>
                      <input
                        type="password"
                        placeholder="Minimal 6 karakter"
                        value={profileForm.new_password}
                        onChange={(e) => setProfileForm({ ...profileForm, new_password: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ulangi Kata Sandi Baru</label>
                      <input
                        type="password"
                        placeholder="Konfirmasi kata sandi baru"
                        value={profileForm.confirm_password}
                        onChange={(e) => setProfileForm({ ...profileForm, confirm_password: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                  >
                    {profileLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{profileLoading ? 'Menyimpan...' : 'Simpan Perubahan Akun'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Software & Video Demo */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200/80 dark:bg-indigo-500/10 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Edit className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Software & Video Demo</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{editingProduct.product_code} • {editingProduct.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingProduct(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {saveSuccessMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{saveSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4">
                {/* 1. Video Tutorial / Demo URL Section */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/40 via-white to-slate-50 dark:from-slate-950 dark:to-slate-900 border border-rose-200/70 dark:border-rose-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                    <Play className="w-4 h-4 fill-current text-rose-600" />
                    <span>Link Video Demo YouTube (Embed Interaktif)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      URL Video YouTube Demo:
                    </label>
                    <input
                      type="url"
                      placeholder="Contoh: https://youtu.be/HAe2PFy6zjM atau https://www.youtube.com/watch?v=..."
                      value={editForm.video_tutorial_url}
                      onChange={(e) => setEditForm({ ...editForm, video_tutorial_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Masukkan URL video YouTube. Video ini otomatis muncul di pemutar interaktif halaman detail produk.
                    </p>
                  </div>

                  {/* Live YouTube Preview in Modal */}
                  {editForm.video_tutorial_url && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Pratinjau Pemutar Video:
                      </span>
                      {getYouTubeEmbedUrl(editForm.video_tutorial_url) ? (
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-56 shadow-md">
                          <iframe
                            src={getYouTubeEmbedUrl(editForm.video_tutorial_url)}
                            title="Pratinjau Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          ></iframe>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300 text-xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Format link video tidak valid. Gunakan format <code>https://youtu.be/ID</code> atau <code>https://youtube.com/watch?v=ID</code>.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Screenshots & Product Media Gallery */}
                <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      <ImageIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Screenshot Aplikasi & Media Galeri</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {editForm.media.length} Gambar terpasang
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Unggah screenshot UI software atau masukkan tautan URL gambar. Gambar pertama (Posisi 1) akan otomatis dijadikan sebagai sampul utama.
                  </p>

                  {/* Upload Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* File Upload */}
                    <div>
                      <label className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-all shadow-2xs">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                          {uploadingImage ? (
                            <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          )}
                          <span>{uploadingImage ? 'Mengunggah...' : 'Upload dari Komputer'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WebP (Maks. 50MB)</span>
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
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono shadow-2xs focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddManualImage}
                          disabled={!manualImageUrl.trim()}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-40 transition-colors shadow-2xs"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Keterangan gambar (opsional)"
                        value={manualImageCaption}
                        onChange={(e) => setManualImageCaption(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[11px] shadow-2xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Screenshots Grid & Reordering */}
                  {editForm.media.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {editForm.media.map((m, idx) => (
                        <div
                          key={m.id || idx}
                          className={`group relative rounded-2xl overflow-hidden border bg-white dark:bg-slate-900 shadow-xs ${
                            idx === 0 ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="relative aspect-video bg-slate-100 dark:bg-slate-950">
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

                          <div className="p-2 space-y-1.5 bg-white dark:bg-slate-900">
                            <input
                              type="text"
                              value={m.caption}
                              placeholder="Keterangan..."
                              onChange={(e) => {
                                const newMedia = [...editForm.media];
                                newMedia[idx].caption = e.target.value;
                                setEditForm({ ...editForm, media: newMedia });
                              }}
                              className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                            />

                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveMedia(idx, idx - 1)}
                                  className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 text-[10px]"
                                  title="Geser ke kiri / jadikan sampul"
                                >
                                  <ArrowUp className="w-3 h-3 -rotate-90" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === editForm.media.length - 1}
                                  onClick={() => handleMoveMedia(idx, idx + 1)}
                                  className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 text-[10px]"
                                  title="Geser ke kanan"
                                >
                                  <ArrowDown className="w-3 h-3 -rotate-90" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveMedia(idx)}
                                className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 text-[10px] flex items-center gap-1 font-semibold"
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
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Belum ada screenshot yang diunggah. Silakan upload gambar di atas.</p>
                    </div>
                  )}
                </div>

                {/* 3. Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Software</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Versi</label>
                    <input
                      type="text"
                      value={editForm.version}
                      onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tagline / Slogan</label>
                  <input
                    type="text"
                    value={editForm.tagline}
                    onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                {/* 3. Download Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Link Trial / Demo Installer</label>
                    <input
                      type="url"
                      placeholder="https://downloads.../trial.exe"
                      value={editForm.trial_download_url}
                      onChange={(e) => setEditForm({ ...editForm, trial_download_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Link Windows Installer (.exe)</label>
                    <input
                      type="url"
                      placeholder="https://downloads.../setup.exe"
                      value={editForm.windows_installer_url}
                      onChange={(e) => setEditForm({ ...editForm, windows_installer_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Link Android APK (.apk)</label>
                    <input
                      type="url"
                      placeholder="https://downloads.../app.apk"
                      value={editForm.android_apk_url}
                      onChange={(e) => setEditForm({ ...editForm, android_apk_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Link Panduan E-Book (PDF)</label>
                    <input
                      type="url"
                      placeholder="https://downloads.../panduan.pdf"
                      value={editForm.user_manual_pdf_url}
                      onChange={(e) => setEditForm({ ...editForm, user_manual_pdf_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs shadow-2xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                {/* 4. Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={editForm.is_published === 1}
                      onChange={(e) => setEditForm({ ...editForm, is_published: e.target.checked ? 1 : 0 })}
                      className="w-4 h-4 rounded-sm text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span>Publikasikan di Marketplace (Aktif)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={editForm.is_featured === 1}
                      onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked ? 1 : 0 })}
                      className="w-4 h-4 rounded-sm text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span>Produk Unggulan (Featured)</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/25"
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
