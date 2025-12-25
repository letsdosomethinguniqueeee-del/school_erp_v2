import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Button
} from '@chakra-ui/react';
import { 
  ArrowBackIcon,
  LockIcon,
  AddIcon,
  ViewIcon,
  SettingsIcon,
  InfoIcon
} from '@chakra-ui/icons';
import ExaminationDataAccess from './ExaminationDataAccess';
import './SecurityAccess.css';

const SecurityAccess = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [modalType, setModalType] = useState('');

  // Tab configuration
  const tabConfig = [
    { id: 'examination-access', label: 'Examination Data Access', modalType: 'examination-access' },
    { id: 'student-access', label: 'Student Data Access', modalType: 'student-access' },
    { id: 'fees-access', label: 'Fees Data Access', modalType: 'fees-access' }
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
        <div className="header-right">
          <Button 
            colorScheme="blue" 
            leftIcon={<AddIcon />}
            onClick={handleAddNew}
          >
            {getAddButtonText()}
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
            <span>Examination Data Access</span>
            <LockIcon />
          </Tab>
          <Tab>
            <span>Student Data Access</span>
            <ViewIcon />
          </Tab>
          <Tab>
            <span>Fees Data Access</span>
            <SettingsIcon />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ExaminationDataAccess modalType={modalType} />
          </TabPanel>
          <TabPanel>
            {/* Student Data Access Component will go here */}
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Student Data Access configuration coming soon...
            </div>
          </TabPanel>
          <TabPanel>
            {/* Fees Data Access Component will go here */}
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Fees Data Access configuration coming soon...
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default SecurityAccess;
