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
  InputGroup,
  InputRightElement,
  IconButton,
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
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import ResponsiveTable from '../../Common/ResponsiveTable';
import api from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';
import { ROLE_DISPLAY_NAMES, USER_ROLES } from '../../../constants/roles';

const SystemUsers = ({ modalType, refreshTrigger }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    password: '',
    role: '',
    isActive: true
  });

  // State for system users data
  const [systemUsers, setSystemUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    userId: '',
    name: '',
    password: '',
    role: '',
    isActive: true
  });

  // View modal state
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [viewingUser, setViewingUser] = useState(null);

  // Delete modal state
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Fetch users from API
  const fetchUsers = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await api.get(API_ENDPOINTS.USERS);

      if (response.data.users) {
        // Transform backend data to frontend format
        const transformedData = response.data.users.map(item => ({
          id: item._id,
          userId: item.userId,
          name: item.name || '',
          role: item.role,
          isActive: item.isActive !== undefined ? item.isActive : true,
          lastLogin: item.lastLogin,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));

        setSystemUsers(transformedData);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch system users',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching system users:', error);
      
      // Handle specific error cases
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
          description: 'You do not have permission to access system users',
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
          description: error.response?.data?.message || 'Failed to fetch system users',
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
  }, [toast]);

  // Load users on component mount
  useEffect(() => {
    fetchUsers(true); // Show loading only on initial load
  }, [fetchUsers]);

  // Refresh System Users when Student/Teacher/Staff records change
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchUsers(); // Refresh without showing loading spinner
    }
  }, [refreshTrigger, fetchUsers]);

  // Watch for modal trigger from parent
  useEffect(() => {
    if (modalType === 'user') {
      onOpen();
    }
  }, [modalType, onOpen]);

  // Reset password visibility when modals close
  useEffect(() => {
    if (!isOpen) {
      setShowPassword(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isEditOpen) {
      setShowEditPassword(false);
    }
  }, [isEditOpen]);

  // Table columns configuration (memoized for performance)
  const columns = useMemo(() => [
    {
      key: 'userId',
      label: 'User ID',
      minWidth: '120px'
    },
    {
      key: 'name',
      label: 'Name',
      minWidth: '150px'
    },
    {
      key: 'role',
      label: 'Role',
      minWidth: '120px',
      render: (value) => {
        const getRoleColor = (role) => {
          switch(role) {
            case 'super-admin': return 'purple';
            case 'admin': return 'blue';
            case 'teacher': return 'orange';
            case 'student': return 'green';
            case 'parent': return 'teal';
            case 'staff': return 'gray';
            default: return 'blue';
          }
        };
        const displayName = ROLE_DISPLAY_NAMES[value] || value;
        return (
          <Badge 
            colorScheme={getRoleColor(value)} 
            variant="subtle"
            px="8px"
            py="2px"
            borderRadius="12px"
            fontSize="xs"
            fontWeight="500"
          >
            {displayName}
          </Badge>
        );
      }
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
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      minWidth: '120px',
      type: 'datetime'
    }
  ], []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.userId || !formData.userId.trim()) {
      toast({
        title: 'Validation Error',
        description: 'User ID is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.userId.trim().length > 50) {
      toast({
        title: 'Validation Error',
        description: 'User ID must be less than 50 characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.name || !formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Full Name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.name.trim().length > 100) {
      toast({
        title: 'Validation Error',
        description: 'Full Name must be less than 100 characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters long',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.password.length > 100) {
      toast({
        title: 'Validation Error',
        description: 'Password must be less than 100 characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.role) {
      toast({
        title: 'Validation Error',
        description: 'Role is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post(API_ENDPOINTS.CREATE_USER, {
        userId: formData.userId.trim(),
        name: formData.name.trim(),
        password: formData.password,
        role: formData.role,
        isActive: formData.isActive
      });

      if (response.data.message || response.status === 201) {
        await fetchUsers();

        toast({
          title: 'Success',
          description: 'System user created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onClose();
        setFormData({ userId: '', name: '', password: '', role: '', isActive: true });
        setShowPassword(false);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create system user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error creating system user:', error);
      
      // Handle specific error cases
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
          description: 'You do not have permission to create users',
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
          description: error.response?.data?.message || 'Failed to create system user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!editingUser || !editingUser.id) {
      toast({
        title: 'Error',
        description: 'User data is missing. Please refresh and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!editFormData.userId || !editFormData.userId.trim()) {
      toast({
        title: 'Validation Error',
        description: 'User ID is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (editFormData.userId.trim().length > 50) {
      toast({
        title: 'Validation Error',
        description: 'User ID must be less than 50 characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!editFormData.name || !editFormData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Full Name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (editFormData.name.trim().length > 100) {
      toast({
        title: 'Validation Error',
        description: 'Full Name must be less than 100 characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate password if provided
    if (editFormData.password && editFormData.password.trim() !== '') {
      if (editFormData.password.length < 6) {
        toast({
          title: 'Validation Error',
          description: 'Password must be at least 6 characters long',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (editFormData.password.length > 100) {
        toast({
          title: 'Validation Error',
          description: 'Password must be less than 100 characters',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    if (!editFormData.role) {
      toast({
        title: 'Validation Error',
        description: 'Role is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);

    try {
      const updateData = {
        userId: editFormData.userId.trim(),
        name: editFormData.name.trim(),
        role: editFormData.role,
        isActive: editFormData.isActive
      };

      // Only include password if it's provided
      if (editFormData.password && editFormData.password.trim() !== '') {
        updateData.password = editFormData.password;
      }

      const response = await api.put(API_ENDPOINTS.UPDATE_USER(editingUser.id), updateData);

      if (response.data.message || response.status === 200) {
        await fetchUsers();

        toast({
          title: 'Success',
          description: 'System user updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onEditClose();
        setEditFormData({ userId: '', name: '', password: '', role: '', isActive: true });
        setEditingUser(null);
        setShowEditPassword(false);

      } else {
        toast({
          title: 'Error',
          description: 'Failed to update system user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating system user:', error);
      
      // Handle specific error cases
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
          description: 'You do not have permission to update users',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 404) {
        toast({
          title: 'User Not Found',
          description: 'The user you are trying to update no longer exists',
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
          description: error.response?.data?.message || 'Failed to update system user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (row, index) => {
    setEditingUser(row);

    setEditFormData({
      userId: row.userId,
      name: row.name,
      password: '', // Leave blank - super-admin can set new password
      role: row.role,
      isActive: row.isActive
    });

    onEditOpen();
  };

  const handleDelete = (row, index) => {
    setDeletingUser(row);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    setDeleting(true);
    try {
      const response = await api.delete(API_ENDPOINTS.DELETE_USER(deletingUser.id));

      if (response.data.message || response.status === 200) {
        await fetchUsers();

        onDeleteClose();
        setDeletingUser(null);

        toast({
          title: 'Success',
          description: 'System user deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete system user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting system user:', error);
      
      // Handle specific error cases
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
          description: 'You do not have permission to delete users',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.response?.status === 404) {
        toast({
          title: 'User Not Found',
          description: 'The user you are trying to delete no longer exists',
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
          description: error.response?.data?.message || 'Failed to delete system user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (row, index) => {
    setViewingUser(row);
    onViewOpen();
  };

  // Role options for dropdown (memoized for performance)
  const roleOptions = useMemo(() => [
    { value: USER_ROLES.SUPER_ADMIN, label: ROLE_DISPLAY_NAMES[USER_ROLES.SUPER_ADMIN] },
    { value: USER_ROLES.ADMIN, label: ROLE_DISPLAY_NAMES[USER_ROLES.ADMIN] },
    { value: USER_ROLES.TEACHER, label: ROLE_DISPLAY_NAMES[USER_ROLES.TEACHER] },
    { value: USER_ROLES.STUDENT, label: ROLE_DISPLAY_NAMES[USER_ROLES.STUDENT] },
    { value: USER_ROLES.PARENT, label: ROLE_DISPLAY_NAMES[USER_ROLES.PARENT] },
    { value: USER_ROLES.STAFF, label: ROLE_DISPLAY_NAMES[USER_ROLES.STAFF] }
  ], []);

  return (
    <>
      <Box p={4}>
        <Heading size="md" mb={4}>System Users Management</Heading>
        <Text mb={4} color="gray.600">
          Manage all users in the system - Super Admins, Admins, Students, Parents, Teachers, and Staff with full access control.
        </Text>

        <ResponsiveTable
          data={systemUsers}
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
          searchPlaceholder="Search by user ID, name, role..."
          searchFields={['userId', 'name', 'role']}
          loading={loading}
          emptyMessage={loading ? "Loading system users..." : "No system users found. Click 'Add New System User' to create one."}
          maxHeight="500px"
          stickyHeader={true}
          variant="simple"
          size="md"
        />

      </Box>

      {/* Add System User Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setFormData({ userId: '', name: '', password: '', role: '', isActive: true });
          setShowPassword(false);
        }}
        size="md"
        scrollBehavior='inside'
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader>Add New System User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>User ID</FormLabel>
                <Input
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="e.g., admin001, superadmin001"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., John Admin, Jane Manager"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password (min 6 characters)"
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      variant="ghost"
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Select role"
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.isActive ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => {
              onClose();
              setFormData({ userId: '', name: '', password: '', role: '', isActive: true });
              setShowPassword(false);
            }}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={submitting}
              loadingText="Creating..."
            >
              Add System User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit System User Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setEditFormData({ userId: '', name: '', password: '', role: '', isActive: true });
          setEditingUser(null);
          setShowEditPassword(false);
        }}
        size="md"
        scrollBehavior='inside'
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader>Edit System User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>User ID</FormLabel>
                <Input
                  value={editFormData.userId}
                  onChange={(e) => setEditFormData({ ...editFormData, userId: e.target.value })}
                  placeholder="e.g., admin001, superadmin001"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder="e.g., John Admin, Jane Manager"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Set New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    placeholder="Enter new password..."
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      variant="ghost"
                      icon={showEditPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      aria-label={showEditPassword ? 'Hide password' : 'Show password'}
                    />
                  </InputRightElement>
                </InputGroup>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Leave blank to keep the current password unchanged
                </Text>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  placeholder="Select role"
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={editFormData.isActive ? 'true' : 'false'}
                  onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.value === 'true' })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => {
              onEditClose();
              setEditFormData({ userId: '', name: '', password: '', role: '', isActive: true });
              setEditingUser(null);
              setShowEditPassword(false);
            }}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleEditSubmit}
              isLoading={submitting}
              loadingText="Updating..."
            >
              Update System User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View System User Modal */}
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
            <Heading size="md" color="gray.700">System User Information</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewingUser && (
              <VStack spacing={6} align="stretch">
                <Box>
                  <HStack spacing={2} mb={4}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">👤</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">Basic Information</Text>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>User ID</Text>
                      <Text fontSize="md" color="gray.800">{viewingUser.userId}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Full Name</Text>
                      <Text fontSize="md" color="gray.800">{viewingUser.name || 'N/A'}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Role</Text>
                      <Badge 
                        colorScheme={viewingUser.role === 'super-admin' ? 'purple' : 'blue'} 
                        variant="subtle"
                        px="8px"
                        py="2px"
                        borderRadius="12px"
                        fontSize="sm"
                        fontWeight="500"
                      >
                        {ROLE_DISPLAY_NAMES[viewingUser.role] || viewingUser.role}
                      </Badge>
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
                    <Badge 
                      colorScheme={viewingUser.isActive ? 'green' : 'red'} 
                      variant="subtle"
                      px="8px"
                      py="2px"
                      borderRadius="12px"
                      fontSize="sm"
                      fontWeight="500"
                    >
                      {viewingUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
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
                        {(() => {
                          try {
                            if (!viewingUser.createdAt) return 'N/A';
                            const date = new Date(viewingUser.createdAt);
                            if (isNaN(date.getTime())) return 'Invalid Date';
                            return date.toLocaleString('en-IN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            }).replace(/AM|PM/g, match => match.toUpperCase()).replace(',', '');
                          } catch (error) {
                            return 'Invalid Date';
                          }
                        })()}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Updated At</Text>
                      <Text fontSize="md" color="gray.800">
                        {(() => {
                          try {
                            if (!viewingUser.updatedAt) return 'N/A';
                            const date = new Date(viewingUser.updatedAt);
                            if (isNaN(date.getTime())) return 'Invalid Date';
                            return date.toLocaleString('en-IN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            }).replace(/AM|PM/g, match => match.toUpperCase()).replace(',', '');
                          } catch (error) {
                            return 'Invalid Date';
                          }
                        })()}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Last Login</Text>
                      <Text fontSize="md" color="gray.800">
                        {(() => {
                          try {
                            if (!viewingUser.lastLogin) return 'Never';
                            const date = new Date(viewingUser.lastLogin);
                            if (isNaN(date.getTime())) return 'Invalid Date';
                            return date.toLocaleString('en-IN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            }).replace(/AM|PM/g, match => match.toUpperCase()).replace(',', '');
                          } catch (error) {
                            return 'Invalid Date';
                          }
                        })()}
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
            <Heading size="md" color="red.600">Delete System User</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletingUser && (
              <VStack spacing={4} align="stretch">
                <Text fontSize="md" color="gray.700">
                  Are you sure you want to delete system user <Text as="span" fontWeight="bold">{deletingUser.name || deletingUser.userId}</Text> ({deletingUser.userId})?
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

export default SystemUsers;