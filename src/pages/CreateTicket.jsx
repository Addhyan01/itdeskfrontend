import React, {  useState, useContext, useEffect } from 'react'
import "../styles/createticket.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faComments, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from "../context/AuthContext";

import { Link } from 'react-router-dom'

import {   Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnBulletList,
  BtnNumberedList, } from "react-simple-wysiwyg";

  

const CreateTicket = () => {
  const { user, setUser } = useContext(AuthContext);
  

    const [description, setDescription] = useState("")
     const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    });

    useEffect(() => {
    
    
    if (user) {
    
      setProfile({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    
    
    }
    
    }, [user]);

   
    


    
  return (
    <div className="ticket-page">
      
      <div className="ticket-header">
        <h2>Create Support Ticket</h2>
        <p>Describe your issue and our support team will get back to you shortly.</p>
      </div>

      <div className="ticket-layout">

        {/* LEFT SIDE FORM */}
        <div className="ticket-form">

          <div className="form-group">
            <label>Subject <span className='spanrequired'>*</span></label>
            <input type="text" placeholder="Brief description of your issue" />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Category <span className='spanrequired'>*</span></label>
              <select>
                <option>Select a category</option>
                <option>Technical Issue</option>
                <option>Billing</option>
                <option>Account</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority <span className='spanrequired'>*</span></label>
              <select>
                <option>Select priority level</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Created By <span className='spanrequired'>*</span></label>
              <input type="text" value={profile.name} disabled/>
            </div>

          </div>

          <div className="form-group">
            <label>Description <span className='spanrequired'>*</span></label>
            

           <EditorProvider>
            <Toolbar>
      <BtnBold />
      <BtnItalic />
      <BtnUnderline />
      <BtnBulletList />
      <BtnNumberedList />
      
    </Toolbar>
    <Editor
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Please provide detailed information about your issue..."
    />
  </EditorProvider>
          </div>

          <div className="form-group">
            <label>Attachments</label>

            <div className="upload-box">
                <FontAwesomeIcon icon={faCloudArrowUp   } />
              <p>Click to upload or drag and drop</p>
              <span>PNG, JPG, PDF up to 10MB</span>
              <input type="file" multiple/>
            </div>

          </div>

          <div className="btn-group">
            <button className="submit-btn"><FontAwesomeIcon icon={faPaperPlane} /> Submit Ticket</button>
            <button className='submit-btn'> <Link to="/dashboard">Cancel</Link> </button>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="ticket-sidebar">

          <div className="card">
            <h3>Suggested Articles</h3>

            <div className="article">
              <p>How to reset your password</p>
              <span>5 min read</span>
            </div>

            <div className="article">
              <p>Troubleshooting login issues</p>
              <span>3 min read</span>
            </div>

            <div className="article">
              <p>Understanding billing cycles</p>
              <span>4 min read</span>
            </div>

            <div className="article">
              <p>Managing team members</p>
              <span>6 min read</span>
            </div>

          </div>

          <div className="chat-box">

            <h4><FontAwesomeIcon icon={faComments} /></h4>
            <p>Chat with our support team for instant assistance.</p>
            <button>Start Live Chat</button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default CreateTicket