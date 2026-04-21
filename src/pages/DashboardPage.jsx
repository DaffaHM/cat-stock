import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { formatRupiah } from '../utils/formatCurrency'
import SummaryCard from '../components/SummaryCard'

const DashboardPage = () => {
  const [stocks, setStocks] = useState([])
  const [todaySales, setTodaySales] = useState([])
  const [todaySummary, setTodaySummary] = useState(null)
  const [loading, setLoading] = useState(true)

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

      if (error) throw error
      setStocks(data || [])
    } catch (error) {
      console.error('Error fetching stocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTodaySales = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      console.log('📊 DashboardPage: Fetching today sales for:', today)
      
      // Fetch today's sales directly from sales table with stock info
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          stocks (
            brand,
            nama_produk,
            warna,
            kode_warna,
            kemasan
          )
        `)
        .eq('tanggal_jual', today)
        .order('created_at', { ascending: false })

      console.log('🛒 DashboardPage sales data:', { salesData, salesError })

      if (salesError) {
        console.error('❌ Error fetching today sales:', salesError)
        setTodaySales([])
        setTodaySummary(null)
      } else {
        setTodaySales(salesData || [])
        
        // Calculate summary from sales data
        if (salesData && salesData.length > 0) {
          let totalPenjualan = 0
          let totalKeuntungan = 0
          let totalTransaksi = salesData.length
          let totalUnit = 0
          
          salesData.forEach(sale => {
            const saleTotal = sale.jumlah_terjual * sale.harga_jual_saat_itu
            const saleProfit = sale.jumlah_terjual * (sale.harga_jual_saat_itu - sale.harga_beli_saat_itu)
            
            totalPenjualan += saleTotal
            totalKeuntungan += saleProfit
            totalUnit += sale.jumlah_terjual
          })
          
          const calculatedSummary = {
            tanggal_jual: today,
            total_penjualan: totalPenjualan,
            total_keuntungan: totalKeuntungan,
            jumlah_transaksi: totalTransaksi,
            total_unit_terjual: totalUnit
          }
          
          console.log('📈 DashboardPage calculated summary:', calculatedSummary)
          setTodaySummary(calculatedSummary)
        } else {
          console.log('📭 No sales data found for today')
          setTodaySummary(null)
        }
      }
    } catch (error) {
      console.error('💥 Error fetching today sales:', error)
      setTodaySales([])
      setTodaySummary(null)
    }
  }

  // Hitung ringkasan data
  const summary = useMemo(() => {
    const totalStok = stocks.reduce((sum, stock) => sum + stock.stok, 0)
    const totalModal = stocks.reduce((sum, stock) => sum + (stock.stok * stock.harga_beli), 0)
    const totalNilaiJual = stocks.reduce((sum, stock) => sum + (stock.stok * stock.harga_jual), 0)
    const totalPotensiLaba = totalNilaiJual - totalModal

    return {
      totalStok,
      totalModal,
      totalNilaiJual,
      totalPotensiLaba
    }
  }, [stocks])

  // Produk dengan stok menipis (< 10)
  const lowStockProducts = useMemo(() => {
    return stocks.filter(stock => stock.stok < 10).length
  }, [stocks])

  // Produk dengan laba tertinggi
  const topProfitProducts = useMemo(() => {
    return stocks
      .map(stock => ({
        ...stock,
        totalProfit: stock.stok * (stock.harga_jual - stock.harga_beli)
      }))
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, 5)
  }, [stocks])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Ringkasan bisnis stok cat Anda</p>
      </div>

      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
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
          {todaySummary && todaySummary.jumlah_transaksi > 0 ? (
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {formatRupiah(todaySummary.total_keuntungan)}
              </p>
              <p className="text-sm text-gray-500">
                {todaySummary.jumlah_transaksi} transaksi • {todaySummary.total_unit_terjual} unit
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
                        {sale.stocks?.brand} - {sale.stocks?.nama_produk}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {sale.stocks?.kemasan} • {sale.stocks?.warna}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        {formatRupiah(sale.jumlah_terjual * (sale.harga_jual_saat_itu - sale.harga_beli_saat_itu))}
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
                      <p className="font-semibold text-blue-600">{formatRupiah(sale.jumlah_terjual * sale.harga_jual_saat_itu)}</p>
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

      {/* Quick Stats - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Alert Stok Menipis */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200">
          <div className="flex items-center mb-3 md:mb-4">
            <div className="bg-red-100 rounded-full p-2 md:p-3 mr-3 md:mr-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Stok Menipis</h3>
              <p className="text-xs md:text-sm text-gray-600">Produk dengan stok &lt; 10</p>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-red-600">{lowStockProducts} Produk</p>
        </div>

        {/* Total Produk */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200">
          <div className="flex items-center mb-3 md:mb-4">
            <div className="bg-blue-100 rounded-full p-2 md:p-3 mr-3 md:mr-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Total Produk</h3>
              <p className="text-xs md:text-sm text-gray-600">Jumlah varian produk</p>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">{stocks.length} Varian</p>
        </div>
      </div>

      {/* Top Profit Products - Responsive Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Top 5 Produk dengan Laba Tertinggi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Warna</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Laba</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProfitProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                    {product.brand}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                    {product.nama_produk}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                    {product.warna}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                    {product.stok}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-semibold text-green-600">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(product.totalProfit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage