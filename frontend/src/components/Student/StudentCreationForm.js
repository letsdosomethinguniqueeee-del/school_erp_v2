import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Box,
  Text,
  useToast,
  Grid,
  GridItem,
  Textarea,
  Divider,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/api';

const StudentCreationForm = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Configuration data state
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  
  const [formData, setFormData] = useState({
    // Basic Information
    studentId: '',
    rollNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    
    // Government ID
    govtProvidedId: '',
    
    // Father's Information
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherLastName: '',
    fatherMobile: '',
    
    // Mother's Information
    motherFirstName: '',
    motherMiddleName: '',
    motherLastName: '',
    motherMobile: '',
    
    // Parent IDs and Relations
    parent1Id: '',
    parent1Relation: '',
    parent2Id: '',
    parent2Relation: '',
    
    // Personal Details
    gender: '',
    dateOfBirth: '',
    category: '',
    community: '',
    nationality: 'Indian',
    bloodGroup: '',
    
    // Contact Information
    aadharCardNo: '',
    contactNo: '',
    additionalContactNo: '',
    email: '',
    
    // Academic Information
    admissionYear: '',
    currentStudyClass: '',
    currentSection: '',
    medium: '',
    
    // Concession Information
    concessionPercentage: 0,
    concessionReason: '',
    
    // Additional
    pic: ''
  });

  const [errors, setErrors] = useState({});

  // Fetch configuration data on component mount
  useEffect(() => {
    if (isOpen) {
      fetchConfigurationData();
    }
  }, [isOpen]);

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
      
      // Auto-select current academic year
      const currentYear = academicYearsRes.data.data?.find(year => year.status === 'current');
      if (currentYear && !formData.admissionYear) {
        setFormData(prev => ({ ...prev, admissionYear: currentYear._id }));
      }
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
  const validateRollNumberUniqueness = async (rollNo, currentClass) => {
    if (!rollNo || !currentClass) return true;
    
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await api.get(`/api/students/check-roll-no?rollNo=${rollNo}&class=${currentClass}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return !response.data.exists; // Return true if roll number is unique
    } catch (error) {
      console.error('Error validating roll number:', error);
      return true; // Allow submission if validation fails
    }
  };

  const validateForm = async () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.rollNo.trim()) newErrors.rollNo = 'Roll Number is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.fatherFirstName.trim()) newErrors.fatherFirstName = 'Father\'s First Name is required';
    if (!formData.motherFirstName.trim()) newErrors.motherFirstName = 'Mother\'s First Name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    if (!formData.admissionYear) newErrors.admissionYear = 'Academic Session is required';
    if (!formData.currentStudyClass) newErrors.currentStudyClass = 'Current Class is required';
    if (!formData.currentSection) newErrors.currentSection = 'Current Section is required';
    if (!formData.medium) newErrors.medium = 'Medium is required';
    
    // Student ID validation - just check if it's not empty (uniqueness will be checked on backend)
    if (formData.studentId.trim()) {
      // Basic validation - just ensure it's not empty and has reasonable length
      if (formData.studentId.trim().length < 3) {
        newErrors.studentId = 'Student ID must be at least 3 characters long';
      }
    }
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone number validation
    if (formData.contactNo && !/^[0-9]{10}$/.test(formData.contactNo.replace(/\D/g, ''))) {
      newErrors.contactNo = 'Please enter a valid 10-digit phone number';
    }
    
    // Father mobile validation
    if (formData.fatherMobile && !/^[0-9]{10}$/.test(formData.fatherMobile.replace(/\D/g, ''))) {
      newErrors.fatherMobile = 'Father mobile number must be 10 digits';
    }
    
    // Mother mobile validation
    if (formData.motherMobile && !/^[0-9]{10}$/.test(formData.motherMobile.replace(/\D/g, ''))) {
      newErrors.motherMobile = 'Mother mobile number must be 10 digits';
    }
    
    // Aadhar validation
    if (formData.aadharCardNo && !/^[0-9]{12}$/.test(formData.aadharCardNo.replace(/\D/g, ''))) {
      newErrors.aadharCardNo = 'Please enter a valid 12-digit Aadhar number';
    }

    // Roll number uniqueness validation
    if (formData.rollNo.trim() && formData.currentStudyClass) {
      const isRollNoUnique = await validateRollNumberUniqueness(formData.rollNo.trim(), formData.currentStudyClass);
      if (!isRollNoUnique) {
        newErrors.rollNo = `Roll number ${formData.rollNo} already exists in class ${formData.currentStudyClass}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Set loading state immediately for better UX
    setIsLoading(true);
    
    if (!(await validateForm())) {
      setIsLoading(false);
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const response = await api.post('/api/students', formData);
      
      console.log('Student creation response:', response.data);
      
      // Close modal immediately after successful API call
      setIsLoading(false);
      
      // Reset form
      setFormData({
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
        nationality: 'Indian',
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
      setErrors({});
      onClose();
      if (onSuccess) onSuccess(response.data);
      
      toast({
        title: 'Student Created Successfully!',
        description: `Student ${formData.firstName} ${formData.lastName} has been admitted and user account created. Username: ${formData.studentId}, Password: Password`,
        status: 'success',
        duration: 8000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Error creating student:', error);
      setIsLoading(false);
      toast({
        title: 'Error Creating Student',
        description: error.response?.data?.message || 'Failed to create student. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setFormData({
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
      nationality: 'Indian',
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
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent 
        maxH="90vh" 
        mx={{ base: 4, sm: 6, md: 8, lg: 0 }}
        my={{ base: 4, sm: 6, md: 8, lg: 0 }}
        maxW={{ base: "calc(100vw - 32px)", sm: "calc(100vw - 48px)", md: "calc(100vw - 64px)", lg: "5xl", xl: "6xl", "2xl": "7xl" }}
        w={{ base: "calc(100vw - 32px)", sm: "calc(100vw - 48px)", md: "calc(100vw - 64px)", lg: "auto" }}
        sx={{
          '@media (min-width: 928px)': {
            maxWidth: '896px !important',
            width: '896px !important'
          }
        }}
      >
        <ModalHeader fontSize={{ base: "lg", md: "xl" }} py={3} px={{ base: 4, sm: 5, md: 6 }}>Add New Student</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={0} px={{ base: 4, sm: 5, md: 6 }}>
          <Box maxH="calc(70vh - 80px)" overflowY="auto">
            <VStack spacing={2} align="stretch" pb={4}>

            {/* Basic Information */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={6} color="blue.600">
                Basic Information
              </Text>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
                <GridItem>
                  <FormControl isRequired isInvalid={errors.studentId}>
                    <FormLabel>Student ID</FormLabel>
                    <Input
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      placeholder="Enter Student ID"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.studentId && <Text color="red.500" fontSize="sm">{errors.studentId}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isRequired isInvalid={errors.rollNo}>
                    <FormLabel>Roll Number</FormLabel>
                    <Input
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      placeholder="Enter Roll Number"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.rollNo && <Text color="red.500" fontSize="sm">{errors.rollNo}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isRequired isInvalid={errors.firstName}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter First Name"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.firstName && <Text color="red.500" fontSize="sm">{errors.firstName}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.middleName}>
                    <FormLabel>Middle Name</FormLabel>
                    <Input
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      placeholder="Enter Middle Name"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isRequired isInvalid={errors.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter Last Name"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.lastName && <Text color="red.500" fontSize="sm">{errors.lastName}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.govtProvidedId}>
                    <FormLabel>Government Provided ID</FormLabel>
                    <Input
                      name="govtProvidedId"
                      value={formData.govtProvidedId}
                      onChange={handleInputChange}
                      placeholder="Enter Government ID"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.govtProvidedId && <Text color="red.500" fontSize="sm">{errors.govtProvidedId}</Text>}
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>

            <Divider my={6} />

            {/* Father's Information */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={6} color="blue.600">
                Father's Information
              </Text>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
                <GridItem>
                  <FormControl isRequired isInvalid={errors.fatherFirstName}>
                    <FormLabel>Father's First Name</FormLabel>
                    <Input
                      name="fatherFirstName"
                      value={formData.fatherFirstName}
                      onChange={handleInputChange}
                      placeholder="Enter Father's First Name"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.fatherFirstName && <Text color="red.500" fontSize="sm">{errors.fatherFirstName}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.fatherMiddleName}>
                    <FormLabel>Father's Middle Name</FormLabel>
                    <Input
                      name="fatherMiddleName"
                      value={formData.fatherMiddleName}
                      onChange={handleInputChange}
                      placeholder="Enter Father's Middle Name"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.fatherLastName}>
                    <FormLabel>Father's Last Name</FormLabel>
                    <Input
                      name="fatherLastName"
                      value={formData.fatherLastName}
                      onChange={handleInputChange}
                      placeholder="Enter Father's Last Name"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.fatherMobile}>
                    <FormLabel>Father's Mobile</FormLabel>
                    <Input
                      name="fatherMobile"
                      value={formData.fatherMobile}
                      onChange={handleInputChange}
                      placeholder="Enter Father's Mobile"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.fatherMobile && <Text color="red.500" fontSize="sm">{errors.fatherMobile}</Text>}
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>

            <Divider my={6} />

            {/* Mother's Information */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={6} color="blue.600">
                Mother's Information
              </Text>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
                <GridItem>
                  <FormControl isRequired isInvalid={errors.motherFirstName}>
                    <FormLabel>Mother's First Name</FormLabel>
                    <Input
                      name="motherFirstName"
                      value={formData.motherFirstName}
                      onChange={handleInputChange}
                      placeholder="Enter Mother's First Name"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.motherFirstName && <Text color="red.500" fontSize="sm">{errors.motherFirstName}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.motherMiddleName}>
                    <FormLabel>Mother's Middle Name</FormLabel>
                    <Input
                      name="motherMiddleName"
                      value={formData.motherMiddleName}
                      onChange={handleInputChange}
                      placeholder="Enter Mother's Middle Name"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.motherLastName}>
                    <FormLabel>Mother's Last Name</FormLabel>
                    <Input
                      name="motherLastName"
                      value={formData.motherLastName}
                      onChange={handleInputChange}
                      placeholder="Enter Mother's Last Name"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.motherMobile}>
                    <FormLabel>Mother's Mobile</FormLabel>
                    <Input
                      name="motherMobile"
                      value={formData.motherMobile}
                      onChange={handleInputChange}
                      placeholder="Enter Mother's Mobile"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.motherMobile && <Text color="red.500" fontSize="sm">{errors.motherMobile}</Text>}
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>

            <Divider my={6} />

            {/* Personal Details */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={6} color="blue.600">
                Personal Details
              </Text>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
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
                    {errors.gender && <Text color="red.500" fontSize="sm">{errors.gender}</Text>}
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
                    {errors.dateOfBirth && <Text color="red.500" fontSize="sm">{errors.dateOfBirth}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.category}>
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
                      <option value="GENERAL">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </Select>
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.community}>
                    <FormLabel>Community</FormLabel>
                    <Input
                      name="community"
                      value={formData.community}
                      onChange={handleInputChange}
                      placeholder="Enter Community"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.nationality}>
                    <FormLabel>Nationality</FormLabel>
                    <Input
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      placeholder="Enter Nationality"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
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
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>

            <Divider my={6} />

            {/* Contact Information */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={6} color="blue.600">
                Contact Information
              </Text>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
                <GridItem>
                  <FormControl isInvalid={errors.aadharCardNo}>
                    <FormLabel>Aadhar Card Number</FormLabel>
                    <Input
                      name="aadharCardNo"
                      value={formData.aadharCardNo}
                      onChange={handleInputChange}
                      placeholder="Enter Aadhar Card Number"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.aadharCardNo && <Text color="red.500" fontSize="sm">{errors.aadharCardNo}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.contactNo}>
                    <FormLabel>Contact Number</FormLabel>
                    <Input
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                      placeholder="Enter Contact Number"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.contactNo && <Text color="red.500" fontSize="sm">{errors.contactNo}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.additionalContactNo}>
                    <FormLabel>Additional Contact Number</FormLabel>
                    <Input
                      name="additionalContactNo"
                      value={formData.additionalContactNo}
                      onChange={handleInputChange}
                      placeholder="Enter Additional Contact Number"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isInvalid={errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Email"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>

            <Divider my={6} />

            {/* Academic Information */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={6} color="blue.600">
                Academic Information
              </Text>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
                <GridItem>
                  <FormControl isRequired isInvalid={errors.admissionYear}>
                    <FormLabel>Academic Session</FormLabel>
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
                    {errors.admissionYear && <Text color="red.500" fontSize="sm">{errors.admissionYear}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isRequired isInvalid={errors.currentStudyClass}>
                    <FormLabel>Current Class</FormLabel>
                    <Select
                      name="currentStudyClass"
                      value={formData.currentStudyClass}
                      onChange={handleInputChange}
                      placeholder="Select Current Class"
                      size="md"
                      fontSize="md"
                      height="40px"
                      isDisabled={loadingConfig}
                    >
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>{cls.class_name}</option>
                      ))}
                    </Select>
                    {errors.currentStudyClass && <Text color="red.500" fontSize="sm">{errors.currentStudyClass}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isRequired isInvalid={errors.currentSection}>
                    <FormLabel>Current Section</FormLabel>
                    <Select
                      name="currentSection"
                      value={formData.currentSection}
                      onChange={handleInputChange}
                      placeholder="Select Current Section"
                      size="md"
                      fontSize="md"
                      height="40px"
                      isDisabled={loadingConfig}
                    >
                      {sections.map((section) => (
                        <option key={section._id} value={section._id}>{section.section_name}</option>
                      ))}
                    </Select>
                    {errors.currentSection && <Text color="red.500" fontSize="sm">{errors.currentSection}</Text>}
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl isRequired isInvalid={errors.medium}>
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
                    {errors.medium && <Text color="red.500" fontSize="sm">{errors.medium}</Text>}
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>

            <Divider my={6} />

            {/* Concession Details */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={4} color="blue.600">Concession Details</Text>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                <GridItem>
                  <FormControl isInvalid={errors.concessionPercentage}>
                    <FormLabel>Concession Percentage</FormLabel>
                    <Input
                      name="concessionPercentage"
                      type="number"
                      value={formData.concessionPercentage}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      size="md"
                      fontSize="md"
                      height="40px"
                    />
                    {errors.concessionPercentage && <Text color="red.500" fontSize="sm">{errors.concessionPercentage}</Text>}
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
                    {errors.concessionReason && <Text color="red.500" fontSize="sm">{errors.concessionReason}</Text>}
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>

            </VStack>
          </Box>
        </ModalBody>
        
        <ModalFooter py={3} px={{ base: 4, sm: 5, md: 6 }}>
          <Button variant="ghost" mr={3} onClick={handleCancel} size="md">
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Creating Student..."
            size="md"
          >
            Create Student
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StudentCreationForm;