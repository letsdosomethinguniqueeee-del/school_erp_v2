import React, { useState } from 'react';
import config from '../config';
import { websiteAPI } from '../services/api';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await websiteAPI.submitContactForm(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Page Header */}
      <section className="page-header" style={{ backgroundColor: config.branding.colors.primary }}>
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">We'd Love to Hear From You</p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p className="contact-intro">
                Have questions? We're here to help. Reach out to us through any of the following methods.
              </p>

              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                    📞
                  </div>
                  <div className="info-content">
                    <h3>Phone</h3>
                    <p><a href={`tel:${config.contact.phone}`}>{config.contact.phone}</a></p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                    ✉️
                  </div>
                  <div className="info-content">
                    <h3>Email</h3>
                    <p><a href={`mailto:${config.contact.email}`}>{config.contact.email}</a></p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                    📍
                  </div>
                  <div className="info-content">
                    <h3>Address</h3>
                    <p>{config.contact.address}</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                    🕒
                  </div>
                  <div className="info-content">
                    <h3>Office Hours</h3>
                    <p>Monday - Friday: 8:00 AM - 4:00 PM</p>
                    <p>Saturday: 8:00 AM - 12:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  {config.socialMedia.facebook && (
                    <a href={config.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-icon">
                      <i className="icon-facebook"></i> Facebook
                    </a>
                  )}
                  {config.socialMedia.twitter && (
                    <a href={config.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-icon">
                      <i className="icon-twitter"></i> Twitter
                    </a>
                  )}
                  {config.socialMedia.instagram && (
                    <a href={config.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-icon">
                      <i className="icon-instagram"></i> Instagram
                    </a>
                  )}
                  {config.socialMedia.youtube && (
                    <a href={config.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="social-icon">
                      <i className="icon-youtube"></i> YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2>Send Us a Message</h2>
              {submitted && (
                <div className="success-message" style={{ backgroundColor: config.branding.colors.success || '#10b981' }}>
                  ✓ Thank you! Your message has been submitted successfully. We'll get back to you soon.
                </div>
              )}
              {error && (
                <div className="error-message" style={{ backgroundColor: '#ef4444', color: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  ✗ {error}
                </div>
              )}
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  style={{ backgroundColor: config.branding.colors.primary }}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Find Us</h2>
          <div className="map-container">
            {config.contact.mapLink ? (
              <iframe
                src={config.contact.mapLink}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location"
              ></iframe>
            ) : (
              <div className="map-placeholder" style={{ backgroundColor: config.branding.colors.secondary }}>
                <p>Map will be displayed here</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
