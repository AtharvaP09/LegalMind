// src/components/PDFUpload.js
import React, { useState } from "react";
import "./AnalysisPdfUpload.css";
import { motion } from "framer-motion";

const PDFUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  return (
    <div className="pdf-upload-container">
      <h1 className="title">Upload Your PDF Files</h1>
      <button
        className="upload-btn"
        onClick={() => document.getElementById("fileInput").click()}
      >
        Select PDF Files
      </button>
      <input
        id="fileInput"
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFileUpload}
        hidden
      />

      <div
        className="drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <p>📂 Drag & Drop your PDFs here</p>
      </div>

      {uploadedFiles.length > 0 && (
        <motion.ul
          className="file-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {uploadedFiles.map((file, index) => (
            <li key={index} className="file-item">
              📄 {file.name}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default PDFUpload;