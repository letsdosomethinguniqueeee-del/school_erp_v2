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
  ViewIcon
} from '@chakra-ui/icons';
import SystemUsersConfig from './SystemUsersConfig';
import './UserRoles.css';

const UserRoles = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [modalType, setModalType] = useState('');

  // Tab configuration
  const tabConfig = [
    { id: 'system-users', label: 'System Users', icon: AddIcon },
    { id: 'student-records', label: 'Student Records', icon: EditIcon },
    { id: 'teacher-records', label: 'Teacher Records', icon: StarIcon },
    { id: 'staff-records', label: 'Staff Records', icon: ViewIcon }
  ];

  const handleBackToDashboard = () => {
    navigate('/super-admin');
  };

  const getAddButtonText = () => {
    const currentTab = tabConfig[activeTab];
    return `Add New ${currentTab.label}`;
  };

  const handleAddNew = () => {
    const currentTab = tabConfig[activeTab];
    setModalType(''); // Reset first
    setTimeout(() => {
      setModalType(currentTab.id); // Then set new value
    }, 0);
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
            <div className="user-roles-tab-content">
              <SystemUsersConfig modalType={modalType} />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="user-roles-tab-content">
              <h3>Student Records</h3>
              <p>View and manage student information, academic records, and enrollment details.</p>
              <div className="user-roles-dummy-content">
                <p>This tab will contain:</p>
                <ul>
                  <li>Student profiles</li>
                  <li>Academic records</li>
                  <li>Enrollment status</li>
                  <li>Parent information</li>
                </ul>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="user-roles-tab-content">
              <h3>Teacher Records</h3>
              <p>Manage teacher profiles, subject assignments, and teaching schedules.</p>
              <div className="user-roles-dummy-content">
                <p>This tab will contain:</p>
                <ul>
                  <li>Teacher profiles</li>
                  <li>Subject assignments</li>
                  <li>Teaching schedules</li>
                  <li>Performance records</li>
                </ul>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="user-roles-tab-content">
              <h3>Staff Records</h3>
              <p>Manage non-teaching staff members and their roles in the school.</p>
              <div className="user-roles-dummy-content">
                <p>This tab will contain:</p>
                <ul>
                  <li>Staff profiles</li>
                  <li>Department assignments</li>
                  <li>Work schedules</li>
                  <li>Employment records</li>
                </ul>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default UserRoles;