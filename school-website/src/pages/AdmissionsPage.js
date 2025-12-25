import React from 'react';
import config from '../config';
import '../styles/AdmissionsPage.css';

const AdmissionsPage = () => {
  return (
    <div className="admissions-page">
      {/* Page Header */}
      <section className="page-header" style={{ backgroundColor: config.branding.colors.primary }}>
        <div className="container">
          <h1 className="page-title">Admissions</h1>
          <p className="page-subtitle">Join Our School Family</p>
        </div>
      </section>

      {/* Admission Overview */}
      <section className="admission-overview">
        <div className="container">
          <div className="overview-content">
            <h2>Welcome to {config.school.name}</h2>
            <p className="lead-text">
              We are delighted that you are considering {config.school.name} for your child's education. 
              Our admission process is designed to be simple and transparent.
            </p>
          </div>
        </div>
      </section>

      {/* Key Dates */}
      <section className="key-dates-section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Important Dates</h2>
          <div className="dates-grid">
            <div className="date-card">
              <div className="date-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                📅
              </div>
              <h3>Application Period</h3>
              <p className="date-text">{config.admissions.applicationPeriod}</p>
            </div>
            <div className="date-card">
              <div className="date-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                📝
              </div>
              <h3>Entrance Test</h3>
              <p className="date-text">{config.admissions.entranceTest}</p>
            </div>
            <div className="date-card">
              <div className="date-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                📢
              </div>
              <h3>Result Announcement</h3>
              <p className="date-text">{config.admissions.resultDate}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="process-section">
        <div className="container">
          <h2 className="section-title">Admission Process</h2>
          <div className="process-timeline">
            {config.admissions.process.map((step, index) => (
              <div key={index} className="process-step">
                <div className="step-number" style={{ backgroundColor: config.branding.colors.primary }}>
                  {index + 1}
                </div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="documents-section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Required Documents</h2>
          <div className="documents-grid">
            {config.admissions.requiredDocuments.map((doc, index) => (
              <div key={index} className="document-item">
                <div className="doc-icon" style={{ color: config.branding.colors.primary }}>
                  📄
                </div>
                <p>{doc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className="eligibility-section">
        <div className="container">
          <h2 className="section-title">Eligibility Criteria</h2>
          <div className="eligibility-content">
            <div className="eligibility-card">
              <h3>Age Requirements</h3>
              <ul>
                {config.admissions.eligibility.map((criteria, index) => (
                  <li key={index}>{criteria}</li>
                ))}
              </ul>
            </div>
            <div className="eligibility-note" style={{ borderLeftColor: config.branding.colors.accent }}>
              <p><strong>Note:</strong> Age should be calculated as on April 1st of the admission year.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="fee-section" style={{ backgroundColor: config.branding.colors.secondary }}>
        <div className="container">
          <h2 className="section-title">Fee Information</h2>
          <div className="fee-content">
            <p className="fee-text">
              For detailed fee structure and payment schedule, please contact our admission office 
              or download the fee prospectus.
            </p>
            <button 
              className="btn-download" 
              style={{ backgroundColor: config.branding.colors.accent }}
            >
              Download Fee Prospectus
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="admission-contact">
        <div className="container">
          <h2 className="section-title">Need Help?</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon" style={{ backgroundColor: config.branding.colors.primary }}>
                📞
              </div>
              <h3>Call Us</h3>
              <p><a href={`tel:${config.contact.phone}`}>{config.contact.phone}</a></p>
            </div>
            <div className="contact-card">
              <div className="contact-icon" style={{ backgroundColor: config.branding.colors.primary }}>
                ✉️
              </div>
              <h3>Email Us</h3>
              <p><a href={`mailto:${config.contact.email}`}>{config.contact.email}</a></p>
            </div>
            <div className="contact-card">
              <div className="contact-icon" style={{ backgroundColor: config.branding.colors.primary }}>
                🏫
              </div>
              <h3>Visit Us</h3>
              <p>{config.contact.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={{ backgroundColor: config.branding.colors.primary }}>
        <div className="container">
          <h2>Ready to Apply?</h2>
          <p>Start your child's journey with us today</p>
          <a 
            href={config.erpSystem.link} 
            className="btn-apply"
            style={{ backgroundColor: config.branding.colors.accent }}
          >
            Apply Online
          </a>
        </div>
      </section>
    </div>
  );
};

export default AdmissionsPage;
