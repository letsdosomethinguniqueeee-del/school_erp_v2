import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const StaffRecords = ({ modalType, onDataChange }) => {
  return (
    <Box>
      <Heading size="md" mb={4} mt={2}>Staff Records</Heading>
      <Text mb={4} color="gray.600">
        Manage non-teaching staff members and their roles in the school.
      </Text>
      <Box
        p={8}
        border="1px dashed"
        borderColor="gray.300"
        borderRadius="8px"
        textAlign="center"
      >
        <Text color="gray.500" fontSize="lg">
          Staff Records management will be implemented here.
        </Text>
      </Box>
    </Box>
  );
};

export default StaffRecords;