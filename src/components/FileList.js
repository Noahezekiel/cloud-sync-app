import React, { useEffect, useState } from "react";
import { list, getUrl } from "aws-amplify/storage";
import "./FileList.css";

function FileList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { items } = await list({ path: "" });
      setFiles(items);
    } catch (error) {
      console.error("List error:", error);
    }
  };

  const downloadFile = async (key) => {
    try {
      const url = await getUrl({ path: key });
      window.open(url.url); // v6 getUrl returns an object with .url
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="file-list">
      <h2>📂 Your Files</h2>
      <ul>
        {files.map((f) => (
          <li key={f.path}>
            {f.path}{" "}
            <button onClick={() => downloadFile(f.path)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;
