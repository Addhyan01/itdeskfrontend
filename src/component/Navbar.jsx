import { useNavigate, useLocation, Link } from "react-router-dom"
import "../styles/navbar.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell } from "@fortawesome/free-regular-svg-icons"
import { faAngleDown, faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect, useContext, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../services/api"

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const notifRef = useRef(null)

  const routeTitleMap = {
    "/dashboard": "Dashboard",
    "/dashboard/tickets": "My Tickets",
    "/dashboard/create-ticket": "Create Ticket",
    "/dashboard/admin": "Admin Dashboard",
    "/dashboard/technician": "Technician Panel",
    "/dashboard/profile": "Profile",
  }
  const title = routeTitleMap[location.pathname] || (() => {
    const last = location.pathname.split("/").filter(Boolean).pop()
    if (!last) return "Dashboard"
    return last.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  })()

  const fetchNotifs = async () => {
    try {
      const data = await getNotifications()
      if (data.notifications) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (err) {}
  }

  useEffect(() => {
    if (user) {
      fetchNotifs()
      const interval = setInterval(fetchNotifs, 30000) // poll every 30s
      return () => clearInterval(interval)
    }
  }, [user])

  // Close notif dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleMarkRead = async (id) => {
    await markNotificationRead(id)
    fetchNotifs()
  }

  const handleMarkAll = async () => {
    await markAllNotificationsRead()
    fetchNotifs()
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000
    if (diff < 60) return "just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const notifTypeIcon = (type) => {
    const icons = {
      ticket_created: "🎫", ticket_assigned: "👨‍🔧", status_updated: "🔄",
      comment_added: "💬", ticket_reopened: "🔁", ticket_closed: "✅"
    }
    return icons[type] || "🔔"
  }

  return (
    <nav className="navbar">
      <p>{title}</p>
      <div className="nav-right">
        <input type="text" placeholder="Search ticket, IDs, or users..." />

        <div className="icon">
          {/* Notification Bell */}
          <div className="notification" ref={notifRef} style={{ position: "relative" }}>
            <span onClick={() => setNotifOpen(!notifOpen)} style={{ cursor: "pointer" }}>
              <FontAwesomeIcon icon={faBell} />
            </span>
            {unreadCount > 0 && (
              <span className="dot" style={{
                position: "absolute", top: -6, right: -6,
                background: "#ef4444", color: "#fff", borderRadius: "50%",
                fontSize: 10, width: 18, height: 18, display: "flex",
                alignItems: "center", justifyContent: "center", fontWeight: 700
              }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}

            {/* Notification Dropdown */}
            {notifOpen && (
              <div style={{
                position: "absolute", top: 36, right: 0, width: 340,
                background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                zIndex: 1000, border: "1px solid #e5e7eb", overflow: "hidden"
              }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, fontSize: 15 }}>Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAll} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                      <FontAwesomeIcon icon={faCheckDouble} /> Mark all read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: 380, overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 30, textAlign: "center", color: "#999" }}>
                      <p style={{ fontSize: 24 }}>🔔</p>
                      <p>No notifications yet</p>
                    </div>
                  ) : notifications.map(notif => (
                    <div key={notif._id} onClick={() => handleMarkRead(notif._id)}
                      style={{
                        padding: "12px 16px", borderBottom: "1px solid #f9f9f9", cursor: "pointer",
                        background: notif.isRead ? "#fff" : "#eff6ff",
                        transition: "background 0.2s"
                      }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 18 }}>{notifTypeIcon(notif.type)}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: notif.isRead ? 400 : 600, fontSize: 13 }}>{notif.title}</p>
                          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#666" }}>{notif.message}</p>
                          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#999" }}>{timeAgo(notif.createdAt)}</p>
                        </div>
                        {!notif.isRead && (
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", marginTop: 4, flexShrink: 0 }}></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="line"></div>

        <div className="profile-wrapper">
          <button className="profile-button" onClick={() => setOpen(!open)}>
            <div className="username"><p>{user?.name}</p></div>
            <div className="usericon">
              <img className="profile" src={user?.profilePicture || "/default-avatar.png"} alt="" />
              <p><FontAwesomeIcon icon={faAngleDown} /></p>
            </div>
          </button>
          {open && (
            <div className="dropdown">
              <p><Link to="/dashboard/profile">Profile</Link></p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
