import React, { useState } from "react";
import { Storage } from "aws-amplify";
import "./FileUpload.css";

function FileUpload() {
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    if (!file) return alert("Please select a file");
    await Storage.put(file.name, file);
    alert("✅ File uploaded!");
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
}

export default FileUpload;
