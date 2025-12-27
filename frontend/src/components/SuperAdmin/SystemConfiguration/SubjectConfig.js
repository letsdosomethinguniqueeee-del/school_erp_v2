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
  Input,
  VStack,
  useDisclosure,
  Box,
  Heading,
  Text,
  Select,
  useToast,
  Badge,
  HStack,
  Divider
} from '@chakra-ui/react';
import ResponsiveTable from '../../Shared/ResponsiveTable/ResponsiveTable';
import api from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';

const SubjectConfig = ({ modalType, onDataChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    isActive: true
  });

  // State for subjects data
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editingSubject, setEditingSubject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    subjectCode: '',
    subjectName: '',
    isActive: true
  });

  // View modal state
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [viewingSubject, setViewingSubject] = useState(null);

  // Delete modal state
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deletingSubject, setDeletingSubject] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch subjects from API
  const fetchSubjects = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await api.get(API_ENDPOINTS.SUBJECTS);

      if (response.data.success) {
        // Transform backend data to frontend format
        const transformedData = response.data.data.map(item => ({
          id: item._id,
          subjectCode: item.subject_code,
          subjectName: item.subject_name,
          isActive: item.is_active,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));

        setSubjects(transformedData);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch subjects',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch subjects',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Load subjects on component mount
  useEffect(() => {
    fetchSubjects(true); // Show loading only on initial load
  }, []);

  // Table columns configuration
  const columns = [
    {
      key: 'subjectCode',
      label: 'Subject Code',
      minWidth: '120px'
    },
    {
      key: 'subjectName',
      label: 'Subject Name',
      minWidth: '150px'
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
    if (modalType === 'subject') {
      onOpen();
    }
  }, [modalType, onOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Transform frontend data to backend format
      const backendData = {
        subject_code: formData.subjectCode,
        subject_name: formData.subjectName,
        is_active: formData.isActive
      };

      const response = await api.post(API_ENDPOINTS.SUBJECTS, backendData);

      if (response.data.success) {
        // Refresh the list without loading
        await fetchSubjects();

        toast({
          title: 'Success',
          description: 'Subject created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }

        // Close modal and reset form first
        onClose();
        setFormData({ subjectCode: '', subjectName: '', isActive: true });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create subject',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error creating subject:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create subject',
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
      const backendData = {
        subject_code: editFormData.subjectCode,
        subject_name: editFormData.subjectName,
        is_active: editFormData.isActive
      };

      const response = await api.put(API_ENDPOINTS.SUBJECT_BY_ID(editingSubject.id), backendData);

      if (response.data.success) {
        // Refresh the list without loading
        await fetchSubjects();

        toast({
          title: 'Success',
          description: 'Subject updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }

        // Close modal and reset form first
        onEditClose();
        setEditFormData({ subjectCode: '', subjectName: '', isActive: true });
        setEditingSubject(null);

      } else {
        toast({
          title: 'Error',
          description: 'Failed to update subject',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating subject:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update subject',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle table actions
  const handleEdit = (row, index) => {
    // Set the subject being edited
    setEditingSubject(row);

    // Pre-populate the edit form with existing data
    setEditFormData({
      subjectCode: row.subjectCode,
      subjectName: row.subjectName,
      isActive: row.isActive
    });

    // Open the edit modal
    onEditOpen();
  };

  const handleDelete = (row, index) => {
    // Set the subject being deleted
    setDeletingSubject(row);

    // Open the delete modal
    onDeleteOpen();
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingSubject) return;

    setDeleting(true);

    try {
      // Use permanent=true query parameter for hard delete
      const deleteUrl = `${API_ENDPOINTS.SUBJECT_BY_ID(deletingSubject.id)}?permanent=true`;
      
      const response = await api.delete(deleteUrl);

      if (response.data.success) {
        // Refresh the list without loading
        await fetchSubjects();
        
        // Close modal and reset state first
        onDeleteClose();
        setDeletingSubject(null);

        toast({
          title: 'Success',
          description: 'Subject deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }
        
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete subject',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete subject',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (row, index) => {
    // Set the subject being viewed
    setViewingSubject(row);

    // Open the view modal
    onViewOpen();
  };

  return (
    <>
      {/* Subjects Table */}
      <Box p={0}>
        <Heading
          as="h1"
          fontSize={{ base: '0.875rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}
          fontWeight="600"
          lineHeight="1.3"
          mb={4}
        >
          Subjects Management
        </Heading>
        <Text
          fontSize={{ base: '0.625rem', sm: '0.625rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}
          color="gray.600"
          lineHeight="1.6"
          mb={4}
        >
          Manage subjects for your school. Add new subjects and manage existing ones.
        </Text>
        
        <ResponsiveTable
          data={subjects}
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
          searchPlaceholder="Search by subject code, name..."
          searchFields={['subjectCode', 'subjectName']}
          loading={loading}
          emptyMessage={loading ? "Loading subjects..." : "No subjects found. Click 'Add New Subject' to create one."}
          maxHeight="500px"
          stickyHeader={true}
          variant="simple"
          size="md"
        />
      </Box>

      {/* Add Subject Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size="md" 
        scrollBehavior='inside'
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader>Add New Subject</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Subject Code</FormLabel>
                <Input
                  value={formData.subjectCode}
                  onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                  placeholder="e.g., PHY, CHEM, MATH"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Subject Name</FormLabel>
                <Input
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  placeholder="e.g., Physics, Chemistry, Mathematics"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </Select>
              </FormControl>
            </VStack>
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
            >
              Add Subject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Subject Modal */}
      <Modal 
        isOpen={isEditOpen} 
        onClose={onEditClose} 
        size="md" 
        scrollBehavior='inside'
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader>Edit Subject</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Subject Code</FormLabel>
                <Input
                  value={editFormData.subjectCode}
                  onChange={(e) => setEditFormData({ ...editFormData, subjectCode: e.target.value })}
                  placeholder="e.g., PHY, CHEM, MATH"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Subject Name</FormLabel>
                <Input
                  value={editFormData.subjectName}
                  onChange={(e) => setEditFormData({ ...editFormData, subjectName: e.target.value })}
                  placeholder="e.g., Physics, Chemistry, Mathematics"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={editFormData.isActive}
                  onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.value === 'true' })}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </Select>
              </FormControl>
            </VStack>
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
            >
              Update Subject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Subject Modal */}
      <Modal 
        isOpen={isViewOpen} 
        onClose={onViewClose} 
        size="md" 
        scrollBehavior='inside'
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader>
            <Heading size="md" color="gray.700">Subject Information</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewingSubject && (
              <VStack spacing={6} align="stretch">
                {/* Basic Information Section */}
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">📚</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Basic Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Subject Code</Text>
                      <Text fontSize="md" color="gray.800">{viewingSubject.subjectCode}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Subject Name</Text>
                      <Text fontSize="md" color="gray.800">{viewingSubject.subjectName}</Text>
                    </Box>
                  </VStack>
                </Box>

                <Divider />

                {/* Status Information Section */}
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
                      color={viewingSubject.isActive ? 'green.600' : 'red.600'}
                      fontWeight="500"
                    >
                      {viewingSubject.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </Box>
                </Box>

                <Divider />

                {/* Timestamp Information Section */}
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">⏰</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Timestamp Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Created At</Text>
                      <Text fontSize="md" color="gray.800">
                        {new Date(viewingSubject.createdAt).toLocaleString('en-IN', {
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
                        {new Date(viewingSubject.updatedAt).toLocaleString('en-IN', {
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
            <Heading size="md" color="red.600">Delete Subject</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletingSubject && (
              <VStack spacing={4} align="stretch">
                <Text fontSize="md" color="gray.700">
                  Are you sure you want to delete subject <Text as="span" fontWeight="bold">{deletingSubject.subjectName}</Text>?
                </Text>

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

export default SubjectConfig;