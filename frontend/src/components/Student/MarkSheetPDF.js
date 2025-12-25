import React, { useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Divider,
  HStack,
  VStack,
  Grid,
  GridItem,
  useToast
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MarkSheetPDF = ({ isOpen, onClose, studentData, academicYear, results }) => {
  const markSheetRef = useRef();
  const toast = useToast();

  const downloadPDF = async () => {
    try {
      const element = markSheetRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`MarkSheet_${studentData.name}_${academicYear?.year_name}.pdf`);

      toast({
        title: 'Success',
        description: 'Mark sheet downloaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const calculateOverallStats = () => {
    if (!results || !results.subjects || results.subjects.length === 0) {
      return { totalMarks: 0, obtainedMarks: 0, percentage: 0, grade: 'N/A', result: 'N/A' };
    }

    const totalMarks = results.subjects.reduce((sum, subject) => sum + subject.max_marks, 0);
    const obtainedMarks = results.subjects.reduce((sum, subject) => 
      subject.is_absent ? sum : sum + subject.marks_obtained, 0);
    const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : 0;
    
    let grade = 'F';
    if (percentage >= 90) grade = 'A+ (Outstanding)';
    else if (percentage >= 80) grade = 'A (Excellent)';
    else if (percentage >= 70) grade = 'B+ (Very Good)';
    else if (percentage >= 60) grade = 'B (Good)';
    else if (percentage >= 50) grade = 'C (Average)';
    else if (percentage >= 40) grade = 'D (Pass)';

    const hasAbsent = results.subjects.some(s => s.is_absent);
    const hasFailed = results.subjects.some(s => !s.is_absent && ((s.marks_obtained / s.max_marks) * 100) < 40);
    const result = hasAbsent ? 'Absent' : hasFailed ? 'Failed' : 'Passed';

    return { totalMarks, obtainedMarks, percentage, grade, result };
  };

  const stats = calculateOverallStats();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalHeader>
          <Flex justify="space-between" align="center">
            <Text>Annual Mark Sheet</Text>
            <Button leftIcon={<DownloadIcon />} colorScheme="blue" onClick={downloadPDF}>
              Download PDF
            </Button>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box ref={markSheetRef} bg="white" p={8}>
            {/* Header Section with Decorative Border */}
            <Box
              borderWidth="4px"
              borderColor="blue.600"
              borderRadius="lg"
              p={6}
              mb={6}
              bgGradient="linear(to-r, blue.50, purple.50)"
              position="relative"
            >
              {/* Decorative Corners */}
              <Box
                position="absolute"
                top="-2px"
                left="-2px"
                w="30px"
                h="30px"
                borderTop="4px solid"
                borderLeft="4px solid"
                borderColor="gold"
              />
              <Box
                position="absolute"
                top="-2px"
                right="-2px"
                w="30px"
                h="30px"
                borderTop="4px solid"
                borderRight="4px solid"
                borderColor="gold"
              />
              <Box
                position="absolute"
                bottom="-2px"
                left="-2px"
                w="30px"
                h="30px"
                borderBottom="4px solid"
                borderLeft="4px solid"
                borderColor="gold"
              />
              <Box
                position="absolute"
                bottom="-2px"
                right="-2px"
                w="30px"
                h="30px"
                borderBottom="4px solid"
                borderRight="4px solid"
                borderColor="gold"
              />

              <VStack spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.800" textAlign="center">
                  🎓 SCHOOL NAME
                </Text>
                <Text fontSize="lg" color="blue.700" textAlign="center">
                  Academic Excellence & Character Building
                </Text>
                <Divider borderColor="blue.400" />
                <Text fontSize="xl" fontWeight="bold" color="purple.700" textAlign="center">
                  ANNUAL MARK SHEET
                </Text>
                <Text fontSize="md" color="gray.700">
                  Academic Year: {academicYear?.year_name}
                </Text>
              </VStack>
            </Box>

            {/* Student Information */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
              <GridItem>
                <Box bg="blue.50" p={4} borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <Text fontWeight="bold" color="blue.700">Student Name:</Text>
                      <Text>{studentData.name || 'N/A'}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold" color="blue.700">Student ID:</Text>
                      <Text>{studentData.student_id || 'N/A'}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold" color="blue.700">Class:</Text>
                      <Text>{results?.class_name || 'N/A'}</Text>
                    </HStack>
                  </VStack>
                </Box>
              </GridItem>
              <GridItem>
                <Box bg="purple.50" p={4} borderRadius="md" borderLeft="4px solid" borderColor="purple.500">
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <Text fontWeight="bold" color="purple.700">Section:</Text>
                      <Text>{results?.section_name || 'N/A'}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold" color="purple.700">Roll Number:</Text>
                      <Text>{studentData.roll_number || 'N/A'}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold" color="purple.700">Date of Issue:</Text>
                      <Text>{new Date().toLocaleDateString()}</Text>
                    </HStack>
                  </VStack>
                </Box>
              </GridItem>
            </Grid>

            {/* Subject-wise Marks Table */}
            <Box mb={6} borderWidth="2px" borderColor="gray.300" borderRadius="md" overflow="hidden">
              <Table variant="simple" size="sm">
                <Thead bg="blue.600">
                  <Tr>
                    <Th color="white" py={3}>S.No</Th>
                    <Th color="white">Subject</Th>
                    <Th color="white" isNumeric>Max Marks</Th>
                    <Th color="white" isNumeric>Marks Obtained</Th>
                    <Th color="white" isNumeric>Percentage</Th>
                    <Th color="white">Grade</Th>
                    <Th color="white">Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {results?.subjects?.map((subject, index) => {
                    const percentage = subject.is_absent ? 0 : ((subject.marks_obtained / subject.max_marks) * 100).toFixed(2);
                    const grade = subject.is_absent ? 'F' :
                      percentage >= 90 ? 'A+' :
                      percentage >= 80 ? 'A' :
                      percentage >= 70 ? 'B+' :
                      percentage >= 60 ? 'B' :
                      percentage >= 50 ? 'C' :
                      percentage >= 40 ? 'D' : 'F';
                    
                    return (
                      <Tr key={index} bg={index % 2 === 0 ? 'gray.50' : 'white'}>
                        <Td>{index + 1}</Td>
                        <Td fontWeight="medium">{subject.subject_name}</Td>
                        <Td isNumeric>{subject.max_marks}</Td>
                        <Td isNumeric>
                          {subject.is_absent ? (
                            <Badge colorScheme="red">AB</Badge>
                          ) : (
                            subject.marks_obtained
                          )}
                        </Td>
                        <Td isNumeric>{subject.is_absent ? '-' : `${percentage}%`}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              grade === 'A+' || grade === 'A' ? 'green' :
                              grade === 'B+' || grade === 'B' ? 'blue' :
                              grade === 'C' ? 'yellow' : 'red'
                            }
                          >
                            {grade}
                          </Badge>
                        </Td>
                        <Td>
                          {subject.is_absent ? (
                            <Badge colorScheme="red">Absent</Badge>
                          ) : percentage >= 40 ? (
                            <Badge colorScheme="green">Pass</Badge>
                          ) : (
                            <Badge colorScheme="red">Fail</Badge>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                  
                  {/* Total Row */}
                  <Tr bg="blue.100" fontWeight="bold">
                    <Td colSpan={2} textAlign="right">TOTAL</Td>
                    <Td isNumeric>{stats.totalMarks}</Td>
                    <Td isNumeric>{stats.obtainedMarks}</Td>
                    <Td isNumeric>{stats.percentage}%</Td>
                    <Td colSpan={2}></Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>

            {/* Overall Performance Summary */}
            <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
              <GridItem>
                <Box
                  bg="green.50"
                  p={4}
                  borderRadius="md"
                  borderTop="4px solid"
                  borderColor="green.500"
                  textAlign="center"
                >
                  <Text fontSize="sm" color="green.700" fontWeight="bold">Overall Percentage</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="green.600">{stats.percentage}%</Text>
                </Box>
              </GridItem>
              <GridItem>
                <Box
                  bg="blue.50"
                  p={4}
                  borderRadius="md"
                  borderTop="4px solid"
                  borderColor="blue.500"
                  textAlign="center"
                >
                  <Text fontSize="sm" color="blue.700" fontWeight="bold">Overall Grade</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">{stats.grade}</Text>
                </Box>
              </GridItem>
              <GridItem>
                <Box
                  bg={stats.result === 'Passed' ? 'green.50' : 'red.50'}
                  p={4}
                  borderRadius="md"
                  borderTop="4px solid"
                  borderColor={stats.result === 'Passed' ? 'green.500' : 'red.500'}
                  textAlign="center"
                >
                  <Text fontSize="sm" color={stats.result === 'Passed' ? 'green.700' : 'red.700'} fontWeight="bold">Result</Text>
                  <Text fontSize="3xl" fontWeight="bold" color={stats.result === 'Passed' ? 'green.600' : 'red.600'}>
                    {stats.result === 'Passed' ? '✓ PASSED' : stats.result === 'Failed' ? '✗ FAILED' : 'ABSENT'}
                  </Text>
                </Box>
              </GridItem>
            </Grid>

            {/* Grading Scale */}
            <Box bg="gray.50" p={4} borderRadius="md" mb={6}>
              <Text fontWeight="bold" mb={2} color="gray.700">Grading Scale:</Text>
              <HStack spacing={4} flexWrap="wrap">
                <Badge colorScheme="green">A+ (90-100%)</Badge>
                <Badge colorScheme="green">A (80-89%)</Badge>
                <Badge colorScheme="blue">B+ (70-79%)</Badge>
                <Badge colorScheme="blue">B (60-69%)</Badge>
                <Badge colorScheme="yellow">C (50-59%)</Badge>
                <Badge colorScheme="orange">D (40-49%)</Badge>
                <Badge colorScheme="red">F (&lt;40%)</Badge>
              </HStack>
            </Box>

            {/* Signature Section */}
            <Grid templateColumns="repeat(3, 1fr)" gap={8} mt={8}>
              <GridItem>
                <VStack align="center">
                  <Divider borderColor="gray.400" w="80%" />
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">Class Teacher</Text>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="center">
                  <Divider borderColor="gray.400" w="80%" />
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">Principal</Text>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="center">
                  <Divider borderColor="gray.400" w="80%" />
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">Parent/Guardian</Text>
                </VStack>
              </GridItem>
            </Grid>

            {/* Footer */}
            <Box mt={8} pt={4} borderTop="2px solid" borderColor="blue.200" textAlign="center">
              <Text fontSize="xs" color="gray.600">
                This is a computer-generated mark sheet. Valid without signature.
              </Text>
              <Text fontSize="xs" color="gray.600" mt={1}>
                © {new Date().getFullYear()} School ERP System. All rights reserved.
              </Text>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MarkSheetPDF;
