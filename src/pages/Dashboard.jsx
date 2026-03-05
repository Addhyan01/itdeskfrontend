 import Navbar from "../component/Navbar"
 import "../styles/dashboard.scss"



 
export default function Dashboard(){

    

return(

<div>

<Navbar/>

<div className="container mt-4">

<h3>Dashboard</h3>

<div className="row">

<div className="col-md-4">
<div className="card p-3">
<h5>Total Tickets</h5>
<p>25</p>
</div>
</div>

<div className="col-md-4">
<div className="card p-3">
<h5>Open Tickets</h5>
<p>10</p>
</div>
</div>

<div className="col-md-4">
<div className="card p-3">
<h5>Resolved Tickets</h5>
<p>15</p>
</div>
</div>

</div>

</div>

</div>

)

}