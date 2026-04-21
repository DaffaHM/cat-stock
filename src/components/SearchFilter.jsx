const SearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedJenis, 
  setSelectedJenis, 
  jenisOptions 
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Search Input */}
      <div className="flex-1">
        <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-3">
          Cari Produk
        </label>
        <input
          type="text"
          id="search"
          placeholder="Cari berdasarkan brand, nama produk, atau warna..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
        />
      </div>

      {/* Filter by Jenis Produk */}
      <div className="lg:w-80">
        <label htmlFor="jenis" className="block text-sm font-semibold text-gray-700 mb-3">
          Filter Kategori
        </label>
        <select
          id="jenis"
          value={selectedJenis}
          onChange={(e) => setSelectedJenis(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
        >
          <option value="">Semua Kategori</option>
          {jenisOptions.map((jenis) => (
            <option key={jenis} value={jenis}>
              {jenis}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default SearchFilter