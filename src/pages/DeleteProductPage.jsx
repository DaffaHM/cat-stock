import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatRupiah } from '../utils/formatCurrency'

const DeleteProductPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [stockData, setStockData] = useState(null)

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

  const handleDelete = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('stocks')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Produk berhasil dihapus!')
      navigate('/stock-management')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Gagal menghapus produk: ' + error.message)
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
      <div 
        className="relative overflow-hidden rounded-3xl p-8"
        style={{ backgroundColor: '#dc2626' }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/stock-management')}
                className="rounded-2xl p-3 transition-colors"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Hapus Produk</h1>
                <p className="text-white opacity-90">Konfirmasi penghapusan produk dari inventori</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div 
          className="absolute -top-4 -right-4 w-32 h-32 rounded-full blur-2xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        ></div>
        <div 
          className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        ></div>
      </div>

      {/* Warning Card */}
      <div 
        className="border rounded-2xl p-6"
        style={{ 
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca'
        }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className="rounded-full p-2"
            style={{ backgroundColor: '#fee2e2' }}
          >
            <svg className="w-6 h-6" style={{ color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#991b1b' }}>Peringatan!</h3>
            <p style={{ color: '#b91c1c' }}>Tindakan ini tidak dapat dibatalkan setelah dikonfirmasi.</p>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Produk yang Akan Dihapus</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div 
              className="rounded-xl w-16 h-16 flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#ef4444' }}
            >
              {stockData.brand.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-xl">
                {stockData.brand} - {stockData.nama_produk}
              </h3>
              <p className="text-gray-600 text-lg">{stockData.jenis_produk} • {stockData.kemasan}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <span className="text-sm text-gray-500">Warna</span>
              <div className="font-semibold text-gray-900">{stockData.warna}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <span className="text-sm text-gray-500">Kode Warna</span>
              <div className="font-semibold text-gray-900">{stockData.kode_warna}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <span className="text-sm text-gray-500">Stok Saat Ini</span>
              <div className="font-semibold text-lg" style={{ color: '#dc2626' }}>{stockData.stok} unit</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <span className="text-sm text-gray-500">Harga Jual</span>
              <div className="font-semibold text-gray-900">{formatRupiah(stockData.harga_jual)}</div>
            </div>
          </div>

          {/* Value Loss Warning */}
          {stockData.stok > 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <div className="font-medium text-yellow-800">Perhatian: Masih Ada Stok</div>
                  <div className="text-sm text-yellow-700">
                    Nilai stok yang akan hilang: <span className="font-semibold">{formatRupiah(stockData.stok * stockData.harga_beli)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Penghapusan</h3>
        <p className="text-gray-600 mb-6">
          Dengan menghapus produk ini, semua data terkait akan dihilangkan secara permanen dari sistem. 
          Pastikan Anda benar-benar yakin sebelum melanjutkan.
        </p>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/stock-management')}
            disabled={loading}
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 font-medium"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium btn-red"
            style={{
              backgroundColor: '#dc2626 !important',
              border: 'none !important',
              color: '#ffffff !important'
            }}
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Menghapus...' : 'Hapus Produk'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteProductPage