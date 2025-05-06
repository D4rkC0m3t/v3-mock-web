import React from 'react';
import { Box, Typography } from '@mui/material';

const TestComponent: React.FC = () => {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ color: 'white' }}>
        Test Component Loaded Successfully
      </Typography>
    </Box>
  );
};

export default TestComponent;
