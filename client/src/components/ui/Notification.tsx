import React, { useState, useEffect } from 'react';
import { Alert, AlertProps, Snackbar, Box, Typography, IconButton, styled } from '@mui/material';
import { Close as CloseIcon, CheckCircle, Error, Info, Warning } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components
const StyledAlert = styled(Alert)(({ theme, severity }) => {
  const colors = {
    success: {
      background: 'rgba(0, 200, 83, 0.1)',
      border: 'rgba(0, 200, 83, 0.3)',
      color: '#00c853'
    },
    error: {
      background: 'rgba(255, 82, 82, 0.1)',
      border: 'rgba(255, 82, 82, 0.3)',
      color: '#ff5252'
    },
    warning: {
      background: 'rgba(255, 171, 0, 0.1)',
      border: 'rgba(255, 171, 0, 0.3)',
      color: '#ffab00'
    },
    info: {
      background: 'rgba(0, 240, 255, 0.1)',
      border: 'rgba(0, 240, 255, 0.3)',
      color: '#00f0ff'
    }
  };
  
  const colorSet = colors[severity || 'info'];
  
  return {
    background: colorSet.background,
    border: `1px solid ${colorSet.border}`,
    borderRadius: '12px',
    color: colorSet.color,
    backdropFilter: 'blur(10px)',
    '& .MuiAlert-icon': {
      color: colorSet.color
    }
  };
});

interface NotificationProps extends Omit<AlertProps, 'severity'> {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  title?: string;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

/**
 * Notification Component
 * Displays a notification message with various severity levels
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the notification is open
 * @param {string} props.message - The notification message
 * @param {string} props.severity - The severity level (success, error, warning, info)
 * @param {number} props.duration - Duration in milliseconds before auto-closing
 * @param {Function} props.onClose - Function to call when notification is closed
 * @param {string} props.title - Optional title for the notification
 * @param {Object} props.position - Position of the notification
 */
const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  severity = 'info',
  duration = 5000,
  onClose,
  title,
  position = { vertical: 'bottom', horizontal: 'right' },
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(open);
  
  // Update isOpen when open prop changes
  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  
  // Handle close
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setIsOpen(false);
    
    if (onClose) {
      onClose();
    }
  };
  
  // Get icon based on severity
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      default:
        return <Info />;
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <Snackbar
          open={isOpen}
          autoHideDuration={duration}
          onClose={handleClose}
          anchorOrigin={position}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <StyledAlert
              severity={severity}
              icon={getIcon()}
              action={
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              {...rest}
            >
              {title && (
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {title}
                </Typography>
              )}
              <Typography variant="body2">
                {message}
              </Typography>
            </StyledAlert>
          </motion.div>
        </Snackbar>
      )}
    </AnimatePresence>
  );
};

export default Notification;
