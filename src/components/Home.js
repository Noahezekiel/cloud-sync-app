// src/pages/Home.js
import React, { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import { list, getUrl } from "aws-amplify/storage";
import FolderCreator from "./FolderCreator";
import FileUpload from "./FileUpload";
import FileBrowser from "./FileBrowser";
import Layout from "./Layout";
import "./Home.css";

function Home() {
  const { user, signOut } = useAuthenticator();
  const [section, setSection] = useState("files");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const displayName = user?.attributes?.name || user?.username || "User";
  const email = user?.attributes?.email || "";

  // ✅ Updated refreshFiles: detects folders & files
  const refreshFiles = async () => {
    try {
      setLoading(true);
      const { items } = await list({ prefix: "uploads/" });

      const fileData = await Promise.all(
        items.map(async (item) => {
          const relativeKey = item.key.replace("uploads/", "");

          // ✅ Detect folders (ending with "/" or "/.keep")
          if (relativeKey.endsWith("/") || relativeKey.endsWith("/.keep")) {
            return {
              key: item.key.replace(/\.keep$/, ""), // remove .keep
              name: relativeKey
                .replace(/\/.keep$/, "")
                .replace(/\/$/, ""), // clean folder name
              isFolder: true,
            };
          }

          // ✅ Otherwise it's a file
          const url = await getUrl({ key: item.key });
          return {
            key: item.key,
            name: relativeKey,
            url: url.url.toString(),
            isFolder: false,
          };
        })
      );

      // ✅ Remove duplicates
      const uniqueFiles = [];
      const seen = new Set();
      for (const f of fileData) {
        if (!seen.has(f.key)) {
          uniqueFiles.push(f);
          seen.add(f.key);
        }
      }

      // ✅ Sort so folders always appear before files
      uniqueFiles.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name); // alphabetical inside groups
      });

      setFiles(uniqueFiles);
    } catch (err) {
      console.error("Error listing files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFiles();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">☁️ Cloud Sync</div>
        <div className="user-actions">
          <div className="username-small">{displayName}</div>
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      <Layout
        section={section}
        setSection={setSection}
        displayName={displayName}
        email={email}
      >
        <div className="content-header">
          <h1>
            {section === "files" && "Your Files"}
            {section === "upload" && "Upload File"}
            {section === "folders" && "Create Folder"}
            {section === "recent" && "Recent Files"}
            {section === "shared" && "Shared With You"}
            {section === "settings" && "Settings"}
          </h1>
        </div>

        <div className="content-body">
          {section === "files" && (
            <div className="card full-width">
              {loading ? (
                <p>Loading files...</p>
              ) : (
                <FileBrowser
                  files={files}
                  filter="all"
                  refreshFiles={refreshFiles}
                  onFileDeleted={(deletedKey) =>
                    setFiles((prev) => prev.filter((f) => f.key !== deletedKey))
                  }
                />
              )}
            </div>
          )}

          {section === "upload" && (
            <div className="card">
              <FileUpload refreshFiles={refreshFiles} />
            </div>
          )}

          {/* ✅ Folder creation with refresh */}
          {section === "folders" && (
            <div className="card">
              <FolderCreator refreshFiles={refreshFiles} />
            </div>
          )}

          {section === "recent" && (
            <div className="card full-width">
              <FileBrowser
                files={files}
                filter="recent"
                refreshFiles={refreshFiles}
                onFileDeleted={(deletedKey) =>
                  setFiles((prev) => prev.filter((f) => f.key !== deletedKey))
                }
              />
            </div>
          )}

          {section === "shared" && (
            <div className="card full-width">
              <FileBrowser
                files={files}
                filter="shared"
                refreshFiles={refreshFiles}
                onFileDeleted={(deletedKey) =>
                  setFiles((prev) => prev.filter((f) => f.key !== deletedKey))
                }
              />
            </div>
          )}

          {section === "settings" && (
            <div className="card">
              <h3>Profile</h3>
              <p>Display name: {displayName}</p>
              <p>Email: {email || "Not provided"}</p>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}

export default Home;
