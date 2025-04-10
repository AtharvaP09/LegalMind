import { FaUserCircle } from 'react-icons/fa';
import './Home.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import API from '../../api'; // Import your API instance

const Home = () => {
  const [username, setUsername] = useState('');
  const [documentStats, setDocumentStats] = useState({
    drafted: 0,
    analyzed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      console.log(`Welcome, ${storedUsername}!`);
      setUsername(storedUsername);
      fetchDocumentStats(storedUsername);
    }
  }, []);

  const fetchDocumentStats = async (username) => {
    try {
      setLoading(true);
      const response = await API.get(`/api/user/documents/stats?username=${username}`);
      setDocumentStats({
        drafted: response.data.drafted_count || 0,
        analyzed: response.data.analyzed_count || 0
      });
    } catch (error) {
      console.error("Error fetching document stats:", error);
      // Fallback to 0 if there's an error
      setDocumentStats({ drafted: 0, analyzed: 0 });
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="stat-number">
              {loading ? '...' : documentStats.drafted}
            </h2>
            <p className="stat-label">Documents Drafted</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-number">
              {loading ? '...' : documentStats.analyzed}
            </h2>
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