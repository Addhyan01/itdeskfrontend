import React, { useState, useContext, useEffect } from 'react'
import "../styles/createticket.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from "../context/AuthContext"
import { createTicket, getAllUsers } from "../services/api"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnBulletList, BtnNumberedList } from "react-simple-wysiwyg"

const CreateTicket = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const isAdmin = user?.role === "admin"
  const isTechnician = user?.role === "technician"
  const isAdminOrTech = isAdmin || isTechnician

  const [formData, setFormData] = useState({ title: "", category: "", priority: "", reportedForId: "" })
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  // Admin/Tech ke liye users fetch karo
  useEffect(() => {
    if (isAdminOrTech) {
      getAllUsers().then(data => {
        // Sirf "user" role wale dikhao
        const onlyUsers = Array.isArray(data) ? data.filter(u => u.role === "user") : []
        setUsers(onlyUsers)
      })
    }
  }, [isAdminOrTech])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.category || !formData.priority || !description) {
      toast.error("Please fill all required fields")
      return
    }

    // Admin/Tech must select a user
    if (isAdminOrTech && !formData.reportedForId) {
      toast.error("Please select the user this ticket is for")
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("title", formData.title)
      fd.append("category", formData.category)
      fd.append("priority", formData.priority)
      fd.append("description", description)
      if (isAdminOrTech) fd.append("reportedForId", formData.reportedForId)
      files.forEach(f => fd.append("attachments", f))

      const res = await createTicket(fd)
      if (res.ticket) {
        toast.success("✅ Ticket created successfully!")
        navigate(isAdmin ? "/dashboard/admin" : isTechnician ? "/dashboard/technician" : "/dashboard/tickets")
      } else {
        toast.error(res.message || "Failed to create ticket")
      }
    } catch (err) {
      toast.error("Something went wrong")
    }
    setLoading(false)
  }

  // Selected user ka naam
  const selectedUser = users.find(u => u._id === formData.reportedForId)

  return (
    <div className="ticket-page">
      <div className="ticket-header">
        <h2>Create Support Ticket</h2>
        <p>
          {user?.role === "user"
            ? "Describe your issue and our support team will get back to you shortly."
            : `Creating ticket as ${user?.role}. Please select the user this ticket is for.`}
        </p>
      </div>

      <div className="ticket-layout">
        <div className="ticket-form">
          <form onSubmit={handleSubmit}>

            {/* Created By Info - always visible */}
            <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 14, color: "#0369a1", fontWeight: 600 }}>
                🧑 Created By: <span style={{ fontWeight: 700 }}>{user?.name}</span>
                <span style={{ marginLeft: 8, padding: "2px 8px", background: "#dbeafe", borderRadius: 20, fontSize: 12, color: "#1d4ed8" }}>
                  {user?.role}
                </span>
              </p>
              {user?.role === "user" && (
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#0369a1" }}>
                  📋 Ticket will be created for: <strong>Self ({user?.name})</strong>
                </p>
              )}
            </div>

            {/* Admin/Tech: Select User Dropdown */}
            {isAdminOrTech && (
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 600 }}>
                  👤 Select User (Ticket is for) <span className="spanrequired">*</span>
                </label>
                <select
                  name="reportedForId"
                  value={formData.reportedForId}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "2px solid #3b82f6", fontSize: 14, marginTop: 6 }}
                >
                  <option value="">-- Select User --</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>

                {/* Selected user details */}
                {selectedUser && (
                  <div style={{ marginTop: 8, padding: "10px 14px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0", fontSize: 13 }}>
                    <p style={{ margin: 0, color: "#166534" }}>
                      ✅ Ticket for: <strong>{selectedUser.name}</strong> · {selectedUser.email}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label>Subject <span className="spanrequired">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Brief description of the issue" />
            </div>

            {/* Category + Priority */}
            <div className="form-row">
              <div className="form-group">
                <label>Category <span className="spanrequired">*</span></label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select category</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Network">Network</option>
                  <option value="Account">Account</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority <span className="spanrequired">*</span></label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description <span className="spanrequired">*</span></label>
              <EditorProvider>
                <Toolbar>
                  <BtnBold /><BtnItalic /><BtnUnderline /><BtnBulletList /><BtnNumberedList />
                </Toolbar>
                <Editor value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." />
              </EditorProvider>
            </div>

            {/* Attachments */}
            <div className="form-group">
              <label>Attachments</label>
              <div className="upload-box">
                <FontAwesomeIcon icon={faCloudArrowUp} />
                <p>Click to upload or drag and drop</p>
                <span>PNG, JPG, PDF up to 10MB</span>
                <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
              </div>
              {files.length > 0 && <p style={{ marginTop: 8, color: "#666", fontSize: 13 }}>{files.length} file(s) selected</p>}
            </div>

            <div className="btn-group">
              <button type="submit" className="submit-btn" disabled={loading}>
                <FontAwesomeIcon icon={faPaperPlane} /> {loading ? "Submitting..." : "Submit Ticket"}
              </button>
              <Link to="/dashboard" className="submit-btn" style={{ textDecoration: "none", textAlign: "center" }}>Cancel</Link>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="ticket-sidebar">
          <div className="card">
            <h3>📋 Ticket Info</h3>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>
              <p>👤 <strong>Creator:</strong> {user?.name} ({user?.role})</p>
              {isAdminOrTech && selectedUser && (
                <p>🎯 <strong>For User:</strong> {selectedUser.name}</p>
              )}
              {!isAdminOrTech && (
                <p>🎯 <strong>For:</strong> Self</p>
              )}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>💡 Priority Guide</h3>
            <div style={{ fontSize: 13, lineHeight: 2 }}>
              <p><span style={{ color: "#7c3aed", fontWeight: 600 }}>● Critical</span> — System down (4hr SLA)</p>
              <p><span style={{ color: "#ef4444", fontWeight: 600 }}>● High</span> — Major issue (24hr SLA)</p>
              <p><span style={{ color: "#f59e0b", fontWeight: 600 }}>● Medium</span> — Normal issue (48hr SLA)</p>
              <p><span style={{ color: "#10b981", fontWeight: 600 }}>● Low</span> — Minor issue (72hr SLA)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTicket
