import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useDisclosure,
  Box,
  Heading,
  Text,
  useToast,
  HStack,
  Divider,
  Badge,
  NumberInput,
  NumberInputField,
  Checkbox,
  CheckboxGroup,
  IconButton,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import ResponsiveTable from '../../Common/ResponsiveTable';
import api from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';

const StudentRecords = ({ modalType, onDataChange }) => {
  // Modal states
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Data states
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    // 1. Basic Information
    firstName: '',
    middleName: '',
    lastName: '',
    studentId: '',
    rollNo: '',
    govtProvidedId: '',
    pic: '', // Optional for now

    // 2. Father's Details
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherLastName: '',
    fatherMobile: '',

    // 3. Mother's Details
    motherFirstName: '',
    motherMiddleName: '',
    motherLastName: '',
    motherMobile: '',

    // 4. Parent/Guardian Relations
    parent1Id: '',
    parent1Relation: '',
    parent2Id: '',
    parent2Relation: '',

    // 5. Personal Details
    gender: '',
    dateOfBirth: '',
    category: '',
    community: '',
    nationality: 'India',
    bloodGroup: '',

    // 6. Contact Information
    aadharCardNo: '',
    contactNo: '',
    additionalContactNo: '',
    email: '',

    // 7. Academic Information (Current)
    admissionYear: new Date().getFullYear(),
    currentAcademicYear: '', // NEW
    currentStudyClass: '',
    currentSection: '',
    currentMedium: '', // NEW
    currentStream: '', // NEW
    subjects: [], // NEW - Array

    // 8. Concession Array (Separate section)
    concessions: [] // NEW - Array of {academicYear, percentage, reason, isActive}
  });

  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState(formData);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // Dropdown data
  const [classes, setClasses] = useState([]);
  const [allSections, setAllSections] = useState([]); // All sections from API (for reference)
  const [allMediums, setAllMediums] = useState([]); // All mediums from API (for reference)
  const [allStreams, setAllStreams] = useState([]); // All streams from API (for reference)
  const [allSubjects, setAllSubjects] = useState([]); // All subjects from API (for reference)
  const [academicYears, setAcademicYears] = useState([]);
  const [classMappings, setClassMappings] = useState([]); // All class mappings
  
  // Filtered dropdowns based on selections from class mappings
  const [filteredSections, setFilteredSections] = useState([]);
  const [filteredMediums, setFilteredMediums] = useState([]);
  const [filteredStreams, setFilteredStreams] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  // Concession management state
  const [currentConcession, setCurrentConcession] = useState({
    academicYear: '',
    percentage: 0,
    reason: '',
    isActive: true
  });

  const toast = useToast();

  // Fetch dropdown data
  const fetchClasses = useCallback(async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CLASSES);
      if (response.data.success && response.data.data) {
        setClasses(response.data.data.map(c => ({ value: c.class_name, label: c.class_name })));
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, []);

  const fetchSections = useCallback(async () => {
    try {
      const response = await api.get(API_ENDPOINTS.SECTIONS);
      if (response.data.success && response.data.data) {
        setAllSections(response.data.data.map(s => ({ value: s.section_name, label: s.section_name })));
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  }, []);

  const fetchMediums = useCallback(async () => {
    try {
      const response = await api.get(API_ENDPOINTS.MEDIUMS);
      if (response.data.success && response.data.data) {
        setAllMediums(response.data.data.map(m => ({ value: m.medium_name, label: m.medium_name })));
      }
    } catch (error) {
      console.error('Error fetching mediums:', error);
    }
  }, []);

  const fetchStreams = useCallback(async () => {
    try {
      const response = await api.get(API_ENDPOINTS.STREAMS);
      if (response.data.success && response.data.data) {
        setAllStreams(response.data.data.map(s => ({ value: s.stream_name, label: s.stream_name })));
      }
    } catch (error) {
      console.error('Error fetching streams:', error);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await api.get(API_ENDPOINTS.SUBJECTS);
      if (response.data.success && response.data.data) {
        setAllSubjects(response.data.data.map(s => ({ value: s.subject_name, label: s.subject_name })));
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, []);

  // Fetch class mappings
  const fetchClassMappings = useCallback(async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CLASS_MAPPINGS);
      if (response.data.success && response.data.data) {
        setClassMappings(response.data.data.filter(cm => cm.is_active !== false));
      }
    } catch (error) {
      console.error('Error fetching class mappings:', error);
    }
  }, []);

  const fetchAcademicYears = useCallback(async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ACADEMIC_YEARS);
      if (response.data.success && response.data.data) {
        const sortedYears = response.data.data
          .map(ay => ({
            value: ay.year_code,
            label: ay.year_code
          }))
          .sort((a, b) => b.value.localeCompare(a.value)); // Sort in descending order
        setAcademicYears(sortedYears);
      }
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  }, []);

  // Fetch students
  const fetchStudents = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get(API_ENDPOINTS.STUDENTS);

      if (response.data.data) {
        const transformedData = response.data.data.map(item => {
          // Get current academic year concession if available
          const currentConcession = item.concessions && item.concessions.length > 0
            ? item.concessions.find(c => c.academicYear === item.currentAcademicYear && c.isActive) || item.concessions[item.concessions.length - 1]
            : null;

          // Build father and mother full names
          const fatherFullName = `${item.fatherFirstName || ''} ${item.fatherMiddleName || ''} ${item.fatherLastName || ''}`.trim() || 'N/A';
          const motherFullName = `${item.motherFirstName || ''} ${item.motherMiddleName || ''} ${item.motherLastName || ''}`.trim() || 'N/A';

          return {
            id: item._id,
            // 1. Basic Information
            studentId: item.studentId,
            firstName: item.firstName || 'N/A',
            middleName: item.middleName || 'N/A',
            lastName: item.lastName || 'N/A',
            rollNo: item.rollNo,
            govtProvidedId: item.govtProvidedId || 'N/A',

            // 2. Father's Details
            fatherFullName: fatherFullName,
            fatherMobile: item.fatherMobile || 'N/A',

            // 3. Mother's Details
            motherFullName: motherFullName,
            motherMobile: item.motherMobile || 'N/A',

            // 4. Parent/Guardian Relations
            parent1Id: item.parent1Id || 'N/A',
            parent1Relation: item.parent1Relation || 'N/A',
            parent2Id: item.parent2Id || 'N/A',
            parent2Relation: item.parent2Relation || 'N/A',

            // 5. Personal Details
            gender: item.gender || 'N/A',
            dateOfBirth: item.dateOfBirth,
            category: item.category || 'N/A',
            community: item.community || 'N/A',
            nationality: item.nationality || 'N/A',
            bloodGroup: item.bloodGroup || 'N/A',

            // 6. Contact Information
            aadharCardNo: item.aadharCardNo || 'N/A',
            contactNo: item.contactNo || 'N/A',
            additionalContactNo: item.additionalContactNo || 'N/A',
            email: item.email || 'N/A',

            // 7. Academic Information
            admissionYear: item.admissionYear || 'N/A',
            currentAcademicYear: item.currentAcademicYear || 'N/A',
            currentStudyClass: item.currentStudyClass || 'N/A',
            currentSection: item.currentSection || 'N/A',
            currentMedium: item.currentMedium || 'N/A',
            currentStream: item.currentStream || 'N/A',
            subjectsCount: item.subjects ? item.subjects.length : 0,
            subjects: item.subjects || [],

            // 8. Concession Array (Current Year + All Years for reference)
            currentConcessionPercentage: currentConcession ? currentConcession.percentage : (item.concessionPercentage || 0),
            concessionReason: currentConcession ? currentConcession.reason : (item.concessionReason || ''),
            concessions: item.concessions || [], // Keep full array for reference

            // Timestamps
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,

            // Keep full data for edit/view
            fullData: item
          };
        });
        setStudents(transformedData);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Your session has expired. Please log in again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access student records',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to server. Please check your internet connection.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to fetch student records',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStudents(true);
    fetchClasses();
    fetchSections();
    fetchMediums();
    fetchStreams();
    fetchSubjects();
    fetchAcademicYears();
    fetchClassMappings();
  }, [fetchStudents, fetchClasses, fetchSections, fetchMediums, fetchStreams, fetchSubjects, fetchAcademicYears, fetchClassMappings]);

  // Filter mediums based on selected class
  useEffect(() => {
    if (formData.currentStudyClass && classMappings.length > 0) {
      const classMappingsForClass = classMappings.filter(cm => cm.class_name === formData.currentStudyClass);
      
      // Get unique mediums for this class
      const uniqueMediums = [...new Set(classMappingsForClass.map(cm => cm.medium))];
      setFilteredMediums(uniqueMediums.map(m => ({ value: m, label: m })));
    } else {
      setFilteredMediums([]);
    }
  }, [formData.currentStudyClass, classMappings]);

  // Filter sections based on selected class and stream
  useEffect(() => {
    if (formData.currentStudyClass && formData.currentStream && classMappings.length > 0) {
      const classMappingsForClassAndStream = classMappings.filter(cm => 
        cm.class_name === formData.currentStudyClass && 
        cm.stream === formData.currentStream
      );
      
      // Get unique sections for this class and stream
      const allSectionsForClassAndStream = classMappingsForClassAndStream.flatMap(cm => cm.sections || []);
      const uniqueSections = [...new Set(allSectionsForClassAndStream)];
      setFilteredSections(uniqueSections.map(s => ({ value: s, label: s })));
    } else {
      setFilteredSections([]);
    }
  }, [formData.currentStudyClass, formData.currentStream, classMappings]);

  // Filter streams based on selected class and medium
  useEffect(() => {
    if (formData.currentStudyClass && formData.currentMedium && classMappings.length > 0) {
      const uniqueStreams = [...new Set(
        classMappings
          .filter(cm => 
            cm.class_name === formData.currentStudyClass && 
            cm.medium === formData.currentMedium
          )
          .map(cm => cm.stream)
      )];
      setFilteredStreams(uniqueStreams.map(s => ({ value: s, label: s })));
    } else {
      setFilteredStreams([]);
    }
  }, [formData.currentStudyClass, formData.currentMedium, classMappings]);

  // Filter subjects based on selected class, medium, and stream
  // Show subjects as grouped options (each mapping's subjects as one group)
  useEffect(() => {
    if (formData.currentStudyClass && formData.currentMedium && formData.currentStream && classMappings.length > 0) {
      const mappings = classMappings.filter(cm => 
        cm.class_name === formData.currentStudyClass && 
        cm.medium === formData.currentMedium &&
        cm.stream === formData.currentStream
      );
      
      if (mappings.length > 0) {
        // Create grouped subject options - each mapping's subjects as one group
        // Show abbreviated codes instead of full names
        const subjectGroups = mappings.map((mapping, index) => {
          const subjectsList = mapping.subjects || [];
          // Create abbreviation: take first 3-4 letters of each subject
          const subjectsAbbr = subjectsList.map(sub => {
            // If subject has spaces, take first letter of each word, otherwise first 3-4 chars
            if (sub.includes(' ')) {
              return sub.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
            }
            return sub.substring(0, 4).toUpperCase();
          }).join(', ');
          return {
            value: `group_${index}`,
            label: subjectsAbbr,
            subjects: subjectsList
          };
        });
        setFilteredSubjects(subjectGroups);
      } else {
        setFilteredSubjects([]);
      }
    } else {
      setFilteredSubjects([]);
    }
  }, [formData.currentStudyClass, formData.currentMedium, formData.currentStream, classMappings]);

  // Watch for modal trigger from parent
  useEffect(() => {
    if (modalType === 'student-record') {
      onOpen();
    }
  }, [modalType, onOpen]);

  // Table columns - Based on your exact field list
  const columns = useMemo(() => [
    // 1. Basic Info
    {
      key: 'studentId',
      label: 'Student ID',
      sortable: true,
      minWidth: '120px',
    },
    {
      key: 'firstName',
      label: 'First Name',
      sortable: true,
      minWidth: '120px',
    },
    {
      key: 'middleName',
      label: 'Middle Name',
      sortable: true,
      minWidth: '120px',
    },
    {
      key: 'lastName',
      label: 'Last Name',
      sortable: true,
      minWidth: '120px',
    },
    {
      key: 'rollNo',
      label: 'Roll No',
      sortable: true,
      minWidth: '100px',
    },
    {
      key: 'govtProvidedId',
      label: 'Govt Provided ID',
      sortable: true,
      minWidth: '140px',
    },

    // 2. Father's Details
    {
      key: 'fatherFullName',
      label: 'Father Full Name',
      sortable: true,
      minWidth: '150px',
    },
    {
      key: 'fatherMobile',
      label: 'Father Mobile',
      sortable: true,
      minWidth: '130px',
    },

    // 3. Mother's Details
    {
      key: 'motherFullName',
      label: 'Mother Full Name',
      sortable: true,
      minWidth: '150px',
    },
    {
      key: 'motherMobile',
      label: 'Mother Mobile',
      sortable: true,
      minWidth: '130px',
    },

    // 4. Parent/Guardian Relations
    {
      key: 'parent1Id',
      label: 'Parent 1 ID',
      sortable: true,
      minWidth: '120px',
    },
    {
      key: 'parent1Relation',
      label: 'Parent 1 Relation',
      sortable: true,
      minWidth: '140px',
    },
    {
      key: 'parent2Id',
      label: 'Parent 2 ID',
      sortable: true,
      minWidth: '120px',
    },
    {
      key: 'parent2Relation',
      label: 'Parent 2 Relation',
      sortable: true,
      minWidth: '140px',
    },

    // 5. Personal Details
    {
      key: 'gender',
      label: 'Gender',
      sortable: true,
      minWidth: '100px',
      render: (value) => (
        <Badge colorScheme={value === 'Male' ? 'blue' : value === 'Female' ? 'pink' : 'gray'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'dateOfBirth',
      label: 'Date of Birth',
      sortable: true,
      type: 'date',
      minWidth: '120px',
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      minWidth: '100px',
    },
    {
      key: 'community',
      label: 'Community',
      sortable: true,
      minWidth: '110px',
    },
    {
      key: 'nationality',
      label: 'Nationality',
      sortable: true,
      minWidth: '110px',
    },
    {
      key: 'bloodGroup',
      label: 'Blood Group',
      sortable: true,
      minWidth: '110px',
    },

    // 6. Contact Information
    {
      key: 'aadharCardNo',
      label: 'Aadhar Card No',
      sortable: true,
      minWidth: '140px',
    },
    {
      key: 'contactNo',
      label: 'Contact No',
      sortable: true,
      minWidth: '120px',
    },
    {
      key: 'additionalContactNo',
      label: 'Additional Contact',
      sortable: true,
      minWidth: '150px',
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      minWidth: '180px',
    },

    // 7. Academic Information
    {
      key: 'admissionYear',
      label: 'Admission Year',
      sortable: true,
      minWidth: '130px',
    },
    {
      key: 'currentAcademicYear',
      label: 'Academic Year',
      sortable: true,
      minWidth: '130px',
    },
    {
      key: 'currentStudyClass',
      label: 'Current Class',
      sortable: true,
      minWidth: '120px',
    },
    {
      key: 'currentSection',
      label: 'Current Section',
      sortable: true,
      minWidth: '130px',
    },
    {
      key: 'currentMedium',
      label: 'Current Medium',
      sortable: true,
      minWidth: '130px',
    },
    {
      key: 'currentStream',
      label: 'Current Stream',
      sortable: true,
      minWidth: '130px',
    },
    {
      key: 'subjectsCount',
      label: 'Subjects',
      sortable: true,
      minWidth: '100px',
      render: (value) => (
        <Badge colorScheme="purple">
          {value} {value === 1 ? 'Subject' : 'Subjects'}
        </Badge>
      ),
    },

    // 8. Concession Array (Current Year - Full history available in View Modal)
    {
      key: 'currentConcessionPercentage',
      label: 'Concession %',
      sortable: true,
      minWidth: '120px',
      render: (value) => (
        <Badge colorScheme={value > 0 ? 'green' : 'gray'}>
          {value > 0 ? `${value}%` : 'No Concession'}
        </Badge>
      ),
    },
  ], []);

  // Handle Add
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.firstName || !formData.firstName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'First Name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!formData.lastName || !formData.lastName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Last Name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!formData.studentId || !formData.studentId.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Student ID is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!formData.rollNo || !formData.rollNo.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Roll No is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!formData.fatherFirstName || !formData.fatherFirstName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Father First Name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!formData.motherFirstName || !formData.motherFirstName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Mother First Name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate concessions - all three fields are required for each concession
    if (formData.concessions && formData.concessions.length > 0) {
      for (let i = 0; i < formData.concessions.length; i++) {
        const concession = formData.concessions[i];
        if (!concession.academicYear || !concession.academicYear.trim()) {
          toast({
            title: 'Validation Error',
            description: `Concession ${i + 1}: Academic Year is required`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        if (!concession.percentage || concession.percentage === 0) {
          toast({
            title: 'Validation Error',
            description: `Concession ${i + 1}: Concession Percentage is required`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        if (!concession.reason || !concession.reason.trim()) {
          toast({
            title: 'Validation Error',
            description: `Concession ${i + 1}: Concession Reason is required`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      // Prepare data - trim strings and handle empty values
      const studentData = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName?.trim() || '',
        lastName: formData.lastName.trim(),
        studentId: formData.studentId.trim(),
        rollNo: formData.rollNo.trim(),
        govtProvidedId: formData.govtProvidedId?.trim() || '',
        fatherFirstName: formData.fatherFirstName.trim(),
        fatherMiddleName: formData.fatherMiddleName?.trim() || '',
        fatherLastName: formData.fatherLastName?.trim() || '',
        fatherMobile: formData.fatherMobile?.trim() || '',
        motherFirstName: formData.motherFirstName.trim(),
        motherMiddleName: formData.motherMiddleName?.trim() || '',
        motherLastName: formData.motherLastName?.trim() || '',
        motherMobile: formData.motherMobile?.trim() || '',
        parent1Id: formData.parent1Id?.trim() || '',
        parent1Relation: formData.parent1Relation?.trim() || '',
        parent2Id: formData.parent2Id?.trim() || '',
        parent2Relation: formData.parent2Relation?.trim() || '',
        gender: formData.gender || '',
        dateOfBirth: formData.dateOfBirth || undefined,
        category: formData.category?.trim() || '',
        community: formData.community?.trim() || '',
        nationality: formData.nationality?.trim() || '',
        bloodGroup: formData.bloodGroup?.trim() || '',
        aadharCardNo: formData.aadharCardNo?.trim() || '',
        contactNo: formData.contactNo?.trim() || '',
        additionalContactNo: formData.additionalContactNo?.trim() || '',
        email: formData.email?.trim() || '',
        admissionYear: formData.admissionYear ? parseInt(formData.admissionYear) : new Date().getFullYear(),
        currentAcademicYear: formData.currentAcademicYear?.trim() || '',
        currentStudyClass: formData.currentStudyClass?.trim() || '',
        currentSection: formData.currentSection?.trim() || '',
        currentMedium: formData.currentMedium?.trim() || '',
        currentStream: formData.currentStream?.trim() || '',
        subjects: formData.subjects || [],
        concessions: formData.concessions && formData.concessions.length > 0
          ? formData.concessions.map(c => ({
              academicYear: c.academicYear?.trim() || '',
              percentage: c.percentage ? parseFloat(c.percentage) : 0,
              reason: c.reason?.trim() || '',
              isActive: c.isActive !== undefined ? c.isActive : true
            }))
          : []
      };

      const response = await api.post(API_ENDPOINTS.STUDENTS, studentData);

      if (response.data.status === 'success') {
        await fetchStudents();
        if (onDataChange) onDataChange(); // Trigger SystemUsers refresh
        toast({
          title: 'Success',
          description: 'Student record created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onClose();
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
          nationality: 'India',
          bloodGroup: '',
          aadharCardNo: '',
          contactNo: '',
          additionalContactNo: '',
          email: '',
          admissionYear: new Date().getFullYear(),
          currentAcademicYear: '',
          currentStudyClass: '',
          currentSection: '',
          currentMedium: '',
          currentStream: '',
          subjects: [],
          concessions: []
        });
      }
    } catch (error) {
      console.error('Error creating student:', error);
      if (error.response?.status === 400) {
        toast({
          title: 'Validation Error',
          description: error.response?.data?.message || 'Invalid data provided',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Your session has expired. Please log in again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to create student records',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to server. Please check your internet connection.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to create student record',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit
  const handleEdit = (row) => {
    const student = row.fullData || row;
    setEditingStudent(row);
    setEditFormData({
      firstName: student.firstName || '',
      middleName: student.middleName || '',
      lastName: student.lastName || '',
      studentId: student.studentId || '',
      rollNo: student.rollNo || '',
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
      nationality: student.nationality || 'India',
      bloodGroup: student.bloodGroup || '',
      aadharCardNo: student.aadharCardNo || '',
      contactNo: student.contactNo || '',
      additionalContactNo: student.additionalContactNo || '',
      email: student.email || '',
      admissionYear: student.admissionYear || new Date().getFullYear(),
      currentAcademicYear: student.currentAcademicYear || '',
      currentStudyClass: student.currentStudyClass || '',
      currentSection: student.currentSection || '',
      currentMedium: student.currentMedium || '',
      currentStream: student.currentStream || '',
      subjects: student.subjects || [],
      concessions: student.concessions && student.concessions.length > 0
        ? student.concessions.map(c => ({
            academicYear: c.academicYear || '',
            percentage: c.percentage || 0,
            reason: c.reason || '',
            isActive: c.isActive !== undefined ? c.isActive : true
          }))
        : []
    });
    onEditOpen();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingStudent || !editingStudent.id) {
      toast({
        title: 'Error',
        description: 'Student data is missing. Please refresh and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Client-side validation
    if (!editFormData.firstName || !editFormData.firstName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'First Name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!editFormData.lastName || !editFormData.lastName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Last Name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!editFormData.studentId || !editFormData.studentId.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Student ID is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!editFormData.rollNo || !editFormData.rollNo.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Roll No is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!editFormData.fatherFirstName || !editFormData.fatherFirstName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Father First Name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!editFormData.motherFirstName || !editFormData.motherFirstName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Mother First Name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate concessions - all three fields are required for each concession
    if (editFormData.concessions && editFormData.concessions.length > 0) {
      for (let i = 0; i < editFormData.concessions.length; i++) {
        const concession = editFormData.concessions[i];
        if (!concession.academicYear || !concession.academicYear.trim()) {
          toast({
            title: 'Validation Error',
            description: `Concession ${i + 1}: Academic Year is required`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        if (!concession.percentage || concession.percentage === 0) {
          toast({
            title: 'Validation Error',
            description: `Concession ${i + 1}: Concession Percentage is required`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        if (!concession.reason || !concession.reason.trim()) {
          toast({
            title: 'Validation Error',
            description: `Concession ${i + 1}: Concession Reason is required`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const studentData = {
        firstName: editFormData.firstName.trim(),
        middleName: editFormData.middleName?.trim() || '',
        lastName: editFormData.lastName.trim(),
        studentId: editFormData.studentId.trim(),
        rollNo: editFormData.rollNo.trim(),
        govtProvidedId: editFormData.govtProvidedId?.trim() || '',
        fatherFirstName: editFormData.fatherFirstName.trim(),
        fatherMiddleName: editFormData.fatherMiddleName?.trim() || '',
        fatherLastName: editFormData.fatherLastName?.trim() || '',
        fatherMobile: editFormData.fatherMobile?.trim() || '',
        motherFirstName: editFormData.motherFirstName.trim(),
        motherMiddleName: editFormData.motherMiddleName?.trim() || '',
        motherLastName: editFormData.motherLastName?.trim() || '',
        motherMobile: editFormData.motherMobile?.trim() || '',
        parent1Id: editFormData.parent1Id?.trim() || '',
        parent1Relation: editFormData.parent1Relation?.trim() || '',
        parent2Id: editFormData.parent2Id?.trim() || '',
        parent2Relation: editFormData.parent2Relation?.trim() || '',
        gender: editFormData.gender || '',
        dateOfBirth: editFormData.dateOfBirth || undefined,
        category: editFormData.category?.trim() || '',
        community: editFormData.community?.trim() || '',
        nationality: editFormData.nationality?.trim() || '',
        bloodGroup: editFormData.bloodGroup?.trim() || '',
        aadharCardNo: editFormData.aadharCardNo?.trim() || '',
        contactNo: editFormData.contactNo?.trim() || '',
        additionalContactNo: editFormData.additionalContactNo?.trim() || '',
        email: editFormData.email?.trim() || '',
        admissionYear: editFormData.admissionYear ? parseInt(editFormData.admissionYear) : new Date().getFullYear(),
        currentAcademicYear: editFormData.currentAcademicYear?.trim() || '',
        currentStudyClass: editFormData.currentStudyClass?.trim() || '',
        currentSection: editFormData.currentSection?.trim() || '',
        currentMedium: editFormData.currentMedium?.trim() || '',
        currentStream: editFormData.currentStream?.trim() || '',
        subjects: editFormData.subjects || [],
        concessions: editFormData.concessions && editFormData.concessions.length > 0
          ? editFormData.concessions.map(c => ({
              academicYear: c.academicYear?.trim() || '',
              percentage: c.percentage ? parseFloat(c.percentage) : 0,
              reason: c.reason?.trim() || '',
              isActive: c.isActive !== undefined ? c.isActive : true
            }))
          : []
      };

      const response = await api.put(API_ENDPOINTS.STUDENT_BY_ID(editingStudent.id), studentData);

      if (response.data.status === 'success') {
        await fetchStudents();
        if (onDataChange) onDataChange(); // Trigger SystemUsers refresh
        toast({
          title: 'Success',
          description: 'Student record updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onEditClose();
        setEditFormData(formData);
        setEditingStudent(null);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      if (error.response?.status === 400) {
        toast({
          title: 'Validation Error',
          description: error.response?.data?.message || 'Invalid data provided',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Your session has expired. Please log in again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to update student records',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 404) {
        toast({
          title: 'Student Not Found',
          description: 'The student you are trying to update no longer exists',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to server. Please check your internet connection.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to update student record',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = (row) => {
    setDeletingStudent(row);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;

    setDeleting(true);
    try {
      const response = await api.delete(API_ENDPOINTS.STUDENT_BY_ID(deletingStudent.id));

      if (response.data.status === 'success') {
        await fetchStudents();
        if (onDataChange) onDataChange(); // Trigger SystemUsers refresh
        onDeleteClose();
        setDeletingStudent(null);
        toast({
          title: 'Success',
          description: 'Student record deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Your session has expired. Please log in again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to delete student records',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 404) {
        toast({
          title: 'Student Not Found',
          description: 'The student you are trying to delete no longer exists',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to server. Please check your internet connection.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to delete student record',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setDeleting(false);
    }
  };

  // Handle View
  const handleView = (row) => {
    setViewingStudent(row.fullData || row);
    onViewOpen();
  };

  // Form field component - Organized with section titles, all fields one by one
  const renderFormFields = (formData, setFormData, isEdit = false) => (
    <VStack spacing={6} align="stretch">
      {/* 1. Basic Information */}
      <Box>
        <Heading size="sm" mb={4} color="blue.600">Basic Information</Heading>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Enter first name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Middle Name</FormLabel>
            <Input
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              placeholder="Enter middle name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Enter last name"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Student ID</FormLabel>
            <Input
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              placeholder="Enter student ID"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Roll No</FormLabel>
            <Input
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
              placeholder="Enter roll number"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Government Provided ID</FormLabel>
            <Input
              value={formData.govtProvidedId}
              onChange={(e) => setFormData({ ...formData, govtProvidedId: e.target.value })}
              placeholder="Enter government provided ID"
            />
          </FormControl>
        </VStack>
      </Box>

      <Divider />

      {/* 2. Father's Details */}
      <Box>
        <Heading size="sm" mb={4} color="blue.600">Father's Details</Heading>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Father First Name</FormLabel>
            <Input
              value={formData.fatherFirstName}
              onChange={(e) => setFormData({ ...formData, fatherFirstName: e.target.value })}
              placeholder="Enter father's first name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Father Middle Name</FormLabel>
            <Input
              value={formData.fatherMiddleName}
              onChange={(e) => setFormData({ ...formData, fatherMiddleName: e.target.value })}
              placeholder="Enter father's middle name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Father Last Name</FormLabel>
            <Input
              value={formData.fatherLastName}
              onChange={(e) => setFormData({ ...formData, fatherLastName: e.target.value })}
              placeholder="Enter father's last name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Father Mobile</FormLabel>
            <Input
              type="tel"
              value={formData.fatherMobile}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setFormData({ ...formData, fatherMobile: value });
              }}
              placeholder="Enter father's mobile number"
            />
          </FormControl>
        </VStack>
      </Box>

      <Divider />

      {/* 3. Mother's Details */}
      <Box>
        <Heading size="sm" mb={4} color="blue.600">Mother's Details</Heading>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Mother First Name</FormLabel>
            <Input
              value={formData.motherFirstName}
              onChange={(e) => setFormData({ ...formData, motherFirstName: e.target.value })}
              placeholder="Enter mother's first name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Mother Middle Name</FormLabel>
            <Input
              value={formData.motherMiddleName}
              onChange={(e) => setFormData({ ...formData, motherMiddleName: e.target.value })}
              placeholder="Enter mother's middle name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Mother Last Name</FormLabel>
            <Input
              value={formData.motherLastName}
              onChange={(e) => setFormData({ ...formData, motherLastName: e.target.value })}
              placeholder="Enter mother's last name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Mother Mobile</FormLabel>
            <Input
              type="tel"
              value={formData.motherMobile}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setFormData({ ...formData, motherMobile: value });
              }}
              placeholder="Enter mother's mobile number"
            />
          </FormControl>
        </VStack>
      </Box>

      <Divider />

      {/* 4. Parent/Guardian Relations */}
      <Box>
        <Heading size="sm" mb={4} color="blue.600">Parent/Guardian Relations</Heading>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Parent 1 ID</FormLabel>
            <Input
              value={formData.parent1Id}
              onChange={(e) => setFormData({ ...formData, parent1Id: e.target.value })}
              placeholder="Enter parent 1 ID"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Parent 1 Relation</FormLabel>
            <Input
              value={formData.parent1Relation}
              onChange={(e) => setFormData({ ...formData, parent1Relation: e.target.value })}
              placeholder="e.g., Father"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Parent 2 ID</FormLabel>
            <Input
              value={formData.parent2Id}
              onChange={(e) => setFormData({ ...formData, parent2Id: e.target.value })}
              placeholder="Enter parent 2 ID"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Parent 2 Relation</FormLabel>
            <Input
              value={formData.parent2Relation}
              onChange={(e) => setFormData({ ...formData, parent2Relation: e.target.value })}
              placeholder="e.g., Mother"
            />
          </FormControl>
        </VStack>
      </Box>

      <Divider />

      {/* 5. Personal Details */}
      <Box>
        <Heading size="sm" mb={4} color="blue.600">Personal Details</Heading>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Gender</FormLabel>
            <Select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              placeholder="Select gender"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Date of Birth</FormLabel>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Select category"
            >
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="Other">Other</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Community</FormLabel>
            <Select
              value={formData.community}
              onChange={(e) => setFormData({ ...formData, community: e.target.value })}
              placeholder="Select community"
            >
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>
              <option value="Buddhist">Buddhist</option>
              <option value="Jain">Jain</option>
              <option value="Other">Other</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Nationality</FormLabel>
            <Select
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            >
              <option value="India">India</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
              <option value="Andorra">Andorra</option>
              <option value="Angola">Angola</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Argentina">Argentina</option>
              <option value="Armenia">Armenia</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Barbados">Barbados</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Belize">Belize</option>
              <option value="Benin">Benin</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Bolivia">Bolivia</option>
              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
              <option value="Botswana">Botswana</option>
              <option value="Brazil">Brazil</option>
              <option value="Brunei">Brunei</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cambodia">Cambodia</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Canada">Canada</option>
              <option value="Cape Verde">Cape Verde</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Chad">Chad</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Colombia">Colombia</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Croatia">Croatia</option>
              <option value="Cuba">Cuba</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="East Timor">East Timor</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Egypt">Egypt</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Greece">Greece</option>
              <option value="Grenada">Grenada</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Korea, North">Korea, North</option>
              <option value="Korea, South">Korea, South</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Laos">Laos</option>
              <option value="Latvia">Latvia</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libya">Libya</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Macedonia">Macedonia</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mexico">Mexico</option>
              <option value="Micronesia">Micronesia</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Namibia">Namibia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau">Palau</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Qatar">Qatar</option>
              <option value="Romania">Romania</option>
              <option value="Russia">Russia</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
              <option value="Samoa">Samoa</option>
              <option value="San Marino">San Marino</option>
              <option value="Sao Tome and Principe">Sao Tome and Principe</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Swaziland">Swaziland</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Thailand">Thailand</option>
              <option value="Togo">Togo</option>
              <option value="Tonga">Tonga</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Uganda">Uganda</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Vatican City">Vatican City</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Blood Group</FormLabel>
            <Select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              placeholder="Select blood group"
            >
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </Select>
          </FormControl>
        </VStack>
      </Box>

      <Divider />

      {/* 6. Contact Information */}
      <Box>
        <Heading size="sm" mb={4} color="blue.600">Contact Information</Heading>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Aadhar Card No</FormLabel>
            <Input
              value={formData.aadharCardNo}
              onChange={(e) => setFormData({ ...formData, aadharCardNo: e.target.value })}
              placeholder="Enter Aadhar card number"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Contact No</FormLabel>
            <Input
              value={formData.contactNo}
              onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
              placeholder="Enter contact number"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Additional Contact No</FormLabel>
            <Input
              value={formData.additionalContactNo}
              onChange={(e) => setFormData({ ...formData, additionalContactNo: e.target.value })}
              placeholder="Enter additional contact"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
            />
          </FormControl>
        </VStack>
      </Box>

      <Divider />

      {/* 7. Academic Information */}
      <Box>
        <Heading size="sm" mb={4} color="blue.600">Academic Information</Heading>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Admission Year</FormLabel>
            <NumberInput
              value={formData.admissionYear}
              onChange={(value) => setFormData({ ...formData, admissionYear: value })}
              min={2000}
              max={new Date().getFullYear() + 1}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Current Academic Year</FormLabel>
            <Select
              value={formData.currentAcademicYear}
              onChange={(e) => setFormData({ ...formData, currentAcademicYear: e.target.value })}
              placeholder="Select academic year"
            >
              {academicYears.map(ay => (
                <option key={ay.value} value={ay.value}>{ay.label}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Current Class</FormLabel>
            <Select
              value={formData.currentStudyClass}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  currentStudyClass: e.target.value,
                  currentMedium: '',
                  currentStream: '',
                  currentSection: '',
                  subjects: []
                });
              }}
              placeholder="Select class"
            >
              {classes.map(cls => (
                <option key={cls.value} value={cls.value}>{cls.label}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Current Medium</FormLabel>
            <Select
              value={formData.currentMedium}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  currentMedium: e.target.value,
                  currentStream: '',
                  subjects: []
                });
              }}
              placeholder="Select medium"
              isDisabled={!formData.currentStudyClass || filteredMediums.length === 0}
            >
              {filteredMediums.map(med => (
                <option key={med.value} value={med.value}>{med.label}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Current Stream</FormLabel>
            <Select
              value={formData.currentStream}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  currentStream: e.target.value,
                  currentSection: '',
                  subjects: []
                });
              }}
              placeholder="Select stream"
              isDisabled={!formData.currentStudyClass || !formData.currentMedium || filteredStreams.length === 0}
            >
              {filteredStreams.map(str => (
                <option key={str.value} value={str.value}>{str.label}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Current Section</FormLabel>
            <Select
              value={formData.currentSection}
              onChange={(e) => setFormData({ ...formData, currentSection: e.target.value })}
              placeholder="Select section"
              isDisabled={!formData.currentStudyClass || !formData.currentStream || filteredSections.length === 0}
            >
              {filteredSections.map(sec => (
                <option key={sec.value} value={sec.value}>{sec.label}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Subjects</FormLabel>
            <Select
              value={formData.subjects && formData.subjects.length > 0 
                ? filteredSubjects.find(sg => 
                    sg.subjects && sg.subjects.every(sub => formData.subjects.includes(sub)) &&
                    sg.subjects.length === formData.subjects.length
                  )?.value || ''
                : ''
              }
              onChange={(e) => {
                const selectedGroupValue = e.target.value;
                if (selectedGroupValue) {
                  const selectedGroup = filteredSubjects.find(sg => sg.value === selectedGroupValue);
                  if (selectedGroup && selectedGroup.subjects) {
                    setFormData({ 
                      ...formData, 
                      subjects: selectedGroup.subjects
                    });
                  }
                } else {
                  setFormData({ 
                    ...formData, 
                    subjects: []
                  });
                }
              }}
              placeholder="Select subjects"
              isDisabled={!formData.currentStudyClass || !formData.currentMedium || !formData.currentStream || filteredSubjects.length === 0}
              size="sm"
              fontSize="sm"
              sx={{
                fontSize: 'sm !important'
              }}
            >
              {filteredSubjects.map(group => (
                <option key={group.value} value={group.value} style={{ fontSize: '12px' }}>{group.label}</option>
              ))}
            </Select>
          </FormControl>
        </VStack>
      </Box>

      <Divider />

      {/* 8. Concession Details */}
      <Box>
        <Heading size="sm" mb={4} color="blue.600">Concession Details</Heading>
        <VStack spacing={3} align="stretch">
          {formData.concessions && formData.concessions.length > 0 && (
            formData.concessions.map((concession, index) => (
              <HStack key={index} spacing={2} align="flex-end">
                <FormControl isRequired flex="1.3">
                  <Select
                    size="sm"
                    fontSize="sm"
                    value={concession.academicYear || ''}
                    onChange={(e) => {
                      const updatedConcessions = [...formData.concessions];
                      updatedConcessions[index] = {
                        ...updatedConcessions[index],
                        academicYear: e.target.value
                      };
                      setFormData({ ...formData, concessions: updatedConcessions });
                    }}
                    placeholder="Year"
                    sx={{
                      minHeight: '28px !important',
                      paddingTop: '0px !important',
                      paddingBottom: '0px !important'
                    }}
                  >
                    {academicYears.map(ay => (
                      <option key={ay.value} value={ay.value}>{ay.label}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired flex={1}>
                  <InputGroup size="sm">
                    <NumberInput
                      size="sm"
                      value={concession.percentage || 0}
                      onChange={(value) => {
                        const updatedConcessions = [...formData.concessions];
                        updatedConcessions[index] = {
                          ...updatedConcessions[index],
                          percentage: value
                        };
                        setFormData({ ...formData, concessions: updatedConcessions });
                      }}
                      min={0}
                      max={100}
                      precision={2}
                      width="100%"
                    >
                      <NumberInputField 
                        fontSize="sm" 
                        placeholder="0" 
                        pr="2.5rem"
                        sx={{
                          minHeight: '28px !important',
                          paddingTop: '0px !important',
                          paddingBottom: '0px !important'
                        }}
                      />
                    </NumberInput>
                    <InputRightElement width="2.5rem" pointerEvents="none">
                      <Text fontSize="sm" color="gray.500">%</Text>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl isRequired flex="1.5">
                  <Input
                    size="sm"
                    fontSize="sm"
                    value={concession.reason || ''}
                    onChange={(e) => {
                      const updatedConcessions = [...formData.concessions];
                      updatedConcessions[index] = {
                        ...updatedConcessions[index],
                        reason: e.target.value
                      };
                      setFormData({ ...formData, concessions: updatedConcessions });
                    }}
                    placeholder="Reason..."
                    sx={{
                      minHeight: '28px !important',
                      paddingTop: '0px !important',
                      paddingBottom: '0px !important'
                    }}
                  />
                </FormControl>
                <IconButton
                  aria-label="Delete concession"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updatedConcessions = formData.concessions.filter((_, i) => i !== index);
                    setFormData({ ...formData, concessions: updatedConcessions });
                  }}
                />
              </HStack>
            ))
          )}
          <Button
            leftIcon={<AddIcon />}
            colorScheme="gray"
            variant="outline"
            size="sm"
            fontSize="sm"
            onClick={() => {
              setFormData({
                ...formData,
                concessions: [
                  ...formData.concessions,
                  {
                    academicYear: '',
                    percentage: 0,
                    reason: '',
                    isActive: true
                  }
                ]
              });
            }}
            width="100%"
          >
            Add Concession
          </Button>
        </VStack>
      </Box>
    </VStack>
  );

  return (
    <>
      <Box p={4}>
        <Heading size="md" mb={4}>Student Records</Heading>
        <Text mb={4} color="gray.600">
          View and manage student information, academic records, and enrollment details.
        </Text>

        <ResponsiveTable
          data={students}
          columns={columns}
          pageSize={5}
          showPagination={true}
          showPageSizeSelector={true}
          showTotalCount={true}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortable={true}
          searchable={true}
          searchPlaceholder="Search by student ID, name, roll no..."
          searchFields={['studentId', 'name', 'rollNo']}
          loading={loading}
          emptyMessage={loading ? "Loading student records..." : "No student records found. Click 'Add New Student Record' to create one."}
          maxHeight="500px"
          stickyHeader={true}
          variant="simple"
          size="md"
        />
      </Box>

      {/* Add Student Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
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
            admissionYear: new Date().getFullYear(),
            currentStudyClass: '',
            currentMedium: '',
            currentStream: '',
            currentSection: '',
            subjects: [],
            concessions: []
          });
        }}
        size="md"
        scrollBehavior='inside'
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader>Add New Student Record</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {renderFormFields(formData, setFormData)}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => {
              onClose();
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
                admissionYear: new Date().getFullYear(),
                currentAcademicYear: '',
                currentStudyClass: '',
                currentSection: '',
                currentMedium: '',
                currentStream: '',
                subjects: [],
                concessions: []
              });
            }}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={submitting}
              loadingText="Creating..."
            >
              Create Student
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setEditFormData(formData);
          setEditingStudent(null);
        }}
        size="xl"
        scrollBehavior='inside'
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader>Edit Student Record</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {renderFormFields(editFormData, setEditFormData, true)}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => {
              onEditClose();
              setEditFormData(formData);
              setEditingStudent(null);
            }}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleEditSubmit}
              isLoading={submitting}
              loadingText="Updating..."
            >
              Update Student
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Student Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={onViewClose}
        size="lg"
        scrollBehavior='inside'
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader>
            <Heading size="md" color="gray.700">Student Information</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewingStudent && (
              <VStack spacing={6} align="stretch">
                {/* 1. Basic Information */}
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">👤</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Basic Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Student ID</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.studentId || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>First Name</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.firstName || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Middle Name</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.middleName || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Last Name</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.lastName || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Roll No</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.rollNo || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Government Provided ID</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.govtProvidedId || 'N/A'}</Text>
                    </Box>
                  </VStack>
                </Box>

                <Divider />

                {/* 2. Father's Details */}
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">👨</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Father's Details</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Father Full Name</Text>
                      <Text fontSize="md" color="gray.800">
                        {`${viewingStudent.fatherFirstName || ''} ${viewingStudent.fatherMiddleName || ''} ${viewingStudent.fatherLastName || ''}`.trim() || 'N/A'}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Father Mobile</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.fatherMobile || 'N/A'}</Text>
                    </Box>
                  </VStack>
                </Box>

                <Divider />

                {/* 3. Mother's Details */}
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">👩</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Mother's Details</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Mother Full Name</Text>
                      <Text fontSize="md" color="gray.800">
                        {`${viewingStudent.motherFirstName || ''} ${viewingStudent.motherMiddleName || ''} ${viewingStudent.motherLastName || ''}`.trim() || 'N/A'}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Mother Mobile</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.motherMobile || 'N/A'}</Text>
                    </Box>
                  </VStack>
                </Box>

                <Divider />

                {/* 4. Parent/Guardian Relations */}
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">👨‍👩‍👧</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Parent/Guardian Relations</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Parent 1 ID</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.parent1Id || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Parent 1 Relation</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.parent1Relation || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Parent 2 ID</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.parent2Id || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Parent 2 Relation</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.parent2Relation || 'N/A'}</Text>
                    </Box>
                  </VStack>
                </Box>

                <Divider />

                {/* 5. Personal Details */}
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">📋</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Personal Details</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Gender</Text>
                      <Badge
                        colorScheme={viewingStudent.gender === 'Male' ? 'blue' : viewingStudent.gender === 'Female' ? 'pink' : 'gray'}
                        variant="subtle"
                        px="8px"
                        py="2px"
                        borderRadius="12px"
                        fontSize="sm"
                        fontWeight="500"
                      >
                        {viewingStudent.gender || 'N/A'}
                      </Badge>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Date of Birth</Text>
                      <Text fontSize="md" color="gray.800">
                        {(() => {
                          try {
                            if (!viewingStudent.dateOfBirth) return 'N/A';
                            const date = new Date(viewingStudent.dateOfBirth);
                            if (isNaN(date.getTime())) return 'Invalid Date';
                            return date.toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            });
                          } catch (error) {
                            return 'Invalid Date';
                          }
                        })()}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Category</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.category || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Community</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.community || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Nationality</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.nationality || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Blood Group</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.bloodGroup || 'N/A'}</Text>
                    </Box>
                  </VStack>
                </Box>

                <Divider />

                {/* 6. Contact Information */}
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">📞</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Contact Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Aadhar Card No</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.aadharCardNo || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Contact No</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.contactNo || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Additional Contact No</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.additionalContactNo || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Email</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.email || 'N/A'}</Text>
                    </Box>
                  </VStack>
                </Box>

                <Divider />

                {/* 7. Academic Information */}
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">🎓</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Academic Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Admission Year</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.admissionYear || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Current Academic Year</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.currentAcademicYear || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Current Class</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.currentStudyClass || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Current Section</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.currentSection || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Current Medium</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.currentMedium || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Current Stream</Text>
                      <Text fontSize="md" color="gray.800">{viewingStudent.currentStream || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Subjects</Text>
                      {viewingStudent.subjects && viewingStudent.subjects.length > 0 ? (
                        <VStack align="start" spacing={1}>
                          {viewingStudent.subjects.map((subject, idx) => (
                            <Badge key={idx} colorScheme="purple" variant="subtle" px="8px" py="2px" borderRadius="12px" fontSize="sm" fontWeight="500">
                              {subject}
                            </Badge>
                          ))}
                        </VStack>
                      ) : (
                        <Text fontSize="md" color="gray.800">N/A</Text>
                      )}
                    </Box>
                  </VStack>
                </Box>

                <Divider />

                {/* 8. Concession Information */}
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">💰</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Concession Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    {viewingStudent.concessions && viewingStudent.concessions.length > 0 ? (
                      <>
                        <Box>
                          <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>Current Year Concession</Text>
                          {(() => {
                            const currentConcession = viewingStudent.concessions.find(c => c.isActive) || viewingStudent.concessions[viewingStudent.concessions.length - 1];
                            return currentConcession ? (
                              <VStack align="start" spacing={2}>
                                <Badge colorScheme="green" variant="subtle" px="8px" py="2px" borderRadius="12px" fontSize="sm" fontWeight="500">
                                  {currentConcession.percentage}% - {currentConcession.academicYear}
                                </Badge>
                                {currentConcession.reason && (
                                  <Text fontSize="sm" color="gray.600">{currentConcession.reason}</Text>
                                )}
                              </VStack>
                            ) : (
                              <Text fontSize="md" color="gray.800">No active concession</Text>
                            );
                          })()}
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>Concession History</Text>
                          <VStack align="stretch" spacing={2}>
                            {viewingStudent.concessions.map((concession, idx) => (
                              <Box key={idx} p={2} borderWidth="1px" borderRadius="md">
                                <HStack justify="space-between">
                                  <Badge colorScheme={concession.isActive ? 'green' : 'gray'} variant="subtle" px="8px" py="2px" borderRadius="12px" fontSize="sm" fontWeight="500">
                                    {concession.academicYear}: {concession.percentage}%
                                  </Badge>
                                  {concession.isActive && (
                                    <Badge colorScheme="green" variant="solid" fontSize="xs">Active</Badge>
                                  )}
                                </HStack>
                                {concession.reason && (
                                  <Text fontSize="xs" color="gray.600" mt={1}>{concession.reason}</Text>
                                )}
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <Text fontSize="md" color="gray.800">No concession records available</Text>
                      </Box>
                    )}
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onViewClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        size="md"
        scrollBehavior='inside'
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader>
            <Heading size="md" color="red.600">Delete Student Record</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletingStudent && (
              <VStack spacing={4} align="stretch">
                <Text fontSize="md" color="gray.700">
                  Are you sure you want to delete the student record for{' '}
                  <Text as="span" fontWeight="bold">
                    {deletingStudent.firstName || ''} {deletingStudent.middleName || ''} {deletingStudent.lastName || ''}
                  </Text>{' '}
                  (ID: {deletingStudent.studentId})?
                </Text>

                <Text fontSize="sm" color="red.600" fontWeight="500">
                  This action is permanent and cannot be undone. This will also delete the corresponding user account.
                </Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose} isDisabled={deleting}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteConfirm}
              isLoading={deleting}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StudentRecords;
