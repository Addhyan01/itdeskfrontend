import { useState } from "react"
import "../styles/modal.scss"

export default function MeetingModal({ show, onClose, onSchedule }) {

const [title,setTitle] = useState("")
const [attendee,setAttendee] = useState("")
const [date,setDate] = useState("")
const [startTime,setStartTime] = useState("")
const [endTime,setEndTime] = useState("")
const [notes,setNotes] = useState("")

if(!show) return null

const handleSubmit = (e) => {

e.preventDefault()

const meeting = {
title,
attendee,
date,
startTime,
endTime,
notes
}

onSchedule(meeting)

onClose()

}

return(

<div className="modal-backdrop">

<div className="modal-box">

<h4>Schedule Support Call</h4>

<form onSubmit={handleSubmit}>

<div className="mb-2">

<label>Meeting Title</label>

<input
className="form-control"
value={title}
onChange={(e)=>setTitle(e.target.value)}
required
/>

</div>

<div className="mb-2">

<label>Technician</label>

<select
className="form-control"
value={attendee}
onChange={(e)=>setAttendee(e.target.value)}
required
>

<option value="">Select Technician</option>
<option>Tech Support 1</option>
<option>Tech Support 2</option>

</select>

</div>

<div className="mb-2">

<label>Date</label>

<input
type="date"
className="form-control"
value={date}
onChange={(e)=>setDate(e.target.value)}
required
/>

</div>

<div className="row">

<div className="col-md-6">

<label>Start Time</label>

<input
type="time"
className="form-control"
value={startTime}
onChange={(e)=>setStartTime(e.target.value)}
required
/>

</div>

<div className="col-md-6">

<label>End Time</label>

<input
type="time"
className="form-control"
value={endTime}
onChange={(e)=>setEndTime(e.target.value)}
required
/>

</div>

</div>

<div className="mt-2">

<label>Notes</label>

<textarea
className="form-control"
value={notes}
onChange={(e)=>setNotes(e.target.value)}
/>

</div>

<div className="modal-buttons mt-3">

<button className="btn btn-success">

Schedule

</button>

<button
type="button"
className="btn btn-secondary"
onClick={onClose}
>

Cancel

</button>

</div>

</form>

</div>

</div>

)

}