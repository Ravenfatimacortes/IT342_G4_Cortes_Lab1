import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<div className="welcome"><h1>Welcome</h1><p>This is a simple, secure User Authentication System.</p></div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
      </Routes>
    </Layout>
  )
}
