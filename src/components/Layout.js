// src/components/Layout.js
import React from "react";
import Sidebar from "./Sidebar";
import "./Layout.css";

function Layout({ children, section, setSection, displayName, email }) {
  return (
    <div className="layout">
      <Sidebar
        section={section}
        setSection={setSection}
        displayName={displayName}
        email={email}
      />
      <main className="content">{children}</main>
    </div>
  );
}

export default Layout;
