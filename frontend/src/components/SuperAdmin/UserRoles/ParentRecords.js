import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const ParentRecords = ({ modalType, onDataChange }) => {
  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Parent Records</Heading>
      <Text mb={4} color="gray.600">
        Manage parent profiles, student associations, and contact information.
      </Text>
      <Box
        p={8}
        border="1px dashed"
        borderColor="gray.300"
        borderRadius="8px"
        textAlign="center"
      >
        <Text color="gray.500" fontSize="lg">
          Parent Records management will be implemented here.
        </Text>
      </Box>
    </Box>
  );
};

export default ParentRecords;

