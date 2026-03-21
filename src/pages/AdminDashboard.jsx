import React, { useEffect, useState } from "react"
import { getAllTickets, assignTicket, getAllTechnicians, getDashboardStats } from "../services/api"
import { toast } from "react-toastify"

const statusColor = { Open: "#3b82f6", Assigned: "#f59e0b", "In Progress": "#8b5cf6", Resolved: "#10b981", Closed: "#6b7280" }
const priorityColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", Critical: "#7c3aed" }

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(null)
  const [selectedTech, setSelectedTech] = useState({})
  const [filterStatus, setFilterStatus] = useState("")

  const loadData = async () => {
    try {
      const [ticketData, techData, statsData] = await Promise.all([
        getAllTickets(filterStatus ? { status: filterStatus } : {}),
        getAllTechnicians(),
        getDashboardStats()
      ])
      setTickets(ticketData.tickets || [])
      setTechnicians(Array.isArray(techData) ? techData : [])
      setStats(statsData.stats || null)
    } catch { toast.error("Failed to load data") }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [filterStatus])

  const handleAssign = async (ticketId) => {
    const techId = selectedTech[ticketId]
    if (!techId) { toast.warn("Please select a technician"); return }
    setAssigning(ticketId)
    try {
      const res = await assignTicket(ticketId, techId)
      if (res.ticket) {
        toast.success("Ticket assigned! Email sent.")
        loadData()
      } else toast.error(res.message || "Assignment failed")
    } catch { toast.error("Something went wrong") }
    setAssigning(null)
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Admin Dashboard</h2>

      {/* Stats */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total", val: stats.total, color: "#3b82f6" },
            { label: "Open", val: stats.open, color: "#ef4444" },
            { label: "Assigned", val: stats.assigned, color: "#f59e0b" },
            { label: "In Progress", val: stats.inProgress, color: "#8b5cf6" },
            { label: "Resolved", val: stats.resolved, color: "#10b981" },
            { label: "Overdue", val: stats.overdue, color: "#dc2626" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 10, padding: "16px 20px", border: `1px solid ${s.color}33`, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>All Tickets</h3>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}>
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              {["Ticket ID", "Title", "Category", "Priority", "Status", "Created By", "Assign To", "Action"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, color: "#666", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#999" }}>No tickets found</td></tr>
            ) : tickets.map(ticket => (
              <tr key={ticket._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 13, color: "#666" }}>{ticket.ticketId}</td>
                <td style={{ padding: "12px 16px", fontWeight: 500, maxWidth: 200 }}>{ticket.title}</td>
                <td style={{ padding: "12px 16px", fontSize: 13 }}>{ticket.category}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 12, background: priorityColor[ticket.priority] + "22", color: priorityColor[ticket.priority], fontWeight: 600 }}>{ticket.priority}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 12, background: statusColor[ticket.status] + "22", color: statusColor[ticket.status], fontWeight: 600 }}>{ticket.status}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13 }}>{ticket.createdBy?.name}</td>
                <td style={{ padding: "12px 16px" }}>
                  {ticket.status === "Open" ? (
                    <select
                      value={selectedTech[ticket._id] || ""}
                      onChange={e => setSelectedTech({ ...selectedTech, [ticket._id]: e.target.value })}
                      style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13 }}
                    >
                      <option value="">Select Tech</option>
                      {technicians.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  ) : (
                    <span style={{ fontSize: 13, color: "#666" }}>{ticket.assignedTo?.name || "—"}</span>
                  )}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {ticket.status === "Open" && (
                    <button
                      onClick={() => handleAssign(ticket._id)}
                      disabled={assigning === ticket._id}
                      style={{ padding: "6px 14px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
                    >
                      {assigning === ticket._id ? "..." : "Assign"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
