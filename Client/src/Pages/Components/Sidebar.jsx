import { FaHome, FaFileAlt, FaPencilAlt,  FaBars } from 'react-icons/fa';
import { BsDatabaseFill } from 'react-icons/bs';
import { IoLogOut } from "react-icons/io5";
import './Sidebar.css';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api';

const Sidebar = ({ onToggleSidebar, isCollapsed, onSelectSection }) => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/UserLogout' , {useCredentials: true});
      if (response.data) {
        sessionStorage.removeItem('username');
        navigate('/UserLogin');
      } else {
        alert('An error occurred');
        console.log(response);
      }
    } catch (error) {
      alert('An error occurred');
      console.log(error);
    }
  };

  return (
    <div className={`side-nav ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo-container">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        {!isCollapsed && <h1 className="sidebar-logo">LegalMind</h1>}
      </div>
      
      <div className="create-button-container">
        <button className="create-button">
          <span className="plus-icon">+</span>
          {!isCollapsed && <span>Create</span>}
        </button>
      </div>
      
      <nav className="nav-menu">
        <ul>
          <li className="nav-item" onClick={() => onSelectSection('home')}>
            <FaHome className="nav-icon" />
            {!isCollapsed && <span>Home</span>}
          </li>
          <li className="nav-item" onClick={() => onSelectSection('analyse')}>
            <FaFileAlt className="nav-icon" />
            {!isCollapsed && <span>Analyse</span>}
          </li>
          <li className="nav-item" onClick={() => onSelectSection('drafting')}>
            <FaPencilAlt className="nav-icon" />
            {!isCollapsed && <span>Drafting</span>}
          </li>
          <li className="nav-item">
            <BsDatabaseFill className="nav-icon" />
            {!isCollapsed && <span>Documents</span>}
          </li>
          <li className="nav-item">
            <Link to={"/"}><IoLogOut className="nav-icon" />
            {!isCollapsed && <span onClick={handleLogout}>Log Out</span>}</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  onSelectSection: PropTypes.func.isRequired,
};

export default Sidebar;
