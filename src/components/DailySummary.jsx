import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { formatRupiah } from '../utils/formatCurrency'

const DailySummary = ({ refreshTrigger }) => {
  const [todaySummary, setTodaySummary] = useState(null)
  const [weekSummary, setWeekSummary] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [todayDetails, setTodayDetails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummaryData()
  }, [refreshTrigger])

  const fetchSummaryData = async () => {
    try {
      setLoading(true)
      console.log('📊 Fetching daily summary data...')
      
      const today = new Date().toISOString().split('T')[0]
      console.log('📅 Today date:', today)
      
      // Fetch today's sales directly from sales table with stock info
      const { data: todaySalesData, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          stocks (
            brand,
            nama_produk,
            warna,
            kode_warna
          )
        `)
        .eq('tanggal_jual', today)
        .order('created_at', { ascending: false })

      console.log('🛒 Today sales data:', { todaySalesData, salesError })

      if (salesError) {
        console.error('❌ Error fetching today sales:', salesError)
        throw salesError
      }

      // Calculate today's summary from sales data
      let todayTotal = 0
      let todayProfit = 0
      let todayTransactions = 0

      if (todaySalesData && todaySalesData.length > 0) {
        todaySalesData.forEach(sale => {
          const saleTotal = sale.jumlah_terjual * sale.harga_jual_saat_itu
          const saleProfit = sale.jumlah_terjual * (sale.harga_jual_saat_itu - sale.harga_beli_saat_itu)
          
          todayTotal += saleTotal
          todayProfit += saleProfit
          todayTransactions += 1
        })
      }

      const calculatedTodaySummary = {
        tanggal_jual: today,
        total_penjualan: todayTotal,
        total_keuntungan: todayProfit,
        jumlah_transaksi: todayTransactions
      }

      console.log('📈 Calculated today summary:', calculatedTodaySummary)
      setTodaySummary(calculatedTodaySummary)
      setTodayDetails(todaySalesData || [])

      // Fetch week summary (last 7 days)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      
      const { data: weekSalesData, error: weekError } = await supabase
        .from('sales')
        .select('tanggal_jual, jumlah_terjual, harga_jual_saat_itu, harga_beli_saat_itu')
        .gte('tanggal_jual', weekAgo.toISOString().split('T')[0])
        .order('tanggal_jual', { ascending: false })

      if (weekError) {
        console.error('❌ Error fetching week sales:', weekError)
      } else {
        // Group by date and calculate daily totals
        const weeklyData = {}
        weekSalesData?.forEach(sale => {
          const date = sale.tanggal_jual
          if (!weeklyData[date]) {
            weeklyData[date] = {
              tanggal_jual: date,
              total_penjualan: 0,
              total_keuntungan: 0,
              jumlah_transaksi: 0
            }
          }
          
          const saleTotal = sale.jumlah_terjual * sale.harga_jual_saat_itu
          const saleProfit = sale.jumlah_terjual * (sale.harga_jual_saat_itu - sale.harga_beli_saat_itu)
          
          weeklyData[date].total_penjualan += saleTotal
          weeklyData[date].total_keuntungan += saleProfit
          weeklyData[date].jumlah_transaksi += 1
        })
        
        setWeekSummary(Object.values(weeklyData))
      }

      // Calculate top products from today's sales
      const productSummary = {}
      todaySalesData?.forEach(sale => {
        const productKey = `${sale.stocks?.brand} - ${sale.stocks?.nama_produk}`
        if (!productSummary[productKey]) {
          productSummary[productKey] = {
            brand: sale.stocks?.brand || 'Unknown',
            nama_produk: sale.stocks?.nama_produk || 'Unknown',
            warna: sale.stocks?.warna || '',
            total_terjual: 0,
            total_penjualan: 0,
            keuntungan: 0
          }
        }
        
        productSummary[productKey].total_terjual += sale.jumlah_terjual
        productSummary[productKey].total_penjualan += sale.jumlah_terjual * sale.harga_jual_saat_itu
        productSummary[productKey].keuntungan += sale.jumlah_terjual * (sale.harga_jual_saat_itu - sale.harga_beli_saat_itu)
      })
      
      const topProductsArray = Object.values(productSummary)
        .sort((a, b) => b.keuntungan - a.keuntungan)
        .slice(0, 5)
      
      setTopProducts(topProductsArray)
      console.log('🏆 Top products:', topProductsArray)

    } catch (error) {
      console.error('💥 Error fetching summary data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">📊</span>
          Ringkasan Hari Ini
        </h2>
        
        {todaySummary && todaySummary.jumlah_transaksi > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{todaySummary.jumlah_transaksi}</p>
              <p className="text-sm text-gray-600">Transaksi</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {todayDetails.reduce((sum, sale) => sum + sale.jumlah_terjual, 0)}
              </p>
              <p className="text-sm text-gray-600">Unit Terjual</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-lg font-bold text-green-600">{formatRupiah(todaySummary.total_penjualan)}</p>
              <p className="text-sm text-gray-600">Total Penjualan</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-lg font-bold text-yellow-600">{formatRupiah(todaySummary.total_keuntungan)}</p>
              <p className="text-sm text-gray-600">Keuntungan</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500">Belum ada penjualan hari ini</p>
            <p className="text-sm text-gray-400 mt-1">Mulai input transaksi penjualan untuk melihat ringkasan</p>
          </div>
        )}
      </div>

      {/* Week Summary Chart */}
      {weekSummary.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">📈</span>
            Tren 7 Hari Terakhir
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Tanggal</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Transaksi</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Unit</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Penjualan</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Keuntungan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {weekSummary.map((day) => (
                  <tr key={day.tanggal_jual} className="hover:bg-gray-50">
                    <td className="py-3 text-sm text-gray-900">
                      {new Date(day.tanggal_jual).toLocaleDateString('id-ID', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </td>
                    <td className="py-3 text-sm text-gray-900 text-right">{day.total_transaksi}</td>
                    <td className="py-3 text-sm text-gray-900 text-right">{day.total_unit_terjual}</td>
                    <td className="py-3 text-sm text-blue-600 text-right font-medium">
                      {formatRupiah(day.total_penjualan)}
                    </td>
                    <td className="py-3 text-sm text-green-600 text-right font-medium">
                      {formatRupiah(day.total_keuntungan)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Week Totals */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-blue-600">
                  {weekSummary.reduce((sum, day) => sum + day.total_transaksi, 0)}
                </p>
                <p className="text-xs text-gray-600">Total Transaksi</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">
                  {weekSummary.reduce((sum, day) => sum + day.total_unit_terjual, 0)}
                </p>
                <p className="text-xs text-gray-600">Total Unit</p>
              </div>
              <div>
                <p className="text-sm font-bold text-green-600">
                  {formatRupiah(weekSummary.reduce((sum, day) => sum + day.total_penjualan, 0))}
                </p>
                <p className="text-xs text-gray-600">Total Penjualan</p>
              </div>
              <div>
                <p className="text-sm font-bold text-yellow-600">
                  {formatRupiah(weekSummary.reduce((sum, day) => sum + day.total_keuntungan, 0))}
                </p>
                <p className="text-xs text-gray-600">Total Keuntungan</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Today's Sales Details */}
      {todayDetails.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">📋</span>
            Detail Penjualan Hari Ini
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Produk</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-600">Kemasan</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-600">Jumlah</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-600">Harga Satuan</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-600">Keuntungan</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-600">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {todayDetails.map((detail, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">
                          {detail.brand} - {detail.nama_produk}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {detail.warna}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-900 text-center">
                      {detail.kemasan}
                    </td>
                    <td className="py-4 text-sm text-gray-900 text-center font-medium">
                      {detail.jumlah_terjual}
                    </td>
                    <td className="py-4 text-sm text-blue-600 text-right">
                      {formatRupiah(detail.harga_jual)}
                    </td>
                    <td className="py-4 text-sm text-blue-600 text-right font-medium">
                      {formatRupiah(detail.total_penjualan)}
                    </td>
                    <td className="py-4 text-sm text-right">
                      <span className={`font-medium ${detail.keuntungan >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatRupiah(detail.keuntungan)}
                      </span>
                      <p className="text-xs text-gray-500">
                        {detail.keuntungan >= 0 ? '+' : ''}{((detail.keuntungan / (detail.total_penjualan - detail.keuntungan)) * 100).toFixed(1)}%
                      </p>
                    </td>
                    <td className="py-4 text-sm text-gray-500 text-center">
                      {new Date(detail.created_at).toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Summary Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-lg font-bold text-blue-600">
                  {todayDetails.length}
                </p>
                <p className="text-xs text-gray-600">Item Terjual</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-lg font-bold text-purple-600">
                  {todayDetails.reduce((sum, item) => sum + item.jumlah_terjual, 0)}
                </p>
                <p className="text-xs text-gray-600">Total Unit</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm font-bold text-green-600">
                  {formatRupiah(todayDetails.reduce((sum, item) => sum + item.total_penjualan, 0))}
                </p>
                <p className="text-xs text-gray-600">Total Penjualan</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-sm font-bold text-yellow-600">
                  {formatRupiah(todayDetails.reduce((sum, item) => sum + item.keuntungan, 0))}
                </p>
                <p className="text-xs text-gray-600">Total Keuntungan</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Products Today */}
      {topProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">🏆</span>
            Produk Terlaris Hari Ini
          </h2>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {product.brand} - {product.nama_produk}
                    </p>
                    <p className="text-sm text-gray-600">
                      {product.kemasan} - {product.warna}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {formatRupiah(product.keuntungan)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {product.jumlah_terjual} unit
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">⚡</span>
          Aksi Cepat
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
          
          <button 
            onClick={() => {
              const today = new Date().toISOString().split('T')[0]
              const csvContent = weekSummary.map(day => 
                `${day.tanggal_jual},${day.total_transaksi},${day.total_unit_terjual},${day.total_penjualan},${day.total_keuntungan}`
              ).join('\n')
              
              const blob = new Blob([`Tanggal,Transaksi,Unit,Penjualan,Keuntungan\n${csvContent}`], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `laporan-penjualan-${today}.csv`
              a.click()
            }}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}

export default DailySummary