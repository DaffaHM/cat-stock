import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import StockTable from '../components/StockTableModern'
import SearchFilter from '../components/SearchFilter'

const StockManagementPage = () => {
  const navigate = useNavigate()
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJenis, setSelectedJenis] = useState('')
  
  // No modal states needed anymore

  useEffect(() => {
    fetchStocks()
  }, [])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching stocks from Supabase...')
      console.log('Environment:', import.meta.env.MODE)
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .order('brand', { ascending: true })

      console.log('📊 Supabase response:', { data, error })
      
      if (error) {
        console.error('❌ Supabase error:', error)
        // Show user-friendly error
        alert(`Database Error: ${error.message}. Please check console for details.`)
        throw error
      }
      
      console.log('✅ Stocks fetched successfully:', data?.length || 0, 'records')
      setStocks(data || [])
    } catch (error) {
      console.error('💥 Error fetching stocks:', error)
      // Show error to user in production
      if (import.meta.env.PROD) {
        alert(`Error loading data: ${error.message}`)
      }
      // Set empty array on error to prevent undefined issues
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  // CRUD Handlers
  const handleAdd = () => {
    navigate('/add-product')
  }

  const handleModalSuccess = async () => {
    await fetchStocks()
  }

  const handleEdit = (stock) => {
    navigate(`/edit-product/${stock.id}`)
  }

  const handleRestock = (stock) => {
    navigate(`/restock/${stock.id}`)
  }

  const handleDelete = (stock) => {
    navigate(`/delete-product/${stock.id}`)
  }

  // Filter dan search data
  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchesSearch = 
        stock.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.warna.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesJenis = selectedJenis === '' || stock.jenis_produk === selectedJenis

      return matchesSearch && matchesJenis
    })
  }, [stocks, searchTerm, selectedJenis])

  // Dapatkan opsi jenis produk unik
  const jenisOptions = useMemo(() => {
    return [...new Set(stocks.map(stock => stock.jenis_produk))].sort()
  }, [stocks])

  // Statistics
  const stats = useMemo(() => {
    const totalProducts = stocks.length
    const lowStockCount = stocks.filter(stock => stock.stok < 10).length
    const totalValue = stocks.reduce((sum, stock) => sum + (stock.stok * stock.harga_jual), 0)
    const outOfStock = stocks.filter(stock => stock.stok === 0).length

    return { totalProducts, lowStockCount, totalValue, outOfStock }
  }, [stocks])

  return (
    <div className="max-w-full space-y-8">
      {/* Modern Header with Solid Color */}
      <div className="bg-blue-600 relative overflow-hidden rounded-3xl p-8">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Manajemen Stok</h1>
                <p className="text-white opacity-90">Kelola inventori produk cat dengan mudah dan efisien</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
                <div className="text-xs text-white opacity-75">Total Produk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">{stats.lowStockCount}</div>
                <div className="text-xs text-white opacity-75">Stok Menipis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-300">{stats.outOfStock}</div>
                <div className="text-xs text-white opacity-75">Habis</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleAdd}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Produk Baru
            </button>
            
            <button 
              className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import Data
            </button>
            
            <button 
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Excel
            </button>
          </div>

          {/* Stats Cards - Mobile */}
          <div className="lg:hidden grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.totalProducts}</div>
              <div className="text-xs text-blue-500">Produk</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.lowStockCount}</div>
              <div className="text-xs text-yellow-500">Menipis</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-red-600">{stats.outOfStock}</div>
              <div className="text-xs text-red-500">Habis</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedJenis={selectedJenis}
          setSelectedJenis={setSelectedJenis}
          jenisOptions={jenisOptions}
        />

        {/* Results Info */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-semibold text-gray-900">{filteredStocks.length}</span> dari <span className="font-semibold text-gray-900">{stocks.length}</span> produk
          </p>
          
          {filteredStocks.length !== stocks.length && (
            <button 
              onClick={() => {
                setSearchTerm('')
                setSelectedJenis('')
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <StockTable 
          stocks={filteredStocks} 
          loading={loading}
          onEdit={handleEdit}
          onRestock={handleRestock}
          onDelete={handleDelete}
        />
      </div>

    </div>
  )
}

export default StockManagementPage