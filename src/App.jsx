import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import StockManagementPage from './pages/StockManagementPage'
import AddProductPage from './pages/AddProductPage'
import EditProductPage from './pages/EditProductPage'
import RestockPage from './pages/RestockPage'
import DeleteProductPage from './pages/DeleteProductPage'
import SalesPage from './pages/SalesPage'
import ReportsPage from './pages/ReportsPage'
import PanduanPage from './pages/PanduanPage'
import { isLoggedIn } from './utils/auth'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on app load
    setAuthenticated(isLoggedIn())
    setLoading(false)
  }, [])

  const handleLogin = () => {
    setAuthenticated(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/login" 
          element={
            authenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } 
        />
        
        {/* Protected Routes with Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/stock-management" element={
          <ProtectedRoute>
            <Layout>
              <StockManagementPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/add-product" element={
          <ProtectedRoute>
            <Layout>
              <AddProductPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/edit-product/:id" element={
          <ProtectedRoute>
            <Layout>
              <EditProductPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/restock/:id" element={
          <ProtectedRoute>
            <Layout>
              <RestockPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/delete-product/:id" element={
          <ProtectedRoute>
            <Layout>
              <DeleteProductPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/sales" element={
          <ProtectedRoute>
            <Layout>
              <SalesPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <Layout>
              <ReportsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/panduan" element={
          <ProtectedRoute>
            <Layout>
              <PanduanPage />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App