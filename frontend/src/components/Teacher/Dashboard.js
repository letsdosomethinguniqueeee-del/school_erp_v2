import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseDashboard from '../Core/Dashboards/BaseDashboard';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const teacherFeatures = [
    {
      title: 'My Classes',
      icon: '📚',
      description: 'View and manage your assigned classes',
      color: '#667eea'
    },
    {
      title: 'Attendance',
      icon: '📊',
      description: 'Mark and view student attendance',
      color: '#764ba2'
    },
    {
      title: 'Assignments',
      icon: '📝',
      description: 'Create and grade assignments',
      color: '#f093fb'
    },
    {
      title: 'Exam Results',
      icon: '📋',
      description: 'View and update exam results',
      color: '#4facfe'
    },
    {
      title: 'Examination Result Management',
      icon: '📋',
      description: 'Manage examination results, student scores, and grade assignments',
      color: '#a78bfa',
      action: () => navigate('/teacher/examination-result-management')
    },
    {
      title: 'Student Progress',
      icon: '📈',
      description: 'Track student academic progress',
      color: '#43e97b'
    },
    {
      title: 'Communicate',
      icon: '💬',
      description: 'Send messages to students and parents',
      color: '#fa709a'
    }
  ];

  return (
    <BaseDashboard title="Teacher Dashboard" role="teacher">
      <div className="dashboard-card">
        <h2>Welcome, Teacher!</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Manage your classes and track student progress efficiently.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {teacherFeatures.map((feature, index) => (
            <div 
              key={index}
              onClick={feature.action}
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #e1e5e9',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderLeft: `4px solid ${feature.color}`
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                card.style.borderLeft = `6px solid ${feature.color}`;
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
                card.style.borderLeft = `4px solid ${feature.color}`;
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
        <h2>Today's Schedule</h2>
        <div style={{ marginTop: '20px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '15px' 
          }}>
            <div 
              style={{ 
                padding: '15px', 
                background: '#f8f9fa', 
                borderRadius: '8px', 
                borderLeft: '4px solid #667eea',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(-3px)';
                card.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.2)';
                card.style.borderLeft = '6px solid #667eea';
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
                card.style.borderLeft = '4px solid #667eea';
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#333' }}>Class 10A - Mathematics</div>
              <div style={{ color: '#666', fontSize: '14px' }}>9:00 AM - 10:00 AM</div>
            </div>
            <div 
              style={{ 
                padding: '15px', 
                background: '#f8f9fa', 
                borderRadius: '8px', 
                borderLeft: '4px solid #764ba2',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(-3px)';
                card.style.boxShadow = '0 5px 15px rgba(118, 75, 162, 0.2)';
                card.style.borderLeft = '6px solid #764ba2';
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
                card.style.borderLeft = '4px solid #764ba2';
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#333' }}>Class 9B - Mathematics</div>
              <div style={{ color: '#666', fontSize: '14px' }}>10:15 AM - 11:15 AM</div>
            </div>
            <div 
              style={{ 
                padding: '15px', 
                background: '#f8f9fa', 
                borderRadius: '8px', 
                borderLeft: '4px solid #f093fb',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(-3px)';
                card.style.boxShadow = '0 5px 15px rgba(240, 147, 251, 0.2)';
                card.style.borderLeft = '6px solid #f093fb';
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
                card.style.borderLeft = '4px solid #f093fb';
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#333' }}>Class 11A - Mathematics</div>
              <div style={{ color: '#666', fontSize: '14px' }}>11:30 AM - 12:30 PM</div>
            </div>
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default TeacherDashboard;
