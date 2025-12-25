import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  useToast,
  Grid,
  GridItem,
  ModalFooter
} from '@chakra-ui/react';
import api from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';

const EditStudentForm = ({ student, onClose, onSuccess }) => {
  // Configuration data state
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '',
    rollNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    govtProvidedId: '',
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherLastName: '',
    fatherMobile: '',
    motherFirstName: '',
    motherMiddleName: '',
    motherLastName: '',
    motherMobile: '',
    parent1Id: '',
    parent1Relation: '',
    parent2Id: '',
    parent2Relation: '',
    gender: '',
    dateOfBirth: '',
    category: '',
    community: '',
    nationality: '',
    bloodGroup: '',
    aadharCardNo: '',
    contactNo: '',
    additionalContactNo: '',
    email: '',
    admissionYear: '',
    currentStudyClass: '',
    currentSection: '',
    medium: '',
    concessionPercentage: 0,
    concessionReason: '',
    pic: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingRollNo, setIsValidatingRollNo] = useState(false);
  const toast = useToast();

  // Fetch configuration data on component mount
  useEffect(() => {
    fetchConfigurationData();
  }, []);

  const fetchConfigurationData = async () => {
    setLoadingConfig(true);
    try {
      const [classesRes, sectionsRes, mediumsRes, academicYearsRes] = await Promise.all([
        api.get(API_ENDPOINTS.CLASSES),
        api.get(API_ENDPOINTS.SECTIONS),
        api.get(API_ENDPOINTS.MEDIUMS),
        api.get(API_ENDPOINTS.ACADEMIC_YEARS)
      ]);

      setClasses(classesRes.data.data || []);
      setSections(sectionsRes.data.data || []);
      setMediums(mediumsRes.data.data || []);
      setAcademicYears(academicYearsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching configuration data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load configuration data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    if (student) {
      console.log('=== EDIT STUDENT FORM - STUDENT DATA ===');
      console.log('Student object:', student);
      console.log('Concession percentage:', student.concessionPercentage);
      console.log('Concession reason:', student.concessionReason);
      setFormData({
        studentId: student.studentId || '',
        rollNo: student.rollNo || '',
        firstName: student.firstName || '',
        middleName: student.middleName || '',
        lastName: student.lastName || '',
        govtProvidedId: student.govtProvidedId || '',
        fatherFirstName: student.fatherFirstName || '',
        fatherMiddleName: student.fatherMiddleName || '',
        fatherLastName: student.fatherLastName || '',
        fatherMobile: student.fatherMobile || '',
        motherFirstName: student.motherFirstName || '',
        motherMiddleName: student.motherMiddleName || '',
        motherLastName: student.motherLastName || '',
        motherMobile: student.motherMobile || '',
        parent1Id: student.parent1Id || '',
        parent1Relation: student.parent1Relation || '',
        parent2Id: student.parent2Id || '',
        parent2Relation: student.parent2Relation || '',
        gender: student.gender || '',
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
        category: student.category || '',
        community: student.community || '',
        nationality: student.nationality || '',
        bloodGroup: student.bloodGroup || '',
        aadharCardNo: student.aadharCardNo || '',
        contactNo: student.contactNo || '',
        additionalContactNo: student.additionalContactNo || '',
        email: student.email || '',
        admissionYear: student.admissionYear?._id || student.admissionYear || '',
        currentStudyClass: student.currentStudyClass?._id || student.currentStudyClass || '',
        currentSection: student.currentSection?._id || student.currentSection || '',
        medium: student.medium?._id || student.medium || '',
        concessionPercentage: student.concessionPercentage || 0,
        concessionReason: student.concessionReason || '',
        pic: student.pic || ''
      });
    }
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Function to validate roll number uniqueness per class
  const validateRollNumberUniqueness = async (rollNo, currentClass, currentStudentId) => {
    if (!rollNo || !currentClass) return true;
    
    try {
      setIsValidatingRollNo(true);
      const response = await api.get(`/api/students/check-roll-no?rollNo=${rollNo}&class=${currentClass}`);
      
      // If roll number exists, check if it belongs to the current student being edited
      if (response.data.exists && response.data.student) {
        return response.data.student._id === currentStudentId;
      }
      
      return !response.data.exists; // Return true if roll number is unique
    } catch (error) {
      console.error('Error validating roll number:', error);
      return true; // Allow submission if validation fails
    } finally {
      setIsValidatingRollNo(false);
    }
  };

  const validateForm = async () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.fatherFirstName.trim()) newErrors.fatherFirstName = 'Father\'s first name is required';
    if (!formData.motherFirstName.trim()) newErrors.motherFirstName = 'Mother\'s first name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.contactNo.trim()) newErrors.contactNo = 'Contact number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.admissionYear) newErrors.admissionYear = 'Admission year is required';
    if (!formData.currentStudyClass) newErrors.currentStudyClass = 'Current class is required';
    if (!formData.currentSection) newErrors.currentSection = 'Current section is required';

    // Student ID format validation: DPS{YY}{CLASS}{ROLL}
    if (formData.studentId.trim()) {
      const studentIdPattern = /^DPS\d{2}\d{2}\d{3}$/;
      if (!studentIdPattern.test(formData.studentId.trim())) {
        newErrors.studentId = 'Student ID must follow format: DPS{YY}{NUM}{ROLL} (e.g., DPS2501001)';
      }
    }

    // Email validation
    if (formData.email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Contact number validation
    if (formData.contactNo.trim()) {
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(formData.contactNo.trim())) {
        newErrors.contactNo = 'Contact number must be 10 digits';
      }
    }

    // Roll number uniqueness validation
    if (formData.rollNo.trim() && formData.currentStudyClass) {
      const isRollNoUnique = await validateRollNumberUniqueness(formData.rollNo.trim(), formData.currentStudyClass, student._id);
      if (!isRollNoUnique) {
        const className = classes.find(cls => cls._id === formData.currentStudyClass)?.class_name || formData.currentStudyClass;
        newErrors.rollNo = `Roll number ${formData.rollNo} already exists in class ${className}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent any input from getting focus by immediately disabling all inputs
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
      input.setAttribute('readonly', 'true');
      input.style.pointerEvents = 'none';
      input.setAttribute('tabIndex', '-1');
      input.blur();
    });
    
    // Force blur any currently focused element
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    
    if (!(await validateForm())) {
      toast({
        title: 'Please fix the errors below',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.put(`/api/students/${student._id}`, formData);
      
      // Close modal immediately after successful API call
      setIsLoading(false);
      
      // Re-enable inputs in case they were disabled by auto-focus prevention
      const allInputs = document.querySelectorAll('input, select, textarea');
      allInputs.forEach(input => {
        input.removeAttribute('readonly');
        input.style.pointerEvents = 'auto';
        input.removeAttribute('tabIndex');
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error updating student:', error);
      setIsLoading(false);
      toast({
        title: 'Error updating student',
        description: error.response?.data?.message || 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box maxH="calc(70vh - 80px)" overflowY="auto" px={{ base: 2, sm: 4, md: 6 }}>
        <VStack spacing={2} align="stretch" pb={4}>
          {/* Student ID and Roll Number */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
            <GridItem>
              <FormControl isRequired isInvalid={errors.studentId}>
                <FormLabel>Student ID</FormLabel>
                <Input
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="DPS25NUR001"
                  textTransform="uppercase"
                  size="md"
                  fontSize="md"
                  height="40px"
                  autoFocus={false}
                />
                {errors.studentId && <Text color="red.500" fontSize="md">{errors.studentId}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired isInvalid={errors.rollNo}>
                <FormLabel>Roll Number</FormLabel>
                <Input
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  placeholder="001"
                  size="md"
                  fontSize="md"
                  height="40px"
                  autoFocus={false}
                />
                {errors.rollNo && <Text color="red.500" fontSize="md">{errors.rollNo}</Text>}
              </FormControl>
            </GridItem>
          </Grid>

          {/* Student Name */}
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={3}>
            <GridItem>
              <FormControl isRequired isInvalid={errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.firstName && <Text color="red.500" fontSize="md">{errors.firstName}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.middleName}>
                <FormLabel>Middle Name</FormLabel>
                <Input
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Kumar"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.middleName && <Text color="red.500" fontSize="md">{errors.middleName}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired isInvalid={errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Sharma"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.lastName && <Text color="red.500" fontSize="md">{errors.lastName}</Text>}
              </FormControl>
            </GridItem>
          </Grid>

          {/* Government ID */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
            <GridItem>
              <FormControl isInvalid={errors.govtProvidedId}>
                <FormLabel>Government ID</FormLabel>
                <Input
                  name="govtProvidedId"
                  value={formData.govtProvidedId}
                  onChange={handleInputChange}
                  placeholder="Aadhar, Passport, etc."
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.govtProvidedId && <Text color="red.500" fontSize="md">{errors.govtProvidedId}</Text>}
              </FormControl>
            </GridItem>
          </Grid>

          {/* Father's Name */}
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={3}>
            <GridItem>
              <FormControl isRequired isInvalid={errors.fatherFirstName}>
                <FormLabel>Father's First Name</FormLabel>
                <Input
                  name="fatherFirstName"
                  value={formData.fatherFirstName}
                  onChange={handleInputChange}
                  placeholder="Ramesh"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.fatherFirstName && <Text color="red.500" fontSize="md">{errors.fatherFirstName}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.fatherMiddleName}>
                <FormLabel>Father's Middle Name</FormLabel>
                <Input
                  name="fatherMiddleName"
                  value={formData.fatherMiddleName}
                  onChange={handleInputChange}
                  placeholder="Kumar"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.fatherMiddleName && <Text color="red.500" fontSize="md">{errors.fatherMiddleName}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.fatherLastName}>
                <FormLabel>Father's Last Name</FormLabel>
                <Input
                  name="fatherLastName"
                  value={formData.fatherLastName}
                  onChange={handleInputChange}
                  placeholder="Sharma"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.fatherLastName && <Text color="red.500" fontSize="md">{errors.fatherLastName}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.fatherMobile}>
                <FormLabel>Father's Mobile Number</FormLabel>
                <Input
                  name="fatherMobile"
                  value={formData.fatherMobile}
                  onChange={handleInputChange}
                  placeholder="Enter Father's Mobile Number"
                  type="tel"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.fatherMobile && <Text color="red.500" fontSize="md">{errors.fatherMobile}</Text>}
              </FormControl>
            </GridItem>
          </Grid>

          {/* Mother's Name */}
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={3}>
            <GridItem>
              <FormControl isRequired isInvalid={errors.motherFirstName}>
                <FormLabel>Mother's First Name</FormLabel>
                <Input
                  name="motherFirstName"
                  value={formData.motherFirstName}
                  onChange={handleInputChange}
                  placeholder="Sunita"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.motherFirstName && <Text color="red.500" fontSize="md">{errors.motherFirstName}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.motherMiddleName}>
                <FormLabel>Mother's Middle Name</FormLabel>
                <Input
                  name="motherMiddleName"
                  value={formData.motherMiddleName}
                  onChange={handleInputChange}
                  placeholder="Devi"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.motherMiddleName && <Text color="red.500" fontSize="md">{errors.motherMiddleName}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.motherLastName}>
                <FormLabel>Mother's Last Name</FormLabel>
                <Input
                  name="motherLastName"
                  value={formData.motherLastName}
                  onChange={handleInputChange}
                  placeholder="Sharma"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.motherLastName && <Text color="red.500" fontSize="md">{errors.motherLastName}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.motherMobile}>
                <FormLabel>Mother's Mobile Number</FormLabel>
                <Input
                  name="motherMobile"
                  value={formData.motherMobile}
                  onChange={handleInputChange}
                  placeholder="Enter Mother's Mobile Number"
                  type="tel"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.motherMobile && <Text color="red.500" fontSize="md">{errors.motherMobile}</Text>}
              </FormControl>
            </GridItem>
          </Grid>

          {/* Personal Information */}
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={3}>
            <GridItem>
              <FormControl isRequired isInvalid={errors.gender}>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  placeholder="Select Gender"
                  size="md"
                  fontSize="md"
                  height="40px"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
                {errors.gender && <Text color="red.500" fontSize="md">{errors.gender}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired isInvalid={errors.dateOfBirth}>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.dateOfBirth && <Text color="red.500" fontSize="md">{errors.dateOfBirth}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired isInvalid={errors.category}>
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Select Category"
                  size="md"
                  fontSize="md"
                  height="40px"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </Select>
                {errors.category && <Text color="red.500" fontSize="md">{errors.category}</Text>}
              </FormControl>
            </GridItem>
          </Grid>

          {/* Contact Information */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
            <GridItem>
              <FormControl isRequired isInvalid={errors.contactNo}>
                <FormLabel>Contact Number</FormLabel>
                <Input
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  type="tel"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.contactNo && <Text color="red.500" fontSize="md">{errors.contactNo}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="student@example.com"
                  type="email"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.email && <Text color="red.500" fontSize="md">{errors.email}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.additionalContactNo}>
                <FormLabel>Additional Contact Number</FormLabel>
                <Input
                  name="additionalContactNo"
                  value={formData.additionalContactNo}
                  onChange={handleInputChange}
                  placeholder="Additional contact number"
                  type="tel"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.additionalContactNo && <Text color="red.500" fontSize="md">{errors.additionalContactNo}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.aadharCardNo}>
                <FormLabel>Aadhar Card Number</FormLabel>
                <Input
                  name="aadharCardNo"
                  value={formData.aadharCardNo}
                  onChange={handleInputChange}
                  placeholder="12-digit Aadhar number"
                  type="tel"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.aadharCardNo && <Text color="red.500" fontSize="md">{errors.aadharCardNo}</Text>}
              </FormControl>
            </GridItem>
          </Grid>

          {/* Academic Information */}
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={3}>
            <GridItem>
              <FormControl isRequired isInvalid={errors.admissionYear}>
                <FormLabel>Admission Year</FormLabel>
                <Select
                  name="admissionYear"
                  value={formData.admissionYear}
                  onChange={handleInputChange}
                  placeholder="Select Academic Session"
                  size="md"
                  fontSize="md"
                  height="40px"
                  isDisabled={loadingConfig}
                >
                  {academicYears.map((year) => (
                    <option key={year._id} value={year._id}>{year.year_code}</option>
                  ))}
                </Select>
                {errors.admissionYear && <Text color="red.500" fontSize="md">{errors.admissionYear}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired isInvalid={errors.currentStudyClass}>
                <FormLabel>Current Class</FormLabel>
                <Select
                  name="currentStudyClass"
                  value={formData.currentStudyClass}
                  onChange={handleInputChange}
                  placeholder="Select Class"
                  size="md"
                  fontSize="md"
                  height="40px"
                  isDisabled={loadingConfig}
                >
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>{cls.class_name}</option>
                  ))}
                </Select>
                {errors.currentStudyClass && <Text color="red.500" fontSize="md">{errors.currentStudyClass}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired isInvalid={errors.currentSection}>
                <FormLabel>Current Section</FormLabel>
                <Select
                  name="currentSection"
                  value={formData.currentSection}
                  onChange={handleInputChange}
                  placeholder="Select Section"
                  size="md"
                  fontSize="md"
                  height="40px"
                  isDisabled={loadingConfig}
                >
                  {sections.map((section) => (
                    <option key={section._id} value={section._id}>{section.section_name}</option>
                  ))}
                </Select>
                {errors.currentSection && <Text color="red.500" fontSize="md">{errors.currentSection}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.medium}>
                <FormLabel>Medium</FormLabel>
                <Select
                  name="medium"
                  value={formData.medium}
                  onChange={handleInputChange}
                  placeholder="Select Medium"
                  size="md"
                  fontSize="md"
                  height="40px"
                  isDisabled={loadingConfig}
                >
                  {mediums.map((medium) => (
                    <option key={medium._id} value={medium._id}>{medium.medium_name}</option>
                  ))}
                </Select>
                {errors.medium && <Text color="red.500" fontSize="md">{errors.medium}</Text>}
              </FormControl>
            </GridItem>
          </Grid>

          {/* Additional Information */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
            <GridItem>
              <FormControl isInvalid={errors.community}>
                <FormLabel>Community</FormLabel>
                <Select
                  name="community"
                  value={formData.community}
                  onChange={handleInputChange}
                  placeholder="Select Community"
                  size="md"
                  fontSize="md"
                  height="40px"
                >
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Jain">Jain</option>
                  <option value="Parsi">Parsi</option>
                  <option value="Other">Other</option>
                </Select>
                {errors.community && <Text color="red.500" fontSize="md">{errors.community}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired isInvalid={errors.nationality}>
                <FormLabel>Nationality</FormLabel>
                <Input
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  placeholder="Indian"
                  size="md"
                  fontSize="md"
                  height="40px"
                />
                {errors.nationality && <Text color="red.500" fontSize="md">{errors.nationality}</Text>}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.bloodGroup}>
                <FormLabel>Blood Group</FormLabel>
                <Select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  placeholder="Select Blood Group"
                  size="md"
                  fontSize="md"
                  height="40px"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Select>
                {errors.bloodGroup && <Text color="red.500" fontSize="md">{errors.bloodGroup}</Text>}
              </FormControl>
            </GridItem>
          </Grid>

          {/* Concession Information */}
          <Box>
            <Text fontsize="md" fontWeight="bold" mb={3} color="blue.600">Concession Details</Text>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
              <GridItem>
                <FormControl isInvalid={errors.concessionPercentage}>
                  <FormLabel>Concession Percentage</FormLabel>
                  <Input
                    name="concessionPercentage"
                    type="number"
                    value={formData.concessionPercentage}
                    onChange={handleInputChange}
                    placeholder="0"
                    size="md"
                    fontSize="md"
                    height="40px"
                    min="0"
                    max="100"
                  />
                  {errors.concessionPercentage && <Text color="red.500" fontSize="md">{errors.concessionPercentage}</Text>}
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isInvalid={errors.concessionReason}>
                  <FormLabel>Concession Reason</FormLabel>
                  <Input
                    name="concessionReason"
                    value={formData.concessionReason}
                    onChange={handleInputChange}
                    placeholder="Reason for concession"
                    size="md"
                    fontSize="md"
                    height="40px"
                  />
                  {errors.concessionReason && <Text color="red.500" fontSize="md">{errors.concessionReason}</Text>}
                </FormControl>
              </GridItem>
            </Grid>
          </Box>

        </VStack>
      </Box>
      
      <ModalFooter>
        <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
          Cancel
        </Button>
        <Button 
          colorScheme="blue" 
          type="submit" 
          isLoading={isLoading}
          loadingText="Updating..."
        >
          Update Student
        </Button>
      </ModalFooter>
    </form>
  );
};

export default EditStudentForm;


