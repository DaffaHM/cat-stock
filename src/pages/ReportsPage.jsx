const ReportsPage = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Laporan & Analisis</h1>
        <p className="text-gray-600 mt-2">Analisis mendalam dan laporan bisnis</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
        <div className="mb-4">
          <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Fitur laporan dan analisis sedang dalam pengembangan
        </p>
        <div className="bg-blue-50 rounded-lg p-6 text-left max-w-2xl mx-auto">
          <h3 className="font-semibold text-gray-900 mb-3">Fitur yang akan datang:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Laporan keuangan lengkap (modal, pendapatan, laba)
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Analisis produk best seller dan slow moving
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Perbandingan performa antar brand
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Export laporan ke PDF dan Excel
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Grafik dan visualisasi data
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage