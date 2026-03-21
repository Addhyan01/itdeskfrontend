import React, { useEffect, useState } from "react"
import { getAssignedTickets, getResolvedTickets, updateTicketStatus, reopenTicket, addComment } from "../services/api"
import { toast } from "react-toastify"
import SLABadge from "../component/SLABadge"
import AttachmentViewer from "../component/AttachmentViewer"

const priorityColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", Critical: "#7c3aed" }
const statusColor = { Pending: "#6b7280", "In Process": "#f59e0b", Working: "#8b5cf6", Resolved: "#10b981", Closed: "#374151" }

export default function TechnicianPanel() {
  const [assignedTickets, setAssignedTickets] = useState([])
  const [resolvedTickets, setResolvedTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("assigned")
  const [updating, setUpdating] = useState(null)
  const [selected, setSelected] = useState({})
  const [comments, setComments] = useState({})
  const [dueDates, setDueDates] = useState({})
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState("")

  const loadData = async () => {
    setLoading(true)
    try {
      const [assigned, resolved] = await Promise.all([getAssignedTickets(), getResolvedTickets()])
      setAssignedTickets(Array.isArray(assigned) ? assigned : [])
      setResolvedTickets(Array.isArray(resolved) ? resolved : [])
    } catch { toast.error("Failed to load tickets") }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleUpdate = async (ticketId) => {
    const status = selected[ticketId]
    if (!status) { toast.warn("Select a status"); return }
    setUpdating(ticketId)
    try {
      const res = await updateTicketStatus(ticketId, status, comments[ticketId] || "", dueDates[ticketId] || "")
      if (res.ticket) {
        toast.success("✅ Ticket updated! User notified.")
        loadData()
        setSelected(p => ({ ...p, [ticketId]: "" }))
        setComments(p => ({ ...p, [ticketId]: "" }))
      } else toast.error(res.message)
    } catch { toast.error("Update failed") }
    setUpdating(null)
  }

  const handleReopen = async (ticketId) => {
    const res = await reopenTicket(ticketId, "Reopened by technician for further review")
    if (res.ticket) { toast.success("Ticket reopened! Admin will reassign."); loadData() }
    else toast.error(res.message)
  }

  const handleComment = async (ticketId) => {
    if (!comments[ticketId]?.trim()) return
    const res = await addComment(ticketId, comments[ticketId])
    if (res.comments) { toast.success("Comment added!"); setComments(p => ({ ...p, [ticketId]: "" })); loadData() }
    else toast.error(res.message)
  }

  const filteredAssigned = assignedTickets.filter(t =>
    t.title?.toLowerCase().includes(search.toLowerCase()) || t.ticketId?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>

  const TicketCard = ({ ticket, showReopen = false }) => (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ padding: "16px 20px", cursor: "pointer" }} onClick={() => setExpanded(expanded === ticket._id ? null : ticket._id)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontFamily: "monospace", background: "#f5f5f5", padding: "2px 8px", borderRadius: 4 }}>{ticket.ticketId}</span>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusColor[ticket.status] + "22", color: statusColor[ticket.status] }}>{ticket.status}</span>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: priorityColor[ticket.priority] + "22", color: priorityColor[ticket.priority] }}>{ticket.priority}</span>
            </div>
            <h4 style={{ margin: "0 0 6px", fontSize: 15 }}>{ticket.title}</h4>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#666" }}>📧 {ticket.createdBy?.name} · {ticket.category}</p>
            <SLABadge slaStatus={ticket.slaStatus} slaHours={ticket.slaHours} createdAt={ticket.createdAt} dueDate={ticket.dueDate} />
          </div>
          <span style={{ fontSize: 12, color: "#999" }}>{expanded === ticket._id ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded === ticket._id && (
        <div style={{ borderTop: "1px solid #f0f0f0", padding: "16px 20px", background: "#fafafa" }}>
          <p style={{ color: "#555", fontSize: 14, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: ticket.description }} />

          {/* ── ATTACHMENTS ── */}
          <AttachmentViewer attachments={ticket.attachments} />

          {/* Comments */}
          {ticket.comments?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>💬 Comments</p>
              {ticket.comments.map((c, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", marginBottom: 8, border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{c.authorName}</span>
                    <span style={{ fontSize: 11, color: "#999" }}>{new Date(c.createdAt).toLocaleString("en-IN")}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#555" }}>{c.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Audit Log */}
          {ticket.auditLog?.length > 0 && (
            <details style={{ marginBottom: 16 }}>
              <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 8 }}>📋 Ticket History</summary>
              {ticket.auditLog.map((log, i) => (
                <div key={i} style={{ padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 12, color: "#666", display: "flex", gap: 8 }}>
                  <span style={{ color: "#999" }}>{new Date(log.createdAt).toLocaleString("en-IN")}</span>
                  <span>{log.action}</span>
                  {log.note && <span style={{ color: "#999" }}>· {log.note}</span>}
                </div>
              ))}
            </details>
          )}

          {/* Update Status Section */}
          {!showReopen && ticket.status !== "Resolved" && (
            <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 16, marginBottom: 12 }}>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Update Status</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <select value={selected[ticket._id] || ""} onChange={e => setSelected({ ...selected, [ticket._id]: e.target.value })}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }}>
                  <option value="">Select status</option>
                  <option value="Working">Working</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <input type="date" value={dueDates[ticket._id] || ""} onChange={e => setDueDates({ ...dueDates, [ticket._id]: e.target.value })}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }} />
              </div>
              <input type="text" placeholder="Resolution note (optional)..." value={comments[ticket._id] || ""}
                onChange={e => setComments({ ...comments, [ticket._id]: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, marginTop: 10, boxSizing: "border-box" }} />
              <button onClick={() => handleUpdate(ticket._id)} disabled={updating === ticket._id}
                style={{ marginTop: 10, padding: "8px 20px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                {updating === ticket._id ? "Updating..." : "Update Ticket"}
              </button>
            </div>
          )}

          {/* Add Comment */}
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" placeholder="Add comment..." value={comments[ticket._id] || ""}
              onChange={e => setComments({ ...comments, [ticket._id]: e.target.value })}
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }}
              onKeyDown={e => e.key === "Enter" && handleComment(ticket._id)} />
            <button onClick={() => handleComment(ticket._id)}
              style={{ padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
              Send
            </button>
          </div>

          {/* Reopen Button */}
          {showReopen && (
            <button onClick={() => handleReopen(ticket._id)} style={{ marginTop: 12, padding: "8px 20px", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
              🔁 Reopen Ticket
            </button>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 8 }}>Technician Panel</h2>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Assigned", val: assignedTickets.filter(t => t.status === "In Process").length, color: "#f59e0b" },
          { label: "Working", val: assignedTickets.filter(t => t.status === "Working").length, color: "#8b5cf6" },
          { label: "Resolved", val: resolvedTickets.filter(t => t.assignedTo?._id === assignedTickets[0]?.assignedTo?._id).length, color: "#10b981" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 20px", border: `1px solid ${s.color}33`, textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["assigned", "🔧 Assigned Tickets"], ["resolved", "✅ Resolved Tickets"]].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
              background: activeTab === tab ? "#3b82f6" : "#f3f4f6", color: activeTab === tab ? "#fff" : "#555" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input type="text" placeholder="🔍 Search tickets..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", marginBottom: 16, boxSizing: "border-box", fontSize: 14 }} />

      {activeTab === "assigned" && (
        filteredAssigned.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#999", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: 40 }}>🎫</p><h3>No assigned tickets</h3>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredAssigned.map(ticket => <TicketCard key={ticket._id} ticket={ticket} />)}
          </div>
        )
      )}

      {activeTab === "resolved" && (
        resolvedTickets.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#999", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: 40 }}>✅</p><h3>No resolved tickets yet</h3>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {resolvedTickets.map(ticket => <TicketCard key={ticket._id} ticket={ticket} showReopen={true} />)}
          </div>
        )
      )}
    </div>
  )
}
