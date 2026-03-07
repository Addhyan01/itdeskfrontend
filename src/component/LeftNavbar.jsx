import React from 'react'
import icon from "../asset/images.png"
import "../styles/leftnavbar.scss"
import { faChartPie, faList, faPlus, faTableColumns, faTicketAlt, faUsers, faUser, faCog  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'





const LeftNavbar = () => {
  return (
    <div className='leftNavbar'>
        <div className='logo'>
            <img src={icon} alt="Logo" />
        </div>
        
        <div className='nav-items'>
            <div className='main-menu'>
                <p className='main-menu-p'>Main Menu</p>
                <div className='menu-items'>
                    <FontAwesomeIcon icon={faTableColumns} />
                    <p className='menu-item-p'>Dashboard</p>
                </div>
                <div className='menu-items'>
                    <FontAwesomeIcon icon={faTicketAlt} />
                    <p className='menu-item-p'>My Tickets</p>
                </div>
                <div className='menu-items'>
                    <FontAwesomeIcon icon={faPlus} />
                    <p className='menu-item-p'>Create Ticket</p>
                </div>
                <div className='menu-items'>
                    <FontAwesomeIcon icon={faList} />
                    <p className='menu-item-p'>Tickets</p>
                </div>
                <div className='menu-items'>
                    <FontAwesomeIcon icon={faUsers} />
                    <p className='menu-item-p'>Users</p>
                </div>
            
            </div>

            <div className='main-menu'>
                
                    <p className='main-menu-p'>Management</p>
                
                <div className='menu-items'>
                    <FontAwesomeIcon icon={faUsers} />
                    <p className='menu-item-p'>Technacian</p>
                </div>
                <div className='menu-items'>
                    <FontAwesomeIcon icon={faUser} />
                    <p className='menu-item-p'>Employee</p>
                </div>
                <div className='menu-items'>
                    <FontAwesomeIcon icon={faChartPie} />
                    <p className='menu-item-p'>Report</p>
                </div>
            </div>
            <div className='main-menu'>
                
                    <p className='main-menu-p'>Settings</p>
                
                <div className='menu-items'>
                    <FontAwesomeIcon icon={faCog} />
                    <p className='menu-item-p'>Configuration</p>
                </div>
                <div className='menu-items'>
                    <FontAwesomeIcon icon={faCircleQuestion} />
                    <p className='menu-item-p'>Help desk</p>
                </div>
                
            </div>

           
            
        </div>
    </div>
  )     


}

export default LeftNavbar