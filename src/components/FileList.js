// src/components/FileList.js
import React, { useState } from "react";
import { getUrl, remove, uploadData, copy } from "aws-amplify/storage";
import "./FileList.css";

function FileList({
  files,
  filter,
  view = "list",
  onFileDeleted,
  onFileCreated,
  refreshFiles,
  onFolderOpen,
  currentPath,
  clipboard,        
  setClipboard      
}) {
  const [loading, setLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [folderName, setFolderName] = useState("");
  const [status, setStatus] = useState("");

  // 👉 Filter
  let displayedFiles = files || [];
  if (filter === "recent") displayedFiles = displayedFiles.slice(-5);
  if (filter === "shared") displayedFiles = displayedFiles.filter((f) => f.shared);

  // 👉 Search
  if (search.trim()) {
    displayedFiles = displayedFiles.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // ✅ Icons
  const getFileIcon = (file) => {
    if (file.isFolder) return "📁";
    const ext = file.name.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif"].includes(ext)) return "🖼️";
    if (["pdf"].includes(ext)) return "📕";
    if (["doc", "docx"].includes(ext)) return "📄";
    if (["mp3", "wav"].includes(ext)) return "🎵";
    if (["mp4", "mov"].includes(ext)) return "🎥";
    return "📄";
  };

  // ✅ Download
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

  // ✅ Delete
  const handleDelete = async (file) => {
    try {
      setLoading(`deleting-${file.name}`);
      if (file.isFolder) {
        await remove({ key: `${file.key}.keep` });
      } else {
        await remove({ key: file.key });
      }
      if (onFileDeleted) onFileDeleted(file.key);
      if (refreshFiles) refreshFiles();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(null);
    }
  };

  // ✅ Copy / Cut
  const handleCopy = (file, action = "copy") => {
    setClipboard({ file, action });
    setStatus(`📋 ${action === "copy" ? "Copied" : "Cut"} ${file.name}`);
  };

  // ✅ Paste
  const handlePaste = async () => {
    if (!clipboard?.file) return;
    const { file, action } = clipboard;

    try {
      setStatus("⏳ Pasting...");
      const targetKey = `${currentPath}${file.name}`;

      if (file.isFolder) {
        await uploadData({ key: `${targetKey}/.keep`, data: "" }).result;
      } else {
        await copy({ sourceKey: file.key, destinationKey: targetKey });
      }

      if (action === "cut") {
        await remove({ key: file.key });
      }

      refreshFiles();
      setClipboard(null);
      setStatus("✅ Paste complete");
    } catch (err) {
      console.error("Paste failed:", err);
      setStatus("❌ Paste failed");
    }
  };

  // ✅ Create Folder
  const handleCreateFolder = async () => {
    const cleanName = folderName.trim().replace(/\/+$/, "");
    if (!cleanName) return setStatus("⚠️ Enter a valid folder name");

    try {
      setStatus("⏳ Creating folder...");
      await uploadData({
        key: `${currentPath}${cleanName}/.keep`,
        data: "",
      }).result;

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
      {/* Toolbar */}
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

        {/* ✅ Paste button */}
        {clipboard && (
          <button className="paste-btn" onClick={handlePaste}>
            📥 Paste here
          </button>
        )}
      </div>

      {status && <p className="status">{status}</p>}

      {/* Files */}
      {displayedFiles.length === 0 ? (
        <p>No files to display.</p>
      ) : (
        <ul>
          {displayedFiles.map((file, idx) => (
            <li
              key={idx}
              className="file-item"
              onDoubleClick={() => {
                if (file.isFolder && onFolderOpen) {
                  onFolderOpen(file.key);
                }
              }}
              style={{ cursor: file.isFolder ? "pointer" : "default" }}
            >
              <div className="file-info">
                <span className="file-icon">{getFileIcon(file)}</span>
                <span className={`file-name ${file.isFolder ? "folder-name" : ""}`}>
                  {file.name}
                </span>
              </div>

              {/* Dropdown menu */}
              <div className="actions">
                <select
                  onChange={(e) => {
                    e.stopPropagation();
                    const action = e.target.value;
                    if (action === "download") handleDownload(file);
                    if (action === "delete") handleDelete(file);
                    if (action === "copy") handleCopy(file, "copy");
                    if (action === "cut") handleCopy(file, "cut");
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>⋮ Actions</option>
                  {!file.isFolder && <option value="download">⬇️ Download</option>}
                  <option value="copy">📋 Copy</option>
                  <option value="cut">✂️ Cut</option>
                  <option value="delete">🗑️ Delete</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileList;
