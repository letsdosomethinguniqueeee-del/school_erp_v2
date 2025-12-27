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
import { AddIcon } from '@chakra-ui/icons';
import ResponsiveTable from '../../Shared/ResponsiveTable/ResponsiveTable';
import api from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';

const StreamConfig = ({ modalType, onDataChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    streamCode: '',
    streamName: '',
    isActive: true
  });

  // State for streams data
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editingStream, setEditingStream] = useState(null);
  const [editFormData, setEditFormData] = useState({
    streamCode: '',
    streamName: '',
    isActive: true
  });

  // View modal state
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [viewingStream, setViewingStream] = useState(null);

  // Delete modal state
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deletingStream, setDeletingStream] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch streams from API
  const fetchStreams = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await api.get(API_ENDPOINTS.STREAMS);

      if (response.data.success) {
        // Transform backend data to frontend format
        const transformedData = response.data.data.map(item => ({
          id: item._id,
          streamCode: item.stream_code,
          streamName: item.stream_name,
          isActive: item.is_active,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));

        setStreams(transformedData);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch streams',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching streams:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access streams',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access streams',
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
          description: error.response?.data?.message || 'Failed to fetch streams',
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

  // Load streams on component mount
  useEffect(() => {
    fetchStreams(true);
  }, []);

  // Table columns configuration
  const columns = [
    {
      key: 'streamCode',
      label: 'Stream Code',
      minWidth: '120px'
    },
    {
      key: 'streamName',
      label: 'Stream Name',
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
    if (modalType === 'stream') {
      onOpen();
    }
  }, [modalType, onOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Transform frontend data to backend format
      const backendData = {
        stream_code: formData.streamCode,
        stream_name: formData.streamName,
        is_active: formData.isActive
      };

      const response = await api.post(API_ENDPOINTS.STREAMS, backendData);

      if (response.data.success) {
        await fetchStreams();

        toast({
          title: 'Success',
          description: 'Stream created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }
        onClose();
        setFormData({ streamCode: '', streamName: '', isActive: true });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create stream',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error creating stream:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create stream',
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
        stream_code: editFormData.streamCode,
        stream_name: editFormData.streamName,
        is_active: editFormData.isActive
      };

      const response = await api.put(API_ENDPOINTS.STREAM_BY_ID(editingStream.id), backendData);

      if (response.data.success) {
        await fetchStreams();

        toast({
          title: 'Success',
          description: 'Stream updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }
        
        onEditClose();
        setEditFormData({ streamCode: '', streamName: '', isActive: true });
        setEditingStream(null);

      } else {
        toast({
          title: 'Error',
          description: 'Failed to update stream',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating stream:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update stream',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (row, index) => {
    setEditingStream(row);

    setEditFormData({
      streamCode: row.streamCode,
      streamName: row.streamName,
      isActive: row.isActive
    });

    onEditOpen();
  };

  const handleDelete = (row, index) => {
    setDeletingStream(row);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStream) return;

    setDeleting(true);
    try {
      const response = await api.delete(API_ENDPOINTS.STREAM_BY_ID(deletingStream.id));

      if (response.data.success) {
        await fetchStreams();

        onDeleteClose();
        setDeletingStream(null);

        toast({
          title: 'Success',
          description: 'Stream deleted successfully',
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
          description: 'Failed to delete stream',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting stream:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete stream',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (row, index) => {
    setViewingStream(row);
    onViewOpen();
  };

  return (
    <>
      {/* Streams Table */}
      <Box p={0}>
        <Heading
          as="h1"
          fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}
          fontWeight="600"
          lineHeight="1.3"
          mb={4}
        >
          Streams Management
        </Heading>
        <Text
          fontSize={{ base: '0.685rem', sm: '0.685rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}
          color="gray.600"
          lineHeight="1.6"
          mb={4}
        >
          Manage streams for your school. Add new streams and manage existing ones.
        </Text>
        
        <ResponsiveTable
          data={streams}
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
          searchPlaceholder="Search by stream code, name..."
          searchFields={['streamCode', 'streamName']}
          loading={loading}
          emptyMessage={loading ? "Loading streams..." : "No streams found. Click 'Add New Stream' to create one."}
          maxHeight="500px"
          stickyHeader={true}
          variant="simple"
          size="md"
        />
      </Box>

      {/* Add Stream Modal */}
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
          <ModalHeader fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}>Add New Stream</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Stream Code</FormLabel>
                <Input
                  value={formData.streamCode}
                  onChange={(e) => setFormData({ ...formData, streamCode: e.target.value })}
                  placeholder="e.g., ARTS, COMM, SCI"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Stream Name</FormLabel>
                <Input
                  value={formData.streamName}
                  onChange={(e) => setFormData({ ...formData, streamName: e.target.value })}
                  placeholder="e.g., Arts, Commerce, Science"
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
              Add Stream
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Stream Modal */}
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
          <ModalHeader fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}>Edit Stream</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Stream Code</FormLabel>
                <Input
                  value={editFormData.streamCode}
                  onChange={(e) => setEditFormData({ ...editFormData, streamCode: e.target.value })}
                  placeholder="e.g., ARTS, COMM, SCI"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Stream Name</FormLabel>
                <Input
                  value={editFormData.streamName}
                  onChange={(e) => setEditFormData({ ...editFormData, streamName: e.target.value })}
                  placeholder="e.g., Arts, Commerce, Science"
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
              Update Stream
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Stream Modal */}
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
            <Heading fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} color="gray.700">Stream Information</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewingStream && (
              <VStack spacing={6} align="stretch">
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">📚</Text>
                    <Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">Basic Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Stream Code</Text>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">{viewingStream.streamCode}</Text>
                    </Box>

                    <Box>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Stream Name</Text>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">{viewingStream.streamName}</Text>
                    </Box>
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">📊</Text>
                    <Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">Status Information</Text>
                  </HStack>

                  <Box>
                    <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Current Status</Text>
                    <Text
                      fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}
                      textTransform="capitalize"
                      color={viewingStream.isActive ? 'green.600' : 'red.600'}
                      fontWeight="500"
                    >
                      {viewingStream.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">⏰</Text>
                    <Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">Timestamp Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Created At</Text>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">
                        {new Date(viewingStream.createdAt).toLocaleString('en-IN', {
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
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Updated At</Text>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">
                        {new Date(viewingStream.updatedAt).toLocaleString('en-IN', {
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
            <Heading fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} color="red.600">Delete Stream</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletingStream && (
              <VStack spacing={4} align="stretch">
                <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.700">
                  Are you sure you want to delete stream <Text as="span" fontWeight="bold">{deletingStream.streamName}</Text>?
                </Text>

                <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="red.600" fontWeight="500">
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

export default StreamConfig;
