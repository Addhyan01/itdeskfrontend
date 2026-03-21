import React, { useContext } from "react"
import icon from "../asset/images.png"
import "../styles/leftnavbar.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTableColumns, faTicketAlt, faPlus,
  faUsers, faUser, faCog, faCircleQuestion,
  faClipboardList, faChartPie, 
  faUserPlus, faList
} from "@fortawesome/free-solid-svg-icons"
import { NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const LeftNavbar = () => {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const isAdmin = user?.role === "admin"
  const isTechnician = user?.role === "technician"
  const isUser = user?.role === "user"

  // Role based dashboard link
  const dashboardLink = isAdmin
    ? "/dashboard/admin"
    : isTechnician
    ? "/dashboard/technician"
    : "/dashboard/home"

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  return (
    <div className="leftNavbar">
      <div className="logo">
        <img src={icon} alt="Logo" />
      </div>

      <div className="nav-items">

        {/* MAIN MENU */}
        <div className="main-menu">
          <p className="main-menu-p">Main Menu</p>

          {/* Dashboard - role based link */}
          <NavLink to={dashboardLink} className="menu-items">
            <FontAwesomeIcon icon={faTableColumns} />
            <p className="menu-item-p">Dashboard</p>
          </NavLink>

          {/* USER */}
          {isUser && (<>
            <NavLink to="/dashboard/tickets" className="menu-items">
              <FontAwesomeIcon icon={faTicketAlt} />
              <p className="menu-item-p">My Tickets</p>
            </NavLink>
            <NavLink to="/dashboard/create-ticket" className="menu-items">
              <FontAwesomeIcon icon={faPlus} />
              <p className="menu-item-p">Create Ticket</p>
            </NavLink>
          </>)}

          {/* ADMIN */}
          {isAdmin && (<>
            <NavLink to="/dashboard/all-tickets" className="menu-items">
              <FontAwesomeIcon icon={faList} />
              <p className="menu-item-p">All Tickets</p>
            </NavLink>
            <NavLink to="/dashboard/create-ticket" className="menu-items">
              <FontAwesomeIcon icon={faPlus} />
              <p className="menu-item-p">Create Ticket</p>
            </NavLink>
          </>)}

          {/* TECHNICIAN */}
          {isTechnician && (<>
            <NavLink to="/dashboard/technician-tickets" className="menu-items">
              <FontAwesomeIcon icon={faClipboardList} />
              <p className="menu-item-p">Assigned Tickets</p>
            </NavLink>
            <NavLink to="/dashboard/create-ticket" className="menu-items">
              <FontAwesomeIcon icon={faPlus} />
              <p className="menu-item-p">Create Ticket</p>
            </NavLink>
          </>)}
        </div>

        {/* MANAGEMENT */}
        <div className="main-menu">
          <p className="main-menu-p">Management</p>

          {isAdmin && (<>
            <NavLink to="/dashboard/users" className="menu-items">
              <FontAwesomeIcon icon={faUsers} />
              <p className="menu-item-p">All Users</p>
            </NavLink>
            <NavLink to="/dashboard/technicians" className="menu-items">
              <FontAwesomeIcon icon={faUserPlus} />
              <p className="menu-item-p">Technicians</p>
            </NavLink>
          </>)}

          <NavLink to="/dashboard/reports" className="menu-items">
            <FontAwesomeIcon icon={faChartPie} />
            <p className="menu-item-p">Reports</p>
          </NavLink>
        </div>

        {/* SETTINGS */}
        <div className="main-menu">
          <p className="main-menu-p">Settings</p>
          <NavLink to="/dashboard/profile" className="menu-items">
            <FontAwesomeIcon icon={faUser} />
            <p className="menu-item-p">Profile</p>
          </NavLink>
          <NavLink to="/dashboard/configuration" className="menu-items">
            <FontAwesomeIcon icon={faCog} />
            <p className="menu-item-p">Configuration</p>
          </NavLink>
          <NavLink to="/dashboard/help" className="menu-items">
            <FontAwesomeIcon icon={faCircleQuestion} />
            <p className="menu-item-p">Help Desk</p>
          </NavLink>
        </div>
      </div>

      {/* Role Badge + Logout */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb", margin: "0 8px" }}>
        <div style={{
          background: isAdmin ? "#dbeafe" : isTechnician ? "#fef9c3" : "#dcfce7",
          color: isAdmin ? "#1d4ed8" : isTechnician ? "#a16207" : "#166534",
          borderRadius: 8, padding: "8px 12px", textAlign: "center", fontSize: 13, fontWeight: 600,
          marginBottom: 8
        }}>
          {isAdmin ? "👑 Admin" : isTechnician ? "🔧 Technician" : "👤 User"}
        </div>
        <button onClick={handleLogout} style={{
          width: "100%", padding: "8px", background: "#fee2e2", color: "#991b1b",
          border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600
        }}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default LeftNavbar
