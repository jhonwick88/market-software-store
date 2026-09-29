import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Search, Monitor, Smartphone, Printer, Wifi, ShieldCheck, 
  HelpCircle, ChevronRight, CheckCircle2, AlertTriangle, ExternalLink, 
  MessageCircle, Download, FileText, Cpu, Laptop
} from 'lucide-react';
import SEO from '../components/SEO';

export default function DocsPage() {
  const [activeCategory, setActiveCategory] = useState('install');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'install', name: 'Instalasi & Aktivasi', icon: Laptop, count: 4 },
    { id: 'printer', name: 'Printer Thermal & Nota', icon: Printer, count: 4 },
    { id: 'network', name: 'Multi-Device & Jaringan LAN', icon: Wifi, count: 3 },
    { id: 'backup', name: 'Backup & Pindah Device', icon: ShieldCheck, count: 3 },
    { id: 'faq', name: 'Troubleshooting & FAQ', icon: HelpCircle, count: 6 },
  ];

  const docsData = {
    install: [
      {
        title: 'Cara Menginstal Software di Komputer Windows (10 & 11)',
        desc: 'Langkah mudah memasang installer (.exe) aplikasi PintarLabs di laptop atau komputer desktop Anda.',
        steps: [
          'Unduh file installer resmi (.exe) dari halaman produk atau portal pesanan Anda.',
          'Klik dua kali pada file installer yang telah diunduh.',
          'Jika muncul peringatan Windows Defender SmartScreen, klik "More Info" lalu pilih "Run Anyway".',
          'Ikuti petunjuk setup di layar hingga selesai. Shortcut aplikasi akan otomatis muncul di Desktop Anda.'
        ],
        tip: 'Jalankan aplikasi dengan klik kanan -> "Run as Administrator" pada saat pertama kali membuka untuk memastikan izin database lokal berjalan lancar.'
      },
      {
        title: 'Cara Menginstal Aplikasi di HP / Tablet Android (.apk)',
        desc: 'Panduan memasang file APK untuk kasir waiter, scanner barcode, atau remote guru piket.',
        steps: [
          'Unduh file APK dari tautan resmi yang diberikan setelah pembelian.',
          'Buka file manager dan klik file .apk yang telah diunduh.',
          'Jika muncul notifikasi "Instal dari Sumber Tidak Dikenal", aktifkan izin "Allow from this source" di pengaturan HP.',
          'Klik "Install" dan tunggu beberapa detik hingga aplikasi siap dibuka.'
        ],
        tip: 'Pastikan versi Android perangkat Anda minimal Android 7.0 (Nougat) atau lebih baru.'
      },
      {
        title: 'Cara Aktivasi Serial Key & Lisensi Lifetime',
        desc: 'Mengaktifkan lisensi resmi permanen menggunakan Serial Key unik yang Anda terima.',
        steps: [
          'Buka aplikasi di komputer atau HP Anda.',
          'Masuk ke menu "Pengaturan" atau layar "Aktivasi Lisensi".',
          'Ketik atau salin Serial Key unik yang tertera pada invoice pesanan Anda (contoh: PL-POS-XXXX-XXXX).',
          'Klik tombol "Aktivasi Sekarang". Sistem akan memvalidasi dan lisensi langsung aktif seumur hidup.'
        ]
      },
      {
        title: 'Persyaratan Minimum Sistem (System Requirements)',
        desc: 'Spesifikasi hardware yang disarankan agar software berjalan cepat dan responsif.',
        steps: [
          'Komputer / Laptop: Windows 10 atau 11 (32-bit atau 64-bit), Processor Intel Core i3 / AMD setara, RAM minimal 2GB (disarankan 4GB), Ruang Disk 500MB.',
          'Smartphone / Tablet Android: Android OS 7.0 ke atas, RAM minimal 1GB (disarankan 2GB+).',
          'Perangkat Pendukung: Printer thermal USB/Bluetooth, Barcode scanner USB/Wireless, Speaker amplifier (khusus Bell Pintar).'
        ]
      }
    ],
    printer: [
      {
        title: 'Panduan Menghubungkan Printer Thermal Bluetooth di Android',
        desc: 'Cara pairing dan setting printer struk portable 58mm / 80mm di HP kasir.',
        steps: [
          'Nyalakan printer thermal bluetooth dan pastikan lampu indikator menyala.',
          'Buka menu Bluetooth di pengaturan HP Android Anda dan lakukan "Scan/Cari Perangkat".',
          'Pilih nama printer (misal: RPP02N, MPT-II, Bluetooth Printer) dan masukkan PIN pairing (biasanya 0000 atau 1234).',
          'Buka aplikasi PintarPOS/PintarRetribusi -> masuk ke menu "Pengaturan Printer" -> pilih printer bluetooth yang sudah terhubung -> klik "Tes Cetak Struk".'
        ]
      },
      {
        title: 'Panduan Menghubungkan Printer Thermal USB di Windows',
        desc: 'Setting driver printer thermal 58mm / 80mm (Xprinter, Epson, Iware, Panda, dll).',
        steps: [
          'Hubungkan kabel USB printer thermal ke port USB komputer dan nyalakan printer.',
          'Pasang driver printer bawaan atau gunakan generic POS-58 / POS-80 driver.',
          'Di Windows, buka "Printers & Scanners" dan pastikan printer Anda terdeteksi dengan status "Ready".',
          'Buka software PintarLabs -> menu "Pengaturan Printer" -> pilih nama printer USB -> simpan.'
        ],
        tip: 'Jika cetakan terpotong, pastikan ukuran kertas diatur ke 58mm x 210mm atau 80mm x 297mm.'
      },
      {
        title: 'Cara Mengatur Logo Toko & Header / Footer Nota',
        desc: 'Kustomisasi tampilan struk penjualan dengan logo usaha, alamat, dan pesan terima kasih.',
        steps: [
          'Buka software -> masuk ke menu "Pengaturan Toko" atau "Profil Struk".',
          'Unggah logo toko Anda (format gambar hitam putih disarankan untuk hasil thermal tajam).',
          'Ketik Nama Toko, Alamat Lengkap, dan Nomor Telepon/WhatsApp.',
          'Tambahkan catatan kaki (Footer) seperti: "Barang yang sudah dibeli tidak dapat ditukar" atau "Terima kasih atas kunjungan Anda".'
        ]
      },
      {
        title: 'Cara Mengaktifkan Pembukaan Laci Otomatis (Auto Cash Drawer Kick)',
        desc: 'Menghubungkan laci uang RJ11 agar otomatis terbuka setiap kali kasir mencetak struk.',
        steps: [
          'Colokkan kabel RJ11 dari laci uang ke port "Drawer" di bagian belakang printer thermal.',
          'Di menu pengaturan software, centang opsi "Buka Laci Kasir Otomatis Setelah Cetak".',
          'Laci kasir akan otomatis terbuka secara elektrik setiap ada transaksi tunai.'
        ]
      }
    ],
    network: [
      {
        title: 'Cara Menghubungkan Multi-Device di Jaringan Wi-Fi Lokal (100% Tanpa Internet)',
        desc: 'Menghubungkan Komputer PC Kasir Utama dengan Tablet/HP Pelayan tanpa kuota internet.',
        steps: [
          'Pastikan Komputer PC Kasir Utama dan semua HP Android terhubung ke satu router Wi-Fi yang sama di toko/kantor/sekolah Anda.',
          'Tidak membutuhkan kuota internet! Router hanya berfungsi sebagai jembatan jaringan lokal (LAN).',
          'Di komputer PC, buka aplikasi dan lihat alamat IP Server Lokal (contoh: 192.168.1.100:8088).',
          'Di HP Android pelayan / guru piket, buka aplikasi dan masukkan alamat IP tersebut atau scan QR Code yang muncul di layar PC.',
          'Perangkat akan langsung terhubung seketika!'
        ]
      },
      {
        title: 'Membuka Izin Firewall Windows untuk Koneksi LAN',
        desc: 'Memastikan Windows Defender Firewall tidak memblokir koneksi dari HP Android.',
        steps: [
          'Buka Windows Security -> Firewall & network protection.',
          'Klik "Allow an app through firewall".',
          'Cari nama aplikasi PintarLabs dan pastikan kedua kotak "Private" dan "Public" dicentang.',
          'Klik OK dan restart aplikasi di komputer.'
        ]
      },
      {
        title: 'Tips Mengatur IP Address Statis pada Komputer Server',
        desc: 'Mencegah alamat IP komputer berubah-ubah saat router Wi-Fi di-restart.',
        steps: [
          'Buka Network Connections di Windows (ncpa.cpl).',
          'Klik kanan pada adapter Wi-Fi atau Ethernet -> Properties -> Internet Protocol Version 4 (TCP/IPv4).',
          'Pilih "Use the following IP address" dan masukkan IP statis (misal: 192.168.1.100, Subnet: 255.255.255.0, Gateway: 192.168.1.1).',
          'Klik OK untuk menyimpan.'
        ]
      }
    ],
    backup: [
      {
        title: 'Cara Backup Database Toko / Sekolah ke Flashdisk',
        desc: 'Menyimpan salinan seluruh data transaksi, stok produk, atau jadwal bel secara aman.',
        steps: [
          'Buka menu "Pengaturan" -> "Keamanan & Backup Data".',
          'Klik tombol "Backup Database Sekarang".',
          'Pilih folder penyimpanan di Komputer atau langsung ke Flashdisk USB eksternal Anda.',
          'File backup (.db / .bak) akan dibuat seketika dengan tanggal dan jam otomatis.'
        ],
        tip: 'Lakukan backup data minimal 1 minggu sekali ke flashdisk untuk mengantisipasi jika komputer rusak atau terkena virus.'
      },
      {
        title: 'Cara Memindahkan Software & Data ke Komputer Baru',
        desc: 'Panduan migrasi aplikasi dan lisensi saat Anda mengganti laptop atau komputer kasir baru.',
        steps: [
          'Lakukan Backup database di komputer lama dan simpan filenya di flashdisk.',
          'Unduh dan pasang software di komputer baru Anda.',
          'Di komputer baru, buka menu "Pengaturan" -> "Restore Database" -> pilih file backup dari flashdisk.',
          'Masukkan Serial Key lisensi resmi Anda untuk aktivasi di komputer baru.'
        ]
      },
      {
        title: 'Export Laporan Penjualan & Stok ke File Excel (.xlsx / .csv)',
        desc: 'Mengekspor laporan pembukuan bulanan untuk diserahkan ke akuntan atau pemilik usaha.',
        steps: [
          'Buka menu "Laporan Penjualan" atau "Laporan Stok".',
          'Tentukan rentang tanggal (misal: 1 Januari - 31 Januari).',
          'Klik tombol "Export to Excel" di pojok kanan atas.',
          'File spreadsheet siap dibuka di Microsoft Excel atau Google Sheets.'
        ]
      }
    ],
    faq: [
      {
        title: 'Apakah software membutuhkan langganan bulanan atau tahunan?',
        desc: 'TIDAK. Semua software yang dijual di PintarLabs menggunakan sistem Lisensi Lifetime (Sekali Bayar Seumur Hidup). Anda tidak akan pernah ditagih biaya sewa bulanan, tahunan, atau potongan komisi per transaksi.'
      },
      {
        title: 'Apakah software bisa tetap beroperasi saat internet mati?',
        desc: 'YA, 100% BISA. Semua software PintarLabs dibangun dengan arsitektur Local-First. Database tersimpan langsung di komputer/HP Anda secara lokal. Transaksi, scan barcode, cetak struk, dan bel sekolah tetap berbunyi normal tanpa internet.'
      },
      {
        title: 'Bagaimana jika saya kesulitan saat instalasi pertama kali?',
        desc: 'Tim Technical Support PintarLabs siap membantu Anda secara langsung via WhatsApp atau remote kontrol komputer (AnyDesk / TeamViewer) secara GRATIS hingga software siap digunakan.'
      },
      {
        title: 'Apakah software bisa di-install di banyak komputer atau HP?',
        desc: 'Bisa! Setiap paket pembelian memiliki kuota perangkat sesuai kebutuhan (Paket Basic untuk 1 PC + HP, atau Paket Pro Multi-Device untuk multi PC kasir dan banyak HP Android).'
      },
      {
        title: 'Apakah data saya aman dari kebocoran ke pihak ketiga?',
        desc: 'Sangat aman. Berbeda dengan aplikasi SaaS cloud yang menyimpan data Anda di server orang lain, software PintarLabs menyimpan seluruh data keuangan, pelanggan, dan transaksi secara offline di harddisk komputer Anda sendiri.'
      },
      {
        title: 'Bagaimana cara mendapatkan update software ke versi terbaru?',
        desc: 'Anda dapat mengunduh installer versi terbaru kapan saja melalui halaman Lacak Pesanan (/track) menggunakan Nomor Pesanan Anda secara gratis.'
      }
    ]
  };

  const currentDocs = docsData[activeCategory] || [];
  const filteredDocs = currentDocs.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 transition-colors duration-200">
      <SEO 
        title="Pusat Panduan & Dokumentasi Software PintarLabs"
        description="Pusat bantuan resmi: panduan instalasi Windows & Android, setting printer thermal bluetooth/USB, koneksi LAN multi-device, dan troubleshooting."
        canonical="https://labspintar.com/docs"
      />

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-4 border border-white/15">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Knowledge Base & Panduan Resmi</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Pusat Panduan & Bantuan PintarLabs
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-6">
              Temukan tutorial lengkap instalasi aplikasi, pengaturan printer thermal, konfigurasi multi-device Wi-Fi lokal, hingga solusi kendala teknis.
            </p>

            {/* Quick Search Input */}
            <div className="relative max-w-xl">
              <Search className="w-5 h-5 text-indigo-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari panduan (contoh: printer bluetooth, firewall LAN, backup)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-indigo-200 text-sm focus:outline-none focus:bg-white/25 focus:border-white transition-all shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
              Kategori Panduan
            </h3>

            <div className="space-y-1.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-101'
                        : 'bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{cat.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Direct WhatsApp Support Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 text-left mt-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3 border border-emerald-200 dark:border-emerald-500/30">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Butuh Bantuan Langsung?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Tim teknis PintarLabs siap membantu setup printer atau kendala instalasi via WhatsApp & AnyDesk Remote.
              </p>
              <a
                href="https://wa.me/6282132935169?text=Halo%20Tim%20Support%20PintarLabs,%20saya%20membutuhkan%20panduan%20teknis"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <span>Chat Tim Support WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </aside>

          {/* Article / Guide Content */}
          <main className="lg:col-span-8 space-y-6">
            {filteredDocs.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Panduan Tidak Ditemukan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            ) : (
              filteredDocs.map((doc, idx) => (
                <article 
                  key={idx} 
                  className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-100/70 dark:shadow-none space-y-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100 dark:border-indigo-500/20 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {doc.title}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {doc.desc}
                      </p>
                    </div>
                  </div>

                  {doc.steps && (
                    <div className="pl-11 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                      {doc.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                            {sIdx + 1}
                          </span>
                          <p className="leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {doc.tip && (
                    <div className="ml-11 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <p className="leading-snug"><strong>Tips:</strong> {doc.tip}</p>
                    </div>
                  )}
                </article>
              ))
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
