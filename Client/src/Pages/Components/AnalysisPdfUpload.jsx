import { useState, useEffect } from "react";
import "./AnalysisPdfUpload.css";
import { motion } from "framer-motion";
import { FaUserCircle, FaTimes } from "react-icons/fa";

const AnalysisPdfUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      console.log(`Welcome, ${storedUsername}!`);
      setUsername(storedUsername);
    }
  }, []);

  const handleFileDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="top-nav">
        <div className="user-section">
          <div className="user-info">
            <p className="username">Welcome, {username}!</p>
            <p className="tagline">Ready to transform your legal documents?</p>
          </div>
          <div className="user-avatar">
            <FaUserCircle />
          </div>
        </div>
      </div>
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
                <button className="remove-btn" onClick={() => removeFile(index)}>
                  <FaTimes />
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </>
  );
};

export default AnalysisPdfUpload;