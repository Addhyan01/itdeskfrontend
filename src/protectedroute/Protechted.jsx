import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Protechted = ({ children }) => {
  const {  loading } = useContext(AuthContext)
  const token = localStorage.getItem("token")

  // No token → login
  if (!token) return <Navigate to="/login" replace />

  // Token hai, user load ho raha hai → spinner
  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #e5e7eb", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }}></div>
        <p style={{ color: "#666" }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )

  // User loaded → show page
  return children
}

export default Protechted
