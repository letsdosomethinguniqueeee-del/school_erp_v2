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
  Badge
} from '@chakra-ui/react';
import ResponsiveTable from '../../Shared/ResponsiveTable/ResponsiveTable';
import api from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';

const MediumConfig = ({ modalType, onDataChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    mediumCode: '',
    mediumName: '',
    isActive: true
  });

  // State for mediums data
  const [mediums, setMediums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editingMedium, setEditingMedium] = useState(null);
  const [editFormData, setEditFormData] = useState({
    mediumCode: '',
    mediumName: '',
    isActive: true
  });

  // View modal state
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [viewingMedium, setViewingMedium] = useState(null);

  // Delete modal state
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deletingMedium, setDeletingMedium] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch mediums from API
  const fetchMediums = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await api.get(API_ENDPOINTS.MEDIUMS);

      if (response.data.success) {
        // Transform backend data to frontend format
        const transformedData = response.data.data.map(item => ({
          id: item._id,
          mediumCode: item.medium_code,
          mediumName: item.medium_name,
          isActive: item.is_active,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));

        setMediums(transformedData);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch mediums',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching mediums:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access mediums',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access mediums',
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
          description: error.response?.data?.message || 'Failed to fetch mediums',
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

  // Load mediums on component mount
  useEffect(() => {
    fetchMediums(true); // Show loading only on initial load
  }, []);

  // Table columns configuration
  const columns = [
    {
      key: 'mediumCode',
      label: 'Medium Code',
      minWidth: '120px'
    },
    {
      key: 'mediumName',
      label: 'Medium Name',
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
    if (modalType === 'medium') {
      onOpen();
    }
  }, [modalType, onOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Transform frontend data to backend format
      const backendData = {
        medium_code: formData.mediumCode,
        medium_name: formData.mediumName,
        is_active: formData.isActive
      };

      const response = await api.post(API_ENDPOINTS.MEDIUMS, backendData);

      if (response.data.success) {
        await fetchMediums();

        toast({
          title: 'Success',
          description: 'Medium created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }
        onClose();
        setFormData({ mediumCode: '', mediumName: '', isActive: true });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create medium',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error creating medium:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create medium',
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
        medium_code: editFormData.mediumCode,
        medium_name: editFormData.mediumName,
        is_active: editFormData.isActive
      };

      const response = await api.put(API_ENDPOINTS.MEDIUM_BY_ID(editingMedium.id), backendData);

      if (response.data.success) {
        await fetchMediums();

        toast({
          title: 'Success',
          description: 'Medium updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }
        
        onEditClose();
        setEditFormData({ mediumCode: '', mediumName: '', isActive: true });
        setEditingMedium(null);

      } else {
        toast({
          title: 'Error',
          description: 'Failed to update medium',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating medium:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update medium',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (row, index) => {
    setEditingMedium(row);

    setEditFormData({
      mediumCode: row.mediumCode,
      mediumName: row.mediumName,
      isActive: row.isActive
    });

    onEditOpen();
  };

  const handleDelete = (row, index) => {
    setDeletingMedium(row);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMedium) return;

    setDeleting(true);
    try {
      const response = await api.delete(API_ENDPOINTS.MEDIUM_BY_ID(deletingMedium.id));

      if (response.data.success) {
        await fetchMediums();

        onDeleteClose();
        setDeletingMedium(null);

        toast({
          title: 'Success',
          description: 'Medium deleted successfully',
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
          description: 'Failed to delete medium',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting medium:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete medium',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (row, index) => {
    setViewingMedium(row);
    onViewOpen();
  };

  return (
    <>
      {/* Mediums Table */}
      <Box p={0}>
        <Heading
          as="h1"
          size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
          fontWeight="600"
          lineHeight="1.3"
          mb={4}
        >
          Mediums Management
        </Heading>
        <Text
          fontSize={{ base: '0.685rem', sm: '0.685rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}
          color="gray.600"
          lineHeight="1.6"
          mb={4}
        >
          Manage mediums for your school. Add new mediums and manage existing ones.
        </Text>
        
        <ResponsiveTable
          data={mediums}
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
          searchPlaceholder="Search by medium code, name..."
          searchFields={['mediumCode', 'mediumName']}
          loading={loading}
          emptyMessage={loading ? "Loading mediums..." : "No mediums found. Click 'Add New Medium' to create one."}
          maxHeight="500px"
          stickyHeader={true}
          variant="simple"
          size="md"
        />
      </Box>

      {/* Add Medium Modal */}
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
          <ModalHeader size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}>Add New Medium</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Medium Code</FormLabel>
                <Input
                  size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
                  value={formData.mediumCode}
                  onChange={(e) => setFormData({ ...formData, mediumCode: e.target.value })}
                  placeholder="e.g., ENG, HIN, GUJ"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Medium Name</FormLabel>
                <Input
                  size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
                  value={formData.mediumName}
                  onChange={(e) => setFormData({ ...formData, mediumName: e.target.value })}
                  placeholder="e.g., English, Hindi, Gujarati"
                />
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
              size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
              onClick={handleSubmit}
              isLoading={submitting}
              loadingText="Creating..."
            >
              Add Medium
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Medium Modal */}
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
          <ModalHeader size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}>Edit Medium</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Medium Code</FormLabel>
                <Input
                  size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
                  value={editFormData.mediumCode}
                  onChange={(e) => setEditFormData({ ...editFormData, mediumCode: e.target.value })}
                  placeholder="e.g., ENG, HIN, GUJ"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Medium Name</FormLabel>
                <Input
                  size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
                  value={editFormData.mediumName}
                  onChange={(e) => setEditFormData({ ...editFormData, mediumName: e.target.value })}
                  placeholder="e.g., English, Hindi, Gujarati"
                />
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
              Update Medium
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Medium Modal */}
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
            <Heading size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.700">Medium Information</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewingMedium && (
              <VStack spacing={6} align="stretch">
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="bold" color="blue.600">🌐</Text>
                    <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="bold" color="blue.600">Basic Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="600" color="gray.600" mb={1}>Medium Code</Text>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.800">{viewingMedium.mediumCode}</Text>
                    </Box>

                    <Box>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="600" color="gray.600" mb={1}>Medium Name</Text>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.800">{viewingMedium.mediumName}</Text>
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
                      color={viewingMedium.isActive ? 'green.600' : 'red.600'}
                      fontWeight="500"
                    >
                      {viewingMedium.isActive ? 'Active' : 'Inactive'}
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
                        {new Date(viewingMedium.createdAt).toLocaleString('en-IN', {
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
                        {new Date(viewingMedium.updatedAt).toLocaleString('en-IN', {
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
            <Heading size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="red.600">Delete Medium</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletingMedium && (
              <VStack spacing={4} align="stretch">
                <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.700">
                  Are you sure you want to delete medium <Text as="span" fontWeight="bold">{deletingMedium.mediumName}</Text>?
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

export default MediumConfig;