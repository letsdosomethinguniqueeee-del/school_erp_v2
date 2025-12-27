import React, { useState, useEffect } from 'react';
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
  VStack,
  useDisclosure,
  Box,
  Heading,
  Text,
  Select,
  useToast,
  HStack,
  Divider,
  Badge,
  Checkbox,
  CheckboxGroup,
  Stack,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import ResponsiveTable from '../../Shared/ResponsiveTable/ResponsiveTable';
import api from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';

const ClassMappingConfig = ({ modalType, refreshTrigger }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    className: '',
    medium: '',
    stream: '',
    subjects: [],
    sections: [],
    isActive: true
  });

  // State for class mappings data
  const [classMappings, setClassMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State for dropdown data
  const [classes, setClasses] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // Edit modal state
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editingClassMapping, setEditingClassMapping] = useState(null);
  const [editFormData, setEditFormData] = useState({
    className: '',
    medium: '',
    stream: '',
    subjects: [],
    sections: [],
    isActive: true
  });

  // View modal state
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [viewingClassMapping, setViewingClassMapping] = useState(null);

  // Delete modal state
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deletingClassMapping, setDeletingClassMapping] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all dropdown data
  const fetchDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      const [classesRes, mediumsRes, streamsRes, subjectsRes, sectionsRes] = await Promise.all([
        api.get(API_ENDPOINTS.CLASSES),
        api.get(API_ENDPOINTS.MEDIUMS),
        api.get(API_ENDPOINTS.STREAMS),
        api.get(API_ENDPOINTS.SUBJECTS),
        api.get(API_ENDPOINTS.SECTIONS)
      ]);

      if (classesRes.data.success) {
        setClasses(classesRes.data.data.map(item => ({
          value: item._id,
          label: item.class_name
        })));
      }

      if (mediumsRes.data.success) {
        setMediums(mediumsRes.data.data.map(item => ({
          value: item._id,
          label: item.medium_name
        })));
      }

      if (streamsRes.data.success) {
        setStreams(streamsRes.data.data.map(item => ({
          value: item._id,
          label: item.stream_name
        })));
      }

      if (subjectsRes.data.success) {
        setSubjects(subjectsRes.data.data.map(item => ({
          value: item._id,
          label: item.subject_name
        })));
      }

      if (sectionsRes.data.success) {
        const processedSections = sectionsRes.data.data.map(item => {
          const originalName = item.section_code;
          let processedName = originalName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
          return {
            value: item._id,
            label: processedName
          };
        });
        setSections(processedSections);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load form data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingDropdowns(false);
    }
  };

  // Fetch class mappings from API
  const fetchClassMappings = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await api.get(API_ENDPOINTS.CLASS_MAPPINGS);

      if (response.data.success) {
        // Transform backend data to frontend format
        const transformedData = response.data.data.map(item => {
          return {
            id: item._id,
            className: item.class_name,
            medium: item.medium || '',
            stream: item.stream || '',
            subjects: item.subjects || [],
            sections: item.sections || [],
            isActive: item.is_active,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          };
        });

        setClassMappings(transformedData);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch class mappings',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching class mappings:', error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access class mappings',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access class mappings',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to server. Please check if the backend is running.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
      toast({
        title: 'Error',
          description: error.response?.data?.message || 'Failed to fetch class mappings',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDropdownData();
    fetchClassMappings(true);
  }, []);

  // Refresh dropdown data when refreshTrigger changes (from other tabs)
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchDropdownData();
    }
  }, [refreshTrigger]);

  // Table columns configuration
  const columns = [
    {
      key: 'className',
      label: 'Class Name',
      minWidth: '150px'
    },
    {
      key: 'medium',
      label: 'Medium',
      minWidth: '120px'
    },
    {
      key: 'stream',
      label: 'Stream',
      minWidth: '120px'
    },
    {
      key: 'subjects',
      label: 'Subjects',
      minWidth: '150px',
      render: (value) => (
        <HStack spacing={1} align="center" overflowX="auto">
          {value.map((subject, index) => (
            <Badge
              key={index}
              colorScheme="green"
              variant="subtle"
              px="6px"
              py="2px"
              borderRadius="8px"
              fontSize="xs"
              whiteSpace="nowrap"
              flexShrink={0}
            >
              {subject}
            </Badge>
          ))}
        </HStack>
      )
    },
    {
      key: 'sections',
      label: 'Sections',
      minWidth: '150px',
      render: (value) => (
        <HStack spacing={1} align="center" overflowX="auto">
          {value.map((section, index) => (
            <Badge
              key={index}
              colorScheme="purple"
              variant="subtle"
              px="6px"
              py="2px"
              borderRadius="8px"
              fontSize="xs"
              whiteSpace="nowrap"
              flexShrink={0}
            >
              {section}
            </Badge>
          ))}
        </HStack>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      minWidth: '100px',
      render: (value) => (
        <Badge
          colorScheme={value ? 'green' : 'red'}
          variant="subtle"
          px="8px"
          py="2px"
          borderRadius="12px"
          fontSize="xs"
          fontWeight="500"
        >
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Created At',
      minWidth: '120px',
      type: 'datetime'
    },
    {
      key: 'updatedAt',
      label: 'Updated At',
      minWidth: '140px',
      type: 'datetime'
    }
  ];

  // Watch for modal trigger from parent
  useEffect(() => {
    if (modalType === 'class-mapping') {
      onOpen();
    }
  }, [modalType, onOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const selectedClass = classes.find(cls => cls.value === formData.className);
      const selectedMedium = mediums.find(med => med.value === formData.medium);
      const selectedStream = streams.find(str => str.value === formData.stream);
      const selectedSubjects = subjects.filter(sub => formData.subjects.includes(sub.value));
      const selectedSections = sections.filter(sec => formData.sections.includes(sec.value));

      const backendData = {
        class_name: selectedClass?.label || formData.className,
        medium: selectedMedium?.label || formData.medium,
        stream: selectedStream?.label || formData.stream,
        subjects: selectedSubjects.map(sub => sub.label),
        sections: selectedSections.map(sec => sec.label),
        is_active: formData.isActive
      };

      const response = await api.post(API_ENDPOINTS.CLASS_MAPPINGS, backendData);

      if (response.data.success) {
        await fetchClassMappings();
      
      toast({
        title: 'Success',
          description: 'Class mapping created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
        onClose();
        setFormData({
          className: '',
          medium: '',
          stream: '',
          subjects: [],
          sections: [],
          isActive: true
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create class mapping',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error creating class mapping:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create class mapping',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Transform frontend data to backend format
      // Get the actual names from the selected IDs
      const selectedClass = classes.find(cls => cls.value === editFormData.className);
      const selectedMedium = mediums.find(med => med.value === editFormData.medium);
      const selectedStream = streams.find(str => str.value === editFormData.stream);
      const selectedSubjects = subjects.filter(sub => editFormData.subjects.includes(sub.value));
      const selectedSections = sections.filter(sec => editFormData.sections.includes(sec.value));

      const backendData = {
        class_name: selectedClass?.label || editFormData.className,
        medium: selectedMedium?.label || editFormData.medium,
        stream: selectedStream?.label || editFormData.stream,
        subjects: selectedSubjects.map(sub => sub.label),
        sections: selectedSections.map(sec => sec.label),
        is_active: editFormData.isActive
      };

      const response = await api.put(API_ENDPOINTS.CLASS_MAPPING_BY_ID(editingClassMapping.id), backendData);

      if (response.data.success) {
        await fetchClassMappings();

        toast({
          title: 'Success',
          description: 'Class mapping updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onEditClose();
        setEditFormData({
          className: '',
          medium: '',
          stream: '',
          subjects: [],
          sections: [],
          isActive: true
        });
        setEditingClassMapping(null);

      } else {
      toast({
        title: 'Error',
          description: 'Failed to update class mapping',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    } catch (error) {
      console.error('Error updating class mapping:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update class mapping',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (row, index) => {
    setEditingClassMapping(row);

    // Convert names back to IDs for the form
    const selectedClass = classes.find(cls => cls.label === row.className);
    const selectedMedium = mediums.find(med => med.label === row.medium);
    const selectedStream = streams.find(str => str.label === row.stream);
    const selectedSubjects = subjects.filter(sub => row.subjects.includes(sub.label));

    const selectedSections = sections.filter(sec => {
      const isMatch = row.sections.includes(sec.label);
      return isMatch;
    });

    setEditFormData({
      className: selectedClass?.value || '',
      medium: selectedMedium?.value || '',
      stream: selectedStream?.value || '',
      subjects: selectedSubjects.map(sub => sub.value),
      sections: selectedSections.map(sec => sec.value),
      isActive: row.isActive
    });

    onEditOpen();
  };

  const handleDelete = (row, index) => {
    setDeletingClassMapping(row);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingClassMapping) return;

    setDeleting(true);
    try {
      const response = await api.delete(API_ENDPOINTS.CLASS_MAPPING_BY_ID(deletingClassMapping.id));

      if (response.data.success) {
        await fetchClassMappings();

        onDeleteClose();
        setDeletingClassMapping(null);
      
      toast({
        title: 'Success',
        description: 'Class mapping deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      } else {
      toast({
        title: 'Error',
        description: 'Failed to delete class mapping',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      }
    } catch (error) {
      console.error('Error deleting class mapping:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete class mapping',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (row, index) => {
    setViewingClassMapping(row);
    onViewOpen();
  };

    return (
    <>
      <Box p={0}>
        <Heading
          as="h1"
          fontSize={{ base: '0.875rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}
          fontWeight="600"
          lineHeight="1.3"
          mb={4}
        >
          Class Mappings Management
        </Heading>
        <Text
          fontSize={{ base: '0.625rem', sm: '0.625rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}
          color="gray.600"
          lineHeight="1.6"
          mb={4}
        >
          Manage class mappings for your school. Map classes with their mediums, streams, subjects, and sections.
        </Text>

        <ResponsiveTable
          data={classMappings}
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
          searchPlaceholder="Search by class name..."
          searchFields={['className']}
          loading={loading}
          emptyMessage={loading ? "Loading class mappings..." : "No class mappings found. Click 'Add New Class Mapping' to create one."}
          maxHeight="500px"
          stickyHeader={true}
          variant="simple"
          size="md"
                />
              </Box>

      {/* Add Class Mapping Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        scrollBehavior='inside'
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader>Add New Class Mapping</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loadingDropdowns ? (
              <VStack spacing={4} py={8}>
                <Spinner size="lg" />
                <Text>Loading form data...</Text>
              </VStack>
            ) : (
              <VStack spacing={6}>
                {/* Class Name Selection */}
                <FormControl isRequired>
                  <FormLabel htmlFor="add-class-name">Select Class Name</FormLabel>
                  <Select
                    id="add-class-name"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    placeholder="Choose a class..."
                  >
                    {classes.map((cls) => (
                      <option key={cls.value} value={cls.value}>
                        {cls.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Medium Selection */}
                <FormControl isRequired>
                  <FormLabel htmlFor="add-medium">Select Medium (Single Selection)</FormLabel>
                  <Select
                    id="add-medium"
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    placeholder="Choose a medium..."
                  >
                    {mediums.map((medium) => (
                      <option key={medium.value} value={medium.value}>
                        {medium.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Stream Selection */}
                <FormControl isRequired>
                  <FormLabel htmlFor="add-stream">Select Stream (Single Selection)</FormLabel>
                  <Select
                    id="add-stream"
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    placeholder="Choose a stream..."
                  >
                    {streams.map((stream) => (
                      <option key={stream.value} value={stream.value}>
                        {stream.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Subjects Selection */}
                <FormControl isRequired>
                  <FormLabel htmlFor="add-subject-0">Select Subjects (Multiple Selection)</FormLabel>
                  <CheckboxGroup
                    value={formData.subjects}
                    onChange={(values) => setFormData({ ...formData, subjects: values })}
                  >
                    <Stack spacing={2}>
                      {subjects.map((subject, index) => (
                        <Checkbox key={subject.value} value={subject.value} id={`add-subject-${index}`}>
                          {subject.label}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </FormControl>

                {/* Sections Selection */}
                <FormControl isRequired>
                  <FormLabel htmlFor="add-section-0">Select Sections (Multiple Selection)</FormLabel>
                  <CheckboxGroup
                    value={formData.sections}
                    onChange={(values) => setFormData({ ...formData, sections: values })}
                  >
                    <Stack spacing={2}>
                      {sections.map((section, index) => (
                        <Checkbox key={section.value} value={section.value} id={`add-section-${index}`}>
                          {section.label}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </FormControl>

                {/* Status */}
                <FormControl>
                  <FormLabel htmlFor="add-status">Status</FormLabel>
                  <Select
                    id="add-status"
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Select>
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={submitting}
              loadingText="Creating..."
              isDisabled={loadingDropdowns}
            >
              Add Class Mapping
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Class Mapping Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={onEditClose}
        size="lg"
        scrollBehavior='inside'
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader>Edit Class Mapping</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loadingDropdowns ? (
              <VStack spacing={4} py={8}>
                <Spinner size="lg" />
                <Text>Loading form data...</Text>
              </VStack>
            ) : (
              <VStack spacing={6}>
                {/* Class Name Selection */}
                <FormControl isRequired>
                  <FormLabel htmlFor="edit-class-name">Select Class Name</FormLabel>
                <Select
                    id="edit-class-name"
                    value={editFormData.className}
                    onChange={(e) => setEditFormData({ ...editFormData, className: e.target.value })}
                    placeholder="Choose a class..."
                  >
                    {classes.map((cls) => (
                      <option key={cls.value} value={cls.value}>
                        {cls.label}
                      </option>
                  ))}
                </Select>
                </FormControl>

                {/* Medium Selection */}
                <FormControl isRequired>
                  <FormLabel htmlFor="edit-medium">Select Medium (Single Selection)</FormLabel>
                <Select
                    id="edit-medium"
                    value={editFormData.medium}
                    onChange={(e) => setEditFormData({ ...editFormData, medium: e.target.value })}
                    placeholder="Choose a medium..."
                  >
                    {mediums.map((medium) => (
                      <option key={medium.value} value={medium.value}>
                        {medium.label}
                      </option>
                  ))}
                </Select>
                </FormControl>

                {/* Stream Selection */}
                <FormControl isRequired>
                  <FormLabel htmlFor="edit-stream">Select Stream (Single Selection)</FormLabel>
                <Select
                    id="edit-stream"
                    value={editFormData.stream}
                    onChange={(e) => setEditFormData({ ...editFormData, stream: e.target.value })}
                    placeholder="Choose a stream..."
                  >
                    {streams.map((stream) => (
                      <option key={stream.value} value={stream.value}>
                        {stream.label}
                      </option>
                  ))}
                </Select>
                </FormControl>
            
                {/* Subjects Selection */}
                <FormControl isRequired>
                  <FormLabel htmlFor="edit-subject-0">Select Subjects (Multiple Selection)</FormLabel>
              <CheckboxGroup
                    value={editFormData.subjects}
                    onChange={(values) => setEditFormData({ ...editFormData, subjects: values })}
                  >
                    <Stack spacing={2}>
                      {subjects.map((subject, index) => (
                        <Checkbox key={subject.value} value={subject.value} id={`edit-subject-${index}`}>
                          {subject.label}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
                </FormControl>
            
                {/* Sections Selection */}
                <FormControl isRequired>
                  <FormLabel htmlFor="edit-section-0">Select Sections (Multiple Selection)</FormLabel>
              <CheckboxGroup
                    value={editFormData.sections}
                    onChange={(values) => setEditFormData({ ...editFormData, sections: values })}
                  >
                    <Stack spacing={2}>
                      {sections.map((section, index) => (
                        <Checkbox key={section.value} value={section.value} id={`edit-section-${index}`}>
                          {section.label}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
                </FormControl>

                {/* Status */}
                <FormControl>
                  <FormLabel htmlFor="edit-status">Status</FormLabel>
                  <Select
                    id="edit-status"
                    value={editFormData.isActive}
                    onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.value === 'true' })}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Select>
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleEditSubmit}
              isLoading={submitting}
              loadingText="Updating..."
              isDisabled={loadingDropdowns}
            >
              Update Class Mapping
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Class Mapping Modal */}
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
            <Heading size="md" color="gray.700">Class Mapping Information</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewingClassMapping && (
              <VStack spacing={6} align="stretch">
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">🔗</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Mapping Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Class Name</Text>
                      <Text fontSize="md" color="gray.800">{viewingClassMapping.className}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Medium</Text>
                      <Text fontSize="md" color="gray.800">{viewingClassMapping.medium}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Stream</Text>
                      <Text fontSize="md" color="gray.800">{viewingClassMapping.stream}</Text>
            </Box>
            
            <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Subjects</Text>
                      <HStack spacing={2} flexWrap="wrap">
                        {viewingClassMapping.subjects.map((subject, index) => (
                          <Badge
                            key={index}
                            colorScheme="green"
                            variant="subtle"
                            px="8px"
                            py="4px"
                            borderRadius="8px"
                            fontSize="sm"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </HStack>
            </Box>
            
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Sections</Text>
                      <HStack spacing={2} flexWrap="wrap">
                        {viewingClassMapping.sections.map((section, index) => (
                          <Badge
                            key={index}
                            colorScheme="purple"
                            variant="subtle"
                            px="8px"
                            py="4px"
                            borderRadius="8px"
                            fontSize="sm"
                          >
                            {section}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
          </VStack>
        </Box>

                <Divider />

                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">📊</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Status Information</Text>
                  </HStack>

                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Current Status</Text>
                    <Text
                      fontSize="md"
                      textTransform="capitalize"
                      color={viewingClassMapping.isActive ? 'green.600' : 'red.600'}
                      fontWeight="500"
                    >
                      {viewingClassMapping.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">⏰</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Timestamp Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Created At</Text>
                      <Text fontSize="md" color="gray.800">
                        {new Date(viewingClassMapping.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        }).replace(/AM|PM/g, match => match.toUpperCase()).replace(',', '')}
                      </Text>
                    </Box>

        <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Updated At</Text>
                      <Text fontSize="md" color="gray.800">
                        {new Date(viewingClassMapping.updatedAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        }).replace(/AM|PM/g, match => match.toUpperCase()).replace(',', '')}
                      </Text>
                    </Box>
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
            <Heading size="md" color="red.600">Delete Class Mapping</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletingClassMapping && (
              <VStack spacing={4} align="stretch">
                <Text fontSize="md" color="gray.700">
                  Are you sure you want to delete this class mapping?
                      </Text>

                <Box p={4} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Class Name</Text>
                      <Text fontSize="md" fontWeight="bold" color="blue.600">{deletingClassMapping.className}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Medium</Text>
                      <Text fontSize="md" color="gray.800">{deletingClassMapping.medium}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Stream</Text>
                      <Text fontSize="md" color="gray.800">{deletingClassMapping.stream}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>Subjects</Text>
                      <HStack spacing={2} flexWrap="wrap">
                        {deletingClassMapping.subjects.map((subject, index) => (
                          <Badge
                            key={index}
                            colorScheme="green"
                            variant="subtle"
                            px="6px"
                            py="2px"
                            borderRadius="6px"
                            fontSize="xs"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={2}>Sections</Text>
                      <HStack spacing={2} flexWrap="wrap">
                        {deletingClassMapping.sections.map((section, index) => (
                          <Badge
                            key={index}
                            colorScheme="purple"
                            variant="subtle"
                            px="6px"
                            py="2px"
                            borderRadius="6px"
                            fontSize="xs"
                          >
                            {section}
                          </Badge>
                        ))}
                      </HStack>
        </Box>
      </VStack>
    </Box>

                <Text fontSize="sm" color="red.600" fontWeight="500">
                  This action is permanent and cannot be undone.
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

export default ClassMappingConfig;
