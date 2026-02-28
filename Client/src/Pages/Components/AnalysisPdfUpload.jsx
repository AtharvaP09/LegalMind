import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaTimes, FaArrowLeft, FaFilePdf, FaInfoCircle, FaListAlt, FaExclamationTriangle, FaSpinner, FaPaperPlane } from "react-icons/fa";
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

export const AnalysisResults = ({ analysisData, onBack, initialChatMessages = null, documentId = null }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [chatMessages, setChatMessages] = useState(
    initialChatMessages || [
      { text: "Hello! I'm LegalMind. I have just analyzed this document. What questions do you have about it?", sender: "bot" }
    ]
  );
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedDocId, setSavedDocId] = useState(documentId || null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSaveToDashboard = async () => {
    try {
      setIsSaving(true);
      const username = sessionStorage.getItem("username");
      if (!username) {
        alert("Please log in to save documents");
        return;
      }
      const response = await api.post("/api/save_analysis", {
        username,
        filename: analysisData.basicDetails.documentName,
        analysis: analysisData,
        chatMessages: chatMessages,
        doc_id: savedDocId
      });
      if (response.data.success) {
        setSavedDocId(response.data.doc_id);
        alert("Analysis saved to dashboard successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save analysis to dashboard.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendChat = async () => {
    if (chatInput.trim() === "") return;

    const userMessage = { text: chatInput, sender: "user" };
    const messagesWithUser = [...chatMessages, userMessage];
    setChatMessages(messagesWithUser);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const contextString = JSON.stringify(analysisData, null, 2);
      const response = await api.post("/api/chatbot", {
        message: chatInput,
        username: sessionStorage.getItem("username") || "user",
        context: contextString
      });

      if (response.data.success) {
        const newMessages = [...messagesWithUser, { text: response.data.response, sender: "bot" }];
        setChatMessages(newMessages);

        // Auto-update to dashboard if document is already saved
        if (savedDocId || documentId) {
          const activeDocId = savedDocId || documentId;
          api.post("/api/save_analysis", {
            username: sessionStorage.getItem("username") || "user",
            filename: analysisData.basicDetails.documentName,
            analysis: analysisData,
            chatMessages: newMessages,
            doc_id: activeDocId
          }).catch(err => console.error("Auto-sync chat failed:", err));
        }

      } else {
        throw new Error("Invalid format from server");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [...prev, { text: "Sorry, I had trouble answering that. Please try again.", sender: "bot" }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isChatLoading) {
      handleSendChat();
    }
  };

  return (
    <div className="analysis-split-container">
      {/* Left Pane - Document Analysis Details */}
      <div className="analysis-pane">
        <div className="results-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="back-button" onClick={onBack}>
              <FaArrowLeft /> Back
            </button>
            <button
              className="save-button"
              onClick={handleSaveToDashboard}
              disabled={isSaving || !!savedDocId}
              style={{
                background: savedDocId ? '#10b981' : '#2563eb',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: savedDocId ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.3s'
              }}
            >
              {isSaving ? <FaSpinner className="spinner" /> : null}
              {savedDocId ? 'Saved to Dashboard' : 'Save Analysis'}
            </button>
          </div>
          <h1 style={{ marginTop: '10px' }}>Document Analysis Options</h1>
          <div className="document-info">
            <FaFilePdf className="pdf-icon" />
            <span>{analysisData.basicDetails.documentName}</span>
          </div>
        </div>

        <div className="results-tabs">
          <button
            className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            <FaInfoCircle /> Details
          </button>
          <button
            className={`tab-button ${activeTab === 'clauses' ? 'active' : ''}`}
            onClick={() => setActiveTab('clauses')}
          >
            <FaListAlt /> Clauses
          </button>
          <button
            className={`tab-button ${activeTab === 'risks' ? 'active' : ''}`}
            onClick={() => setActiveTab('risks')}
          >
            <FaExclamationTriangle /> Potential Risks
          </button>
          <button
            className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <FaExclamationTriangle /> Summary
          </button>
        </div>

        <div className="tab-content scrollable-pane">
          <AnimatePresence mode="wait">
            {activeTab === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="basic-details-section"
              >
                <div className="detail-grid">
                  <div className="detail-card glass-card">
                    <h3>Lessor</h3>
                    <p>{analysisData.basicDetails.lessor || "Not specified"}</p>
                  </div>

                  <div className="detail-card glass-card">
                    <h3>Lessee</h3>
                    <p>{analysisData.basicDetails.lessee || "Not specified"}</p>
                  </div>

                  <div className="detail-card glass-card">
                    <h3>Effective Date</h3>
                    <p>{analysisData.basicDetails.effectiveDate}</p>
                  </div>

                  <div className="detail-card glass-card">
                    <h3>Term</h3>
                    <p>{analysisData.basicDetails.term}</p>
                  </div>

                  <div className="detail-card glass-card">
                    <h3>Rent Amount</h3>
                    <p>{analysisData.basicDetails.rentAmount}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'clauses' && (
              <motion.div
                key="clauses"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="clauses-section"
              >
                <div className="clauses-container">
                  {analysisData.clauses.map((clause, index) => (
                    <div key={index} className="clause-card glass-card">
                      <h3 className="clause-title">
                        <span className="clause-number">{index + 1}.</span> {clause.name}
                      </h3>
                      <div className="clause-content">
                        <p>{clause.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'risks' && (
              <motion.div
                key="risks"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="risks-section"
              >
                <div className="clauses-container">
                  {/* Flatten and limit the risks to only show a few critical ones to avoid looking faulty */}
                  {analysisData.clauses
                    .filter(c => c.issues && c.issues.length > 0)
                    .map((clause, index) => (
                      <div key={`risk-${index}`} className="clause-card glass-card risk-card">
                        <h3 className="clause-title">
                          Risk in: {clause.name}
                        </h3>
                        <div className="clause-issues">
                          <ul>
                            {clause.issues.slice(0, 2).map((issue, i) => (
                              <li key={i}><FaExclamationTriangle className="issue-icon" /> {issue}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  {analysisData.clauses.filter(c => c.issues && c.issues.length > 0).length === 0 && (
                    <p>No major risks detected in this document.</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="summary-section"
              >
                <div className="summary-stats">
                  <div className="stat-card glass-card">
                    <h3>Potential Issues Found</h3>
                    <div className="stat-value error-text">{analysisData.summary.potentialIssues}</div>
                  </div>
                  <div className="stat-card glass-card">
                    <h3>Notable Clauses</h3>
                    <div className="stat-value highlight-text">{analysisData.summary.notableClauses}</div>
                  </div>
                </div>

                <div className="recommendations-card glass-card mt-2">
                  <h3>Recommendations for Review</h3>
                  <ul>
                    {analysisData.summary.recommendations.map((rec, index) => (
                      <li key={index}>
                        <span className="rec-number">{index + 1}.</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Pane - Integrated Document Context Chat */}
      <div className="chat-pane glass-card">
        <div className="chat-pane-header">
          <h3>Document Q&A</h3>
          <p>Ask anything about this document</p>
        </div>
        <div className="chat-pane-body scrollable-pane">
          {chatMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`chat-bubble ${msg.sender === "user" ? "chat-user" : "chat-bot"}`}
            >
              <div className="chat-bubble-content">
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isChatLoading && (
            <div className="chat-bubble chat-bot">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-pane-footer">
          <input
            type="text"
            placeholder="E.g., What are the terms for early termination?"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isChatLoading}
          />
          <button
            className="chat-send-btn"
            onClick={handleSendChat}
            disabled={chatInput.trim() === "" || isChatLoading}
          >
            {isChatLoading ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
          </button>
        </div>
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