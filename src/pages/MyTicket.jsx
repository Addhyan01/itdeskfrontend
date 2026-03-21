import React, { useEffect, useState } from "react"
import { getMyTickets, addComment, closeTicket } from "../services/api"
import { toast } from "react-toastify"
import SLABadge from "../component/SLABadge"
import AttachmentViewer from "../component/AttachmentViewer"
import Pagination from "../component/Pagination"

const statusColor = { Pending: "#6b7280", "In Process": "#f59e0b", Working: "#8b5cf6", Resolved: "#10b981", Closed: "#374151" }
const priorityColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", Critical: "#7c3aed" }
const PER_PAGE = 10

const TABS = [
  { key: "all",       label: "All",        status: "" },
  { key: "pending",   label: "Pending",    status: "Pending" },
  { key: "inprocess", label: "In Process", status: "In Process" },
  { key: "working",   label: "Working",    status: "Working" },
  { key: "resolved",  label: "Resolved",   status: "Resolved" },
  { key: "closed",    label: "Closed",     status: "Closed" },
]

export default function MyTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [priority, setPriority] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [expanded, setExpanded] = useState(null)
  const [comment, setComment] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const currentTab = TABS.find(t => t.key === activeTab)

  const loadTickets = async (page = 1) => {
    setLoading(true)
    try {
      const filters = {}
      if (currentTab?.status) filters.status = currentTab.status
      if (search) filters.search = search
      if (priority) filters.priority = priority

      const data = await getMyTickets(filters)
      const arr = Array.isArray(data) ? data : []

      // Frontend pagination (getMyTickets returns all)
      const total = arr.length
      setTotalPages(Math.ceil(total / PER_PAGE) || 1)
      const start = (page - 1) * PER_PAGE
      setTickets(arr.slice(start, start + PER_PAGE))
    } catch { toast.error("Failed to load tickets") }
    setLoading(false)
  }

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    setCurrentPage(1); loadTickets(1) }, [activeTab, search, priority])
  useEffect(() => { loadTickets(currentPage) }, [currentPage])

  const handleClose = async (id) => {
    if (!window.confirm("Close this ticket?")) return
    const res = await closeTicket(id)
    if (res.ticket) { toast.success("Ticket closed!"); loadTickets(currentPage) }
    else toast.error(res.message)
  }

  const handleComment = async (ticketId) => {
    if (!comment[ticketId]?.trim()) return
    setSubmitting(true)
    const res = await addComment(ticketId, comment[ticketId])
    if (res.comments) {
      toast.success("Comment added!")
      setComment({ ...comment, [ticketId]: "" })
      loadTickets(currentPage)
    } else toast.error(res.message)
    setSubmitting(false)
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>My Tickets</h2>

      {/* Status Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: activeTab === tab.key ? "#3b82f6" : "#f3f4f6",
              color: activeTab === tab.key ? "#fff" : "#555" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input type="text" placeholder="🔍 Search tickets..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", flex: 1, minWidth: 200 }} />
        <select value={priority} onChange={e => setPriority(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}>
          <option value="">All Priority</option>
          {["Low", "Medium", "High", "Critical"].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {loading ? <p style={{ textAlign: "center", padding: 40 }}>Loading...</p> : tickets.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#999", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
          <p style={{ fontSize: 40 }}>🎫</p>
          <h3>No {currentTab?.label !== "All" ? currentTab?.label : ""} tickets</h3>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tickets.map(ticket => (
              <div key={ticket._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>

                {/* Header */}
                <div style={{ padding: "14px 18px", cursor: "pointer" }}
                  onClick={() => setExpanded(expanded === ticket._id ? null : ticket._id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontFamily: "monospace", background: "#f5f5f5", padding: "2px 8px", borderRadius: 4 }}>{ticket.ticketId}</span>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusColor[ticket.status] + "22", color: statusColor[ticket.status] }}>{ticket.status}</span>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: priorityColor[ticket.priority] + "22", color: priorityColor[ticket.priority] }}>{ticket.priority}</span>
                        {ticket.attachments?.length > 0 && (
                          <span style={{ fontSize: 12, background: "#f0f9ff", color: "#0369a1", padding: "3px 8px", borderRadius: 12 }}>📎 {ticket.attachments.length}</span>
                        )}
                      </div>
                      <h4 style={{ margin: "0 0 6px", fontSize: 15 }}>{ticket.title}</h4>
                      <SLABadge slaStatus={ticket.slaStatus} slaHours={ticket.slaHours} createdAt={ticket.createdAt} dueDate={ticket.dueDate} />
                    </div>
                    <div style={{ textAlign: "right", fontSize: 12, color: "#999", marginLeft: 12 }}>
                      <p style={{ margin: 0 }}>{new Date(ticket.createdAt).toLocaleDateString("en-IN")}</p>
                      {ticket.assignedTo && <p style={{ margin: "4px 0 0" }}>🔧 {ticket.assignedTo.name}</p>}
                      <p style={{ margin: "4px 0 0", color: "#3b82f6" }}>{expanded === ticket._id ? "▲" : "▼"}</p>
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                {expanded === ticket._id && (
                  <div style={{ borderTop: "1px solid #f0f0f0", padding: "14px 18px", background: "#fafafa" }}>
                    <p style={{ color: "#555", fontSize: 14, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: ticket.description }} />

                    <AttachmentViewer attachments={ticket.attachments} />

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

                    {ticket.status !== "Closed" && (
                      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  )
}
