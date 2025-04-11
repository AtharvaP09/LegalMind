import { useState } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Home from './Components/Home.jsx';
import DraftingDocSelection from './Components/DraftingDocSelection.jsx';
import AnalysisPdfUpload from './Components/AnalysisPdfUpload.jsx';
import Documents from './Components/Documents.jsx';
import GuidePage from './Components/Guide.jsx';
import './Dashboard.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSection, setSelectedSection] = useState('home'); // Track selected component
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToGuide) {
      const guideSection = document.getElementById('guide');
      if (guideSection) {
        guideSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.state]);

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
        {selectedSection === 'documents' && <Documents/>}
        {selectedSection === 'guide' && <GuidePage/>}
      </div>
    </div>
  );
};

export default Dashboard;