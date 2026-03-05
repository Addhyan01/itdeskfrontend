import { useState } from "react"
import "../styles/ticketable.scss"

export default function TicketTable(){

const [search,setSearch] = useState("")

const tickets = [

{
title:"WiFi not working",
priority:"High",
status:"Open"
},

{
title:"Laptop slow",
priority:"Medium",
status:"In Progress"
},

{
title:"Software crash",
priority:"Low",
status:"Resolved"
}

]

const filteredTickets = tickets.filter(ticket =>
ticket.title.toLowerCase().includes(search.toLowerCase())
)

return(

<div className="ticket-table">

<div className="table-header">

<input
type="text"
placeholder="Search ticket..."
className="form-control search-box"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>

<table className="table table-hover">

<thead>

<tr>

<th>Title</th>
<th>Priority</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{filteredTickets.map((ticket,i)=>(

<tr key={i}>

<td>{ticket.title}</td>

<td>
<span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
{ticket.priority}
</span>
</td>

<td>
<span className={`status-badge ${ticket.status.replace(" ","").toLowerCase()}`}>
{ticket.status}
</span>
</td>

</tr>

))}

</tbody>

</table>

</div>

)

}