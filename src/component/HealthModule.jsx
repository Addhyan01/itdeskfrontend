import { useEffect, useState } from "react"
import "../styles/modal.scss"

export default function HealthModal({show,onClose,onAttach}){

const [health,setHealth] = useState({
ram:"",
cpu:"",
battery:"",
network:"",
os:""
})

useEffect(()=>{

if(show){

const detectHealth = async()=>{

const ram = navigator.deviceMemory || "Unknown"

const cpu = navigator.hardwareConcurrency || "Unknown"

const network = navigator.connection?.effectiveType || "Unknown"

const os = navigator.userAgentData?.platform || "Unknown"

let batteryLevel = "Unknown"

const netspeed = navigator.connection?.downlink || "Unknown"

    


if(navigator.getBattery){

const battery = await navigator.getBattery()

batteryLevel = Math.round(battery.level * 100) + "%"

}

setHealth({
ram:ram + " GB",
cpu:cpu + " cores",
battery:batteryLevel,
network,
os,
netspeed: netspeed + " Mbps"

})

}

detectHealth()

}

},[show])

if(!show) return null

return(

<div className="modal-backdrop">

<div className="health-modal">

<h4>System Health Check</h4>

<div className="health-list">

<p><b>RAM:</b> {health.ram}</p>

<p><b>CPU:</b> {health.cpu}</p> 

<p><b>OS:</b> {health.os}</p> 

<p><b>Battery:</b> {health.battery}</p>

<p><b>Network:</b> {health.network}</p>

<p><b>Network Speed:</b> {health.netspeed}</p>

</div>

<div className="modal-buttons">

<button
className="btn btn-success"
onClick={()=>onAttach(health)}
>

Attach to Ticket

</button>

<button
className="btn btn-secondary"
onClick={onClose}
>

Close

</button>

</div>

</div>

</div>

)

}