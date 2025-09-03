// src/components/Sidebar.js
import React from "react";
import "./Sidebar.css";

function Sidebar({ section, setSection, displayName, email }) {
  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      {/* Profile */}
      <div className="profile">
        <div className="avatar" aria-hidden>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="profile-name">{displayName}</div>
        {email && <div className="profile-email">{email}</div>}
      </div>

      {/* Sidebar nav buttons */}
      <nav className="sidebar-nav" role="navigation" aria-label="Main">
        {[
          { key: "files", label: "📁 My Files" },
          { key: "upload", label: "⬆️ Upload" },
          { key: "folders", label: "📂 Folders" },
          { key: "recent", label: "🕒 Recent" },
          { key: "shared", label: "👥 Shared" },
          { key: "settings", label: "⚙️ Settings" },
        ].map((item) => (
          <button
            key={item.key}
            className={`nav-item ${section === item.key ? "active" : ""}`}
            onClick={() => setSection(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
