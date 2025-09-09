import React, { useState } from "react";
import "./FileList.css";

function FileList({ files, filter, view = "list" }) {
  const [loading, setLoading] = useState(null);

  let displayedFiles = files || [];
  if (filter === "recent") displayedFiles = displayedFiles.slice(-5);
  if (filter === "shared") displayedFiles = displayedFiles.filter((f) => f.shared);

  const getFileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif"].includes(ext)) return "🖼️";
    if (["pdf"].includes(ext)) return "📕";
    if (["doc", "docx"].includes(ext)) return "📄";
    if (["mp3", "wav"].includes(ext)) return "🎵";
    if (["mp4", "mov"].includes(ext)) return "🎥";
    return "📁";
  };

  const handleDownload = async (file) => {
    setLoading(`downloading-${file.name}`);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(null);
  };

  const handleDelete = async (file) => {
    setLoading(`deleting-${file.name}`);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(null);
  };

  return (
    <div className={`file-list ${view}`}>
      {displayedFiles.length === 0 ? (
        <p>No files to display.</p>
      ) : (
        <ul>
          {displayedFiles.map((file, idx) => (
            <li key={idx} className="file-item">
              <div className="file-info">
                <span className="file-icon">{getFileIcon(file.name)}</span>
                <span className="file-name">{file.name}</span>
                {file.shared && <span className="file-badge">Shared</span>}
              </div>

              <div className="actions">
                <button
                  className="download"
                  onClick={() => handleDownload(file)}
                  disabled={loading === `downloading-${file.name}`}
                >
                  {loading === `downloading-${file.name}` ? "…" : "⬇️"}
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(file)}
                  disabled={loading === `deleting-${file.name}`}
                >
                  {loading === `deleting-${file.name}` ? "…" : "🗑️"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileList;
