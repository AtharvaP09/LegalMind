import { useState } from 'react';
import { FaHome, FaFileAlt, FaPencilAlt, FaClipboard, FaBars } from 'react-icons/fa';
import { BsDatabaseFill } from 'react-icons/bs';
import { IoLogOut } from "react-icons/io5";
import './Sidebar.css';
import PropTypes from 'prop-types';
import { Link , useNavigate } from 'react-router-dom';
import API from '../../api';


const Sidebar = ({ onToggleSidebar, isCollapsed }) => {

  const navigate = useNavigate();

  const handleLogout = async(e) => {
    e.preventdefault();
    try{
      const response = await API.post('/UserLogout');
      if (response.data){
        sessionStorage.removeItem('username');
        navigate('/UserLogin');
      }
      else {
        alert('An error occurred');
        console.log(response);
    }
    }catch(error){
      alert('An error occurred');
      console.log(error);
    }
  }

  return (
    <div className={`side-nav ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo-container">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        {!isCollapsed && <h1 className="logo">LegalMind</h1>}
      </div>
      
      <div className="create-button-container">
        <button className="create-button">
          <span className="plus-icon">+</span>
          {!isCollapsed && <span>Create</span>}
        </button>
      </div>
      
      <nav className="nav-menu">
        <ul>
          <li className="nav-item">
            <FaHome className="nav-icon" />
            {!isCollapsed && <span>Home</span>}
          </li>
          <li className="nav-item">
            <FaFileAlt className="nav-icon" />
            {!isCollapsed && <span>Analyse</span>}
          </li>
          <li className="nav-item">
            <FaPencilAlt className="nav-icon" />
            {!isCollapsed && <span>Drafting</span>}
          </li>
          <li className="nav-item">
            <FaClipboard className="nav-icon" />
            {!isCollapsed && <span>Templates</span>}
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
      
      {/* <div className="your-work-container">
        <div className="your-work-button">
          <span className="work-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </span>
          {!isCollapsed && <span>Your Work</span>}
        </div>
      </div> */}
      {/* I will add the Your Work section later , nce the db is completed and information about previous work is stored */}
    </div>
  );
};
Sidebar.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
};

export default Sidebar;