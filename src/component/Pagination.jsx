import React from "react"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) pages.push(i)

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 20 }}>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: currentPage === 1 ? "#f9fafb" : "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer", color: currentPage === 1 ? "#999" : "#333", fontWeight: 600, fontSize: 13 }}>
        ← Prev
      </button>

      {pages.map(page => (
        <button key={page} onClick={() => onPageChange(page)}
          style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid", borderColor: currentPage === page ? "#3b82f6" : "#e5e7eb", background: currentPage === page ? "#3b82f6" : "#fff", color: currentPage === page ? "#fff" : "#333", cursor: "pointer", fontWeight: 600, fontSize: 13, minWidth: 36 }}>
          {page}
        </button>
      ))}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: currentPage === totalPages ? "#f9fafb" : "#fff", cursor: currentPage === totalPages ? "not-allowed" : "pointer", color: currentPage === totalPages ? "#999" : "#333", fontWeight: 600, fontSize: 13 }}>
        Next →
      </button>

      <span style={{ fontSize: 13, color: "#666", marginLeft: 4 }}>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  )
}

export default Pagination
