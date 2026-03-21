const API_BASE = "http://localhost:8000/api";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── AUTH ──────────────────────────────────────────────────
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

// ── TICKETS - Common ──────────────────────────────────────
export const createTicket = async (formData) => {
  const res = await fetch(`${API_BASE}/tickets/create`, { method: "POST", headers: { Authorization: `Bearer ${getToken()}` }, body: formData });
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
export const closeTicket = async (ticketId) => {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/close`, { method: "PUT", headers: authHeaders() });
  return res.json();
};
export const reopenTicket = async (ticketId, note = "") => {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/reopen`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ note }) });
  return res.json();
};
export const getDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/tickets/stats`, { headers: authHeaders() });
  return res.json();
};

// ── TICKETS - User ────────────────────────────────────────
export const getMyTickets = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/tickets/my?${params}`, { headers: authHeaders() });
  return res.json();
};

// ── TICKETS - Admin ───────────────────────────────────────
export const getAllTickets = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/tickets/all?${params}`, { headers: authHeaders() });
  return res.json();
};
export const assignTicket = async (ticketId, technicianId, dueDate = "") => {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/assign`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ technicianId, dueDate }) });
  return res.json();
};
export const modifyTicket = async (ticketId, data) => {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/modify`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) });
  return res.json();
};
export const deleteTicket = async (ticketId) => {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}`, { method: "DELETE", headers: authHeaders() });
  return res.json();
};

// ── TICKETS - Technician ──────────────────────────────────
export const getAssignedTickets = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/tickets/assigned?${params}`, { headers: authHeaders() });
  return res.json();
};
export const getResolvedTickets = async () => {
  const res = await fetch(`${API_BASE}/tickets/resolved`, { headers: authHeaders() });
  return res.json();
};
export const updateTicketStatus = async (ticketId, status, comment = "", dueDate = "") => {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/status`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ status, comment, dueDate }) });
  return res.json();
};

// ── ADMIN ─────────────────────────────────────────────────
export const getAllUsers = async () => {
  const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
  return res.json();
};
export const getAllTechnicians = async () => {
  const res = await fetch(`${API_BASE}/admin/technicians`, { headers: authHeaders() });
  return res.json();
};

// ── NOTIFICATIONS ─────────────────────────────────────────
export const getNotifications = async () => {
  const res = await fetch(`${API_BASE}/notifications`, { headers: authHeaders() });
  return res.json();
};
export const markNotificationRead = async (id) => {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: "PUT", headers: authHeaders() });
  return res.json();
};
export const markAllNotificationsRead = async () => {
  const res = await fetch(`${API_BASE}/notifications/read-all`, { method: "PUT", headers: authHeaders() });
  return res.json();
};
