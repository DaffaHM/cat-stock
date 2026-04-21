import { useState } from 'react'

const PanduanPage = () => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Pengenalan', icon: '📋' },
    { id: 'products', title: 'Kelola Produk', icon: '📦' },
    { id: 'sales', title: 'Input Penjualan', icon: '💰' },
    { id: 'reports', title: 'Lihat Laporan', icon: '📊' },
    { id: 'tips', title: 'Tips & Trik', icon: '💡' }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Selamat Datang di Stock Dashboard</h2>
            <p className="text-gray-600">
              Aplikasi ini membantu Anda mengelola stok cat dan tracking keuntungan dengan mudah.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🏠 Dashboard</h3>
                <p className="text-sm text-blue-700">Lihat ringkasan stok dan keuntungan hari ini</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">📦 Kelola Stok</h3>
                <p className="text-sm text-green-700">Tambah, edit, hapus produk dan restock</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">💰 Penjualan</h3>
                <p className="text-sm text-purple-700">Input transaksi dan lihat keuntungan</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">📊 Laporan</h3>
                <p className="text-sm text-orange-700">Analisis penjualan dan profit</p>
              </div>
            </div>
          </div>
        )

      case 'products':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Kelola Produk</h2>
            
            <div className="space-y-8">
              {/* Tambah Produk */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Tambah Produk Baru
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Klik menu <strong>"Tambah Produk"</strong> di sidebar</p>
                  <p>• Isi informasi produk:</p>
                  <div className="ml-4 space-y-1">
                    <p>- Brand (contoh: Indaco, Nippon Paint)</p>
                    <p>- Nama Produk (contoh: Envi, Catylac)</p>
                    <p>- Jenis Produk (pilih dari dropdown atau input manual)</p>
                    <p>- Kemasan (contoh: 5 KG, 1 LT)</p>
                    <p>- Warna dan Kode Warna</p>
                    <p>- Stok Awal</p>
                    <p>- Harga Beli dan Harga Jual</p>
                  </div>
                  <p>• Klik <strong>"Tambah Produk"</strong> untuk menyimpan</p>
                </div>
              </div>

              {/* Edit Produk */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Edit Produk
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Buka menu <strong>"Kelola Stok"</strong></p>
                  <p>• Cari produk yang ingin diedit</p>
                  <p>• Klik tombol <strong>"Edit"</strong> (ikon pensil) pada produk</p>
                  <p>• Ubah informasi yang diperlukan</p>
                  <p>• Klik <strong>"Update Produk"</strong> untuk menyimpan</p>
                </div>
              </div>

              {/* Restock */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-yellow-100 text-yellow-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Tambah Stok (Restock)
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Buka menu <strong>"Kelola Stok"</strong></p>
                  <p>• Klik tombol <strong>"Restock"</strong> (ikon plus) pada produk</p>
                  <p>• Masukkan jumlah stok yang ingin ditambahkan</p>
                  <p>• Lihat preview total stok setelah penambahan</p>
                  <p>• Klik <strong>"Tambah Stok"</strong> untuk konfirmasi</p>
                </div>
              </div>

              {/* Hapus Produk */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  Hapus Produk
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Buka menu <strong>"Kelola Stok"</strong></p>
                  <p>• Klik tombol <strong>"Hapus"</strong> (ikon tempat sampah) pada produk</p>
                  <p>• Baca peringatan dengan teliti</p>
                  <p>• Klik <strong>"Hapus Produk"</strong> untuk konfirmasi</p>
                  <p className="text-red-600 font-medium">⚠️ Perhatian: Tindakan ini tidak dapat dibatalkan!</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'sales':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Input Penjualan</h2>
            
            <div className="space-y-8">
              {/* Input Penjualan */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Cara Input Penjualan
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Buka menu <strong>"Penjualan"</strong></p>
                  <p>• Pilih tab <strong>"Input Penjualan"</strong></p>
                  <p>• Pilih produk yang terjual:</p>
                  <div className="ml-4 space-y-1">
                    <p>- Gunakan dropdown untuk memilih produk</p>
                    <p>- Atau gunakan search box untuk mencari produk</p>
                  </div>
                  <p>• Isi detail penjualan:</p>
                  <div className="ml-4 space-y-1">
                    <p>- Jumlah yang terjual</p>
                    <p>- Tanggal penjualan</p>
                    <p>- Harga jual per unit (otomatis terisi)</p>
                    <p>- Harga beli per unit (otomatis terisi)</p>
                    <p>- Keterangan (opsional)</p>
                  </div>
                  <p>• Lihat ringkasan transaksi (total penjualan, modal, keuntungan)</p>
                  <p>• Klik <strong>"Simpan Penjualan"</strong></p>
                </div>
              </div>

              {/* Lihat History */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Lihat Riwayat Penjualan
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Di halaman Penjualan, pilih tab <strong>"Riwayat Penjualan"</strong></p>
                  <p>• Gunakan filter tanggal untuk melihat periode tertentu</p>
                  <p>• Gunakan search untuk mencari transaksi spesifik</p>
                  <p>• Lihat detail setiap transaksi termasuk keuntungan</p>
                </div>
              </div>

              {/* Dashboard Profit */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Dashboard Profit
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Di halaman Penjualan, pilih tab <strong>"Dashboard Profit"</strong></p>
                  <p>• Lihat keuntungan hari ini</p>
                  <p>• Lihat tren 7 hari terakhir</p>
                  <p>• Lihat produk terlaris hari ini</p>
                  <p>• Monitor total transaksi dan unit terjual</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Lihat Laporan & Profit</h2>
            
            <div className="space-y-8">
              {/* Dashboard Utama */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Dashboard Utama
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Buka halaman <strong>"Dashboard"</strong> (halaman utama)</p>
                  <p>• Lihat ringkasan stok:</p>
                  <div className="ml-4 space-y-1">
                    <p>- Total Stok (jumlah unit)</p>
                    <p>- Total Modal (nilai beli semua stok)</p>
                    <p>- Total Nilai Jual (potensi pendapatan)</p>
                    <p>- Potensi Laba (selisih jual - beli)</p>
                  </div>
                  <p>• Lihat keuntungan hari ini</p>
                  <p>• Lihat detail penjualan hari ini</p>
                </div>
              </div>

              {/* Analisis Keuntungan */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Analisis Keuntungan
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Buka menu <strong>"Penjualan"</strong> → tab <strong>"Dashboard Profit"</strong></p>
                  <p>• Lihat metrik penting:</p>
                  <div className="ml-4 space-y-1">
                    <p>- Total transaksi hari ini</p>
                    <p>- Total unit terjual</p>
                    <p>- Total penjualan (rupiah)</p>
                    <p>- Total keuntungan</p>
                    <p>- Persentase keuntungan</p>
                  </div>
                  <p>• Lihat tren 7 hari terakhir</p>
                  <p>• Identifikasi produk terlaris</p>
                </div>
              </div>

              {/* Monitor Stok */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-yellow-100 text-yellow-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Monitor Stok
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Buka menu <strong>"Kelola Stok"</strong></p>
                  <p>• Lihat statistik di bagian atas:</p>
                  <div className="ml-4 space-y-1">
                    <p>- Total Produk</p>
                    <p>- Stok Menipis (&lt; 10 unit)</p>
                    <p>- Stok Habis (0 unit)</p>
                  </div>
                  <p>• Gunakan filter untuk analisis spesifik</p>
                  <p>• Identifikasi produk yang perlu restock</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'tips':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Tips & Trik</h2>
            
            <div className="space-y-6">
              {/* Tips Umum */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Tips Umum</h3>
                <div className="space-y-2 text-blue-800">
                  <p>• Selalu input penjualan segera setelah transaksi</p>
                  <p>• Cek stok menipis secara rutin di halaman Kelola Stok</p>
                  <p>• Gunakan search dan filter untuk menemukan produk dengan cepat</p>
                  <p>• Monitor keuntungan harian di Dashboard</p>
                </div>
              </div>

              {/* Tips Stok */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">📦 Tips Kelola Stok</h3>
                <div className="space-y-2 text-green-800">
                  <p>• Set harga jual minimal 20-30% di atas harga beli</p>
                  <p>• Gunakan kode warna yang konsisten untuk memudah pencarian</p>
                  <p>• Restock sebelum stok habis untuk menghindari kehilangan penjualan</p>
                  <p>• Kelompokkan produk berdasarkan brand dan jenis</p>
                </div>
              </div>

              {/* Tips Penjualan */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">💰 Tips Penjualan</h3>
                <div className="space-y-2 text-purple-800">
                  <p>• Catat semua penjualan, termasuk yang kecil</p>
                  <p>• Gunakan keterangan untuk mencatat detail customer atau proyek</p>
                  <p>• Cek keuntungan per transaksi sebelum menyimpan</p>
                  <p>• Review penjualan harian di akhir hari</p>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">🔧 Troubleshooting</h3>
                <div className="space-y-2 text-red-800">
                  <p>• Jika stok tidak update setelah penjualan, refresh halaman</p>
                  <p>• Jika tidak bisa input penjualan, pastikan stok produk &gt; 0</p>
                  <p>• Jika keuntungan tidak muncul, cek apakah harga jual &gt; harga beli</p>
                  <p>• Untuk masalah lain, logout dan login kembali</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Panduan Penggunaan</h1>
            <p className="text-blue-100">Pelajari cara menggunakan semua fitur Stock Dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4">Daftar Isi</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-3 ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanduanPage