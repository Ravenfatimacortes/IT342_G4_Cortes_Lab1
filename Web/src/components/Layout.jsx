import React from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'

export default function Layout({ children }) {
  const isLoggedIn = isAuthenticated()
  return (
    <div className="layout">
      <header className="header">
        <div className="brand">User Auth System</div>
        <nav>
          <Link to="/">Home</Link>
          {!isLoggedIn && <Link to="/register">Register</Link>}
          {!isLoggedIn && <Link to="/login">Login</Link>}
          {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
        </nav>
      </header>
      <main className="main-content">{children}</main>
    </div>
  )
}
