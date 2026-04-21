// Utility functions untuk autentikasi sederhana

export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true'
}

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export const logout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

export const login = (email, password) => {
  // Kredensial admin sederhana
  const ADMIN_CREDENTIALS = {
    email: 'admin@stockdashboard.com',
    password: 'StockAdmin2024!'
  }

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify({
      email: 'admin@stockdashboard.com',
      role: 'admin',
      loginTime: new Date().toISOString()
    }))
    return true
  }
  
  return false
}