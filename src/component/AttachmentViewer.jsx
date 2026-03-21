import React, { useState } from "react"

const AttachmentViewer = ({ attachments }) => {
  const [preview, setPreview] = useState(null)

  // Force download - blob use karo
  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      // Fallback - new tab mein open karo
      window.open(url, "_blank")
    }
  }

  if (!attachments || attachments.length === 0) return null

  const isImage = (filename) => /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
  const isPDF = (filename) => /\.pdf$/i.test(filename)

  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "#555" }}>
        📎 Attachments ({attachments.length})
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {attachments.map((file, i) => (
          <div key={i} onClick={() => setPreview(file)}
            style={{
              cursor: "pointer", border: "1px solid #e5e7eb", borderRadius: 8,
              overflow: "hidden", width: 80, height: 80, position: "relative",
              background: "#f9fafb", display: "flex", alignItems: "center",
              justifyContent: "center", flexDirection: "column",
              transition: "transform 0.15s", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {isImage(file.filename) ? (
              <img src={file.url} alt={file.filename}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : isPDF(file.filename) ? (
              <>
                <span style={{ fontSize: 28 }}>📄</span>
                <span style={{ fontSize: 9, color: "#666", textAlign: "center", padding: "0 4px", marginTop: 2 }}>
                  {file.filename.length > 10 ? file.filename.slice(0, 10) + "..." : file.filename}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 28 }}>📁</span>
                <span style={{ fontSize: 9, color: "#666", textAlign: "center", padding: "0 4px", marginTop: 2 }}>
                  {file.filename.length > 10 ? file.filename.slice(0, 10) + "..." : file.filename}
                </span>
              </>
            )}
            {/* Hover overlay */}
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: 0, transition: "opacity 0.15s", borderRadius: 8
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
            >
              <span style={{ color: "#fff", fontSize: 18 }}>🔍</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Preview */}
      {preview && (
        <div onClick={() => setPreview(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, padding: 24
          }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: "90vw", maxHeight: "90vh", overflow: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#333" }}>
                📎 {preview.filename}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleDownload(preview.url, preview.filename)}
                  style={{ padding: "6px 14px", background: "#3b82f6", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  ⬇️ Download
                </button>
                <button onClick={() => setPreview(null)}
                  style={{ padding: "6px 14px", background: "#f3f4f6", color: "#555", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Content */}
            {isImage(preview.filename) ? (
              <img src={preview.url} alt={preview.filename}
                style={{ maxWidth: "80vw", maxHeight: "75vh", borderRadius: 8, display: "block" }} />
            ) : isPDF(preview.filename) ? (
              <iframe src={preview.url} title={preview.filename}
                style={{ width: "75vw", height: "75vh", border: "none", borderRadius: 8 }} />
            ) : (
              <div style={{ textAlign: "center", padding: 40 }}>
                <p style={{ fontSize: 60 }}>📁</p>
                <p style={{ color: "#666" }}>Preview not available</p>
                <button onClick={() => handleDownload(preview.url, preview.filename)}
                  style={{ padding: "10px 24px", background: "#3b82f6", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 }}>
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AttachmentViewer
