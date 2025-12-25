import React from 'react';
import BaseDashboard from '../Core/Dashboards/BaseDashboard';

const ParentDashboard = () => {
  const parentFeatures = [
    {
      title: 'My Children',
      icon: '👨‍👩‍👧‍👦',
      description: 'View information about your children',
      color: '#667eea'
    },
    {
      title: 'Academic Progress',
      icon: '📈',
      description: 'Track your children\'s academic performance',
      color: '#764ba2'
    },
    {
      title: 'Attendance',
      icon: '📊',
      description: 'Monitor attendance records',
      color: '#f093fb'
    },
    {
      title: 'Fee Management',
      icon: '💰',
      description: 'View and pay school fees',
      color: '#4facfe'
    },
    {
      title: 'Communications',
      icon: '💬',
      description: 'Messages from teachers and school',
      color: '#43e97b'
    },
    {
      title: 'School Calendar',
      icon: '📅',
      description: 'View school events and holidays',
      color: '#fa709a'
    }
  ];

  return (
    <BaseDashboard title="Parent Dashboard" role="parent">
      <div className="dashboard-card">
        <h2>Welcome, Parent!</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Stay connected with your children's education and school activities.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {parentFeatures.map((feature, index) => (
            <div 
              key={index}
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
        <h2>Children Overview</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          <div 
            style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '10px', 
              borderLeft: '4px solid #667eea',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
                         onMouseEnter={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(-5px)';
               card.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.2)';
               card.style.borderLeft = '6px solid #667eea';
             }}
             onMouseLeave={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(0)';
               card.style.boxShadow = 'none';
               card.style.borderLeft = '4px solid #667eea';
             }}
          >
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Rahul Kumar</h3>
            <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Class: 10A</div>
            <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Attendance: 92%</div>
            <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Grade: A+</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Fee Due: ₹8,000</div>
          </div>
          <div 
            style={{ 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '10px', 
              borderLeft: '4px solid #764ba2',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
                         onMouseEnter={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(-5px)';
               card.style.boxShadow = '0 8px 25px rgba(118, 75, 162, 0.2)';
               card.style.borderLeft = '6px solid #764ba2';
             }}
             onMouseLeave={(e) => {
               const card = e.currentTarget;
               card.style.transform = 'translateY(0)';
               card.style.boxShadow = 'none';
               card.style.borderLeft = '4px solid #764ba2';
             }}
          >
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Priya Kumar</h3>
            <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Class: 8B</div>
            <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Attendance: 88%</div>
            <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Grade: A</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Fee Due: ₹7,000</div>
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default ParentDashboard;
