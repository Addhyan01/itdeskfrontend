import React, { useEffect, useState } from "react"
import { getAllTickets, assignTicket, getAllTechnicians, getDashboardStats, deleteTicket, modifyTicket, reopenTicket } from "../services/api"
import { toast } from "react-toastify"
import SLABadge from "../component/SLABadge"
import AttachmentViewer from "../component/AttachmentViewer"
import Pagination from "../component/Pagination"

const statusColor = { Pending: "#6b7280", "In Process": "#f59e0b", Working: "#8b5cf6", Resolved: "#10b981", Closed: "#374151" }
const priorityColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", Critical: "#7c3aed" }
const PER_PAGE = 10

const TABS = [
  { key: "all",        label: "All Tickets",   status: "" },
  { key: "unassigned", label: "Unassigned",    status: "Pending" },
  { key: "inprogress", label: "In Progress",   status: "In Process" },
  { key: "working",    label: "Working",       status: "Working" },
  { key: "resolved",   label: "Resolved",      status: "Resolved" },
  { key: "closed",     label: "Closed",        status: "Closed" },
]

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [priority, setPriority] = useState("")
  const [category, setCategory] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedTech, setSelectedTech] = useState({})
  const [dueDate, setDueDate] = useState({})
  const [assigning, setAssigning] = useState(null)
  const [editTicket, setEditTicket] = useState(null)
  const [editData, setEditData] = useState({})
  const [activeSection, setActiveSection] = useState("tickets")

  const currentTab = TABS.find(t => t.key === activeTab)

  const loadData = async (page = 1) => {
    setLoading(true)
    try {
      const filters = { page, limit: PER_PAGE }
      if (currentTab?.status) filters.status = currentTab.status
      if (search) filters.search = search
      if (priority) filters.priority = priority
      if (category) filters.category = category

      const [ticketData, techData, statsData] = await Promise.all([
        getAllTickets(filters), getAllTechnicians(), getDashboardStats()
      ])
      setTickets(ticketData.tickets || [])
      setTotalPages(ticketData.totalPages || 1)
      setTechnicians(Array.isArray(techData) ? techData : [])
      setStats(statsData.stats || null)
    } catch { toast.error("Failed to load data") }
    setLoading(false)
  }

  useEffect(() => {
    setCurrentPage(1)
    loadData(1)
  }, [activeTab, search, priority, category])

  useEffect(() => { loadData(currentPage) }, [currentPage])

  const handleAssign = async (ticketId) => {
    if (!selectedTech[ticketId]) { toast.warn("Please select a technician"); return }
    setAssigning(ticketId)
    try {
      const res = await assignTicket(ticketId, selectedTech[ticketId], dueDate[ticketId] || "")
      if (res.ticket) { toast.success("✅ Ticket assigned!"); loadData(currentPage) }
      else toast.error(res.message)
    } catch { toast.error("Assignment failed") }
    setAssigning(null)
  }

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Delete this ticket permanently?")) return
    const res = await deleteTicket(ticketId)
    if (res.message) { toast.success("Ticket deleted"); loadData(currentPage) }
    else toast.error(res.message)
  }

  const handleReopen = async (ticketId) => {
    const res = await reopenTicket(ticketId, "Reopened by admin")
    if (res.ticket) { toast.success("Ticket reopened!"); loadData(currentPage) }
    else toast.error(res.message)
  }

  const handleEdit = async () => {
    const res = await modifyTicket(editTicket, editData)
    if (res.ticket) { toast.success("Ticket updated!"); setEditTicket(null); loadData(currentPage) }
    else toast.error(res.message)
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Admin Dashboard</h2>

      {/* Stats */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total", val: stats.total, color: "#3b82f6", icon: "🎫" },
            { label: "Pending", val: stats.pending, color: "#6b7280", icon: "⏳" },
            { label: "In Process", val: stats.inProcess, color: "#f59e0b", icon: "🔄" },
            { label: "Working", val: stats.working, color: "#8b5cf6", icon: "🔧" },
            { label: "Resolved", val: stats.resolved, color: "#10b981", icon: "✅" },
            { label: "Closed", val: stats.closed, color: "#374151", icon: "🔒" },
            { label: "Overdue", val: stats.overdue, color: "#ef4444", icon: "⚠️" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: `1px solid ${s.color}33`, textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color, margin: "4px 0" }}>{s.val ?? 0}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Section Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["tickets", "🎫 Tickets"], ["technicians", "👥 Technicians"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveSection(key)}
            style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
              background: activeSection === key ? "#1d4ed8" : "#f3f4f6",
              color: activeSection === key ? "#fff" : "#555" }}>
            {label}
          </button>
        ))}
      </div>

      {activeSection === "tickets" && (<>
        {/* Status Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: activeTab === tab.key ? "#3b82f6" : "#f3f4f6",
                color: activeTab === tab.key ? "#fff" : "#555" }}>
              {tab.label}
              {tab.key === "unassigned" && stats?.pending > 0 && (
                <span style={{ marginLeft: 6, background: "#ef4444", color: "#fff", borderRadius: "50%", padding: "1px 6px", fontSize: 11 }}>{stats.pending}</span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input type="text" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", flex: 1, minWidth: 180 }} />
          <select value={priority} onChange={e => setPriority(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}>
            <option value="">All Priority</option>
            {["Low", "Medium", "High", "Critical"].map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}>
            <option value="">All Category</option>
            {["Hardware", "Software", "Network", "Account", "Other"].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Tickets */}
        {loading ? <p style={{ textAlign: "center", padding: 40 }}>Loading...</p> : tickets.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", color: "#999" }}>
            <p style={{ fontSize: 40 }}>🎫</p><h3>No tickets found</h3>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tickets.map(ticket => (
                <div key={ticket._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontFamily: "monospace", background: "#f5f5f5", padding: "2px 8px", borderRadius: 4 }}>{ticket.ticketId}</span>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusColor[ticket.status] + "22", color: statusColor[ticket.status] }}>{ticket.status}</span>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: priorityColor[ticket.priority] + "22", color: priorityColor[ticket.priority] }}>{ticket.priority}</span>
                        <span style={{ fontSize: 12, color: "#666", background: "#f3f4f6", padding: "3px 8px", borderRadius: 4 }}>{ticket.category}</span>
                        {ticket.attachments?.length > 0 && (
                          <span style={{ fontSize: 12, background: "#f0f9ff", color: "#0369a1", padding: "3px 8px", borderRadius: 12 }}>📎 {ticket.attachments.length}</span>
                        )}
                      </div>
                      <h4 style={{ margin: "0 0 4px", fontSize: 15 }}>{ticket.title}</h4>
                      <p style={{ margin: "0 0 6px", fontSize: 13, color: "#666" }}>
                        By: <strong>{ticket.createdBy?.name}</strong> ({ticket.createdByRole}) → For: <strong>{ticket.reportedFor?.name || ticket.createdBy?.name}</strong>
                      </p>
                      <SLABadge slaStatus={ticket.slaStatus} slaHours={ticket.slaHours} createdAt={ticket.createdAt} dueDate={ticket.dueDate} />
                      {ticket.attachments?.length > 0 && <AttachmentViewer attachments={ticket.attachments} />}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 190 }}>
                      {ticket.status === "Pending" && (<>
                        <select value={selectedTech[ticket._id] || ""} onChange={e => setSelectedTech({ ...selectedTech, [ticket._id]: e.target.value })}
                          style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13 }}>
                          <option value="">Select Technician</option>
                          {technicians.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                        <input type="date" value={dueDate[ticket._id] || ""} onChange={e => setDueDate({ ...dueDate, [ticket._id]: e.target.value })}
                          style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13 }} />
                        <button onClick={() => handleAssign(ticket._id)} disabled={assigning === ticket._id}
                          style={{ padding: "7px 14px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                          {assigning === ticket._id ? "Assigning..." : "✅ Assign"}
                        </button>
                      </>)}
                      {ticket.assignedTo && ticket.status !== "Pending" && (
                        <p style={{ margin: 0, fontSize: 13, color: "#555", background: "#f9fafb", padding: "6px 10px", borderRadius: 6 }}>🔧 {ticket.assignedTo.name}</p>
                      )}
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setEditTicket(ticket._id); setEditData({ title: ticket.title, priority: ticket.priority, category: ticket.category, dueDate: ticket.dueDate?.split("T")[0] || "" }) }}
                          style={{ flex: 1, padding: "6px", background: "#fef9c3", color: "#a16207", border: "1px solid #fde68a", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                          ✏️ Edit
                        </button>
                        {["Resolved", "Closed"].includes(ticket.status) && (
                          <button onClick={() => handleReopen(ticket._id)}
                            style={{ flex: 1, padding: "6px", background: "#ede9fe", color: "#7c3aed", border: "1px solid #ddd6fe", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                            🔁 Reopen
                          </button>
                        )}
                        <button onClick={() => handleDelete(ticket._id)}
                          style={{ flex: 1, padding: "6px", background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </>)}

      {/* Technicians Tab */}
      {activeSection === "technicians" && stats?.technicians && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
          {stats.technicians.map(tech => (
            <div key={tech._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {tech.profilePicture ? <img src={tech.profilePicture} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} /> : "🔧"}
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
            <h3 style={{ marginBottom: 20 }}>✏️ Edit Ticket</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Title</label>
              <input value={editData.title || ""} onChange={e => setEditData({ ...editData, title: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box" }} />
            </div>
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
