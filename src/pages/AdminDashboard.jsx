import React, { useEffect, useState } from "react"
import { getAllTickets, assignTicket, getAllTechnicians, getDashboardStats, deleteTicket, modifyTicket, reopenTicket } from "../services/api"
import { toast } from "react-toastify"
import SLABadge from "../component/SLABadge"
import AttachmentViewer from "../component/AttachmentViewer"

const statusColor = { Pending: "#6b7280", "In Process": "#f59e0b", Working: "#8b5cf6", Resolved: "#10b981", Closed: "#374151" }
const priorityColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", Critical: "#7c3aed" }

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: "", priority: "", category: "", search: "" })
  const [selectedTech, setSelectedTech] = useState({})
  const [dueDate, setDueDate] = useState({})
  const [assigning, setAssigning] = useState(null)
  const [editTicket, setEditTicket] = useState(null)
  const [editData, setEditData] = useState({})
  const [activeTab, setActiveTab] = useState("tickets")

  const loadData = async () => {
    try {
      const active = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      const [ticketData, techData, statsData] = await Promise.all([
        getAllTickets(active), getAllTechnicians(), getDashboardStats()
      ])
      setTickets(ticketData.tickets || [])
      setTechnicians(Array.isArray(techData) ? techData : [])
      setStats(statsData.stats || null)
    } catch { toast.error("Failed to load data") }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [filters])

  const handleAssign = async (ticketId) => {
    if (!selectedTech[ticketId]) { toast.warn("Please select a technician"); return }
    setAssigning(ticketId)
    try {
      const res = await assignTicket(ticketId, selectedTech[ticketId], dueDate[ticketId] || "")
      if (res.ticket) { toast.success("✅ Ticket assigned! Email sent."); loadData() }
      else toast.error(res.message)
    } catch { toast.error("Assignment failed") }
    setAssigning(null)
  }

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Delete this ticket permanently?")) return
    const res = await deleteTicket(ticketId)
    if (res.message) { toast.success("Ticket deleted"); loadData() }
    else toast.error(res.message)
  }

  const handleReopen = async (ticketId) => {
    const res = await reopenTicket(ticketId, "Reopened by admin")
    if (res.ticket) { toast.success("Ticket reopened!"); loadData() }
    else toast.error(res.message)
  }

  const handleEdit = async () => {
    const res = await modifyTicket(editTicket, editData)
    if (res.ticket) { toast.success("Ticket updated!"); setEditTicket(null); loadData() }
    else toast.error(res.message)
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Admin Dashboard</h2>

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total", val: stats.total, color: "#3b82f6", icon: "🎫" },
            { label: "Pending", val: stats.pending, color: "#6b7280", icon: "⏳" },
            { label: "In Process", val: stats.inProcess, color: "#f59e0b", icon: "🔄" },
            { label: "Working", val: stats.working, color: "#8b5cf6", icon: "🔧" },
            { label: "Resolved", val: stats.resolved, color: "#10b981", icon: "✅" },
            { label: "Closed", val: stats.closed, color: "#374151", icon: "🔒" },
            { label: "Overdue", val: stats.overdue, color: "#ef4444", icon: "⚠️" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "16px", border: `1px solid ${s.color}33`, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: s.color, margin: "4px 0" }}>{s.val ?? 0}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["tickets", "technicians"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
              background: activeTab === tab ? "#3b82f6" : "#f3f4f6", color: activeTab === tab ? "#fff" : "#555" }}>
            {tab === "tickets" ? "🎫 All Tickets" : "👥 Technicians"}
          </button>
        ))}
      </div>

      {activeTab === "tickets" && (
        <>
          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <input type="text" placeholder="🔍 Search..." value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", flex: 1, minWidth: 180 }} />
            {["status", "priority", "category"].map(key => (
              <select key={key} value={filters[key]} onChange={e => setFilters({ ...filters, [key]: e.target.value })}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}>
                <option value="">All {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                {key === "status" && ["Pending", "In Process", "Working", "Resolved", "Closed"].map(o => <option key={o}>{o}</option>)}
                {key === "priority" && ["Low", "Medium", "High", "Critical"].map(o => <option key={o}>{o}</option>)}
                {key === "category" && ["Hardware", "Software", "Network", "Account", "Other"].map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>

          {/* Tickets List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tickets.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#999", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>No tickets found</div>
            ) : tickets.map(ticket => (
              <div key={ticket._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontFamily: "monospace", background: "#f5f5f5", padding: "2px 8px", borderRadius: 4 }}>{ticket.ticketId}</span>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusColor[ticket.status] + "22", color: statusColor[ticket.status] }}>{ticket.status}</span>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: priorityColor[ticket.priority] + "22", color: priorityColor[ticket.priority] }}>{ticket.priority}</span>
                      <span style={{ fontSize: 12, color: "#666", background: "#f3f4f6", padding: "3px 8px", borderRadius: 4 }}>{ticket.category}</span>
                    </div>
                    <h4 style={{ margin: "0 0 6px", fontSize: 15 }}>{ticket.title}</h4>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: "#666" }}>By: {ticket.createdBy?.name} ({ticket.createdBy?.role})</p>
                    <SLABadge slaStatus={ticket.slaStatus} slaHours={ticket.slaHours} createdAt={ticket.createdAt} dueDate={ticket.dueDate} />
                    {ticket.attachments?.length > 0 && (
                      <span style={{ fontSize: 12, background: "#f0f9ff", color: "#0369a1", padding: "3px 10px", borderRadius: 20, marginTop: 6, display: "inline-block" }}>
                        📎 {ticket.attachments.length} attachment{ticket.attachments.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Attachments inline */}
                  {ticket.attachments?.length > 0 && (
                    <div style={{ marginTop: 8, width: "100%" }}>
                      <AttachmentViewer attachments={ticket.attachments} />
                    </div>
                  )}
                {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 200 }}>
                    {ticket.status === "Pending" && (
                      <>
                        <select value={selectedTech[ticket._id] || ""} onChange={e => setSelectedTech({ ...selectedTech, [ticket._id]: e.target.value })}
                          style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13 }}>
                          <option value="">Select Technician</option>
                          {technicians.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                        <input type="date" value={dueDate[ticket._id] || ""}
                          onChange={e => setDueDate({ ...dueDate, [ticket._id]: e.target.value })}
                          style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13 }} />
                        <button onClick={() => handleAssign(ticket._id)} disabled={assigning === ticket._id}
                          style={{ padding: "7px 14px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                          {assigning === ticket._id ? "Assigning..." : "Assign"}
                        </button>
                      </>
                    )}
                    {ticket.assignedTo && (
                      <p style={{ margin: 0, fontSize: 13, color: "#555" }}>🔧 {ticket.assignedTo.name}</p>
                    )}
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { setEditTicket(ticket._id); setEditData({ title: ticket.title, priority: ticket.priority, category: ticket.category, dueDate: ticket.dueDate?.split("T")[0] || "" }) }}
                        style={{ padding: "6px 12px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                        ✏️ Edit
                      </button>
                      {["Resolved", "Closed"].includes(ticket.status) && (
                        <button onClick={() => handleReopen(ticket._id)}
                          style={{ padding: "6px 12px", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                          🔁 Reopen
                        </button>
                      )}
                      <button onClick={() => handleDelete(ticket._id)}
                        style={{ padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "technicians" && stats?.technicians && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
          {stats.technicians.map(tech => (
            <div key={tech._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {tech.profilePicture ? <img src={tech.profilePicture} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} /> : "👤"}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{tech.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{tech.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: "#fef9c3", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#a16207" }}>{tech.activeTickets}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>Active</div>
                </div>
                <div style={{ flex: 1, background: "#dcfce7", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#166534" }}>{tech.resolvedTickets}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>Resolved</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editTicket && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ marginBottom: 20 }}>Edit Ticket</h3>
            {["title"].map(f => (
              <div key={f} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6, textTransform: "capitalize" }}>{f}</label>
                <input value={editData[f] || ""} onChange={e => setEditData({ ...editData, [f]: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Priority</label>
              <select value={editData.priority || ""} onChange={e => setEditData({ ...editData, priority: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}>
                {["Low", "Medium", "High", "Critical"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Category</label>
              <select value={editData.category || ""} onChange={e => setEditData({ ...editData, category: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}>
                {["Hardware", "Software", "Network", "Account", "Other"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Due Date</label>
              <input type="date" value={editData.dueDate || ""} onChange={e => setEditData({ ...editData, dueDate: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleEdit}
                style={{ flex: 1, padding: "10px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                Save Changes
              </button>
              <button onClick={() => setEditTicket(null)}
                style={{ flex: 1, padding: "10px", background: "#f3f4f6", color: "#555", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
