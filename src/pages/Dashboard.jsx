import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { getDashboardStats, getMyTickets } from "../services/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTicket, faClock, faCircleCheck, faStopwatch, faBusinessTime } from "@fortawesome/free-solid-svg-icons"
import "../styles/dashboard.scss"

const statusColor = { Pending: "#6b7280", "In Process": "#f59e0b", Working: "#8b5cf6", Resolved: "#10b981", Closed: "#374151" }
const priorityColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", Critical: "#7c3aed" }

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [recentTickets, setRecentTickets] = useState([])
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === "admin"
  const isTechnician = user?.role === "technician"
  const isUser = user?.role === "user"

  useEffect(() => {
    const load = async () => {
      try {
        if (isAdmin || isTechnician) {
          const data = await getDashboardStats()
          setStats(data.stats || {})
          setRecentTickets(data.recentTickets || [])
        } else {
          const tickets = await getMyTickets()
          const arr = Array.isArray(tickets) ? tickets : []
          setRecentTickets(arr.slice(0, 5))
          setStats({
            total: arr.length,
            pending: arr.filter(t => t.status === "Pending").length,
            inProcess: arr.filter(t => t.status === "In Process").length,
            working: arr.filter(t => t.status === "Working").length,
            resolved: arr.filter(t => t.status === "Resolved").length,
            closed: arr.filter(t => t.status === "Closed").length,
          })
        }
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    if (user) load()
  }, [user])

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return "Good Morning"
    if (h < 17) return "Good Afternoon"
    return "Good Evening"
  }

  // Admin stat cards
  const adminCards = [
    { label: "Total Tickets", val: stats?.total ?? 0, icon: faTicket, color: "#8b5cf6", bg: "#ede9fe" },
    { label: "Pending", val: stats?.pending ?? 0, icon: faClock, color: "#f59e0b", bg: "#fef9c3" },
    { label: "In Process", val: stats?.inProcess ?? 0, icon: faStopwatch, color: "#3b82f6", bg: "#dbeafe" },
    { label: "Working", val: stats?.working ?? 0, icon: faBusinessTime, color: "#8b5cf6", bg: "#ede9fe" },
    { label: "Resolved", val: stats?.resolved ?? 0, icon: faCircleCheck, color: "#10b981", bg: "#dcfce7" },
    { label: "Overdue", val: stats?.overdue ?? 0, icon: faBusinessTime, color: "#ef4444", bg: "#fee2e2" },
  ]

  // Technician stat cards
  const techCards = [
    { label: "Assigned", val: stats?.assigned ?? 0, icon: faTicket, color: "#f59e0b", bg: "#fef9c3" },
    { label: "Working", val: stats?.working ?? 0, icon: faStopwatch, color: "#8b5cf6", bg: "#ede9fe" },
    { label: "Resolved", val: stats?.resolved ?? 0, icon: faCircleCheck, color: "#10b981", bg: "#dcfce7" },
    { label: "Total", val: stats?.total ?? 0, icon: faBusinessTime, color: "#3b82f6", bg: "#dbeafe" },
  ]

  // User stat cards
  const userCards = [
    { label: "My Tickets", val: stats?.total ?? 0, icon: faTicket, color: "#8b5cf6", bg: "#ede9fe" },
    { label: "Pending", val: stats?.pending ?? 0, icon: faClock, color: "#f59e0b", bg: "#fef9c3" },
    { label: "In Process", val: (stats?.inProcess ?? 0) + (stats?.working ?? 0), icon: faStopwatch, color: "#3b82f6", bg: "#dbeafe" },
    { label: "Resolved", val: stats?.resolved ?? 0, icon: faCircleCheck, color: "#10b981", bg: "#dcfce7" },
  ]

  const statCards = isAdmin ? adminCards : isTechnician ? techCards : userCards

  return (
    <div className="dashboard">
      <div className="dashboard-container">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>{getGreeting()}, {user?.name} 👋</h1>
            <p style={{ color: "#666", marginTop: 4 }}>
              {isAdmin ? "Here's your IT Help Desk overview" :
               isTechnician ? "Here are your assigned tickets overview" :
               "Here are your support tickets"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: isAdmin ? "#dbeafe" : isTechnician ? "#fef9c3" : "#dcfce7",
              color: isAdmin ? "#1d4ed8" : isTechnician ? "#a16207" : "#166534"
            }}>
              {isAdmin ? "👑 Admin" : isTechnician ? "🔧 Technician" : "👤 User"}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#999" }}>Loading stats...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
            {statCards.map(card => (
              <div key={card.label} style={{
                background: "#fff", borderRadius: 14, padding: "20px",
                border: `1px solid ${card.color}33`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, color: "#666" }}>{card.label}</p>
                    <h2 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, color: card.color }}>{card.val}</h2>
                  </div>
                  <div style={{ background: card.bg, borderRadius: 10, padding: "10px", color: card.color }}>
                    <FontAwesomeIcon icon={card.icon} style={{ fontSize: 18 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

          {/* Recent Tickets */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
              <h4 style={{ margin: 0 }}>Recent Tickets</h4>
              <span style={{ fontSize: 13, color: "#3b82f6" }}>{recentTickets.length} tickets</span>
            </div>
            {recentTickets.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#999" }}>
                <p style={{ fontSize: 32 }}>🎫</p>
                <p>No tickets yet</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f9fafb" }}>
                  <tr>
                    {["Ticket ID", "Title", isAdmin ? "For User" : "Category", "Priority", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, color: "#666", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map(ticket => (
                    <tr key={ticket._id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: "#666" }}>{ticket.ticketId}</td>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500, maxWidth: 180 }}>{ticket.title}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#666" }}>
                        {isAdmin ? (ticket.reportedFor?.name || ticket.createdBy?.name) : ticket.category}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: priorityColor[ticket.priority] + "22", color: priorityColor[ticket.priority] }}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: statusColor[ticket.status] + "22", color: statusColor[ticket.status] }}>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Right Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Admin - Technician Status */}
            {isAdmin && stats?.technicians && (
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 20 }}>
                <h4 style={{ margin: "0 0 16px" }}>👥 Technician Status</h4>
                {stats.technicians.length === 0 ? (
                  <p style={{ color: "#999", fontSize: 13 }}>No technicians found</p>
                ) : stats.technicians.map(tech => (
                  <div key={tech._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                        {tech.profilePicture ? <img src={tech.profilePicture} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} /> : "👤"}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{tech.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#999" }}>{tech.email}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 12, background: tech.activeTickets > 0 ? "#fef9c3" : "#dcfce7", color: tech.activeTickets > 0 ? "#a16207" : "#166534", padding: "2px 8px", borderRadius: 12, fontWeight: 600 }}>
                        {tech.activeTickets} active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 20 }}>
              <h4 style={{ margin: "0 0 14px" }}>⚡ Quick Actions</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {isUser && (
                  <a href="/dashboard/create-ticket" style={{ padding: "10px 16px", background: "#3b82f6", color: "#fff", borderRadius: 8, textDecoration: "none", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                    + Create New Ticket
                  </a>
                )}
                {isAdmin && (<>
                  <a href="/dashboard/admin" style={{ padding: "10px 16px", background: "#3b82f6", color: "#fff", borderRadius: 8, textDecoration: "none", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                    📋 View All Tickets
                  </a>
                  <a href="/dashboard/users" style={{ padding: "10px 16px", background: "#f0fdf4", color: "#166534", borderRadius: 8, textDecoration: "none", textAlign: "center", fontWeight: 600, fontSize: 14, border: "1px solid #bbf7d0" }}>
                    👥 Manage Users
                  </a>
                  <a href="/dashboard/create-ticket" style={{ padding: "10px 16px", background: "#fef9c3", color: "#a16207", borderRadius: 8, textDecoration: "none", textAlign: "center", fontWeight: 600, fontSize: 14, border: "1px solid #fde68a" }}>
                    + Create Ticket for User
                  </a>
                </>)}
                {isTechnician && (<>
                  <a href="/dashboard/technician" style={{ padding: "10px 16px", background: "#3b82f6", color: "#fff", borderRadius: 8, textDecoration: "none", textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                    🔧 My Assigned Tickets
                  </a>
                  <a href="/dashboard/create-ticket" style={{ padding: "10px 16px", background: "#f0fdf4", color: "#166534", borderRadius: 8, textDecoration: "none", textAlign: "center", fontWeight: 600, fontSize: 14, border: "1px solid #bbf7d0" }}>
                    + Create Ticket for User
                  </a>
                </>)}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
