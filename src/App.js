import React from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import FolderCreator from "./components/FolderCreator";
import "./App.css";

function CustomSignUpFormFields() {
  const { validationErrors, fields } = useAuthenticator((context) => [context.signUp]);

  return (
    <>
      {/* Full Name */}
      <div className="form-group">
        <label>Full Name</label>
        <input
          {...fields.name}   // ✅ this makes Amplify save it as user.attributes.name
          placeholder="Enter your Full Name"
          required
        />
        <span>{validationErrors.name}</span>
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          {...fields.email}   // ✅ binds to Cognito email
          placeholder="Enter your Email"
          required
        />
        <span>{validationErrors.email}</span>
      </div>

      {/* Password */}
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          {...fields.password}   // ✅ binds to Cognito password
          placeholder="Enter your Password"
          required
        />
        <span>{validationErrors.password}</span>
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          {...fields.confirm_password}   // ✅ binds to Cognito confirm
          placeholder="Confirm your Password"
          required
        />
        <span>{validationErrors.confirm_password}</span>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Authenticator
      components={{
        SignUp: {
          FormFields: CustomSignUpFormFields,
        },
      }}
    >
      {({ signOut, user }) => (
        <div className="App">
          <h1>☁️ Cloud Sync (Mini Dropbox)</h1>
          <p>Welcome, {user?.attributes?.name || user?.username}</p>
          <button onClick={signOut}>Sign Out</button>

          <FolderCreator />
          <FileUpload />
          <FileList />
        </div>
      )}
    </Authenticator>
  );
}
