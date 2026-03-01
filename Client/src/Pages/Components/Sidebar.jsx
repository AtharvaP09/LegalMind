import { FaHome, FaFileAlt, FaPencilAlt, FaBars, FaQuestion } from 'react-icons/fa';
import { BsDatabaseFill } from 'react-icons/bs';
import { IoLogOut } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import './Sidebar.css';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const Sidebar = ({ onToggleSidebar, isCollapsed, onSelectSection }) => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/UserLogout', { useCredentials: true });
      if (response.data) {
        sessionStorage.removeItem('username');
        navigate('/UserLogin');
      } else {
        alert(response.data?.message || 'Failed to logout');
        console.log(response);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during logout';
      alert(errorMessage);
      console.log(error);
    }
  };

  return (
    <div className={`side-nav ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
            <FaBars />
          </button>
          {!isCollapsed && <h1 className="sidebar-logo"><a href="http://localhost:5173/">LegalMind</a></h1>}
        </div>
      </div>

      <div className="sidebar-content">
        <div className="create-button-container">
          <a href="http://localhost:5173/LeaseDraftInitial">
            <button className="create-button">
              <MdAdd className="plus-icon" />
              {!isCollapsed && <span>Create New</span>}
            </button>
          </a>
        </div>

        <nav className="nav-menu">
          <ul>
            <li className="nav-item" onClick={() => onSelectSection('home')}>
              <FaHome className="nav-icon" />
              {!isCollapsed && <span className="nav-text">Home</span>}
              {!isCollapsed && <div className="nav-hover-effect"></div>}
            </li>
            <li className="nav-item" onClick={() => onSelectSection('analyse')}>
              <FaFileAlt className="nav-icon" />
              {!isCollapsed && <span className="nav-text">Analyse</span>}
              {!isCollapsed && <div className="nav-hover-effect"></div>}
            </li>
            <li className="nav-item" onClick={() => onSelectSection('drafting')}>
              <FaPencilAlt className="nav-icon" />
              {!isCollapsed && <span className="nav-text">Drafting</span>}
              {!isCollapsed && <div className="nav-hover-effect"></div>}
            </li>
            <li className="nav-item" onClick={() => onSelectSection('documents')}>
              <BsDatabaseFill className="nav-icon" />
              {!isCollapsed && <span className="nav-text">Documents</span>}
              {!isCollapsed && <div className="nav-hover-effect"></div>}
            </li>
            <li className="nav-item" onClick={() => onSelectSection('guide')}>
              <FaQuestion className="nav-icon" />
              {!isCollapsed && <span className="nav-text">Guide</span>}
              {!isCollapsed && <div className="nav-hover-effect"></div>}
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="nav-item logout-item" onClick={handleLogout}>
          <IoLogOut className="nav-icon" />
          {!isCollapsed && <span className="nav-text">Log Out</span>}
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  onSelectSection: PropTypes.func.isRequired,
};

export default Sidebar;