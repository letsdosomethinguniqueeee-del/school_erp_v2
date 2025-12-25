import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Input,
  Alert,
  AlertIcon,
  AlertDescription,
  useToast,
  Spinner,
  Text,
  Card,
  CardBody,
  Heading,
  Divider,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import axios from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';
 

const StudentPerformance = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState('filters'); // 'filters' or 'studentId'

  // Dropdown data
  const [academicYears, setAcademicYears] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);

  // Selected values
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchStudentId, setSearchStudentId] = useState('');

  // Performance data
  const [performanceData, setPerformanceData] = useState(null);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentScores, setStudentScores] = useState({}); // Store percentage scores for all students


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7c7c'];
  const GRADE_COLORS = {
    'A+': '#22c55e',
    'A': '#84cc16',
    'B+': '#3b82f6',
    'B': '#06b6d4',
    'C': '#eab308',
    'D': '#f97316',
    'F': '#ef4444'
  };

  useEffect(() => {
    fetchAcademicYears();
    if (searchMode === 'filters') {
      fetchMediums();
      fetchClasses();
      fetchSections();
    }
  }, [searchMode]);

  

  useEffect(() => {
    if (searchMode === 'filters' && selectedClass && selectedSection && selectedMedium && selectedAcademicYear) {
      fetchStudents();
    }
  }, [selectedClass, selectedSection, selectedMedium, selectedAcademicYear, searchMode]);

  const fetchAcademicYears = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ACADEMIC_YEARS);
      const data = response.data.data || response.data.academicYears || [];
      setAcademicYears(data);
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

  const fetchMediums = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.MEDIUMS);
      const data = response.data.data || response.data.mediums || [];
      setMediums(data);
    } catch (error) {
      console.error('Error fetching mediums:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CLASSES);
      const data = response.data.data || response.data.classes || [];
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.SECTIONS);
      const data = response.data.data || response.data.sections || [];
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.STUDENTS, {
        params: {
          academic_year_id: selectedAcademicYear,
          class_id: selectedClass,
          section_id: selectedSection,
          medium_id: selectedMedium,
          limit: 1000
        }
      });
      const data = response.data.data || response.data.students || [];
      setStudents(data);
      setShowStudentList(true);
      
      // Fetch performance scores for all students
      await fetchStudentScores(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch students',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  

  const fetchStudentScores = async (studentsData) => {
    const scores = {};
    
    for (const student of studentsData) {
      try {
        const response = await axios.get(`${API_ENDPOINTS.EXAMINATION_MARKS}/student/${student._id}`, {
          params: {
            academic_year_id: selectedAcademicYear
          }
        });
        
        const marksData = response.data.data || [];
        
        if (marksData.length > 0) {
          const totalMarks = marksData.reduce((sum, mark) => sum + mark.marks_obtained, 0);
          const totalMaxMarks = marksData.reduce((sum, mark) => sum + mark.max_marks, 0);
          const percentage = ((totalMarks / totalMaxMarks) * 100).toFixed(2);
          const grade = getGrade(percentage);
          
          scores[student._id] = {
            percentage,
            grade,
            totalMarks,
            totalMaxMarks,
            testsCount: marksData.length
          };
        }
      } catch (error) {
        console.error(`Error fetching scores for student ${student._id}:`, error);
      }
    }
    
    setStudentScores(scores);
  };

  const handleShowStudentList = () => {
    if (searchMode === 'filters') {
      if (!selectedAcademicYear || !selectedClass || !selectedSection || !selectedMedium) {
        toast({
          title: 'Validation Error',
          description: 'Please select Academic Year, Medium, Class, and Section',
          status: 'warning',
          duration: 3000,
          isClosable: true
        });
        return;
      }
      fetchStudents();
    }
  };

  const handleViewPerformance = async (studentId, studentInfo = null) => {
    if (!selectedAcademicYear) {
      toast({
        title: 'Validation Error',
        description: 'Please select Academic Year',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    if (!studentId) {
      // If called from student ID search
      if (!searchStudentId.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Please enter Student ID',
          status: 'warning',
          duration: 3000,
          isClosable: true
        });
        return;
      }
      studentId = searchStudentId.trim();
    }

    setLoading(true);
    setShowPerformance(false);
    if (studentInfo) {
      setCurrentStudent(studentInfo);
    }

    try {
      // Fetch student performance data
      console.log('Fetching performance for student:', studentId, 'academic year:', selectedAcademicYear);
      const response = await axios.get(`${API_ENDPOINTS.EXAMINATION_MARKS}/student/${studentId}`, {
        params: {
          academic_year_id: selectedAcademicYear
        }
      });

      console.log('Performance response:', response.data);
      const marksData = response.data.data || [];
      
      if (marksData.length === 0) {
        toast({
          title: 'No Data',
          description: 'No performance data found for this student in the selected academic year',
          status: 'info',
          duration: 3000,
          isClosable: true
        });
        setLoading(false);
        return;
      }

      // Process and analyze the data
      const processedData = processPerformanceData(marksData);
      setPerformanceData(processedData);
      setShowPerformance(true);
      setIsModalOpen(true); // Open modal
      setShowStudentList(false); // Hide student list when showing performance
    } catch (error) {
      console.error('Error fetching performance:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch student performance',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStudentList = () => {
    setShowPerformance(false);
    setShowStudentList(true);
    setCurrentStudent(null);
    setPerformanceData(null);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowPerformance(false);
    setPerformanceData(null);
    setCurrentStudent(null);
    setShowStudentList(true);
  };

  const processPerformanceData = (marksData) => {
    // Extract student info
    const studentInfo = marksData[0]?.student_id || {};

    // Group by exam (test-wise)
    const testWiseData = {};
    marksData.forEach(mark => {
      const examId = mark.exam_id?._id;
      const examName = mark.exam_id?.exam_name || 'Unknown Exam';
      
      if (!testWiseData[examId]) {
        testWiseData[examId] = {
          examName,
          subjects: [],
          totalMarks: 0,
          totalMaxMarks: 0,
          tests: 0
        };
      }
      
      testWiseData[examId].subjects.push({
        name: mark.subject_id?.subject_name || 'Unknown Subject',
        marks: mark.marks_obtained,
        maxMarks: mark.max_marks,
        percentage: ((mark.marks_obtained / mark.max_marks) * 100).toFixed(2),
        grade: getGrade((mark.marks_obtained / mark.max_marks) * 100),
        isAbsent: mark.is_absent
      });
      
      testWiseData[examId].totalMarks += mark.marks_obtained;
      testWiseData[examId].totalMaxMarks += mark.max_marks;
      testWiseData[examId].tests++;
    });

    // First, get all unique exams across all subjects
    const allExams = {};
    marksData.forEach(mark => {
      const examId = mark.exam_id?._id;
      const examName = mark.exam_id?.exam_name || 'Unknown Exam';
      if (!allExams[examId]) {
        allExams[examId] = {
          id: examId,
          name: examName
        };
      }
    });

    // Group by subject (subject-wise)
    const subjectWiseData = {};
    marksData.forEach(mark => {
      const subjectId = mark.subject_id?._id;
      const subjectName = mark.subject_id?.subject_name || 'Unknown Subject';
      const examId = mark.exam_id?._id;
      
      if (!subjectWiseData[subjectId]) {
        subjectWiseData[subjectId] = {
          subjectName,
          examMarks: {}, // Store marks by exam ID
          totalMarks: 0,
          totalMaxMarks: 0,
          tests: 0,
          avgPercentage: 0
        };
      }
      
      // Store marks data by exam ID
      // If absent, treat as 0 marks
      const actualMarks = mark.is_absent ? 0 : mark.marks_obtained;
      
      subjectWiseData[subjectId].examMarks[examId] = {
        examName: mark.exam_id?.exam_name || 'Unknown Exam',
        marks: actualMarks,
        maxMarks: mark.max_marks,
        percentage: ((actualMarks / mark.max_marks) * 100).toFixed(2),
        grade: getGrade((actualMarks / mark.max_marks) * 100),
        isAbsent: mark.is_absent
      };
      
      // Count all marks in totals (absent = 0)
      subjectWiseData[subjectId].totalMarks += actualMarks;
      subjectWiseData[subjectId].totalMaxMarks += mark.max_marks;
      subjectWiseData[subjectId].tests++; 
    });

    // Now create exams array for each subject with N/A for missing data
    Object.values(subjectWiseData).forEach(subject => {
      subject.exams = Object.values(allExams).map(exam => {
        const examData = subject.examMarks[exam.id];
        if (examData) {
          return examData;
        } else {
          // Return N/A for missing exam data
          return {
            examName: exam.name,
            marks: null,
            maxMarks: null,
            percentage: null,
            grade: null,
            isAbsent: false,
            isMissing: true
          };
        }
      });
      
      // Calculate averages for subjects (only from available tests)
      if (subject.totalMaxMarks > 0) {
        subject.avgPercentage = ((subject.totalMarks / subject.totalMaxMarks) * 100).toFixed(2);
        subject.avgGrade = getGrade(subject.avgPercentage);
      } else {
        subject.avgPercentage = 0;
        subject.avgGrade = 'N/A';
      }
    });

    // Overall performance
    const totalMarks = marksData.reduce((sum, mark) => sum + mark.marks_obtained, 0);
    const totalMaxMarks = marksData.reduce((sum, mark) => sum + mark.max_marks, 0);
    const overallPercentage = ((totalMarks / totalMaxMarks) * 100).toFixed(2);
    const overallGrade = getGrade(overallPercentage);

    // Prepare chart data for test-wise analysis
    const testWiseChartData = Object.values(testWiseData).map(test => ({
      name: test.examName,
      percentage: ((test.totalMarks / test.totalMaxMarks) * 100).toFixed(2),
      marks: test.totalMarks,
      maxMarks: test.totalMaxMarks
    }));

    // Prepare chart data for subject-wise analysis
    const subjectWiseChartData = Object.values(subjectWiseData).map(subject => ({
      name: subject.subjectName,
      percentage: parseFloat(subject.avgPercentage),
      marks: subject.totalMarks,
      maxMarks: subject.totalMaxMarks
    }));

    // Prepare pie chart data
    const pieChartData = Object.values(subjectWiseData).map(subject => ({
      name: subject.subjectName,
      value: parseFloat(subject.avgPercentage)
    }));

    // Prepare radar chart data
    const radarData = Object.values(subjectWiseData).map(subject => ({
      subject: subject.subjectName,
      percentage: parseFloat(subject.avgPercentage)
    }));

    return {
      studentInfo,
      testWiseData: Object.values(testWiseData),
      subjectWiseData: Object.values(subjectWiseData),
      totalMarks,
      totalMaxMarks,
      overallPercentage,
      overallGrade,
      totalTests: marksData.length,
      testWiseChartData,
      subjectWiseChartData,
      pieChartData,
      radarData
    };
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

  const getGradeColor = (grade) => {
    return GRADE_COLORS[grade] || '#6b7280';
  };

  return (
    <Box p={4}>
      <Card mb={6}>
        <CardBody>
          <Heading size="md" mb={4}>Student Performance Analysis</Heading>
          <Divider mb={4} />

          {/* Search Mode Selection */}
          <FormControl mb={4}>
            <FormLabel>Search By</FormLabel>
            <RadioGroup value={searchMode} onChange={setSearchMode}>
              <Stack direction="row" spacing={4}>
                <Radio value="filters">Class, Medium & Section</Radio>
                <Radio value="studentId">Student ID</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {/* Filters */}
          <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
            <FormControl isRequired>
              <FormLabel>Academic Year</FormLabel>
              <Select
                placeholder="Select Academic Year"
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
              >
                {academicYears.map((year) => (
                  <option key={year._id} value={year._id}>
                    {year.year_code}
                  </option>
                ))}
              </Select>
            </FormControl>

            {searchMode === 'filters' ? (
              <>
                <FormControl isRequired>
                  <FormLabel>Medium</FormLabel>
                  <Select
                    placeholder="Select Medium"
                    value={selectedMedium}
                    onChange={(e) => setSelectedMedium(e.target.value)}
                  >
                    {mediums.map((medium) => (
                      <option key={medium._id} value={medium._id}>
                        {medium.medium_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Class</FormLabel>
                  <Select
                    placeholder="Select Class"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.class_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Section</FormLabel>
                  <Select
                    placeholder="Select Section"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    {sections.map((section) => (
                      <option key={section._id} value={section._id}>
                        {section.section_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </>
            ) : (
              <FormControl isRequired>
                <FormLabel>Student ID</FormLabel>
                <Input
                  placeholder="Enter Student ID"
                  value={searchStudentId}
                  onChange={(e) => setSearchStudentId(e.target.value)}
                />
              </FormControl>
            )}
          </Box>

          {searchMode === 'filters' ? (
            <Button
              mt={6}
              colorScheme="blue"
              onClick={handleShowStudentList}
              isLoading={loading}
              loadingText="Loading Students..."
            >
              Show Students
            </Button>
          ) : (
            <Button
              mt={6}
              colorScheme="blue"
              onClick={() => handleViewPerformance()}
              isLoading={loading}
              loadingText="Loading Performance..."
            >
              View Performance
            </Button>
          )}
        </CardBody>
      </Card>

      {loading && (
        <Box textAlign="center" py={8}>
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Analyzing student performance...</Text>
        </Box>
      )}

      {/* Student List Table */}
      {showStudentList && students.length > 0 && (
        <Card>
          <CardBody>
            <HStack justify="space-between" mb={4}>
              <Heading size="md">
                Students in {classes.find(c => c._id === selectedClass)?.class_name} - {sections.find(s => s._id === selectedSection)?.section_name}
              </Heading>
              <Text color="gray.600">{students.length} Students</Text>
            </HStack>
            <Divider mb={4} />
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>S.No</Th>
                    <Th>Student ID</Th>
                    <Th>Student Name</Th>
                    <Th>Class</Th>
                    <Th>Roll No</Th>
                    <Th>Overall %</Th>
                    <Th>Grade</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {students.map((student, index) => {
                    const fullName = [student.firstName, student.middleName, student.lastName]
                      .filter(Boolean)
                      .join(' ');
                    const scoreData = studentScores[student._id];
                    
                    return (
                      <Tr key={student._id}>
                        <Td>{index + 1}</Td>
                        <Td fontWeight="bold">{student.studentId}</Td>
                        <Td>{fullName}</Td>
                        <Td>{student.currentStudyClass?.class_name || student.currentStudyClass || 'N/A'}</Td>
                        <Td>{student.rollNo || 'N/A'}</Td>
                        <Td>
                          {scoreData ? (
                            <Text fontWeight="bold" color="blue.600">
                              {scoreData.percentage}%
                            </Text>
                          ) : (
                            <Text color="gray.400">No Data</Text>
                          )}
                        </Td>
                        <Td>
                          {scoreData ? (
                            <Badge 
                              colorScheme={scoreData.grade === 'F' ? 'red' : 'green'}
                              fontSize="sm"
                            >
                              {scoreData.grade}
                            </Badge>
                          ) : (
                            <Text color="gray.400">-</Text>
                          )}
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleViewPerformance(student._id, student)}
                          >
                            View Performance
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      )}

      {showStudentList && students.length === 0 && (
        <Alert status="info">
          <AlertIcon />
          <AlertDescription>
            No students found for the selected criteria.
          </AlertDescription>
        </Alert>
      )}

      {/* Performance Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        size="full"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Student Performance Analysis</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {showPerformance && performanceData && (
              <VStack spacing={6} align="stretch">
                {/* Student Info Card */}
                <Card>
            <CardBody>
              <HStack justify="space-between" mb={4}>
                <Box>
                  <Heading size="md">
                    {[
                      performanceData.studentInfo.firstName,
                      performanceData.studentInfo.middleName,
                      performanceData.studentInfo.lastName
                    ].filter(Boolean).join(' ')}
                  </Heading>
                  <Text color="gray.600">Student ID: {performanceData.studentInfo.studentId}</Text>
                  <Text color="gray.600">Class: {performanceData.studentInfo.currentStudyClass}</Text>
                </Box>
                <Badge colorScheme={performanceData.overallGrade === 'F' ? 'red' : 'green'} fontSize="2xl" p={3}>
                  {performanceData.overallGrade}
                </Badge>
              </HStack>
            </CardBody>
          </Card>

          {/* Overall Statistics */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Overall Percentage</StatLabel>
                  <StatNumber>{performanceData.overallPercentage}%</StatNumber>
                  <StatHelpText>
                    {performanceData.totalMarks} / {performanceData.totalMaxMarks}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Tests</StatLabel>
                  <StatNumber>{performanceData.totalTests}</StatNumber>
                  <StatHelpText>Across all subjects</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Subjects</StatLabel>
                  <StatNumber>{performanceData.subjectWiseData.length}</StatNumber>
                  <StatHelpText>Different subjects</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Average Marks</StatLabel>
                  <StatNumber>
                    {(performanceData.totalMarks / performanceData.totalTests).toFixed(2)}
                  </StatNumber>
                  <StatHelpText>Per test</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </Grid>

          {/* Charts Row 1: Test-wise Performance & Grade Distribution */}
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
            {/* Test-wise Performance Bar Chart */}
            <Card>
              <CardBody>
                <Heading size="sm" mb={4}>Test-wise Performance</Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData.testWiseChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" fill="#3b82f6" name="Percentage %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Grade Distribution Pie Chart */}
            <Card>
              <CardBody>
                <Heading size="sm" mb={4}>Grade Distribution</Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceData.pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {performanceData.pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getGradeColor(entry.grade)} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </Grid>

          {/* Charts Row 2: Subject-wise Performance & Radar Chart */}
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
            {/* Subject-wise Performance Bar Chart */}
            <Card>
              <CardBody>
                <Heading size="sm" mb={4}>Subject-wise Average Performance</Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData.subjectWiseChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" fill="#10b981" name="Average %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Subject Performance Radar Chart */}
            <Card>
              <CardBody>
                <Heading size="sm" mb={4}>Subject Performance Radar</Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={performanceData.radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Performance %" dataKey="percentage" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </Grid>

          {/* Subject-wise Details Table */}
          <Card>
            <CardBody>
              <Heading size="sm" mb={4}>Subject-wise Summary</Heading>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Subject</Th>
                      {performanceData.subjectWiseData[0]?.exams.map((exam, index) => (
                        <Th key={index} textAlign="center">
                          {exam.examName}
                          <br />
                          {exam.maxMarks && (
                            <Text as="span" fontSize="xs" color="gray.500">
                              (Max: {exam.maxMarks})
                            </Text>
                          )}
                        </Th>
                      ))}
                      <Th>Total Marks</Th>
                      <Th>Max Marks</Th>
                      <Th>Average %</Th>
                      <Th>Grade</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {performanceData.subjectWiseData.map((subject, index) => (
                      <Tr key={index}>
                        <Td fontWeight="bold">{subject.subjectName}</Td>
                        {subject.exams.map((exam, examIndex) => (
                          <Td key={examIndex} textAlign="center">
                            {exam.isMissing ? (
                              <Text color="gray.400" fontStyle="italic">N/A</Text>
                            ) : (
                              <>
                                <Text fontWeight="bold" color={exam.isAbsent ? "red.600" : "blue.600"}>
                                  {exam.marks}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  ({exam.percentage}%)
                                </Text>
                                {exam.isAbsent && (
                                  <Badge colorScheme="red" size="sm" mt={1}>Absent</Badge>
                                )}
                              </>
                            )}
                          </Td>
                        ))}
                        <Td>{subject.totalMarks}</Td>
                        <Td>{subject.totalMaxMarks}</Td>
                        <Td fontWeight="bold">{subject.avgPercentage}%</Td>
                        <Td>
                          <Badge 
                            colorScheme={subject.avgGrade === 'F' ? 'red' : subject.avgGrade === 'N/A' ? 'gray' : 'green'}
                            fontSize="md"
                          >
                            {subject.avgGrade}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        </VStack>
      )}

      {showPerformance && !performanceData && (
        <Alert status="info">
          <AlertIcon />
          <AlertDescription>
            No performance data available for the selected criteria.
          </AlertDescription>
        </Alert>
      )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StudentPerformance;
