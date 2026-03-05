import { Link } from "react-router-dom"
import "../styles/navbar.scss"

export default function Navbar(){

return(

<nav className="navbar navbar-dark bg-dark px-4">

<span className="navbar-brand">AI Helpdesk</span>

<div>

<Link className="btn btn-light me-2" to="/">
Dashboard
</Link>

<Link className="btn btn-light me-2" to="/tickets">
My Tickets
</Link>

<Link className="btn btn-success" to="/create-ticket">
New Ticket
</Link>

</div>

</nav>

)

}