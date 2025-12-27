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
  CalendarIcon,
  SettingsIcon,
  AddIcon,
  ChatIcon,
  PlusSquareIcon,
  SmallAddIcon,
  ArrowUpDownIcon
} from '@chakra-ui/icons';
import SuperAdminNavbar from '../SuperAdminNavbar';
import SuperAdminFooter from '../SuperAdminFooter';
import AcademicYearConfig from './AcademicYearConfig';
import SubjectConfig from './SubjectConfig';
import StreamConfig from './StreamConfig';
import MediumConfig from './MediumConfig';
import ClassConfig from './ClassConfig';
import SectionConfig from './SectionConfig';
import ClassMappingConfig from './ClassMappingConfig';
import ExaminationConfig from './ExaminationConfig';

const SystemConfiguration = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [modalType, setModalType] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Tab configuration
  const tabConfig = [
    { id: 'academic-years', label: 'Academic Years', modalType: 'academic-year' },
    { id: 'subjects', label: 'Subjects', modalType: 'subject' },
    { id: 'streams', label: 'Streams', modalType: 'stream' },
    { id: 'mediums', label: 'Mediums', modalType: 'medium' },
    { id: 'classes', label: 'Classes', modalType: 'class' },
    { id: 'sections', label: 'Sections', modalType: 'section' },
    { id: 'class-mapping', label: 'Class Mapping', modalType: 'class-mapping' },
    { id: 'examinations', label: 'Examination', modalType: 'examination' }
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

  // Function to trigger dropdown refresh for Class Mapping tab
  const triggerDropdownRefresh = () => {
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
          // Hide scrollbar for all browsers within SystemConfiguration
          '& *': {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          },
          // Responsive button styles
          '& .chakra-button': {
            fontSize: { base: '11px', sm: '12px', md: 'sm' },
            px: { base: '10px', sm: '12px', md: '16px' },
            py: { base: '6px', sm: '8px', md: '8px' },
            minH: { base: '28px', md: 'auto' }
          },
          // Responsive tab styles
          '& .chakra-tabs__tab': {
            fontSize: { base: '11px', sm: '12px', md: 'md' },
            px: { base: '10px', sm: '12px', md: '16px' },
            py: { base: '6px', sm: '8px', md: '12px' }
          },
          // Responsive input and select styles
          '& .chakra-input, & .chakra-select': {
            fontSize: { base: '11px', sm: '12px', md: 'md' },
            px: { base: '8px', sm: '10px', md: '12px' },
            py: { base: '6px', sm: '8px', md: '8px' },
            h: { base: '28px', md: 'auto' }
          },
          // Responsive table styles
          '& .chakra-table th, & .chakra-table td': {
            fontSize: { base: '11px', sm: '12px', md: 'md' },
            px: { base: '8px', sm: '10px', md: '12px' },
            py: { base: '6px', sm: '8px', md: '12px' }
          },
          // Responsive modal styles
          '& .chakra-modal__content': {
            p: { base: '10px', md: '24px' }
          },
          '& .chakra-modal__header': {
            p: { base: '10px', md: '24px' },
            fontSize: { base: '13px', md: 'lg' }
          },
          '& .chakra-modal__body': {
            p: { base: '10px', md: '24px' }
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
            fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}
            px={{ base: '10px', md: '16px' }}
            h={{ base: '28px', md: 'auto' }}
          >
            Back to Dashboard
          </Button>
        </Box>
        <Box>
          <Button 
            colorScheme="blue" 
            leftIcon={<AddIcon />}
            onClick={handleAddNew}
            fontSize={{ base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' }}
            px={{ base: '10px', md: '16px' }}
            h={{ base: '28px', md: 'auto' }}
          >
            {getAddButtonText()}
          </Button>
        </Box>
      </Flex>
      <Tabs 
        variant='soft-rounded' 
        index={activeTab}
        onChange={setActiveTab}
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
            px: { base: '6px', sm: '9px', md: '16px' },
            py: { base: '6px', sm: '9px', md: '12px' },
            backgroundColor: { base: 'transparent', md: 'white' },
            border: { base: 'none', md: '1px solid #e9ecef' },
            mb: '0px',
            fontSize: { base: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1rem', xl: '1rem' },
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
          <Tab>
            <span>Academic Years</span>
            <CalendarIcon />
          </Tab>
          <Tab>
            <span>Subjects</span>
            <PlusSquareIcon />
          </Tab>
          <Tab>
            <span>Streams</span>
            <ArrowUpDownIcon />
          </Tab>
          <Tab>
            <span>Mediums</span>
            <ChatIcon />
          </Tab>
          <Tab>
            <span>Classes</span>
            <AddIcon />
          </Tab>
          <Tab>
            <span>Sections</span>
            <SmallAddIcon />
          </Tab>
          <Tab>
            <span>Class Mapping</span>
            <SettingsIcon />
          </Tab>
          <Tab>
            <span>Examination</span>
            <CalendarIcon />
          </Tab>
        </TabList>
        <TabPanels p='0px'>
          <TabPanel>
            <AcademicYearConfig modalType={modalType} onDataChange={triggerDropdownRefresh} />
          </TabPanel>
          <TabPanel>
            <SubjectConfig modalType={modalType} onDataChange={triggerDropdownRefresh} />
          </TabPanel>
          <TabPanel>
            <StreamConfig modalType={modalType} onDataChange={triggerDropdownRefresh} />
          </TabPanel>
          <TabPanel>
            <MediumConfig modalType={modalType} onDataChange={triggerDropdownRefresh} />
          </TabPanel>
          <TabPanel>
            <ClassConfig modalType={modalType} onDataChange={triggerDropdownRefresh} />
          </TabPanel>
          <TabPanel>
            <SectionConfig modalType={modalType} onDataChange={triggerDropdownRefresh} />
          </TabPanel>
          <TabPanel>
            <ClassMappingConfig modalType={modalType} refreshTrigger={refreshTrigger} />
          </TabPanel>
          <TabPanel>
            <ExaminationConfig modalType={modalType} onDataChange={triggerDropdownRefresh} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      </Box>
      
      {/* Footer */}
      <SuperAdminFooter />
    </VStack>
  );
};

export default SystemConfiguration;