import React, { useEffect, useState } from "react"
import { getTechniciansWithStats, createUser } from "../services/api"
import { toast } from "react-toastify"

const statusColor = { Pending: "#6b7280", "In Process": "#f59e0b", Working: "#8b5cf6", Resolved: "#10b981", Closed: "#374151" }

export default function AdminTechnicians() {
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "technician" })
  const [creating, setCreating] = useState(false)

  const loadTechnicians = async () => {
    setLoading(true)
    try {
      const data = await getTechniciansWithStats()
      setTechnicians(Array.isArray(data) ? data : [])
    } catch { toast.error("Failed to load technicians") }
    setLoading(false)
  }

  useEffect(() => { loadTechnicians() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error("Fill all fields"); return }
    setCreating(true)
    try {
      const res = await createUser({ ...form, role: "technician" })
      if (res.message && !res.error) {
        toast.success("✅ Technician created!")
        setShowModal(false)
        setForm({ name: "", email: "", password: "", role: "technician" })
        loadTechnicians()
      } else toast.error(res.message || "Failed")
    } catch { toast.error("Something went wrong") }
    setCreating(false)
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading technicians...</div>

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0 }}>All Technicians</h2>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>{technicians.length} technicians registered</p>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
          + Add New Technician
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Technicians", val: technicians.length, color: "#3b82f6" },
          { label: "Active Tickets", val: technicians.reduce((s, t) => s + (t.activeTickets || 0), 0), color: "#f59e0b" },
          { label: "Total Resolved", val: technicians.reduce((s, t) => s + (t.resolvedTickets || 0), 0), color: "#10b981" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: `1px solid ${s.color}33`, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: s.color }}>{s.val}</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {technicians.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", color: "#999" }}>
          <p style={{ fontSize: 40 }}>🔧</p><h3>No technicians yet</h3>
          <p>Add technicians to assign tickets</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {technicians.map(tech => (
            <div key={tech._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onClick={() => setExpanded(expanded === tech._id ? null : tech._id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    {tech.profilePicture ? <img src={tech.profilePicture} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} /> : "🔧"}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{tech.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: "#666" }}>{tech.email}</p>
                    <span style={{ fontSize: 11, background: "#fef9c3", color: "#a16207", padding: "2px 8px", borderRadius: 12, fontWeight: 600 }}>Technician</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#f59e0b" }}>{tech.activeTickets || 0}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#999" }}>Active</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#10b981" }}>{tech.resolvedTickets || 0}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#999" }}>Resolved</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#3b82f6" }}>{tech.totalTickets || 0}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#999" }}>Total</p>
                  </div>
                  <span style={{ color: "#999" }}>{expanded === tech._id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Tech Assigned Tickets */}
              {expanded === tech._id && (
                <div style={{ borderTop: "1px solid #f0f0f0", padding: "16px 20px", background: "#fafafa" }}>
                  <h5 style={{ margin: "0 0 12px", color: "#555" }}>Tickets assigned to {tech.name}</h5>
                  {!tech.tickets || tech.tickets.length === 0 ? (
                    <p style={{ color: "#999", fontSize: 13 }}>No tickets assigned yet</p>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead style={{ background: "#f3f4f6" }}>
                        <tr>
                          {["Ticket ID", "Title", "For User", "Priority", "Status", "Due Date"].map(h => (
                            <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 12, color: "#666", fontWeight: 600 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tech.tickets.map(ticket => (
                          <tr key={ticket._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 12, color: "#666" }}>{ticket.ticketId}</td>
                            <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 500 }}>{ticket.title}</td>
                            <td style={{ padding: "10px 12px", fontSize: 12, color: "#555" }}>{ticket.reportedFor?.name || "—"}</td>
                            <td style={{ padding: "10px 12px" }}>
                              <span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: "#fee2e2", color: "#991b1b" }}>{ticket.priority}</span>
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: statusColor[ticket.status] + "22", color: statusColor[ticket.status] }}>{ticket.status}</span>
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: 12, color: ticket.dueDate && new Date(ticket.dueDate) < new Date() ? "#ef4444" : "#666" }}>
                              {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString("en-IN") : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Technician Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 20px" }}>Add New Technician</h3>
            <form onSubmit={handleCreate}>
              {[["name", "Full Name", "text"], ["email", "Email Address", "email"], ["password", "Password", "password"]].map(([field, label, type]) => (
                <div key={field} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>{label}</label>
                  <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                    placeholder={label} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box", fontSize: 14 }} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" disabled={creating}
                  style={{ flex: 1, padding: "12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                  {creating ? "Creating..." : "Create Technician"}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: "12px", background: "#f3f4f6", color: "#555", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
