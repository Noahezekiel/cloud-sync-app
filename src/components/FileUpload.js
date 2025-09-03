// // FileUpload.js
// import React, { useState } from "react";
// import { uploadData } from "aws-amplify/storage";
// import "./FileUpload.css";

// function FileUpload() {
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   const uploadFile = async () => {
//     if (!file) return setStatus("⚠️ Please select a file.");

//     // Validate
//     if (file.size > 50 * 1024 * 1024) {
//       return setStatus("⚠️ File is too large (max 50MB).");
//     }

//     try {
//       setUploading(true);
//       setStatus("⏳ Uploading...");
//       setProgress(0);

//       await uploadData({
//         path: `uploads/${Date.now()}-${file.name}`,
//         data: file,
//         options: {
//           onProgress: ({ transferredBytes, totalBytes }) => {
//             const percent = Math.round((transferredBytes / totalBytes) * 100);
//             setProgress(percent);
//             setStatus(`Uploading... ${percent}%`);
//           },
//         },
//       }).result;

//       setStatus("✅ Upload successful!");
//       setFile(null);
//       setProgress(100);
//     } catch (error) {
//       console.error("Upload error:", error);
//       setStatus(`❌ Upload failed: ${error.message}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="file-upload">
//       <input
//         type="file"
//         onChange={(e) => setFile(e.target.files[0])}
//         disabled={uploading}
//       />
//       <button onClick={uploadFile} disabled={uploading}>
//         {uploading ? "Uploading..." : "Upload"}
//       </button>

//       {progress > 0 && (
//         <progress value={progress} max="100">{progress}%</progress>
//       )}

//       {status && (
//         <p className="status" aria-live="polite">
//           {status}
//         </p>
//       )}
//     </div>
//   );
// }

// export default FileUpload;

// FileUpload.js
import React, { useState } from "react";
import { uploadData } from "aws-amplify/storage";
import "./FileUpload.css";

function FileUpload({ setFiles }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const uploadFile = async () => {
    if (!file) return setStatus("⚠️ Please select a file.");

    try {
      setStatus("⏳ Uploading...");
      const result = await uploadData({
        path: file.name,
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

      // Add uploaded file to FileList
      setFiles((prev) => [...prev, { name: file.name, key: result?.key || file.name }]);
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
