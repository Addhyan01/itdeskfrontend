const API_BASE = "http://localhost:8000/api"

export const analyzeIssue = async (description) => {

const res = await fetch(`${API_BASE}/ai/analyze`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ description })
})

return res.json()

}

export const createTicket = async (formData) => {

const res = await fetch(`${API_BASE}/tickets/create`, {
method: "POST",
body: formData
})

return res.json()

}