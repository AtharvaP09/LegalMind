import { useState } from "react";
import PropTypes from "prop-types";
import "../../LeaseDraftFinal.css";

// Logo component for the sidebar
const LegalMindLogo = () => (
  <div className="legal-mind-logo">
    <h1 className="logo-text">LegalMind</h1>
  </div>
);

const sections = [
    {title: "Agreement-Details", subSections:["Location" , "Date"]},
  { title: "Property-Details", subSections: ["Address", "Category" , "Rooms" , "Area"] },
  { title: "Parties", subSections: ["Landlord Info", "Tenant Info"] },
  { title:"Lease-Details" , subSections:["Lease Term" , "Lease Start Date"]},
  { title: "Payment", subSections: ["Rent Amount", "Due Date" , "Deposit"] },
  { title: "Additional-Details" , subSections: ["Termination Period","Witness-Info"]},
  { title: "Additional-Clauses" , subSections: ["Additional Clauses"]}
];

const LeaseSidebar = ({ onSelectSection }) => {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="lease-sidebar">
      <LegalMindLogo />
      <h2 className="lease-sidebar-title">Lease Agreement</h2>
      {sections.map((section, index) => (
        <div key={index} className="lease-sidebar-section">
          <button
            className="lease-sidebar-btn"
            onClick={() => toggleExpand(index)}
          >
            {section.title}
          </button>
          {expanded === index && (
            <ul className="lease-sidebar-list">
              {section.subSections.map((sub, idx) => (
                <li
                  key={idx}
                  className="lease-sidebar-item"
                  onClick={() => onSelectSection(section.title, sub)}
                >
                  {sub}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
LeaseSidebar.propTypes = {
  onSelectSection: PropTypes.func.isRequired,
};

export default LeaseSidebar;