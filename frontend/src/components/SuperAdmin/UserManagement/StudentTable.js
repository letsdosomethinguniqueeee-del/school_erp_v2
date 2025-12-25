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
  Flex,
  VStack
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';

const StudentTable = ({ 
  students,
  studentTotalPages,
  studentCurrentPage,
  handleStudentPageChange,
  handleEditStudent,
  handleDeleteStudent,
  handleViewStudent,
  studentFilterClass,
  setStudentFilterClass
}) => {
  return (
    <>
      <TableContainer overflowX="auto" w="100%" maxW="100%">
        <Table variant="simple" size="sm" w="100%" minW="1000px">
          <Thead bg="gray.100">
            <Tr>
              <Th 
                fontWeight="semibold" 
                color="gray.600" 
                fontSize={{ base: "11px", sm: "12px", md: "sm" }} 
                minW="120px" 
                borderBottom="2px solid" 
                borderColor="gray.200"
              >
                Student ID
              </Th>
              <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="150px" borderBottom="2px solid" borderColor="gray.200">Name</Th>
              <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="80px" borderBottom="2px solid" borderColor="gray.200">Roll No</Th>
              <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="80px" borderBottom="2px solid" borderColor="gray.200">Class</Th>
              <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="80px" borderBottom="2px solid" borderColor="gray.200">Section</Th>
              <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="100px" borderBottom="2px solid" borderColor="gray.200">Gender</Th>
              <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="120px" borderBottom="2px solid" borderColor="gray.200">Admission Year</Th>
              <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="80px" borderBottom="2px solid" borderColor="gray.200">Status</Th>
              <Th fontWeight="semibold" color="gray.600" fontSize={{ base: "11px", sm: "12px", md: "sm" }} minW="120px" borderBottom="2px solid" borderColor="gray.200">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.length === 0 ? (
              <Tr>
                <Td colSpan={9} textAlign="center" py={8}>
                  <VStack spacing={2}>
                    <Text color="gray.500">
                      {studentFilterClass !== 'all' 
                        ? `No students found in ${studentFilterClass} class.` 
                        : 'No student records found.'
                      }
                    </Text>
                    {studentFilterClass !== 'all' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setStudentFilterClass('all')}
                        colorScheme="blue"
                      >
                        Show All Classes
                      </Button>
                    )}
                  </VStack>
                </Td>
              </Tr>
            ) : (
              students.map(student => (
                <Tr key={student._id}>
                  <Td fontWeight="medium">{student.studentId}</Td>
                  <Td>{`${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`}</Td>
                  <Td>{student.rollNo || 'N/A'}</Td>
                  <Td>{student.currentStudyClass?.class_name || 'N/A'}</Td>
                  <Td>{student.currentSection?.section_name || 'N/A'}</Td>
                  <Td>
                    <Badge 
                      colorScheme={student.gender === 'Male' ? 'blue' : student.gender === 'Female' ? 'pink' : 'gray'} 
                      variant="solid"
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="semibold"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      {student.gender || 'N/A'}
                    </Badge>
                  </Td>
                  <Td>{student.admissionYear?.year_code || 'N/A'}</Td>
                  <Td>
                    <Badge 
                      colorScheme="green" 
                      variant="solid"
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="semibold"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Active
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="View student"
                        icon={<ViewIcon />}
                        size="sm"
                        colorScheme="green"
                        variant="outline"
                        onClick={() => handleViewStudent(student)}
                      />
                      <IconButton
                        aria-label="Edit student"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => handleEditStudent(student)}
                      />
                      <IconButton
                        aria-label="Delete student"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDeleteStudent(student)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      
      {/* Student Pagination Controls */}
      {studentTotalPages > 1 && (
        <Flex justify="flex-end" align="center" mt={4} gap={1}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStudentPageChange(1)}
            isDisabled={studentCurrentPage === 1}
            fontSize={{ base: "xs", sm: "sm" }}
          >
            First
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStudentPageChange(studentCurrentPage - 1)}
            isDisabled={studentCurrentPage === 1}
            fontSize={{ base: "xs", sm: "sm" }}
          >
            Previous
          </Button>
          <Text fontSize={{ base: "10px", sm: "xs" }} color="gray.600" px={1} whiteSpace="nowrap">
            Page {studentCurrentPage} of {studentTotalPages}
          </Text>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStudentPageChange(studentCurrentPage + 1)}
            isDisabled={studentCurrentPage === studentTotalPages}
            fontSize={{ base: "xs", sm: "sm" }}
          >
            Next
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStudentPageChange(studentTotalPages)}
            isDisabled={studentCurrentPage === studentTotalPages}
            fontSize={{ base: "xs", sm: "sm" }}
          >
            Last
          </Button>
        </Flex>
      )}
    </>
  );
};

export default StudentTable;
