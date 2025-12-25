import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseDashboard from '../Core/Dashboards/BaseDashboard';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const studentFeatures = [
    {
      title: 'My Courses',
      icon: '📚',
      description: 'View your enrolled courses and subjects',
      color: '#667eea',
      path: null
    },
    {
      title: 'Attendance',
      icon: '📊',
      description: 'Check your attendance record',
      color: '#764ba2',
      path: null
    },
    {
      title: 'Assignments',
      icon: '📝',
      description: 'View and submit assignments',
      color: '#f093fb',
      path: null
    },
    {
      title: 'Exam Results',
      icon: '📋',
      description: 'View your exam results and grades',
      color: '#4facfe',
      path: '/student/exam-results'
    },
    {
      title: 'Timetable',
      icon: '📅',
      description: 'View your class schedule',
      color: '#43e97b',
      path: null
    },
    {
      title: 'Fee Details',
      icon: '💰',
      description: 'Check fee structure and payments',
      color: '#fa709a',
      path: null
    }
  ];

  const handleFeatureClick = (feature) => {
    if (feature.path) {
      navigate(feature.path);
    }
  };

  return (
    <BaseDashboard title="Student Dashboard" role="student">
      <div className="dashboard-card">
        <h2>Welcome, Student!</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Access your academic information and stay updated with your progress.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {studentFeatures.map((feature, index) => (
            <div 
              key={index}
              onClick={() => handleFeatureClick(feature)}
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #e1e5e9',
                cursor: feature.path ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                borderLeft: `4px solid ${feature.color}`,
                opacity: feature.path ? 1 : 0.7
              }}
              onMouseEnter={(e) => {
                if (feature.path) {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(-8px)';
                  card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  card.style.borderLeft = `6px solid ${feature.color}`;
                }
              }}
              onMouseLeave={(e) => {
                if (feature.path) {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(0)';
                  card.style.boxShadow = 'none';
                  card.style.borderLeft = `4px solid ${feature.color}`;
                }
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '15px' }}>
                {feature.icon}
              </div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Academic Overview</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          <div 
            style={{ 
              textAlign: 'center', 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
                         onMouseEnter={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(-5px)';
               card.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.2)';
               card.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
             }}
             onMouseLeave={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(0)';
               card.style.boxShadow = 'none';
               card.style.background = '#f8f9fa';
             }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>85%</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Attendance</div>
          </div>
          <div 
            style={{ 
              textAlign: 'center', 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
                         onMouseEnter={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(-5px)';
               card.style.boxShadow = '0 8px 25px rgba(118, 75, 162, 0.2)';
               card.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
             }}
             onMouseLeave={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(0)';
               card.style.boxShadow = 'none';
               card.style.background = '#f8f9fa';
             }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#764ba2' }}>A+</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Current Grade</div>
          </div>
          <div 
            style={{ 
              textAlign: 'center', 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
                         onMouseEnter={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(-5px)';
               card.style.boxShadow = '0 8px 25px rgba(67, 233, 123, 0.2)';
               card.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
             }}
             onMouseLeave={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(0)';
               card.style.boxShadow = 'none';
               card.style.background = '#f8f9fa';
             }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#43e97b' }}>5</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Pending Assignments</div>
          </div>
          <div 
            style={{ 
              textAlign: 'center', 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
                         onMouseEnter={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(-5px)';
               card.style.boxShadow = '0 8px 25px rgba(250, 112, 154, 0.2)';
               card.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
             }}
             onMouseLeave={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(0)';
               card.style.boxShadow = 'none';
               card.style.background = '#f8f9fa';
             }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa709a' }}>₹15,000</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Fee Due</div>
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default StudentDashboard;
