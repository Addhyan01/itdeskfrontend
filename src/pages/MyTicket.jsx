import Navbar from "../component/Navbar"
import TicketTable from "../component/TicketTable"

export default function MyTickets(){

return(

<div>

<Navbar/>

<div className="container mt-4">

<h3>My Tickets</h3>

<div className="mb-3">

<button className="btn btn-secondary me-2">
Assigned To Me
</button>

<button className="btn btn-secondary">
Raised By Me
</button>

</div>

<TicketTable/>

</div>

</div>

)

}