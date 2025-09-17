// src/components/Home.js
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
  const [clipboard, setClipboard] = useState(null);

  // ✅ Always keep trailing slash
  const [currentPath, setCurrentPath] = useState("uploads/");

  const navigate = useNavigate();
  const displayName = user?.attributes?.name || user?.username || "User";
  const email = user?.attributes?.email || "";

  // ✅ Fetch files & folders
  const refreshFiles = async () => {
    try {
      setLoading(true);
      console.log("Listing path:", currentPath);

      const { items } = await list(currentPath);

      const fileData = await Promise.all(
        items.map(async (item) => {
          let relativeKey = item.key.startsWith(currentPath)
            ? item.key.slice(currentPath.length)
            : item.key;

          // ✅ Only keep direct children (ignore nested subfolders)
          if (relativeKey.includes("/") && !relativeKey.endsWith("/.keep")) {
            return null;
          }

          // ✅ Detect folders
          if (relativeKey.endsWith("/") || relativeKey.endsWith("/.keep")) {
            const folderName = relativeKey
              .replace(/\/.keep$/, "")
              .split("/")
              .filter(Boolean)
              .pop();

            return {
              key: item.key.replace(/\.keep$/, ""),
              name: folderName || "Untitled",
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

      // ✅ Deduplicate + clean nulls
      const seen = new Set();
      const uniqueFiles = fileData
        .filter((f) => f !== null)
        .filter((f) => {
          if (seen.has(f.key)) return false;
          seen.add(f.key);
          return true;
        });

      // ✅ Sort folders before files
      uniqueFiles.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name);
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
  }, [currentPath]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // ✅ Handle folder double-click (called from FileBrowser)
  const handleFolderOpen = (folderKey) => {
    const newPath = folderKey.endsWith("/") ? folderKey : folderKey + "/";
    console.log("Navigating into folder:", newPath);
    setCurrentPath(newPath);
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
          {/* Files Section */}
          {section === "files" && (
            <div className="card full-width">
              {/* ✅ Breadcrumbs */}
              <div className="breadcrumbs">
                <span
                  className="breadcrumb"
                  onClick={() => setCurrentPath("uploads/")}
                >
                  uploads
                </span>
                {currentPath
                  .replace("uploads/", "")
                  .split("/")
                  .filter(Boolean)
                  .map((part, i, arr) => {
                    const path =
                      "uploads/" + arr.slice(0, i + 1).join("/") + "/";
                    return (
                      <span key={i}>
                        {" / "}
                        <span
                          className="breadcrumb"
                          onClick={() => setCurrentPath(path)}
                        >
                          {part}
                        </span>
                      </span>
                    );
                  })}
              </div>

              {loading ? (
                <p>Loading files...</p>
              ) : (
                <FileBrowser
                  files={files}
                  filter="all"
                  refreshFiles={refreshFiles}
                  currentPath={currentPath}
                  onFileDeleted={(deletedKey) =>
                    setFiles((prev) => prev.filter((f) => f.key !== deletedKey))
                  }
                  onFileCreated={(newFile) => setFiles((prev) => [...prev, newFile])}
                  onFolderOpen={handleFolderOpen} // ✅ Hooked here
                  clipboard={clipboard}
                  setClipboard={setClipboard}
                />
              )}
            </div>
          )}

          {/* Upload Section */}
          {section === "upload" && (
            <div className="card">
              <FileUpload refreshFiles={refreshFiles} currentPath={currentPath} />
            </div>
          )}

          {/* Folder Creation */}
          {section === "folders" && (
            <div className="card">
              <FolderCreator refreshFiles={refreshFiles} currentPath={currentPath} />
            </div>
          )}

          {/* Recent Files */}
          {section === "recent" && (
            <div className="card full-width">
              <FileBrowser files={files} filter="recent" refreshFiles={refreshFiles} />
            </div>
          )}

          {/* Shared Files */}
          {section === "shared" && (
            <div className="card full-width">
              <FileBrowser files={files} filter="shared" refreshFiles={refreshFiles} />
            </div>
          )}

          {/* Settings */}
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
