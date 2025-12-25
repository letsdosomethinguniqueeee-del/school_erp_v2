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
  Box,
  Text,
  useDisclosure,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Progress,
  Flex,
  IconButton
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import './StudentFees.css';

const StudentFees = ({ academicYear }) => {
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const studentsPerPage = 5;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const toast = useToast();
  const [transactionForm, setTransactionForm] = useState({
    studentId: '',
    amount: '',
    amountMode: 'Cash',
    feesType: '',
    transactionId: '',
    receiptId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const classes = [
    'Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th',
    '6th', '7th', '8th', '9th', '10th', '11th', '12th'
  ];

  const feeTypes = [
    'Tuition Fee', 'Library Fee', 'Sports Fee', 'Transport Fee', 
    'Exam Fee', 'Development Fee', 'Other'
  ];

  const paymentModes = ['Cash', 'Cheque', 'Online Transfer', 'UPI', 'Card'];

  // Initial load - fetch students immediately
  useEffect(() => {
    console.log('=== INITIAL LOAD ===');
    fetchStudents();
    fetchTransactions();
    fetchFeeStructures();
  }, []);

  // Refetch when dependencies change
  useEffect(() => {
    console.log('=== DEPENDENCY CHANGE ===');
    console.log('Academic Year:', academicYear);
    console.log('Selected Class:', selectedClass);
    console.log('Current Page:', currentPage);
    fetchStudents();
  }, [academicYear, selectedClass, currentPage]);

  // Debug effect to log data changes
  useEffect(() => {
    console.log('=== DATA STATE CHANGED ===');
    console.log('Students:', students);
    console.log('Transactions:', transactions);
    console.log('Fee Structures:', feeStructures);
  }, [students, transactions, feeStructures]);

  const fetchStudents = async () => {
    setLoading(true);
    console.log('=== FETCHING STUDENTS ===');
    console.log('Selected class:', selectedClass);
    console.log('Current page:', currentPage);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (selectedClass) {
        params.append('class', selectedClass);
      }
      // Add pagination parameters
      params.append('page', currentPage);
      params.append('limit', studentsPerPage);
      
      const url = `/api/students?${params.toString()}`;
      console.log('API URL:', url);
      
      const response = await axios.get(url);
      console.log('API Response:', response.data);
      
      // Handle pagination response
      if (response.data.totalPages !== undefined) {
      setStudents(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalStudents(response.data.total || 0);
        console.log('Students loaded from API:', response.data.data?.length || 0);
        console.log('Total pages from API:', response.data.totalPages);
        console.log('Total students from API:', response.data.total);
        console.log('Will show pagination?', response.data.totalPages > 1);
      } else {
        // Fallback for non-paginated response - calculate pagination manually
        const allStudents = response.data.data || [];
        const calculatedTotalPages = Math.ceil(allStudents.length / studentsPerPage);
        setStudents(allStudents);
        setTotalPages(calculatedTotalPages);
        setTotalStudents(allStudents.length);
        console.log('Students loaded from API (fallback):', allStudents.length);
        console.log('Calculated total pages:', calculatedTotalPages);
        console.log('Will show pagination?', calculatedTotalPages > 1);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // Mock data for demo with pagination
      const mockStudents = [
        {
          _id: '1',
          firstName: 'Yash',
          lastName: 'Agarwal',
          rollNo: '001',
          currentStudyClass: '10th',
          parentName: 'Raj Agarwal',
          email: 'yash.agarwal@example.com'
        },
        {
          _id: '2',
          firstName: 'Shivam',
          lastName: 'Gupta',
          rollNo: '002',
          currentStudyClass: '10th',
          parentName: 'Amit Gupta',
          email: 'shivam.gupta@example.com'
        },
        {
          _id: '3',
          firstName: 'Vikram',
          lastName: 'Yadav',
          rollNo: '005',
          currentStudyClass: '1st',
          parentName: 'Raj Yadav',
          email: 'vikram.yadav@example.com'
        },
        {
          _id: '4',
          firstName: 'Ananya',
          lastName: 'Joshi',
          rollNo: '006',
          currentStudyClass: '1st',
          parentName: 'Priya Joshi',
          email: 'ananya.joshi@example.com'
        },
        {
          _id: '5',
          firstName: 'Karan',
          lastName: 'Malhotra',
          rollNo: '007',
          currentStudyClass: '1st',
          parentName: 'Amit Malhotra',
          email: 'karan.malhotra@example.com'
        },
        {
          _id: '6',
          firstName: 'Isha',
          lastName: 'Agarwal',
          rollNo: '008',
          currentStudyClass: '1st',
          parentName: 'Sunita Agarwal',
          email: 'isha.agarwal@example.com'
        },
        {
          _id: '7',
          firstName: 'Aditya',
          lastName: 'Chopra',
          rollNo: '009',
          currentStudyClass: '2nd',
          parentName: 'Ravi Chopra',
          email: 'aditya.chopra@example.com'
        },
        {
          _id: '8',
          firstName: 'Kavya',
          lastName: 'Reddy',
          rollNo: '010',
          currentStudyClass: '2nd',
          parentName: 'Suresh Reddy',
          email: 'kavya.reddy@example.com'
        },
        {
          _id: '9',
          firstName: 'Rohan',
          lastName: 'Nair',
          rollNo: '011',
          currentStudyClass: '2nd',
          parentName: 'Kumar Nair',
          email: 'rohan.nair@example.com'
        },
        {
          _id: '10',
          firstName: 'Divya',
          lastName: 'Iyer',
          rollNo: '012',
          currentStudyClass: '2nd',
          parentName: 'Raj Iyer',
          email: 'divya.iyer@example.com'
        },
        {
          _id: '11',
          firstName: 'Manish',
          lastName: 'Tiwari',
          rollNo: '013',
          currentStudyClass: '2nd',
          parentName: 'Amit Tiwari',
          email: 'manish.tiwari@example.com'
        },
        {
          _id: '12',
          firstName: 'Pooja',
          lastName: 'Mishra',
          rollNo: '014',
          currentStudyClass: '2nd',
          parentName: 'Sunita Mishra',
          email: 'pooja.mishra@example.com'
        },
        {
          _id: '13',
          firstName: 'Rajesh',
          lastName: 'Kumar',
          rollNo: '015',
          currentStudyClass: '3rd',
          parentName: 'Vikram Kumar',
          email: 'rajesh.kumar@example.com'
        }
      ];
      
      // Simulate pagination for mock data
      const startIndex = (currentPage - 1) * studentsPerPage;
      const endIndex = startIndex + studentsPerPage;
      const paginatedStudents = mockStudents.slice(startIndex, endIndex);
      
      console.log('Using mock data - Total students:', mockStudents.length);
      console.log('Pagination - Start:', startIndex, 'End:', endIndex);
      console.log('Students to show:', paginatedStudents.length);
      console.log('Total pages will be:', Math.ceil(mockStudents.length / studentsPerPage));
      console.log('Students:', paginatedStudents.map(s => `${s.firstName} ${s.lastName} (${s.currentStudyClass})`));
      
      setStudents(paginatedStudents);
      setTotalPages(Math.ceil(mockStudents.length / studentsPerPage));
      setTotalStudents(mockStudents.length);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/transactions?sessionYear=${academicYear}`);
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Mock data for demo - different transactions for different students
      setTransactions([
        {
          _id: '1',
          studentId: '1', // Yash Agarwal
          amount: 8000,
          amountMode: 'Cash',
          feesType: 'Tuition Fee',
          transactionId: 'TXN001',
          receiptId: 'RCP001',
          date: '2024-09-26',
          sessionYear: academicYear
        }
        // Shivam Gupta (student ID '2') has no transactions - showing as unpaid
      ]);
    }
  };

  const fetchFeeStructures = async () => {
    try {
      console.log('Fetching fee structures for academic year:', academicYear);
      const response = await axios.get(`/api/fees?sessionYear=${academicYear}`);
      console.log('Fee structures response:', response.data);
      setFeeStructures(response.data.data || []);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      console.log('Using mock fee structures for demo');
      // Mock data for demo - different fees for different classes
      const mockFeeStructures = [
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
        },
        {
          _id: '2',
          SessionYear: academicYear,
          Class: '10th',
          FeesBreakDown: [
            { title: 'Tuition Fee', amount: '60000' },
            { title: 'Mess Fee', amount: '8000' },
            { title: 'Hostel Fee', amount: '10000' },
            { title: 'Admission Fee', amount: '2000' },
            { title: 'Transport Fee', amount: '3000' }
          ],
          InstallmentBreakDown: [
            { installment: '1st Installment', amount: '20000', dueDate: '2024-04-01' },
            { installment: '2nd Installment', amount: '20000', dueDate: '2024-07-01' },
            { installment: '3rd Installment', amount: '20000', dueDate: '2024-10-01' }
          ]
        }
      ];
      setFeeStructures(mockFeeStructures);
      console.log('Mock fee structures set:', mockFeeStructures);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Class filtering is now done server-side, so we only need to filter by search term
    return matchesSearch;
  });

  const getStudentTransactions = (studentId) => {
    console.log(`=== GET STUDENT TRANSACTIONS ===`);
    console.log(`Looking for transactions for student ID: ${studentId}`);
    console.log(`All transactions:`, transactions);
    
    const result = transactions.filter(txn => txn.studentId === studentId);
    console.log(`Filtered transactions for student ${studentId}:`, result);
    return result;
  };

  const getTotalPaid = (studentId) => {
    return getStudentTransactions(studentId).reduce((total, txn) => total + txn.amount, 0);
  };

  const getFeeStructureForClass = (className) => {
    console.log(`=== GET FEE STRUCTURE FOR CLASS ===`);
    console.log(`Looking for class: ${className}, academic year: ${academicYear}`);
    console.log(`Available fee structures:`, feeStructures);
    
    const result = feeStructures.find(structure => 
      structure.Class === className && structure.SessionYear === academicYear
    );
    
    console.log(`Found fee structure:`, result);
    return result;
  };

  const calculateTotalFee = (className, student = null) => {
    const feeStructure = getFeeStructureForClass(className);
    console.log(`Calculating fee for class ${className}:`, feeStructure);
    
    if (!feeStructure || !feeStructure.FeesBreakDown) {
      console.log(`No fee structure found for class ${className}, using default 5800`);
      return 5800; // Default fallback fee
    }
    
    let totalFee = feeStructure.FeesBreakDown.reduce((total, fee) => {
      return total + parseFloat(fee.amount || 0);
    }, 0);
    
    // Apply concession to tuition fees if student has concession
    if (student && student.concessionPercentage > 0) {
      const tuitionFeeAmount = getFeeAmountForType(className, 'Tuition Fee') || getFeeAmountForType(className, 'Tuition Fees');
      if (tuitionFeeAmount > 0) {
        const concessionAmount = (tuitionFeeAmount * student.concessionPercentage) / 100;
        totalFee = totalFee - concessionAmount;
        console.log(`Applied ${student.concessionPercentage}% concession to tuition fee: -${concessionAmount}, New total: ${totalFee}`);
      }
    }
    
    console.log(`Total fee calculated for class ${className}:`, totalFee);
    return totalFee;
  };

  const getFeeBreakdown = (className, student = null) => {
    const feeStructure = getFeeStructureForClass(className);
    if (!feeStructure || !feeStructure.FeesBreakDown) {
      // Default fallback breakdown
      return [
        { title: 'Tuition Fee', amount: '5000' },
        { title: 'Library Fee', amount: '500' },
        { title: 'Sports Fee', amount: '300' }
      ];
    }
    
    let feeBreakdown = [...feeStructure.FeesBreakDown];
    
    // Apply concession to tuition fees if student has concession
    if (student && student.concessionPercentage > 0) {
      feeBreakdown = feeBreakdown.map(fee => {
        if (fee.title.toLowerCase().includes('tuition')) {
          const originalAmount = parseFloat(fee.amount);
          const concessionAmount = (originalAmount * student.concessionPercentage) / 100;
          const newAmount = originalAmount - concessionAmount;
          return {
            ...fee,
            amount: newAmount.toString(),
            originalAmount: originalAmount,
            concessionAmount: concessionAmount,
            concessionPercentage: student.concessionPercentage
          };
        }
        return fee;
      });
    }
    
    return feeBreakdown;
  };

  const calculatePaymentProgress = (totalPaid, totalFee) => {
    if (totalFee === 0) return 0;
    return Math.round((totalPaid / totalFee) * 100);
  };

  const getFeeAmountForType = (className, feeType) => {
    const feeStructure = getFeeStructureForClass(className);
    if (!feeStructure || !feeStructure.FeesBreakDown) {
      return 0;
    }
    
    const feeItem = feeStructure.FeesBreakDown.find(fee => 
      fee.title.toLowerCase() === feeType.toLowerCase()
    );
    return feeItem ? parseFloat(feeItem.amount) : 0;
  };

  const getPaidAmountForFeeType = (studentId, feeType) => {
    const studentTransactions = getStudentTransactions(studentId);
    return studentTransactions
      .filter(txn => {
        // Use the same flexible matching logic as getInstallmentProgress
        const transactionType = txn.feesType.toLowerCase().trim();
        const feeTypeNormalized = feeType.toLowerCase().trim();
        
        // Check exact match first
        let match = transactionType === feeTypeNormalized;
        
        // If no exact match, check for common variations
        if (!match) {
          if (transactionType === 'tuition fee' && feeTypeNormalized === 'tuition fees') match = true;
          if (transactionType === 'tuition fees' && feeTypeNormalized === 'tuition fee') match = true;
          if (transactionType === 'mess fee' && feeTypeNormalized === 'mess fees') match = true;
          if (transactionType === 'mess fees' && feeTypeNormalized === 'mess fee') match = true;
          if (transactionType === 'hostel fee' && feeTypeNormalized === 'hostel fees') match = true;
          if (transactionType === 'hostel fees' && feeTypeNormalized === 'hostel fee') match = true;
          if (transactionType === 'admission fee' && feeTypeNormalized === 'admission fees') match = true;
          if (transactionType === 'admission fees' && feeTypeNormalized === 'admission fee') match = true;
          if (transactionType === 'transport fee' && feeTypeNormalized === 'transport fees') match = true;
          if (transactionType === 'transport fees' && feeTypeNormalized === 'transport fee') match = true;
        }
        
        return match;
      })
      .reduce((total, txn) => total + txn.amount, 0);
  };

  const getRemainingAmountForFeeType = (studentId, className, feeType) => {
    const totalFeeAmount = getFeeAmountForType(className, feeType);
    const paidAmount = getPaidAmountForFeeType(studentId, feeType);
    return Math.max(0, totalFeeAmount - paidAmount);
  };

  const getInstallmentBreakdown = (className) => {
    const feeStructure = getFeeStructureForClass(className);
    if (!feeStructure || !feeStructure.InstallmentBreakDown) {
      // Default fallback installments
      return [
        { installment: '1st Installment', amount: '2900', dueDate: '2024-04-01' },
        { installment: '2nd Installment', amount: '2900', dueDate: '2024-07-01' }
      ];
    }
    return feeStructure.InstallmentBreakDown;
  };

  const getInstallmentProgress = (studentId, className, feeType) => {
    console.log(`=== FEE-TYPE SPECIFIC INSTALLMENT PROGRESS ===`);
    console.log(`Student ID: ${studentId}, Class: ${className}, Fee Type: ${feeType}`);
    
    // Get fee structure
    const feeStructure = getFeeStructureForClass(className);
    console.log(`Fee structure found:`, feeStructure);
    
    if (!feeStructure || !feeStructure.InstallmentBreakDown) {
      console.log(`No fee structure or installments found`);
      return [];
    }

    // Get student transactions
    const studentTransactions = getStudentTransactions(studentId);
    console.log(`Student transactions:`, studentTransactions);
    
    // Filter for this fee type with flexible matching
    const feeTransactions = studentTransactions.filter(txn => {
      // Normalize both strings for comparison
      const transactionType = txn.feesType.toLowerCase().trim();
      const feeTypeNormalized = feeType.toLowerCase().trim();
      
      // Check exact match first
      let match = transactionType === feeTypeNormalized;
      
      // If no exact match, check for common variations
      if (!match) {
        // Handle singular/plural variations
        if (transactionType === 'tuition fee' && feeTypeNormalized === 'tuition fees') match = true;
        if (transactionType === 'tuition fees' && feeTypeNormalized === 'tuition fee') match = true;
        if (transactionType === 'mess fee' && feeTypeNormalized === 'mess fees') match = true;
        if (transactionType === 'mess fees' && feeTypeNormalized === 'mess fee') match = true;
        if (transactionType === 'hostel fee' && feeTypeNormalized === 'hostel fees') match = true;
        if (transactionType === 'hostel fees' && feeTypeNormalized === 'hostel fee') match = true;
        if (transactionType === 'admission fee' && feeTypeNormalized === 'admission fees') match = true;
        if (transactionType === 'admission fees' && feeTypeNormalized === 'admission fee') match = true;
        if (transactionType === 'transport fee' && feeTypeNormalized === 'transport fees') match = true;
        if (transactionType === 'transport fees' && feeTypeNormalized === 'transport fee') match = true;
      }
      
      console.log(`Checking transaction: "${txn.feesType}" vs "${feeType}" = ${match}`);
      console.log(`Normalized: "${transactionType}" vs "${feeTypeNormalized}"`);
      console.log(`Transaction details:`, txn);
      return match;
    });
    
    console.log(`Filtered fee transactions:`, feeTransactions);
    
    // Calculate total paid
    const totalPaidForFee = feeTransactions.reduce((total, txn) => total + txn.amount, 0);
    console.log(`Total paid for ${feeType}: ${totalPaidForFee}`);
    
    // Get the fee amount for this specific fee type
    const feeBreakdown = getFeeBreakdown(className);
    console.log(`Available fee types in breakdown:`, feeBreakdown.map(f => f.title));
    const feeInfo = feeBreakdown.find(fee => fee.title === feeType);
    console.log(`Fee info for ${feeType}:`, feeInfo);
    
    if (!feeInfo) {
      console.log(`No fee info found for ${feeType}`);
      return [];
    }
    
    const totalFeeAmount = parseFloat(feeInfo.amount);
    console.log(`Total fee amount for ${feeType}: ${totalFeeAmount}`);
    
    // Calculate installment amount based on fee type
    // For now, let's assume equal distribution across installments
    const installmentCount = feeStructure.InstallmentBreakDown.length;
    const installmentAmount = totalFeeAmount / installmentCount;
    console.log(`Installment amount for ${feeType}: ${installmentAmount} (${totalFeeAmount} / ${installmentCount})`);
    
    // Calculate progress for first installment
    const progressPercentage = Math.round((totalPaidForFee / installmentAmount) * 100);
    console.log(`Progress calculation: ${totalPaidForFee} / ${installmentAmount} = ${progressPercentage}%`);
    
    // Return result with fee-type specific amount
    const result = [{
      installment: '1st Installment',
      amount: installmentAmount,
      paidAmount: totalPaidForFee,
      remainingAmount: installmentAmount - totalPaidForFee,
      progressPercentage: Math.min(progressPercentage, 100),
      isCompleted: progressPercentage >= 100,
      isOverdue: false,
      dueDate: feeStructure.InstallmentBreakDown[0]?.dueDate || new Date('2025-09-01')
    }];
    
    console.log(`Final result for ${feeType}:`, result);
    return result;
  };

  const getFeeTypeInstallmentProgress = (studentId, className, student = null) => {
    console.log(`=== GET FEE TYPE INSTALLMENT PROGRESS ===`);
    console.log(`Student ID: ${studentId}, Class: ${className}`);
    
    const feeBreakdown = getFeeBreakdown(className, student);
    console.log(`Fee breakdown for class ${className}:`, feeBreakdown);
    
    const result = feeBreakdown.map(fee => {
      console.log(`\n--- Processing fee: "${fee.title}" ---`);
      const installmentProgress = getInstallmentProgress(studentId, className, fee.title);
      console.log(`Installment progress for "${fee.title}":`, installmentProgress);
      
      return {
        ...fee,
        amount: parseFloat(fee.amount),
        installmentProgress: installmentProgress
      };
    });
    
    console.log(`\n=== FINAL RESULT ===`);
    console.log(`Final result:`, result);
    return result;
  };

  const handleAddTransaction = (student) => {
    setSelectedStudent(student);
    setTransactionForm({
      studentId: student._id,
      amount: '',
      amountMode: 'Cash',
      feesType: '',
      transactionId: '',
      receiptId: '',
      date: new Date().toISOString().split('T')[0]
    });
    onOpen();
  };

  const handleViewDetails = (student) => {
    setSelectedStudentForDetails(student);
    onDetailsOpen();
  };

  const handleClassChange = (classValue) => {
    setSelectedClass(classValue);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearchChange = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFeeTypeChange = (feeType) => {
    if (!selectedStudent) return;
    
    const remainingAmount = getRemainingAmountForFeeType(
      selectedStudent._id, 
      selectedStudent.currentStudyClass, 
      feeType
    );
    
    setTransactionForm(prev => ({
      ...prev,
      feesType: feeType,
      amount: remainingAmount > 0 ? remainingAmount.toString() : ''
    }));
  };

  const validateAmount = (amount, feeType) => {
    if (!selectedStudent || !feeType) return true;
    
    const remainingAmount = getRemainingAmountForFeeType(
      selectedStudent._id,
      selectedStudent.currentStudyClass,
      feeType
    );
    
    return parseFloat(amount) <= remainingAmount;
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    
    // Validate amount
    if (!validateAmount(transactionForm.amount, transactionForm.feesType)) {
      toast({
        title: 'Invalid Amount',
        description: `Amount cannot exceed the remaining balance for ${transactionForm.feesType}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post('/api/transactions', {
        ...transactionForm,
        sessionYear: academicYear
      });
      
      toast({
        title: 'Payment added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
      setSelectedStudent(null);
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: 'Error adding payment',
        description: 'Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getFeeStatus = (student) => {
    const totalPaid = getTotalPaid(student._id);
    const totalFee = calculateTotalFee(student.currentStudyClass, student);
    
    if (totalPaid === 0) return { status: 'unpaid', color: '#e74c3c' };
    if (totalPaid < totalFee) return { status: 'partial', color: '#f39c12' };
    return { status: 'paid', color: '#27ae60' };
  };

  if (loading && students.length === 0) {
    return (
      <div className="student-fees-loading">
        <div className="loading-spinner"></div>
        <p>Loading student fees...</p>
      </div>
    );
  }

  return (
    <div className="student-fees">
      <div className="student-fees-header">
        <h2>Student Fees for {academicYear}</h2>
        
        <div className="filters">
          <div className="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          
          <select
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="class-filter"
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <Box bg="white" borderRadius="md" boxShadow="sm" overflow="hidden">
        <Table variant="simple" size="md">
          <Thead bg="gray.50">
            <Tr>
              <Th width="25%">Student Details</Th>
              <Th width="8%">Class</Th>
              <Th width="12%">Payment Status</Th>
              <Th width="12%">Total Fee</Th>
              <Th width="12%">Paid Amount</Th>
              <Th width="12%">Balance</Th>
              <Th width="10%">Progress</Th>
              <Th width="9%">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
        {filteredStudents.map((student) => {
          const feeStatus = getFeeStatus(student);
          const studentTransactions = getStudentTransactions(student._id);
          const totalPaid = getTotalPaid(student._id);
              const totalFee = calculateTotalFee(student.currentStudyClass, student);
              const paymentProgress = calculatePaymentProgress(totalPaid, totalFee);
          
          return (
                <Tr key={student._id} _hover={{ bg: "gray.50" }}>
                  <Td>
                    <Flex align="center">
                      <Text fontWeight="medium">
                        {student.firstName} {student.lastName}
                      </Text>
                      <Text fontSize="sm" color="gray.600" ml={2}>
                        Roll: {student.rollNo}
                      </Text>
                    </Flex>
                  </Td>
                  <Td>
                    <Text>{student.currentStudyClass}</Text>
                  </Td>
                  <Td>
                    <Badge 
                      colorScheme={feeStatus.status === 'PAID' ? 'green' : feeStatus.status === 'PARTIAL' ? 'orange' : 'red'}
                      variant="subtle"
                    >
                      {feeStatus.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontWeight="medium">₹{totalFee.toLocaleString()}</Text>
                  </Td>
                  <Td>
                    <Text color="green.600" fontWeight="medium">
                      ₹{totalPaid.toLocaleString()}
                    </Text>
                  </Td>
                  <Td>
                    <Text color="red.600" fontWeight="medium">
                      ₹{(totalFee - totalPaid).toLocaleString()}
                    </Text>
                  </Td>
                  <Td>
                    <VStack spacing={1} align="start">
                      <Text fontSize="sm" fontWeight="medium">
                        {paymentProgress}%
                      </Text>
                      <Progress 
                        value={paymentProgress} 
                        size="sm" 
                        colorScheme={paymentProgress === 100 ? 'green' : paymentProgress > 0 ? 'orange' : 'red'}
                        width="80px"
                      />
                    </VStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                    onClick={() => handleAddTransaction(student)}
                  >
                    Add Payment
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(student)}
                        title="View Details"
                      >
                        <ChevronRightIcon />
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
          );
        })}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="flex-end" alignItems="center">
          <HStack spacing={1}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(1)}
              isDisabled={currentPage === 1}
              bg={currentPage === 1 ? "gray.100" : "white"}
              color={currentPage === 1 ? "gray.400" : "gray.700"}
              borderColor="gray.300"
              _hover={currentPage === 1 ? {} : { bg: "gray.50" }}
              borderRadius="md"
              px={3}
              py={1}
              fontSize="sm"
            >
              First
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              isDisabled={currentPage === 1}
              bg={currentPage === 1 ? "gray.100" : "white"}
              color={currentPage === 1 ? "gray.400" : "gray.700"}
              borderColor="gray.300"
              _hover={currentPage === 1 ? {} : { bg: "gray.50" }}
              borderRadius="md"
              px={3}
              py={1}
              fontSize="sm"
            >
              Previous
            </Button>
            
            <Text fontSize="sm" color="gray.700" mx={3} fontWeight="medium">
              Page {currentPage} of {totalPages}
            </Text>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              bg={currentPage === totalPages ? "gray.100" : "white"}
              color={currentPage === totalPages ? "gray.400" : "gray.700"}
              borderColor="gray.300"
              _hover={currentPage === totalPages ? {} : { bg: "gray.50" }}
              borderRadius="md"
              px={3}
              py={1}
              fontSize="sm"
            >
              Next
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(totalPages)}
              isDisabled={currentPage === totalPages}
              bg={currentPage === totalPages ? "gray.100" : "white"}
              color={currentPage === totalPages ? "gray.400" : "gray.700"}
              borderColor="gray.300"
              _hover={currentPage === totalPages ? {} : { bg: "gray.50" }}
              borderRadius="md"
              px={3}
              py={1}
              fontSize="sm"
            >
              Last
            </Button>
          </HStack>
        </Box>
      )}


      {filteredStudents.length === 0 && (
        <div className="no-students">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          <h3>No students found</h3>
          <p>No students match your search criteria.</p>
        </div>
      )}

      {/* Transaction Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="900px" maxH="95vh" overflowY="auto">
          <ModalHeader fontSize="lg" fontWeight="bold">
            Add Payment for {selectedStudent?.firstName} {selectedStudent?.lastName}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            {/* Fee Structure and Installment Information */}
            {selectedStudent && (
              <Box mb={6} p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="lg" fontWeight="semibold" mb={3}>Fee Structure & Installments</Text>
                
                {/* Fee Breakdown */}
                <Box mb={4}>
                  <Text fontSize="md" fontWeight="medium" mb={2}>Fee Breakdown:</Text>
                  <VStack spacing={2} align="stretch">
                    {getFeeBreakdown(selectedStudent.currentStudyClass).map((fee, index) => {
                      const paidAmount = getPaidAmountForFeeType(selectedStudent._id, fee.title);
                      const remainingAmount = getRemainingAmountForFeeType(selectedStudent._id, selectedStudent.currentStudyClass, fee.title);
                      return (
                        <HStack key={index} justify="space-between" p={2} bg="white" borderRadius="md">
                          <Text fontSize="sm">{fee.title}</Text>
                          <VStack spacing={0} align="end">
                            <Text fontSize="sm" fontWeight="medium">₹{parseFloat(fee.amount).toLocaleString()}</Text>
                            <Text fontSize="xs" color="green.600">Paid: ₹{paidAmount.toLocaleString()}</Text>
                            <Text fontSize="xs" color="red.600">Remaining: ₹{remainingAmount.toLocaleString()}</Text>
                          </VStack>
                        </HStack>
                      );
                    })}
                  </VStack>
                </Box>

                {/* Fee-Specific Installment Breakdown */}
                <Box>
                  <Text fontSize="md" fontWeight="medium" mb={2}>Fee-Specific Installments:</Text>
                  <VStack spacing={3} align="stretch">
                    {getFeeBreakdown(selectedStudent.currentStudyClass).map((fee, index) => {
                      const feeStructure = getFeeStructureForClass(selectedStudent.currentStudyClass);
                      const installmentCount = feeStructure?.InstallmentBreakDown?.length || 3;
                      const installmentAmount = parseFloat(fee.amount) / installmentCount;
                      const paidAmount = getPaidAmountForFeeType(selectedStudent._id, fee.title);
                      const progressPercentage = Math.round((paidAmount / installmentAmount) * 100);
                      
                      return (
                        <Box key={index} p={3} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                          <Text fontSize="sm" fontWeight="medium" mb={2}>{fee.title}</Text>
                          <VStack spacing={1} align="stretch">
                            <HStack justify="space-between">
                              <Text fontSize="xs" color="gray.600">1st Installment</Text>
                              <VStack spacing={0} align="end">
                                <Text fontSize="xs" fontWeight="medium">₹{installmentAmount.toLocaleString()}</Text>
                                <Text fontSize="xs" color={progressPercentage > 0 ? "green.600" : "gray.600"}>
                                  {progressPercentage}% paid (₹{paidAmount.toLocaleString()}/₹{installmentAmount.toLocaleString()})
                                </Text>
                              </VStack>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="xs" color="gray.600">2nd Installment</Text>
                              <Text fontSize="xs" fontWeight="medium">₹{installmentAmount.toLocaleString()}</Text>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="xs" color="gray.600">3rd Installment</Text>
                              <Text fontSize="xs" fontWeight="medium">₹{installmentAmount.toLocaleString()}</Text>
                            </HStack>
                          </VStack>
                        </Box>
                      );
                    })}
                  </VStack>
                </Box>
              </Box>
            )}

            {/* Payment Form */}
            <Box mt={6} p={4} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
              <Text fontSize="lg" fontWeight="semibold" mb={4}>Payment Details</Text>
              
            <form onSubmit={handleSubmitTransaction}>
                <VStack spacing={6} align="stretch">
                  {/* Row 1: Fee Type and Amount */}
                  <HStack spacing={4} align="start">
                    <FormControl isRequired flex={1}>
                      <FormLabel fontSize="sm" fontWeight="medium">Fee Type *</FormLabel>
                      <Select
                        value={transactionForm.feesType}
                        onChange={(e) => handleFeeTypeChange(e.target.value)}
                        placeholder="Select Fee Type"
                        size="md"
                      >
                        {feeTypes.map(type => {
                          const remainingAmount = selectedStudent ? 
                            getRemainingAmountForFeeType(selectedStudent._id, selectedStudent.currentStudyClass, type) : 0;
                          return (
                            <option 
                              key={type} 
                              value={type}
                              disabled={remainingAmount <= 0}
                            >
                              {type} {remainingAmount > 0 ? `(₹${remainingAmount.toLocaleString()} remaining)` : '(Fully Paid)'}
                            </option>
                          );
                        })}
                      </Select>
                    </FormControl>
                    
                    <FormControl isRequired flex={1}>
                      <FormLabel fontSize="sm" fontWeight="medium">Amount *</FormLabel>
                    <Input
                      type="number"
                      value={transactionForm.amount}
                      onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Enter amount"
                        size="md"
                        max={selectedStudent ? getRemainingAmountForFeeType(selectedStudent._id, selectedStudent.currentStudyClass, transactionForm.feesType) : undefined}
                    />
                      {transactionForm.feesType && selectedStudent && (
                        <Text fontSize="xs" color="blue.600" mt={1}>
                          Max: ₹{getRemainingAmountForFeeType(selectedStudent._id, selectedStudent.currentStudyClass, transactionForm.feesType).toLocaleString()}
                        </Text>
                      )}
                  </FormControl>
                  </HStack>

                  {/* Row 2: Payment Mode and Date */}
                  <HStack spacing={4} align="start">
                    <FormControl isRequired flex={1}>
                      <FormLabel fontSize="sm" fontWeight="medium">Payment Mode *</FormLabel>
                    <Select
                      value={transactionForm.amountMode}
                      onChange={(e) => setTransactionForm(prev => ({ ...prev, amountMode: e.target.value }))}
                        size="md"
                    >
                      {paymentModes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </Select>
                  </FormControl>
                    
                    <FormControl isRequired flex={1}>
                      <FormLabel fontSize="sm" fontWeight="medium">Date *</FormLabel>
                    <Input
                      type="date"
                      value={transactionForm.date}
                      onChange={(e) => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                        size="md"
                    />
                  </FormControl>
                </HStack>

                  {/* Row 3: Transaction ID and Receipt ID */}
                  <HStack spacing={4} align="start">
                    <FormControl flex={1}>
                      <FormLabel fontSize="sm" fontWeight="medium">Transaction ID</FormLabel>
                    <Input
                      type="text"
                      value={transactionForm.transactionId}
                      onChange={(e) => setTransactionForm(prev => ({ ...prev, transactionId: e.target.value }))}
                      placeholder="Enter transaction ID"
                        size="md"
                    />
                  </FormControl>
                    
                    <FormControl flex={1}>
                      <FormLabel fontSize="sm" fontWeight="medium">Receipt ID</FormLabel>
                    <Input
                      type="text"
                      value={transactionForm.receiptId}
                      onChange={(e) => setTransactionForm(prev => ({ ...prev, receiptId: e.target.value }))}
                      placeholder="Enter receipt ID"
                        size="md"
                    />
                  </FormControl>
                </HStack>
              </VStack>
            </form>
            </Box>
          </ModalBody>

          <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.200">
            <HStack spacing={3}>
              <Button 
                variant="outline" 
                onClick={onClose}
                size="md"
              >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmitTransaction}
              isLoading={loading}
                loadingText="Adding Payment..."
                size="md"
                isDisabled={!transactionForm.feesType || !transactionForm.amount}
            >
              Add Payment
            </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Student Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="900px" maxH="95vh" overflowY="auto">
          <ModalHeader fontSize="lg" fontWeight="bold">
            Fee Details for {selectedStudentForDetails?.firstName} {selectedStudentForDetails?.lastName}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            {selectedStudentForDetails && (
              <VStack spacing={6} align="stretch">
                {/* Student Summary */}
                <Box p={4} bg="gray.50" borderRadius="md">
                  <HStack justify="space-between" mb={3}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="lg" fontWeight="bold">
                        {selectedStudentForDetails.firstName} {selectedStudentForDetails.lastName}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Roll No: {selectedStudentForDetails.rollNo} | Class: {selectedStudentForDetails.currentStudyClass}
                      </Text>
                    </VStack>
                    <Badge 
                      colorScheme={getFeeStatus(selectedStudentForDetails).status === 'PAID' ? 'green' : getFeeStatus(selectedStudentForDetails).status === 'PARTIAL' ? 'orange' : 'red'}
                      variant="subtle"
                      fontSize="md"
                      px={3}
                      py={1}
                    >
                      {getFeeStatus(selectedStudentForDetails).status}
                    </Badge>
                  </HStack>
                  
                  <HStack spacing={6} justify="center">
                    <VStack spacing={1}>
                      <Text fontSize="sm" color="gray.600">Total Fee</Text>
                      <Text fontSize="lg" fontWeight="bold">₹{calculateTotalFee(selectedStudentForDetails.currentStudyClass, selectedStudentForDetails).toLocaleString()}</Text>
                    </VStack>
                    <VStack spacing={1}>
                      <Text fontSize="sm" color="gray.600">Paid Amount</Text>
                      <Text fontSize="lg" fontWeight="bold" color="green.600">₹{getTotalPaid(selectedStudentForDetails._id).toLocaleString()}</Text>
                    </VStack>
                    <VStack spacing={1}>
                      <Text fontSize="sm" color="gray.600">Balance</Text>
                      <Text fontSize="lg" fontWeight="bold" color="red.600">₹{(calculateTotalFee(selectedStudentForDetails.currentStudyClass, selectedStudentForDetails) - getTotalPaid(selectedStudentForDetails._id)).toLocaleString()}</Text>
                    </VStack>
                    <VStack spacing={1}>
                      <Text fontSize="sm" color="gray.600">Progress</Text>
                      <Text fontSize="lg" fontWeight="bold">{calculatePaymentProgress(getTotalPaid(selectedStudentForDetails._id), calculateTotalFee(selectedStudentForDetails.currentStudyClass, selectedStudentForDetails))}%</Text>
                    </VStack>
                  </HStack>
                </Box>

                {/* Fee Breakdown & Installments */}
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>Fee Breakdown & Installments</Text>
                  
                  {getFeeTypeInstallmentProgress(selectedStudentForDetails._id, selectedStudentForDetails.currentStudyClass, selectedStudentForDetails).map((fee, index) => (
                    <Box key={index} bg="white" p={4} borderRadius="md" border="1px solid" borderColor="gray.200" mb={4}>
                      <HStack justify="space-between" mb={3}>
                        <Text fontSize="lg" fontWeight="medium">{fee.title}</Text>
                        <Text fontSize="lg" fontWeight="medium">₹{fee.amount.toLocaleString()}</Text>
                      </HStack>
                      
                      {fee.installmentProgress.map((installment, instIndex) => (
                        <Box key={instIndex} mb={3} p={3} bg="gray.50" borderRadius="md">
                          <HStack justify="space-between" mb={2}>
                            <Text fontSize="md" fontWeight="medium" color="gray.700">
                              {installment.installment}
                            </Text>
                            <Text fontSize="md" fontWeight="medium">
                              ₹{installment.amount.toLocaleString()}
                            </Text>
                          </HStack>
                          
                          <Progress 
                            value={installment.progressPercentage} 
                            size="md" 
                            colorScheme={installment.progressPercentage === 100 ? 'green' : installment.progressPercentage > 0 ? 'orange' : 'red'}
                            mb={2}
                          />
                          
                          <HStack justify="space-between">
                            <Text fontSize="sm" color="gray.600">
                              {installment.progressPercentage}% ({installment.paidAmount.toLocaleString()}/₹{installment.amount.toLocaleString()})
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              Due: {new Date(installment.dueDate).toLocaleDateString()}
                            </Text>
                          </HStack>
                        </Box>
                      ))}
                    </Box>
                  ))}
                  
                  {/* Recent Transactions */}
                  <Box bg="white" p={4} borderRadius="md" border="1px solid" borderColor="gray.200">
                    <Text fontSize="lg" fontWeight="semibold" mb={3}>Recent Transactions</Text>
                    {getStudentTransactions(selectedStudentForDetails._id).length > 0 ? (
                      <VStack spacing={3} align="stretch">
                        {getStudentTransactions(selectedStudentForDetails._id).slice(0, 5).map((txn) => (
                          <HStack key={txn._id} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                            <VStack spacing={0} align="start">
                              <Text fontSize="md" fontWeight="medium">{txn.feesType}</Text>
                              <Text fontSize="sm" color="gray.600">
                                {new Date(txn.date).toLocaleDateString()} • {txn.amountMode}
                              </Text>
                            </VStack>
                            <Text fontSize="md" fontWeight="medium" color="green.600">
                              ₹{txn.amount.toLocaleString()}
                            </Text>
                          </HStack>
                        ))}
                        {getStudentTransactions(selectedStudentForDetails._id).length > 5 && (
                          <Text fontSize="sm" color="gray.600" textAlign="center">
                            +{getStudentTransactions(selectedStudentForDetails._id).length - 5} more transactions
                          </Text>
                        )}
                      </VStack>
                    ) : (
                      <Text fontSize="md" color="gray.600" textAlign="center" py={4}>
                        No transactions yet
                      </Text>
                    )}
                  </Box>
                </Box>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.200">
            <HStack spacing={3}>
              <Button 
                variant="outline" 
                onClick={onDetailsClose}
                size="md"
              >
                Close
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  onDetailsClose();
                  handleAddTransaction(selectedStudentForDetails);
                }}
                size="md"
            >
              Add Payment
            </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StudentFees;
