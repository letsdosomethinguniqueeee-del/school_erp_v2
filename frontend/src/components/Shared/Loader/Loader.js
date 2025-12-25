import React from 'react';
import './Loader.css';

/**
 * Reusable Loader Component
 * 
 * A beautiful animated loading spinner that can be used throughout the application
 * 
 * @param {string} size - Size of the loader: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} variant - Variant: 'primary', 'secondary', 'white' (default: 'primary')
 * @param {boolean} fullScreen - If true, shows full screen overlay (default: false)
 * @param {string} message - Optional message to display below spinner (default: null)
 */
const Loader = ({ 
  size = 'medium', 
  variant = 'primary', 
  fullScreen = false,
  message = null 
}) => {
  const loaderContent = (
    <div className={`loader-container ${fullScreen ? 'loader-fullscreen' : ''}`}>
      <div className={`loader-spinner loader-${size} loader-${variant}`}>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
      </div>
      {message && (
        <p className="loader-message">{message}</p>
      )}
    </div>
  );

  return loaderContent;
};

export default Loader;

