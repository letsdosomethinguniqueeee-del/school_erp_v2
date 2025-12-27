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
  useToast,
  HStack,
  Divider
} from '@chakra-ui/react';
import { Checkbox, CheckboxGroup, IconButton, NumberInput, NumberInputField } from '@chakra-ui/react';
import ResponsiveTable from '../../Shared/ResponsiveTable/ResponsiveTable';
import api from '../../../config/axios';
import { API_ENDPOINTS } from '../../../constants/api';

const ExaminationConfig = ({ modalType, onDataChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    examCode: '',
    examName: ''
  });

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editingExam, setEditingExam] = useState(null);
  const [editFormData, setEditFormData] = useState({ 
    examCode: '', 
    examName: '', 
    maxMarks: 100,
    classIds: [],
    mediumIds: []
  });

  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [viewingExam, setViewingExam] = useState(null);

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deletingExam, setDeletingExam] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // classes and mediums fetched from backend (from Class and Medium tables)
  const [classes, setClasses] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedMediumIds, setSelectedMediumIds] = useState([]);

  // Dynamic exams list for the form: { examName, maxMarks }
  const [examsList, setExamsList] = useState([
    { examName: '', maxMarks: '' }
  ]);

  const fetchExams = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get(API_ENDPOINTS.EXAMINATIONS);
      if (response.data.success) {
        const transformed = response.data.data.map(item => ({
          id: item._id,
          examCode: item.exam_code,
          examName: item.exam_name,
          maxMarks: item.max_marks || 100,
          classIds: item.class_ids || [],
          mediumIds: item.medium_ids || [],
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        setExams(transformed);
      } else {
        toast({ title: 'Error', description: 'Failed to fetch examinations', status: 'error', duration: 3000, isClosable: true });
      }
    } catch (error) {
      console.error('Error fetching examinations:', error);
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to fetch examinations', status: 'error', duration: 3000, isClosable: true });
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => { fetchExams(true); }, []);

  useEffect(() => {
    if (modalType === 'examination') onOpen();
  }, [modalType, onOpen]);

  const columns = [
    { key: 'examCode', label: 'Exam Code', minWidth: '120px' },
    { key: 'examName', label: 'Exam Name', minWidth: '150px' },
    { key: 'maxMarks', label: 'Max Marks', minWidth: '100px' },
    { key: 'createdAt', label: 'Created At', minWidth: '120px', type: 'datetime' },
    { key: 'updatedAt', label: 'Updated At', minWidth: '140px', type: 'datetime' }
  ];

  // helper: generate a short unique exam code from exam name
  const generateExamCode = (name) => {
    if (!name) return `EXAM${Date.now() % 10000}`;
    const cleaned = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return (cleaned.slice(0, 6) || 'EXAM') + String(Date.now() % 10000);
  };

  // fetch active classes from Class database
  const fetchClasses = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CLASSES);
      if (response.data && response.data.success) {
        // Filter active classes if is_active field exists
        const allClasses = response.data.data || [];
        const activeClasses = allClasses.filter(c => c.is_active !== false);
        setClasses(activeClasses);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  // fetch active mediums from Medium database
  const fetchMediums = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.MEDIUMS);
      if (response.data && response.data.success) {
        // Filter active mediums if is_active field exists
        const allMediums = response.data.data || [];
        const activeMediums = allMediums.filter(m => m.is_active !== false);
        setMediums(activeMediums);
      }
    } catch (err) {
      console.error('Error fetching mediums:', err);
    }
  };

  useEffect(() => { 
    fetchClasses(); 
    fetchMediums();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassIds.length) {
      toast({ title: 'Validation', description: 'Please select at least one class', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    if (!selectedMediumIds.length) {
      toast({ title: 'Validation', description: 'Please select at least one medium', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    if (!examsList.length || examsList.every(x => !x.examName.trim())) {
      toast({ title: 'Validation', description: 'Please add at least one exam with a name', status: 'warning', duration: 3000, isClosable: true });
      return;
    }

    setSubmitting(true);
    try {
      // Prepare exams data
      const examsData = examsList
        .filter(item => item.examName.trim())
        .map(item => ({
          exam_name: item.examName.trim(),
          max_marks: item.maxMarks || 100
        }));

      // Call bulk create endpoint
      const backendData = {
        class_ids: selectedClassIds,
        medium_ids: selectedMediumIds,
        exams: examsData
      };

      const response = await api.post(API_ENDPOINTS.EXAMINATIONS_BULK, backendData);
      
      if (response.data && response.data.success) {
        const created = response.data.data?.created || [];
        const errors = response.data.data?.errors || [];
        
        await fetchExams();
        
        if (errors.length > 0) {
          toast({ 
            title: 'Partial Success', 
            description: `${created.length} exam(s) created successfully. ${errors.length} failed.`, 
            status: 'warning', 
            duration: 4000, 
            isClosable: true 
          });
        } else {
          toast({ 
            title: 'Success', 
            description: `${created.length} exam(s) created successfully with class and medium associations.`, 
            status: 'success', 
            duration: 4000, 
            isClosable: true 
          });
        }
        
        if (onDataChange) onDataChange();
        onClose();
        setSelectedClassIds([]);
        setSelectedMediumIds([]);
        setExamsList([{ examName: '', maxMarks: '' }]);
      }
    } catch (error) {
      console.error('Error creating examinations:', error);
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to create examinations', status: 'error', duration: 3000, isClosable: true });
    } finally { setSubmitting(false); }
  };

  const handleEdit = (row) => {
    setEditingExam(row);
    setEditFormData({ 
      examCode: row.examCode, 
      examName: row.examName,
      maxMarks: row.maxMarks || 100,
      classIds: row.classIds || [],
      mediumIds: row.mediumIds || []
    });
    onEditOpen();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.classIds || editFormData.classIds.length === 0) {
      toast({ title: 'Validation', description: 'Please select at least one class', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    if (!editFormData.mediumIds || editFormData.mediumIds.length === 0) {
      toast({ title: 'Validation', description: 'Please select at least one medium', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    
    setSubmitting(true);
    try {
      const backendData = { 
        exam_code: editFormData.examCode, 
        exam_name: editFormData.examName,
        max_marks: editFormData.maxMarks || 100,
        class_ids: editFormData.classIds,
        medium_ids: editFormData.mediumIds
      };
      const response = await api.put(API_ENDPOINTS.EXAMINATION_BY_ID(editingExam.id), backendData);
      if (response.data.success) {
        await fetchExams();
        toast({ title: 'Success', description: 'Examination updated successfully', status: 'success', duration: 3000, isClosable: true });
        if (onDataChange) onDataChange();
        onEditClose();
        setEditingExam(null);
      } else {
        toast({ title: 'Error', description: 'Failed to update examination', status: 'error', duration: 3000, isClosable: true });
      }
    } catch (error) {
      console.error('Error updating examination:', error);
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to update examination', status: 'error', duration: 3000, isClosable: true });
    } finally { setSubmitting(false); }
  };

  const handleDelete = (row) => { setDeletingExam(row); onDeleteOpen(); };

  const handleDeleteConfirm = async () => {
    if (!deletingExam) return;
    setDeleting(true);
    try {
  const response = await api.delete(API_ENDPOINTS.EXAMINATION_BY_ID(deletingExam.id));
      if (response.data.success) {
        await fetchExams();
        onDeleteClose();
        setDeletingExam(null);
        toast({ title: 'Success', description: 'Examination deleted successfully', status: 'success', duration: 3000, isClosable: true });
        if (onDataChange) onDataChange();
      } else {
        toast({ title: 'Error', description: 'Failed to delete examination', status: 'error', duration: 3000, isClosable: true });
      }
    } catch (error) {
      console.error('Error deleting examination:', error);
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to delete examination', status: 'error', duration: 3000, isClosable: true });
    } finally { setDeleting(false); }
  };

  const handleView = (row) => { setViewingExam(row); onViewOpen(); };

  return (
    <>
      <Box p={0}>
        <Heading
          as="h1"
          fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}
          fontWeight="600"
          lineHeight="1.3"
          mb={4}
        >
          Examinations Management
        </Heading>
        <Text
          fontSize={{ base: '0.685rem', sm: '0.685rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }}
          color="gray.600"
          lineHeight="1.6"
          mb={4}
        >
          Manage examinations for your school. Add new exams and manage schedules.
        </Text>

        <ResponsiveTable
          data={exams}
          columns={columns}
          pageSize={5}
          showPagination
          showPageSizeSelector
          showTotalCount
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortable
          searchable
          searchPlaceholder="Search by exam code, name..."
          searchFields={["examCode","examName"]}
          loading={loading}
          emptyMessage={loading ? 'Loading examinations...' : "No examinations found. Click 'Add New Examination' to create one."}
          maxHeight="500px"
          stickyHeader
          variant="simple"
          size="md"
        />
      </Box>

      {/* Add Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior='inside' isCentered motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}>Add New Examination</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Classes (select one or more)</FormLabel>
                  <CheckboxGroup value={selectedClassIds} onChange={(vals)=>setSelectedClassIds(vals)}>
                    <VStack align="start">
                      {classes.length === 0 && <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.500">No classes found.</Text>}
                      {classes.map(cl => (
                        <Checkbox key={cl._id} value={cl._id}>{cl.class_name}</Checkbox>
                      ))}
                    </VStack>
                  </CheckboxGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mediums (select one or more)</FormLabel>
                  <CheckboxGroup value={selectedMediumIds} onChange={(vals)=>setSelectedMediumIds(vals)}>
                    <VStack align="start">
                      {mediums.length === 0 && <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.500">No mediums found.</Text>}
                      {mediums.map(md => (
                        <Checkbox key={md._id} value={md._id}>{md.medium_name}</Checkbox>
                      ))}
                    </VStack>
                  </CheckboxGroup>
                </FormControl>

                <Divider />

                <FormControl>
                  <FormLabel>Exams (Name and Max Marks)</FormLabel>
                  <VStack spacing={3} align="stretch">
                    {examsList.map((row, idx) => (
                      <HStack key={idx} spacing={3}>
                        <Input placeholder="Exam name" value={row.examName} onChange={(e)=>{
                          const copy = [...examsList]; copy[idx].examName = e.target.value; setExamsList(copy);
                        }} />
                        <NumberInput min={0} value={row.maxMarks} onChange={(_, val)=>{
                          const copy = [...examsList]; copy[idx].maxMarks = val; setExamsList(copy);
                        }}>
                          <NumberInputField placeholder="Max marks" />
                        </NumberInput>
                        <Button colorScheme="red" onClick={()=>{
                          const copy = examsList.filter((_, i)=>i !== idx); setExamsList(copy.length ? copy : [{ examName: '', maxMarks: '' }]);
                        }}>Remove</Button>
                      </HStack>
                    ))}
                    <Button variant="outline" onClick={()=>setExamsList([...examsList, { examName: '', maxMarks: '' }])}>Add another exam</Button>
                  </VStack>
                </FormControl>
                <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.500">Note: Exams will be created with the selected class and medium associations for test mark entries.</Text>
              </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleSubmit} isLoading={submitting} loadingText="Creating...">Add Examination</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="md" scrollBehavior='inside' isCentered motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}>Edit Examination</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Exam Code</FormLabel>
                <Input value={editFormData.examCode} onChange={(e)=>setEditFormData({...editFormData, examCode: e.target.value})} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Exam Name</FormLabel>
                <Input value={editFormData.examName} onChange={(e)=>setEditFormData({...editFormData, examName: e.target.value})} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Max Marks</FormLabel>
                <NumberInput min={0} value={editFormData.maxMarks} onChange={(_, val)=>setEditFormData({...editFormData, maxMarks: val})}>
                  <NumberInputField placeholder="Max marks" />
                </NumberInput>
              </FormControl>

              <Divider />

              <FormControl isRequired>
                <FormLabel>Classes (select one or more)</FormLabel>
                <CheckboxGroup value={editFormData.classIds} onChange={(vals)=>setEditFormData({...editFormData, classIds: vals})}>
                  <VStack align="start">
                    {classes.length === 0 && <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.500">No classes found.</Text>}
                    {classes.map(cl => (
                      <Checkbox key={cl._id} value={cl._id}>{cl.class_name}</Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Mediums (select one or more)</FormLabel>
                <CheckboxGroup value={editFormData.mediumIds} onChange={(vals)=>setEditFormData({...editFormData, mediumIds: vals})}>
                  <VStack align="start">
                    {mediums.length === 0 && <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.500">No mediums found.</Text>}
                    {mediums.map(md => (
                      <Checkbox key={md._id} value={md._id}>{md.medium_name}</Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleEditSubmit} isLoading={submitting} loadingText="Updating...">Update Examination</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="md" scrollBehavior='inside' isCentered motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader><Heading fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} color="gray.700">Examination Information</Heading></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewingExam && (
              <VStack spacing={6} align="stretch">
                <Box>
                  <HStack spacing={2} mb={4}><Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">📅</Text><Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">Basic Information</Text></HStack>
                  <VStack spacing={3} align="stretch">
                    <Box><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Exam Code</Text><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">{viewingExam.examCode}</Text></Box>
                    <Box><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Exam Name</Text><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">{viewingExam.examName}</Text></Box>
                    <Box><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Max Marks</Text><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">{viewingExam.maxMarks || 100}</Text></Box>
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <HStack spacing={2} mb={4}><Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">🏫</Text><Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">Associated Classes</Text></HStack>
                  <VStack spacing={2} align="stretch">
                    {(!viewingExam.classIds || viewingExam.classIds.length === 0) && (
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.500">No classes associated</Text>
                    )}
                    {viewingExam.classIds && viewingExam.classIds.length > 0 && (
                      <VStack align="start" spacing={1}>
                        {viewingExam.classIds.map((classId, idx) => {
                          const classData = classes.find(c => c._id === classId);
                          return (
                            <Text key={idx} fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.700">
                              • {classData ? classData.class_name : classId}
                            </Text>
                          );
                        })}
                      </VStack>
                    )}
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <HStack spacing={2} mb={4}><Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">🌐</Text><Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">Associated Mediums</Text></HStack>
                  <VStack spacing={2} align="stretch">
                    {(!viewingExam.mediumIds || viewingExam.mediumIds.length === 0) && (
                      <Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.500">No mediums associated</Text>
                    )}
                    {viewingExam.mediumIds && viewingExam.mediumIds.length > 0 && (
                      <VStack align="start" spacing={1}>
                        {viewingExam.mediumIds.map((mediumId, idx) => {
                          const mediumData = mediums.find(m => m._id === mediumId);
                          return (
                            <Text key={idx} fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.700">
                              • {mediumData ? mediumData.medium_name : mediumId}
                            </Text>
                          );
                        })}
                      </VStack>
                    )}
                  </VStack>
                </Box>
                <Divider />
                <Box>
                  <HStack spacing={2} mb={4}><Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">⏰</Text><Text fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} fontWeight="bold" color="blue.600">Timestamps</Text></HStack>
                  <VStack spacing={3} align="stretch">
                    <Box><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Created At</Text><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">{new Date(viewingExam.createdAt).toLocaleString()}</Text></Box>
                    <Box><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} fontWeight="600" color="gray.600" mb={1}>Updated At</Text><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.800">{new Date(viewingExam.updatedAt).toLocaleString()}</Text></Box>
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter><Button colorScheme="blue" onClick={onViewClose}>Close</Button></ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md" scrollBehavior='inside' isCentered motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent mx={4} my={16}>
          <ModalHeader><Heading fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }} color="red.600">Delete Examination</Heading></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deletingExam && (
              <VStack spacing={4} align="stretch"><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="gray.700">Are you sure you want to delete examination <Text as="span" fontWeight="bold">{deletingExam.examName}</Text>?</Text><Text fontSize={{ base: '0.685rem', sm: '0.75rem', md: '0.75rem', lg: '0.825rem', xl: '0.825rem' }} color="red.600" fontWeight="500">This action is permanent and cannot be undone.</Text></VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose} isDisabled={deleting}>Cancel</Button>
            <Button colorScheme="red" onClick={handleDeleteConfirm} isLoading={deleting} loadingText="Deleting...">Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExaminationConfig;
