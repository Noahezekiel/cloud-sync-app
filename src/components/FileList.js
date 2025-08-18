import React, { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import "./FileList.css";

function FileList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const result = await Storage.list("");
    setFiles(result);
  };

  const downloadFile = async (key) => {
    const url = await Storage.get(key);
    window.open(url);
  };

  return (
    <div className="file-list">
      <h2>📂 Your Files</h2>
      <ul>
        {files.map((f) => (
          <li key={f.key}>
            {f.key} <button onClick={() => downloadFile(f.key)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;
