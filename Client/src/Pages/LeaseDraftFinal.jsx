import { useState } from "react";
import LeaseSidebar from "./Components/DraftComponents/DraftSidebar";
import LeaseForm from "./Components/DraftComponents/DraftLeaseForm";
import "./LeaseDraftFinal.css"; // Import external CSS

const LeaseLayout = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  const handleSelectSection = (section, sub) => {
    setSelectedSection(section);
    setSelectedSub(sub);
  };

  return (
    <div className="lease-layout">
      <LeaseSidebar onSelectSection={handleSelectSection} />
      <LeaseForm selectedSection={selectedSection} selectedSub={selectedSub} />
    </div>
  );
};

export default LeaseLayout;
