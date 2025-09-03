// FileList.js
import React from "react";
import "./FileList.css";

function FileList({ files, filter }) {
  // Apply filtering if needed
  let displayedFiles = files || [];
  if (filter === "recent") {
    displayedFiles = displayedFiles.slice(-5); // example: last 5 files
  }
  if (filter === "shared") {
    displayedFiles = displayedFiles.filter((f) => f.shared); // expects "shared" flag in file object
  }

  return (
    <div className="file-list">
      {displayedFiles.length === 0 ? (
        <p>No files to display.</p>
      ) : (
        <ul>
          {displayedFiles.map((file, idx) => (
            <li key={idx} className="file-item">
              <span className="file-name">{file.name}</span>
              {file.shared && <span className="file-badge">Shared</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileList;



// // FileList.js
// import React, { useEffect, useState } from "react";

// function FileList({ filter }) {
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     // Fetch files (replace with AWS Amplify or backend fetch)
//     let allFiles = [
//       { id: 1, name: "report.pdf", shared: true, updatedAt: "2023-08-30" },
//       { id: 2, name: "photo.jpg", shared: false, updatedAt: "2023-09-01" },
//       { id: 3, name: "notes.docx", shared: false, updatedAt: "2023-09-02" },
//     ];

//     if (filter === "recent") {
//       allFiles = allFiles.slice(0, 2); // example: latest 2
//     } else if (filter === "shared") {
//       allFiles = allFiles.filter((f) => f.shared);
//     }

//     setFiles(allFiles);
//   }, [filter]);

//   return (
//     <ul>
//       {files.map((file) => (
//         <li key={file.id}>{file.name}</li>
//       ))}
//     </ul>
//   );
// }

// export default FileList;
