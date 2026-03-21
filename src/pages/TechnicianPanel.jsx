import React, { useEffect, useState } from "react"
import { getAssignedTickets, updateTicketStatus } from "../services/api"
import { toast } from "react-toastify"

const priorityColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", Critical: "#7c3aed" }

export default function TechnicianPanel() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [comments, setComments] = useState({})
  const [selected, setSelected] = useState({})

  const loadTickets = async () => {
    try {
      const data = await getAssignedTickets()
      setTickets(Array.isArray(data) ? data : [])
    } catch { toast.error("Failed to load tickets") }
    setLoading(false)
  }

  useEffect(() => { loadTickets() }, [])

  const handleUpdate = async (ticketId) => {
    const status = selected[ticketId]
    if (!status) { toast.warn("Select a status"); return }
    setUpdating(ticketId)
    try {
      const res = await updateTicketStatus(ticketId, status, comments[ticketId] || "")
      if (res.ticket) {
        toast.success("Ticket updated! User notified via email.")
        loadTickets()
        setSelected(prev => ({ ...prev, [ticketId]: "" }))
        setComments(prev => ({ ...prev, [ticketId]: "" }))
      } else toast.error(res.message || "Update failed")
    } catch { toast.error("Something went wrong") }
    setUpdating(null)
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading assigned tickets...</div>

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 8 }}>My Assigned Tickets</h2>
      <p style={{ color: "#666", marginBottom: 24 }}>Tickets assigned to you. Update status and add notes.</p>

      {tickets.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#999", background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb" }}>
          <h3>No tickets assigned yet</h3>
          <p>Admin will assign tickets to you soon</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {tickets.map(ticket => (
            <div key={ticket._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 12, color: "#999", fontFamily: "monospace" }}>{ticket.ticketId}</span>
                  <h3 style={{ margin: "4px 0 6px", fontSize: 18 }}>{ticket.title}</h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 12, background: "#f0f0f0", color: "#555" }}>{ticket.category}</span>
                    <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 12, background: priorityColor[ticket.priority] + "22", color: priorityColor[ticket.priority], fontWeight: 600 }}>{ticket.priority}</span>
                  </div>
                </div>
                <span style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: "#8b5cf622", color: "#8b5cf6" }}>{ticket.status}</span>
              </div>

              <p style={{ color: "#555", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: ticket.description }} />

              <div style={{ background: "#f9fafb", borderRadius: 8, padding: 16 }}>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#666", fontWeight: 600 }}>Reported by: {ticket.createdBy?.name} ({ticket.createdBy?.email})</p>

                {ticket.status !== "Resolved" && ticket.status !== "Closed" && (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                    <div>
                      <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>Update Status</label>
                      <select
                        value={selected[ticket._id] || ""}
                        onChange={e => setSelected({ ...selected, [ticket._id]: e.target.value })}
                        style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13 }}
                      >
                        <option value="">Select status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>Add Note (optional)</label>
                      <input
                        type="text"
                        placeholder="Resolution note..."
                        value={comments[ticket._id] || ""}
                        onChange={e => setComments({ ...comments, [ticket._id]: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13, boxSizing: "border-box" }}
                      />
                    </div>
                    <button
                      onClick={() => handleUpdate(ticket._id)}
                      disabled={updating === ticket._id}
                      style={{ padding: "8px 20px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
                    >
                      {updating === ticket._id ? "Updating..." : "Update"}
                    </button>
                  </div>
                )}

                {(ticket.status === "Resolved" || ticket.status === "Closed") && (
                  <p style={{ color: "#10b981", fontWeight: 600, margin: 0 }}>✅ This ticket has been {ticket.status.toLowerCase()}</p>
                )}
              </div>

              {ticket.comments?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Notes:</p>
                  {ticket.comments.map((c, i) => (
                    <div key={i} style={{ background: "#eff6ff", borderRadius: 6, padding: "8px 12px", marginBottom: 6, fontSize: 13 }}>
                      <strong>{c.author?.name}:</strong> {c.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
