import { formatRupiah } from '../utils/formatCurrency'

const SummaryCard = ({ title, value, isRupiah = false, bgColor = 'bg-white', textColor = 'text-gray-900' }) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-4 md:p-6 border border-gray-200`}>
      <h3 className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </h3>
      <p className={`mt-2 text-xl md:text-3xl font-bold ${textColor} break-words`}>
        {isRupiah ? formatRupiah(value) : value.toLocaleString('id-ID')}
      </p>
    </div>
  )
}

export default SummaryCard