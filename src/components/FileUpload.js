import React, { useState } from "react";
import { uploadData } from "aws-amplify/storage";
import "./FileUpload.css";

function FileUpload() {
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    if (!file) return alert("Please select a file");
    try {
      await uploadData({
        path: file.name,
        data: file,
      }).result;
      alert("✅ File uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Upload failed!");
    }
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
}

export default FileUpload;
