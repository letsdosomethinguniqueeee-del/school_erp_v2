import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Academics', path: '/academics' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Faculty', path: '/faculty' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'News', path: '/news' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header className="school-header" style={{ backgroundColor: config.branding.colors.primary }}>
      <div className="header-container">
        <div className="header-top">
          <div className="logo-section">
            {config.branding.logo ? (
              <img src={config.branding.logo} alt={config.school.name} className="school-logo" onError={(e) => e.target.style.display = 'none'} />
            ) : (
              <div className="school-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: config.branding.colors.primary }}>
                {config.school.name.charAt(0)}
              </div>
            )}
            <div className="school-identity">
              <h1 className="school-name">{config.school.name}</h1>
              <p className="school-tagline">{config.school.tagline}</p>
            </div>
          </div>

          <div className="header-actions">
            <a 
              href={config.erpSystem.link} 
              className="erp-login-btn"
              style={{ backgroundColor: config.branding.colors.accent }}
            >
              {config.erpSystem.buttonText}
            </a>
          </div>
        </div>

        <nav className="main-nav">
          <div className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            {navItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link 
                  to={item.path} 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
