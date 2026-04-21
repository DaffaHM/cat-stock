import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatRupiah } from '../utils/formatCurrency'

const RestockPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [stockData, setStockData] = useState(null)
  const [quantity, setQuantity] = useState(0)
  const [error, setError] = useState('')

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
      setStockData(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Gagal memuat data produk: ' + error.message)
      navigate('/stock-management')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (quantity <= 0) {
      setError('Jumlah stok harus lebih dari 0')
      return
    }

    try {
      setLoading(true)
      
      const newStock = stockData.stok + quantity
      
      const { error } = await supabase
        .from('stocks')
        .update({ stok: newStock })
        .eq('id', id)

      if (error) throw error

      alert(`Berhasil menambah ${quantity} unit stok!`)
      navigate('/stock-management')
    } catch (error) {
      console.error('Error updating stock:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!stockData) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h2>
          <button
            onClick={() => navigate('/stock-management')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Kembali ke Kelola Stok
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pt-4">
      {/* Header */}
      <div className="bg-green-600 relative overflow-hidden rounded-3xl p-8">
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
                <h1 className="text-3xl font-bold mb-2 text-white">Tambah Stok</h1>
                <p className="text-white opacity-90">Menambah stok produk yang sudah ada</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Product Info */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Produk</h2>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-green-500 rounded-xl w-16 h-16 flex items-center justify-center text-white font-bold text-lg">
              {stockData.brand.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {stockData.brand} - {stockData.nama_produk}
              </h3>
              <p className="text-gray-600">{stockData.jenis_produk} • {stockData.kemasan}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Warna:</span>
              <span className="ml-2 text-gray-900 font-medium">{stockData.warna}</span>
            </div>
            <div>
              <span className="text-gray-500">Kode:</span>
              <span className="ml-2 text-gray-900 font-medium">{stockData.kode_warna}</span>
            </div>
            <div>
              <span className="text-gray-500">Stok Saat Ini:</span>
              <span className="ml-2 font-semibold text-green-600 text-lg">{stockData.stok}</span>
            </div>
            <div>
              <span className="text-gray-500">Harga Beli:</span>
              <span className="ml-2 text-gray-900 font-medium">
                {formatRupiah(stockData.harga_beli)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Restock Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Stok yang Ditambahkan *
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => {
                setQuantity(parseInt(e.target.value) || 0)
                setError('')
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan jumlah stok"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Preview */}
          {quantity > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-medium text-green-800 mb-3">Preview Penambahan Stok</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-800">Stok setelah penambahan:</span>
                  <span className="font-bold text-green-900 text-lg">
                    {stockData.stok} + {quantity} = {stockData.stok + quantity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-800">Total nilai tambahan:</span>
                  <span className="font-bold text-green-900">
                    {formatRupiah(quantity * stockData.harga_beli)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-800">Total nilai stok:</span>
                  <span className="font-bold text-green-900">
                    {formatRupiah((stockData.stok + quantity) * stockData.harga_beli)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/stock-management')}
              disabled={loading}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || quantity <= 0}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Tambah Stok
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RestockPage