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
  HStack,
  Divider,
  Badge,
  NumberInput,
  NumberInputField
} from '@chakra-ui/react';
import ResponsiveTable from '../../Shared/ResponsiveTable/ResponsiveTable';
import api from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';

const ClassConfig = ({ modalType, onDataChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    className: '',
    classNumber: '',
    isActive: true
  });

  // State for classes data
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editingClass, setEditingClass] = useState(null);
  const [editFormData, setEditFormData] = useState({
    className: '',
    classNumber: '',
    isActive: true
  });

  // View modal state
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [viewingClass, setViewingClass] = useState(null);

  // Delete modal state
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deletingClass, setDeletingClass] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch classes from API
  const fetchClasses = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await api.get(API_ENDPOINTS.CLASSES);

      if (response.data.success) {
        // Transform backend data to frontend format
        const transformedData = response.data.data.map(item => ({
          id: item._id,
          className: item.class_name,
          classNumber: item.class_order,
          isActive: item.is_active,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));

        setClasses(transformedData);
      } else {
      toast({
        title: 'Error',
        description: 'Failed to fetch classes',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access classes',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access classes',
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
          description: error.response?.data?.message || 'Failed to fetch classes',
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

  // Load classes on component mount
  useEffect(() => {
    fetchClasses(true); // Show loading only on initial load
  }, []);

  // Table columns configuration
  const columns = [
    {
      key: 'className',
      label: 'Class Name',
      minWidth: '150px'
    },
    {
      key: 'classNumber',
      label: 'Class Order',
      minWidth: '120px'
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
    if (modalType === 'class') {
      onOpen();
    }
  }, [modalType, onOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Transform frontend data to backend format
      const backendData = {
        class_code: formData.className, // Use className as class_code
        class_name: formData.className,
        class_order: parseInt(formData.classNumber) || 0, // Use classNumber as class_order
        is_active: formData.isActive
      };

      const response = await api.post(API_ENDPOINTS.CLASSES, backendData);

      if (response.data.success) {
        await fetchClasses();

        toast({
          title: 'Success',
          description: 'Class created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }
        onClose();
        setFormData({ className: '', classNumber: '', isActive: true });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create class',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create class',
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
        class_code: editFormData.className, // Use className as class_code
        class_name: editFormData.className,
        class_order: parseInt(editFormData.classNumber) || 0, // Use classNumber as class_order
        is_active: editFormData.isActive
      };

      const response = await api.put(API_ENDPOINTS.CLASS_BY_ID(editingClass.id), backendData);

      if (response.data.success) {
        await fetchClasses();

        toast({
          title: 'Success',
          description: 'Class updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }
        
        onEditClose();
        setEditFormData({ className: '', classNumber: '', isActive: true });
        setEditingClass(null);

      } else {
        toast({
          title: 'Error',
          description: 'Failed to update class',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating class:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update class',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (row, index) => {
    setEditingClass(row);

    setEditFormData({
      className: row.className,
      classNumber: row.classNumber,
      isActive: row.isActive
    });

    onEditOpen();
  };

  const handleDelete = (row, index) => {
    setDeletingClass(row);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingClass) return;

    setDeleting(true);
    try {
      const response = await api.delete(API_ENDPOINTS.CLASS_BY_ID(deletingClass.id));

      if (response.data.success) {
        await fetchClasses();

        onDeleteClose();
        setDeletingClass(null);

        toast({
          title: 'Success',
          description: 'Class deleted successfully',
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
          description: 'Failed to delete class',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete class',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (row, index) => {
    setViewingClass(row);
    onViewOpen();
  };

  return (
    <>
      {/* Classes Table */}
      <Box p={0}>
        <Heading
          as="h1"
          size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
          fontWeight="600"
          lineHeight="1.3"
          mb={4}
        >
          Classes Management
        </Heading>
        <Text
          fontSize={{ base: '0.685rem', sm: '0.685rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}
          color="gray.600"
          lineHeight="1.6"
          mb={4}
        >
          Manage classes for your school. Add new classes and manage existing ones.
        </Text>
        
        <ResponsiveTable
          data={classes}
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
          searchPlaceholder="Search by class name, order..."
          searchFields={['className', 'classNumber']}
          loading={loading}
          emptyMessage={loading ? "Loading classes..." : "No classes found. Click 'Add New Class' to create one."}
          maxHeight="500px"
          stickyHeader={true}
          variant="simple"
          size="md"
              />
            </Box>

      {/* Add Class Modal */}
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
          <ModalHeader size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}>Add New Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Class Name</FormLabel>
                <Input
                  size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  placeholder="e.g., LKG, UKG, First Grade"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Class Order (Number)</FormLabel>
                <NumberInput
                  value={formData.classNumber}
                  onChange={(value) => setFormData({ ...formData, classNumber: value })}
                >
                  <NumberInputField size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} placeholder="e.g., 0, 1, 2, 3" />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Status</FormLabel>
                <Select
                  size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
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
            <Button variant="ghost" mr={3} size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSubmit}
              isLoading={submitting}
              loadingText="Creating..."
            >
              Add Class
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Class Modal */}
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
          <ModalHeader size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}>Edit Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Class Name</FormLabel>
                <Input
                  size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
                  value={editFormData.className}
                  onChange={(e) => setEditFormData({ ...editFormData, className: e.target.value })}
                  placeholder="e.g., LKG, UKG, First Grade"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Class Order (Number)</FormLabel>
                <NumberInput
                  value={editFormData.classNumber}
                  onChange={(value) => setEditFormData({ ...editFormData, classNumber: value })}
                >
                  <NumberInputField size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} placeholder="e.g., 0, 1, 2, 3" />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Status</FormLabel>
                <Select
                  size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
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
            <Button variant="ghost" mr={3} size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} onClick={onEditClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
              onClick={handleEditSubmit}
              isLoading={submitting}
              loadingText="Updating..."
            >
              Update Class
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Class Modal */}
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
            <Heading size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.700">Class Information</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewingClass && (
              <VStack spacing={6} align="stretch">
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="bold" color="blue.600">🎓</Text>
                    <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="bold" color="blue.600">Basic Information</Text>
          </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="600" color="gray.600" mb={1}>Class Name</Text>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.800">{viewingClass.className}</Text>
                    </Box>

                    <Box>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="600" color="gray.600" mb={1}>Class Order</Text>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.800">{viewingClass.classNumber}</Text>
                    </Box>
                  </VStack>
        </Box>

                <Divider />

                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="bold" color="blue.600">📊</Text>
                    <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="bold" color="blue.600">Status Information</Text>
                  </HStack>

        <Box>
                    <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="600" color="gray.600" mb={1}>Current Status</Text>
                    <Text
                      size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
                      textTransform="capitalize"
                      color={viewingClass.isActive ? 'green.600' : 'red.600'}
                      fontWeight="500"
                    >
                      {viewingClass.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="bold" color="blue.600">⏰</Text>
                    <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="bold" color="blue.600">Timestamp Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="600" color="gray.600" mb={1}>Created At</Text>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.800">
                        {new Date(viewingClass.createdAt).toLocaleString('en-IN', {
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
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="600" color="gray.600" mb={1}>Updated At</Text>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.800">
                        {new Date(viewingClass.updatedAt).toLocaleString('en-IN', {
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
            <Button colorScheme="blue" onClick={onViewClose} size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}>
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
            <Heading size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="red.600">Delete Class</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletingClass && (
              <VStack spacing={4} align="stretch">
                <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.700">
                  Are you sure you want to delete class <Text as="span" fontWeight="bold">{deletingClass.className}</Text>?
                </Text>

                <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="red.600" fontWeight="500">
                  This action is permanent and cannot be undone.
                </Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} onClick={onDeleteClose} isDisabled={deleting}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
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

export default ClassConfig;