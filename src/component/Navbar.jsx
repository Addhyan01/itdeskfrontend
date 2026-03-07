import { Link } from "react-router-dom"
import "../styles/navbar.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faEnvelope } from "@fortawesome/free-regular-svg-icons"
import Addhyan from "../asset/addhyan.jpeg"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"




export default function Navbar() {

    const [ open, setOpen ] = useState(false)

    return (

        <nav className="navbar">
            <p>Dashboard</p>
            <div className="nav-right">
            <input  type="text" placeholder="Search ticket, IDs, or users..."  />
            
            
            <div className="icon">
                <div className="notification">
                    <i><FontAwesomeIcon icon={faEnvelope} /></i>
                  <span class="dot"></span>
                </div>
                
                <div className="notification">
                    <span><FontAwesomeIcon icon={faBell} /></span>
                     <span class="dot"></span>


                </div>

                
            </div>
            <div class="line"></div>

                    <div className="profile-wrapper">

            
            <button className="profile-button" onClick={() => setOpen(!open)}>
                <div className="username"><p>Addhyan</p>
            
            </div>
            <div className="usericon">
                 <img className="profile" src={Addhyan} alt="" />
                <p><FontAwesomeIcon icon={faAngleDown} /></p>


            </div>
                
               
            
            
            </button>
            {open && (
            <div className="dropdown">
              <p>Profile</p>
              <p>Logout</p>
            </div>
          )}
          </div>

            </div>
            
            
        </nav>

    )

}