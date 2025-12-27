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

const SectionConfig = ({ modalType, onDataChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    sectionName: '',
    sectionNumber: '',
    isActive: true
  });

  // State for sections data
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editingSection, setEditingSection] = useState(null);
  const [editFormData, setEditFormData] = useState({
    sectionName: '',
    sectionNumber: '',
    isActive: true
  });

  // View modal state
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [viewingSection, setViewingSection] = useState(null);

  // Delete modal state
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deletingSection, setDeletingSection] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch sections from API
  const fetchSections = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await api.get(API_ENDPOINTS.SECTIONS);

      if (response.data.success) {
        // Transform backend data to frontend format
        const transformedData = response.data.data.map(item => ({
          id: item._id,
          sectionName: item.section_name.replace('Section ', ''), // Remove "Section " prefix for display
          sectionNumber: item.section_order,
          isActive: item.is_active,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));

        setSections(transformedData);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch sections',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access sections',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access sections',
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
          description: error.response?.data?.message || 'Failed to fetch sections',
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

  // Load sections on component mount
  useEffect(() => {
    fetchSections(true); // Show loading only on initial load
  }, []);

  // Table columns configuration
  const columns = [
    {
      key: 'sectionName',
      label: 'Section Name',
      minWidth: '150px'
    },
    {
      key: 'sectionNumber',
      label: 'Section Order',
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
    if (modalType === 'section') {
      onOpen();
    }
  }, [modalType, onOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Transform frontend data to backend format
      const backendData = {
        section_code: formData.sectionName, // Use sectionName as section_code
        section_name: `Section ${formData.sectionName}`, // Make section_name more descriptive
        section_order: parseInt(formData.sectionNumber) || 0, // Use sectionNumber as section_order
        is_active: formData.isActive
      };

      const response = await api.post(API_ENDPOINTS.SECTIONS, backendData);

      if (response.data.success) {
        await fetchSections();

        toast({
          title: 'Success',
          description: 'Section created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }
        onClose();
        setFormData({ sectionName: '', sectionNumber: '', isActive: true });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create section',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error creating section:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create section',
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
        section_code: editFormData.sectionName, // Use sectionName as section_code
        section_name: `Section ${editFormData.sectionName}`, // Make section_name more descriptive
        section_order: parseInt(editFormData.sectionNumber) || 0, // Use sectionNumber as section_order
        is_active: editFormData.isActive
      };

      const response = await api.put(API_ENDPOINTS.SECTION_BY_ID(editingSection.id), backendData);

      if (response.data.success) {
        await fetchSections();

        toast({
          title: 'Success',
          description: 'Section updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }
        
        onEditClose();
        setEditFormData({ sectionName: '', sectionNumber: '', isActive: true });
        setEditingSection(null);

      } else {
        toast({
          title: 'Error',
          description: 'Failed to update section',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update section',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (row, index) => {
    setEditingSection(row);

    setEditFormData({
      sectionName: row.sectionName,
      sectionNumber: row.sectionNumber,
      isActive: row.isActive
    });

    onEditOpen();
  };

  const handleDelete = (row, index) => {
    setDeletingSection(row);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSection) return;

    setDeleting(true);
    try {
      const response = await api.delete(API_ENDPOINTS.SECTION_BY_ID(deletingSection.id));

      if (response.data.success) {
        await fetchSections();

        onDeleteClose();
        setDeletingSection(null);

        toast({
          title: 'Success',
          description: 'Section deleted successfully',
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
          description: 'Failed to delete section',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete section',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (row, index) => {
    setViewingSection(row);
    onViewOpen();
  };

  return (
    <>
      {/* Sections Table */}
      <Box p={0}>
        <Heading
          as="h1"
          size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
          fontWeight="600"
          lineHeight="1.3"
          mb={4}
        >
          Sections Management
        </Heading>
        <Text
          fontSize={{ base: '0.685rem', sm: '0.685rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}
          color="gray.600"
          lineHeight="1.6"
          mb={4}
        >
          Manage sections for your school. Add new sections and manage existing ones.
        </Text>
        
        <ResponsiveTable
          data={sections}
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
          searchPlaceholder="Search by section name, order..."
          searchFields={['sectionName', 'sectionNumber']}
          loading={loading}
          emptyMessage={loading ? "Loading sections..." : "No sections found. Click 'Add New Section' to create one."}
          maxHeight="500px"
          stickyHeader={true}
          variant="simple"
          size="md"
        />
      </Box>

      {/* Add Section Modal */}
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
          <ModalHeader size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}>Add New Section</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Section Name</FormLabel>
                <Input
                  size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
                  value={formData.sectionName}
                  onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
                  placeholder="e.g., A, B, C (will become Section A, Section B, etc.)"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Section Order (Number)</FormLabel>
                <NumberInput
                  value={formData.sectionNumber}
                  onChange={(value) => setFormData({ ...formData, sectionNumber: value })}
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
              size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
              onClick={handleSubmit}
              isLoading={submitting}
              loadingText="Creating..."
            >
              Add Section
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Section Modal */}
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
          <ModalHeader size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}>Edit Section</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Section Name</FormLabel>
                <Input
                  size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
                  value={editFormData.sectionName}
                  onChange={(e) => setEditFormData({ ...editFormData, sectionName: e.target.value })}
                  placeholder="e.g., A, B, C (will become Section A, Section B, etc.)"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}>Section Order (Number)</FormLabel>
                <NumberInput
                  value={editFormData.sectionNumber}
                  onChange={(value) => setEditFormData({ ...editFormData, sectionNumber: value })}
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
              Update Section
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Section Modal */}
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
            <Heading size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.700">Section Information</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewingSection && (
              <VStack spacing={6} align="stretch">
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="bold" color="blue.600">📚</Text>
                    <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="bold" color="blue.600">Basic Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="600" color="gray.600" mb={1}>Section Name</Text>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.800">{viewingSection.sectionName}</Text>
                    </Box>

                    <Box>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} fontWeight="600" color="gray.600" mb={1}>Section Order</Text>
                      <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.800">{viewingSection.sectionNumber}</Text>
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
                      color={viewingSection.isActive ? 'green.600' : 'red.600'}
                      fontWeight="500"
                    >
                      {viewingSection.isActive ? 'Active' : 'Inactive'}
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
                        {new Date(viewingSection.createdAt).toLocaleString('en-IN', {
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
                        {new Date(viewingSection.updatedAt).toLocaleString('en-IN', {
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
            <Heading size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="red.600">Delete Section</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletingSection && (
              <VStack spacing={4} align="stretch">
                <Text size={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }} color="gray.700">
                  Are you sure you want to delete section <Text as="span" fontWeight="bold">{deletingSection.sectionName}</Text>?
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

export default SectionConfig;