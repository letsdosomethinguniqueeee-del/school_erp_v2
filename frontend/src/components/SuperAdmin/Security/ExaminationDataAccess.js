import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useToast,
  IconButton,
  Badge,
  VStack,
  HStack,
  Text,
  Checkbox,
  Stack,
  Divider,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, ViewIcon, SearchIcon } from '@chakra-ui/icons';
import axios from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';

const ExaminationDataAccess = ({ modalType }) => {
  const [accessRecords, setAccessRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const toast = useToast();

  // Dropdown data
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [users, setUsers] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    academic_year_id: '',
    class_ids: [],
    section_ids: [],
    medium_ids: [],
    subject_ids: [],
    user_ids: [],
    permissions: {
      view: false,
      edit: false
    }
  });

  // Search states for multi-select filters
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Fetch dropdown data
  useEffect(() => {
    fetchAcademicYears();
    fetchClasses();
    fetchSections();
    fetchMediums();
    fetchSubjects();
    fetchUsers();
    fetchAccessRecords();
  }, []);

  // Open modal when modalType changes
  useEffect(() => {
    if (modalType === 'examination-access') {
      handleAddNew();
    }
  }, [modalType]);

  const fetchAcademicYears = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ACADEMIC_YEARS);
      setAcademicYears(response.data.data || []);
    } catch (error) {
      console.error('Error fetching academic years:', error);
      toast({
        title: 'Error loading academic years',
        description: error.response?.data?.message || 'Failed to load academic years',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CLASSES);
      setClasses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.SECTIONS);
      setSections(response.data.data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchMediums = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.MEDIUMS);
      setMediums(response.data.data || []);
    } catch (error) {
      console.error('Error fetching mediums:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.SUBJECTS);
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS);
      console.log('Users response:', response.data); // Debug log
      // Handle both response formats: {data: []} and {users: []}
      const usersList = response.data.data || response.data.users || [];
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error loading users',
        description: error.response?.data?.message || 'Failed to load users',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const fetchAccessRecords = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.EXAMINATION_DATA_ACCESS);
      console.log('Access records response:', response.data); // Debug log
      setAccessRecords(response.data.data || []);
    } catch (error) {
      console.error('Error fetching access records:', error);
      toast({
        title: 'Error fetching access records',
        description: error.response?.data?.message || 'Failed to load data',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setFormData({
      academic_year_id: '',
      class_ids: [],
      section_ids: [],
      medium_ids: [],
      subject_ids: [],
      user_ids: [],
      permissions: {
        view: false,
        edit: false
      }
    });
    setUserSearchTerm(''); // Reset search
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    
    // Extract IDs from populated objects if necessary
    const extractIds = (arr) => {
      if (!arr || arr.length === 0) return [];
      return arr.map(item => typeof item === 'object' ? item._id : item);
    };
    
    const academicYearId = typeof record.academic_year_id === 'object' 
      ? record.academic_year_id._id 
      : record.academic_year_id;
    
    setFormData({
      academic_year_id: academicYearId || '',
      class_ids: extractIds(record.class_ids) || [],
      section_ids: extractIds(record.section_ids) || [],
      medium_ids: extractIds(record.medium_ids) || [],
      subject_ids: extractIds(record.subject_ids) || [],
      user_ids: extractIds(record.user_ids) || [],
      permissions: record.permissions || { view: false, edit: false }
    });
    setUserSearchTerm(''); // Reset search
    setIsModalOpen(true);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this access record?')) {
      try {
        await axios.delete(API_ENDPOINTS.EXAMINATION_DATA_ACCESS_BY_ID(id));
        toast({
          title: 'Access record deleted successfully',
          status: 'success',
          duration: 3000,
        });
        fetchAccessRecords();
      } catch (error) {
        toast({
          title: 'Error deleting access record',
          description: error.response?.data?.message || 'Something went wrong',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || [];
      const isSelected = currentValues.includes(value);
      
      return {
        ...prev,
        [field]: isSelected
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
      };
    });
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  // Filter users based on search term
  const getFilteredUsers = () => {
    if (!userSearchTerm.trim()) {
      return users;
    }
    
    const searchLower = userSearchTerm.toLowerCase();
    return users.filter(user => {
      const userName = (user.name || '').toLowerCase();
      const userId = (user.userId || '').toLowerCase();
      const userRole = (user.role || '').toLowerCase();
      
      return userName.includes(searchLower) || 
             userId.includes(searchLower) || 
             userRole.includes(searchLower);
    });
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.academic_year_id) {
        toast({
          title: 'Please select an academic year',
          status: 'warning',
          duration: 3000,
        });
        return;
      }

      if (formData.user_ids.length === 0) {
        toast({
          title: 'Please select at least one user',
          status: 'warning',
          duration: 3000,
        });
        return;
      }

      if (!formData.permissions.view && !formData.permissions.edit) {
        toast({
          title: 'Please select at least one permission',
          status: 'warning',
          duration: 3000,
        });
        return;
      }

      if (isEditMode) {
        await axios.put(API_ENDPOINTS.EXAMINATION_DATA_ACCESS_BY_ID(selectedRecord._id), formData);
        toast({
          title: 'Access record updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        await axios.post(API_ENDPOINTS.EXAMINATION_DATA_ACCESS, formData);
        toast({
          title: 'Access record created successfully',
          status: 'success',
          duration: 3000,
        });
      }

      setIsModalOpen(false);
      fetchAccessRecords();
    } catch (error) {
      toast({
        title: isEditMode ? 'Error updating access record' : 'Error creating access record',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getNameById = (id, list, nameField = 'name') => {
    // Handle if id is already an object (populated)
    if (typeof id === 'object' && id !== null) {
      return id[nameField] || id.name || 'N/A';
    }
    // Handle if id is a string (need to find in list)
    const item = list.find(item => item._id === id);
    return item ? item[nameField] : 'N/A';
  };

  const getAcademicYearName = (academicYearData) => {
    if (!academicYearData) return 'N/A';
    if (typeof academicYearData === 'object') {
      return academicYearData.year_code || 'N/A';
    }
    return getNameById(academicYearData, academicYears, 'year_code');
  };

  return (
    <Box>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Academic Year</Th>
            <Th>Classes</Th>
            <Th>Sections</Th>
            <Th>Mediums</Th>
            <Th>Subjects</Th>
            <Th>Users</Th>
            <Th>Permissions</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {accessRecords.length === 0 ? (
            <Tr>
              <Td colSpan={8} textAlign="center" color="gray.500">
                No access records found. Click "Add New" to create one.
              </Td>
            </Tr>
          ) : (
            accessRecords.map((record) => (
              <Tr key={record._id}>
                <Td>{getAcademicYearName(record.academic_year_id)}</Td>
                <Td>
                  {record.class_ids?.length > 0 
                    ? `${record.class_ids.length} selected` 
                    : 'All'}
                </Td>
                <Td>
                  {record.section_ids?.length > 0 
                    ? `${record.section_ids.length} selected` 
                    : 'All'}
                </Td>
                <Td>
                  {record.medium_ids?.length > 0 
                    ? `${record.medium_ids.length} selected` 
                    : 'All'}
                </Td>
                <Td>
                  {record.subject_ids?.length > 0 
                    ? `${record.subject_ids.length} selected` 
                    : 'All'}
                </Td>
                <Td>{record.user_ids?.length || 0} users</Td>
                <Td>
                  <HStack spacing={1}>
                    {record.permissions?.view && <Badge colorScheme="green">View</Badge>}
                    {record.permissions?.edit && <Badge colorScheme="blue">Edit</Badge>}
                  </HStack>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<ViewIcon />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => handleView(record)}
                    />
                    <IconButton
                      icon={<EditIcon />}
                      size="sm"
                      colorScheme="yellow"
                      variant="ghost"
                      onClick={() => handleEdit(record)}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(record._id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent maxW="800px">
          <ModalHeader>
            {isEditMode ? 'Edit Examination Data Access' : 'Add New Examination Data Access'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {/* Academic Year Selection */}
              <FormControl isRequired>
                <FormLabel>Academic Year</FormLabel>
                <Select
                  placeholder="Select academic year"
                  value={formData.academic_year_id}
                  onChange={(e) => setFormData({ ...formData, academic_year_id: e.target.value })}
                >
                  {academicYears.map((year) => (
                    <option key={year._id} value={year._id}>
                      {year.year_code}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Class Multi-selection */}
              <FormControl>
                <FormLabel>Classes (Leave empty for all classes)</FormLabel>
                <Box 
                  border="1px solid" 
                  borderColor="gray.200" 
                  borderRadius="md" 
                  p={3} 
                  maxH="150px" 
                  overflowY="auto"
                >
                  <Stack spacing={2}>
                    {classes.map((cls) => (
                      <Checkbox
                        key={cls._id}
                        isChecked={formData.class_ids.includes(cls._id)}
                        onChange={() => handleCheckboxChange('class_ids', cls._id)}
                      >
                        {cls.class_name}
                      </Checkbox>
                    ))}
                  </Stack>
                </Box>
              </FormControl>

              {/* Section Multi-selection */}
              <FormControl>
                <FormLabel>Sections (Leave empty for all sections)</FormLabel>
                <Box 
                  border="1px solid" 
                  borderColor="gray.200" 
                  borderRadius="md" 
                  p={3} 
                  maxH="150px" 
                  overflowY="auto"
                >
                  <Stack spacing={2}>
                    {sections.map((section) => (
                      <Checkbox
                        key={section._id}
                        isChecked={formData.section_ids.includes(section._id)}
                        onChange={() => handleCheckboxChange('section_ids', section._id)}
                      >
                        {section.section_name}
                      </Checkbox>
                    ))}
                  </Stack>
                </Box>
              </FormControl>

              {/* Medium Multi-selection */}
              <FormControl>
                <FormLabel>Mediums (Leave empty for all mediums)</FormLabel>
                <Box 
                  border="1px solid" 
                  borderColor="gray.200" 
                  borderRadius="md" 
                  p={3} 
                  maxH="150px" 
                  overflowY="auto"
                >
                  <Stack spacing={2}>
                    {mediums.map((medium) => (
                      <Checkbox
                        key={medium._id}
                        isChecked={formData.medium_ids.includes(medium._id)}
                        onChange={() => handleCheckboxChange('medium_ids', medium._id)}
                      >
                        {medium.medium_name}
                      </Checkbox>
                    ))}
                  </Stack>
                </Box>
              </FormControl>

              {/* Subject Multi-selection */}
              <FormControl>
                <FormLabel>Subjects (Leave empty for all subjects)</FormLabel>
                <Box 
                  border="1px solid" 
                  borderColor="gray.200" 
                  borderRadius="md" 
                  p={3} 
                  maxH="150px" 
                  overflowY="auto"
                >
                  <Stack spacing={2}>
                    {subjects.map((subject) => (
                      <Checkbox
                        key={subject._id}
                        isChecked={formData.subject_ids.includes(subject._id)}
                        onChange={() => handleCheckboxChange('subject_ids', subject._id)}
                      >
                        {subject.subject_name}
                      </Checkbox>
                    ))}
                  </Stack>
                </Box>
              </FormControl>

              <Divider />

              {/* User Multi-selection */}
              <FormControl isRequired>
                <FormLabel>Users (Select teachers, admins, etc.)</FormLabel>
                
                {/* Search Input */}
                <InputGroup mb={2}>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by name, ID, or role..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                  />
                </InputGroup>

                <Box 
                  border="1px solid" 
                  borderColor="gray.200" 
                  borderRadius="md" 
                  p={3} 
                  maxH="200px" 
                  overflowY="auto"
                  bg="white"
                >
                  {users.length === 0 ? (
                    <Text color="gray.500" fontSize="sm" textAlign="center">
                      No users found. Please ensure users exist in the system.
                    </Text>
                  ) : getFilteredUsers().length === 0 ? (
                    <Text color="gray.500" fontSize="sm" textAlign="center">
                      No users match your search.
                    </Text>
                  ) : (
                    <Stack spacing={2}>
                      {getFilteredUsers().map((user) => (
                        <Checkbox
                          key={user._id}
                          isChecked={formData.user_ids.includes(user._id)}
                          onChange={() => handleCheckboxChange('user_ids', user._id)}
                        >
                          <HStack spacing={2}>
                            <Text fontWeight="medium">{user.name || user.userId}</Text>
                            {user.userId && user.name && (
                              <Text fontSize="xs" color="gray.500">({user.userId})</Text>
                            )}
                            <Badge colorScheme="purple" fontSize="xs">
                              {user.role}
                            </Badge>
                          </HStack>
                        </Checkbox>
                      ))}
                    </Stack>
                  )}
                </Box>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {formData.user_ids.length} user(s) selected
                </Text>
              </FormControl>

              <Divider />

              {/* Permissions */}
              <FormControl isRequired>
                <FormLabel>Permissions</FormLabel>
                <Stack spacing={2}>
                  <Checkbox
                    isChecked={formData.permissions.view}
                    onChange={() => handlePermissionChange('view')}
                  >
                    <HStack spacing={2}>
                      <ViewIcon />
                      <Text>View - Can view examination data</Text>
                    </HStack>
                  </Checkbox>
                  <Checkbox
                    isChecked={formData.permissions.edit}
                    onChange={() => handlePermissionChange('edit')}
                  >
                    <HStack spacing={2}>
                      <EditIcon />
                      <Text>Edit - Can modify examination data</Text>
                    </HStack>
                  </Checkbox>
                </Stack>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Examination Data Access</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRecord && (
              <VStack spacing={3} align="stretch">
                <Box>
                  <Text fontWeight="bold">Academic Year:</Text>
                  <Text>{getAcademicYearName(selectedRecord.academic_year_id)}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Classes:</Text>
                  <Text>
                    {selectedRecord.class_ids?.length > 0
                      ? selectedRecord.class_ids.map(item => 
                          typeof item === 'object' ? item.class_name : getNameById(item, classes, 'class_name')
                        ).join(', ')
                      : 'All Classes'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Sections:</Text>
                  <Text>
                    {selectedRecord.section_ids?.length > 0
                      ? selectedRecord.section_ids.map(item => 
                          typeof item === 'object' ? item.section_name : getNameById(item, sections, 'section_name')
                        ).join(', ')
                      : 'All Sections'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Mediums:</Text>
                  <Text>
                    {selectedRecord.medium_ids?.length > 0
                      ? selectedRecord.medium_ids.map(item => 
                          typeof item === 'object' ? item.medium_name : getNameById(item, mediums, 'medium_name')
                        ).join(', ')
                      : 'All Mediums'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Subjects:</Text>
                  <Text>
                    {selectedRecord.subject_ids?.length > 0
                      ? selectedRecord.subject_ids.map(item => 
                          typeof item === 'object' ? item.subject_name : getNameById(item, subjects, 'subject_name')
                        ).join(', ')
                      : 'All Subjects'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Users:</Text>
                  <Stack spacing={1} mt={1}>
                    {selectedRecord.user_ids?.map((item, index) => {
                      const user = typeof item === 'object' ? item : users.find(u => u._id === item);
                      return user ? (
                        <HStack key={user._id || index}>
                          <Text>{user.name || user.userId}</Text>
                          <Badge colorScheme="purple">{user.role}</Badge>
                        </HStack>
                      ) : null;
                    })}
                  </Stack>
                </Box>
                <Box>
                  <Text fontWeight="bold">Permissions:</Text>
                  <HStack spacing={2} mt={1}>
                    {selectedRecord.permissions?.view && <Badge colorScheme="green">View</Badge>}
                    {selectedRecord.permissions?.edit && <Badge colorScheme="blue">Edit</Badge>}
                  </HStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ExaminationDataAccess;
