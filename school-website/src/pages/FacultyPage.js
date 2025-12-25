import React, { useState, useEffect } from 'react';
import config from '../config';
import { websiteAPI } from '../services/api';
import '../styles/FacultyPage.css';

const FacultyPage = () => {
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('all');

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await websiteAPI.getContentByType('teacher');
      setFacultyMembers(response.data || []);
    } catch (error) {
      console.error('Error fetching faculty:', error);
      // Fallback to sample data if API fails
      setFacultyMembers([
        {
          name: "Dr. Sarah Johnson",
          designation: "Principal",
          department: "Administration",
          qualification: "Ph.D. in Education",
          experience: "25 years",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
        },
        {
          name: "Mr. Rajesh Kumar",
          designation: "Vice Principal",
          department: "Administration",
          qualification: "M.A., B.Ed.",
          experience: "20 years",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
        },
        {
          name: "Mrs. Priya Sharma",
          designation: "Senior Teacher",
          department: "Science",
          qualification: "M.Sc. Physics, B.Ed.",
          experience: "15 years",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400"
        },
        {
          name: "Dr. Amit Patel",
          designation: "Head of Department",
          department: "Mathematics",
          qualification: "Ph.D. Mathematics",
          experience: "18 years",
          image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
        },
        {
          name: "Ms. Anjali Verma",
          designation: "Senior Teacher",
          department: "English",
          qualification: "M.A. English, B.Ed.",
          experience: "12 years",
          image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400"
        },
        {
          name: "Mr. Vikram Singh",
          designation: "Teacher",
          department: "Social Science",
          qualification: "M.A. History, B.Ed.",
          experience: "10 years",
          image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaculty = selectedDept === 'all' 
    ? facultyMembers 
    : facultyMembers.filter(member => member.department === selectedDept);

  const departments = [
    { name: "Science", icon: "🔬" },
    { name: "Mathematics", icon: "📐" },
    { name: "English", icon: "📚" },
    { name: "Social Science", icon: "🌍" },
    { name: "Computer Science", icon: "💻" },
    { name: "Languages", icon: "🗣️" },
    { name: "Arts", icon: "🎨" },
    { name: "Physical Education", icon: "⚽" }
  ];

  return (
    <div className="faculty-page">
      {/* Page Header */}
      <section className="page-header" style={{ backgroundColor: config.branding.colors.primary }}>
        <div className="container">
          <h1 className="page-title">Our Faculty</h1>
          <p className="page-subtitle">Meet Our Dedicated Educators</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="faculty-intro">
        <div className="container">
          <div className="intro-content">
            <h2>Excellence in Teaching</h2>
            <p>
              Our faculty comprises highly qualified and experienced educators who are passionate about 
              nurturing young minds. With a perfect blend of traditional values and modern teaching 
              methodologies, our teachers ensure holistic development of every student.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="faculty-stats" style={{ backgroundColor: config.branding.colors.secondary }}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number" style={{ color: config.branding.colors.primary }}>150+</div>
              <div className="stat-label">Qualified Teachers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" style={{ color: config.branding.colors.primary }}>85%</div>
              <div className="stat-label">Post-Graduates</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" style={{ color: config.branding.colors.primary }}>15+</div>
              <div className="stat-label">Average Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" style={{ color: config.branding.colors.primary }}>100%</div>
              <div className="stat-label">Trained Educators</div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="departments-section">
        <div className="container">
          <h2 className="section-title">Our Departments</h2>
          <div className="filter-buttons" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <button
              onClick={() => setSelectedDept('all')}
              className={`filter-btn ${selectedDept === 'all' ? 'active' : ''}`}
              style={{
                backgroundColor: selectedDept === 'all' ? config.branding.colors.primary : 'transparent',
                color: selectedDept === 'all' ? '#fff' : config.branding.colors.primary,
                padding: '0.5rem 1rem',
                margin: '0.25rem',
                border: `2px solid ${config.branding.colors.primary}`,
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              All Departments
            </button>
            {Array.from(new Set(facultyMembers.map(m => m.department))).map((dept, index) => (
              <button
                key={index}
                onClick={() => setSelectedDept(dept)}
                className={`filter-btn ${selectedDept === dept ? 'active' : ''}`}
                style={{
                  backgroundColor: selectedDept === dept ? config.branding.colors.primary : 'transparent',
                  color: selectedDept === dept ? '#fff' : config.branding.colors.primary,
                  padding: '0.5rem 1rem',
                  margin: '0.25rem',
                  border: `2px solid ${config.branding.colors.primary}`,
                  borderRadius: '25px',
                  cursor: 'pointer'
                }}
              >
                {dept}
              </button>
            ))}
          </div>
          <div className="departments-grid">
            {departments.map((dept, index) => (
              <div key={index} className="department-card">
                <div className="dept-icon">{dept.icon}</div>
                <h3>{dept.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Members */}
      <section className="faculty-members" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.2rem', color: config.branding.colors.primary }}>Loading faculty members...</p>
            </div>
          ) : filteredFaculty.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>No faculty members found in this department.</p>
            </div>
          ) : (
            <div className="faculty-grid">
              {filteredFaculty.map((member, index) => (
                <div key={member._id || index} className="faculty-card">
                  <div className="faculty-image">
                    {member.image ? (
                      <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <div 
                        className="image-placeholder" 
                        style={{ backgroundColor: config.branding.colors.secondary }}
                      >
                        <span>{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="faculty-info">
                    <h3 className="faculty-name">{member.name}</h3>
                    <p className="faculty-designation" style={{ color: config.branding.colors.primary }}>
                      {member.designation}
                    </p>
                    <p className="faculty-department">{member.department}</p>
                    <div className="faculty-details">
                      <p><strong>Qualification:</strong> {member.qualification}</p>
                      <p><strong>Experience:</strong> {member.experience}</p>
                      {member.email && <p><strong>Email:</strong> {member.email}</p>}
                      {member.phone && <p><strong>Phone:</strong> {member.phone}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Professional Development */}
      <section className="development-section">
        <div className="container">
          <h2 className="section-title">Professional Development</h2>
          <div className="development-content">
            <p>
              We believe in continuous learning and growth. Our teachers regularly participate in:
            </p>
            <div className="development-grid">
              <div className="dev-card">
                <div className="dev-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                  📖
                </div>
                <h3>Workshops & Seminars</h3>
                <p>Regular training sessions on latest teaching methodologies</p>
              </div>
              <div className="dev-card">
                <div className="dev-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                  🎓
                </div>
                <h3>Higher Education</h3>
                <p>Support for pursuing advanced degrees and certifications</p>
              </div>
              <div className="dev-card">
                <div className="dev-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                  💻
                </div>
                <h3>Technology Training</h3>
                <p>Digital literacy and modern teaching tools</p>
              </div>
              <div className="dev-card">
                <div className="dev-icon" style={{ backgroundColor: config.branding.colors.accent }}>
                  🤝
                </div>
                <h3>Collaboration</h3>
                <p>Knowledge sharing and peer learning programs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="careers-section" style={{ backgroundColor: config.branding.colors.primary }}>
        <div className="container">
          <h2>Join Our Team</h2>
          <p>Are you a passionate educator looking to make a difference?</p>
          <button 
            className="careers-btn"
            style={{ backgroundColor: config.branding.colors.accent }}
          >
            View Career Opportunities
          </button>
        </div>
      </section>
    </div>
  );
};

export default FacultyPage;
