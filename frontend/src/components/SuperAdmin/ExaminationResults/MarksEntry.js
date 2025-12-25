import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Spinner,
  Text,
  Card,
  CardBody,
  Heading,
  Divider,
  Checkbox
} from '@chakra-ui/react';
import axios from '../../../config/axios';
import { 
  API_ENDPOINTS
} from '../../../constants/api';

const MarksEntry = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [hasAccess, setHasAccess] = useState(null);
  const [showStudents, setShowStudents] = useState(false);

  // Dropdown data
  const [academicYears, setAcademicYears] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  // Selected values
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  // Students data
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  // Fetch dropdown data
  useEffect(() => {
    fetchAcademicYears();
    fetchMediums();
    fetchClasses();
    fetchSections();
    fetchSubjects();
  }, []);

  // Fetch exams when class and medium are selected
  useEffect(() => {
    if (selectedClass && selectedMedium) {
      fetchExams();
    }
  }, [selectedClass, selectedMedium]);

  const fetchAcademicYears = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ACADEMIC_YEARS);
      console.log('Academic Years Response:', response.data);
      const data = response.data.data || response.data.academicYears || [];
      console.log('Academic Years Data:', data);
      setAcademicYears(data);
    } catch (error) {
      console.error('Error fetching academic years:', error);
      toast({
        title: 'Error',
        description: 'Failed to load academic years',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const fetchMediums = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.MEDIUMS);
      console.log('Mediums Response:', response.data);
      const data = response.data.data || response.data.mediums || [];
      setMediums(data);
    } catch (error) {
      console.error('Error fetching mediums:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mediums',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CLASSES);
      console.log('Classes Response:', response.data);
      const data = response.data.data || response.data.classes || [];
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load classes',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.SECTIONS);
      console.log('Sections Response:', response.data);
      const data = response.data.data || response.data.sections || [];
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sections',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.SUBJECTS);
      console.log('Subjects Response:', response.data);
      const data = response.data.data || response.data.subjects || [];
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subjects',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const fetchExams = async () => {
    try {
      // Fetch exams based on class and medium
      const response = await axios.get(API_ENDPOINTS.EXAMINATIONS, {
        params: {
          class_id: selectedClass,
          medium_id: selectedMedium
        }
      });
      const data = response.data.data || response.data.examinations || [];
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setExams([]);
    }
  };

  const checkAccess = async () => {
    if (!selectedAcademicYear || !selectedClass || !selectedSection || 
        !selectedMedium || !selectedSubject || !selectedExam) {
      toast({
        title: 'Validation Error',
        description: 'Please select all required fields including Exam Name',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setCheckingAccess(true);
    setShowStudents(false);
    setHasAccess(null);

    try {
      const response = await axios.post(API_ENDPOINTS.CHECK_USER_ACCESS, {
        academic_year_id: selectedAcademicYear,
        class_id: selectedClass,
        section_id: selectedSection,
        medium_id: selectedMedium,
        subject_id: selectedSubject
      });

      const accessGranted = response.data.data?.hasAccess || false;
      const canEdit = response.data.data?.permissions?.edit || false;

      setHasAccess({ granted: accessGranted, canEdit });

      if (accessGranted) {
        await fetchStudents();
      }
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess({ granted: false, canEdit: false });
      toast({
        title: 'Error',
        description: 'Failed to check access permissions',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setCheckingAccess(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Fetch students based on academic year, class, section, and medium
      const response = await axios.get(API_ENDPOINTS.STUDENTS, {
        params: {
          academic_year_id: selectedAcademicYear,
          class_id: selectedClass,
          section_id: selectedSection,
          medium_id: selectedMedium,
          limit: 1000 // Get more students without pagination
        }
      });

      console.log('Students response:', response.data);
      const studentsData = response.data.data || response.data.students || [];
      console.log('Students fetched:', studentsData.length);
      setStudents(studentsData);
      
      // Fetch existing marks if exam is selected
      if (selectedExam) {
        await fetchExistingMarks(studentsData);
      } else {
        // Initialize empty marks
        const initialMarks = {};
        studentsData.forEach(student => {
          initialMarks[student._id] = { marks: '', is_absent: false };
        });
        setMarks(initialMarks);
      }
      
      setShowStudents(true);
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

  const fetchExistingMarks = async (studentsData) => {
    try {
      // Fetch existing marks for the selected exam
      const response = await axios.get(API_ENDPOINTS.EXAMINATION_MARKS, {
        params: {
          exam_id: selectedExam,
          subject_id: selectedSubject,
          class_id: selectedClass,
          section_id: selectedSection
        }
      });

      console.log('Existing marks response:', response.data);
      const existingMarks = response.data.data || [];
      const marksMap = {};
      
      studentsData.forEach(student => {
        const markRecord = existingMarks.find(m => 
          m.student_id._id === student._id || m.student_id === student._id
        );
        marksMap[student._id] = markRecord 
          ? { 
              marks: markRecord.marks_obtained, 
              is_absent: markRecord.is_absent || false 
            }
          : { marks: '', is_absent: false };
      });
      
      setMarks(marksMap);
    } catch (error) {
      console.error('Error fetching existing marks:', error);
      // Initialize empty marks if fetch fails
      const initialMarks = {};
      studentsData.forEach(student => {
        initialMarks[student._id] = { marks: '', is_absent: false };
      });
      setMarks(initialMarks);
    }
  };

  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: value
      }
    }));
  };

  const handleAbsentChange = (studentId, isAbsent) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        is_absent: isAbsent,
        marks: isAbsent ? '' : prev[studentId]?.marks || ''
      }
    }));
  };

  const handleSaveMarks = async () => {
    if (!selectedExam) {
      toast({
        title: 'Validation Error',
        description: 'Please select an exam',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Get max marks for the selected exam
    const examData = exams.find(e => e._id === selectedExam);
    const maxMarks = examData?.max_marks || 100;

    // Validate marks
    const invalidMarks = Object.entries(marks).filter(([_, markData]) => {
      if (markData?.is_absent) return false; // Skip validation for absent students
      if (markData?.marks === '' || markData?.marks === undefined) return false;
      const numMark = parseFloat(markData.marks);
      return isNaN(numMark) || numMark < 0 || numMark > maxMarks;
    });

    if (invalidMarks.length > 0) {
      toast({
        title: 'Validation Error',
        description: `Marks should be between 0 and ${maxMarks}`,
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare marks data - include students with marks entered OR marked as absent
      const marksData = students
        .filter(student => {
          const markData = marks[student._id];
          return markData?.is_absent || (markData?.marks !== '' && markData?.marks !== undefined);
        })
        .map(student => {
          const markData = marks[student._id];
          return {
            student_id: student._id,
            exam_id: selectedExam,
            subject_id: selectedSubject,
            class_id: selectedClass,
            section_id: selectedSection,
            academic_year_id: selectedAcademicYear,
            medium_id: selectedMedium,
            marks_obtained: markData.is_absent ? 0 : parseFloat(markData.marks) || 0,
            max_marks: maxMarks,
            is_absent: markData.is_absent || false
          };
        });

      if (marksData.length === 0) {
        toast({
          title: 'No Data',
          description: 'Please enter marks for at least one student',
          status: 'warning',
          duration: 3000,
          isClosable: true
        });
        setLoading(false);
        return;
      }

      console.log('Saving marks data:', marksData);

      await axios.post(API_ENDPOINTS.EXAMINATION_MARKS_BULK, { marks: marksData });

      toast({
        title: 'Success',
        description: `Marks saved successfully for ${marksData.length} student(s)`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error saving marks:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save marks',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const getMaxMarks = () => {
    if (!selectedExam) return 'N/A';
    const examData = exams.find(e => e._id === selectedExam);
    return examData?.max_marks || 100;
  };

  return (
    <Box p={4}>
      <Card mb={6}>
        <CardBody>
          <Heading size="md" mb={4}>Selection Criteria</Heading>
          <Divider mb={4} />
          
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

            <FormControl isRequired>
              <FormLabel>Subject</FormLabel>
              <Select
                placeholder="Select Subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subject_name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Exam Name</FormLabel>
              <Select
                placeholder="Select Exam"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                isDisabled={!selectedClass || !selectedMedium}
              >
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.exam_name} ({exam.max_marks} marks)
                  </option>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            mt={6}
            colorScheme="blue"
            onClick={checkAccess}
            isLoading={checkingAccess}
            loadingText="Checking Access..."
          >
            Get Student Details
          </Button>
        </CardBody>
      </Card>

      {hasAccess !== null && !hasAccess.granted && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <Box>
            <AlertTitle>Access Denied!</AlertTitle>
            <AlertDescription>
              You are not allowed to update marks for the selected items. Please contact your administrator for access.
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {hasAccess !== null && hasAccess.granted && !hasAccess.canEdit && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          <Box>
            <AlertTitle>View Only Access</AlertTitle>
            <AlertDescription>
              You have view-only access for the selected items. You cannot edit marks.
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {loading && (
        <Box textAlign="center" py={8}>
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Loading students...</Text>
        </Box>
      )}

      {showStudents && hasAccess.granted && students.length > 0 && (
        <Card>
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Heading size="md">
                Student Marks Entry {selectedExam && `(Max Marks: ${getMaxMarks()})`}
              </Heading>
              {hasAccess.canEdit && (
                <Button
                  colorScheme="green"
                  onClick={handleSaveMarks}
                  isLoading={loading}
                  loadingText="Saving..."
                >
                  Save Marks
                </Button>
              )}
            </Box>
            <Divider mb={4} />

            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Student ID</Th>
                    <Th>Student Name</Th>
                    <Th>Class</Th>
                    <Th>Marks Obtained</Th>
                    <Th>Absent</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {students.map((student) => {
                    const fullName = [student.firstName, student.middleName, student.lastName]
                      .filter(Boolean)
                      .join(' ') || 'N/A';
                    const studentMarks = marks[student._id] || { marks: '', is_absent: false };
                    
                    return (
                      <Tr key={student._id}>
                        <Td>{student.studentId || 'N/A'}</Td>
                        <Td>{fullName}</Td>
                        <Td>
                          {student.currentStudyClass?.class_name || student.currentStudyClass || classes.find(c => c._id === selectedClass)?.class_name || 'N/A'}
                        </Td>
                        <Td>
                          <Input
                            type="number"
                            min="0"
                            max={getMaxMarks()}
                            value={studentMarks.marks || ''}
                            onChange={(e) => handleMarkChange(student._id, e.target.value)}
                            placeholder="Enter marks"
                            size="sm"
                            width="120px"
                            isDisabled={!hasAccess.canEdit || studentMarks.is_absent}
                          />
                        </Td>
                        <Td>
                          <Checkbox
                            isChecked={studentMarks.is_absent || false}
                            onChange={(e) => handleAbsentChange(student._id, e.target.checked)}
                            isDisabled={!hasAccess.canEdit}
                          />
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

      {showStudents && hasAccess.granted && students.length === 0 && (
        <Alert status="info">
          <AlertIcon />
          <AlertDescription>
            No students found for the selected criteria.
          </AlertDescription>
        </Alert>
      )}
    </Box>
  );
};

export default MarksEntry;
