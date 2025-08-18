import React, { useState } from "react";
import { uploadData } from "aws-amplify/storage";
import "./FolderCreator.css";

function FolderCreator() {
  const [folder, setFolder] = useState("");

  const createFolder = async () => {
    if (!folder) return alert("Enter a folder name");
    try {
      await uploadData({
        path: `${folder}/.keep`, // create a hidden file to simulate folder
        data: new Blob([""]),
      }).result;
      alert("📁 Folder created!");
    } catch (error) {
      console.error("Folder creation error:", error);
      alert("❌ Failed to create folder");
    }
  };

  return (
    <div className="folder-creator">
      <input
        type="text"
        placeholder="Enter folder name"
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
      />
      <button onClick={createFolder}>Create Folder</button>
    </div>
  );
}

export default FolderCreator;
