import { faDownload,  } from "@fortawesome/free-solid-svg-icons"
// import { faTicket} from '@fortawesome/free-regular-svg-icons'
import { faTicket,faClock } from '@fortawesome/free-solid-svg-icons'

import Navbar from "../component/Navbar"
import "../styles/dashboard.scss"
import MyTickets from "./MyTicket"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {  faClockFour } from "@fortawesome/free-regular-svg-icons"

export default function Dashboard() {

return (




<div className="dashboard">


<div className="dashboard-container">

    <div className="dashboard-header">  
        <div>
            <h1>Good Morning</h1>
<p>Here's what's happening in the support center today.</p>
        </div>
        <div className="dashboard-actions">
             <select name="severity"  className="form-select">
<option>Today</option>
<option>Yesterday</option>
<option>Last 7 days</option>
<option>Last 30 days</option>
<option>Last 90 days</option>
</select>

<button className="Export"><FontAwesomeIcon icon={faDownload} /> Export</button>

        </div>

    </div>

{/* TOP STATS */}

<div className="top-stats">

<div className="stat ">

    <div className="stat-top">
    <div className="start-text">
        <p className="card-title">Total Ticket</p>
        <h3 className="card-number">1,245</h3>
    </div>
    <div className="stat-icon">
        <FontAwesomeIcon icon={faTicket} />

    </div>
    </div>
    
    <div class="card-stats">
    <span class="badge-success">↑ 12%</span>
    <span class="card-subtext">vs last month</span>
 </div>

</div>



<div className="stat  ">

    <div className="stat-top">
    <div className="start-text">
        <p className="card-title">Pending Assign</p>
        <h3 className="card-number">45</h3>
    </div>
    <div className="stat-icon icon-yellow">
        <FontAwesomeIcon icon={faClock} />

    </div>
    </div>
    
    <div class="card-stats">
    <span class="badge-danger">↓ 12%</span>
    <span class="card-subtext">vs last month</span>
 </div>

</div>


<div className="stat ">

    <div className="stat-top">
    <div className="start-text">
        <p className="card-title">Total Ticket</p>
        <h3 className="card-number">1,245</h3>
    </div>
    <div className="stat-icon">
        <FontAwesomeIcon icon={faTicket} />

    </div>
    </div>
    
    <div class="card-stats">
    <span class="badge-success">↑ 12%</span>
    <span class="card-subtext">vs last month</span>
 </div>

</div>


<div className="stat ">

    <div className="stat-top">
    <div className="start-text">
        <p className="card-title">Total Ticket</p>
        <h3 className="card-number">1,245</h3>
    </div>
    <div className="stat-icon">
        <FontAwesomeIcon icon={faTicket} />

    </div>
    </div>
    
    <div class="card-stats">
    <span class="badge-success">↑ 12%</span>
    <span class="card-subtext">vs last month</span>
 </div>

</div>  


<div className="stat ">

    <div className="stat-top">
    <div className="start-text">
        <p className="card-title">Total Ticket</p>
        <h3 className="card-number">1,245</h3>
    </div>
    <div className="stat-icon">
        <FontAwesomeIcon icon={faTicket} />

    </div>
    </div>
    
    <div class="card-stats">
    <span class="badge-success">↑ 12%</span>
    <span class="card-subtext">vs last month</span>
 </div>

</div>

{/* <div className="stat green">
<h2>1</h2>
<p>Tasks Due This week</p>
</div> */}

{/* <div className="stat gradient">
<div className="multi-stat">

<div>
<h2>463</h2>
<p>Open Requests</p>
</div>

<div>
<h2>15</h2>
<p>On Hold</p>
</div>

<div>
<h2>59</h2>
<p>Closed</p>
</div>

</div>
</div> */}

{/* <div className="stat blue">
<h2>2</h2>
<p>Req. Due Today</p>
</div> */}
{/* 
<div className="stat sky">
<h2>94</h2>
<p>Technician Unassigned</p>
</div> */}

</div>


{/* MAIN SECTION */}

<div className="main-grid">

{/* LEFT PANEL */}

<div className="tasks-panel">

<h4>Open Tasks</h4>

<ul>

<li>
<h6>Login credentials</h6>
<span>Status: Open</span>
</li>

<li>
<h6>Setting up user workstation</h6>
<span>Status: Open</span>
</li>

<li>
<h6>Reported problem analysis</h6>
<span>Status: Open</span>
</li>

<li>
<h6>Test ERP system functionality</h6>
<span>Status: Open</span>
</li>

</ul>

</div>


{/* CENTER PANEL */}

<div className="requests-panel">

<h4>Open Requests</h4>

<table>

<thead>
<tr>
<th>Subject</th>
<th>ID</th>
<th>Status</th>
<th>Priority</th>
</tr>
</thead>

<tbody>

<tr>
<td>Application access issue</td>
<td>2119197</td>
<td>Open</td>
<td>Critical</td>
</tr>

<tr>
<td>Upgrade VM plan</td>
<td>2119196</td>
<td>Open</td>
<td>High</td>
</tr>

<tr>
<td>Cancel existing VM plan</td>
<td>2119192</td>
<td>Open</td>
<td>High</td>
</tr>

<tr>
<td>Upgrade VM plan</td>
<td>2119188</td>
<td>Open</td>
<td>High</td>
</tr>

</tbody>

</table>

</div>


{/* RIGHT PANEL */}

<div className="side-stats">

<div className="side-card yellow">
<h2>3</h2>
<p>Reopened</p>
</div>

<div className="side-card purple">
<h2>87</h2>
<p>Pending Approval</p>
</div>

<div className="side-card gradient2">

<h3>Req. Inflow</h3>

<div className="inflow">
<div>
<h2>1</h2>
<span>Last 24 hours</span>
</div>

<div>
<h2>10</h2>
<span>Last 7 days</span>
</div>

<div>
<h2>23</h2>
<span>Last 30 days</span>
</div>
</div>

</div>

</div>

</div>

</div>
</div>


)
}