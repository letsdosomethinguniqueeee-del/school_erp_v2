import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Flex,
  VStack,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import SuperAdminNavbar from './SuperAdminNavbar';
import SuperAdminFooter from './SuperAdminFooter';

/**
 * SuperAdminDashboard Component
 * Main dashboard for Super Admin role with system management features
 * Fully responsive design using Chakra UI only
 * @param {Object} props - Component props
 * @param {Object} props.user - User object from ProtectedRoute (passed via props)
 */
const SuperAdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  
  // Color mode values for theming
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'gray.100');
  const iconBoxBg = useColorModeValue('gray.100', 'gray.700');

  // Icon components mapping
  const iconComponents = useMemo(() => ({
    users: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    settings: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    shield: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    database: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
      </svg>
    ),
    backup: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    chart: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    'file-text': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    tool: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    'dollar-sign': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    configuration: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    'user-roles': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="8.5" cy="7" r="4"/>
        <path d="M20 8v6"/>
        <path d="M23 11h-6"/>
        <path d="M17 8h6"/>
      </svg>
    ),
    clipboard: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="15" y2="16"/>
      </svg>
    )
  }), []);

  // Color mapping for feature cards
  const getColorScheme = (color) => {
    const colorMap = {
      primary: { border: 'blue.500', icon: 'blue.500', hover: 'blue.50' },
      secondary: { border: 'purple.500', icon: 'purple.500', hover: 'purple.50' },
      green: { border: 'green.500', icon: 'green.500', hover: 'green.50' },
      warning: { border: 'orange.500', icon: 'orange.500', hover: 'orange.50' },
      purple: { border: 'purple.500', icon: 'purple.500', hover: 'purple.50' },
      info: { border: 'cyan.500', icon: 'cyan.500', hover: 'cyan.50' },
      success: { border: 'green.500', icon: 'green.500', hover: 'green.50' },
      danger: { border: 'red.500', icon: 'red.500', hover: 'red.50' },
      dark: { border: 'gray.600', icon: 'gray.600', hover: 'gray.50' }
    };
    return colorMap[color] || colorMap.primary;
  };

  // Super Admin features configuration
  const superAdminFeatures = useMemo(() => [
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage all users, roles, and permissions across the system',
      icon: 'users',
      color: 'primary',
      action: () => navigate('/super-admin/user-management')
    },
    {
      id: 'user-roles',
      title: 'User & Roles',
      description: 'Manage system users, student records, teacher records, and staff records',
      icon: 'user-roles',
      color: 'secondary',
      action: () => navigate('/super-admin/user-roles')
    },
    {
      id: 'fees-management',
      title: 'Fees Management',
      description: 'Manage fee structures, student fees, and payment tracking',
      icon: 'dollar-sign',
      color: 'green',
      action: () => navigate('/super-admin/fees-management')
    },
    {
      id: 'enhanced-fees-management',
      title: 'Enhanced Fees Management',
      description: 'Fees management with multi-year tracking, analytics, and bulk operations',
      icon: 'dollar-sign',
      color: 'primary',
      action: () => navigate('/super-admin/enhanced-fees-management')
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure global system settings and preferences',
      icon: 'settings',
      color: 'secondary'
    },
    {
      id: 'system-configuration',
      title: 'System Configuration',
      description: 'Configure academic years, subjects, streams, mediums, classes, and sections',
      icon: 'configuration',
      color: 'primary',
      action: () => navigate('/super-admin/system-configuration')
    },
    {
      id: 'security',
      title: 'Security & Access',
      description: 'Manage security policies, authentication, and access controls',
      icon: 'shield',
      color: 'warning',
      action: () => navigate('/super-admin/security-access')
    },
    {
      id: 'examination-result',
      title: 'Examination Result Management',
      description: 'Manage examination results, student scores, and grade assignments',
      icon: 'clipboard',
      color: 'purple',
      action: () => navigate('/super-admin/examination-result-management')
    },
    {
      id: 'database',
      title: 'Database Management',
      description: 'Monitor database performance and manage data operations',
      icon: 'database',
      color: 'info'
    },
    {
      id: 'backup',
      title: 'Backup & Recovery',
      description: 'Schedule backups and manage data recovery procedures',
      icon: 'backup',
      color: 'success'
    },
    {
      id: 'analytics',
      title: 'System Analytics',
      description: 'View system performance metrics and usage statistics',
      icon: 'chart',
      color: 'danger'
    },
    {
      id: 'logs',
      title: 'System Logs',
      description: 'Monitor system logs and audit trails',
      icon: 'file-text',
      color: 'dark'
    },
    {
      id: 'maintenance',
      title: 'System Maintenance',
      description: 'Schedule maintenance windows and system updates',
      icon: 'tool',
      color: 'primary'
    }
  ], [navigate]);

  /**
   * Get icon component by name
   * @param {string} iconName - Name of the icon
   * @returns {JSX.Element} Icon component or default settings icon
   */
  const getIconComponent = (iconName) => {
    return iconComponents[iconName] || iconComponents.settings;
  };

  /**
   * Handle feature card click
   * @param {Object} feature - Feature object
   */
  const handleFeatureClick = (feature) => {
    if (feature.action) {
      feature.action();
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <SuperAdminNavbar user={user} />
      
      <Box pt="20px" pr="20px" pb="30px" pl="20px">
        {/* Welcome Section */}
        <Box
          bg={cardBg}
          borderRadius={{ base: 'md', md: 'lg' }}
          p="25px"
          mb="30px"
          boxShadow="sm"
          border="1px solid"
          borderColor={borderColor}
          w="100%"
        >
          <VStack 
            spacing={{ base: 5, sm: 6, md: 7 }} 
            align="stretch"
            border="1px solid"
            borderColor={borderColor}
            borderRadius={{ base: 'md', md: 'lg' }}
          >
            {/* Blue Accent Line */}
            <Box display="flex" justifyContent="center">
              <Box
                w={{ base: '60px', sm: '70px', md: '80px' }}
                h={{ base: '3px', sm: '3px', md: '4px' }}
                bg="blue.500"
                borderRadius="full"
              />
            </Box>
            
            {/* Heading */}
            <Heading
              as="h1"
              fontSize={{ base: '0.875rem', sm: '0.875rem', md: '1.25rem', lg: '1.25rem', xl: '1.25rem' }}
              textAlign="center"
              color={headingColor}
              fontWeight="600"
              lineHeight="1.3"
              mb={0}
            >
              System Administration
            </Heading>
            
            {/* Description */}
            <Text
              fontSize={{ base: '0.75rem', sm: '0.75rem', md: '0.75rem', lg: '1rem', xl: '1rem' }}
              textAlign="center"
              color={textColor}
              maxW="2xl"
              mx="auto"
              lineHeight="1.6"
              px={{ base: 2, sm: 4 }}
              mb={{ base: '20px', sm: '20px', md: '30px', lg: '30px', xl: '30px' }}
            >
              Manage and monitor the entire School ERP system with comprehensive administrative tools.
            </Text>
          </VStack>
        </Box>

        {/* Feature Cards Grid */}
        <Box w="100%">
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
            spacing={{ base: 4, sm: 5, md: 6, lg: 6 }}
          >
            {superAdminFeatures.map((feature) => {
              const colorScheme = getColorScheme(feature.color);
              const isClickable = !!feature.action;
              
              return (
                <Card
                  key={feature.id}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                  borderLeftWidth="4px"
                  borderLeftColor={colorScheme.border}
                  borderRadius="lg"
                  boxShadow="sm"
                  cursor={isClickable ? 'pointer' : 'default'}
                  transition="all 0.2s"
                  _hover={isClickable ? {
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                    borderColor: colorScheme.border
                  } : {}}
                  onClick={() => handleFeatureClick(feature)}
                  role={isClickable ? 'button' : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleFeatureClick(feature);
                    }
                  }}
                >
                  <CardBody p={{ base: 5, sm: 6, md: 6, lg: 7 }}>
                    <VStack spacing={{ base: 3, sm: 4 }} align="stretch" w="full">
                      {/* First line: Icon on left, Title centered in remaining space */}
                      <HStack spacing={{ base: 3, sm: 4 }} align="center" w="full">
                        {/* Icon on the left */}
                        <Box
                          bg={iconBoxBg}
                          borderRadius="md"
                          p={{ base: 1.5, sm: 2, md: 2 }}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                          minW={{ base: '32px', sm: '36px', md: '40px', lg: '44px' }}
                          minH={{ base: '32px', sm: '36px', md: '40px', lg: '44px' }}
                        >
                          <Box
                            color={colorScheme.icon}
                            w={{ base: '16px', sm: '18px', md: '20px', lg: '22px' }}
                            h={{ base: '16px', sm: '18px', md: '20px', lg: '22px' }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            {getIconComponent(feature.icon)}
                          </Box>
                        </Box>
                        
                        {/* Title centered in remaining space */}
                        <Heading
                          as="h3"
                          fontSize={{ base: '0.875rem', sm: '0.875rem', md: '1.25rem', lg: '1.25rem', xl: '1.25rem' }}
                          color={headingColor}
                          fontWeight="600"
                          lineHeight="1.3"
                          textAlign="center"
                          flex={1}
                        >
                          {feature.title}
                        </Heading>
                      </HStack>
                      
                      {/* Second line: Description centered */}
                      <Text
                        fontSize={{ base: '0.625rem', sm: '0.625rem', md: '0.75rem', lg: '0.75rem', xl: '0.75rem' }}
                        color={textColor}
                        lineHeight="1.6"
                        textAlign="center"
                        w="full"
                      >
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>

      <SuperAdminFooter />
    </Box>
  );
};

export default SuperAdminDashboard;