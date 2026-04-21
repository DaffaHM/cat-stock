import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AddProductPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    brand: '',
    nama_produk: '',
    jenis_produk: '',
    kemasan: '',
    warna: '',
    kode_warna: '',
    stok: 0,
    harga_beli: 0,
    harga_jual: 0
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState(null)
  const [showCustomJenis, setShowCustomJenis] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.brand.trim()) newErrors.brand = 'Brand wajib diisi'
    if (!formData.nama_produk.trim()) newErrors.nama_produk = 'Nama produk wajib diisi'
    if (!formData.jenis_produk.trim()) newErrors.jenis_produk = 'Jenis produk wajib diisi'
    if (!formData.kemasan.trim()) newErrors.kemasan = 'Kemasan wajib diisi'
    if (!formData.warna.trim()) newErrors.warna = 'Warna wajib diisi'
    if (formData.stok < 0) newErrors.stok = 'Stok tidak boleh negatif'
    if (formData.harga_beli < 0) newErrors.harga_beli = 'Harga beli tidak boleh negatif'
    if (formData.harga_jual < 0) newErrors.harga_jual = 'Harga jual tidak boleh negatif'
    if (formData.harga_jual <= formData.harga_beli && formData.harga_beli > 0) {
      newErrors.harga_jual = 'Harga jual harus lebih besar dari harga beli'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      console.log('Inserting new product:', formData)

      const { data, error } = await supabase
        .from('stocks')
        .insert([formData])
        .select()

      if (error) throw error

      console.log('Product added successfully:', data)
      setNotification({ type: 'success', message: 'Produk berhasil ditambahkan!' })
      
      // Reset form
      setFormData({
        brand: '',
        nama_produk: '',
        jenis_produk: '',
        kemasan: '',
        warna: '',
        kode_warna: '',
        stok: 0,
        harga_beli: 0,
        harga_jual: 0
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/stock-management')
      }, 2000)

    } catch (error) {
      console.error('Error adding product:', error)
      setNotification({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const calculateProfit = () => {
    if (formData.harga_jual > formData.harga_beli && formData.harga_beli > 0) {
      const profit = formData.harga_jual - formData.harga_beli
      const percentage = ((profit / formData.harga_beli) * 100).toFixed(1)
      return { profit, percentage }
    }
    return null
  }

  const profitData = calculateProfit()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">+</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Tambah Produk Baru</h1>
              <p className="text-blue-100">Daftarkan produk cat baru ke dalam inventori</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/stock-management')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium shadow-sm"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-blue-600">Kembali</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-xl border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Informasi Dasar Produk
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      errors.brand ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Contoh: Indaco, Nippon Paint, Dulux"
                  />
                  {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    value={formData.nama_produk}
                    onChange={(e) => handleChange('nama_produk', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      errors.nama_produk ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Contoh: Envi, Catylac, Weathershield"
                  />
                  {errors.nama_produk && <p className="text-red-500 text-sm mt-1">{errors.nama_produk}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Produk *
                  </label>
                  
                  {/* Toggle between select and input */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowCustomJenis(false)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          !showCustomJenis 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                      >
                        Pilih dari List
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomJenis(true)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          showCustomJenis 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                      >
                        Input Manual
                      </button>
                    </div>
                    
                    {!showCustomJenis ? (
                      <select
                        value={formData.jenis_produk}
                        onChange={(e) => handleChange('jenis_produk', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                          errors.jenis_produk ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Pilih Jenis Produk</option>
                        <option value="Cat Tembok">Cat Tembok</option>
                        <option value="Cat Kayu">Cat Kayu</option>
                        <option value="Cat Besi">Cat Besi</option>
                        <option value="Cat Exterior">Cat Exterior</option>
                        <option value="Cat Interior">Cat Interior</option>
                        <option value="Primer">Primer</option>
                        <option value="Thinner">Thinner</option>
                        <option value="Cat Anti Jamur">Cat Anti Jamur</option>
                        <option value="Cat Waterproof">Cat Waterproof</option>
                        <option value="Aksesori">Aksesori</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData.jenis_produk}
                        onChange={(e) => handleChange('jenis_produk', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                          errors.jenis_produk ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ketik jenis produk baru (contoh: Cat Tekstur, Cat Khusus, dll)"
                      />
                    )}
                  </div>
                  
                  {errors.jenis_produk && <p className="text-red-500 text-sm mt-1">{errors.jenis_produk}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kemasan *
                  </label>
                  <input
                    type="text"
                    value={formData.kemasan}
                    onChange={(e) => handleChange('kemasan', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      errors.kemasan ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Contoh: 5 KG, 1 LT, 0.9 LT, 25 KG"
                  />
                  {errors.kemasan && <p className="text-red-500 text-sm mt-1">{errors.kemasan}</p>}
                </div>
              </div>
            </div>

            {/* Color & Code Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                Warna & Kode
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warna *
                  </label>
                  <input
                    type="text"
                    value={formData.warna}
                    onChange={(e) => handleChange('warna', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      errors.warna ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Contoh: Base A, Pure Gold, Putih, Biru Laut"
                  />
                  {errors.warna && <p className="text-red-500 text-sm mt-1">{errors.warna}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Warna (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.kode_warna}
                    onChange={(e) => handleChange('kode_warna', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="Contoh: A001, BL-123, #FFFFFF"
                  />
                </div>
              </div>
            </div>

            {/* Stock & Pricing Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Stok & Harga
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stok Awal *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stok}
                    onChange={(e) => handleChange('stok', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      errors.stok ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.stok && <p className="text-red-500 text-sm mt-1">{errors.stok}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Beli *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.harga_beli}
                    onChange={(e) => handleChange('harga_beli', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      errors.harga_beli ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.harga_beli && <p className="text-red-500 text-sm mt-1">{errors.harga_beli}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Jual *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.harga_jual}
                    onChange={(e) => handleChange('harga_jual', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      errors.harga_jual ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.harga_jual && <p className="text-red-500 text-sm mt-1">{errors.harga_jual}</p>}
                </div>
              </div>
            </div>

            {/* Profit Preview */}
            {profitData && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Keuntungan per Unit</p>
                      <p className="text-xs text-green-600">Margin keuntungan yang akan didapat</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-700">
                      Rp {profitData.profit.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-green-600">
                      {profitData.percentage}% margin
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/stock-management')}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Menyimpan...' : 'Tambah Produk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProductPage