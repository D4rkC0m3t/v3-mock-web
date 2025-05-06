import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import GlossyNavbar from './GlossyNavbar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    auth.logout(navigate);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#0A0E17',
      pb: 10 // Add padding at the bottom for the navbar
    }}>
      {children}
      <GlossyNavbar onLogout={handleLogout} />
    </Box>
  );
};

export default AuthLayout;
