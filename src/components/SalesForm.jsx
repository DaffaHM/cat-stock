import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { formatRupiah } from '../utils/formatCurrency'

const SalesForm = ({ onSaleSuccess }) => {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStock, setSelectedStock] = useState(null)
  const [formData, setFormData] = useState({
    jumlah_terjual: '',
    harga_jual_saat_itu: '',
    harga_beli_saat_itu: '',
    tanggal_jual: new Date().toISOString().split('T')[0],
    keterangan: ''
  })
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    fetchStocks()
  }, [])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching stocks for sales form...')
      
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .gt('stok', 0) // Only show products with stock > 0
        .order('nama_produk', { ascending: true })

      console.log('📦 Stocks response:', { data, error })

      if (error) {
        console.error('❌ Error fetching stocks:', error)
        throw error
      }
      
      console.log(`✅ Found ${data?.length || 0} products with stock > 0`)
      setStocks(data || [])
    } catch (error) {
      console.error('💥 Error fetching stocks:', error)
      showNotification(`Error memuat data stok: ${error.message}`, 'error')
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  const filteredStocks = stocks.filter(stock =>
    stock.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.warna.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.kode_warna.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStockSelect = (stock) => {
    setSelectedStock(stock)
    setFormData(prev => ({
      ...prev,
      harga_jual_saat_itu: stock.harga_jual.toString(),
      harga_beli_saat_itu: stock.harga_beli.toString()
    }))
    setSearchTerm('')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateProfit = () => {
    const jumlah = parseInt(formData.jumlah_terjual) || 0
    const hargaJual = parseFloat(formData.harga_jual_saat_itu) || 0
    const hargaBeli = parseFloat(formData.harga_beli_saat_itu) || 0
    return jumlah * (hargaJual - hargaBeli)
  }

  const calculateTotal = () => {
    const jumlah = parseInt(formData.jumlah_terjual) || 0
    const hargaJual = parseFloat(formData.harga_jual_saat_itu) || 0
    return jumlah * hargaJual
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('🛒 Starting sales submission...')
    console.log('Selected stock:', selectedStock)
    console.log('Form data:', formData)
    
    if (!selectedStock) {
      showNotification('Pilih produk terlebih dahulu', 'error')
      return
    }

    const jumlah = parseInt(formData.jumlah_terjual)
    if (isNaN(jumlah) || jumlah <= 0) {
      showNotification('Jumlah terjual harus lebih dari 0', 'error')
      return
    }
    
    if (jumlah > selectedStock.stok) {
      showNotification(`Stok tidak mencukupi. Stok tersedia: ${selectedStock.stok}`, 'error')
      return
    }

    const hargaJual = parseFloat(formData.harga_jual_saat_itu)
    const hargaBeli = parseFloat(formData.harga_beli_saat_itu)
    
    if (isNaN(hargaJual) || hargaJual <= 0) {
      showNotification('Harga jual harus valid', 'error')
      return
    }
    
    if (isNaN(hargaBeli) || hargaBeli <= 0) {
      showNotification('Harga beli harus valid', 'error')
      return
    }

    try {
      setSubmitting(true)
      
      const salesData = {
        stock_id: selectedStock.id,
        tanggal_jual: formData.tanggal_jual,
        jumlah_terjual: jumlah,
        harga_jual_saat_itu: hargaJual,
        harga_beli_saat_itu: hargaBeli,
        keterangan: formData.keterangan || ''
      }
      
      console.log('💾 Inserting sales data:', salesData)

      // Step 1: Insert sales record
      const { data: salesResult, error: salesError } = await supabase
        .from('sales')
        .insert([salesData])
        .select()

      if (salesError) {
        console.error('❌ Sales insert error:', salesError)
        throw salesError
      }
      
      console.log('✅ Sales inserted successfully:', salesResult)

      // Step 2: Update stock quantity
      const newStockQuantity = selectedStock.stok - jumlah
      console.log(`📦 Updating stock: ${selectedStock.stok} - ${jumlah} = ${newStockQuantity}`)
      
      const { error: stockUpdateError } = await supabase
        .from('stocks')
        .update({ stok: newStockQuantity })
        .eq('id', selectedStock.id)

      if (stockUpdateError) {
        console.error('❌ Stock update error:', stockUpdateError)
        // Try to rollback sales insert if stock update fails
        if (salesResult && salesResult[0]) {
          await supabase
            .from('sales')
            .delete()
            .eq('id', salesResult[0].id)
        }
        throw stockUpdateError
      }
      
      console.log('✅ Stock updated successfully')

      showNotification('Penjualan berhasil dicatat!', 'success')
      
      // Reset form
      setSelectedStock(null)
      setFormData({
        jumlah_terjual: '',
        harga_jual_saat_itu: '',
        harga_beli_saat_itu: '',
        tanggal_jual: new Date().toISOString().split('T')[0],
        keterangan: ''
      })
      
      // Refresh stocks data
      fetchStocks()
      
      // Notify parent component
      if (onSaleSuccess) {
        onSaleSuccess()
      }

    } catch (error) {
      console.error('💥 Error saving sale:', error)
      showNotification(`Error menyimpan penjualan: ${error.message}`, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 rounded-xl p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Input Transaksi Penjualan</h2>
            <p className="text-blue-100 text-sm">Catat penjualan produk dan update stok otomatis</p>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            <span className="mr-3">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </span>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Selection Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Pilih Produk
            </h3>
          </div>
          
          <div className="p-6">
            {!selectedStock ? (
              <div className="space-y-6">
                {/* Modern Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih dari Daftar Produk
                  </label>
                  <select
                    value={selectedStock?.id || ''}
                    onChange={(e) => {
                      const stock = stocks.find(s => s.id === e.target.value)
                      if (stock) handleStockSelect(stock)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">-- Pilih Produk --</option>
                    {stocks.map((stock) => (
                      <option key={stock.id} value={stock.id}>
                        {stock.brand} - {stock.nama_produk} | {stock.warna} | Stok: {stock.stok} | {formatRupiah(stock.harga_jual)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">atau</span>
                  </div>
                </div>
                
                {/* Modern Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari Produk
                  </label>
                  <input
                    type="text"
                    placeholder="Cari berdasarkan brand, nama, warna, atau kode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>
                
                {/* Search Results */}
                {searchTerm && (
                  <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-xl bg-white">
                    {filteredStocks.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {filteredStocks.map((stock) => (
                          <div
                            key={stock.id}
                            onClick={() => handleStockSelect(stock)}
                            className="p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {stock.brand}
                                  </span>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    stock.stok > 10 ? 'bg-green-100 text-green-800' : 
                                    stock.stok > 5 ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    Stok: {stock.stok}
                                  </span>
                                </div>
                                <p className="font-semibold text-gray-900 mb-1">
                                  {stock.nama_produk}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {stock.jenis_produk} | {stock.kemasan} | {stock.warna} ({stock.kode_warna})
                                </p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-lg font-bold text-blue-600">
                                  {formatRupiah(stock.harga_jual)}
                                </p>
                                <p className="text-sm text-gray-500">per unit</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <svg className="w-6 h-6 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-600">Tidak ada produk ditemukan</p>
                        <p className="text-xs text-gray-500">Coba kata kunci lain</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Selected Product Display */
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800">
                          {selectedStock.brand}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedStock.stok > 10 ? 'bg-green-200 text-green-800' : 
                          selectedStock.stok > 5 ? 'bg-yellow-200 text-yellow-800' : 
                          'bg-red-200 text-red-800'
                        }`}>
                          Stok: {selectedStock.stok}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 text-lg mb-1">
                        {selectedStock.nama_produk}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedStock.jenis_produk} | {selectedStock.kemasan} | {selectedStock.warna} ({selectedStock.kode_warna})
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {formatRupiah(selectedStock.harga_jual)} <span className="text-sm font-normal text-gray-500">per unit</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStock(null)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Details Form - Only show when product is selected */}
        {selectedStock && (
          <>
            {/* Form Input Fields Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Detail Transaksi
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      Jumlah Terjual *
                    </label>
                    <input
                      type="number"
                      name="jumlah_terjual"
                      value={formData.jumlah_terjual}
                      onChange={handleInputChange}
                      min="1"
                      max={selectedStock.stok}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                      placeholder="Masukkan jumlah"
                    />
                    <p className="text-xs text-gray-500">Maksimal: {selectedStock.stok} unit</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
                      </svg>
                      Tanggal Penjualan *
                    </label>
                    <input
                      type="date"
                      name="tanggal_jual"
                      value={formData.tanggal_jual}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Harga Jual per Unit *
                    </label>
                    <input
                      type="number"
                      name="harga_jual_saat_itu"
                      value={formData.harga_jual_saat_itu}
                      onChange={handleInputChange}
                      min="0"
                      step="1000"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                      placeholder="Harga jual"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Harga Beli per Unit *
                    </label>
                    <input
                      type="number"
                      name="harga_beli_saat_itu"
                      value={formData.harga_beli_saat_itu}
                      onChange={handleInputChange}
                      min="0"
                      step="1000"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                      placeholder="Harga beli"
                    />
                  </div>
                </div>

                {/* Notes Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2h-5l-4 4z" />
                    </svg>
                    Keterangan
                  </label>
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Catatan tambahan (opsional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Transaction Summary Card */}
            {formData.jumlah_terjual && formData.harga_jual_saat_itu && formData.harga_beli_saat_itu && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Ringkasan Transaksi
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Total Penjualan</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatRupiah(calculateTotal())}
                      </p>
                    </div>
                    
                    <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Total Modal</p>
                      <p className="text-2xl font-bold text-gray-600">
                        {formatRupiah(parseInt(formData.jumlah_terjual) * parseFloat(formData.harga_beli_saat_itu))}
                      </p>
                    </div>
                    
                    <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Keuntungan</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatRupiah(calculateProfit())}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 min-w-[200px] justify-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan Penjualan
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  )
}

export default SalesForm