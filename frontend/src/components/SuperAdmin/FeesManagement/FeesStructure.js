import React, { useState, useEffect } from 'react';
import axios from '../../../config/axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  IconButton,
  Box,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import './FeesStructure.css';

const FeesStructure = ({ academicYear }) => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    SessionYear: academicYear,
    Class: '',
    FeesBreakDown: [{ title: '', amount: '' }],
    InstallmentBreakDown: [{ installment: '', amount: '', dueDate: '' }]
  });

  const classes = [
    'Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th',
    '6th', '7th', '8th', '9th', '10th', '11th', '12th'
  ];

  useEffect(() => {
    fetchFeeStructures();
  }, [academicYear]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, SessionYear: academicYear }));
  }, [academicYear]);

  const fetchFeeStructures = async () => {
    setLoading(true);
    try {
      console.log('Fetching fee structures for academic year:', academicYear);
      const response = await axios.get(`/api/fees?sessionYear=${academicYear}`);
      console.log('Fee structures response:', response.data);
      setFeeStructures(response.data.data || []);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // For demo purposes, show some mock data
      setFeeStructures([
        {
          _id: '1',
          SessionYear: academicYear,
          Class: '1st',
          FeesBreakDown: [
            { title: 'Tuition Fee', amount: '5000' },
            { title: 'Library Fee', amount: '500' },
            { title: 'Sports Fee', amount: '300' }
          ],
          InstallmentBreakDown: [
            { installment: '1st Installment', amount: '2900', dueDate: '2024-04-01' },
            { installment: '2nd Installment', amount: '2900', dueDate: '2024-07-01' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Submitting form data:', formData);
      
      if (editingStructure) {
        console.log('Updating fee structure with ID:', editingStructure._id);
        const response = await axios.patch(`/api/fees/${editingStructure._id}`, formData);
        console.log('Update response:', response.data);
        toast({
          title: 'Fee structure updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.log('Creating new fee structure');
        const response = await axios.post('/api/fees', formData);
        console.log('Create response:', response.data);
        toast({
          title: 'Fee structure created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      onClose();
      setEditingStructure(null);
      setFormData({
        SessionYear: academicYear,
        Class: '',
        FeesBreakDown: [{ title: '', amount: '' }],
        InstallmentBreakDown: [{ installment: '', amount: '', dueDate: '' }]
      });
      fetchFeeStructures();
    } catch (error) {
      console.error('Error saving fee structure:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Please try again.';
      
      toast({
        title: 'Error saving fee structure',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (structure) => {
    setEditingStructure(structure);
    setFormData({
      SessionYear: structure.SessionYear,
      Class: structure.Class,
      FeesBreakDown: structure.FeesBreakDown.length > 0 ? structure.FeesBreakDown : [{ title: '', amount: '' }],
      InstallmentBreakDown: structure.InstallmentBreakDown.length > 0 ? structure.InstallmentBreakDown : [{ installment: '', amount: '', dueDate: '' }]
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fee structure?')) {
      try {
        await axios.delete(`/api/fees/${id}`);
        toast({
          title: 'Fee structure deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchFeeStructures();
      } catch (error) {
        console.error('Error deleting fee structure:', error);
        toast({
          title: 'Error deleting fee structure',
          description: 'Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const addFeeBreakdown = () => {
    setFormData(prev => ({
      ...prev,
      FeesBreakDown: [...prev.FeesBreakDown, { title: '', amount: '' }]
    }));
  };

  const removeFeeBreakdown = (index) => {
    setFormData(prev => ({
      ...prev,
      FeesBreakDown: prev.FeesBreakDown.filter((_, i) => i !== index)
    }));
  };

  const updateFeeBreakdown = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      FeesBreakDown: prev.FeesBreakDown.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addInstallmentBreakdown = () => {
    setFormData(prev => ({
      ...prev,
      InstallmentBreakDown: [...prev.InstallmentBreakDown, { installment: '', amount: '', dueDate: '' }]
    }));
  };

  const removeInstallmentBreakdown = (index) => {
    setFormData(prev => ({
      ...prev,
      InstallmentBreakDown: prev.InstallmentBreakDown.filter((_, i) => i !== index)
    }));
  };

  const updateInstallmentBreakdown = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      InstallmentBreakDown: prev.InstallmentBreakDown.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotalFees = (feesBreakdown) => {
    return feesBreakdown.reduce((total, fee) => total + parseFloat(fee.amount || 0), 0);
  };

  if (loading && feeStructures.length === 0) {
    return (
      <div className="fees-structure-loading">
        <div className="loading-spinner"></div>
        <p>Loading fee structures...</p>
      </div>
    );
  }

  return (
    <div className="fees-structure">
      <div className="fees-structure-header">
        <h2>Fee Structures for {academicYear}</h2>
        <button 
          className="add-structure-btn"
          onClick={() => {
            onOpen();
            setEditingStructure(null);
            setFormData({
              SessionYear: academicYear,
              Class: '',
              FeesBreakDown: [{ title: '', amount: '' }],
              InstallmentBreakDown: [{ installment: '', amount: '', dueDate: '' }]
            });
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Fee Structure
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader>
            {editingStructure ? 'Edit Fee Structure' : 'Add New Fee Structure'}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Class</FormLabel>
                  <Select
                    value={formData.Class}
                    onChange={(e) => setFormData(prev => ({ ...prev, Class: e.target.value }))}
                    placeholder="Select Class"
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={3}>Fees Breakdown</Text>
                  <VStack spacing={3} align="stretch">
                    {formData.FeesBreakDown.map((fee, index) => (
                      <HStack key={index} spacing={3}>
                        <Input
                          placeholder="Fee Title"
                          value={fee.title}
                          onChange={(e) => updateFeeBreakdown(index, 'title', e.target.value)}
                          required
                        />
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={fee.amount}
                          onChange={(e) => updateFeeBreakdown(index, 'amount', e.target.value)}
                          required
                        />
                        {formData.FeesBreakDown.length > 1 && (
                          <IconButton
                            aria-label="Remove fee item"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFeeBreakdown(index)}
                          />
                        )}
                      </HStack>
                    ))}
                    <Button
                      leftIcon={<AddIcon />}
                      variant="outline"
                      onClick={addFeeBreakdown}
                      size="sm"
                    >
                      Add Fee Item
                    </Button>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={3}>Installment Breakdown</Text>
                  <VStack spacing={3} align="stretch">
                    {formData.InstallmentBreakDown.map((installment, index) => (
                      <HStack key={index} spacing={3}>
                        <Input
                          placeholder="Installment Name"
                          value={installment.installment}
                          onChange={(e) => updateInstallmentBreakdown(index, 'installment', e.target.value)}
                          required
                        />
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={installment.amount}
                          onChange={(e) => updateInstallmentBreakdown(index, 'amount', e.target.value)}
                          required
                        />
                        <Input
                          type="date"
                          value={installment.dueDate}
                          onChange={(e) => updateInstallmentBreakdown(index, 'dueDate', e.target.value)}
                          required
                        />
                        {formData.InstallmentBreakDown.length > 1 && (
                          <IconButton
                            aria-label="Remove installment"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            onClick={() => removeInstallmentBreakdown(index)}
                          />
                        )}
                      </HStack>
                    ))}
                    <Button
                      leftIcon={<AddIcon />}
                      variant="outline"
                      onClick={addInstallmentBreakdown}
                      size="sm"
                    >
                      Add Installment
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Saving..."
            >
              {editingStructure ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="fee-structures-grid">
        {feeStructures.map((structure) => (
          <div key={structure._id} className="fee-structure-card">
            <div className="card-header">
              <h3>Class {structure.Class}</h3>
              <div className="card-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(structure)}
                  title="Edit"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(structure._id)}
                  title="Delete"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="card-content">
              <div className="fees-breakdown">
                <h4>Fees Breakdown</h4>
                <div className="fees-list">
                  {structure.FeesBreakDown.map((fee, index) => (
                    <div key={index} className="fee-item">
                      <span className="fee-title">{fee.title}</span>
                      <span className="fee-amount">₹{fee.amount}</span>
                    </div>
                  ))}
                  <div className="fee-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">₹{calculateTotalFees(structure.FeesBreakDown)}</span>
                  </div>
                </div>
              </div>

              <div className="installment-breakdown">
                <h4>Installments</h4>
                <div className="installments-list">
                  {structure.InstallmentBreakDown.map((installment, index) => (
                    <div key={index} className="installment-item">
                      <span className="installment-name">{installment.installment}</span>
                      <span className="installment-amount">₹{installment.amount}</span>
                      <span className="installment-date">
                        {new Date(installment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {feeStructures.length === 0 && !loading && (
        <div className="no-data">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <h3>No Fee Structures Found</h3>
          <p>No fee structures have been created for {academicYear} yet.</p>
          <button 
            className="create-first-btn"
            onClick={() => {
              onOpen();
              setEditingStructure(null);
              setFormData({
                SessionYear: academicYear,
                Class: '',
                FeesBreakDown: [{ title: '', amount: '' }],
                InstallmentBreakDown: [{ installment: '', amount: '', dueDate: '' }]
              });
            }}
          >
            Create First Fee Structure
          </button>
        </div>
      )}
    </div>
  );
};

export default FeesStructure;
