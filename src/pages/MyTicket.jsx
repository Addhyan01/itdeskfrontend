import React, { useEffect, useState } from "react"
import { getMyTickets, addComment, closeTicket } from "../services/api"
import { toast } from "react-toastify"
import SLABadge from "../component/SLABadge"
import AttachmentViewer from "../component/AttachmentViewer"

const statusColor = { Pending: "#6b7280", "In Process": "#f59e0b", Working: "#8b5cf6", Resolved: "#10b981", Closed: "#374151" }
const priorityColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", Critical: "#7c3aed" }

export default function MyTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" })
  const [expanded, setExpanded] = useState(null)
  const [comment, setComment] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const loadTickets = async () => {
    setLoading(true)
    try {
      const active = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      const data = await getMyTickets(active)
      setTickets(Array.isArray(data) ? data : [])
    } catch { toast.error("Failed to load tickets") }
    setLoading(false)
  }

  useEffect(() => { loadTickets() }, [filters])

  const handleClose = async (id) => {
    if (!window.confirm("Are you sure you want to close this ticket?")) return
    const res = await closeTicket(id)
    if (res.ticket) { toast.success("Ticket closed!"); loadTickets() }
    else toast.error(res.message)
  }

  const handleComment = async (ticketId) => {
    if (!comment[ticketId]?.trim()) return
    setSubmitting(true)
    const res = await addComment(ticketId, comment[ticketId])
    if (res.comments) {
      toast.success("Comment added!")
      setComment({ ...comment, [ticketId]: "" })
      loadTickets()
    } else toast.error(res.message)
    setSubmitting(false)
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>My Tickets</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input type="text" placeholder="🔍 Search tickets..."
          value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", flex: 1, minWidth: 200 }} />
        <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}>
          <option value="">All Status</option>
          {["Pending", "In Process", "Working", "Resolved", "Closed"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value })}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}>
          <option value="">All Priority</option>
          {["Low", "Medium", "High", "Critical"].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {loading ? <p>Loading...</p> : tickets.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#999", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
          <p style={{ fontSize: 40 }}>🎫</p>
          <h3>No tickets found</h3>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tickets.map(ticket => (
            <div key={ticket._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              
              {/* Ticket Header */}
              <div style={{ padding: "16px 20px", cursor: "pointer" }}
                onClick={() => setExpanded(expanded === ticket._id ? null : ticket._id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "#999", fontFamily: "monospace", background: "#f5f5f5", padding: "2px 8px", borderRadius: 4 }}>{ticket.ticketId}</span>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusColor[ticket.status] + "22", color: statusColor[ticket.status] }}>{ticket.status}</span>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: priorityColor[ticket.priority] + "22", color: priorityColor[ticket.priority] }}>{ticket.priority}</span>
                      {ticket.attachments?.length > 0 && (
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, background: "#f0f9ff", color: "#0369a1" }}>
                          📎 {ticket.attachments.length} file{ticket.attachments.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <h4 style={{ margin: "0 0 6px", fontSize: 15 }}>{ticket.title}</h4>
                    <SLABadge slaStatus={ticket.slaStatus} slaHours={ticket.slaHours} createdAt={ticket.createdAt} dueDate={ticket.dueDate} />
                  </div>
                  <div style={{ textAlign: "right", fontSize: 12, color: "#999", marginLeft: 12 }}>
                    <p style={{ margin: 0 }}>{new Date(ticket.createdAt).toLocaleDateString("en-IN")}</p>
                    {ticket.assignedTo && <p style={{ margin: "4px 0 0" }}>🔧 {ticket.assignedTo.name}</p>}
                    <p style={{ margin: "4px 0 0", color: "#3b82f6" }}>{expanded === ticket._id ? "▲ Less" : "▼ More"}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === ticket._id && (
                <div style={{ borderTop: "1px solid #f0f0f0", padding: "16px 20px", background: "#fafafa" }}>
                  
                  {/* Description */}
                  <p style={{ color: "#555", fontSize: 14, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: ticket.description }} />

                  {/* ── ATTACHMENTS ── */}
                  <AttachmentViewer attachments={ticket.attachments} />

                  {/* Comments */}
                  {ticket.comments?.length > 0 && (
                    <div style={{ marginTop: 16, marginBottom: 16 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>💬 Comments</p>
                      {ticket.comments.map((c, i) => (
                        <div key={i} style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", marginBottom: 8, border: "1px solid #e5e7eb" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>{c.authorName || "User"}</span>
                            <span style={{ fontSize: 11, color: "#999" }}>{new Date(c.createdAt).toLocaleString("en-IN")}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: 13, color: "#555" }}>{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  {ticket.status !== "Closed" && (
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      <input type="text" placeholder="Add a comment..."
                        value={comment[ticket._id] || ""}
                        onChange={e => setComment({ ...comment, [ticket._id]: e.target.value })}
                        style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }}
                        onKeyDown={e => e.key === "Enter" && handleComment(ticket._id)} />
                      <button onClick={() => handleComment(ticket._id)} disabled={submitting}
                        style={{ padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
                        Send
                      </button>
                    </div>
                  )}

                  {/* Close Button */}
                  {(ticket.status === "Resolved" || ticket.status === "Pending") && (
                    <button onClick={() => handleClose(ticket._id)}
                      style={{ padding: "8px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                      Close Ticket
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
