import React from 'react';
import config from '../config';
import '../styles/AcademicsPage.css';

const AcademicsPage = () => {
  return (
    <div className="academics-page">
      {/* Page Header */}
      <section className="page-header" style={{ backgroundColor: config.branding.colors.primary }}>
        <div className="container">
          <h1 className="page-title">Academics</h1>
          <p className="page-subtitle">Excellence in Education</p>
        </div>
      </section>

      {/* Overview */}
      <section className="academics-overview">
        <div className="container">
          <div className="overview-grid">
            <div className="overview-card">
              <h3>Curriculum</h3>
              <p className="highlight" style={{ color: config.branding.colors.primary }}>
                {config.academics.curriculum}
              </p>
            </div>
            <div className="overview-card">
              <h3>Classes</h3>
              <p className="highlight" style={{ color: config.branding.colors.primary }}>
                {config.academics.classes}
              </p>
            </div>
            <div className="overview-card">
              <h3>Mediums</h3>
              <p className="highlight" style={{ color: config.branding.colors.primary }}>
                {config.academics.mediums.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Streams */}
      <section className="streams-section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Academic Streams</h2>
          <div className="streams-grid">
            {config.academics.streams.map((stream, index) => (
              <div key={index} className="stream-card">
                <div className="stream-header" style={{ backgroundColor: config.branding.colors.secondary }}>
                  <h3>{stream.name}</h3>
                </div>
                <div className="stream-body">
                  <p className="stream-description">{stream.description}</p>
                  <div className="stream-subjects">
                    <h4>Subjects Offered:</h4>
                    <ul>
                      {stream.subjects.map((subject, idx) => (
                        <li key={idx}>{subject}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="subjects-section">
        <div className="container">
          <h2 className="section-title">Subjects Offered</h2>
          <div className="subjects-grid">
            {config.academics.subjects.map((subject, index) => (
              <div key={index} className="subject-card">
                <div className="subject-icon" style={{ backgroundColor: config.branding.colors.secondary }}>
                  📚
                </div>
                <h3>{subject.name}</h3>
                <p className="subject-classes">Classes: {subject.classes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="programs-section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Special Programs</h2>
          <div className="programs-grid">
            {config.academics.specialPrograms.map((program, index) => (
              <div key={index} className="program-card">
                <div className="program-icon" style={{ color: config.branding.colors.primary }}>
                  ⭐
                </div>
                <h3>{program.name}</h3>
                <p>{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="facilities-section">
        <div className="container">
          <h2 className="section-title">Academic Facilities</h2>
          <div className="facilities-grid">
            <div className="facility-card">
              <div className="facility-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                🔬
              </div>
              <h3>Science Laboratories</h3>
              <p>Well-equipped labs for Physics, Chemistry, and Biology</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                💻
              </div>
              <h3>Computer Labs</h3>
              <p>Modern computer labs with latest software and internet</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                📖
              </div>
              <h3>Library</h3>
              <p>Extensive collection of books, journals, and digital resources</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                🎨
              </div>
              <h3>Art & Music Rooms</h3>
              <p>Dedicated spaces for creative and performing arts</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                🏃
              </div>
              <h3>Sports Complex</h3>
              <p>Indoor and outdoor facilities for various sports</p>
            </div>
            <div className="facility-card">
              <div className="facility-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                📱
              </div>
              <h3>Smart Classrooms</h3>
              <p>Interactive digital boards and modern teaching aids</p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Calendar */}
      <section className="calendar-section" style={{ backgroundColor: config.branding.colors.secondary }}>
        <div className="container">
          <h2 className="section-title">Academic Calendar</h2>
          <div className="calendar-info">
            <div className="calendar-item">
              <h3>Academic Year</h3>
              <p>April - March</p>
            </div>
            <div className="calendar-item">
              <h3>Terms</h3>
              <p>Two terms with continuous assessment</p>
            </div>
            <div className="calendar-item">
              <h3>Examinations</h3>
              <p>Periodic assessments and annual exams</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AcademicsPage;
