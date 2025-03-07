import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To get data passed from previous page
import "./AnalysisResult.css"; // Add styles for the new layout

const AnalysisResult = () => {
  const location = useLocation();
  const { filename, clauses } = location.state || {}; // Get filename & clauses from previous page

  return (
    <div className="analysis-container">
      {/* Left Column: PDF Display */}
      <div className="pdf-viewer">
        <h2>Submitted PDF</h2>
        {filename ? (
          <iframe
            src={`http://127.0.0.1:5000/uploads/${filename}`} 
            title="Uploaded PDF"
            className="pdf-frame"
          ></iframe>
        ) : (
          <p>No PDF available</p>
        )}
      </div>

      {/* Right Column: Extracted Clauses */}
      <div className="analysis-output">
        <h2>Extracted Clauses</h2>
        <pre className="clauses-text">{clauses || "No analysis available"}</pre>
      </div>
    </div>
  );
};

export default AnalysisResult;
