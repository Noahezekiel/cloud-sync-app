// // src/components/FileBrowser.js
// import React, { useState, useEffect } from "react";
// import FileList from "./FileList";
// import "./FileBrowser.css";

// function FileBrowser({ files, filter, refreshFiles, onFileDeleted, onFileCreated }) {
//   const [view, setView] = useState("list");

//   useEffect(() => {
//     const savedView = localStorage.getItem("fileView");
//     if (savedView) setView(savedView);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("fileView", view);
//   }, [view]);

//   return (
//     <div className="file-browser">
//       <div className="toolbar">
//         <h2>
//           {filter === "all" && "All Files"}
//           {filter === "recent" && "Recent Files"}
//           {filter === "shared" && "Shared Files"}
//         </h2>
//         <div className="view-toggle">
//           <button
//             className={`view-btn ${view === "list" ? "active" : ""}`}
//             onClick={() => setView("list")}
//           >
//             📄 List
//           </button>
//           <button
//             className={`view-btn ${view === "grid" ? "active" : ""}`}
//             onClick={() => setView("grid")}
//           >
//             🔳 Grid
//           </button>
//         </div>
//       </div>

//       <FileList
//         files={files}
//         filter={filter}
//         view={view}
//         refreshFiles={refreshFiles}
//         onFileDeleted={onFileDeleted}
//         onFileCreated={onFileCreated}   
//       />
//     </div>
//   );
// }

// export default FileBrowser;

// src/components/FileBrowser.js
import React, { useState, useEffect } from "react";
import FileList from "./FileList";
import "./FileBrowser.css";

function FileBrowser({ files, filter, refreshFiles, onFileDeleted, onFileCreated }) {
  const [view, setView] = useState("list");

  // Load saved view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("fileView");
    if (savedView) setView(savedView);
  }, []);

  // Save view preference to localStorage
  useEffect(() => {
    localStorage.setItem("fileView", view);
  }, [view]);

  return (
    <div className="file-browser">
      <div className="toolbar">
        <h2>
          {filter === "all" && "All Files"}
          {filter === "recent" && "Recent Files"}
          {filter === "shared" && "Shared Files"}
        </h2>

        {/* 🔄 Toggle between list/grid view */}
        <div className="view-toggle">
          <button
            className={`view-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            📄 List
          </button>
          <button
            className={`view-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
          >
            🔳 Grid
          </button>
        </div>
      </div>

      {/* Pass props down to FileList */}
      <FileList
        files={files}
        filter={filter}
        view={view}
        refreshFiles={refreshFiles}
        onFileDeleted={onFileDeleted}
        onFileCreated={onFileCreated}
      />
    </div>
  );
}

export default FileBrowser;
