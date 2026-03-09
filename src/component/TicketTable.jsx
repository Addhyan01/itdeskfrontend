import { useState } from "react"
import "../styles/ticketable.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"

export default function TicketTable() {

    const [search, setSearch] = useState("")

    const tickets = [

        {
            title: "WiFi not working",
            priority: "High",
            status: "Open",
             created: "2024-06-01"
        },

        {
            title: "Laptop slow",
            priority: "Medium",
            status: "In Progress",  
             created: "2024-06-01"
        },

        {
            title: "Software crash",
            priority: "Low",
            status: "Resolved",
            created: "2024-06-01"
        }

    ]

    const filteredTickets = tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(search.toLowerCase())
    )

    return (

        <div className="ticket-table">


            <table className="table table-hover">

                <thead>

                    <tr>
                        <th> Number</th>

                        <th>Title</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Created date</th>
                        <th>Action</th>
                        

                    </tr>

                </thead>

                <tbody>

                    {filteredTickets.map((ticket, i) => (

                        <tr key={i}>
                            <td>{i + 1}</td>
                            

                            <td>{ticket.title}</td>

                            <td>
                                <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
                                    {ticket.priority}
                                </span>
                            </td>

                            <td>
                                <span className={`status-badge ${ticket.status.replace(" ", "").toLowerCase()}`}>
                                    {ticket.status}
                                </span>
                            </td>   
                            <td>{ticket.created}</td>
                            
                            <td>
                                <button className="button-three-dots"> <FontAwesomeIcon icon={faEllipsis} /></button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    )

}