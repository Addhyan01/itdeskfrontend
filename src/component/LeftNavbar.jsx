import React from 'react'
import icon from "../asset/images.png"
import "../styles/leftnavbar.scss"
import { faChartPie, faList, faPlus, faTableColumns, faTicketAlt, faUsers, faUser, faCog  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'
import { NavLink } from 'react-router-dom'





const LeftNavbar = () => {
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
                <NavLink to="/dashboard/tickets" className='menu-items'>
                    <FontAwesomeIcon icon={faTicketAlt} />
                    <p className='menu-item-p'>My Tickets</p>
                </NavLink>
                <NavLink to="/dashboard/create-ticket" className='menu-items'>
                    <FontAwesomeIcon icon={faPlus} />
                    <p className='menu-item-p'>Create Ticket</p>
                </NavLink>
                <NavLink to="/tickets" className='menu-items'>
                    <FontAwesomeIcon icon={faList} />
                    <p className='menu-item-p'>Tickets</p>
                </NavLink>
                <NavLink to="/users" className='menu-items'>
                    <FontAwesomeIcon icon={faUsers} />
                    <p className='menu-item-p'>Users</p>
                </NavLink>
            
            </div>

            <div className='main-menu'>
                
                    <p className='main-menu-p'>Management</p>
                
                <NavLink to="/technicians" className='menu-items'>
                    <FontAwesomeIcon icon={faUsers} />
                    <p className='menu-item-p'>Technacian</p>
                </NavLink>
                <NavLink to="/employees" className='menu-items'>
                    <FontAwesomeIcon icon={faUser} />
                    <p className='menu-item-p'>Employee</p>
                </NavLink>
                <NavLink to="/reports" className='menu-items'>
                    <FontAwesomeIcon icon={faChartPie} />
                    <p className='menu-item-p'>Report</p>
                </NavLink>
            </div>
            <div className='main-menu'>
                
                    <p className='main-menu-p'>Settings</p>
                
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