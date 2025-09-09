// // Home.js
// import React, { useState } from "react";
// import { useAuthenticator } from "@aws-amplify/ui-react";
// import { useNavigate } from "react-router-dom"; // 👈 import navigate
// import FolderCreator from "./FolderCreator";
// import FileUpload from "./FileUpload";
// import FileList from "./FileList";
// import Layout from "./Layout";
// import "./Home.css";

// function Home() {
//   const { user, signOut } = useAuthenticator();
//   const [section, setSection] = useState("files");
//   const [files, setFiles] = useState([]);
//   const navigate = useNavigate(); // 👈 create navigate hook

//   const displayName = user?.attributes?.name || user?.username || "User";
//   const email = user?.attributes?.email || "";

//   // Custom handler for logout
//   const handleSignOut = async () => {
//     try {
//       await signOut();       // logs out of Amplify
//       navigate("/");         // 👈 go to root (WelcomePage)
//     } catch (err) {
//       console.error("Error signing out:", err);
//     }
//   };

//   return (
//     <div className="home-container">
//       {/* Navbar */}
//       <header className="navbar">
//         <div className="logo">☁️ Cloud Sync</div>
//         <div className="user-actions">
//           <div className="username-small">{displayName}</div>
//           <button className="signout-btn" onClick={handleSignOut}>
//             Sign Out
//           </button>
//         </div>
//       </header>

//       <Layout
//         section={section}
//         setSection={setSection}
//         displayName={displayName}
//         email={email}
//       >
//         <div className="content-header">
//           <h1>
//             {section === "files" && "Your Files"}
//             {section === "upload" && "Upload File"}
//             {section === "folders" && "Create Folder"}
//             {section === "recent" && "Recent Files"}
//             {section === "shared" && "Shared With You"}
//             {section === "settings" && "Settings"}
//           </h1>
//         </div>

//         <div className="content-body">
//           {section === "files" && (
//             <div className="card full-width">
//               <FileList files={files} />
//             </div>
//           )}

//           {section === "upload" && (
//             <div className="card">
//               <FileUpload setFiles={setFiles} />
//             </div>
//           )}

//           {section === "folders" && (
//             <div className="card">
//               <FolderCreator />
//             </div>
//           )}

//           {section === "recent" && (
//             <div className="card full-width">
//               <FileList files={files} filter="recent" />
//             </div>
//           )}

//           {section === "shared" && (
//             <div className="card full-width">
//               <FileList files={files} filter="shared" />
//             </div>
//           )}

//           {section === "settings" && (
//             <div className="card">
//               <h3>Profile</h3>
//               <p>Display name: {displayName}</p>
//               <p>Email: {email || "Not provided"}</p>
//             </div>
//           )}
//         </div>
//       </Layout>
//     </div>
//   );
// }

// export default Home;



// Home.js
import React, { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import FolderCreator from "./FolderCreator";
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import FileBrowser from "./FileBrowser"; // 👈 NEW import
import Layout from "./Layout";
import "./Home.css";

function Home() {
  const { user, signOut } = useAuthenticator();
  const [section, setSection] = useState("files");
  const [files, setFiles] = useState([
    { name: "report.pdf", shared: true },
    { name: "photo.jpg" },
    { name: "music.mp3" },
    { name: "video.mp4" },
  ]); // 👈 demo files
  const navigate = useNavigate();

  const displayName = user?.attributes?.name || user?.username || "User";
  const email = user?.attributes?.email || "";

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
              {/* 👇 Replace old FileList with Dropbox-style FileBrowser */}
              <FileBrowser files={files} filter="all" />
            </div>
          )}

          {section === "upload" && (
            <div className="card">
              <FileUpload setFiles={setFiles} />
            </div>
          )}

          {section === "folders" && (
            <div className="card">
              <FolderCreator />
            </div>
          )}

          {section === "recent" && (
            <div className="card full-width">
              <FileBrowser files={files} filter="recent" />
            </div>
          )}

          {section === "shared" && (
            <div className="card full-width">
              <FileBrowser files={files} filter="shared" />
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
