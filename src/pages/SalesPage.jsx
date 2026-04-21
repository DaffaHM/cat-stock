import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ShoppingCart, History, BarChart3, TrendingUp, Zap } from 'lucide-react'
import SalesForm from '../components/SalesForm'
import SalesHistory from '../components/SalesHistory'
import DailySummary from '../components/DailySummary'

const SalesPage = () => {
  const [activeTab, setActiveTab] = useState('input')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const tabs = [
    { 
      id: 'input', 
      name: 'Input Penjualan', 
      icon: ShoppingCart,
      color: 'blue',
      description: 'Catat transaksi baru'
    },
    { 
      id: 'history', 
      name: 'Riwayat Penjualan', 
      icon: History,
      color: 'purple',
      description: 'Lihat semua transaksi'
    },
    { 
      id: 'summary', 
      name: 'Dashboard Profit', 
      icon: BarChart3,
      color: 'green',
      description: 'Analisis keuntungan'
    }
  ]

  const handleSaleSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    // Switch to summary tab after successful sale
    setActiveTab('summary')
  }

  return (
    <div className="max-w-full space-y-10">
      {/* Modern Header with Solid Color */}
      <div className="relative overflow-hidden bg-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-3">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Sales Management</h1>
              <p className="text-blue-100 text-base opacity-90">Kelola transaksi penjualan dan tracking keuntungan real-time</p>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400 bg-opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="flex flex-col md:flex-row md:justify-center md:items-stretch gap-6 md:gap-8 lg:gap-16">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-105 border
                flex-1 md:max-w-sm mx-2 md:mx-0
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg border-blue-600' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg border-gray-200 hover:border-blue-300'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  rounded-xl p-3 transition-colors duration-300
                  ${isActive 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'bg-blue-100 group-hover:bg-blue-200'
                  }
                `}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg mb-1 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {tab.name}
                  </h3>
                  <p className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                    {tab.description}
                  </p>
                </div>
              </div>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white bg-opacity-5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          )
        })}
      </div>

      {/* Tab Content with Animation */}
      <div className="min-h-[600px]">
        <div className="transform transition-all duration-300 ease-in-out">
          {activeTab === 'input' && (
            <div className="animate-fadeIn">
              <SalesForm onSaleSuccess={handleSaleSuccess} />
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="animate-fadeIn">
              <SalesHistory refreshTrigger={refreshTrigger} />
            </div>
          )}
          
          {activeTab === 'summary' && (
            <div className="animate-fadeIn">
              <DailySummary refreshTrigger={refreshTrigger} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SalesPage