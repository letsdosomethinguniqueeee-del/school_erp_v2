import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { SCHOOL_CONFIG } from '../../constants/school';

const SuperAdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg="gray.900"
      color="white"
      textAlign="center"
      py={{ base: 2, md: 3 }}
      px={{ base: 4, md: 6 }}
      fontSize={{ base: 'xs', md: 'sm' }}
      borderTop="1px solid"
      borderColor="gray.700"
    >
      <Text>
        © {currentYear} {SCHOOL_CONFIG.NAME}. All rights reserved.
      </Text>
    </Box>
  );
};

export default SuperAdminFooter;