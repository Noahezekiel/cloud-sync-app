// import React, { useState } from "react";
// import { uploadData } from "aws-amplify/storage";
// import "./FolderCreator.css";

// function FolderCreator() {
//   const [folder, setFolder] = useState("");

//   const createFolder = async () => {
//     if (!folder) return alert("Enter a folder name");
//     try {
//       await uploadData({
//         path: `${folder}/.keep`, // create a hidden file to simulate folder
//         data: new Blob([""]),
//       }).result;
//       alert("📁 Folder created!");
//     } catch (error) {
//       console.error("Folder creation error:", error);
//       alert("❌ Failed to create folder");
//     }
//   };

//   return (
//     <div className="folder-creator">
//       <input
//         type="text"
//         placeholder="Enter folder name"
//         value={folder}
//         onChange={(e) => setFolder(e.target.value)}
//       />
//       <button onClick={createFolder}>Create Folder</button>
//     </div>
//   );
// }

// export default FolderCreator;

// FolderCreator.js
import React, { useState } from "react";
import { uploadData } from "aws-amplify/storage";
import "./FolderCreator.css";

function FolderCreator() {
  const [folder, setFolder] = useState("");
  const [status, setStatus] = useState("");

  const createFolder = async () => {
    const folderName = folder.trim().replace(/\/+$/, ""); // clean input
    if (!folderName) return setStatus("⚠️ Enter a valid folder name");

    try {
      setStatus("⏳ Creating folder...");
      await uploadData({
        path: `${folderName}/.keep`,
        data: new Blob([""]),
      }).result;
      setStatus("📁 Folder created!");
      setFolder("");
    } catch (error) {
      console.error("Folder creation error:", error);
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
