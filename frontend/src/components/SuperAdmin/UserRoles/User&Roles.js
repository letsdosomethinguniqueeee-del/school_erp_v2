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
  AddIcon,
  EditIcon,
  StarIcon,
  ViewIcon,
  PhoneIcon
} from '@chakra-ui/icons';
import SystemUsers from './SystemUsers';
import StudentRecords from './StudentRecords';
import TeacherRecords from './TeacherRecords';
import StaffRecords from './StaffRecords';
import ParentRecords from './ParentRecords';
import './UserRoles.css';

const UserRoles = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [modalType, setModalType] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Tab configuration
  const tabConfig = [
    { id: 'users', label: 'System Users', modalType: 'user', icon: AddIcon },
    { id: 'student-records', label: 'Student Records', modalType: 'student-record', icon: EditIcon },
    { id: 'teacher-records', label: 'Teacher Records', modalType: 'teacher-record', icon: StarIcon },
    { id: 'staff-records', label: 'Staff Records', modalType: 'staff-record', icon: ViewIcon },
    { id: 'parent-records', label: 'Parent Records', modalType: 'parent-record', icon: PhoneIcon }
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

  // Function to trigger refresh for System Users tab (called by Student/Teacher/Staff records)
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <div className="user-roles-header">
        <div className="user-roles-header-left">
          <Button leftIcon={<ArrowBackIcon />} onClick={handleBackToDashboard} colorScheme='gray'>
            Back to Dashboard
          </Button>
        </div>
        <div className="user-roles-header-right">
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
          {tabConfig.map((tab, index) => {
            const IconComponent = tab.icon;
            return (
              <Tab key={tab.id}>
                <span>{tab.label}</span>
                <IconComponent />
              </Tab>
            );
          })}
        </TabList>
        <TabPanels>
          <TabPanel>
            <SystemUsers modalType={modalType} refreshTrigger={refreshTrigger} />
          </TabPanel>
          <TabPanel>
            <StudentRecords modalType={modalType} onDataChange={triggerRefresh} />
          </TabPanel>
          <TabPanel>
            <TeacherRecords modalType={modalType} onDataChange={triggerRefresh} />
          </TabPanel>
          <TabPanel>
            <StaffRecords modalType={modalType} onDataChange={triggerRefresh} />
          </TabPanel>
          <TabPanel>
            <ParentRecords modalType={modalType} onDataChange={triggerRefresh} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default UserRoles;