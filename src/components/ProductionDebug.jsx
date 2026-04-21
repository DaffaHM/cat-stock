import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ProductionDebug = () => {
  const [debugInfo, setDebugInfo] = useState({})
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    // Collect debug info
    const info = {
      mode: import.meta.env.MODE,
      baseUrl: import.meta.env.BASE_URL,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseKeyExists: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      supabaseKeyPreview: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      userAgent: navigator.userAgent,
      currentUrl: window.location.href
    }
    setDebugInfo(info)
  }, [])

  const testConnection = async () => {
    try {
      setTestResult('Testing...')
      
      const { data, error } = await supabase
        .from('stocks')
        .select('count', { count: 'exact', head: true })
      
      if (error) {
        setTestResult(`Error: ${error.message}`)
      } else {
        setTestResult(`Success! Found ${data} records`)
      }
    } catch (err) {
      setTestResult(`Exception: ${err.message}`)
    }
  }

  // Only show in development or when explicitly enabled
  if (import.meta.env.PROD && !window.location.search.includes('debug=true')) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">🔧 Debug Info</h3>
      <div className="space-y-1">
        <div>Mode: {debugInfo.mode}</div>
        <div>URL: {debugInfo.currentUrl}</div>
        <div>Supabase URL: {debugInfo.supabaseUrl || 'Missing'}</div>
        <div>Supabase Key: {debugInfo.supabaseKeyExists ? debugInfo.supabaseKeyPreview : 'Missing'}</div>
        <div>Base URL: {debugInfo.baseUrl}</div>
      </div>
      
      <button 
        onClick={testConnection}
        className="mt-2 px-2 py-1 bg-blue-600 rounded text-xs"
      >
        Test DB Connection
      </button>
      
      {testResult && (
        <div className="mt-2 p-2 bg-gray-800 rounded">
          Result: {testResult}
        </div>
      )}
    </div>
  )
}

export default ProductionDebug