import React from 'react'
import "../styles/ticketable.scss"
import { useState, useEffect } from 'react'

const TicketTable = ({ statusFilter = 'All', priorityFilter = 'All' }) => {
const tickets = [
  {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-002",
    name: "Emma Wilson",
    email: "emma@company.com",
    subject: "Billing inquiry",
    desc: "Questions about recent subscription charges",
    status: "Pending",
    priority: "Medium",
    updated: "4 hours ago",
    img: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: "#TK-2024-003",
    name: "Michael Chen",
    email: "michael@startup.io",
    subject: "API integration request",
    desc: "Need webhook support for payments",
    status: "Resolved",
    priority: "Low",
    updated: "1 day ago",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "#TK-2024-004",
    name: "Sophia Brown",
    email: "sophia@domain.com",
    subject: "Password reset problem",
    desc: "Password reset email not received",
    status: "Open",
    priority: "High",
    updated: "3 hours ago",
    img: "https://i.pravatar.cc/40?img=4",
  },
    {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-005",
    name: "Daniel Lee",
    email: "daniel@tech.io",
    subject: "Dashboard loading slow",
    desc: "Analytics dashboard takes too long to load",
    status: "Pending",
    priority: "Medium",
    updated: "6 hours ago",
    img: "https://i.pravatar.cc/40?img=5",
  },
    {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-006",
    name: "Olivia Martin",
    email: "olivia@mail.com",
    subject: "Unable to upload files",
    desc: "Error while uploading documents",
    status: "Open",
    priority: "High",
    updated: "1 hour ago",
    img: "https://i.pravatar.cc/40?img=6",
  },
  {
    id: "#TK-2024-007",
    name: "James Anderson",
    email: "james@site.com",
    subject: "Payment gateway error",
    desc: "Transaction failed during checkout",
    status: "Pending",
    priority: "High",
    updated: "5 hours ago",
    img: "https://i.pravatar.cc/40?img=7",
  },
    {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-008",
    name: "Isabella Garcia",
    email: "isabella@mail.com",
    subject: "Profile update issue",
    desc: "Unable to update profile details",
    status: "Resolved",
    priority: "Low",
    updated: "2 days ago",
    img: "https://i.pravatar.cc/40?img=8",
  },
  {
    id: "#TK-2024-009",
    name: "William Taylor",
    email: "william@company.com",
    subject: "Notification not working",
    desc: "Email notifications not received",
    status: "Open",
    priority: "Medium",
    updated: "7 hours ago",
    img: "https://i.pravatar.cc/40?img=9",
  },
  {
    id: "#TK-2024-010",
    name: "Ava Thompson",
    email: "ava@startup.io",
    subject: "UI glitch in dashboard",
    desc: "Buttons overlapping in mobile view",
    status: "Resolved",
    priority: "Low",
    updated: "3 days ago",
    img: "https://i.pravatar.cc/40?img=10",
  },
    {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-002",
    name: "Emma Wilson",
    email: "emma@company.com",
    subject: "Billing inquiry",
    desc: "Questions about recent subscription charges",
    status: "Pending",
    priority: "Medium",
    updated: "4 hours ago",
    img: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: "#TK-2024-003",
    name: "Michael Chen",
    email: "michael@startup.io",
    subject: "API integration request",
    desc: "Need webhook support for payments",
    status: "Resolved",
    priority: "Low",
    updated: "1 day ago",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "#TK-2024-004",
    name: "Sophia Brown",
    email: "sophia@domain.com",
    subject: "Password reset problem",
    desc: "Password reset email not received",
    status: "Open",
    priority: "High",
    updated: "3 hours ago",
    img: "https://i.pravatar.cc/40?img=4",
  },
    {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-005",
    name: "Daniel Lee",
    email: "daniel@tech.io",
    subject: "Dashboard loading slow",
    desc: "Analytics dashboard takes too long to load",
    status: "Pending",
    priority: "Medium",
    updated: "6 hours ago",
    img: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: "#TK-2024-006",
    name: "Olivia Martin",
    email: "olivia@mail.com",
    subject: "Unable to upload files",
    desc: "Error while uploading documents",
    status: "Open",
    priority: "High",
    updated: "1 hour ago",
    img: "https://i.pravatar.cc/40?img=6",
  },
  {
    id: "#TK-2024-007",
    name: "James Anderson",
    email: "james@site.com",
    subject: "Payment gateway error",
    desc: "Transaction failed during checkout",
    status: "Pending",
    priority: "High",
    updated: "5 hours ago",
    img: "https://i.pravatar.cc/40?img=7",
  },
    {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-008",
    name: "Isabella Garcia",
    email: "isabella@mail.com",
    subject: "Profile update issue",
    desc: "Unable to update profile details",
    status: "Resolved",
    priority: "Low",
    updated: "2 days ago",
    img: "https://i.pravatar.cc/40?img=8",
  },
  {
    id: "#TK-2024-009",
    name: "William Taylor",
    email: "william@company.com",
    subject: "Notification not working",
    desc: "Email notifications not received",
    status: "Open",
    priority: "Medium",
    updated: "7 hours ago",
    img: "https://i.pravatar.cc/40?img=9",
  },
  {
    id: "#TK-2024-010",
    name: "Ava Thompson",
    email: "ava@startup.io",
    subject: "UI glitch in dashboard",
    desc: "Buttons overlapping in mobile view",
    status: "Resolved",
    priority: "Low",
    updated: "3 days ago",
    img: "https://i.pravatar.cc/40?img=10",
  },
  {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-002",
    name: "Emma Wilson",
    email: "emma@company.com",
    subject: "Billing inquiry",
    desc: "Questions about recent subscription charges",
    status: "Pending",
    priority: "Medium",
    updated: "4 hours ago",
    img: "https://i.pravatar.cc/40?img=2",
  },
    {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-003",
    name: "Michael Chen",
    email: "michael@startup.io",
    subject: "API integration request",
    desc: "Need webhook support for payments",
    status: "Resolved",
    priority: "Low",
    updated: "1 day ago",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "#TK-2024-004",
    name: "Sophia Brown",
    email: "sophia@domain.com",
    subject: "Password reset problem",
    desc: "Password reset email not received",
    status: "Open",
    priority: "High",
    updated: "3 hours ago",
    img: "https://i.pravatar.cc/40?img=4",
  },
  {
    id: "#TK-2024-005",
    name: "Daniel Lee",
    email: "daniel@tech.io",
    subject: "Dashboard loading slow",
    desc: "Analytics dashboard takes too long to load",
    status: "Pending",
    priority: "Medium",
    updated: "6 hours ago",
    img: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: "#TK-2024-006",
    name: "Olivia Martin",
    email: "olivia@mail.com",
    subject: "Unable to upload files",
    desc: "Error while uploading documents",
    status: "Open",
    priority: "High",
    updated: "1 hour ago",
    img: "https://i.pravatar.cc/40?img=6",
  },
  {
    id: "#TK-2024-007",
    name: "James Anderson",
    email: "james@site.com",
    subject: "Payment gateway error",
    desc: "Transaction failed during checkout",
    status: "Pending",
    priority: "High",
    updated: "5 hours ago",
    img: "https://i.pravatar.cc/40?img=7",
  },
    {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-008",
    name: "Isabella Garcia",
    email: "isabella@mail.com",
    subject: "Profile update issue",
    desc: "Unable to update profile details",
    status: "Resolved",
    priority: "Low",
    updated: "2 days ago",
    img: "https://i.pravatar.cc/40?img=8",
  },
  {
    id: "#TK-2024-009",
    name: "William Taylor",
    email: "william@company.com",
    subject: "Notification not working",
    desc: "Email notifications not received",
    status: "Open",
    priority: "Medium",
    updated: "7 hours ago",
    img: "https://i.pravatar.cc/40?img=9",
  },
  {
    id: "#TK-2024-010",
    name: "Ava Thompson",
    email: "ava@startup.io",
    subject: "UI glitch in dashboard",
    desc: "Buttons overlapping in mobile view",
    status: "Resolved",
    priority: "Low",
    updated: "3 days ago",
    img: "https://i.pravatar.cc/40?img=10",
  },
  {
    id: "#TK-2024-001",
    name: "John Smith",
    email: "john@example.com",
    subject: "Login issue on mobile app",
    desc: "Unable to authenticate on iOS device",
    status: "Open",
    priority: "High",
    updated: "2 hours ago",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "#TK-2024-002",
    name: "Emma Wilson",
    email: "emma@company.com",
    subject: "Billing inquiry",
    desc: "Questions about recent subscription charges",
    status: "Pending",
    priority: "Medium",
    updated: "4 hours ago",
    img: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: "#TK-2024-003",
    name: "Michael Chen",
    email: "michael@startup.io",
    subject: "API integration request",
    desc: "Need webhook support for payments",
    status: "Resolved",
    priority: "Low",
    updated: "1 day ago",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "#TK-2024-004",
    name: "Sophia Brown",
    email: "sophia@domain.com",
    subject: "Password reset problem",
    desc: "Password reset email not received",
    status: "Open",
    priority: "High",
    updated: "3 hours ago",
    img: "https://i.pravatar.cc/40?img=4",
  },
  {
    id: "#TK-2024-005",
    name: "Daniel Lee",
    email: "daniel@tech.io",
    subject: "Dashboard loading slow",
    desc: "Analytics dashboard takes too long to load",
    status: "Pending",
    priority: "Medium",
    updated: "6 hours ago",
    img: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: "#TK-2024-006",
    name: "Olivia Martin",
    email: "olivia@mail.com",
    subject: "Unable to upload files",
    desc: "Error while uploading documents",
    status: "Open",
    priority: "High",
    updated: "1 hour ago",
    img: "https://i.pravatar.cc/40?img=6",
  },
  {
    id: "#TK-2024-007",
    name: "James Anderson",
    email: "james@site.com",
    subject: "Payment gateway error",
    desc: "Transaction failed during checkout",
    status: "Pending",
    priority: "High",
    updated: "5 hours ago",
    img: "https://i.pravatar.cc/40?img=7",
  },
  {
    id: "#TK-2024-008",
    name: "Isabella Garcia",
    email: "isabella@mail.com",
    subject: "Profile update issue",
    desc: "Unable to update profile details",
    status: "Resolved",
    priority: "Low",
    updated: "2 days ago",
    img: "https://i.pravatar.cc/40?img=8",
  },
  {
    id: "#TK-2024-009",
    name: "William Taylor",
    email: "william@company.com",
    subject: "Notification not working",
    desc: "Email notifications not received",
    status: "Open",
    priority: "Medium",
    updated: "7 hours ago",
    img: "https://i.pravatar.cc/40?img=9",
  },
  {
    id: "#TK-2024-010",
    name: "Ava Thompson",
    email: "ava@startup.io",
    subject: "UI glitch in dashboard",
    desc: "Buttons overlapping in mobile view",
    status: "Resolved",
    priority: "Low",
    updated: "3 days ago",
    img: "https://i.pravatar.cc/40?img=10",
  },
];

const [currentPage, setCurrentPage] = useState(1);

  const ticketsPerPage = 10;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter]);

  // Apply filters to tickets
  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch = statusFilter === 'All' || ticket.status === statusFilter;
    const priorityMatch = priorityFilter === 'All' || ticket.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const lastIndex = currentPage * ticketsPerPage;
  const firstIndex = lastIndex - ticketsPerPage;

  const currentTickets = filteredTickets.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);    
  return (
    <div className="tableContainer">
      <table>
        <thead>
          <tr>
            <th>TICKET ID</th>
            <th>CUSTOMER</th>
            <th>SUBJECT</th>
            <th>STATUS</th>
            <th>PRIORITY</th>
            <th>LAST UPDATED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {currentTickets.map((ticket, index) => (
            <tr key={index}>
              <td className="ticketId">{ticket.id}</td>

              <td className="customerCell">
                <img src={ticket.img} alt="" />
                <div>
                  <div className="name">{ticket.name}</div>
                  <div className="email">{ticket.email}</div>
                </div>
              </td>

              <td>
                <div className="subject">{ticket.subject}</div>
                <div className="desc">{ticket.desc}</div>
              </td>

              <td>
                <span className={`status ${ticket.status.toLowerCase()}`}>
                  {ticket.status}
                </span>
              </td>

              <td>
                <span className={`priority ${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
              </td>

              <td className="updated">{ticket.updated}</td>

              <td className="actions">
                <a href="/">View</a>
                <a href="/">Edit</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>

      </div>
    </div>
  )
}

export default TicketTable