import React, { useState } from 'react';
import axios from 'axios';
import { Key, ShieldCheck, CheckCircle2, AlertCircle, Monitor, Laptop } from 'lucide-react';
import SEO from '../components/SEO';

export default function ActivationPage() {
  const [licenseKey, setLicenseKey] = useState('');
  const [hardwareId, setHardwareId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleActivate = async (e) => {
    e.preventDefault();
    if (!licenseKey.trim() || !hardwareId.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await axios.post('/api/license/activate', {
        license_key: licenseKey.trim(),
        hardware_id: hardwareId.trim(),
        device_name: deviceName.trim() || 'Workstation Desktop'
      });

      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Aktivasi gagal. Periksa kembali Serial Key dan Machine ID Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <SEO 
        title="Aktivasi Lisensi Software PintarLabs"
        description="Lakukan aktivasi online serial license key software PintarLabs untuk perangkat Windows (.exe) dan Android (.apk) Anda."
        canonical="https://labspintar.com/activate"
      />

      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center mb-3 border border-indigo-500/20">
            <Key className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Aktivasi Lisensi Software</h1>
          <p className="text-slate-400 text-sm">
            Hubungkan Machine ID perangkat Anda dengan Serial License Key PintarLabs.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          {result ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Lisensi Berhasil Diaktifkan!</h3>
              <p className="text-xs text-slate-300">
                Perangkat <span className="font-mono text-indigo-400">{result.device_name || 'Anda'}</span> sekarang telah memiliki lisensi aktif.
              </p>
              <button
                onClick={() => setResult(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Aktivasi Device Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleActivate} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Serial License Key *</label>
                <input
                  type="text"
                  required
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                  placeholder="Contoh: PL-POS-LIFETIME-A1B2-C3D4-E5F6"
                  className="w-full font-mono uppercase px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hardware / Machine ID *</label>
                <input
                  type="text"
                  required
                  value={hardwareId}
                  onChange={(e) => setHardwareId(e.target.value)}
                  placeholder="Salin Machine ID dari jendela aktivasi software Anda"
                  className="w-full font-mono px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Perangkat / Kasir (Opsional)</label>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Contoh: Kasir Utama - PC Resto"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {loading ? 'Memvalidasi...' : 'Aktifkan Perangkat Ini'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
