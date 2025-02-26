import "./DraftingDocSelection.css"
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

function DraftingDocSelection() {

    const [username, setUsername] = useState('');
    
      useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
          console.log(`Welcome, ${storedUsername}!`);
          setUsername(storedUsername);
        }
      }, []);


    return (
    <>

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
        <div className="document-container">
        <h1 className="heading">Build Your Legal Forms!</h1>
        <p className="subheading">Create Your Free Legal Documents & Contracts Online in Minutes</p>
        <div className="card-container">
          <div className="document-card">
            <div className="icon-container">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="icon"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>

            <a href="/LeaseDraftInitial">
            <span className="card-title">Lease Agreement</span>
            </a>

          </div>
        </div>
      </div>
    </>
  )
}

export default DraftingDocSelection