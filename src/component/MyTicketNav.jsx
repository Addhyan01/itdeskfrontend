import React from 'react'
import "../styles/myticketnav.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faCircleCheck, faClock, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import TicketTable from './TicketTable'

const MyTicketNav = () => {
    const [statusFilter, setStatusFilter] = useState('All')
    const [priorityFilter, setPriorityFilter] = useState('All')
    return (
        <div className="my-ticket-nav">

            <div className='cardticket'>
                <div className="nav-item">
                    <div className='cordcontext'>
                        <div className='icon-red'><FontAwesomeIcon icon={faTriangleExclamation} /></div>
                        <div>
                            <h4>open Ticket</h4>
                            <p>12 </p>


                        </div>
                    </div>
                </div>
                <div className="nav-item">
                    <div className='cordcontext'>
                        <div className='icon-yellow'><FontAwesomeIcon icon={faClock} /></div>
                        <div>
                            <h4>open Ticket</h4>
                            <p>12 </p>


                        </div>
                    </div>
                </div>
                <div className="nav-item">
                    <div className='cordcontext'>
                        <div className='icon-green'><FontAwesomeIcon icon={faCircleCheck} /></div>
                        <div>
                            <h4>open Ticket</h4>
                            <p>12 </p>


                        </div>
                    </div>
                </div>
                <div className="nav-item">
                    <div className='cordcontext'>
                        <div className='icon-blue'><FontAwesomeIcon icon={faChartLine} /></div>
                        <div>
                            <h4>open Ticket</h4>
                            <p>12 </p>


                        </div>
                    </div>
                </div>

            </div>

            <div className='nav2'>
                <div className='nav2drop'>
                    <div>
                        <label>Status:</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option>All</option>
                            <option>Open</option>
                            <option>Pending</option>
                            <option>Resolved</option>
                        </select>


                    </div>
                    <div>
                        <label>Priority:</label>
                        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                            <option>All</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>


                    </div>

                </div>

                <div className='nav2filter'>
                    <p> More Filter</p>
                </div>
            </div>

            <TicketTable statusFilter={statusFilter} priorityFilter={priorityFilter} />





        </div>
    )
}

export default MyTicketNav