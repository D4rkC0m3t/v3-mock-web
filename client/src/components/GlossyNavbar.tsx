import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  IconButton,
  styled,
  Tooltip,
  Badge,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TradeIcon,
  SwapHoriz as SwapIcon,
  AccountBalanceWallet as WalletIcon,
  History as HistoryIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

// Styled components
const NavbarContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 30,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1100,
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}));

const GlossyNavBox = styled(Box)(({ theme }) => ({
  background: 'rgba(10, 14, 23, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '30px',
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    inset 0 -1px 1px rgba(0, 0, 0, 0.2)
  `,
  border: '1px solid rgba(0, 240, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(0, 240, 255, 0), rgba(0, 240, 255, 0.5), rgba(0, 240, 255, 0))',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
  }
}));

const NavIconButton = styled(IconButton)<{ active?: boolean }>(({ theme, active }) => ({
  color: active ? '#00F0FF' : 'rgba(255, 255, 255, 0.7)',
  margin: '0 8px',
  padding: '12px',
  position: 'relative',
  transition: 'all 0.3s ease',
  borderRadius: '16px',
  background: active
    ? 'linear-gradient(145deg, rgba(0, 240, 255, 0.2), rgba(0, 160, 255, 0.1))'
    : 'transparent',
  boxShadow: active
    ? `
      0 4px 8px rgba(0, 240, 255, 0.3),
      inset 0 -2px 2px rgba(0, 0, 0, 0.1),
      inset 0 2px 2px rgba(255, 255, 255, 0.2)
    `
    : 'none',
  filter: active ? 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.7))' : 'none',
  '&:hover': {
    color: '#00F0FF',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(0, 240, 255, 0.2)',
  },
}));

const GlowEffect = styled(Box)<{ active?: boolean }>(({ active }) => ({
  position: 'absolute',
  width: active ? '60px' : '0px',
  height: active ? '60px' : '0px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, rgba(0, 240, 255, 0) 70%)',
  transition: 'all 0.3s ease',
  pointerEvents: 'none',
  zIndex: -1,
}));

const NavIndicator = styled(Box)<{ active?: boolean }>(({ active }) => ({
  position: 'absolute',
  bottom: '-8px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: active ? '20px' : '0px',
  height: '2px',
  background: 'linear-gradient(90deg, rgba(0, 240, 255, 0), rgba(0, 240, 255, 1), rgba(0, 240, 255, 0))',
  boxShadow: '0 0 8px rgba(0, 240, 255, 0.6)',
  transition: 'all 0.3s ease',
  opacity: active ? 1 : 0,
}));

interface GlossyNavbarProps {
  onLogout: () => void;
}

// Changes include proper navigation integration
import { useNavigate } from 'react-router-dom';

const GlossyNavbar = ({ onLogout }) => {
  const navigate = useNavigate();
  
  // Menu item click handler
  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/trade', label: 'Trade', icon: <TradeIcon /> },
    { path: '/swap', label: 'Swap', icon: <SwapIcon /> },
    { path: '/wallet', label: 'Wallet', icon: <WalletIcon /> },
    { path: '/history', label: 'History', icon: <HistoryIcon /> },
  ];

  // Check if path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250, bgcolor: '#0A0E17', height: '100%', color: 'white' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Logo size="medium" />
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            component={Link}
            to={item.path}
            selected={isActive(item.path)}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'rgba(0, 240, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(0, 240, 255, 0.2)',
                }
              },
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? '#00F0FF' : 'rgba(255, 255, 255, 0.7)' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <ListItem button onClick={onLogout}>
          <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* We'll handle mobile menu button in the toolbar */}

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
            bgcolor: '#0A0E17',
            borderRight: '1px solid rgba(0, 240, 255, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Mobile menu button and notifications - fixed at top */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 1100
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              color: 'white',
              bgcolor: 'rgba(10, 14, 23, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              boxShadow: `
                0 4px 8px rgba(0, 0, 0, 0.3),
                inset 0 1px 1px rgba(255, 255, 255, 0.1)
              `,
              border: '1px solid rgba(0, 240, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(0, 240, 255, 0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              sx={{
                color: 'white',
                bgcolor: 'rgba(10, 14, 23, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                boxShadow: `
                  0 4px 8px rgba(0, 0, 0, 0.3),
                  inset 0 1px 1px rgba(255, 255, 255, 0.1)
                `,
                border: '1px solid rgba(0, 240, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(0, 240, 255, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Main navbar - centered at bottom for all screen sizes */}
      <NavbarContainer>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
          <GlossyNavBox>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Box key={item.label} sx={{ position: 'relative' }}>
                  <Tooltip title={item.label} placement="top">
                    <NavIconButton
                      onClick={() => navigate(item.path)}
                      active={active}
                    >
                      {item.icon}
                    </NavIconButton>
                  </Tooltip>
                  <GlowEffect active={active} />
                  <NavIndicator active={active} />
                </Box>
              );
            })}

            {/* Only show these on desktop in the navbar */}
            {!isMobile && (
              <>
                <Box sx={{ mx: 1, height: '24px', width: '1px', bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

                <Box sx={{ position: 'relative' }}>
                  <Tooltip title="Notifications" placement="top">
                    <NavIconButton>
                      <Badge badgeContent={3} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </NavIconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ position: 'relative' }}>
                  <Tooltip title="Logout" placement="top">
                    <NavIconButton onClick={onLogout}>
                      <LogoutIcon />
                    </NavIconButton>
                  </Tooltip>
                </Box>
              </>
            )}
          </GlossyNavBox>
        </Container>
      </NavbarContainer>
    </>
  );
};

export default GlossyNavbar;
