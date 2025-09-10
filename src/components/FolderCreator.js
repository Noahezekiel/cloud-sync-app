// FolderCreator.js
import React, { useState } from "react";
import { uploadData } from "aws-amplify/storage";
import "./FolderCreator.css";

function FolderCreator({ refreshFiles }) {   // 👈 accept refreshFiles
  const [folder, setFolder] = useState("");
  const [status, setStatus] = useState("");

  const createFolder = async () => {
    const folderName = folder.trim().replace(/\/+$/, ""); // clean input
    if (!folderName) return setStatus("⚠️ Enter a valid folder name");

    try {
      setStatus("⏳ Creating folder...");
      await uploadData({
        key: `uploads/${folderName}/.keep`,   // 👈 put folder under "uploads/"
        data: "",
      }).result;

      setStatus(`📁 Folder "${folderName}" created!`);
      setFolder("");
      
      // refresh file list in parent
      if (refreshFiles) refreshFiles();
    } catch (err) {
      console.error("Folder creation error:", err);
      setStatus("❌ Failed to create folder");
    }
  };

  return (
    <div className="folder-creator">
      <div className="row">
        <input
          type="text"
          placeholder="Enter folder name"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
        />
        <button onClick={createFolder}>Create Folder</button>
      </div>
      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default FolderCreator;
