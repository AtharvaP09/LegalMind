import { useState } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Home from './Components/Home.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const username = "JohnDoe"; 

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        onToggleSidebar={toggleSidebar} 
        isCollapsed={sidebarCollapsed} 
      />
      <Home username={username} />
    </div>
  );
};

export default Dashboard;