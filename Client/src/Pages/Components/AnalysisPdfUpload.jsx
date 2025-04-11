import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaUserCircle, FaTimes, FaArrowLeft, FaFilePdf, FaInfoCircle, FaListAlt, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import api from "../../api";
import "./AnalysisPdfUpload.css";

// Loading component to display while analysis is in progress
const AnalysisLoading = () => {
  return (
    <div className="analysis-loading-container">
      <div className="loading-icon">
        <FaSpinner className="spinner" />
      </div>
      <h2>Analyzing Document</h2>
      <p>Our AI is processing your document to extract key information and identify potential issues.</p>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
};

const AnalysisResults = ({ analysisData, onBack }) => {
  return (
    <div className="analysis-results-container">
      <div className="results-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft /> Back to Upload
        </button>
        <h1>Document Analysis Results</h1>
        <div className="document-info">
          <FaFilePdf className="pdf-icon" />
          <span>{analysisData.basicDetails.documentName}</span>
        </div>
      </div>

      <div className="results-sections">
        <section className="results-section basic-details">
          <div className="section-header">
            <FaInfoCircle className="section-icon" />
            <h2>Basic Details</h2>
          </div>
          <div className="section-content">
            <div className="detail-item">
              <h3>Parties</h3>
              <ul>
                {analysisData.basicDetails.parties.map((party, index) => (
                  <li key={index}>{party}</li>
                ))}
              </ul>
            </div>
            <div className="detail-item">
              <h3>Effective Date</h3>
              <p>{analysisData.basicDetails.effectiveDate}</p>
            </div>
            <div className="detail-item">
              <h3>Term</h3>
              <p>{analysisData.basicDetails.term}</p>
            </div>
            <div className="detail-item">
              <h3>Rent Amount</h3>
              <p>{analysisData.basicDetails.rentAmount}</p>
            </div>
          </div>
        </section>

        <section className="results-section clause-details">
          <div className="section-header">
            <FaListAlt className="section-icon" />
            <h2>Clause Details</h2>
          </div>
          <div className="section-content">
            {analysisData.clauses.map((clause, index) => (
              <div key={index} className="clause-item">
                <h3>{clause.name}</h3>
                <p className="clause-content">{clause.content}</p>
                {clause.issues.length > 0 && (
                  <div className="clause-issues">
                    <h4>Potential Issues:</h4>
                    <ul>
                      {clause.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="results-section summary-issues">
          <div className="section-header">
            <FaExclamationTriangle className="section-icon" />
            <h2>Summary & Issues</h2>
          </div>
          <div className="section-content">
            <div className="stats-overview">
              <div className="stat-item">
                <h3>Potential Issues</h3>
                <p className="stat-value">{analysisData.summary.potentialIssues}</p>
              </div>
              <div className="stat-item">
                <h3>Notable Clauses</h3>
                <p className="stat-value">{analysisData.summary.notableClauses}</p>
              </div>
            </div>
            <div className="recommendations">
              <h3>Recommendations</h3>
              <ul>
                {analysisData.summary.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const AnalysisPdfUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [username, setUsername] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleFileDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files).filter(file => 
      file.type === "application/pdf"
    );
    setUploadedFiles([...uploadedFiles, ...files]);
    setError(null);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files).filter(file =>
      file.type === "application/pdf"
    );
    setUploadedFiles([...uploadedFiles, ...files]);
    setError(null);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload at least one PDF file for analysis.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Append the first file to the FormData (we'll analyze one at a time)
      formData.append("file", uploadedFiles[0]);
      
      // Add username to FormData if available
      if (username) {
        formData.append("username", username);
      }
      
      // Make the API request
      const response = await api.post("/api/Pdf_Analysis", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Check if response contains analysis data
      if (response.data && response.data.success && response.data.analysis) {
        setAnalysisResult(response.data.analysis);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      setError(error.response?.data?.error || error.message || "Document analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUpload = () => {
    setAnalysisResult(null);
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

      {isLoading ? (
        <AnalysisLoading />
      ) : analysisResult ? (
        <AnalysisResults 
          analysisData={analysisResult} 
          onBack={handleBackToUpload} 
        />
      ) : (
        <div className="pdf-upload-container">
          <h1 className="title">Upload Your PDF Files</h1>

          <button
            className="upload-btn"
            onClick={() => document.getElementById("fileInput").click()}
            disabled={isLoading}
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

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

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
                  <button 
                    className="remove-btn" 
                    onClick={() => removeFile(index)}
                  >
                    <FaTimes />
                  </button>
                </li>
              ))}
            </motion.ul>
          )}

          <button 
            className="analyze-btn" 
            onClick={handleAnalyze}
            disabled={uploadedFiles.length === 0}
          >
            Analyze
          </button>
        </div>
      )}
    </>
  );
};

AnalysisResults.propTypes = {
  analysisData: PropTypes.shape({
    basicDetails: PropTypes.shape({
      documentName: PropTypes.string.isRequired,
      parties: PropTypes.arrayOf(PropTypes.string).isRequired,
      effectiveDate: PropTypes.string.isRequired,
      term: PropTypes.string.isRequired,
      rentAmount: PropTypes.string.isRequired,
    }).isRequired,
    clauses: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        issues: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
    summary: PropTypes.shape({
      potentialIssues: PropTypes.number.isRequired,
      notableClauses: PropTypes.number.isRequired,
      recommendations: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default AnalysisPdfUpload;