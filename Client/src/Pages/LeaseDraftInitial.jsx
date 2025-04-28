import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // << Added this
import { FaUserCircle } from "react-icons/fa";
import "./LeaseDraftInitial.css";

const LeaseDraftInitial = () => {
  const navigate = useNavigate();
  const leaseImageUrl = "/lease-preview.jpg";
  const leaseDocUrl = "/lease-template.pdf";

  const [documentName, setDocumentName] = useState("");

  const handleDocumentName = (e) => {
    setDocumentName(e.target.value);
  };

  const handleCreateDocument = () => {
    if (documentName.trim()) {
      sessionStorage.setItem("documentName", documentName.trim());
      navigate("/LeaseDraftFinal");
    } else {
      alert("Please enter a document name before proceeding.");
    }
  };

  const openDocument = () => {
    window.open(leaseDocUrl, "_blank");
  };

  const handleHelpClick = () => {
    navigate("/Dashboard", { state: { scrollToGuide: true } });
  };

  return (
    <div className="full-screen-container">
      <header className="header">
        <p className="logo"><a href="http://localhost:5173/Dashboard">LegalMind</a></p>
        <nav className="top-nav">
          <ul>
            <li><a href="/Dashboard">Home</a></li>
            <li><a href="#guide" onClick={handleHelpClick}>Help</a></li>
            <li>
              <div className="user-avatar">
                <FaUserCircle />
              </div>
            </li>
          </ul>
        </nav>
      </header>

      <motion.div 
        className="content-wrapper"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="main-content"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1>Rental and Lease Agreement Templates</h1>
          <p className="description">
            Use our lease agreement to rent out your residential property.
          </p>

          <div className="form-row">
            <input
              type="text"
              className="document-name"
              placeholder="Enter Document Name"
              value={documentName}
              onChange={handleDocumentName}
              required
            />

            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #4866f6" }}
              className="btn btn-primary"
              onClick={handleCreateDocument}
            >
              Create Document
            </motion.button>
          </div>

          <h2 className="About-Lease">About Lease Agreement</h2>
          <div className="definition">
            <p>
              A lease agreement (or rental agreement) is a legally binding contract
              that outlines the obligations and rights of the tenant and landlord.
              It establishes the terms of the tenancy and helps you avoid disputes
              with your tenants and address issues when they arise.
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="preview-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="document-preview">
            <motion.img
              src={leaseImageUrl}
              alt="Lease Agreement Preview"
              className="preview-image"
              onClick={openDocument}
              whileHover={{ scale: 1.05 }}
            />

            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #4866f6" }}
              className="btn btn-primary"
              onClick={handleCreateDocument}
            >
              Create Document
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LeaseDraftInitial;
