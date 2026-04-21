import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { formatRupiah } from '../utils/formatCurrency'
import SummaryCard from './SummaryCard'
import StockTable from './StockTableModern'
import SearchFilter from './SearchFilter'

const Dashboard = () => {
  const [stocks, setStocks] = useState([])
  const [todaySales, setTodaySales] = useState([])
  const [todaySummary, setTodaySummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJenis, setSelectedJenis] = useState('')

  // Fetch data dari Supabase
  useEffect(() => {
    fetchStocks()
    fetchTodaySales()
  }, [])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .order('brand', { ascending: true })

      if (error) throw error

      setStocks(data || [])
    } catch (error) {
      console.error('Error fetching stocks:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchTodaySales = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Fetch today's sales details
      const { data: salesData, error: salesError } = await supabase
        .from('daily_sales_detail')
        .select('*')
        .eq('tanggal_jual', today)
        .order('created_at', { ascending: false })

      if (salesError) {
        console.error('Error fetching today sales:', salesError)
      } else {
        setTodaySales(salesData || [])
      }

      // Fetch today's summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('daily_profit_report')
        .select('*')
        .eq('tanggal_jual', today)
        .single()

      if (summaryError && summaryError.code !== 'PGRST116') {
        console.error('Error fetching today summary:', summaryError)
      } else {
        setTodaySummary(summaryData)
      }
    } catch (error) {
      console.error('Error fetching today sales:', error)
    }
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

  // Hitung ringkasan data
  const summary = useMemo(() => {
    const totalStok = filteredStocks.reduce((sum, stock) => sum + stock.stok, 0)
    const totalModal = filteredStocks.reduce((sum, stock) => sum + (stock.stok * stock.harga_beli), 0)
    const totalNilaiJual = filteredStocks.reduce((sum, stock) => sum + (stock.stok * stock.harga_jual), 0)
    const totalPotensiLaba = totalNilaiJual - totalModal

    return {
      totalStok,
      totalModal,
      totalNilaiJual,
      totalPotensiLaba
    }
  }, [filteredStocks])

  // Dapatkan opsi jenis produk unik
  const jenisOptions = useMemo(() => {
    return [...new Set(stocks.map(stock => stock.jenis_produk))].sort()
  }, [stocks])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Pastikan konfigurasi Supabase sudah benar di src/lib/supabase.js
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Stok Cat</h1>
          <p className="text-gray-600 mt-2">Kelola dan pantau stok cat Anda</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Stok"
            value={summary.totalStok}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <SummaryCard
            title="Total Modal"
            value={summary.totalModal}
            isRupiah={true}
            bgColor="bg-yellow-50"
            textColor="text-yellow-600"
          />
          <SummaryCard
            title="Total Nilai Jual"
            value={summary.totalNilaiJual}
            isRupiah={true}
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <SummaryCard
            title="Potensi Laba"
            value={summary.totalPotensiLaba}
            isRupiah={true}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
        </div>

        {/* Today's Sales Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-xl p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Keuntungan Hari Ini</h2>
                <p className="text-gray-600 text-sm">Barang yang terjual hari ini</p>
              </div>
            </div>
            {todaySummary ? (
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {formatRupiah(todaySummary.total_keuntungan)}
                </p>
                <p className="text-sm text-gray-500">
                  {todaySummary.total_transaksi} transaksi • {todaySummary.total_unit_terjual} unit
                </p>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-400">Rp 0</p>
                <p className="text-sm text-gray-400">Belum ada penjualan</p>
              </div>
            )}
          </div>

          {todaySales.length > 0 ? (
            <>
              {/* Today's Sales Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todaySales.map((sale, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {sale.brand} - {sale.nama_produk}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {sale.kemasan} • {sale.warna}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">
                          {formatRupiah(sale.keuntungan)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-gray-500">Jumlah</p>
                        <p className="font-semibold text-gray-900">{sale.jumlah_terjual} unit</p>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-gray-500">Total</p>
                        <p className="font-semibold text-blue-600">{formatRupiah(sale.total_penjualan)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">
                          {new Date(sale.created_at).toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <span className="text-green-600 font-medium">
                          +{((sale.keuntungan / (sale.total_penjualan - sale.keuntungan)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Penjualan Hari Ini</h3>
              <p className="text-gray-500 mb-6">Mulai input transaksi penjualan untuk melihat keuntungan hari ini</p>
            </div>
          )}

          {/* Quick Action */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button 
              onClick={() => window.location.href = '/sales'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Penjualan
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedJenis={selectedJenis}
          setSelectedJenis={setSelectedJenis}
          jenisOptions={jenisOptions}
        />

        {/* Results Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Menampilkan {filteredStocks.length} dari {stocks.length} produk
          </p>
        </div>

        {/* Stock Table */}
        <StockTable 
          stocks={filteredStocks} 
          loading={loading}
          onEdit={() => {}}
          onDelete={() => {}}
          onRestock={() => {}}
        />
      </div>
    </div>
  )
}

export default Dashboard