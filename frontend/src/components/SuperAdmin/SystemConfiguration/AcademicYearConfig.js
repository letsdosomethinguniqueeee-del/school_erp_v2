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

const AcademicYearConfig = ({ modalType, onDataChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    yearCode: '',
    startDate: '',
    endDate: '',
    status: 'upcoming'
  });

  // State for academic years data
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editingAcademicYear, setEditingAcademicYear] = useState(null);
  const [editFormData, setEditFormData] = useState({
    yearCode: '',
    startDate: '',
    endDate: '',
    status: 'upcoming'
  });

  // View modal state
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [viewingAcademicYear, setViewingAcademicYear] = useState(null);

  // Delete modal state
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deletingAcademicYear, setDeletingAcademicYear] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch academic years from API
  const fetchAcademicYears = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await api.get(API_ENDPOINTS.ACADEMIC_YEARS);

      if (response.data.success) {
        // Transform backend data to frontend format
        const transformedData = response.data.data.map(item => ({
          id: item._id,
          yearCode: item.year_code,
          startDate: item.start_date,
          endDate: item.end_date,
          status: item.status,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));

        setAcademicYears(transformedData);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch academic years',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching academic years:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch academic years',
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

  // Load academic years on component mount
  useEffect(() => {
    fetchAcademicYears(true); // Show loading only on initial load
  }, []);

  // Table columns configuration
  const columns = [
    {
      key: 'yearCode',
      label: 'Year Code',
      minWidth: '120px'
    },
    {
      key: 'startDate',
      label: 'Start Date',
      minWidth: '120px',
      type: 'date'
    },
    {
      key: 'endDate',
      label: 'End Date',
      minWidth: '120px',
      type: 'date'
    },
    {
      key: 'status',
      label: 'Status',
      minWidth: '100px',
      type: 'badge',
      badgeColor: 'green'
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
    if (modalType === 'academic-year') {
      onOpen();
    }
  }, [modalType, onOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Transform frontend data to backend format
      const backendData = {
        year_code: formData.yearCode,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: formData.status
      };

      const response = await api.post(API_ENDPOINTS.ACADEMIC_YEARS, backendData);

      if (response.data.success) {
        await fetchAcademicYears();

        toast({
          title: 'Success',
          description: 'Academic year created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }
        onClose();
        setFormData({ yearCode: '', startDate: '', endDate: '', status: 'upcoming' });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create academic year',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error creating academic year:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create academic year',
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
        year_code: editFormData.yearCode,
        start_date: editFormData.startDate,
        end_date: editFormData.endDate,
        status: editFormData.status
      };

      const response = await api.put(API_ENDPOINTS.ACADEMIC_YEAR_BY_ID(editingAcademicYear.id), backendData);

      if (response.data.success) {
        await fetchAcademicYears();

        toast({
          title: 'Success',
          description: 'Academic year updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Trigger dropdown refresh for Class Mapping tab
        if (onDataChange) {
          onDataChange();
        }
        
        onEditClose();
        setEditFormData({ yearCode: '', startDate: '', endDate: '', status: 'upcoming' });
        setEditingAcademicYear(null);

      } else {
        toast({
          title: 'Error',
          description: 'Failed to update academic year',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating academic year:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update academic year',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to convert date to YYYY-MM-DD format for HTML date input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleEdit = (row, index) => {
    setEditingAcademicYear(row);

    setEditFormData({
      yearCode: row.yearCode,
      startDate: formatDateForInput(row.startDate),
      endDate: formatDateForInput(row.endDate),
      status: row.status
    });

    onEditOpen();
  };

  const handleDelete = (row, index) => {
    setDeletingAcademicYear(row);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAcademicYear) return;

    setDeleting(true);
    try {
      const deleteUrl = `${API_ENDPOINTS.ACADEMIC_YEAR_BY_ID(deletingAcademicYear.id)}?permanent=true`;

      const response = await api.delete(deleteUrl);

      if (response.data.success) {
        await fetchAcademicYears();

        onDeleteClose();
        setDeletingAcademicYear(null);

        toast({
          title: 'Success',
          description: 'Academic year deleted successfully',
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
          description: 'Failed to delete academic year',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting academic year:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete academic year',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (row, index) => {
    setViewingAcademicYear(row);
    onViewOpen();
  };

  return (
    <Box p={0}>
      <Box p={0}>
        <Heading
          as="h1"
          fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}
          fontWeight="600"
          lineHeight="1.3"
          mb={4}
        >
          Academic Years Management
        </Heading>
        <Text
          fontSize={{ base: '0.685rem', sm: '0.685rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}
          color="gray.600"
          lineHeight="1.6"
          mb={4}
        >
          Manage academic years for your school. Add new academic years and manage existing ones.
        </Text>

        <ResponsiveTable
          data={academicYears}
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
          searchPlaceholder="Search by year code, status..."
          searchFields={['yearCode', 'status']}
          loading={loading}
          emptyMessage={loading ? "Loading academic years..." : "No academic years found. Click 'Add New Academic Year' to create one."}
          maxHeight="500px"
          stickyHeader={true}
          variant="simple"
          size="md"
        />
      </Box>

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
          <ModalHeader fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}>Add New Academic Year</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Year Code</FormLabel>
                <Input
                  value={formData.yearCode}
                  onChange={(e) => setFormData({ ...formData, yearCode: e.target.value })}
                  placeholder="e.g., 2024-25"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="current">Current</option>
                  <option value="completed">Completed</option>
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
              Add Academic Year
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
          <ModalHeader fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}>Edit Academic Year</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Year Code</FormLabel>
                <Input
                  value={editFormData.yearCode}
                  onChange={(e) => setEditFormData({ ...editFormData, yearCode: e.target.value })}
                  placeholder="e.g., 2024-25"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={editFormData.startDate}
                  onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  value={editFormData.endDate}
                  onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="current">Current</option>
                  <option value="completed">Completed</option>
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
              Update Academic Year
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
            <Heading fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} color="gray.700">Academic Year Information</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewingAcademicYear && (
              <VStack spacing={6} align="stretch">
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">📅</Text>
                    <Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">Basic Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Year Code</Text>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">{viewingAcademicYear.yearCode}</Text>
                    </Box>

                    <Box>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Start Date</Text>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">
                        {new Date(viewingAcademicYear.startDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>End Date</Text>
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">
                        {new Date(viewingAcademicYear.endDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </Text>
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
                      color={viewingAcademicYear.status === 'current' ? 'green.600' :
                        viewingAcademicYear.status === 'upcoming' ? 'blue.600' : 'gray.600'}
                      fontWeight="500"
                    >
                      {viewingAcademicYear.status}
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
                        {new Date(viewingAcademicYear.createdAt).toLocaleString('en-IN', {
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
                        {new Date(viewingAcademicYear.updatedAt).toLocaleString('en-IN', {
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
            <Heading fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} color="red.600">Delete Academic Year</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletingAcademicYear && (
              <VStack spacing={4} align="stretch">
                <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.700">
                  Are you sure you want to delete academic year <Text as="span" fontWeight="bold">{deletingAcademicYear.yearCode}</Text>?
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
    </Box>
  );
};

export default AcademicYearConfig;