import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  HStack,
  Text,
  TableContainer,
  Button,
  Flex
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons';

const UserTable = ({ 
  users, 
  currentUsers, 
  totalPages, 
  currentPage, 
  setCurrentPage,
  getRoleColor,
  getRoleDisplayName,
  handleEditUser,
  handleDeleteUser,
  handleToggleUserStatus
}) => {
  return (
    <>
      <TableContainer overflowX="auto" w="100%" maxW="100%">
        <Table variant="simple" size="sm" w="100%" minW="600px">
          <Thead bg="gray.50">
            <Tr>
              <Th minW="120px">User ID</Th>
              <Th minW="100px">Role</Th>
              <Th minW="80px">Status</Th>
              <Th minW="120px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentUsers.length === 0 ? (
              <Tr>
                <Td colSpan={4} textAlign="center" py={8}>
                  <Text color="gray.500">No users found.</Text>
                </Td>
              </Tr>
            ) : (
              currentUsers.map(user => (
                <Tr key={user._id}>
                  <Td fontWeight="medium">{user.userId}</Td>
                  <Td>
                    <Badge 
                      colorScheme={getRoleColor(user.role)} 
                      variant="solid"
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="semibold"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge 
                      colorScheme={user.isActive ? 'green' : 'red'} 
                      variant="solid"
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="semibold"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit user"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEditUser(user)}
                      />
                      <IconButton
                        aria-label={user.isActive ? 'Deactivate' : 'Activate'}
                        icon={user.isActive ? <LockIcon /> : <UnlockIcon />}
                        size="sm"
                        colorScheme={user.isActive ? 'orange' : 'green'}
                        variant="ghost"
                        onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                      />
                      <IconButton
                        aria-label="Delete user"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user._id, user.role)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Flex justify="flex-end" align="center" mt={4}>
          <HStack spacing={2}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              color={currentPage === 1 ? "gray.400" : "gray.600"}
              bg="white"
              borderColor="gray.200"
              _hover={currentPage === 1 ? {} : { bg: "gray.50" }}
              _disabled={{ 
                color: "gray.400", 
                cursor: "not-allowed",
                bg: "white",
                borderColor: "gray.200"
              }}
            >
              First
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              color={currentPage === 1 ? "gray.400" : "gray.600"}
              bg="white"
              borderColor="gray.200"
              _hover={currentPage === 1 ? {} : { bg: "gray.50" }}
              _disabled={{ 
                color: "gray.400", 
                cursor: "not-allowed",
                bg: "white",
                borderColor: "gray.200"
              }}
            >
              Previous
            </Button>
            <Text fontSize="sm" color="gray.600" px={2} fontWeight="medium">
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              color={currentPage === totalPages ? "gray.400" : "gray.600"}
              bg="white"
              borderColor="gray.200"
              _hover={currentPage === totalPages ? {} : { bg: "gray.50" }}
              _disabled={{ 
                color: "gray.400", 
                cursor: "not-allowed",
                bg: "white",
                borderColor: "gray.200"
              }}
            >
              Next
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              color={currentPage === totalPages ? "gray.400" : "gray.600"}
              bg="white"
              borderColor="gray.200"
              _hover={currentPage === totalPages ? {} : { bg: "gray.50" }}
              _disabled={{ 
                color: "gray.400", 
                cursor: "not-allowed",
                bg: "white",
                borderColor: "gray.200"
              }}
            >
              Last
            </Button>
          </HStack>
        </Flex>
      )}
    </>
  );
};

export default UserTable;
