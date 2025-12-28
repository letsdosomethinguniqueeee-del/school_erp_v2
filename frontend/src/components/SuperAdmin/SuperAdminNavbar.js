import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  HStack,
  VStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { performLogout } from '../../utils/logout';
import { SCHOOL_CONFIG } from '../../constants/school';

const SuperAdminNavbar = ({ user }) => {
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the menu and not on a MenuItem
      if (
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target) &&
        !event.target.closest('[role="menuitem"]')
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getRoleName = (role) => {
    const names = {
      'super-admin': 'Super Admin',
    };
    return names[role] || 'User';
  };

  const handleLogout = async () => {
    try {
      await performLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  return (
    <>
      <style>
        {`
          /* Responsive Logo Styles for Smaller Screens */
          @media (max-width: 480px) {
            nav .navbar-logo-box {
              width: 24px !important;
              height: 24px !important;
              min-width: 24px !important;
              min-height: 24px !important;
              font-size: 10px !important;
            }
          }
          
          @media (max-width: 768px) and (min-width: 481px) {
            nav .navbar-logo-box {
              width: 32px !important;
              height: 32px !important;
              min-width: 32px !important;
              min-height: 32px !important;
              font-size: 12px !important;
            }
          }
        `}
      </style>
      <Box
        as="nav"
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex={1000}
        w="100%"
      >
      <Flex
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6 }}
        py={3}
        maxW="100%"
      >
        {/* Left: Logo/Branding */}
        <Flex align="center" gap={3}>
          <HStack spacing={3}>
            <Box
              className="navbar-logo-box"
              w={{ base: 7, sm: 8, md: 10, lg: 12 }}
              h={{ base: 7, sm: 8, md: 10, lg: 12 }}
              bg="blue.600"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="bold"
            >
              {SCHOOL_CONFIG.LOGO_TEXT}
            </Box>
            <VStack spacing={0} align="start">
              <Heading 
                size={{ base: 'xs', md: 'sm' }} 
                color="gray.800" 
                fontWeight="semibold"
                lineHeight="1.2"
              >
                {SCHOOL_CONFIG.NAME}
              </Heading>
              <Text 
                color="gray.500"
                lineHeight="1.2"
              >
                {SCHOOL_CONFIG.TAGLINE}
              </Text>
            </VStack>
          </HStack>
        </Flex>

        {/* Right: User Menu */}
        <Flex align="center" gap={2}>
          <Menu 
            isOpen={showUserMenu} 
            onClose={() => setShowUserMenu(false)}
            closeOnSelect={false}
          >
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
              size="sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
              ref={userMenuRef}
              px={{ base: 1, sm: 2 }}
              _hover={{ bg: 'transparent' }}
              _active={{ bg: 'transparent' }}
              _focus={{ bg: 'transparent', boxShadow: 'none' }}
              transition="none"
            >
              <HStack spacing={{ base: 1, sm: 2 }} flexShrink={0}>
                <Box
                  w={{ base: 7, sm: 8, md: 8, lg: 9 }}
                  h={{ base: 7, sm: 8, md: 8, lg: 9 }}
                  borderRadius="full"
                  bg="blue.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="blue.600"
                  fontWeight="bold"
                  flexShrink={0}
                >
                  {getRoleName(user?.role).charAt(0)}
                </Box>
                <VStack spacing={0} align="start" display={{ base: 'none', md: 'flex' }}>
                  <Text fontWeight="medium" color="gray.700">
                    {getRoleName(user?.role)}
                  </Text>
                  <Text color="gray.500">
                    {user?.userId}
                  </Text>
                </VStack>
                <Text
                  fontWeight="medium"
                  color="gray.700"
                  display={{ base: 'block', md: 'none' }}
                  whiteSpace="nowrap"
                  flexShrink={0}
                >
                  {getRoleName(user?.role)}
                </Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <Box px={{ base: 2, md: 3 }} py={{ base: 1.5, md: 2 }}>
                <Text 
                  fontWeight="semibold" 
                  color="gray.700"
                >
                  {getRoleName(user?.role)}
                </Text>
                <Text 
                  color="gray.500"
                >
                  ID: {user?.userId}
                </Text>
              </Box>
              <MenuDivider />
              <MenuItem
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('MenuItem clicked!');
                  // Close menu first, then logout
                  setShowUserMenu(false);
                  // Use setTimeout to ensure menu closes before logout executes
                  setTimeout(() => {
                    handleLogout();
                  }, 0);
                }}
                color="red.500"
                _hover={{ bg: 'red.50' }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
    </>
  );
};

export default SuperAdminNavbar;