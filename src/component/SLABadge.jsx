import React from "react"

const SLABadge = ({ slaStatus, slaHours, createdAt, dueDate }) => {
  if (!slaStatus || slaStatus === "completed") return null

  const colors = {
    green: { bg: "#dcfce7", color: "#166534", label: "On Track" },
    yellow: { bg: "#fef9c3", color: "#a16207", label: "At Risk" },
    red: { bg: "#fee2e2", color: "#991b1b", label: "Overdue" },
  }

  const c = colors[slaStatus] || colors.green
  const hoursElapsed = ((Date.now() - new Date(createdAt)) / (1000 * 60 * 60)).toFixed(1)

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{
        padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
        background: c.bg, color: c.color, display: "flex", alignItems: "center", gap: 4
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, display: "inline-block" }}></span>
        SLA: {c.label}
      </span>
      <span style={{ fontSize: 11, color: "#999" }}>
        {hoursElapsed}h / {slaHours}h
        {dueDate && ` · Due: ${new Date(dueDate).toLocaleDateString("en-IN")}`}
      </span>
    </div>
  )
}

export default SLABadge
