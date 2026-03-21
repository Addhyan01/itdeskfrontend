import React, { useState, useContext, useEffect } from 'react'
import "../styles/createticket.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from "../context/AuthContext"
import { createTicket } from "../services/api"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnBulletList, BtnNumberedList } from "react-simple-wysiwyg"

const CreateTicket = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ title: "", category: "", priority: "" })
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.category || !formData.priority || !description) {
      toast.error("Please fill all required fields")
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("title", formData.title)
      fd.append("category", formData.category)
      fd.append("priority", formData.priority)
      fd.append("description", description)
      files.forEach(f => fd.append("attachments", f))

      const res = await createTicket(fd)
      if (res.ticket) {
        toast.success("Ticket created successfully!")
        navigate("/dashboard/tickets")
      } else {
        toast.error(res.message || "Failed to create ticket")
      }
    } catch (err) {
      toast.error("Something went wrong")
    }
    setLoading(false)
  }

  return (
    <div className="ticket-page">
      <div className="ticket-header">
        <h2>Create Support Ticket</h2>
        <p>Describe your issue and our support team will get back to you shortly.</p>
      </div>
      <div className="ticket-layout">
        <div className="ticket-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Subject <span className='spanrequired'>*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Brief description of your issue" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category <span className='spanrequired'>*</span></label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select a category</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Network">Network</option>
                  <option value="Account">Account</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority <span className='spanrequired'>*</span></label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Created By</label>
                <input type="text" value={user?.name || ""} disabled />
              </div>
            </div>
            <div className="form-group">
              <label>Description <span className='spanrequired'>*</span></label>
              <EditorProvider>
                <Toolbar>
                  <BtnBold /><BtnItalic /><BtnUnderline /><BtnBulletList /><BtnNumberedList />
                </Toolbar>
                <Editor value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your issue in detail..." />
              </EditorProvider>
            </div>
            <div className="form-group">
              <label>Attachments</label>
              <div className="upload-box">
                <FontAwesomeIcon icon={faCloudArrowUp} />
                <p>Click to upload or drag and drop</p>
                <span>PNG, JPG, PDF up to 10MB</span>
                <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
              </div>
              {files.length > 0 && <p style={{marginTop: 8, color: "#666"}}>{files.length} file(s) selected</p>}
            </div>
            <div className="btn-group">
              <button type="submit" className="submit-btn" disabled={loading}>
                <FontAwesomeIcon icon={faPaperPlane} /> {loading ? "Submitting..." : "Submit Ticket"}
              </button>
              <Link to="/dashboard" className='submit-btn' style={{textDecoration:"none",textAlign:"center"}}>Cancel</Link>
            </div>
          </form>
        </div>
        <div className="ticket-sidebar">
          <div className="card">
            <h3>Suggested Articles</h3>
            <div className="article"><p>How to reset your password</p><span>5 min read</span></div>
            <div className="article"><p>Troubleshooting login issues</p><span>3 min read</span></div>
            <div className="article"><p>Understanding billing cycles</p><span>4 min read</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CreateTicket
