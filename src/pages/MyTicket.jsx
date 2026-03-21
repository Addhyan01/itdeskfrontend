import React, { useEffect, useState } from "react"
import { getMyTickets } from "../services/api"
import { toast } from "react-toastify"

const statusColor = { Open: "#3b82f6", Assigned: "#f59e0b", "In Progress": "#8b5cf6", Resolved: "#10b981", Closed: "#6b7280" }
const priorityColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", Critical: "#7c3aed" }

export default function MyTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMyTickets()
        setTickets(Array.isArray(data) ? data : [])
      } catch { toast.error("Failed to load tickets") }
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = filter === "All" ? tickets : tickets.filter(t => t.status === filter)

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>My Tickets</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}>
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {loading ? <p>Loading tickets...</p> : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#999" }}>
          <h3>No tickets found</h3>
          <p>Create a new ticket to get started</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(ticket => (
            <div key={ticket._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: 12, color: "#999", fontFamily: "monospace" }}>{ticket.ticketId}</span>
                  <h4 style={{ margin: "4px 0 8px", fontSize: 16 }}>{ticket.title}</h4>
                  <p style={{ margin: 0, color: "#666", fontSize: 14 }}>{ticket.category}</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, background: statusColor[ticket.status] + "22", color: statusColor[ticket.status], fontWeight: 600 }}>
                    {ticket.status}
                  </span>
                  <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, background: priorityColor[ticket.priority] + "22", color: priorityColor[ticket.priority], fontWeight: 600 }}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999" }}>
                <span>Created: {new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                {ticket.assignedTo && <span>Assigned to: <strong>{ticket.assignedTo.name}</strong></span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
