import { formatRupiah } from '../utils/formatCurrency'

const StockTable = ({ stocks, loading, onEdit, onRestock, onDelete }) => {
  // Debug logging
  console.log('🏪 StockTable render:', { 
    stocksLength: stocks?.length || 0, 
    loading, 
    stocksType: typeof stocks,
    stocks: stocks 
  })
  
  // Fallback handlers to prevent errors
  const handleEdit = onEdit || ((stock) => console.log('Edit clicked:', stock))
  const handleRestock = onRestock || ((stock) => console.log('Restock clicked:', stock))
  const handleDelete = onDelete || ((stock) => console.log('Delete clicked:', stock))
  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (stocks.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Data Stok</h3>
        <p className="text-gray-500 mb-6">Tambahkan produk baru untuk memulai manajemen stok</p>
        <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Produk Pertama
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Warna
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Harga Beli
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Harga Jual
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stocks.map((stock) => {
                const profit = stock.harga_jual - stock.harga_beli
                const profitPercentage = ((profit / stock.harga_beli) * 100).toFixed(1)
                const isLowStock = stock.stok < 10
                const isOutOfStock = stock.stok === 0
                
                return (
                  <tr key={stock.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold text-sm">
                          {stock.brand.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{stock.brand}</div>
                          <div className="text-sm text-gray-500">{stock.nama_produk}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{stock.jenis_produk}</div>
                        <div className="text-sm text-gray-500">{stock.kemasan}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {stock.warna}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          isOutOfStock 
                            ? 'bg-red-100 text-red-800' 
                            : isLowStock 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {stock.stok}
                          {isLowStock && !isOutOfStock && (
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium text-gray-900">{formatRupiah(stock.harga_beli)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium text-gray-900">{formatRupiah(stock.harga_jual)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-semibold text-emerald-600">{formatRupiah(profit)}</div>
                      <div className="text-xs text-gray-500">{profitPercentage}%</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(stock)}
                          className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Produk"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {/* Restock Button */}
                        <button
                          onClick={() => handleRestock(stock)}
                          className="inline-flex items-center p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                          title="Tambah Stok"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(stock)}
                          className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Produk"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {stocks.map((stock) => {
          const profit = stock.harga_jual - stock.harga_beli
          const profitPercentage = ((profit / stock.harga_beli) * 100).toFixed(1)
          const isLowStock = stock.stok < 10
          const isOutOfStock = stock.stok === 0
          
          return (
            <div key={stock.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold">
                    {stock.brand.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{stock.brand} - {stock.nama_produk}</h3>
                    <p className="text-sm text-gray-500">{stock.jenis_produk} • {stock.kemasan}</p>
                  </div>
                </div>
                
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  isOutOfStock 
                    ? 'bg-red-100 text-red-800' 
                    : isLowStock 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {stock.stok}
                  {isLowStock && !isOutOfStock && (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </span>
              </div>

              {/* Warna */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {stock.warna}
                </span>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Harga Beli</div>
                  <div className="font-semibold text-gray-900">{formatRupiah(stock.harga_beli)}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Harga Jual</div>
                  <div className="font-semibold text-gray-900">{formatRupiah(stock.harga_jual)}</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 col-span-2">
                  <div className="text-xs text-emerald-600 mb-1">Margin Keuntungan</div>
                  <div className="font-semibold text-emerald-700">
                    {formatRupiah(profit)} ({profitPercentage}%)
                  </div>
                </div>
              </div>
              
              {/* Action Buttons - Mobile */}
              <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(stock)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                
                <button
                  onClick={() => handleRestock(stock)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Restock
                </button>
                
                <button
                  onClick={() => handleDelete(stock)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default StockTable