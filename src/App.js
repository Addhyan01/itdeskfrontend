import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./layout/dashboardLayout"
import Dashboard from "./pages/Dashboard"
import MyTicket from "./pages/MyTicket"
import CreateTicket from "./pages/CreateTicket"
import AdminDashboard from "./pages/AdminDashboard"
import TechnicianPanel from "./pages/TechnicianPanel"
import Login from "./Login/Login"
import Signup from "./Login/Singup"
import Protechted from "./protectedroute/Protechted"
import { AuthProvider } from "./context/AuthContext"
import Profile from "./component/Profile"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"

// Role-based redirect after login
function RoleRedirect() {
  const { user } = useContext(AuthContext)
  if (!user) return null
  if (user.role === "admin") return <Navigate to="/dashboard/admin" replace />
  if (user.role === "technician") return <Navigate to="/dashboard/technician" replace />
  return <Dashboard />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/dashboard" element={<Protechted><DashboardLayout /></Protechted>}>
            <Route index element={<RoleRedirect />} />
            <Route path="tickets" element={<MyTicket />} />
            <Route path="create-ticket" element={<CreateTicket />} />
            <Route path="profile" element={<Profile />} />
            {/* Admin only */}
            <Route path="admin" element={<AdminDashboard />} />
            {/* Technician only */}
            <Route path="technician" element={<TechnicianPanel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
