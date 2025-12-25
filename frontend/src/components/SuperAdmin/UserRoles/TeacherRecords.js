import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const TeacherRecords = ({ modalType, onDataChange }) => {
  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Teacher Records</Heading>
      <Text mb={4} color="gray.600">
        Manage teacher profiles, subject assignments, and teaching schedules.
      </Text>
      <Box
        p={8}
        border="1px dashed"
        borderColor="gray.300"
        borderRadius="8px"
        textAlign="center"
      >
        <Text color="gray.500" fontSize="lg">
          Teacher Records management will be implemented here.
        </Text>
      </Box>
    </Box>
  );
};

export default TeacherRecords;

