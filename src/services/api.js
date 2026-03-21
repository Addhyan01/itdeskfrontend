const API_BASE = "http://localhost:8000/api";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// AUTH
export const signUp = async (data) => {
  const res = await fetch(`${API_BASE}/auth/signup`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return res.json();
};
export const loginUser = async (data) => {
  const res = await fetch(`${API_BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return res.json();
};
export const fetchUserProfile = async () => {
  try {
    const res = await fetch(`${API_BASE}/auth/profile`, { method: "GET", headers: authHeaders() });
    return res.json();
  } catch (error) { console.log("Profile fetch error", error); }
};
export const updateProfile = async (formData) => {
  const res = await fetch(`${API_BASE}/auth/update-profile`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` }, body: formData });
  return res.json();
};

// TICKETS - User
export const createTicket = async (formData) => {
  const res = await fetch(`${API_BASE}/tickets/create`, { method: "POST", headers: { Authorization: `Bearer ${getToken()}` }, body: formData });
  return res.json();
};
export const getMyTickets = async () => {
  const res = await fetch(`${API_BASE}/tickets/my`, { headers: authHeaders() });
  return res.json();
};
export const getTicketById = async (id) => {
  const res = await fetch(`${API_BASE}/tickets/${id}`, { headers: authHeaders() });
  return res.json();
};
export const addComment = async (ticketId, text) => {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/comment`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ text }) });
  return res.json();
};

// TICKETS - Admin
export const getAllTickets = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/tickets?${params}`, { headers: authHeaders() });
  return res.json();
};
export const assignTicket = async (ticketId, technicianId) => {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/assign`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ technicianId }) });
  return res.json();
};
export const getDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/tickets/admin/stats`, { headers: authHeaders() });
  return res.json();
};

// TICKETS - Technician
export const getAssignedTickets = async () => {
  const res = await fetch(`${API_BASE}/tickets/technician/assigned`, { headers: authHeaders() });
  return res.json();
};
export const updateTicketStatus = async (ticketId, status, comment = "") => {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/status`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ status, comment }) });
  return res.json();
};

// ADMIN
export const getAllUsers = async () => {
  const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
  return res.json();
};
export const getAllTechnicians = async () => {
  const res = await fetch(`${API_BASE}/admin/technicians`, { headers: authHeaders() });
  return res.json();
};
