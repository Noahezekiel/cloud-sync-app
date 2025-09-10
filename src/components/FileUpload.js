// src/components/FileUpload.js
import React, { useState } from "react";
import { uploadData } from "aws-amplify/storage";
import "./FileUpload.css";

function FileUpload({ refreshFiles }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const uploadFile = async () => {
    if (!file) return setStatus("⚠️ Please select a file.");

    try {
      setStatus("⏳ Uploading...");
      const key = `uploads/${Date.now()}-${file.name}`; // store under uploads/
      await uploadData({
        key,
        data: file,
        options: {
          onProgress: ({ transferredBytes, totalBytes }) => {
            const percent = Math.round((transferredBytes / totalBytes) * 100);
            setStatus(`Uploading... ${percent}%`);
          },
        },
      }).result;

      setStatus("✅ Upload successful!");
      setFile(null);

      // refresh after upload
      await refreshFiles();
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("❌ Upload failed.");
    }
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default FileUpload;


// // FileUpload.js
// import React, { useState } from "react";
// import { uploadData } from "aws-amplify/storage";
// import "./FileUpload.css";

// function FileUpload({ setFiles }) {
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState("");

//   const uploadFile = async () => {
//     if (!file) return setStatus("⚠️ Please select a file.");

//     try {
//       setStatus("⏳ Uploading...");
//       const result = await uploadData({
//         path: file.name,
//         data: file,
//         options: {
//           onProgress: ({ transferredBytes, totalBytes }) => {
//             const percent = Math.round((transferredBytes / totalBytes) * 100);
//             setStatus(`Uploading... ${percent}%`);
//           },
//         },
//       }).result;

//       setStatus("✅ Upload successful!");
//       setFile(null);

//       // Add uploaded file to FileList
//       setFiles((prev) => [...prev, { name: file.name, key: result?.key || file.name }]);
//     } catch (error) {
//       console.error("Upload error:", error);
//       setStatus("❌ Upload failed.");
//     }
//   };

//   return (
//     <div className="file-upload">
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={uploadFile}>Upload</button>
//       {status && <p className="status">{status}</p>}
//     </div>
//   );
// }

// export default FileUpload;
