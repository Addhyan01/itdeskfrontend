import React, { useEffect, useState } from "react"
import { getUsersWithTickets, createUser } from "../services/api"
import { toast } from "react-toastify"

const statusColor = { Pending: "#6b7280", "In Process": "#f59e0b", Working: "#8b5cf6", Resolved: "#10b981", Closed: "#374151" }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" })
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState("")

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsersWithTickets()
      setUsers(Array.isArray(data) ? data : [])
    } catch { toast.error("Failed to load users") }
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error("Fill all fields"); return }
    setCreating(true)
    try {
      const res = await createUser(form)
      if (res.message && !res.error) {
        toast.success(`✅ ${form.role === "user" ? "User" : "Technician"} created!`)
        setShowModal(false)
        setForm({ name: "", email: "", password: "", role: "user" })
        loadUsers()
      } else toast.error(res.message || "Failed to create")
    } catch { toast.error("Something went wrong") }
    setCreating(false)
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading users...</div>

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0 }}>All Users</h2>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>{users.filter(u => u.role === "user").length} users registered</p>
        </div>
        <button onClick={() => { setShowModal(true); setForm({ ...form, role: "user" }) }}
          style={{ padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
          + Add New User
        </button>
      </div>

      <input type="text" placeholder="🔍 Search users..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", marginBottom: 16, boxSizing: "border-box", fontSize: 14 }} />

      {filtered.filter(u => u.role === "user").length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", color: "#999" }}>
          <p style={{ fontSize: 40 }}>👥</p><h3>No users found</h3>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.filter(u => u.role === "user").map(user => (
            <div key={user._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              {/* User Header */}
              <div style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onClick={() => setExpanded(expanded === user._id ? null : user._id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                    {user.profilePicture ? <img src={user.profilePicture} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} /> : "👤"}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{user.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: "#666" }}>{user.email}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 20, color: "#3b82f6" }}>{user.tickets?.length || 0}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#999" }}>Total Tickets</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 20, color: "#10b981" }}>
                      {user.tickets?.filter(t => t.status === "Resolved" || t.status === "Closed").length || 0}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: "#999" }}>Resolved</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 20, color: "#f59e0b" }}>
                      {user.tickets?.filter(t => t.status === "Pending" || t.status === "In Process").length || 0}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: "#999" }}>Active</p>
                  </div>
                  <span style={{ color: "#999", fontSize: 16 }}>{expanded === user._id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* User Tickets */}
              {expanded === user._id && (
                <div style={{ borderTop: "1px solid #f0f0f0", padding: "16px 20px", background: "#fafafa" }}>
                  <h5 style={{ margin: "0 0 12px", color: "#555" }}>Tickets for {user.name}</h5>
                  {!user.tickets || user.tickets.length === 0 ? (
                    <p style={{ color: "#999", fontSize: 13 }}>No tickets yet</p>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead style={{ background: "#f3f4f6" }}>
                        <tr>
                          {["Ticket ID", "Title", "Category", "Priority", "Status", "Created By", "Date"].map(h => (
                            <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 12, color: "#666", fontWeight: 600 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {user.tickets.map(ticket => (
                          <tr key={ticket._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 12, color: "#666" }}>{ticket.ticketId}</td>
                            <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 500 }}>{ticket.title}</td>
                            <td style={{ padding: "10px 12px", fontSize: 12, color: "#666" }}>{ticket.category}</td>
                            <td style={{ padding: "10px 12px" }}>
                              <span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: "#fee2e2", color: "#991b1b" }}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: statusColor[ticket.status] + "22", color: statusColor[ticket.status] }}>
                                {ticket.status}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: 12, color: "#666" }}>
                              {ticket.createdBy?.name} <span style={{ color: "#999" }}>({ticket.createdByRole})</span>
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: 12, color: "#999" }}>
                              {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
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

      {/* Create User Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 20px" }}>Create New User</h3>
            <form onSubmit={handleCreate}>
              {[["name", "Full Name", "text"], ["email", "Email Address", "email"], ["password", "Password", "password"]].map(([field, label, type]) => (
                <div key={field} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>{label}</label>
                  <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                    placeholder={label} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box", fontSize: 14 }} />
                </div>
              ))}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}>
                  <option value="user">User</option>
                  <option value="technician">Technician</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" disabled={creating}
                  style={{ flex: 1, padding: "12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                  {creating ? "Creating..." : `Create ${form.role === "user" ? "User" : "Technician"}`}
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
