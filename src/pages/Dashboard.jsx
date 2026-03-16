import { faBusinessTime, faCircleCheck, faDownload, faStopwatch,  } from "@fortawesome/free-solid-svg-icons"
// import { faTicket} from '@fortawesome/free-regular-svg-icons'
import { faTicket,faClock } from '@fortawesome/free-solid-svg-icons'

import "../styles/dashboard.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import addhyan from "../asset/addhyan.jpeg"
import ChartComponent from "../component/ChartComponent"
import TicketChart from "../component/TicketChart.jsx"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const { user } = useContext(AuthContext);


    const technicians = [
        {
          name: "Sarah Jenkins",
          role: "Network Specialist",
          status: "Available",
          activeTickets: 0,
          avatar: addhyan
        },
        {
          name: "Michael Lee",
          role: "System Administrator",
          status: "Busy",
          activeTickets: 3,
          avatar: addhyan
        },
        {
          name: "Emily Davis",
          role: "Help Desk Technician",
          status: "Available",
          activeTickets: 1,
          avatar: addhyan
        },
        {
          name: "David Wilson",
          role: "IT Support Specialist",
          status: "Busy",
          activeTickets: 5,
          avatar: addhyan
        }
      ];

return (




<div className="dashboard">


<div className="dashboard-container">

    <div className="dashboard-header">  
        <div>
            <h1>Good Morning, {user?.name}</h1>
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
    <div className="stat-icon icon-purple">
        <FontAwesomeIcon icon={faTicket} />

    </div>
    </div>
    
    <div className="card-stats">
    <span className="badge-success">↑ 12%</span>
    <span className="card-subtext">vs last month</span>
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
    
    <div className="card-stats">
    <span className="badge-danger">↓ 12%</span>
    <span className="card-subtext">vs last month</span>
 </div>

</div>


<div className="stat ">

    <div className="stat-top">
    <div className="start-text">
        <p className="card-title">Resolved Today</p>
        <h3 className="card-number">82</h3>
    </div>
    <div className="stat-icon icon-green">
        <FontAwesomeIcon icon={faCircleCheck} />

    </div>
    </div>
    
    <div className="card-stats">
    <span className="badge-success">↑ 18%</span>
    <span className="card-subtext">vs last month</span>
 </div>

</div>


<div className="stat ">

    <div className="stat-top">
    <div className="start-text">
        <p className="card-title">Avg. Resolution </p>
        <h3 className="card-number">1.5h</h3>
    </div>
    <div className="stat-icon icon-blue">
        <FontAwesomeIcon icon={faStopwatch} />

    </div>
    </div>
    
    <div className="card-stats">
    <span className="badge-success">↑ 12%</span>
    <span className="card-subtext">vs last month</span>
 </div>

</div>  


<div className="stat  ">

    <div className="stat-top">
    <div className="start-text">
        <p className="card-title">Overdue Tickets</p>
        <h3 className="card-number">15</h3>
    </div>
    <div className="stat-icon icon-red">
        <FontAwesomeIcon icon={faBusinessTime} />

    </div>
    </div>
    
    <div className="card-stats">
    <span className="badge-success">↑ 12%</span>
    <span className="card-subtext">vs last month</span>
 </div>

</div>


</div>


{/* MAIN SECTION */}

{/* Addhyan main grid for two column layout and right stats panel */} 

<div className="main-grid-new">
        <div className="main-left">
            <TicketChart />

        </div>


        <div className="main-right">
            <h4>Technician Status</h4>
            {/* Technician status section */ }
            {technicians.map((tech, index) => (
                <div className="tech-item" key={index}>

                    <div className="tech-left">
                        <div className="avatar">
                            <img src={tech.avatar} alt="userimage" />
                            <span className={`status-dot ${tech.status === "Available" ? "online" : "busy"}`}></span>
                        </div>

                        <div className="tech-info">
                            <h4 className="card-title card-font">{tech.name}</h4>
                            <p className="card-title">{tech.role}</p>
                        </div>
                    </div>

                    <div className="tech-right">
                        <span className={`badge ${tech.status === "Available" ? "available" : "busy"}`}>{tech.status}</span>
                        <p className="ticket-count">{tech.activeTickets} Active Tickets</p>
                    </div>
                </div>
            ))}   

            <div><button className="create-button">View All </button></div>


            </div>

</div>


<div className="main-grid-two">
    <div className="main-left-two">

    </div>
   
    <div className="main-left-two">
        <h4>Recent <span className="    ">Critical</span>  Task</h4>
            <table className="recent-tasks-table">
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
                        <td><span className="badge badge-critical">Critical</span></td>
                    </tr>

                    <tr>
                        <td>Upgrade VM plan</td>
                        <td>2119196</td>
                        <td>Open</td>
                        <td><span className="badge badge-high">High</span></td>
                    </tr>

                    <tr>
                        <td>Cancel existing VM plan</td>
                        <td>2119192</td>
                        <td>Open</td>
                        <td><span className="badge badge-high">High</span></td>
                    </tr>

                    <tr>
                        <td>Upgrade VM plan</td>
                        <td>2119188</td>
                        <td>Open</td>
                        <td><span className="badge badge-high">High</span></td>
                    </tr>

                </tbody>

            </table>    

            <div><button className="create-button">View All</button></div>
    </div>


     <div className="main-left-two">
        <h4>Recent Tickets</h4>
        <ChartComponent />
        </div>
    

</div>











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
<h2 className="card-number">11</h2>
<p className="card-title">Pending Assignment</p>
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