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
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Checkbox,
  Tooltip
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import axios from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';

const ViewStudentMarks = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showMarks, setShowMarks] = useState(false);

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

  // Marks data
  const [marksData, setMarksData] = useState([]);

  // Access control state
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [hasAccess, setHasAccess] = useState(null);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMark, setEditingMark] = useState(null);
  const [editFormData, setEditFormData] = useState({
    marks_obtained: '',
    is_absent: false,
    remarks: ''
  });

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

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.SUBJECTS);
      const data = response.data.data || response.data.subjects || [];
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchExams = async () => {
    try {
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

  const handleViewMarks = async () => {
    if (!selectedAcademicYear || !selectedClass || !selectedSection || 
        !selectedMedium || !selectedSubject || !selectedExam) {
      toast({
        title: 'Validation Error',
        description: 'Please select all required fields',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setLoading(true);
    setShowMarks(false);
    setCheckingAccess(true);
    setHasAccess(null);

    try {
      // First check access permissions
      const accessResponse = await axios.post(API_ENDPOINTS.CHECK_USER_ACCESS, {
        academic_year_id: selectedAcademicYear,
        class_id: selectedClass,
        section_id: selectedSection,
        medium_id: selectedMedium,
        subject_id: selectedSubject
      });

      const accessGranted = accessResponse.data.data?.hasAccess || false;
      const canEdit = accessResponse.data.data?.permissions?.edit || false;

      setHasAccess({ granted: accessGranted, canEdit });

      if (!accessGranted) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to view marks for this selection',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        setLoading(false);
        setCheckingAccess(false);
        return;
      }

      // If access granted, fetch marks
      const response = await axios.get(API_ENDPOINTS.EXAMINATION_MARKS, {
        params: {
          academic_year_id: selectedAcademicYear,
          exam_id: selectedExam,
          subject_id: selectedSubject,
          class_id: selectedClass,
          section_id: selectedSection
        }
      });

      console.log('Marks response:', response.data);
      const marks = response.data.data || [];
      setMarksData(marks);
      setShowMarks(true);

      if (marks.length === 0) {
        toast({
          title: 'No Data',
          description: 'No marks found for the selected criteria',
          status: 'info',
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch marks',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
      setCheckingAccess(false);
    }
  };

  const getExamName = () => {
    const exam = exams.find(e => e._id === selectedExam);
    return exam ? exam.exam_name : 'N/A';
  };

  const getMaxMarks = () => {
    const exam = exams.find(e => e._id === selectedExam);
    return exam ? exam.max_marks : 'N/A';
  };

  const getPercentage = (obtained, max) => {
    if (!max || max === 0) return '0.00';
    return ((obtained / max) * 100).toFixed(2);
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

  const handleEditClick = (mark) => {
    // Check if user has edit permission
    if (!hasAccess?.canEdit) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to edit marks for this selection',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setEditingMark(mark);
    setEditFormData({
      marks_obtained: mark.marks_obtained,
      is_absent: mark.is_absent || false,
      remarks: mark.remarks || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!editFormData.is_absent && (!editFormData.marks_obtained || editFormData.marks_obtained < 0)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter valid marks',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    if (!editFormData.is_absent && editFormData.marks_obtained > editingMark.max_marks) {
      toast({
        title: 'Validation Error',
        description: `Marks cannot exceed maximum marks (${editingMark.max_marks})`,
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    try {
      const updateData = {
        marks_obtained: editFormData.is_absent ? 0 : parseInt(editFormData.marks_obtained),
        is_absent: editFormData.is_absent,
        remarks: editFormData.remarks
      };

      await axios.put(`${API_ENDPOINTS.EXAMINATION_MARKS}/${editingMark._id}`, updateData);

      toast({
        title: 'Success',
        description: 'Marks updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      setIsEditModalOpen(false);
      setEditingMark(null);
      
      // Refresh marks data
      handleViewMarks();
    } catch (error) {
      console.error('Error updating marks:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update marks',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingMark(null);
    setEditFormData({
      marks_obtained: '',
      is_absent: false,
      remarks: ''
    });
  };

  return (
    <Box p={4}>
      <Card mb={6}>
        <CardBody>
          <Heading size="md" mb={4}>View Marks</Heading>
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
            onClick={handleViewMarks}
            isLoading={loading}
            loadingText="Loading Marks..."
          >
            View Marks
          </Button>
        </CardBody>
      </Card>

      {loading && (
        <Box textAlign="center" py={8}>
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Loading marks...</Text>
        </Box>
      )}

      {showMarks && marksData.length > 0 && (
        <Card>
          <CardBody>
            {/* Access Control Alert */}
            {hasAccess && (
              <Alert 
                status={hasAccess.canEdit ? "success" : "warning"} 
                mb={4}
                borderRadius="md"
              >
                <AlertIcon />
                <AlertDescription>
                  {hasAccess.canEdit 
                    ? "You have permission to view and edit marks for this selection."
                    : "You have permission to view marks, but cannot edit them for this selection."}
                </AlertDescription>
              </Alert>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Heading size="md">
                {getExamName()} - {subjects.find(s => s._id === selectedSubject)?.subject_name} (Max Marks: {getMaxMarks()})
              </Heading>
            </Box>
            <Divider mb={4} />

            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>S.No</Th>
                    <Th>Student ID</Th>
                    <Th>Student Name</Th>
                    <Th>Class</Th>
                    <Th>Marks Obtained</Th>
                    <Th>Max Marks</Th>
                    <Th>Percentage</Th>
                    <Th>Grade</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {marksData.map((mark, index) => {
                    const student = mark.student_id;
                    const fullName = student 
                      ? [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ')
                      : 'N/A';
                    const percentage = parseFloat(getPercentage(mark.marks_obtained, mark.max_marks));
                    const grade = getGrade(percentage);
                    
                    return (
                      <Tr key={mark._id}>
                        <Td>{index + 1}</Td>
                        <Td>{student?.studentId || 'N/A'}</Td>
                        <Td>{fullName}</Td>
                        <Td>{student?.currentStudyClass || 'N/A'}</Td>
                        <Td fontWeight="bold">{mark.marks_obtained}</Td>
                        <Td>{mark.max_marks}</Td>
                        <Td>{percentage}%</Td>
                        <Td>
                          <Badge 
                            colorScheme={
                              grade === 'A+' || grade === 'A' ? 'green' :
                              grade === 'B+' || grade === 'B' ? 'blue' :
                              grade === 'C' ? 'yellow' :
                              grade === 'D' ? 'orange' : 'red'
                            }
                          >
                            {grade}
                          </Badge>
                        </Td>
                        <Td>
                          {mark.is_absent ? (
                            <Badge colorScheme="red">Absent</Badge>
                          ) : (
                            <Badge colorScheme="green">Present</Badge>
                          )}
                        </Td>
                        <Td>
                          <Tooltip 
                            label={!hasAccess?.canEdit ? "You don't have permission to edit marks" : "Edit marks"}
                            placement="top"
                          >
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              colorScheme="blue"
                              aria-label="Edit marks"
                              onClick={() => handleEditClick(mark)}
                              isDisabled={!hasAccess?.canEdit}
                            />
                          </Tooltip>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>

            {/* Summary Statistics */}
            <Box mt={6} p={4} bg="gray.50" borderRadius="md">
              <Heading size="sm" mb={3}>Summary Statistics</Heading>
              <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                <Box>
                  <Text fontSize="sm" color="gray.600">Total Students</Text>
                  <Text fontSize="2xl" fontWeight="bold">{marksData.length}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">Highest Marks</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    {Math.max(...marksData.map(m => m.marks_obtained))}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">Lowest Marks</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="red.500">
                    {Math.min(...marksData.map(m => m.marks_obtained))}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">Average Marks</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                    {(marksData.reduce((sum, m) => sum + m.marks_obtained, 0) / marksData.length).toFixed(2)}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">Pass Rate</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                    {((marksData.filter(m => getPercentage(m.marks_obtained, m.max_marks) >= 40).length / marksData.length) * 100).toFixed(2)}%
                  </Text>
                </Box>
              </Box>
            </Box>
          </CardBody>
        </Card>
      )}

      {showMarks && marksData.length === 0 && (
        <Alert status="info">
          <AlertIcon />
          <AlertDescription>
            No marks found for the selected criteria.
          </AlertDescription>
        </Alert>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={handleEditCancel} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Student Marks</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingMark && (
              <Box>
                <Text mb={4}>
                  <strong>Student:</strong> {editingMark.student_id ? 
                    [editingMark.student_id.firstName, editingMark.student_id.middleName, editingMark.student_id.lastName]
                      .filter(Boolean).join(' ') : 'N/A'}
                </Text>
                <Text mb={4}>
                  <strong>Student ID:</strong> {editingMark.student_id?.studentId || 'N/A'}
                </Text>
                <Text mb={4}>
                  <strong>Maximum Marks:</strong> {editingMark.max_marks}
                </Text>

                <FormControl mb={4}>
                  <Checkbox
                    isChecked={editFormData.is_absent}
                    onChange={(e) => setEditFormData({ ...editFormData, is_absent: e.target.checked })}
                  >
                    Mark as Absent
                  </Checkbox>
                </FormControl>

                <FormControl mb={4} isRequired={!editFormData.is_absent}>
                  <FormLabel>Marks Obtained</FormLabel>
                  <Input
                    type="number"
                    value={editFormData.marks_obtained}
                    onChange={(e) => setEditFormData({ ...editFormData, marks_obtained: e.target.value })}
                    placeholder="Enter marks"
                    min="0"
                    max={editingMark.max_marks}
                    isDisabled={editFormData.is_absent}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Remarks (Optional)</FormLabel>
                  <Input
                    value={editFormData.remarks}
                    onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                    placeholder="Enter remarks"
                  />
                </FormControl>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleEditCancel}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleEditSave}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ViewStudentMarks;
