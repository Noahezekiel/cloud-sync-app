
// src/components/FileList.js
import React, { useState } from "react";
import { getUrl, remove, uploadData } from "aws-amplify/storage";
import "./FileList.css";

function FileList({ files, filter, view = "list", onFileDeleted, onFileCreated, refreshFiles }) {
  const [loading, setLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [folderName, setFolderName] = useState("");
  const [status, setStatus] = useState("");

  // 👉 Apply filters
  let displayedFiles = files || [];
  if (filter === "recent") displayedFiles = displayedFiles.slice(-5);
  if (filter === "shared") displayedFiles = displayedFiles.filter((f) => f.shared);

  // 👉 Apply search
  if (search.trim()) {
    displayedFiles = displayedFiles.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  //icon rendering
  const getFileIcon = (file) => {
    if (file.isFolder) return "📁"; // ✅ always show folder icon

    const ext = file.name.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif"].includes(ext)) return "🖼️";
    if (["pdf"].includes(ext)) return "📕";
    if (["doc", "docx"].includes(ext)) return "📄";
    if (["mp3", "wav"].includes(ext)) return "🎵";
    if (["mp4", "mov"].includes(ext)) return "🎥";
    return "📄";
  };

  // 👇 Download a file from S3
  const handleDownload = async (file) => {
    if (file.isFolder) return;
    try {
      setLoading(`downloading-${file.name}`);
      const { url } = await getUrl({ key: file.key });
      const link = document.createElement("a");
      link.href = url.toString();
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setLoading(null);
    }
  };

  // 👇 Delete a file/folder from S3
  const handleDelete = async (file) => {
    try {
      setLoading(`deleting-${file.name}`);
      if (file.isFolder) {
        await remove({ key: `${file.key}.keep` });
      } else {
        await remove({ key: file.key });
      }
      if (onFileDeleted) onFileDeleted(file.key);
      if (refreshFiles) refreshFiles(); // ✅ reload list after delete
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(null);
    }
  };

  // 👇 Create a folder
  const handleCreateFolder = async () => {
    const cleanName = folderName.trim().replace(/\/+$/, "");
    if (!cleanName) return setStatus("⚠️ Enter a valid folder name");

    try {
      setStatus("⏳ Creating folder...");

      await uploadData({
        key: `uploads/${cleanName}/.keep`,
        data: "",
      }).result;

      // ✅ Instead of manually pushing, refresh so it’s sorted correctly
      if (refreshFiles) refreshFiles();

      setStatus("📁 Folder created!");
      setFolderName("");
    } catch (err) {
      console.error("Folder creation error:", err);
      setStatus("❌ Failed to create folder");
    }
  };

  return (
    <div className={`file-list ${view}`}>
      {/* 🔍 Search bar + Create folder */}
      <div className="filelist-toolbar">
        <input
          type="text"
          placeholder="🔍 Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="create-folder">
          <input
            type="text"
            placeholder="New folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <button onClick={handleCreateFolder}>📁 Create</button>
        </div>
      </div>
      {status && <p className="status">{status}</p>}

      {/* Files */}
      {displayedFiles.length === 0 ? (
        <p>No files to display.</p>
      ) : (
        <ul>
          {displayedFiles.map((file, idx) => (
            <li key={idx} className="file-item">
              <div className="file-info">
                <span className="file-icon">{getFileIcon(file)}</span>
                <span className={`file-name ${file.isFolder ? "folder-name" : ""}`}>
                  {file.name}
                </span>
                {file.shared && <span className="file-badge">Shared</span>}
              </div>

              <div className="actions">
                {!file.isFolder && (
                  <button
                    className="download"
                    onClick={() => handleDownload(file)}
                    disabled={loading === `downloading-${file.name}`}
                  >
                    {loading === `downloading-${file.name}` ? "…" : "⬇️"}
                  </button>
                )}
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
