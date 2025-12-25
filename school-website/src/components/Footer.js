import React from 'react';
import { Link } from 'react-router-dom';
import config from '../config';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="school-footer">
      {/* Main Footer */}
      <div className="footer-main" style={{ background: `linear-gradient(135deg, ${config.branding.colors.primary} 0%, #1e3a8a 100%)` }}>
        <div className="footer-container">
          <div className="footer-grid">
            {/* About Section */}
            <div className="footer-section about-section">
              <h3 className="footer-heading">About {config.school.name}</h3>
              <div className="footer-divider" style={{ backgroundColor: config.branding.colors.accent }}></div>
              <p className="footer-text">{config.school.tagline}</p>
              <p className="footer-text"><strong>Established:</strong> {config.school.established}</p>
              <div className="footer-awards">
                <span className="award-badge">🏆 Excellence in Education</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-heading">Quick Links</h3>
              <div className="footer-divider" style={{ backgroundColor: config.branding.colors.accent }}></div>
              <ul className="footer-links">
                {config.footer.quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>
                      <span className="link-arrow">→</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="footer-section">
              <h3 className="footer-heading">Contact Us</h3>
              <div className="footer-divider" style={{ backgroundColor: config.branding.colors.accent }}></div>
              <ul className="footer-contact">
                <li>
                  <div className="contact-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                    📞
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Phone</span>
                    <a href={`tel:${config.contact.phone}`}>{config.contact.phone}</a>
                  </div>
                </li>
                <li>
                  <div className="contact-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                    ✉️
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Email</span>
                    <a href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
                  </div>
                </li>
                <li>
                  <div className="contact-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                    📍
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Address</span>
                    <span>{config.contact.address}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="footer-section">
              <h3 className="footer-heading">Follow Us</h3>
              <div className="footer-divider" style={{ backgroundColor: config.branding.colors.accent }}></div>
              <p className="footer-text" style={{ marginBottom: '1.5rem' }}>Stay connected with us on social media</p>
              <div className="social-links">
                {config.socialMedia.facebook && (
                  <a href={config.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                  </a>
                )}
                {config.socialMedia.twitter && (
                  <a href={config.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                  </a>
                )}
                {config.socialMedia.instagram && (
                  <a href={config.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                )}
                {config.socialMedia.youtube && (
                  <a href={config.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="social-icon" title="YouTube">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                  </a>
                )}
                {config.socialMedia.linkedin && (
                  <a href={config.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom" style={{ backgroundColor: '#1e293b' }}>
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} {config.school.name}. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              {config.footer.bottomLinks.map((link, index) => (
                <React.Fragment key={index}>
                  <Link to={link.path}>{link.label}</Link>
                  {index < config.footer.bottomLinks.length - 1 && <span className="separator">•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
