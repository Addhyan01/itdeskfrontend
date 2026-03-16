import {   useNavigate, useLocation, Link } from "react-router-dom"
import "../styles/navbar.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";




export default function Navbar() {
    const { user, setUser } = useContext(AuthContext);

      const navigate = useNavigate();
      const location = useLocation();
      const routeTitleMap = {
        "/dashboard": "Dashboard",
        "/dashboard/tickets": "My Ticket",
        "/dashboard/create-ticket": "Create Ticket",
      };
      const title = routeTitleMap[location.pathname] || (() => {
        const last = location.pathname.split("/").filter(Boolean).pop();
        if (!last) return "Dashboard";
        return last
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
      })();


    const [ open, setOpen ] = useState(false)
    const handleLogout = () => {
  localStorage.removeItem("token");
    setUser(null);


   navigate("/login");
};

    return (

        <nav className="navbar">
            <p>{title}</p>
            <div className="nav-right">
            <input  type="text" placeholder="Search ticket, IDs, or users..."  />
            
            
            <div className="icon">
                <div className="notification">
                    <i><FontAwesomeIcon icon={faEnvelope} /></i>
                  <span className="dot"></span>
                </div>
                
                <div className="notification">
                    <span><FontAwesomeIcon icon={faBell} /></span>
                     <span className="dot"></span>


                </div>

                
            </div>
            <div className="line"></div>

                    <div className="profile-wrapper">

            
            <button className="profile-button" onClick={() => setOpen(!open)}>
                <div className="username"><p>{user?.name}
</p>
            
            </div>
            <div className="usericon">
                 <img className="profile" src={user?.profilePicture || "/default-avatar.png"} alt="" />
                <p><FontAwesomeIcon icon={faAngleDown} /></p>


            </div>
                
               
            
            
            </button>
            {open && (
            <div className="dropdown">
              <p>
                <Link to="/dashboard/profile" >Profile 
                </Link>
              </p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          )}
          </div>

            </div>
            
            
        </nav>

    )

}