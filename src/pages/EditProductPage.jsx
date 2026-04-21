import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EditProductPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [showCustomJenis, setShowCustomJenis] = useState(false)
  
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

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      setFetchLoading(true)
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      if (data) {
        setFormData({
          brand: data.brand || '',
          nama_produk: data.nama_produk || '',
          jenis_produk: data.jenis_produk || '',
          kemasan: data.kemasan || '',
          warna: data.warna || '',
          kode_warna: data.kode_warna || '',
          stok: data.stok || 0,
          harga_beli: data.harga_beli || 0,
          harga_jual: data.harga_jual || 0
        })
        
        // Set custom jenis if not in predefined list
        const predefinedJenis = ['Cat Tembok', 'Cat Kayu', 'Cat Besi', 'Cat Exterior', 'Cat Interior', 'Primer', 'Thinner', 'Cat Anti Jamur', 'Cat Waterproof', 'Aksesori']
        setShowCustomJenis(!predefinedJenis.includes(data.jenis_produk))
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Gagal memuat data produk: ' + error.message)
      navigate('/stock-management')
    } finally {
      setFetchLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.brand.trim()) newErrors.brand = 'Brand wajib diisi'
    if (!formData.nama_produk.trim()) newErrors.nama_produk = 'Nama produk wajib diisi'
    if (!formData.jenis_produk.trim()) newErrors.jenis_produk = 'Jenis produk wajib diisi'
    if (!formData.kemasan.trim()) newErrors.kemasan = 'Kemasan wajib diisi'
    if (!formData.warna.trim()) newErrors.warna = 'Warna wajib diisi'
    if (!formData.kode_warna.trim()) newErrors.kode_warna = 'Kode warna wajib diisi'
    if (formData.stok < 0) newErrors.stok = 'Stok tidak boleh negatif'
    if (formData.harga_beli < 0) newErrors.harga_beli = 'Harga beli tidak boleh negatif'
    if (formData.harga_jual < 0) newErrors.harga_jual = 'Harga jual tidak boleh negatif'
    if (formData.harga_jual <= formData.harga_beli) {
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

      const { data, error } = await supabase
        .from('stocks')
        .update(formData)
        .eq('id', id)
        .select()

      if (error) throw error

      alert('Produk berhasil diupdate!')
      navigate('/stock-management')
    } catch (error) {
      console.error('Error updating product:', error)
      setErrors({ submit: error.message })
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

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4">
      {/* Header */}
      <div className="bg-blue-600 relative overflow-hidden rounded-3xl p-8">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/stock-management')}
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-3 hover:bg-opacity-30 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Edit Produk</h1>
                <p className="text-white opacity-90">Ubah informasi produk cat</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand & Nama Produk */}
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
                placeholder="Contoh: Indaco"
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
                placeholder="Contoh: Envi"
              />
              {errors.nama_produk && <p className="text-red-500 text-sm mt-1">{errors.nama_produk}</p>}
            </div>
          </div>

          {/* Jenis Produk & Kemasan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Produk *
              </label>
              
              {/* Toggle between select and input */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomJenis(false)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
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
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
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
                    placeholder="Ketik jenis produk baru"
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
                placeholder="Contoh: 5 KG, 1 LT, 0.9 LT"
              />
              {errors.kemasan && <p className="text-red-500 text-sm mt-1">{errors.kemasan}</p>}
            </div>
          </div>

          {/* Warna & Kode Warna */}
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
                placeholder="Contoh: Base A, Pure Gold, Putih"
              />
              {errors.warna && <p className="text-red-500 text-sm mt-1">{errors.warna}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Warna *
              </label>
              <input
                type="text"
                value={formData.kode_warna}
                onChange={(e) => handleChange('kode_warna', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                  errors.kode_warna ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Contoh: 00845, 00841"
              />
              {errors.kode_warna && <p className="text-red-500 text-sm mt-1">{errors.kode_warna}</p>}
            </div>
          </div>

          {/* Stok */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok *
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
          </div>

          {/* Harga Beli & Harga Jual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Beli *
              </label>
              <input
                type="number"
                min="0"
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

          {/* Profit Preview */}
          {formData.harga_jual > formData.harga_beli && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm font-medium text-green-800">
                  Keuntungan per unit: Rp {(formData.harga_jual - formData.harga_beli).toLocaleString('id-ID')}
                </span>
                <span className="text-sm text-green-600">
                  ({(((formData.harga_jual - formData.harga_beli) / formData.harga_beli) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
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
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Update Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProductPage