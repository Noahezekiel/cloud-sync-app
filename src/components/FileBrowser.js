import React, { useState, useEffect } from "react";
import FileList from "./FileList";
import "./FileBrowser.css";

function FileBrowser({ files, filter }) {
  const [view, setView] = useState("list"); // default to list

  // Load saved preference on mount
  useEffect(() => {
    const savedView = localStorage.getItem("fileView");
    if (savedView) {
      setView(savedView);
    }
  }, []);

  // Save preference whenever view changes
  useEffect(() => {
    localStorage.setItem("fileView", view);
  }, [view]);

  return (
    <div className="file-browser">
      <div className="toolbar">
        <h2>Your Files</h2>
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

      <FileList files={files} filter={filter} view={view} />
    </div>
  );
}

export default FileBrowser;
