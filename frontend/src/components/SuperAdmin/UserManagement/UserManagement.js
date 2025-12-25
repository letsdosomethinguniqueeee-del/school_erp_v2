import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/axios';
import { USER_ROLES, ROLE_DISPLAY_NAMES } from '../../../constants/roles';
import BaseDashboard from '../../Core/Dashboards/BaseDashboard';
import logger from '../../../utils/logger';
import StudentCreationForm from '../../Student/StudentCreationForm';
import EditStudentForm from './EditStudentForm';
import './UserManagement.css';

// Custom CSS for table container styling
const tableStyles = `
  .chakra-table__container {
    padding: 0px !important;
    margin: 0px !important;
  }
  
  /* Ensure full width for larger screens */
  .dashboard-content {
    max-width: 100% !important;
    width: 100% !important;
  }
  
  /* Override any width constraints */
  .chakra-box {
    max-width: 100% !important;
  }
`;

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
  Checkbox,
  useDisclosure,
  VStack,
  HStack,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputLeftElement,
  Flex,
  Heading,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
  useToast,
  TableContainer,
  InputRightElement
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { SearchIcon, AddIcon, EditIcon, DeleteIcon, LockIcon, UnlockIcon, ViewIcon, ViewOffIcon, RepeatIcon, ChevronLeftIcon, ChevronRightIcon, ArrowBackIcon, CloseIcon } from '@chakra-ui/icons';

// Animation keyframes for refresh icon lines
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Custom Refresh Icon Component with proper animation
const RefreshIcon = ({ isSpinning }) => (
  <Box
    animation={isSpinning ? `${spin} 1s linear infinite` : undefined}
    transformOrigin="center"
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="100%"
    height="100%"
  >
    <RepeatIcon boxSize={4} />
  </Box>
);

