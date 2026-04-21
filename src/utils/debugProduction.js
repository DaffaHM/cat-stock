// Debug utility untuk production deployment
export const debugProduction = () => {
  console.log('🚀 Production Debug Info:')
  console.log('Environment:', import.meta.env.MODE)
  console.log('Base URL:', import.meta.env.BASE_URL)
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing')
  console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
  console.log('All env vars:', import.meta.env)
  
  // Test if we can reach Supabase
  if (import.meta.env.VITE_SUPABASE_URL) {
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    })
    .then(response => {
      console.log('🌐 Supabase connectivity test:', response.status)
      if (response.status === 200) {
        console.log('✅ Supabase is reachable')
      } else {
        console.log('❌ Supabase connection issue:', response.statusText)
      }
    })
    .catch(error => {
      console.error('❌ Supabase connectivity error:', error)
    })
  }
}