import React, { useState } from "react";
import { Storage } from "aws-amplify";
import "./FolderCreator.css";

function FolderCreator() {
  const [folder, setFolder] = useState("");

  const createFolder = async () => {
    if (!folder) return alert("Enter a folder name");
    await Storage.put(`${folder}/`, ""); // create empty object as folder
    alert("📁 Folder created!");
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
