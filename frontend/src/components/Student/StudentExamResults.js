import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  HStack,
  VStack,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Spinner,
  Center,
  Divider,
  Icon,
  Flex
} from '@chakra-ui/react';
import { DownloadIcon, CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import axios from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/api';
import MarkSheetPDF from './MarkSheetPDF';

const StudentExamResults = ({ user }) => {
  const toast = useToast();
  
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [publishedExams, setPublishedExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [examResults, setExamResults] = useState([]);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMarkSheet, setShowMarkSheet] = useState(false);

  // Fetch classes on mount
  useEffect(() => {
    fetchStudentClasses();
  }, []);

  // Fetch published exams when class changes
  useEffect(() => {
    if (selectedClass) {
      // Clear previous data when class changes
      setSelectedExam('');
      setExamResults([]);
      setShowMarkSheet(false);
      
      fetchPublishedExams();
      checkFinalResult();
    }
  }, [selectedClass]);

  // Fetch exam results when exam is selected
  useEffect(() => {
    if (selectedExam && selectedClass) {
      fetchExamResults();
    }
  }, [selectedExam]);

  const fetchStudentClasses = async () => {
    try {
      console.log('Current user:', user);
      console.log('Student ID being sent:', user.userId);
      
      // Fetch classes the student has studied in
      const response = await axios.get(API_ENDPOINTS.STUDENT_CLASSES, {
        params: {
          student_id: user.userId
        }
      });
      console.log('Student classes response:', response.data);
      setClasses(response.data.data || []);
      
      // Auto-select current class
      const current = response.data.data.find(cls => cls.is_current);
      if (current) {
        setSelectedClass(current._id);
      } else if (response.data.data.length > 0) {
        // If no current class, select the most recent one
        setSelectedClass(response.data.data[response.data.data.length - 1]._id);
      }
    } catch (error) {
      console.error('Error fetching student classes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load classes',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchPublishedExams = async () => {
    try {
      setLoading(true);
      // This endpoint should return only published exams for the student's class
      const response = await axios.get(API_ENDPOINTS.STUDENT_PUBLISHED_EXAMS, {
        params: {
          class_id: selectedClass,
          student_id: user.userId
        }
      });
      setPublishedExams(response.data.data || []);
    } catch (error) {
      console.error('Error fetching published exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFinalResult = async () => {
    try {
      // Check if final result is published for this class
      console.log('Checking final result for class:', selectedClass);
      const response = await axios.get(API_ENDPOINTS.STUDENT_FINAL_RESULT, {
        params: {
          class_id: selectedClass,
          student_id: user.userId
        }
      });
      console.log('Final result response:', response.data);
      setFinalResult(response.data.data);
    } catch (error) {
      console.error('Error checking final result:', error);
      setFinalResult(null);
    }
  };

  const fetchExamResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.STUDENT_EXAM_RESULTS_DATA, {
        params: {
          exam_id: selectedExam,
          class_id: selectedClass,
          student_id: user.userId
        }
      });
      setExamResults(response.data.data || []);
    } catch (error) {
      console.error('Error fetching exam results:', error);
      toast({
        title: 'Error',
        description: 'Failed to load exam results',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = () => {
    if (!examResults || examResults.length === 0) {
      return { totalMarks: 0, obtainedMarks: 0, percentage: 0, grade: 'N/A', subjects: 0 };
    }

    const totalMarks = examResults.reduce((sum, result) => sum + (result.max_marks || 0), 0);
    const obtainedMarks = examResults.reduce((sum, result) => 
      result.is_absent ? sum : sum + (result.marks_obtained || 0), 0
    );
    const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : 0;
    
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 40) grade = 'D';

    return {
      totalMarks,
      obtainedMarks,
      percentage,
      grade,
      subjects: examResults.length
    };
  };

  const getSubjectWisePerformance = () => {
    if (!examResults || examResults.length === 0) return [];
    
    return examResults.map(result => ({
      subject: result.subject_id?.subject_name || 'Unknown',
      obtained: result.is_absent ? 'Absent' : result.marks_obtained,
      total: result.max_marks,
      percentage: result.is_absent ? 0 : ((result.marks_obtained / result.max_marks) * 100).toFixed(2),
      grade: getGrade(result.is_absent ? 0 : ((result.marks_obtained / result.max_marks) * 100)),
      isAbsent: result.is_absent
    }));
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const stats = calculateStatistics();
  const subjectPerformance = getSubjectWisePerformance();

  const downloadMarkSheet = () => {
    setShowMarkSheet(true);
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Card shadow="lg" bg="white">
        <CardHeader bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white" borderTopRadius="lg">
          <Heading size="lg">📊 Exam Results</Heading>
          <Text mt={2} fontSize="md" opacity={0.9}>
            View your published exam results and academic performance across all years
          </Text>
        </CardHeader>
        <CardBody p={8}>
          {/* Class Selection - Horizontal Layout with Better Design */}
          <Box mb={8}>
            <Flex align="center" mb={4}>
              <Box w="4px" h="24px" bg="blue.500" mr={3} borderRadius="full" />
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                Select Class
              </Text>
            </Flex>
            
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
              {classes.map((cls) => (
                <Box
                  key={cls._id}
                  onClick={() => setSelectedClass(cls._id)}
                  p={4}
                  bg={selectedClass === cls._id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'}
                  color={selectedClass === cls._id ? 'white' : 'gray.700'}
                  border="2px solid"
                  borderColor={selectedClass === cls._id ? 'transparent' : 'gray.200'}
                  borderRadius="lg"
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'lg',
                    borderColor: selectedClass === cls._id ? 'transparent' : 'blue.300'
                  }}
                  position="relative"
                  overflow="hidden"
                >
                  {cls.is_current && (
                    <Badge 
                      position="absolute" 
                      top={2} 
                      right={2} 
                      colorScheme="green" 
                      fontSize="xs"
                      borderRadius="full"
                      px={2}
                    >
                      Current
                    </Badge>
                  )}
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="lg">{cls.class_name}</Text>
                    <Text fontSize="xs" opacity={0.8}>
                      {cls.academic_year}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </Grid>
          </Box>

          <Divider mb={8} />

          {selectedClass && (
            <Box>
              {/* Final Result Card */}
              {finalResult && (
                <Card 
                  bg="linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                  color="white"
                  mb={6}
                  shadow="xl"
                  borderRadius="xl"
                  overflow="hidden"
                  position="relative"
                >
                  {/* Decorative circles */}
                  <Box
                    position="absolute"
                    top="-20px"
                    right="-20px"
                    w="100px"
                    h="100px"
                    bg="whiteAlpha.200"
                    borderRadius="full"
                  />
                  <Box
                    position="absolute"
                    bottom="-30px"
                    left="-30px"
                    w="120px"
                    h="120px"
                    bg="whiteAlpha.100"
                    borderRadius="full"
                  />
                  
                  <CardBody position="relative" zIndex={1}>
                    <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                      <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                          <Icon as={CheckCircleIcon} boxSize={8} />
                          <Heading size="lg">
                            🎉 Final Result Published!
                          </Heading>
                        </HStack>
                        <Text fontSize="md" opacity={0.95}>
                          Your annual result for {classes.find(c => c._id === selectedClass)?.class_name} is now available
                        </Text>
                      </VStack>
                      <Button
                        leftIcon={<DownloadIcon />}
                        colorScheme="whiteAlpha"
                        bg="whiteAlpha.300"
                        _hover={{ bg: 'whiteAlpha.400' }}
                        onClick={downloadMarkSheet}
                        size="lg"
                        shadow="lg"
                      >
                        Download Mark Sheet
                      </Button>
                    </Flex>
                  </CardBody>
                </Card>
              )}

              {/* Exam Selection */}
              <Box mb={6}>
                <Flex align="center" mb={3}>
                  <Box w="4px" h="20px" bg="purple.500" mr={3} borderRadius="full" />
                  <Text fontWeight="bold" fontSize="md" color="gray.700">Select Examination</Text>
                </Flex>
                <Select
                  placeholder="Choose an exam to view results"
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  size="lg"
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', shadow: 'md' }}
                  icon={<Icon viewBox="0 0 24 24" />}
                >
                  {publishedExams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      📝 {exam.exam_name}
                    </option>
                  ))}
                </Select>
              </Box>

              {loading ? (
                <Center py={20}>
                  <VStack spacing={4}>
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                    <Text color="gray.500">Loading your results...</Text>
                  </VStack>
                </Center>
              ) : selectedExam && examResults.length > 0 ? (
                <>
                  {/* Statistics Cards */}
                  <Grid templateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={6} mb={8}>
                    <GridItem>
                      <Card 
                        bg="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" 
                        color="white"
                        shadow="lg"
                        borderRadius="xl"
                        transition="all 0.3s"
                        _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                      >
                        <CardBody>
                          <Stat>
                            <StatLabel fontSize="sm" opacity={0.9}>Total Marks</StatLabel>
                            <StatNumber fontSize="3xl" fontWeight="bold">
                              {stats.obtainedMarks} / {stats.totalMarks}
                            </StatNumber>
                            <StatHelpText mb={0} opacity={0.9}>
                              📚 {stats.subjects} subjects
                            </StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </GridItem>

                    <GridItem>
                      <Card 
                        bg="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" 
                        color="white"
                        shadow="lg"
                        borderRadius="xl"
                        transition="all 0.3s"
                        _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                      >
                        <CardBody>
                          <Stat>
                            <StatLabel fontSize="sm" opacity={0.9}>Percentage</StatLabel>
                            <StatNumber fontSize="3xl" fontWeight="bold">
                              {stats.percentage}%
                            </StatNumber>
                            <StatHelpText mb={0} opacity={0.9}>
                              📈 Overall Performance
                            </StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </GridItem>

                    <GridItem>
                      <Card 
                        bg="linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                        color="white"
                        shadow="lg"
                        borderRadius="xl"
                        transition="all 0.3s"
                        _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                      >
                        <CardBody>
                          <Stat>
                            <StatLabel fontSize="sm" opacity={0.9}>Grade</StatLabel>
                            <StatNumber fontSize="3xl" fontWeight="bold">
                              {stats.grade}
                            </StatNumber>
                            <StatHelpText mb={0} opacity={0.9}>
                              🏆 Your Achievement
                            </StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </GridItem>
                  </Grid>

                  {/* Subject-wise Performance Chart */}
                  <Card mb={6} shadow="md" borderRadius="xl">
                    <CardHeader bg="gray.50" borderTopRadius="xl">
                      <Flex align="center">
                        <Box w="4px" h="24px" bg="blue.500" mr={3} borderRadius="full" />
                        <Heading size="md" color="gray.700">Subject-wise Performance</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={5} align="stretch">
                        {subjectPerformance.map((subject, index) => (
                          <Box key={index}>
                            <Flex justify="space-between" align="center" mb={2}>
                              <HStack spacing={3}>
                                <Box
                                  w="8px"
                                  h="8px"
                                  borderRadius="full"
                                  bg={
                                    subject.isAbsent ? 'red.500' :
                                    subject.percentage >= 75 ? 'green.500' :
                                    subject.percentage >= 50 ? 'yellow.500' : 'red.500'
                                  }
                                />
                                <Text fontWeight="semibold" fontSize="md">{subject.subject}</Text>
                              </HStack>
                              <HStack spacing={2}>
                                <Badge 
                                  colorScheme={subject.isAbsent ? 'red' : 'blue'}
                                  fontSize="sm"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                >
                                  {subject.isAbsent ? 'Absent' : `${subject.obtained}/${subject.total}`}
                                </Badge>
                                {!subject.isAbsent && (
                                  <Badge 
                                    colorScheme={
                                      subject.percentage >= 75 ? 'green' : 
                                      subject.percentage >= 50 ? 'yellow' : 'red'
                                    }
                                    fontSize="sm"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                  >
                                    {subject.percentage}%
                                  </Badge>
                                )}
                              </HStack>
                            </Flex>
                            <Box
                              w="100%"
                              h="12px"
                              bg="gray.100"
                              borderRadius="full"
                              overflow="hidden"
                              shadow="inner"
                            >
                              <Box
                                w={`${subject.isAbsent ? 0 : subject.percentage}%`}
                                h="100%"
                                bg={
                                  subject.isAbsent ? 'red.500' :
                                  subject.percentage >= 75 ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' :
                                  subject.percentage >= 50 ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)' : 
                                  'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                                }
                                transition="width 0.5s ease"
                                borderRadius="full"
                              />
                            </Box>
                          </Box>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Detailed Results Table */}
                  <Card shadow="md" borderRadius="xl">
                    <CardHeader bg="gray.50" borderTopRadius="xl">
                      <Flex align="center">
                        <Box w="4px" h="24px" bg="purple.500" mr={3} borderRadius="full" />
                        <Heading size="md" color="gray.700">Detailed Results</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody p={0}>
                      <Box overflowX="auto">
                        <Table variant="simple" size="md">
                          <Thead bg="gray.100">
                            <Tr>
                              <Th py={4} color="gray.700" fontWeight="bold">Subject</Th>
                              <Th py={4} isNumeric color="gray.700" fontWeight="bold">Marks Obtained</Th>
                              <Th py={4} isNumeric color="gray.700" fontWeight="bold">Maximum Marks</Th>
                              <Th py={4} isNumeric color="gray.700" fontWeight="bold">Percentage</Th>
                              <Th py={4} color="gray.700" fontWeight="bold">Grade</Th>
                              <Th py={4} color="gray.700" fontWeight="bold">Status</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {subjectPerformance.map((subject, index) => (
                              <Tr 
                                key={index}
                                _hover={{ bg: 'gray.50' }}
                                transition="background 0.2s"
                              >
                                <Td fontWeight="medium" py={4}>{subject.subject}</Td>
                                <Td isNumeric py={4}>
                                  {subject.isAbsent ? (
                                    <Badge colorScheme="red" fontSize="sm">Absent</Badge>
                                  ) : (
                                    <Text fontWeight="semibold">{subject.obtained}</Text>
                                  )}
                                </Td>
                                <Td isNumeric py={4}>{subject.total}</Td>
                                <Td isNumeric py={4}>
                                  {subject.isAbsent ? '-' : (
                                    <Text fontWeight="semibold" color="blue.600">{subject.percentage}%</Text>
                                  )}
                                </Td>
                                <Td py={4}>
                                  <Badge
                                    colorScheme={
                                      subject.grade === 'A+' || subject.grade === 'A' ? 'green' :
                                      subject.grade === 'B+' || subject.grade === 'B' ? 'blue' :
                                      subject.grade === 'C' ? 'yellow' : 'red'
                                    }
                                    fontSize="sm"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                  >
                                    {subject.isAbsent ? 'F' : subject.grade}
                                  </Badge>
                                </Td>
                                <Td py={4}>
                                  {subject.isAbsent ? (
                                    <Icon as={WarningIcon} color="red.500" boxSize={5} />
                                  ) : subject.percentage >= 40 ? (
                                    <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                                  ) : (
                                    <Icon as={WarningIcon} color="orange.500" boxSize={5} />
                                  )}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    </CardBody>
                  </Card>
                </>
              ) : selectedExam ? (
                <Center py={20}>
                  <VStack spacing={4}>
                    <Box fontSize="6xl">📭</Box>
                    <Text color="gray.500" fontSize="lg" fontWeight="medium">No results available</Text>
                    <Text color="gray.400" fontSize="sm">Results will appear here once published</Text>
                  </VStack>
                </Center>
              ) : (
                <Center py={20}>
                  <VStack spacing={4}>
                    <Box fontSize="6xl">📝</Box>
                    <Text color="gray.500" fontSize="lg" fontWeight="medium">Select an examination to view results</Text>
                  </VStack>
                </Center>
              )}
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Mark Sheet PDF Modal */}
      {showMarkSheet && finalResult && (
        <MarkSheetPDF
          isOpen={showMarkSheet}
          onClose={() => setShowMarkSheet(false)}
          studentData={user}
          classData={classes.find(c => c._id === selectedClass)}
          results={finalResult}
        />
      )}
    </Box>
  );
};

export default StudentExamResults;
