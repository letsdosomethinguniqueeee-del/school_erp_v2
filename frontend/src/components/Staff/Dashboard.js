import React from 'react';
import BaseDashboard from '../Core/Dashboards/BaseDashboard';

const StaffDashboard = () => {
  const staffFeatures = [
    {
      title: 'Student Records',
      icon: '📋',
      description: 'Manage student information and records',
      color: '#667eea'
    },
    {
      title: 'Fee Collection',
      icon: '💰',
      description: 'Process fee payments and generate receipts',
      color: '#764ba2'
    },
    {
      title: 'Attendance',
      icon: '📊',
      description: 'Mark and manage attendance records',
      color: '#f093fb'
    },
    {
      title: 'Library Management',
      icon: '📚',
      description: 'Manage library books and student borrowing',
      color: '#4facfe'
    },
    {
      title: 'Transport',
      icon: '🚌',
      description: 'Manage transport routes and schedules',
      color: '#43e97b'
    },
    {
      title: 'Reports',
      icon: '📈',
      description: 'Generate various school reports',
      color: '#fa709a'
    }
  ];

  return (
    <BaseDashboard title="Staff Dashboard" role="staff">
      <div className="dashboard-card">
        <h2>Welcome, Staff Member!</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Access tools to help manage daily school operations efficiently.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {staffFeatures.map((feature, index) => (
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
        <h2>Today's Tasks</h2>
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
              <div style={{ fontWeight: 'bold', color: '#333' }}>Fee Collection</div>
              <div style={{ color: '#666', fontSize: '14px' }}>15 students pending</div>
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
              <div style={{ fontWeight: 'bold', color: '#333' }}>Library Check-in</div>
              <div style={{ color: '#666', fontSize: '14px' }}>8 books due today</div>
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
              <div style={{ fontWeight: 'bold', color: '#333' }}>Attendance Update</div>
              <div style={{ color: '#666', fontSize: '14px' }}>Class 9A & 9B pending</div>
            </div>
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default StaffDashboard;
