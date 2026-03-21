import React, { useEffect, useState, useCallback } from "react"
import { getAssignedTickets, getResolvedTickets, updateTicketStatus, reopenTicket, addComment } from "../services/api"
import { toast } from "react-toastify"
import SLABadge from "../component/SLABadge"
import AttachmentViewer from "../component/AttachmentViewer"
import Pagination from "../component/Pagination"

const priorityColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", Critical: "#7c3aed" }
const statusColor = { Pending: "#6b7280", "In Process": "#f59e0b", Working: "#8b5cf6", Resolved: "#10b981", Closed: "#374151" }
const PER_PAGE = 10

const TABS = [
  { key: "all",       label: "All Assigned", status: "" },
  { key: "inprocess", label: "In Process",   status: "In Process" },
  { key: "working",   label: "Working",      status: "Working" },
  { key: "resolved",  label: "Resolved",     status: "Resolved" },
]

// ── TicketCard BAHAR define kiya — re-render issue fix ──
const TicketCard = ({
  ticket, showReopen,
  expanded, setExpanded,
  selected, setSelected,
  comments, setComments,
  resNotes, setResNotes,
  dueDates, setDueDates,
  updating,
  handleUpdate, handleReopen, handleComment,
}) => (
  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
    <div style={{ padding: "14px 18px", cursor: "pointer" }}
      onClick={() => setExpanded(expanded === ticket._id ? null : ticket._id)}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontFamily: "monospace", background: "#f5f5f5", padding: "2px 8px", borderRadius: 4 }}>{ticket.ticketId}</span>
            <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusColor[ticket.status] + "22", color: statusColor[ticket.status] }}>{ticket.status}</span>
            <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: priorityColor[ticket.priority] + "22", color: priorityColor[ticket.priority] }}>{ticket.priority}</span>
            {ticket.attachments?.length > 0 && (
              <span style={{ fontSize: 12, background: "#f0f9ff", color: "#0369a1", padding: "3px 8px", borderRadius: 12 }}>📎 {ticket.attachments.length}</span>
            )}
          </div>
          <h4 style={{ margin: "0 0 4px", fontSize: 15 }}>{ticket.title}</h4>
          <p style={{ margin: "0 0 6px", fontSize: 13, color: "#666" }}>
            👤 {ticket.reportedFor?.name || ticket.createdBy?.name} · {ticket.category}
          </p>
          <SLABadge slaStatus={ticket.slaStatus} slaHours={ticket.slaHours} createdAt={ticket.createdAt} dueDate={ticket.dueDate} />
        </div>
        <span style={{ color: "#999", fontSize: 13 }}>{expanded === ticket._id ? "▲" : "▼"}</span>
      </div>
    </div>

    {expanded === ticket._id && (
      <div style={{ borderTop: "1px solid #f0f0f0", padding: "14px 18px", background: "#fafafa" }}>
        <p style={{ color: "#555", fontSize: 14, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: ticket.description }} />

        <AttachmentViewer attachments={ticket.attachments} />

        {/* Audit Log */}
        {ticket.auditLog?.length > 0 && (
          <details style={{ margin: "12px 0" }}>
            <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#555" }}>📋 Ticket History ({ticket.auditLog.length})</summary>
            <div style={{ marginTop: 8 }}>
              {ticket.auditLog.map((log, i) => (
                <div key={i} style={{ padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 12, color: "#666", display: "flex", gap: 8 }}>
                  <span style={{ color: "#999", whiteSpace: "nowrap" }}>{new Date(log.createdAt).toLocaleString("en-IN")}</span>
                  <span>{log.action}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Comments */}
        {ticket.comments?.length > 0 && (
          <div style={{ margin: "12px 0" }}>
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>💬 Comments</p>
            {ticket.comments.map((c, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", marginBottom: 6, border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{c.authorName}</span>
                  <span style={{ fontSize: 11, color: "#999" }}>{new Date(c.createdAt).toLocaleString("en-IN")}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#555" }}>{c.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Update Status */}
        {!showReopen && ticket.status !== "Resolved" && (
          <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Update Status</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select value={selected[ticket._id] || ""}
                onChange={e => setSelected(prev => ({ ...prev, [ticket._id]: e.target.value }))}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }}>
                <option value="">Select status</option>
                <option value="Working">Working</option>
                <option value="Resolved">Resolved</option>
              </select>
              <input type="date" value={dueDates[ticket._id] || ""}
                onChange={e => setDueDates(prev => ({ ...prev, [ticket._id]: e.target.value }))}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }} />
            </div>
            {/* Resolution Note - resNotes state */}
            <input
              type="text"
              placeholder="Resolution note..."
              value={resNotes[ticket._id] || ""}
              onChange={e => setResNotes(prev => ({ ...prev, [ticket._id]: e.target.value }))}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, marginTop: 8, boxSizing: "border-box" }}
            />
            <button onClick={() => handleUpdate(ticket._id)} disabled={updating === ticket._id}
              style={{ marginTop: 10, padding: "8px 20px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
              {updating === ticket._id ? "Updating..." : "Update"}
            </button>
          </div>
        )}

        {/* Add Comment - comments state */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Add comment..."
            value={comments[ticket._id] || ""}
            onChange={e => setComments(prev => ({ ...prev, [ticket._id]: e.target.value }))}
            style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }}
            onKeyDown={e => e.key === "Enter" && handleComment(ticket._id)}
          />
          <button onClick={() => handleComment(ticket._id)}
            style={{ padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            Send
          </button>
        </div>

        {showReopen && (
          <button onClick={() => handleReopen(ticket._id)}
            style={{ padding: "8px 20px", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            🔁 Reopen Ticket
          </button>
        )}
      </div>
    )}
  </div>
)

// ── Main Component ──────────────────────────────────────
export default function TechnicianPanel() {
  const [allAssigned, setAllAssigned] = useState([])
  const [resolvedTickets, setResolvedTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("assigned")
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [tickets, setTickets] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [selected, setSelected] = useState({})
  const [comments, setComments] = useState({})
  const [resNotes, setResNotes] = useState({})
  const [dueDates, setDueDates] = useState({})

  const currentTab = TABS.find(t => t.key === activeTab)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [assigned, resolved] = await Promise.all([getAssignedTickets(), getResolvedTickets()])
      setAllAssigned(Array.isArray(assigned) ? assigned : [])
      setResolvedTickets(Array.isArray(resolved) ? resolved : [])
    } catch { toast.error("Failed to load") }
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    const source = activeSection === "assigned" ? allAssigned : resolvedTickets
    let filtered = source
    if (currentTab?.status && activeSection === "assigned") {
      filtered = source.filter(t => t.status === currentTab.status)
    }
    if (search) {
      filtered = filtered.filter(t =>
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.ticketId?.toLowerCase().includes(search.toLowerCase())
      )
    }
    const total = filtered.length
    setTotalPages(Math.ceil(total / PER_PAGE) || 1)
    const start = (currentPage - 1) * PER_PAGE
    setTickets(filtered.slice(start, start + PER_PAGE))
  }, [allAssigned, resolvedTickets, activeSection, activeTab, search, currentPage, currentTab])

  useEffect(() => { setCurrentPage(1) }, [activeSection, activeTab, search])

  const handleUpdate = useCallback(async (ticketId) => {
    const status = selected[ticketId]
    if (!status) { toast.warn("Select a status"); return }
    setUpdating(ticketId)
    try {
      const res = await updateTicketStatus(ticketId, status, resNotes[ticketId] || "", dueDates[ticketId] || "")
      if (res.ticket) {
        toast.success("✅ Updated! User notified.")
        loadData()
        setSelected(p => ({ ...p, [ticketId]: "" }))
        setResNotes(p => ({ ...p, [ticketId]: "" }))
      } else toast.error(res.message)
    } catch { toast.error("Update failed") }
    setUpdating(null)
  }, [selected, resNotes, dueDates, loadData])

  const handleReopen = useCallback(async (ticketId) => {
    const res = await reopenTicket(ticketId, "Reopened by technician")
    if (res.ticket) { toast.success("Ticket reopened! Admin will reassign."); loadData() }
    else toast.error(res.message)
  }, [loadData])

  const handleComment = useCallback(async (ticketId) => {
    if (!comments[ticketId]?.trim()) return
    const res = await addComment(ticketId, comments[ticketId])
    if (res.comments) {
      toast.success("Comment added!")
      setComments(p => ({ ...p, [ticketId]: "" }))
      loadData()
    } else toast.error(res.message)
  }, [comments, loadData])

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Technician Panel</h2>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "In Process", val: allAssigned.filter(t => t.status === "In Process").length, color: "#f59e0b" },
          { label: "Working", val: allAssigned.filter(t => t.status === "Working").length, color: "#8b5cf6" },
          { label: "Total Assigned", val: allAssigned.length, color: "#3b82f6" },
          { label: "Resolved", val: resolvedTickets.length, color: "#10b981" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: `1px solid ${s.color}33`, flex: 1, textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 22, color: s.color }}>{s.val}</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#666" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Section Buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["assigned", "🔧 Assigned"], ["resolved", "✅ Resolved"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveSection(key)}
            style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
              background: activeSection === key ? "#3b82f6" : "#f3f4f6",
              color: activeSection === key ? "#fff" : "#555" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Status Tabs */}
      {activeSection === "assigned" && (
        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: activeTab === tab.key ? "#3b82f6" : "#f3f4f6",
                color: activeTab === tab.key ? "#fff" : "#555" }}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <input type="text" placeholder="🔍 Search tickets..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", marginBottom: 14, boxSizing: "border-box", fontSize: 14 }} />

      {/* Tickets */}
      {tickets.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#999", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
          <p style={{ fontSize: 40 }}>🎫</p><h3>No tickets found</h3>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tickets.map(ticket => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                showReopen={activeSection === "resolved"}
                expanded={expanded}
                setExpanded={setExpanded}
                selected={selected}
                setSelected={setSelected}
                comments={comments}
                setComments={setComments}
                resNotes={resNotes}
                setResNotes={setResNotes}
                dueDates={dueDates}
                setDueDates={setDueDates}
                updating={updating}
                handleUpdate={handleUpdate}
                handleReopen={handleReopen}
                handleComment={handleComment}
              />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  )
}
