import { useState } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Home from './Components/Home.jsx';
import DraftingDocSelection from './Components/DraftingDocSelection.jsx';
import AnalysisPdfUpload from './Components/AnalysisPdfUpload.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSection, setSelectedSection] = useState('home'); // Track selected component

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        onToggleSidebar={toggleSidebar} 
        isCollapsed={sidebarCollapsed} 
        onSelectSection={setSelectedSection} // Pass the function to Sidebar
      />
      <div className="dashboard-content">
        {selectedSection === 'home' && <Home />}
        {selectedSection === 'drafting' && <DraftingDocSelection />}
        {selectedSection === 'analyse' && <AnalysisPdfUpload />}
      </div>
    </div>
  );
};

export default Dashboard;