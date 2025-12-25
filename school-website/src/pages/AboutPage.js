import React, { useState, useEffect } from 'react';
import config from '../config';
import { websiteAPI } from '../services/api';
import '../styles/AboutPage.css';

const AboutPage = () => {
  const [directorMessage, setDirectorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDirectorMessage();
  }, []);

  const fetchDirectorMessage = async () => {
    try {
      const response = await websiteAPI.getDirectorMessage();
      setDirectorMessage(response.data);
    } catch (error) {
      console.error('Error fetching director message:', error);
      // Use fallback from config
      setDirectorMessage({
        title: "Principal's Message",
        name: "Principal",
        designation: "Principal",
        content: config.about.principalMessage,
        image: null
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="about-page">
      {/* Page Header */}
      <section className="page-header" style={{ backgroundColor: config.branding.colors.primary }}>
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">Discover Our Story and Values</p>
        </div>
      </section>

      {/* About Overview */}
      <section className="about-overview">
        <div className="container">
          <div className="overview-content">
            <div className="overview-image">
              <img src={config.about.image} alt="About us" />
            </div>
            <div className="overview-text">
              <h2>{config.about.title}</h2>
              <p className="lead-text">{config.about.description}</p>
              <div className="establishment-info">
                <div className="info-icon">📅</div>
                <div>
                  <strong>Established</strong>
                  <p>{config.school.established}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card mission-card">
              <div className="mv-icon" style={{ backgroundColor: config.branding.colors.primary }}>
                🎯
              </div>
              <h3>Our Mission</h3>
              <p>{config.about.mission}</p>
            </div>
            <div className="mv-card vision-card">
              <div className="mv-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                👁️
              </div>
              <h3>Our Vision</h3>
              <p>{config.about.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Our Achievements</h2>
          <div className="stats-grid">
            {config.statistics.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's/Director's Message */}
      <section className="principal-message" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.2rem', color: config.branding.colors.primary }}>Loading message...</p>
            </div>
          ) : directorMessage ? (
            <div className="message-content">
              <div className="message-text">
                <h2>{directorMessage.title || "Director's Message"}</h2>
                <div className="quote-icon" style={{ color: config.branding.colors.primary }}>❝</div>
                <p className="message-quote">{directorMessage.content}</p>
                <div className="principal-info">
                  <p className="principal-name"><strong>- {directorMessage.name}</strong></p>
                  <p className="school-name">{directorMessage.designation}, {config.school.name}</p>
                </div>
              </div>
              <div className="message-image">
                {directorMessage.image ? (
                  <img 
                    src={directorMessage.image} 
                    alt={directorMessage.name}
                    style={{ 
                      width: '100%', 
                      height: '400px', 
                      objectFit: 'cover', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }} 
                  />
                ) : (
                  <div className="image-placeholder" style={{ backgroundColor: config.branding.colors.secondary }}>
                    <span>{directorMessage.name.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Core Values */}
      <section className="core-values">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon" style={{ color: config.branding.colors.primary }}>🌟</div>
              <h3>Excellence</h3>
              <p>Striving for the highest standards in education and character development</p>
            </div>
            <div className="value-card">
              <div className="value-icon" style={{ color: config.branding.colors.primary }}>🤝</div>
              <h3>Integrity</h3>
              <p>Building trust through honesty, transparency, and ethical conduct</p>
            </div>
            <div className="value-card">
              <div className="value-icon" style={{ color: config.branding.colors.primary }}>💡</div>
              <h3>Innovation</h3>
              <p>Embracing new ideas and technologies to enhance learning experiences</p>
            </div>
            <div className="value-card">
              <div className="value-icon" style={{ color: config.branding.colors.primary }}>🌍</div>
              <h3>Diversity</h3>
              <p>Celebrating and respecting differences in our multicultural community</p>
            </div>
            <div className="value-card">
              <div className="value-icon" style={{ color: config.branding.colors.primary }}>❤️</div>
              <h3>Compassion</h3>
              <p>Fostering empathy, kindness, and social responsibility</p>
            </div>
            <div className="value-card">
              <div className="value-icon" style={{ color: config.branding.colors.primary }}>🏆</div>
              <h3>Leadership</h3>
              <p>Developing future leaders with confidence and vision</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
