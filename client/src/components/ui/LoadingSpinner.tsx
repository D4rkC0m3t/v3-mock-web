import React from 'react';
import { Box, CircularProgress, Typography, styled } from '@mui/material';
import { motion } from 'framer-motion';

// Styled components
const SpinnerContainer = styled(Box)(({ theme, fullscreen = false }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  ...(fullscreen && {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(10, 14, 23, 0.9)',
    backdropFilter: 'blur(5px)',
    zIndex: 9999,
  }),
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme, color = '#00F0FF', size = 40 }) => ({
  color: color,
  width: size,
  height: size,
}));

interface LoadingSpinnerProps {
  fullscreen?: boolean;
  size?: number;
  color?: string;
  text?: string;
  showText?: boolean;
}

/**
 * LoadingSpinner Component
 * Displays a loading spinner with optional text
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.fullscreen - Whether to display the spinner fullscreen
 * @param {number} props.size - Size of the spinner in pixels
 * @param {string} props.color - Color of the spinner
 * @param {string} props.text - Text to display below the spinner
 * @param {boolean} props.showText - Whether to show the text
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullscreen = false,
  size = 40,
  color = '#00F0FF',
  text = 'Loading...',
  showText = true
}) => {
  return (
    <SpinnerContainer fullscreen={fullscreen}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <StyledCircularProgress color={color} size={size} />
      </motion.div>
      
      {showText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 2, 
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 500
            }}
          >
            {text}
          </Typography>
        </motion.div>
      )}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
