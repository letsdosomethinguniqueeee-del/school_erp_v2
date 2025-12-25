import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-text">Page not found</h1>
        <div className="not-found-number">
          <span className="number-4">4</span>
          <div className="robot-container">
            <svg className="robot" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              {/* Robot Head */}
              <circle cx="100" cy="80" r="50" fill="#ffffff" stroke="#d0d0d0" strokeWidth="2" />
              {/* Robot Face Screen */}
              <circle cx="100" cy="80" r="40" fill="#1a4d8c" />
              {/* Robot Eyes - Gear shapes */}
              <circle cx="85" cy="70" r="8" fill="#4a9eff" />
              <circle cx="115" cy="70" r="8" fill="#4a9eff" />
              {/* Robot Mouth - Larger gear shape */}
              <circle cx="100" cy="95" r="12" fill="#4a9eff" />
              {/* Robot Body */}
              <rect x="70" y="130" width="60" height="50" rx="5" fill="#ffffff" stroke="#d0d0d0" strokeWidth="2" />
              {/* Robot Neck */}
              <rect x="90" y="125" width="20" height="10" fill="#4a4a4a" />
              {/* Robot Arms */}
              <rect x="50" y="140" width="25" height="8" rx="4" fill="#ffffff" stroke="#d0d0d0" strokeWidth="2" />
              <rect x="125" y="140" width="25" height="8" rx="4" fill="#ffffff" stroke="#d0d0d0" strokeWidth="2" />
              {/* Robot Joints */}
              <circle cx="75" cy="144" r="4" fill="#d0d0d0" />
              <circle cx="125" cy="144" r="4" fill="#d0d0d0" />
              <circle cx="100" cy="155" r="4" fill="#d0d0d0" />
            </svg>
          </div>
          <span className="number-4">4</span>
        </div>
        <p className="not-found-message">
          We looked everywhere for this page. Are you sure the website URL is correct? Get in touch with the site owner.
        </p>
        <button
          className="not-found-button"
          onClick={() => navigate('/login')}
        >
          Go to Login Page
        </button>
      </div>
    </div>
  );
};

export default NotFound;

