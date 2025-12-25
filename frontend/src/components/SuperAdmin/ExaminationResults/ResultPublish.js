import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Select,
  Text,
  Card,
  CardBody,
  Heading,
  Grid,
  HStack,
  useToast
} from '@chakra-ui/react';
import axios from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';
import { USER_ROLES } from '../../../constants/roles';

const ResultPublish = ({ user }) => {
  const toast = useToast();
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [testsForPublish, setTestsForPublish] = useState([]);
  const [selectedTestForPublish, setSelectedTestForPublish] = useState('');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClassForPublish, setSelectedClassForPublish] = useState('');
  const [selectedSectionForPublish, setSelectedSectionForPublish] = useState('');
  const [selectedYearForFinal, setSelectedYearForFinal] = useState('');

  useEffect(() => {
    fetchAcademicYears();
    fetchClasses();
    fetchSections();
  }, []);

  useEffect(() => {
    if (selectedAcademicYear) fetchTests();
  }, [selectedAcademicYear]);

  const fetchAcademicYears = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.ACADEMIC_YEARS);
      const data = res.data.data || res.data.academicYears || [];
      setAcademicYears(data);
    } catch (err) {
      console.error('Error fetching academic years', err);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.EXAMINATIONS, { params: { academic_year_id: selectedAcademicYear } });
      const data = res.data.data || res.data.examinations || [];
      setTestsForPublish(data);
    } catch (err) {
      console.error('Error fetching tests for publish', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.CLASSES);
      const data = res.data.data || res.data.classes || [];
      setClasses(data);
    } catch (err) {
      console.error('Error fetching classes', err);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.SECTIONS);
      const data = res.data.data || res.data.sections || [];
      setSections(data);
    } catch (err) {
      console.error('Error fetching sections', err);
    }
  };

  const isSuperAdmin = !!user && user.role === USER_ROLES.SUPER_ADMIN;

  const handlePublishResult = async () => {
    if (!selectedTestForPublish || !selectedClassForPublish || !selectedSectionForPublish || !selectedAcademicYear) {
      toast({ title: 'Validation', description: 'Please select Academic Year, Exam, Class and Section', status: 'warning', duration: 3000, isClosable: true });
      return;
    }

    if (!isSuperAdmin) {
      toast({ title: 'Access Denied', description: 'Only Super Admin can publish results', status: 'error', duration: 3000, isClosable: true });
      return;
    }

    try {
      const payload = {
        exam_id: selectedTestForPublish,
        class_id: selectedClassForPublish,
        section_id: selectedSectionForPublish,
        academic_year_id: selectedAcademicYear
      };
      await axios.post(API_ENDPOINTS.PUBLISH_EXAM_RESULTS, payload);
      toast({ title: 'Published', description: 'Results published successfully', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      console.error('Publish error:', error);
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to publish results', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handlePublishFinalResult = async () => {
    if (!isSuperAdmin) {
      toast({ title: 'Access Denied', description: 'Only Super Admin can publish final yearly results', status: 'error', duration: 3000, isClosable: true });
      return;
    }

    if (!selectedYearForFinal) {
      toast({ title: 'Validation', description: 'Please select Academic Year for final submission', status: 'warning', duration: 3000, isClosable: true });
      return;
    }

    try {
      const payload = { academic_year_id: selectedYearForFinal };
      await axios.post(API_ENDPOINTS.PUBLISH_FINAL_RESULTS, payload);
      toast({ title: 'Final Published', description: 'Final yearly results published successfully', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      console.error('Final publish error:', error);
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to publish final results', status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Box>
      <Card mb={6}>
        <CardBody>
          <Heading size="md" mb={3}>Result Publish</Heading>
          <Text fontSize="sm" color="gray.600" mb={3}>Only Super Admin can publish results. Select an exam, class and section to publish results for the selected academic year.</Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={3}>
            <Select placeholder="Select Academic Year" value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)}>
              {academicYears.map((y) => (
                <option key={y._id} value={y._id}>{y.year_code}</option>
              ))}
            </Select>
            <Select placeholder="Select Exam" value={selectedTestForPublish} onChange={(e) => setSelectedTestForPublish(e.target.value)}>
              {testsForPublish.map((t) => (
                <option key={t._id} value={t._id}>{t.exam_name} {t.max_marks ? ` (Max: ${t.max_marks})` : ''}</option>
              ))}
            </Select>
            <Select placeholder="Select Class" value={selectedClassForPublish} onChange={(e) => setSelectedClassForPublish(e.target.value)}>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>{c.class_name}</option>
              ))}
            </Select>
            <Select placeholder="Select Section" value={selectedSectionForPublish} onChange={(e) => setSelectedSectionForPublish(e.target.value)}>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>{s.section_name}</option>
              ))}
            </Select>
          </Grid>
          <HStack>
            <Button colorScheme="blue" onClick={handlePublishResult} isDisabled={!isSuperAdmin}>Publish</Button>
            {!isSuperAdmin && (
              <Text color="gray.500" fontSize="sm">Only Super Admin can publish results.</Text>
            )}
          </HStack>
        </CardBody>
      </Card>

      <Card mb={6}>
        <CardBody>
          <Heading size="md" mb={3}>Final Result: Yearly Submission</Heading>
          <Text fontSize="sm" color="gray.600" mb={3}>Only Super Admin can publish final yearly results. This action is irreversible.</Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={3}>
            <Select placeholder="Select Academic Year" value={selectedYearForFinal} onChange={(e) => setSelectedYearForFinal(e.target.value)}>
              {academicYears.map((y) => (
                <option key={y._id} value={y._id}>{y.year_code}</option>
              ))}
            </Select>
            <Box />
          </Grid>
          <HStack>
            <Button colorScheme="red" onClick={handlePublishFinalResult} isDisabled={!isSuperAdmin}>Publish Final Result</Button>
            {!isSuperAdmin && (
              <Text color="gray.500" fontSize="sm">Only Super Admin can perform final yearly submission.</Text>
            )}
          </HStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ResultPublish;
