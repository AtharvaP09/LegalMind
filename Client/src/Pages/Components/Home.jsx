import { FaUserCircle } from 'react-icons/fa';
import './Home.css';
import PropTypes from 'prop-types';

const Home = ({ username = "JohnDoe" }) => {
  return (
    <div className="main-content">
      <div className="top-nav">
        <div className="user-section">
          <div className="user-info">
            <p className="username">Welcome, {username}!</p>
            <p className="tagline">Ready to transform your legal documents?</p>
          </div>
          <div className="user-avatar">
            <FaUserCircle />
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome, {username}!</h1>
          <p className="welcome-subtitle">Create with Precision, Analyze with Insight, Ensure Compliance with Confidence.</p>
        </div>
        
        <div className="stats-section">
          <div className="stat-card">
            <h2 className="stat-number">0</h2>
            <p className="stat-label">Documents Created</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-number">0</h2>
            <p className="stat-label">Documents Analyzed</p>
          </div>
        </div>
      </div>
    </div>
  );
};
Home.propTypes = {
  username: PropTypes.string
};

export default Home;