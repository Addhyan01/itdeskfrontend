import "../styles/createticket.scss"

export default function CreateTicket(){

return(

<div className="ticket-page">

<h3 className="ticket-title">
Ticket <span className="ticket-id">#9712</span> (Creating...)
</h3>

<div className="ticket-layout">

{/* LEFT SIDE */}

<div className="ticket-left">

{/* Customer Information */}

<div className="card-box">

<div className="card-header">
Customer Information <span className="vip">VIP</span>
</div>

<div className="customer-grid">

<div>
<label>First Name</label>
<p>Dr. Jane</p>
</div>

<div>
<label>Last Name</label>
<p>Wells</p>
</div>

<div>
<label>Phone</label>
<p>(650) 226-1228</p>
</div>

<div>
<label>Email Address</label>
<p>jwells@stanford.edu</p>
</div>

<div>
<label>Location</label>
<p>Palo Alto</p>
</div>

</div>

</div>

{/* Nature of Request */}

<div className="card-box">

<label className="labels">Nature of Request</label>

<select className="form-input-drop">

<option>Applications-CommonEpic eHealthRecord</option>

</select>

</div>

{/* Subject */}

<div className="card-box">

<p style={{width:"25px"}}>Subject</p>

<textarea
className="form-input"
placeholder="Enter a description..."
></textarea>

</div>

{/* Details */}

<div className="card-box">

<h4>Details</h4>

<div className="details-grid">

<div>
<label>Severity Level</label>
<p className="link">4 - Service Request</p>
</div>

<div>
<label>Status</label>
<p className="link">New</p>
</div>

<div>
<label>Service Group</label>
<p className="link">Applications-Clinical/Medical</p>
</div>

<div>
<label>Assignee</label>
<p className="link">unassigned</p>
</div>

<div>
<label>Root Cause</label>
<p className="link">none</p>
</div>

</div>

</div>

{/* Notes */}

<div className="notes-grid">

<div className="card-box">
<label>Public Note</label>
<textarea className="form-input"/>
</div>

<div className="card-box">
<label>Private Note</label>
<textarea className="form-input"/>
</div>

</div>

{/* Buttons */}

<div className="ticket-buttons">

<button className="btn-green">Create</button>
<button className="btn-green">Create & Print</button>
<button className="btn-link">Cancel</button>

</div>

</div>

{/* RIGHT SIDEBAR */}

<div className="ticket-right">

<h4>Customer</h4>

<p className="link">Dr. Jane Wells</p>
<p>(650) 226-1228</p>

<hr/>

<p><b>Severity level</b></p>
<p className="link">4 - Service Request</p>

<p><b>Status</b></p>
<p className="link">New</p>

<p><b>Service group</b></p>
<p className="link">Applications-Clinical/Medical</p>

<p><b>Assigned to</b></p>
<p className="link">unassigned</p>

<p><b>Root cause</b></p>
<p>none</p>

</div>

</div>

</div>

)

}