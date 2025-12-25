import React, { useState } from 'react';
import BaseDashboard from '../../Core/Dashboards/BaseDashboard';
import logger from '../../../utils/logger';
import './StudentAdmission.css';

const StudentAdmission = ({ user }) => {
  const [formData, setFormData] = useState({
    // Student Information
    firstName: '',
    middleName: '',
    lastName: '',
    studentId: '',
    rollNo: '',
    govtProvidedId: '',
    
    // Parent Information
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherLastName: '',
    motherFirstName: '',
    motherMiddleName: '',
    motherLastName: '',
    parent1Id: '',
    parent1Relation: '',
    parent2Id: '',
    parent2Relation: '',
    
    // Personal Details
    gender: '',
    dateOfBirth: '',
    category: '',
    community: '',
    nationality: '',
    
    // Contact Information
    aadharCardNo: '',
    contactNo: '',
    additionalContactNo: '',
    email: '',
    
    // Academic Information
    admissionYear: new Date().getFullYear(),
    currentStudyClass: '',
    currentSection: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `STU${year}${random}`;
  };

  const generateRollNo = () => {
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `R${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Auto-generate IDs if not provided
      const studentData = {
        ...formData,
        studentId: formData.studentId || generateStudentId(),
        rollNo: formData.rollNo || generateRollNo()
      };

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(studentData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Student admitted successfully!');
        logger.application.userAction('STUDENT_ADMISSION_FORM', user.userId, user.role, {
          studentId: studentData.studentId,
          studentName: `${studentData.firstName} ${studentData.lastName}`
        });
        
        // Reset form
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          studentId: '',
          rollNo: '',
          govtProvidedId: '',
          fatherFirstName: '',
          fatherMiddleName: '',
          fatherLastName: '',
          motherFirstName: '',
          motherMiddleName: '',
          motherLastName: '',
          parent1Id: '',
          parent1Relation: '',
          parent2Id: '',
          parent2Relation: '',
          gender: '',
          dateOfBirth: '',
          category: '',
          community: '',
          nationality: '',
          aadharCardNo: '',
          contactNo: '',
          additionalContactNo: '',
          email: '',
          admissionYear: new Date().getFullYear(),
          currentStudyClass: '',
          currentSection: ''
        });
      } else {
        setError(result.message || 'Failed to admit student');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      logger.application.error(err, { action: 'STUDENT_ADMISSION_SUBMIT' });
    } finally {
      setLoading(false);
    }
  };

  const canAdmitStudents = ['admin', 'super-admin', 'staff'].includes(user?.role);

  if (!canAdmitStudents) {
    return (
      <BaseDashboard title="Student Admission" role={user?.role}>
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the student admission system.</p>
          <p>Only Administrators, Super Administrators, and Staff members can admit students.</p>
        </div>
      </BaseDashboard>
    );
  }

  return (
    <BaseDashboard title="Student Admission" role={user?.role}>
      <div className="student-admission">
        <div className="admission-header">
          <h2>New Student Admission</h2>
          <p>Fill in the student's information to complete the admission process.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admission-form">
          {/* Student Information Section */}
          <div className="form-section">
            <h3>Student Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if empty"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rollNo">Roll Number</label>
                <input
                  type="text"
                  id="rollNo"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if empty"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="govtProvidedId">Government ID</label>
                <input
                  type="text"
                  id="govtProvidedId"
                  name="govtProvidedId"
                  value={formData.govtProvidedId}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Parent Information Section */}
          <div className="form-section">
            <h3>Parent Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fatherFirstName">Father's First Name *</label>
                <input
                  type="text"
                  id="fatherFirstName"
                  name="fatherFirstName"
                  value={formData.fatherFirstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fatherMiddleName">Father's Middle Name</label>
                <input
                  type="text"
                  id="fatherMiddleName"
                  name="fatherMiddleName"
                  value={formData.fatherMiddleName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fatherLastName">Father's Last Name</label>
                <input
                  type="text"
                  id="fatherLastName"
                  name="fatherLastName"
                  value={formData.fatherLastName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="motherFirstName">Mother's First Name *</label>
                <input
                  type="text"
                  id="motherFirstName"
                  name="motherFirstName"
                  value={formData.motherFirstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="motherMiddleName">Mother's Middle Name</label>
                <input
                  type="text"
                  id="motherMiddleName"
                  name="motherMiddleName"
                  value={formData.motherMiddleName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="motherLastName">Mother's Last Name</label>
                <input
                  type="text"
                  id="motherLastName"
                  name="motherLastName"
                  value={formData.motherLastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="form-section">
            <h3>Personal Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="community">Community</label>
                <input
                  type="text"
                  id="community"
                  name="community"
                  value={formData.community}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nationality">Nationality</label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="aadharCardNo">Aadhar Card Number</label>
                <input
                  type="text"
                  id="aadharCardNo"
                  name="aadharCardNo"
                  value={formData.aadharCardNo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="contactNo">Contact Number</label>
                <input
                  type="tel"
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="additionalContactNo">Additional Contact</label>
                <input
                  type="tel"
                  id="additionalContactNo"
                  name="additionalContactNo"
                  value={formData.additionalContactNo}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="form-section">
            <h3>Academic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="admissionYear">Admission Year</label>
                <input
                  type="number"
                  id="admissionYear"
                  name="admissionYear"
                  value={formData.admissionYear}
                  onChange={handleInputChange}
                  min="2020"
                  max="2030"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="currentStudyClass">Current Class</label>
                <input
                  type="text"
                  id="currentStudyClass"
                  name="currentStudyClass"
                  value={formData.currentStudyClass}
                  onChange={handleInputChange}
                  placeholder="e.g., Class 1, Class 2, etc."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="currentSection">Section</label>
                <input
                  type="text"
                  id="currentSection"
                  name="currentSection"
                  value={formData.currentSection}
                  onChange={handleInputChange}
                  placeholder="e.g., A, B, C, etc."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Admit Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </BaseDashboard>
  );
};

export default StudentAdmission;
