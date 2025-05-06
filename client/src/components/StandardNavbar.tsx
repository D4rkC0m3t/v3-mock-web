import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Tooltip,
  Badge,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  styled
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  SwapHoriz as TradeIcon,
  AccountBalanceWallet as WalletIcon,
  History as HistoryIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

// Styled components
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0 16px',
  background: 'rgba(10, 14, 23, 0.95)',
  borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(0, 240, 255, 0), rgba(0, 240, 255, 0.5), rgba(0, 240, 255, 0))',
  }
}));

const NavIconButton = styled(IconButton)<{ active?: boolean }>(({ active }) => ({
  color: active ? '#00F0FF' : 'rgba(255, 255, 255, 0.7)',
  margin: '0 8px',
  padding: '12px',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#00F0FF',
  },
  '&::before': active ? {
    content: '""',
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#00F0FF',
    boxShadow: '0 0 10px #00F0FF, 0 0 20px #00F0FF',
  } : {},
}));

const GlowEffect = styled(Box)<{ active?: boolean }>(({ active }) => ({
  position: 'absolute',
  width: active ? '40px' : '0px',
  height: active ? '40px' : '0px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, rgba(0, 240, 255, 0) 70%)',
  transition: 'all 0.3s ease',
  pointerEvents: 'none',
  zIndex: -1,
}));

interface StandardNavbarProps {
  onLogout: () => void;
}

const StandardNavbar: React.FC<StandardNavbarProps> = ({ onLogout }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Navigation items
  const navItems = [
    { path: '/trading', label: 'Trading', icon: <TradeIcon /> },
    { path: '/exchange', label: 'Crypto Exchange', icon: <DashboardIcon /> },
    { path: '/swap', label: 'Swap', icon: <SwapHoriz /> },
    { path: '/login', label: 'Login/Sign-up', icon: <WalletIcon /> },
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
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent' }}>
        <StyledToolbar className="MuiToolbar-root MuiToolbar-gutters MuiToolbar-regular css-yg49xf-MuiToolbar-root">
          {/* Left side - Logo for desktop, Menu button for mobile */}
          <Box sx={{ position: 'absolute', left: 16 }}>
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: 'white',
                  '&:hover': { color: '#00F0FF' }
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Logo size="small" />
            )}
          </Box>

          {/* Centered navigation icons */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Box key={item.label} sx={{ position: 'relative' }} className={active ? 'navbar-icon-active' : ''}>
                  <Tooltip title={item.label} placement="bottom">
                    <NavIconButton
                      component={Link}
                      to={item.path}
                      active={active}
                    >
                      {item.icon}
                    </NavIconButton>
                  </Tooltip>
                  <GlowEffect active={active} />
                </Box>
              );
            })}
          </Box>

          {/* Right side actions */}
          <Box sx={{ position: 'absolute', right: 16, display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notifications" placement="bottom">
              <NavIconButton>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </NavIconButton>
            </Tooltip>

            {!isMobile && (
              <Tooltip title="Logout" placement="bottom">
                <NavIconButton onClick={onLogout}>
                  <LogoutIcon />
                </NavIconButton>
              </Tooltip>
            )}
          </Box>
        </StyledToolbar>
      </AppBar>

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
    </>
  );
};

export default StandardNavbar;
