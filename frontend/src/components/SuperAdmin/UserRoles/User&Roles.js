import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Button,
  Box,
  Flex,
  VStack
} from '@chakra-ui/react';
import { 
  ArrowBackIcon,
  AddIcon,
  EditIcon,
  StarIcon,
  ViewIcon,
  PhoneIcon
} from '@chakra-ui/icons';
import SuperAdminNavbar from '../SuperAdminNavbar';
import SuperAdminFooter from '../SuperAdminFooter';
import SystemUsers from './SystemUsers';
import StudentRecords from './StudentRecords';
import TeacherRecords from './TeacherRecords';
import StaffRecords from './StaffRecords';
import ParentRecords from './ParentRecords';

const UserRoles = ({ user }) => {
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
    <VStack spacing={0} align="stretch" minH="100vh">
      {/* Navbar */}
      <SuperAdminNavbar user={user} />
      
      {/* Main Content */}
      <Box
        flex="1"
        sx={{
          // Hide scrollbar for all browsers within UserRoles
          '& *': {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }
        }}
      >
        <Flex
          mt="15px"
          px={{ base: '10px', md: '20px' }}
          py="10px"
          justify="space-between"
          align="center"
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
          gap={{ base: '10px', md: '0' }}
        >
          <Box>
            <Button 
              leftIcon={<ArrowBackIcon />} 
              onClick={handleBackToDashboard} 
              colorScheme='gray'
            >
              Back to Dashboard
            </Button>
          </Box>
          <Box>
            <Button 
              colorScheme="blue" 
              leftIcon={<AddIcon />}
              onClick={handleAddNew}
            >
              {getAddButtonText()}
            </Button>
          </Box>
        </Flex>
        <Tabs 
          variant='soft-rounded' 
          index={activeTab}
          onChange={setActiveTab}
          mb="0px"
          sx={{
            '& .chakra-tabs__tablist': {
              display: 'flex',
              background: '#f8f9fa',
              borderRadius: '8px',
              p: { base: '6px', sm: '6px', md: '6px' },
              border: '1px solid #e9ecef',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              mt: '12px',
              mb: '0px',
              flexWrap: { base: 'wrap', md: 'wrap' },
              gap: '8px',
              mx: { base: '10px', md: '20px' },
              flexDirection: { base: 'column', md: 'row' }
            },
            '& .chakra-tabs__tab': {
              color: 'var(--tab-text-default)',
              borderColor: 'var(--tab-blue)',
              borderRadius: '6px',
              transition: 'all 0s ease',
              flex: { base: 'none', md: '1 1 auto' },
              minWidth: { base: '100%', md: '250px' },
              width: { base: '100%', md: 'auto' },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: { base: 'transparent', md: 'white' },
              border: { base: 'none', md: '1px solid #e9ecef' },
              mb: '0px',
              fontWeight: '600',
              _hover: {
                color: 'var(--tab-text-hover)',
                backgroundColor: { base: '#f8f9fa', md: 'var(--tab-bg-hover)' }
              }
            },
            '& .chakra-tabs__tab[aria-selected="true"]': {
              backgroundColor: 'var(--tab-blue)',
              color: 'white',
              borderRadius: '6px'
            },
            '& .chakra-tabs__tab-panels': {
              px: { base: '10px', md: '20px' }
            },
            '& .chakra-tabs__tabpanel': {
              px: { base: '10px', md: '20px' },
              pt: { base: '12px', md: '16px' },
              pb: 0
            }
          }}
        >
          <TabList mb='0px'>
            {tabConfig.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Tab key={tab.id}>
                  <span>{tab.label}</span>
                  <IconComponent />
                </Tab>
              );
            })}
          </TabList>
          <TabPanels p={0}>
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
      </Box>
      
      {/* Footer */}
      <SuperAdminFooter />
    </VStack>
  );
};

export default UserRoles;