import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseDashboard from '../../Core/Dashboards/BaseDashboard';
import FeesStructure from './FeesStructure';
import StudentFees from './StudentFees';
import './FeesManagement.css';

const FeesManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('fees-structure');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [academicYears, setAcademicYears] = useState([]);

  // Generate academic years (current year and next 5 years)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 6; i++) {
      const year = currentYear + i;
      years.push(`${year}-${year + 1}`);
    }
    setAcademicYears(years);
    setSelectedAcademicYear(years[0]); // Set current academic year as default
  }, []);

  const tabs = [
    {
      id: 'fees-structure',
      label: 'Fees Structure',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      )
    },
    {
      id: 'student-fees',
      label: 'Student Fees',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    }
  ];

  const handleBackToDashboard = () => {
    navigate('/super-admin');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'fees-structure':
        return <FeesStructure academicYear={selectedAcademicYear} />;
      case 'student-fees':
        return <StudentFees academicYear={selectedAcademicYear} />;
      default:
        return <FeesStructure academicYear={selectedAcademicYear} />;
    }
  };

  return (
    <BaseDashboard title="Fees Management" role="super-admin">
      {/* Header with Back Button and Academic Year Filter */}
      <div className="fees-management-header">
        <div className="header-left">
          <button 
            className="back-button"
            onClick={handleBackToDashboard}
            title="Back to Dashboard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          <h1>Fees Management</h1>
        </div>
        
        <div className="academic-year-filter">
          <label htmlFor="academic-year">Academic Year:</label>
          <select
            id="academic-year"
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            className="academic-year-select"
          >
            {academicYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="fees-tabs">
        <div className="tabs-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="fees-tab-content">
        {renderActiveTab()}
      </div>
    </BaseDashboard>
  );
};

export default FeesManagement;
