import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_ROLES } from '../../../constants/roles';
import { 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Button,
  Spinner,
  Box
} from '@chakra-ui/react';
import { 
  ArrowBackIcon,
  AddIcon,
  EditIcon,
  ViewIcon,
  InfoIcon
} from '@chakra-ui/icons';
import MarksEntry from './MarksEntry';
import ViewStudentMarks from './ViewStudentMarks';

// Lazy load StudentPerformance and ResultPublish to avoid circular dependency issues
const StudentPerformance = lazy(() => import('./StudentPerformance'));
const ResultPublish = lazy(() => import('./ResultPublish'));
import './ExaminationResultManagement.css';

const ExaminationResultManagement = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [modalType, setModalType] = useState('');
  
  const isSuperAdmin = !!user && user.role === USER_ROLES.SUPER_ADMIN;

  // Tab configuration
  const tabConfig = [
    { id: 'marks-entry', label: 'Marks Entry', modalType: 'marks-entry' },
    { id: 'view-marks', label: 'View Student Marks', modalType: 'view-marks' },
    { id: 'student-performance', label: 'Student Performance', modalType: 'student-performance' }
  ];

  const handleBackToDashboard = () => {
    navigate('/super-admin');
  };

  const handleAddNew = () => {
    const currentTab = tabConfig[activeTab];
    setModalType(''); // Reset first
    setTimeout(() => {
      setModalType(currentTab.modalType); // Then set new value
    }, 0);
  };

  const getAddButtonText = () => {
    const currentTab = tabConfig[activeTab];
    return `Add New ${currentTab.label}`;
  };

  return (
    <>
      <div className="enhanced-fees-header">
        <div className="header-left">
          <Button leftIcon={<ArrowBackIcon />} onClick={handleBackToDashboard} colorScheme='gray'>
            Back to Dashboard
          </Button>
        </div>
      </div>
      <Tabs 
        variant='soft-rounded' 
        index={activeTab}
        onChange={setActiveTab}
        sx={{
          '& .chakra-tabs__tablist': {
            display: 'flex !important',
            background: '#f8f9fa !important',
            borderRadius: '8px !important',
            padding: '6px !important',
            border: '1px solid #e9ecef !important',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1) !important',
            marginTop: '12px',
            flexWrap: 'wrap',
            gap: '8px',
            margin: '10px 20px'
          },
          '& .chakra-tabs__tab': {
            color: 'var(--tab-text-default)',
            borderColor: 'var(--tab-blue)',
            borderRadius: '6px',
            transition: 'all 0.02s ease',
            flex: '1 1 auto',
            minWidth: '250px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: 'white',
            border: '1px solid #e9ecef'
          },
          '& .chakra-tabs__tab:hover': {
            color: 'var(--tab-text-hover)',
            backgroundColor: 'var(--tab-bg-hover)'
          },
          '& .chakra-tabs__tab[aria-selected="true"]': {
            backgroundColor: 'var(--tab-blue)',
            color: 'var(--tab-text-selected)',
            borderRadius: '6px'
          },
          // Responsive behavior for smaller screens
          '@media (max-width: 768px)': {
            '& .chakra-tabs__tablist': {
              flexDirection: 'column',
              gap: '8px',
              background: 'white',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e9ecef'
            },
            '& .chakra-tabs__tab': {
              width: '100%',
              minWidth: 'unset',
              marginBottom: '0px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              justifyContent: 'space-between',
              padding: '12px 16px',
              '&:hover': {
                backgroundColor: '#f8f9fa'
              }
            },
            '& .chakra-tabs__tab[aria-selected="true"]': {
              backgroundColor: 'var(--tab-blue)',
              color: 'white',
              borderRadius: '6px'
            }
          }
        }}
      >
        <TabList mb='1em'>
          <Tab>
            <span>Marks Entry</span>
            <EditIcon />
          </Tab>
          <Tab>
            <span>View Student Marks</span>
            <ViewIcon />
          </Tab>
          <Tab>
            <span>Student Performance</span>
            <InfoIcon />
          </Tab>
          {isSuperAdmin && (
            <Tab>
              <span>Result Publish</span>
              <InfoIcon />
            </Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            <MarksEntry />
          </TabPanel>
          <TabPanel>
            <ViewStudentMarks />
          </TabPanel>
          <TabPanel>
            <Suspense fallback={
              <Box textAlign="center" py={8}>
                <Spinner size="xl" color="blue.500" />
              </Box>
            }>
              <StudentPerformance />
            </Suspense>
          </TabPanel>
          {isSuperAdmin && (
            <TabPanel>
              <Suspense fallback={
                <Box textAlign="center" py={8}>
                  <Spinner size="xl" color="blue.500" />
                </Box>
              }>
                <ResultPublish user={user} />
              </Suspense>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default ExaminationResultManagement;
