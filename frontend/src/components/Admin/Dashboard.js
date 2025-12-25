import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseDashboard from '../Core/Dashboards/BaseDashboard';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminFeatures = [
    {
      title: 'Student Management',
      icon: '👨‍🎓',
      description: 'Manage student records, admissions, and profiles',
      color: '#667eea'
    },
    {
      title: 'Teacher Management',
      icon: '👨‍🏫',
      description: 'Manage faculty, assignments, and schedules',
      color: '#764ba2'
    },
    {
      title: 'Fee Management',
      icon: '💰',
      description: 'Handle fee collection, payments, and reports',
      color: '#f093fb'
    },
    {
      title: 'Attendance System',
      icon: '📊',
      description: 'Track student and staff attendance',
      color: '#4facfe'
    },
    {
      title: 'Exam Management',
      icon: '📝',
      description: 'Schedule exams, manage results, and reports',
      color: '#43e97b'
    },
    {
      title: 'Examination Result Management',
      icon: '📋',
      description: 'Manage examination results, student scores, and grade assignments',
      color: '#a78bfa',
      action: () => navigate('/admin/examination-result-management')
    },
    {
      title: 'Communication',
      icon: '📢',
      description: 'Send notifications and announcements',
      color: '#fa709a'
    }
  ];

  return (
    <BaseDashboard title="Admin Dashboard" role="admin">
      <div className="dashboard-card">
        <h2>Welcome, Administrator!</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Manage your school operations efficiently with the tools below.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {adminFeatures.map((feature, index) => (
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
        <h2>Quick Statistics</h2>
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
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>1,250</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Total Students</div>
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
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#764ba2' }}>85</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Teachers</div>
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
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#43e97b' }}>₹2.5M</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Monthly Revenue</div>
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
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa709a' }}>95%</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Attendance Rate</div>
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default AdminDashboard;
