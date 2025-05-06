import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../utils/auth';
import GlossyNavbar from './GlossyNavbar';
import StandardNavbar from './StandardNavbar';

interface MainLayoutProps {
  children: React.ReactNode;
  navbarType?: 'glossy' | 'standard' | 'none';
}

/**
 * MainLayout component provides a consistent layout structure for all pages
 * It includes the appropriate navbar based on the page type
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  navbarType = 'glossy'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Function to handle logout using centralized auth utility
  const handleLogout = () => {
    auth.logout(navigate);
  };

  // Determine if this is a public page (home, login, signup)
  const isPublicPage = ['/login', '/signup', '/'].includes(location.pathname);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#0A0E17',
      pb: navbarType === 'glossy' ? 10 : 0, // Add padding at the bottom for the glossy navbar
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(0, 240, 255, 0.08) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(0, 163, 255, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0,
        background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\' /%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
      }
    }}>
      {/* Main content */}
      <Box sx={{
        flex: '1 0 auto',
        minHeight: 'calc(100vh - 128px)',
        width: '100%',
        overflowX: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        {children}
      </Box>

      {/* Navigation - only show on authenticated pages unless it's the home page */}
      {(navbarType !== 'none' && (!isPublicPage || location.pathname === '/')) && (
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          {navbarType === 'glossy' && <GlossyNavbar onLogout={handleLogout} />}
          {navbarType === 'standard' && <StandardNavbar onLogout={handleLogout} />}
        </Box>
      )}
    </Box>
  );
};

export default MainLayout;
