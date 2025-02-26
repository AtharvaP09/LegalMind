import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./LeaseDraftInitial.css";
import { FaUserCircle } from "react-icons/fa";

const LeaseDraftInitial = () => {
  const navigate = useNavigate(); 
  const leaseImageUrl = "/lease-preview.jpg";  
  const leaseDocUrl = "/lease-template.pdf";

  const [documentName, setDocumentName] = useState(""); 

  const handleDocumentName = (e) => {
    const name = e.target.value;
    setDocumentName(name);
    sessionStorage.setItem("documentName", name);
  };

  const handleCreateDocument = () => {
    if (documentName.trim()) {
      sessionStorage.setItem("documentName", documentName);
      navigate("/LeaseDraftFinal"); 
    } else {
      alert("Please enter a document name before proceeding.");
    }
  };

  const openDocument = () => {
    window.open(leaseDocUrl, "_blank"); 
  };

  return (
    <>
      <div className="container">
        <header>
          <p className="logo">LegalMind</p>
          <nav className="top-nav">
            <ul>
              <li><a href="/Dashboard">Home</a></li>
              <li><a href="/help">Help</a></li>
              <li>
                <div className="user-avatar">
                  <FaUserCircle />
                </div>
              </li>
            </ul>
          </nav>
        </header>

        <div className="content-wrapper">
          <div className="main-content">
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

              <button className="btn btn-primary" onClick={handleCreateDocument}>
                Create Document
              </button>
            </div>

            <h2 className="About-Lease">About Lease Agreement</h2>
            <div className="definition">
              <p>
                A lease agreement (or rental agreement) is a legally binding contract that outlines the obligations and rights of the tenant and landlord. It establishes the terms of the tenancy and helps you avoid disputes with your tenants and address issues when they arise.
              </p>
            </div>
          </div>

          {/* Document Preview Section */}
          <div className="preview-content">
            <div className="document-preview">
              <img 
                src={leaseImageUrl}
                alt="Lease Agreement Preview" 
                className="preview-image" 
                onClick={openDocument} 
              /> 
              <button className="btn btn-primary" onClick={handleCreateDocument}>
                Create Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaseDraftInitial;
