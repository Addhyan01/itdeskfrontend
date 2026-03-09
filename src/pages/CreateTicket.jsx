import { useState } from "react"
import "../styles/createticket.scss"
import HealthModal from "../component/HealthModule"
import MeetingModal from "../component/MeetingModual"
import { analyzeIssue, createTicket } from "../services/api"
import Aimodal from "../component/Aimodal"


export default function CreateTicket(){

const [title,setTitle] = useState("")
const [description,setDescription] = useState("")
const [priority,setPriority] = useState("")
const [category,setCategory] = useState("")
const [slaDate,setSlaDate] = useState("")
const [assignedTo,setAssignedTo] = useState("")
const [attachments,setAttachments] = useState("")
const [comments,setComments] = useState("")

const [showHealth,setShowHealth] = useState(false)

const [showaIssist,setShowAIAssist] = useState(false)

const [deviceInfo,setDeviceInfo] = useState(null)

const [showMeeting,setShowMeeting] = useState(false)
const [solutions,setSolutions] = useState([])
const [loading,setLoading] = useState(false)
const [analysis,setAnalysis] = useState(null)

const [meeting,setMeeting] = useState(null)

const handleSubmit = (e)=>{
e.preventDefault()

const ticketData = {
title,
description,
priority,
category,
slaDate,
assignedTo,
comments
}

console.log(ticketData)
alert("Ticket Submitted")
}


const handleAnalyze = async () => {
    if (!description.trim()) {
        alert("Please enter a description first")
        return
    }
    
    setLoading(true)
    
    try {
        const res = await analyzeIssue(description)

        if(res.success){
            setCategory(res.analysis.category)
            setPriority(res.analysis.priority)
            setSolutions(res.analysis.solution)
            setAnalysis(res.analysis)
        } else {
            alert("Failed to analyze issue")
        }
    } catch (error) {
        console.error("Analysis error:", error)
        alert("Error analyzing issue")
    } finally {
        setLoading(false)
    }
}

return(

<div className="container mt-4">

<h3 className="mb-3">Create New Ticket</h3>
<button
type="button"
className="btn btn-info"
onClick={()=>setShowHealth(true)}
>

System Health

</button>

<div className="ticket-card">

<form onSubmit={handleSubmit}>

{/* Title */}

<div className="mb-3">

<label className="form-label">Title</label>

<input
type="text"
className="form-control"
placeholder="Enter ticket title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

</div>


{/* Row fields */}

<div className="row">

<div className="col-md-3 mb-3">

<label>SLA Due Date</label>

<input
type="date"
className="form-control"
value={slaDate}
onChange={(e)=>setSlaDate(e.target.value)}
/>

</div>


<div className="col-md-3 mb-3">

<label>Category</label>

<select
className="form-control"
value={category}
onChange={(e)=>setCategory(e.target.value)}
>

<option>Select Category</option>
<option>Hardware</option>
<option>Software</option>
<option>Network</option>
<option>Other</option>

</select>

</div>


<div className="col-md-3 mb-3">

<label>Priority</label>

<select
className="form-control"
value={priority}
onChange={(e)=>setPriority(e.target.value)}
>

<option>Select Priority</option>
<option>Low</option>
<option>Medium</option>
<option>High</option>

</select>

</div>


<div className="col-md-3 mb-3">

<label>Assigned To</label>

<select
className="form-control"
value={assignedTo}
onChange={(e)=>setAssignedTo(e.target.value)}
>

<option>Select Technician</option>
<option>Tech 1</option>
<option>Tech 2</option>

</select>

</div>

</div>


{/* Attachment */}

<div className="mb-3">

<label>Attachments</label>

<input type="file" className="form-control"/>

</div>


{/* Description */}

<div className="mb-3">

<label>Description</label>

<textarea
rows="4"
className="form-control"
placeholder="Describe your issue"
value={description}
onChange={(e)=>setDescription(e.target.value)}
></textarea>

</div>

<div className="mb-3">

<label>Comments</label>

<textarea
rows="4"
className="form-control"
placeholder="Comments"
value={comments}
onChange={(e)=>setComments(e.target.value)}
></textarea>

</div>


{/* Buttons */}

<div className="d-flex gap-2">

<button type="button"  onClick={()=> {
    setAnalysis(null)
    setShowAIAssist(true)
}} className="btn btn-secondary">

AI Troubleshoot

</button>

<button
type="button"
className="btn btn-primary"
onClick={()=>setShowMeeting(true)}
>

Schedule Call Addhyan

</button>

<button type="submit" className="btn btn-success">

Submit Ticket

</button>

<button type="button" className="btn btn-outline-danger">

Cancel

</button>

</div>

</form>

</div>
<HealthModal
show={showHealth}
onClose={()=>setShowHealth(false)}
onAttach={(data)=>{

setDeviceInfo(data)
// system health ko comment me add karo
const systemInfoText = `
System Health Info
RAM: ${data.ram}
CPU: ${data.cpu}
Battery: ${data.battery}
Network: ${data.network}
`

setComments((prev)=> prev + "\n" + systemInfoText)


setShowHealth(false)

}}
/>


{meeting && (

<div className="alert alert-info mt-3">

<h6>Scheduled Call</h6>

<p><b>Title:</b> {meeting.title}</p>

<p><b>Technician:</b> {meeting.attendee}</p>

<p><b>Date:</b> {meeting.date}</p>

<p><b>Time:</b> {meeting.startTime} - {meeting.endTime}</p>

</div>

)}
<MeetingModal
show={showMeeting}
onClose={()=>setShowMeeting(false)}
onSchedule={(data)=>setMeeting(data)}
/>


<Aimodal
show={showaIssist}
onClose={()=>setShowAIAssist(false)}
onAnalyze={handleAnalyze}
analysis={analysis}
loading={loading}
solution={solutions}
/>

</div>



)

}