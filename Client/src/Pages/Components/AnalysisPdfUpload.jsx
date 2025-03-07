import { useState, useEffect } from "react";
import "./AnalysisPdfUpload.css";
import { motion } from "framer-motion";
import { FaUserCircle, FaTimes } from "react-icons/fa";
import api from "../../api"; // Import the axios instance

const AnalysisPdfUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]); // Store uploaded PDFs
  const [username, setUsername] = useState("");

  // Load the username from session storage
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      console.log(`Welcome, ${storedUsername}!`);
      setUsername(storedUsername);
    }
  }, []);

  // Handle drag-and-drop file upload
  const handleFileDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  // Handle file selection via the file input
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  // Remove a selected file from the list
  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // Function to send PDFs to backend for analysis
  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one PDF before analyzing.");
      return;
    }

    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("pdfs", file);
    });

    try {
      const response = await api.post("/api/Pdf_Analysis", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("Analysis Result:", response.data);
        alert("PDF Analysis Successful! Check console for details.");
      } else {
        alert("Error analyzing PDFs. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the backend.");
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
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

      {/* PDF Upload Section */}
      <div className="pdf-upload-container">
        <h1 className="title">Upload Your PDF Files</h1>

        {/* File Upload Button */}
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

        {/* Drag & Drop Area */}
        <div
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          <p>📂 Drag & Drop your PDFs here</p>
        </div>

        {/* File List Display */}
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

        {/* 🟢 Analyze Button - Sends PDFs to Flask Backend */}
        <button className="analyze-btn" onClick={handleAnalyze}>
          Analyze
        </button>
      </div>
    </>
  );
};

export default AnalysisPdfUpload;