const UserManagement = ({ user }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isStudentFormOpen, onOpen: onStudentFormOpen, onClose: onStudentFormClose } = useDisclosure();
  const { isOpen: isEditStudentOpen, onOpen: onEditStudentOpen, onClose: onEditStudentClose } = useDisclosure();
  const { isOpen: isDeleteStudentOpen, onOpen: onDeleteStudentOpen, onClose: onDeleteStudentClose } = useDisclosure();
  const { isOpen: isViewStudentOpen, onOpen: onViewStudentOpen, onClose: onViewStudentClose } = useDisclosure();
  
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Loading states
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  
  // Student search and filter state
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentFilterClass, setStudentFilterClass] = useState('all');
  const [allStudents, setAllStudents] = useState([]);
  
  // Sorting state
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Student pagination state
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Form state for creating/editing users
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    role: '',
    isActive: true
  });

  const roles = [
    { id: USER_ROLES.ADMIN, name: ROLE_DISPLAY_NAMES[USER_ROLES.ADMIN], color: 'blue' },
    { id: USER_ROLES.SUPER_ADMIN, name: ROLE_DISPLAY_NAMES[USER_ROLES.SUPER_ADMIN], color: 'red' },
    { id: USER_ROLES.TEACHER, name: ROLE_DISPLAY_NAMES[USER_ROLES.TEACHER], color: 'teal' },
    { id: USER_ROLES.STUDENT, name: ROLE_DISPLAY_NAMES[USER_ROLES.STUDENT], color: 'green' },
    { id: USER_ROLES.PARENT, name: ROLE_DISPLAY_NAMES[USER_ROLES.PARENT], color: 'purple' },
    { id: USER_ROLES.STAFF, name: ROLE_DISPLAY_NAMES[USER_ROLES.STAFF], color: 'gray' }
  ];

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await api.get('/api/users');
      setUsers(response.data.users || []);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch all students (no pagination, get all records)
  const fetchStudents = async () => {
    try {
      setIsLoadingStudents(true);
      const response = await api.get('/api/students?limit=999999'); // Get all students
      console.log('=== FETCH STUDENTS API RESPONSE ===');
      console.log('API Response:', response.data);
      console.log('Students data:', response.data.data);
      if (response.data.data && response.data.data.length > 0) {
        console.log('First student data:', response.data.data[0]);
        console.log('First student concession:', response.data.data[0].concessionPercentage, response.data.data[0].concessionReason);
      }
      setAllStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students. Please try again.');
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStudents();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users', formData);
      setUsers(prev => [...prev, response.data.user]);
      toast({
        title: 'User created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFormData({ userId: '', password: '', role: '', isActive: true });
      onClose();
      setError('');
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error creating user',
        description: error.response?.data?.message || 'Failed to create user. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      const response = await api.put(`/api/users/${editingUser._id}`, updateData);
      setUsers(prev => prev.map(user => user._id === editingUser._id ? response.data.user : user));
      toast({
        title: 'User updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFormData({ userId: '', password: '', role: '', isActive: true });
      setEditingUser(null);
      onClose();
      setError('');
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error updating user',
        description: error.response?.data?.message || 'Failed to update user. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      userId: user.userId,
      password: user.password || '', // Show actual password for super admin
      role: user.role,
      isActive: user.isActive
    });
    setShowPassword(false); // Reset password visibility
    onOpen();
  };

  // Handle delete user
  const handleDeleteUser = async (userId, userRole) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${userId}`);
        
        // Use smart refresh based on user role
        let operationType = 'user'; // Default for direct user deletion
        
        // Determine operation type based on user role
        if (userRole === 'student') {
          operationType = 'student';
        } else if (userRole === 'teacher') {
          operationType = 'teacher';
        } else if (userRole === 'staff') {
          operationType = 'staff';
        } else if (userRole === 'parent') {
          operationType = 'parent';
        }
        
        await smartRefresh(operationType, currentPage);
        
        toast({
          title: 'User deleted successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setError('');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: 'Error deleting user',
          description: error.response?.data?.message || 'Failed to delete user. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // Handle toggle user active status
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await api.patch(`/api/users/${userId}/toggle-status`, 
        { isActive: !currentStatus }
      );
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));
      toast({
        title: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setError('');
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: 'Error updating user status',
        description: error.response?.data?.message || 'Failed to update user status. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Cancel form
  const cancelForm = () => {
    setFormData({ userId: '', password: '', role: '', isActive: true });
    setEditingUser(null);
    setShowPassword(false); // Reset password visibility
    onClose();
    setError('');
    setSuccess('');
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/super-admin');
  };

  // Handle refresh with animation
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchUsers(), fetchStudents()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      // Keep animation for at least 1 second for better UX
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  // Handle student creation success
  const handleStudentCreationSuccess = (data) => {
    console.log('Student creation success data:', data);
    // Add a small delay to ensure backend has committed the transaction
    setTimeout(async () => {
      // Use smart refresh for student creation - refreshes both Student Records and System Users
      await smartRefresh('student', studentCurrentPage);
    }, 500);
  };

  // Handle student page change
  const handleStudentPageChange = (page) => {
    setStudentCurrentPage(page);
  };

  // Handle edit student
  const handleEditStudent = (student) => {
    console.log('=== HANDLE EDIT STUDENT ===');
    console.log('Student data being passed to edit form:', student);
    console.log('Concession percentage:', student.concessionPercentage);
    console.log('Concession reason:', student.concessionReason);
    setEditingStudent(student);
    onEditStudentOpen();
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Smart refresh function - refreshes appropriate tables based on operation type
  const smartRefresh = async (operationType, currentPage = 1) => {
    console.log(`🔄 Smart refresh triggered for: ${operationType}`);
    
    switch (operationType) {
      case 'student':
        // Student operations affect both Student Records and System Users
        console.log('📚 Refreshing Student Records and System Users...');
        await Promise.all([
          fetchStudents(currentPage),
          fetchUsers()
        ]);
        // Reset filters to ensure they work with updated data
        setStudentFilterClass('all');
        setStudentSearchTerm('');
        break;
        
      case 'teacher':
        // Teacher operations affect both Teacher Records and System Users
        console.log('👨‍🏫 Refreshing Teacher Records and System Users...');
        await Promise.all([
          fetchUsers(), // Teachers are also system users
          // fetchTeachers() - Will be implemented when teacher table is added
        ]);
        break;
        
      case 'staff':
        // Staff operations affect both Staff Records and System Users
        console.log('👨‍💼 Refreshing Staff Records and System Users...');
        await Promise.all([
          fetchUsers(), // Staff are also system users
          // fetchStaff() - Will be implemented when staff table is added
        ]);
        break;
        
      case 'parent':
        // Parent operations affect both Parent Records and System Users
        console.log('👨‍👩‍👧‍👦 Refreshing Parent Records and System Users...');
        await Promise.all([
          fetchUsers(), // Parents are also system users
          // fetchParents() - Will be implemented when parent table is added
        ]);
        break;
        
      case 'user':
        // Direct user operations only affect System Users
        console.log('👤 Refreshing System Users only...');
        await fetchUsers();
        break;
        
      default:
        console.log('🔄 Refreshing all tables...');
        await Promise.all([
          fetchUsers(),
          fetchStudents(studentCurrentPage)
        ]);
    }
  };

  // Handle view student
  const handleViewStudent = (student) => {
    setViewingStudent(student);
    onViewStudentOpen();
  };

  // Handle delete student
  const handleDeleteStudent = (student) => {
    setDeletingStudent(student);
    onDeleteStudentOpen();
  };

  // Confirm delete student
  const confirmDeleteStudent = async () => {
    if (!deletingStudent) return;
    
    setIsDeletingStudent(true);
    
    try {
      await api.delete(`/api/students/${deletingStudent._id}`);
      
      // Close modal immediately after successful API call
      onDeleteStudentClose();
      setDeletingStudent(null);
      
      toast({
        title: 'Student deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh data in background (don't wait for it)
      smartRefresh('student', studentCurrentPage);
      
    } catch (error) {
      toast({
        title: 'Error deleting student',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeletingStudent(false);
    }
  };

  // Handle create button click
  const handleCreateClick = () => {
    if (activeTab === 0) {
      // User Management tab - open user creation modal
      onOpen();
    } else if (activeTab === 1) {
      // Student Records tab - open student creation form
      onStudentFormOpen();
    } else if (activeTab === 2) {
      // Teacher Records tab - show coming soon message
      toast({
        title: 'Coming Soon',
        description: 'Teacher Records management will be available in future updates',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } else if (activeTab === 3) {
      // Staff Records tab - show coming soon message
      toast({
        title: 'Coming Soon',
        description: 'Staff Records management will be available in future updates',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  // Reset student page when student filters change
  useEffect(() => {
    setStudentCurrentPage(1);
  }, [studentSearchTerm, studentFilterClass]);

  // Clear search and filter
  const handleClearStudentFilters = () => {
    setStudentSearchTerm('');
    setStudentFilterClass('all');
    setStudentCurrentPage(1);
  };

  // Get unique classes from student data
  const getUniqueClasses = () => {
    const classes = [...new Set(allStudents.map(student => {
      if (typeof student.currentStudyClass === 'object' && student.currentStudyClass?.class_name) {
        return student.currentStudyClass.class_name;
      }
      return student.currentStudyClass;
    }).filter(Boolean))];
    return classes.sort((a, b) => {
      // Sort classes numerically (1st, 2nd, 3rd, etc.)
      const aNum = parseInt(a.replace(/\D/g, ''));
      const bNum = parseInt(b.replace(/\D/g, ''));
      return aNum - bNum;
    });
  };

  // Client-side filtering and pagination for students
  const filteredStudents = allStudents.filter(student => {
    // Search filter
    const searchTerm = studentSearchTerm.toLowerCase().trim();
    let matchesSearch = true;
    
    if (searchTerm) {
      // Create full name combinations for better search
      const fullName = `${student.firstName || ''} ${student.middleName || ''} ${student.lastName || ''}`.toLowerCase().trim();
      const firstNameLastName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase().trim();
      const lastNameFirstName = `${student.lastName || ''} ${student.firstName || ''}`.toLowerCase().trim();
      
      matchesSearch = 
        student.studentId?.toLowerCase().includes(searchTerm) ||
        student.firstName?.toLowerCase().includes(searchTerm) ||
        student.middleName?.toLowerCase().includes(searchTerm) ||
        student.lastName?.toLowerCase().includes(searchTerm) ||
        student.rollNo?.toLowerCase().includes(searchTerm) ||
        fullName.includes(searchTerm) ||
        firstNameLastName.includes(searchTerm) ||
        lastNameFirstName.includes(searchTerm);
    }
    
    // Class filter
    const studentClass = typeof student.currentStudyClass === 'object' && student.currentStudyClass?.class_name 
      ? student.currentStudyClass.class_name 
      : student.currentStudyClass;
    const matchesClass = studentFilterClass === 'all' || studentClass === studentFilterClass;
    
    return matchesSearch && matchesClass;
  }).sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue, bValue;
    
    switch (sortField) {
      case 'studentId':
        aValue = a.studentId || '';
        bValue = b.studentId || '';
        break;
      case 'rollNo':
        aValue = a.rollNo || '';
        bValue = b.rollNo || '';
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Pagination for filtered students
  const studentTotal = filteredStudents.length;
  const studentTotalPages = Math.ceil(studentTotal / 10);
  const studentStartIndex = (studentCurrentPage - 1) * 10;
  const studentEndIndex = studentStartIndex + 10;
  const students = filteredStudents.slice(studentStartIndex, studentEndIndex);


  // Get role color
  const getRoleColor = (role) => {
    if (!role || role.trim() === '') {
      return 'red';
    }
    const roleObj = roles.find(r => r.id === role);
    return roleObj ? roleObj.color : 'gray';
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    if (!role || role.trim() === '') {
      return 'No Role';
    }
    const roleObj = roles.find(r => r.id === role);
    return roleObj ? roleObj.name : role;
  };

  return (
    <BaseDashboard title="User Management" role="super-admin">
      <style>{tableStyles}</style>
      <Box maxW={{ base: "100%", sm: "100%", md: "100%", lg: "100%", xl: "100%" }} mx="auto" w="100%" px={{ base: 0, md: 0 }}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={{ base: 4, md: 6 }} mt={{ base: 2, md: 4 }} wrap="wrap" gap={{ base: 1, sm: 2 }}>
          <Button
            colorScheme="gray"
            variant="solid"
            onClick={handleBack}
            size="sm"
            fontSize={{ base: "11px", sm: "12px", md: "sm" }}
            px={{ base: 2, sm: 2, md: 3 }}
            py={{ base: 1, sm: 1 }}
            leftIcon={<ArrowBackIcon />}
            bg="#f8f9fa"
            color="gray.700"
            border="1px solid"
            borderColor="#dee2e6"
            _hover={{ bg: "#e9ecef", borderColor: "#dee2e6" }}
          >
            <Text display={{ base: "none", sm: "inline" }}>Back to Dashboard</Text>
            <Text display={{ base: "inline", sm: "none" }}>Back</Text>
          </Button>
          <HStack spacing={{ base: 1, sm: 2 }}>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="green"
              onClick={handleCreateClick}
              size="sm"
            fontSize={{ base: "11px", sm: "12px", md: "sm" }}
            px={{ base: 2, sm: 2, md: 3 }}
            py={{ base: 1, sm: 1 }}
            >
              <Text display={{ base: "none", sm: "inline" }}>
                {activeTab === 0 ? 'Create New User' : 
                 activeTab === 1 ? 'Add New Student' :
                 activeTab === 2 ? 'Add New Teacher' :
                 activeTab === 3 ? 'Add New Staff' : 'Create New'}
              </Text>
              <Text display={{ base: "inline", sm: "none" }}>
                {activeTab === 0 ? 'New User' : 
                 activeTab === 1 ? 'New Student' :
                 activeTab === 2 ? 'New Teacher' :
                 activeTab === 3 ? 'New Staff' : 'New'}
              </Text>
            </Button>
            <IconButton
              aria-label="Refresh data"
              icon={<RefreshIcon isSpinning={isRefreshing} />}
              colorScheme="blue"
              variant="outline"
              onClick={handleRefresh}
              isDisabled={isRefreshing}
              size="sm"
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={{ base: 1, sm: 1 }}
            py={{ base: 1, sm: 1 }}
              _hover={{
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out'
              }}
              _active={{
                transform: 'scale(0.95)'
              }}
            />
          </HStack>
        </Flex>

        {/* Tabs Navigation */}
        <Box mb={{ base: 4, md: 6 }}>
          <div className="user-management-tabs">
          <div className="tabs-nav">
            <button
              className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
              onClick={() => setActiveTab(0)}
            >
              <span className="tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
              <span className="tab-label">
                System Users {isLoadingUsers ? '(Loading...)' : `(${users.length})`}
              </span>
            </button>
            <button
              className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              <span className="tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </span>
              <span className="tab-label">
                Student Records {isLoadingStudents ? '(Loading...)' : `(${studentTotal})`}
              </span>
            </button>
            <button
              className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
              onClick={() => setActiveTab(2)}
            >
              <span className="tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <span className="tab-label">
                Teacher Records (0)
              </span>
            </button>
            <button
              className={`tab-button ${activeTab === 3 ? 'active' : ''}`}
              onClick={() => setActiveTab(3)}
            >
              <span className="tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </span>
              <span className="tab-label">
                Staff Records (0)
              </span>
            </button>
          </div>
        </div>
        </Box>

        {/* Tab Content */}
        <Box mt={{ base: 4, md: 6 }} w="100%">
          {activeTab === 0 && (
            <Box w="100%">
              {/* Container for Search/Filter and Table */}
              <Box
                bg="white"
                borderRadius="12px"
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
                border="1px solid"
                borderColor="gray.200"
                overflow="hidden"
                w="100%"
                maxW="100%"
              >
      {/* Search and Filter */}
                <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.200">
                  <Flex gap={4} align="center">
                  <Input
                      maxW="300px"
                    placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
                <Select
                  maxW="200px"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
                </Select>
              </Flex>
                </Box>

              {/* Users Table */}
              <TableContainer 
                overflowX="auto" 
                w="100%" 
                maxW="100%"
              >
                <Table variant="simple" size="sm" w="100%" minW="600px">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th minW="120px">User ID</Th>
                      <Th minW="100px">Role</Th>
                      <Th minW="80px">Status</Th>
                      <Th minW="120px">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentUsers.length === 0 ? (
                      <Tr>
                        <Td colSpan={4} textAlign="center" py={8}>
                          <Text color="gray.500">No users found.</Text>
                        </Td>
                      </Tr>
                    ) : (
                      currentUsers.map(user => (
                        <Tr key={user._id}>
                          <Td fontWeight="medium">{user.userId}</Td>
                          <Td>
                            <Badge 
                              colorScheme={getRoleColor(user.role)} 
                              variant="solid"
                              borderRadius="full"
                              px={3}
                              py={1}
                              fontSize="xs"
                              fontWeight="semibold"
                              textTransform="uppercase"
                              letterSpacing="wide"
                            >
                              {getRoleDisplayName(user.role)}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={user.isActive ? 'green' : 'red'} 
                              variant="solid"
                              borderRadius="full"
                              px={3}
                              py={1}
                              fontSize="xs"
                              fontWeight="semibold"
                              textTransform="uppercase"
                              letterSpacing="wide"
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                aria-label="Edit user"
                                icon={<EditIcon />}
                                size="sm"
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => handleEditUser(user)}
                              />
                              <IconButton
                                aria-label={user.isActive ? 'Deactivate' : 'Activate'}
                                icon={user.isActive ? <LockIcon /> : <UnlockIcon />}
                                size="sm"
                                colorScheme={user.isActive ? 'orange' : 'green'}
                                variant="ghost"
                                onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                              />
                              <IconButton
                                aria-label="Delete user"
                                icon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDeleteUser(user._id, user.role)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              </Box>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Flex justify="flex-end" align="center" mt={4}>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      color={currentPage === 1 ? "gray.400" : "gray.600"}
                      bg="white"
                      borderColor="gray.200"
                      _hover={currentPage === 1 ? {} : { bg: "gray.50" }}
                      _disabled={{ 
                        color: "gray.400", 
                        cursor: "not-allowed",
                        bg: "white",
                        borderColor: "gray.200"
                      }}
                    >
                      First
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      color={currentPage === 1 ? "gray.400" : "gray.600"}
                      bg="white"
                      borderColor="gray.200"
                      _hover={currentPage === 1 ? {} : { bg: "gray.50" }}
                      _disabled={{ 
                        color: "gray.400", 
                        cursor: "not-allowed",
                        bg: "white",
                        borderColor: "gray.200"
                      }}
                    >
                      Previous
                    </Button>
                    <Text fontSize="sm" color="gray.600" px={2} fontWeight="medium">
                      Page {currentPage} of {totalPages}
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      color={currentPage === totalPages ? "gray.400" : "gray.600"}
                      bg="white"
                      borderColor="gray.200"
                      _hover={currentPage === totalPages ? {} : { bg: "gray.50" }}
                      _disabled={{ 
                        color: "gray.400", 
                        cursor: "not-allowed",
                        bg: "white",
                        borderColor: "gray.200"
                      }}
                    >
                      Next
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      color={currentPage === totalPages ? "gray.400" : "gray.600"}
                      bg="white"
                      borderColor="gray.200"
                      _hover={currentPage === totalPages ? {} : { bg: "gray.50" }}
                      _disabled={{ 
                        color: "gray.400", 
                        cursor: "not-allowed",
                        bg: "white",
                        borderColor: "gray.200"
                      }}
                    >
                      Last
                    </Button>
                  </HStack>
                </Flex>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box w="100%">
              {/* Container for Search/Filter and Table */}
              <Box
                bg="white"
                borderRadius="12px"
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
                border="1px solid"
                borderColor="gray.200"
                overflow="hidden"
                w="100%"
                maxW="100%"
              >
                {/* Search and Filter */}
                <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.200">
                  <VStack spacing={3} align="stretch">
                    <Flex gap={2} align="center" wrap="nowrap">
                    <Input
                      flex="1"
                      placeholder="Search students..."
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      size="sm"
                      h="32px"
                      minH="32px"
                      maxH="32px"
                      fontSize="12px"
                      display="flex"
                      alignItems="center"
                      borderRadius="6px"
                    />
                    <Select
                      w={{ base: "90px", sm: "120px" }}
                      value={studentFilterClass}
                      onChange={(e) => setStudentFilterClass(e.target.value)}
                      size="sm"
                      h="32px"
                      minH="32px"
                      maxH="32px"
                      fontSize="12px"
                      display="flex"
                      alignItems="center"
                      borderRadius="6px"
                      bg={studentFilterClass !== 'all' ? 'blue.50' : 'white'}
                      borderColor={studentFilterClass !== 'all' ? 'blue.300' : 'gray.300'}
                    >
                      <option value="all">All Classes</option>
                      {getUniqueClasses().map(className => (
                        <option key={className} value={className}>{className}</option>
                      ))}
                    </Select>
                    <Button
                      variant="outline"
                      onClick={handleClearStudentFilters}
                      colorScheme="gray"
                      fontSize="10px"
                      px={6}
                      py={0}
                      h="32px"
                      minH="32px"
                      maxH="32px"
                      lineHeight="1"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="6px"
                      minWidth="40px"
                    >
                      Clear
                    </Button>
                    </Flex>
                  </VStack>
                </Box>

                {/* Table Container */}
              <TableContainer 
                overflowX="auto" 
                w="100%" 
                maxW="100%"
              >
                <Table variant="simple" size="sm" w="100%" minW="1000px">
                  <Thead bg="gray.100">
                    <Tr>
                      <Th 
                        fontWeight="semibold" 
                        color="gray.600" 
                        fontSize={{ base: "11px", sm: "12px", md: "sm" }} 
                        minW="120px" 
                        borderBottom="2px solid" 
                        borderColor="gray.200"
                        cursor="pointer"
                        onClick={() => handleSort('studentId')}
                        _hover={{ bg: "gray.200" }}
                        userSelect="none"
                      >
                        <HStack spacing={1}>
                          <Text>Student ID</Text>
                          <HStack spacing={0}>
                            <Text fontSize="sm" color={sortField === 'studentId' && sortDirection === 'asc' ? 'blue.500' : 'gray.400'} fontWeight="bold" lineHeight="1">▲</Text>
                            <Text fontSize="sm" color={sortField === 'studentId' && sortDirection === 'desc' ? 'blue.500' : 'gray.400'} fontWeight="bold" lineHeight="1">▼</Text>
                          </HStack>
                        </HStack>
                      </Th>
                      <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="150px" borderBottom="2px solid" borderColor="gray.200">Name</Th>
                      <Th 
                        fontWeight="semibold" 
                        color="gray.600" 
                        fontSize={{ base: "11px", sm: "12px", md: "sm" }} 
                        minW="80px" 
                        borderBottom="2px solid" 
                        borderColor="gray.200"
                        cursor="pointer"
                        onClick={() => handleSort('rollNo')}
                        _hover={{ bg: "gray.200" }}
                        userSelect="none"
                      >
                        <HStack spacing={1}>
                          <Text>Roll No</Text>
                          <HStack spacing={0}>
                            <Text fontSize="sm" color={sortField === 'rollNo' && sortDirection === 'asc' ? 'blue.500' : 'gray.400'} fontWeight="bold" lineHeight="1">▲</Text>
                            <Text fontSize="sm" color={sortField === 'rollNo' && sortDirection === 'desc' ? 'blue.500' : 'gray.400'} fontWeight="bold" lineHeight="1">▼</Text>
                          </HStack>
                        </HStack>
                      </Th>
                      <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="80px" borderBottom="2px solid" borderColor="gray.200">Class</Th>
                      <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="80px" borderBottom="2px solid" borderColor="gray.200">Section</Th>
                      <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="100px" borderBottom="2px solid" borderColor="gray.200">Gender</Th>
                      <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="120px" borderBottom="2px solid" borderColor="gray.200">Admission Year</Th>
                      <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="80px" borderBottom="2px solid" borderColor="gray.200">Status</Th>
                      <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="120px" borderBottom="2px solid" borderColor="gray.200">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {students.length === 0 ? (
                      <Tr>
                        <Td colSpan={9} textAlign="center" py={8}>
                          <VStack spacing={2}>
                            <Text color="gray.500">
                              {studentFilterClass !== 'all' 
                                ? `No students found in ${studentFilterClass} class.` 
                                : 'No student records found.'
                              }
                            </Text>
                            {studentFilterClass !== 'all' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setStudentFilterClass('all')}
                                colorScheme="blue"
                              >
                                Show All Classes
                              </Button>
                            )}
                          </VStack>
                        </Td>
                      </Tr>
                    ) : (
                      students.map(student => (
                        <Tr key={student._id}>
                          <Td fontWeight="medium">{student.studentId}</Td>
                          <Td>{`${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`}</Td>
                          <Td>{student.rollNo || 'N/A'}</Td>
                          <Td>{student.currentStudyClass?.class_name || student.currentStudyClass || 'N/A'}</Td>
                          <Td>{student.currentSection?.section_name || student.currentSection || 'N/A'}</Td>
                          <Td>
                            <Badge 
                              colorScheme={student.gender === 'Male' ? 'blue' : student.gender === 'Female' ? 'pink' : 'gray'} 
                              variant="solid"
                              borderRadius="full"
                              px={3}
                              py={1}
                              fontSize="xs"
                              fontWeight="semibold"
                              textTransform="uppercase"
                              letterSpacing="wide"
                            >
                              {student.gender || 'N/A'}
                            </Badge>
                          </Td>
                          <Td>{student.admissionYear?.year_code || student.admissionYear || 'N/A'}</Td>
                          <Td>
                            <Badge 
                              colorScheme="green" 
                              variant="solid"
                              borderRadius="full"
                              px={3}
                              py={1}
                              fontSize="xs"
                              fontWeight="semibold"
                              textTransform="uppercase"
                              letterSpacing="wide"
                            >
                              Active
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                aria-label="View student"
                                icon={<ViewIcon />}
                                size="sm"
                                colorScheme="green"
                                variant="outline"
                                onClick={() => handleViewStudent(student)}
                              />
                              <IconButton
                                aria-label="Edit student"
                                icon={<EditIcon />}
                                size="sm"
                                colorScheme="blue"
                                variant="outline"
                                onClick={() => handleEditStudent(student)}
                              />
                              <IconButton
                                aria-label="Delete student"
                                icon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                onClick={() => handleDeleteStudent(student)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              </Box>
              
              {/* Student Pagination Controls */}
              {studentTotalPages > 1 && (
                <Flex justify="flex-end" align="center" mt={4} gap={1}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStudentPageChange(1)}
                    isDisabled={studentCurrentPage === 1}
                    fontSize={{ base: "xs", sm: "sm" }}
                  >
                    First
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStudentPageChange(studentCurrentPage - 1)}
                    isDisabled={studentCurrentPage === 1}
                    fontSize={{ base: "xs", sm: "sm" }}
                  >
                    Previous
                  </Button>
                  <Text fontSize={{ base: "10px", sm: "xs" }} color="gray.600" px={1} whiteSpace="nowrap">
                    Page {studentCurrentPage} of {studentTotalPages}
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStudentPageChange(studentCurrentPage + 1)}
                    isDisabled={studentCurrentPage === studentTotalPages}
                    fontSize={{ base: "xs", sm: "sm" }}
                  >
                    Next
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStudentPageChange(studentTotalPages)}
                    isDisabled={studentCurrentPage === studentTotalPages}
                    fontSize={{ base: "xs", sm: "sm" }}
                  >
                    Last
                  </Button>
                </Flex>
              )}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              {/* Container for Teacher Records */}
              <Box
                bg="white"
                borderRadius="12px"
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
                border="1px solid"
                borderColor="gray.200"
                overflow="hidden"
              >
                <Box p={{ base: 4, md: 6 }} textAlign="center">
                  <Text color="gray.500" fontSize="lg">
                    Teacher Records - Coming Soon
                  </Text>
                  <Text color="gray.400" fontSize="sm" mt={2}>
                    This feature will be available in future updates
                  </Text>
                </Box>
              </Box>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              {/* Container for Staff Records */}
              <Box
                bg="white"
                borderRadius="12px"
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
                border="1px solid"
                borderColor="gray.200"
                overflow="hidden"
              >
                <Box p={{ base: 4, md: 6 }} textAlign="center">
                  <Text color="gray.500" fontSize="lg">
                    Staff Records - Coming Soon
                  </Text>
                  <Text color="gray.400" fontSize="sm" mt={2}>
                    This feature will be available in future updates
                  </Text>
                </Box>
              </Box>
            </Box>
          )}
        </Box>


        {/* Create/Edit User Modal */}
        <Modal isOpen={isOpen} onClose={cancelForm} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingUser ? 'Edit User' : 'Create New User'}
            </ModalHeader>
            <ModalCloseButton />
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>User ID</FormLabel>
                    <Input
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                      placeholder="Enter user ID"
                    />
                  </FormControl>
                  
                  <FormControl isRequired={!editingUser}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                        placeholder={editingUser ? "Enter new password (leave blank to keep current)" : "Enter password"}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Role</FormLabel>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="Select Role"
                    >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <Checkbox
                    name="isActive"
                      isChecked={formData.isActive}
                    onChange={handleInputChange}
                    >
                  Active User
                    </Checkbox>
                  </FormControl>
                </VStack>
              </ModalBody>
              
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={cancelForm}>
                  Cancel
                </Button>
                <Button colorScheme="blue" type="submit">
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Student Creation Form */}
        <StudentCreationForm
          isOpen={isStudentFormOpen}
          onClose={onStudentFormClose}
          onSuccess={handleStudentCreationSuccess}
        />

        {/* Edit Student Modal */}
        <Modal 
          isOpen={isEditStudentOpen} 
          onClose={onEditStudentClose} 
          size="4xl"
          isCentered
        >
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
            <ModalHeader fontSize="md" py={3} px={{ base: 4, sm: 5, md: 6 }}>Edit Student Information</ModalHeader>
            <ModalCloseButton />
            {editingStudent && (
              <EditStudentForm
                student={editingStudent}
                onClose={onEditStudentClose}
                onSuccess={() => {
                  // Close modal immediately
                  onEditStudentClose();
                  setEditingStudent(null);
                  
                  toast({
                    title: 'Student updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                  
                  // Refresh data in background (don't wait for it)
                  smartRefresh('student', studentCurrentPage);
                }}
              />
            )}
          </ModalContent>
        </Modal>

        {/* Delete Student Confirmation Modal */}
        <Modal isOpen={isDeleteStudentOpen} onClose={onDeleteStudentClose} size="sm" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="red.600" fontSize="md" py={3}>Delete Student</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={4}>
              <VStack spacing={3} align="stretch">
                {deletingStudent && (
                  <Text color="gray.600" fontSize="sm" lineHeight="1.5">
                    Are you sure you want to delete student <Text as="span" fontWeight="semibold" color="gray.800">
                      {`${deletingStudent.firstName} ${deletingStudent.middleName ? deletingStudent.middleName + ' ' : ''}${deletingStudent.lastName}`}
                    </Text>?
                  </Text>
                )}
                
                <Text fontSize="sm" color="red.600" fontWeight="medium">
                  This action is permanent and cannot be undone.
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter py={3}>
              <Button 
                variant="ghost" 
                mr={3} 
                size="sm" 
                onClick={onDeleteStudentClose}
                isDisabled={isDeletingStudent}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                size="sm" 
                onClick={confirmDeleteStudent}
                isLoading={isDeletingStudent}
                loadingText="Deleting..."
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* View Student Modal */}
        <Modal isOpen={isViewStudentOpen} onClose={onViewStudentClose} size="4xl" isCentered>
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
            display="flex"
            flexDirection="column"
          >
            <ModalHeader fontSize="lg" py={3} px={{ base: 4, sm: 5, md: 6 }}>
              Student Information
            </ModalHeader>
            <ModalCloseButton />
            {viewingStudent && (
              <ModalBody 
                pb={0} 
                px={{ base: 4, sm: 5, md: 6 }}
                flex="1"
                overflowY="auto"
              >
                <VStack spacing={{ base: 4, sm: 2, md: 6 }} align="stretch">
                    {/* Basic Information */}
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" color="blue.600" mb={{ base: 3, sm: 1, md: 3 }}>
                          📋 Basic Information
                        </Text>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 3, sm: 1, md: 4 }}>
                        <Box>
                          <VStack spacing={{ base: 1, sm: 0, md: 1 }} align="start">
                            <Text fontSize="sm" fontWeight="medium" color="gray.600">Student ID</Text>
                            <Text fontSize="sm">{viewingStudent.studentId || 'N/A'}</Text>
                          </VStack>
                        </Box>
                        <Box>
                          <VStack spacing={{ base: 1, sm: 0, md: 1 }} align="start">
                            <Text fontSize="sm" fontWeight="medium" color="gray.600">Roll Number</Text>
                            <Text fontSize="sm">{viewingStudent.rollNo || 'N/A'}</Text>
                          </VStack>
                        </Box>
                        <Box>
                          <VStack spacing={{ base: 1, sm: 0, md: 1 }} align="start">
                            <Text fontSize="sm" fontWeight="medium" color="gray.600">Full Name</Text>
                            <Text fontSize="sm">
                              {`${viewingStudent.firstName || ''} ${viewingStudent.middleName || ''} ${viewingStudent.lastName || ''}`.trim() || 'N/A'}
                            </Text>
                          </VStack>
                        </Box>
                        <Box>
                          <VStack spacing={{ base: 1, sm: 0, md: 1 }} align="start">
                            <Text fontSize="sm" fontWeight="medium" color="gray.600">Gender</Text>
                            <Text fontSize="sm">{viewingStudent.gender || 'N/A'}</Text>
                          </VStack>
                        </Box>
                        <Box>
                          <VStack spacing={{ base: 1, sm: 0, md: 1 }} align="start">
                            <Text fontSize="sm" fontWeight="medium" color="gray.600">Date of Birth</Text>
                            <Text fontSize="sm">
                              {viewingStudent.dateOfBirth ? new Date(viewingStudent.dateOfBirth).toLocaleDateString() : 'N/A'}
                            </Text>
                          </VStack>
                        </Box>
                        <Box>
                          <VStack spacing={{ base: 1, sm: 0, md: 1 }} align="start">
                            <Text fontSize="sm" fontWeight="medium" color="gray.600">Blood Group</Text>
                            <Text fontSize="sm">{viewingStudent.bloodGroup || 'N/A'}</Text>
                          </VStack>
                        </Box>
                      </Grid>
                    </Box>

                    {/* Father's Information */}
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" color="blue.600" mb={{ base: 3, sm: 1, md: 3 }}>
                          👨 Father's Information
                        </Text>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 3, sm: 1, md: 4 }}>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Father's Name</Text>
                          <Text fontSize="sm">
                            {`${viewingStudent.fatherFirstName || ''} ${viewingStudent.fatherMiddleName || ''} ${viewingStudent.fatherLastName || ''}`.trim() || 'N/A'}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Father's Mobile</Text>
                          <Text fontSize="sm">{viewingStudent.fatherMobile || 'N/A'}</Text>
                        </Box>
                      </Grid>
                    </Box>

                    {/* Mother's Information */}
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" color="blue.600" mb={{ base: 3, sm: 1, md: 3 }}>
                          👩 Mother's Information
                        </Text>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 3, sm: 1, md: 4 }}>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Mother's Name</Text>
                          <Text fontSize="sm">
                            {`${viewingStudent.motherFirstName || ''} ${viewingStudent.motherMiddleName || ''} ${viewingStudent.motherLastName || ''}`.trim() || 'N/A'}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Mother's Mobile</Text>
                          <Text fontSize="sm">{viewingStudent.motherMobile || 'N/A'}</Text>
                        </Box>
                      </Grid>
                    </Box>

                    {/* Academic Information */}
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" color="blue.600" mb={{ base: 3, sm: 1, md: 3 }}>
                          🎓 Academic Information
                        </Text>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 3, sm: 1, md: 4 }}>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Current Class</Text>
                          <Text fontSize="sm">{viewingStudent.currentStudyClass?.class_name || viewingStudent.currentStudyClass || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Section</Text>
                          <Text fontSize="sm">{viewingStudent.currentSection?.section_name || viewingStudent.currentSection || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Admission Year</Text>
                          <Text fontSize="sm">{viewingStudent.admissionYear?.year_code || viewingStudent.admissionYear || 'N/A'}</Text>
                        </Box>
                      </Grid>
                    </Box>

                    {/* Contact Information */}
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" color="blue.600" mb={{ base: 3, sm: 1, md: 3 }}>
                          📞 Contact Information
                        </Text>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 3, sm: 1, md: 4 }}>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Student Contact</Text>
                          <Text fontSize="sm">{viewingStudent.contactNo || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Additional Contact</Text>
                          <Text fontSize="sm">{viewingStudent.additionalContactNo || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Email</Text>
                          <Text fontSize="sm">{viewingStudent.email || 'N/A'}</Text>
                        </Box>
                      </Grid>
                    </Box>

                    {/* Personal Details */}
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" color="blue.600" mb={{ base: 3, sm: 1, md: 3 }}>
                          🏛️ Personal Details
                        </Text>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 3, sm: 1, md: 4 }}>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Category</Text>
                          <Text fontSize="sm">{viewingStudent.category || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Community</Text>
                          <Text fontSize="sm">{viewingStudent.community || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Nationality</Text>
                          <Text fontSize="sm">{viewingStudent.nationality || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Aadhar Card</Text>
                          <Text fontSize="sm">{viewingStudent.aadharCardNo || 'N/A'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Government ID</Text>
                          <Text fontSize="sm">{viewingStudent.govtProvidedId || 'N/A'}</Text>
                        </Box>
                      </Grid>
                    </Box>

                    {/* Concession Details */}
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" color="blue.600" mb={{ base: 3, sm: 1, md: 3 }}>
                          💰 Concession Details
                        </Text>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 3, sm: 1, md: 4 }}>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Concession Percentage</Text>
                          <Text fontSize="sm">
                            {viewingStudent.concessionPercentage ? `${viewingStudent.concessionPercentage}%` : 'N/A'}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Concession Reason</Text>
                          <Text fontSize="sm">{viewingStudent.concessionReason || 'N/A'}</Text>
                        </Box>
                      </Grid>
                    </Box>
                  </VStack>
              </ModalBody>
            )}
            <ModalFooter py={3} px={{ base: 4, sm: 5, md: 6 }}>
              <Button 
                colorScheme="blue" 
                onClick={onViewStudentClose}
                size="md"
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </BaseDashboard>
  );
};

export default UserManagement;