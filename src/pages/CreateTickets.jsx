import { useState } from "react"
import "../styles/createtickets.scss"

export default function CreateTicket(){


  const [firstName, setFirstName] = useState("Addhyan Kumar");
  const [lastName, setLastName] = useState("Kumar");
  const [phone, setPhone] = useState("7782844613");
  const [email, setEmail] = useState("addhyan@gmail.com");
  const [customerType, setCustomerType] = useState("Vip");
  const [location, setLocation] = useState("Noida, india")

const [form,setForm] = useState({
firstName:"Addhyan",
lastName:"Kumar",
phone:"",
email:"addhyan@gmail.com",
location:"",
nature:"",
subject:"",
description:"",
severity:"",
status:"New",
serviceGroup:"",
assignee:"",
rootCause:"",
publicNote:"",
privateNote:""
})

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const handleSubmit = (e)=>{
e.preventDefault()
console.log(form)
}

return(

<div className="ticket-container">

<div className="ticket-left">

<h3>Create Ticket </h3>

<form onSubmit={handleSubmit}>

{/* Customer Info */}

<div className="customer-card">


<div className="customer-header">
        <h4>Customer Information</h4>
        <span className="vip-badge">{customerType}</span>
      </div>
<div className="customer-grid">

        <div>
          <p className="label">First Name</p>
          <p className="value">{firstName}</p>
        </div>

        <div>
          <p className="label">Last Name</p>
          <p className="value">{lastName}</p>
        </div>

        <div>
          <p className="label">Phone</p>
          <p className="value">{phone}</p>
        </div>

        <div>
          <p className="label">Email Address</p>
          <p className="value">{email}</p>
        </div>

        <div>
          <p className="label">Location</p>
          <p className="value">{location}</p>
        </div>

      </div>
</div>

{/* Nature of Request */}

<div className="card">

<label className="lable">Nature of Request</label>

<select name="nature" onChange={handleChange}>

<option>Select Request</option>
<option>Application Issue</option>
<option>Network Issue</option>
<option>Hardware Issue</option>

</select>

</div>

{/* Subject */}

<div className="card">

<div className="sub">Subject</div>

<textarea
name="subject"
placeholder="Enter description..."
onChange={handleChange}
/>

</div>

{/* Details */}

<div className="card grid">

<select name="severity" onChange={handleChange}>
<option>Severity Level</option>
<option>1 - Critical</option>
<option>2 - High</option>
<option>3 - Medium</option>
<option>4 - Service Request</option>
</select>

<select name="serviceGroup" onChange={handleChange}>
<option>Service Group</option>
<option>Applications</option>
<option>Network</option>
<option>Database</option>
</select>

</div>

{/* Notes */}

<div className="grid">

<textarea name="publicNote" placeholder="Public Note" onChange={handleChange}/>
<textarea name="privateNote" placeholder="Private Note" onChange={handleChange}/>

</div>

<button type="submit" className="create-btn">
Create Ticket
</button>

</form>

</div>

{/* Right Sidebar */}

<div className="ticket-right">

<h4>Ticket Info</h4>

<p>Status : {form.status}</p>
<p>Severity : {form.severity}</p>

</div>

</div>

)

}