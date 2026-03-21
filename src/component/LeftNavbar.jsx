import React, {  useState, useContext } from "react";

import icon from "../asset/images.png"
import "../styles/leftnavbar.scss"
import { faChartPie, faList, faPlus, faTableColumns, faTicketAlt, faUsers, faUser, faCog, faUserGear, faUserPlus, faBookOpen, faBookOpenReader, faBullhorn  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'
import { NavLink } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext";





const LeftNavbar = () => {

const { user } = useContext(AuthContext);

console.log("User in LeftNavbar:", user?.role);
const isAdmin = user?.role === "admin";
const isTechnician = user?.role === "technician";
const isUser = user?.role === "user";




  return (
    <div className='leftNavbar'>
        <div className='logo'>
            <img src={icon} alt="Logo" />
        </div>
        
        <div className='nav-items'>
            <div className='main-menu'>
                <p className='main-menu-p'>Main Menu</p>
                <NavLink to="/dashboard"  end className='menu-items'>
                    <FontAwesomeIcon icon={faTableColumns} />
                    <p className='menu-item-p'>Dashboard</p>
                </NavLink>
                {isUser && (
                    <NavLink to="/dashboard/tickets" className='menu-items'>
                        <FontAwesomeIcon icon={faTicketAlt} />
                        <p className='menu-item-p'>My Tickets</p>
                    </NavLink>
                )}
                   {isAdmin && (
                    <NavLink to="/dashboard/tickets" className='menu-items'>
                        <FontAwesomeIcon icon={faTicketAlt} />
                        <p className='menu-item-p'>All Tickets</p>
                    </NavLink>
                )}
               
                <NavLink to="/dashboard/create-ticket" className='menu-items'>
                    <FontAwesomeIcon icon={faPlus} />
                    <p className='menu-item-p'>Create Ticket</p>
                </NavLink>

                { isAdmin && (
                    <NavLink to="/tickets" className='menu-items'>
                        <FontAwesomeIcon icon={faList} />
                        <p className='menu-item-p'>Assign Tickets to</p>
                    </NavLink>
                )}

                
                
                { isTechnician && (
                    <NavLink to="/tickets" className='menu-items'>
                        <FontAwesomeIcon icon={faList} />
                        <p className='menu-item-p'>Assign Tickets</p>
                    </NavLink>
                )}
            
            </div>

            <div className='main-menu'>
                
                    <p className='main-menu-p'>Management</p>
                {isAdmin && (
                         <NavLink to="/technicians" className='menu-items'>
                    <FontAwesomeIcon icon={faUsers} />
                    <p className='menu-item-p'>Technacian</p>
                </NavLink>

                )}
               
                { isTechnician && ( 
                    <NavLink to="/technicians" className='menu-items'>
                    <FontAwesomeIcon icon={faUsers} />
                    <p className='menu-item-p'> My Performance</p>
                </NavLink>
                )}



                
                {isAdmin && (
                    <NavLink to="/employees" className='menu-items'>
                        <FontAwesomeIcon icon={faUser} />
                        <p className='menu-item-p'>Employee</p>
                    </NavLink>
                )}
                <NavLink to="/reports" className='menu-items'>
                    <FontAwesomeIcon icon={faChartPie} />
                    <p className='menu-item-p'>Report</p>
                </NavLink>
                { !isAdmin &&  ( 
                    <NavLink to="/technicians" className='menu-items'>
                    <FontAwesomeIcon icon={faBookOpenReader} />
                    <p className='menu-item-p'> Knowledge Center</p>
                </NavLink>
                )}
                { !isAdmin &&  ( 
                    <NavLink to="/technicians" className='menu-items'>
                    <FontAwesomeIcon icon={faBullhorn} />
                    <p className='menu-item-p'>Announcements</p>
                </NavLink>
                )}
                { isAdmin &&  ( 
                    <NavLink to="/technicians" className='menu-items'>
                    <FontAwesomeIcon icon={faUsers} />
                    <p className='menu-item-p'> Add Announcements</p>
                </NavLink>
                )}

                
            </div>
            <div className='main-menu'>
                
                    <p className='main-menu-p'>Settings</p>
                    {isAdmin && (
                        <NavLink to="/configuration" className='menu-items'>
                            <FontAwesomeIcon icon={faUserPlus} />
                            <p className='menu-item-p'>Add Users </p>
                        </NavLink>
                    )}
                    {isAdmin && (
                        <NavLink to="/configuration" className='menu-items'>
                            <FontAwesomeIcon icon={faUserGear} />
                            <p className='menu-item-p'>Add Technisian </p>
                        </NavLink>
                    )}
                    <NavLink to="/configuration" className='menu-items'>
                    <FontAwesomeIcon icon={faUser} />
                    <p className='menu-item-p'>Profile</p>
                </NavLink>
                
                <NavLink to="/configuration" className='menu-items'>
                    <FontAwesomeIcon icon={faCog} />
                    <p className='menu-item-p'>Configuration</p>
                </NavLink>
                <NavLink to="/help-desk" className='menu-items'>
                    <FontAwesomeIcon icon={faCircleQuestion} />
                    <p className='menu-item-p'>Help desk</p>
                </NavLink>
            </div>

           
            
        </div>
    </div>
  )     


}

export default LeftNavbar