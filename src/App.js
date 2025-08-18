import React from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import FolderCreator from "./components/FolderCreator";
import "./App.css";

function App({ signOut, user }) {
  return (
    <div className="App">
      <h1>☁️ Cloud Sync (Mini Dropbox)</h1>
      <p>Welcome, {user.username}</p>
      <button onClick={signOut}>Sign Out</button>

      <FolderCreator />
      <FileUpload />
      <FileList />
    </div>
  );
}

export default withAuthenticator(App);
