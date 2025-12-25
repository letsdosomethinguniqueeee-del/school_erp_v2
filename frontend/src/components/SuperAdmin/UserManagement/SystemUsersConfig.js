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

const SystemUsersConfig = ({ modalType, onDataChange }) => {
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
  const [loading, setLoading] = useState(false);
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

  // Dummy data for demonstration - All user types
  const dummySystemUsers = [
    // Super Admins
    {
      id: '1',
      userId: 'super001',
      name: 'John Super Admin',
      role: 'Super Admin',
      isActive: true,
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-20T14:45:00'),
      lastLogin: new Date('2024-01-21T09:15:00')
    },
    {
      id: '2',
      userId: 'super002',
      name: 'Jane Director',
      role: 'Super Admin',
      isActive: true,
      createdAt: new Date('2024-01-16T09:15:00'),
      updatedAt: new Date('2024-01-18T11:20:00'),
      lastLogin: new Date('2024-01-21T08:30:00')
    },
    // Regular Admins
    {
      id: '3',
      userId: 'admin001',
      name: 'Mike Manager',
      role: 'Admin',
      isActive: true,
      createdAt: new Date('2024-01-17T13:20:00'),
      updatedAt: new Date('2024-01-19T16:30:00'),
      lastLogin: new Date('2024-01-20T14:20:00')
    },
    {
      id: '4',
      userId: 'admin002',
      name: 'Sarah Supervisor',
      role: 'Admin',
      isActive: false,
      createdAt: new Date('2024-01-18T08:45:00'),
      updatedAt: new Date('2024-01-21T12:15:00'),
      lastLogin: new Date('2024-01-19T16:45:00')
    },
    // Students
    {
      id: '5',
      userId: 'student001',
      name: 'Alice Student',
      role: 'Student',
      isActive: true,
      createdAt: new Date('2024-01-19T10:00:00'),
      updatedAt: new Date('2024-01-20T15:30:00'),
      lastLogin: new Date('2024-01-21T07:45:00')
    },
    {
      id: '6',
      userId: 'student002',
      name: 'Bob Student',
      role: 'Student',
      isActive: true,
      createdAt: new Date('2024-01-19T11:15:00'),
      updatedAt: new Date('2024-01-20T16:00:00'),
      lastLogin: new Date('2024-01-21T08:15:00')
    },
    {
      id: '7',
      userId: 'student003',
      name: 'Carol Student',
      role: 'Student',
      isActive: false,
      createdAt: new Date('2024-01-19T12:30:00'),
      updatedAt: new Date('2024-01-20T17:15:00'),
      lastLogin: new Date('2024-01-20T09:30:00')
    },
    // Teachers
    {
      id: '8',
      userId: 'teacher001',
      name: 'Dr. Smith Teacher',
      role: 'Teacher',
      isActive: true,
      createdAt: new Date('2024-01-20T09:00:00'),
      updatedAt: new Date('2024-01-21T10:30:00'),
      lastLogin: new Date('2024-01-21T09:00:00')
    },
    {
      id: '9',
      userId: 'teacher002',
      name: 'Ms. Johnson Teacher',
      role: 'Teacher',
      isActive: true,
      createdAt: new Date('2024-01-20T10:15:00'),
      updatedAt: new Date('2024-01-21T11:45:00'),
      lastLogin: new Date('2024-01-21T08:45:00')
    },
    {
      id: '10',
      userId: 'teacher003',
      name: 'Prof. Brown Teacher',
      role: 'Teacher',
      isActive: false,
      createdAt: new Date('2024-01-20T11:30:00'),
      updatedAt: new Date('2024-01-21T12:00:00'),
      lastLogin: new Date('2024-01-20T15:20:00')
    },
    // Staff
    {
      id: '11',
      userId: 'staff001',
      name: 'Mike Staff',
      role: 'Staff',
      isActive: true,
      createdAt: new Date('2024-01-20T13:00:00'),
      updatedAt: new Date('2024-01-21T13:30:00'),
      lastLogin: new Date('2024-01-21T10:15:00')
    },
    {
      id: '12',
      userId: 'staff002',
      name: 'Sarah Staff',
      role: 'Staff',
      isActive: true,
      createdAt: new Date('2024-01-20T14:15:00'),
      updatedAt: new Date('2024-01-21T14:45:00'),
      lastLogin: new Date('2024-01-21T11:30:00')
    },
    {
      id: '13',
      userId: 'staff003',
      name: 'David Staff',
      role: 'Staff',
      isActive: false,
      createdAt: new Date('2024-01-20T15:30:00'),
      updatedAt: new Date('2024-01-21T15:00:00'),
      lastLogin: new Date('2024-01-20T16:45:00')
    }
  ];

  // Load users from API
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(API_ENDPOINTS.USERS.GET_ALL);
      setSystemUsers(response.data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Fallback to dummy data if API fails
      setSystemUsers(dummySystemUsers);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Table columns configuration - Exact requirements
  const columns = [
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
            case 'Super Admin': return 'purple';
            case 'Admin': return 'blue';
            case 'Student': return 'green';
            case 'Teacher': return 'orange';
            case 'Staff': return 'gray';
            default: return 'blue';
          }
        };
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
            {value}
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
  ];

  // Watch for modal trigger from parent
  useEffect(() => {
    if (modalType === 'system-users') {
      onOpen();
    }
  }, [modalType, onOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post(API_ENDPOINTS.USERS.CREATE, {
        userId: formData.userId,
        name: formData.name,
        password: formData.password,
        role: formData.role,
        isActive: formData.isActive
      });

      toast({
        title: 'Success',
        description: 'System user created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reload users
      await loadUsers();

      if (onDataChange) {
        onDataChange();
      }
      onClose();
      setFormData({ userId: '', name: '', password: '', role: '', isActive: true });
    } catch (error) {
      console.error('Error creating system user:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create system user',
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
      const updateData = {
        userId: editFormData.userId,
        name: editFormData.name,
        role: editFormData.role,
        isActive: editFormData.isActive
      };

      // Only include password if it's provided
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      await api.put(`${API_ENDPOINTS.USERS.UPDATE}/${editingUser._id}`, updateData);

      toast({
        title: 'Success',
        description: 'System user updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reload users
      await loadUsers();

      if (onDataChange) {
        onDataChange();
      }
      
      onEditClose();
      setEditFormData({ userId: '', name: '', password: '', role: '', isActive: true });
      setEditingUser(null);

    } catch (error) {
      console.error('Error updating system user:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update system user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (row, index) => {
    setEditingUser(row);

    setEditFormData({
      userId: row.userId,
      name: row.name,
      password: '', // Don't show current password for security
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
      await api.delete(`${API_ENDPOINTS.USERS.DELETE}/${deletingUser._id}`);

      toast({
        title: 'Success',
        description: 'System user deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reload users
      await loadUsers();

      if (onDataChange) {
        onDataChange();
      }

      onDeleteClose();
      setDeletingUser(null);

    } catch (error) {
      console.error('Error deleting system user:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete system user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (row, index) => {
    setViewingUser(row);
    onViewOpen();
  };

  return (
    <>
      {/* System Users Table */}
      <Box p={4}>
        <Heading size="md" mb={4}>System Users Management</Heading>
        <Text mb={4} color="gray.600">
          Manage all users in the system - Super Admins, Admins, Students, Teachers, and Staff with full access control.
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
        onClose={onClose} 
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
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Select role"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Staff">Staff</option>
                </Select>
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
              Add System User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit System User Modal */}
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
                <FormLabel>Password (leave blank to keep current)</FormLabel>
                <Input
                  type="password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  placeholder="Enter new password"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  placeholder="Select role"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Staff">Staff</option>
                </Select>
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
                      <Text fontSize="md" color="gray.800">{viewingUser.name}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Role</Text>
                      <Badge 
                        colorScheme={viewingUser.role === 'Super Admin' ? 'purple' : 'blue'} 
                        variant="subtle"
                        px="8px"
                        py="2px"
                        borderRadius="12px"
                        fontSize="sm"
                        fontWeight="500"
                      >
                        {viewingUser.role}
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
                        {new Date(viewingUser.createdAt).toLocaleString('en-IN', {
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
                        {new Date(viewingUser.updatedAt).toLocaleString('en-IN', {
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
                      <Text fontSize="sm" fontWeight="600" color="gray.600" mb={1}>Last Login</Text>
                      <Text fontSize="md" color="gray.800">
                        {viewingUser.lastLogin ? new Date(viewingUser.lastLogin).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        }).replace(/AM|PM/g, match => match.toUpperCase()).replace(',', '') : 'Never'}
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
                  Are you sure you want to delete system user <Text as="span" fontWeight="bold">{deletingUser.name}</Text> ({deletingUser.userId})?
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

export default SystemUsersConfig;