import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./layout/dashboardLayout"
import Dashboard from "./pages/Dashboard"
import MyTicket from "./pages/MyTicket"
import CreateTicket from "./pages/CreateTicket"
import AdminDashboard from "./pages/AdminDashboard"
import AdminUsers from "./pages/AdminUsers"
import AdminTechnicians from "./pages/AdminTechnicians"
import TechnicianPanel from "./pages/TechnicianPanel"
import Login from "./Login/Login"
import Protechted from "./protectedroute/Protechted"
import { AuthProvider } from "./context/AuthContext"
import Profile from "./component/Profile"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"

function AuthLoader() {
  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #e5e7eb", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }}></div>
        <p style={{ color: "#666", fontSize: 14 }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// Index route → role based redirect
function RoleRedirect() {
  const { user, loading } = useContext(AuthContext)
  if (loading) return <AuthLoader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role === "admin") return <Navigate to="/dashboard/admin" replace />
  if (user.role === "technician") return <Navigate to="/dashboard/technician" replace />
  return <Navigate to="/dashboard/home" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/dashboard" element={<Protechted><DashboardLayout /></Protechted>}>
            <Route index element={<RoleRedirect />} />

            {/* ── Shared Dashboard (role aware) ── */}
            <Route path="home" element={<Dashboard />} />
            <Route path="admin" element={<Dashboard />} />
            <Route path="technician" element={<Dashboard />} />

            {/* ── User ── */}
            <Route path="tickets" element={<MyTicket />} />
            <Route path="create-ticket" element={<CreateTicket />} />
            <Route path="profile" element={<Profile />} />

            {/* ── Admin ── */}
            <Route path="all-tickets" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="technicians" element={<AdminTechnicians />} />

            {/* ── Technician ── */}
            <Route path="technician-tickets" element={<TechnicianPanel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
