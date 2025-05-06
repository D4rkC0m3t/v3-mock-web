import { motion } from 'framer-motion';
import { Typography, Box, Container, Grid, Paper, styled, Avatar, Chip, AppBar, Toolbar, Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountBalanceWallet, TrendingUp, SwapHoriz, Notifications, Person, Security, Logout, VerifiedUser, Settings } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './components/Logo';
import { useState, useEffect } from 'react';

const DashboardContainer = styled(Container)({
  minHeight: '100vh',
  padding: '2rem',
  background: '#0A0E17',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'radial-gradient(circle at 30% 20%, rgba(0, 240, 255, 0.08) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(0, 163, 255, 0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
});

const DashboardCard = styled(Paper)({
  padding: '1.5rem',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
  height: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-1px',
    borderRadius: '13px',
    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 163, 255, 0.2))',
    opacity: 0.5,
    zIndex: -1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(0, 163, 255, 0.05) 100%)',
    zIndex: -2,
  }
});

interface FloatingElementProps {
  size: string;
  color: string;
  left: number;
  top: number;
  delay: number;
}

// Floating element component for background animation
const FloatingElement = ({ size, color, left, top, delay }: FloatingElementProps) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${color}, rgba(0,0,0,0))`,
        left: `${left}%`,
        top: `${top}%`,
        filter: 'blur(15px)',
        opacity: 0.4,
        zIndex: 0,
      }}
      animate={{
        y: ['-10%', '10%'],
        x: ['-5%', '5%'],
        scale: [0.95, 1.05, 0.95],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        y: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 8 + Math.random() * 4,
          ease: 'easeInOut',
          delay: delay,
        },
        x: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 10 + Math.random() * 4,
          ease: 'easeInOut',
          delay: delay + 1,
        },
        scale: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 12 + Math.random() * 4,
          ease: 'easeInOut',
          delay: delay,
        },
        opacity: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 6 + Math.random() * 2,
          ease: 'easeInOut',
          delay: delay,
        },
      }}
    />
  );
};

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, []);

  const [portfolioValue, setPortfolioValue] = useState('$12,450.75');
  const [portfolioChange, setPortfolioChange] = useState('+2.4%');

  // State for user menu
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(userMenuAnchor);

  // Array of floating elements for the background
  const floatingElements = [
    { size: '400px', color: 'rgba(0, 240, 255, 0.15)', left: 10, top: 20, delay: 0 },
    { size: '300px', color: 'rgba(0, 163, 255, 0.12)', left: 75, top: 15, delay: 0.5 },
    { size: '350px', color: 'rgba(0, 240, 255, 0.1)', left: 85, top: 60, delay: 1 },
    { size: '250px', color: 'rgba(0, 163, 255, 0.08)', left: 25, top: 70, delay: 1.5 },
  ];

  // Mock data for assets
  const assets = [
    { name: 'Bitcoin', symbol: 'BTC', balance: '0.42', value: '$25,830.00', change: '+1.2%' },
    { name: 'Ethereum', symbol: 'ETH', balance: '3.5', value: '$10,937.50', change: '+0.8%' },
    { name: 'Solana', symbol: 'SOL', balance: '45.2', value: '$6,458.60', change: '+4.5%' },
  ];

  // Mock data for recent transactions
  const transactions = [
    { type: 'Buy', asset: 'BTC', amount: '0.05', value: '$3,050.25', date: '2023-06-15' },
    { type: 'Sell', asset: 'ETH', amount: '1.2', value: '$3,750.00', date: '2023-06-12' },
    { type: 'Swap', asset: 'SOL → BTC', amount: '10.0', value: '$1,430.00', date: '2023-06-10' },
  ];

  // Handle user menu open
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  // Handle user menu close
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // Function to handle logout
  const handleLogout = () => {
    auth.logout(navigate);
  };

  // Function to navigate to KYC page
  const handleKYCClick = () => {
    handleUserMenuClose();
    navigate('/kyc');
  };

  // Function to navigate to Account page
  const handleAccountClick = () => {
    handleUserMenuClose();
    navigate('/account');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0A0E17' }}>
      {/* Navigation Bar - Centered */}
      <AppBar position="sticky" sx={{
        background: 'rgba(10, 14, 23, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <Toolbar>
          {/* Logo on the left */}
          <Box sx={{
            position: 'absolute',
            left: { xs: '16px', md: '24px' },
            display: 'flex',
            alignItems: 'center'
          }}>
            <Logo />
          </Box>

          {/* Centered navigation items */}
          <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {['Dashboard', 'Trade', 'Wallet', 'History'].map((page) => (
                <Button
                  key={page}
                  component={Link}
                  to={`/${page.toLowerCase()}`}
                  sx={{
                    color: 'white',
                    mx: 2,
                    px: 2,
                    py: 1,
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 240, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    ...(window.location.pathname === `/${page.toLowerCase()}` ? {
                      background: 'rgba(0, 240, 255, 0.1)',
                      boxShadow: '0 4px 8px rgba(0, 240, 255, 0.2)',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '2px',
                        background: '#00F0FF',
                        borderRadius: '2px',
                        boxShadow: '0 0 8px #00F0FF',
                      }
                    } : {})
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Actions on the right */}
          <Box sx={{
            position: 'absolute',
            right: { xs: '16px', md: '24px' },
            display: 'flex',
            alignItems: 'center'
          }}>
            <IconButton
              color="inherit"
              sx={{
                mr: 1,
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#00F0FF',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Notifications />
            </IconButton>

            <IconButton
              onClick={handleUserMenuOpen}
              sx={{
                ml: 1,
                border: '2px solid rgba(0, 240, 255, 0.3)',
                padding: '4px',
                '&:hover': {
                  border: '2px solid rgba(0, 240, 255, 0.5)',
                  background: 'rgba(0, 240, 255, 0.1)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
                }}
              >
                <Person />
              </Avatar>
            </IconButton>

            {/* User Menu */}
            <Menu
              anchorEl={userMenuAnchor}
              open={userMenuOpen}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  background: 'rgba(10, 14, 23, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 240, 255, 0.1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  minWidth: 200,
                  '& .MuiMenuItem-root': {
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(0, 240, 255, 0.1)',
                    },
                  },
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleKYCClick}>
                <ListItemIcon>
                  <VerifiedUser sx={{ color: '#00F0FF' }} />
                </ListItemIcon>
                <ListItemText>KYC Verification</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleAccountClick}>
                <ListItemIcon>
                  <Settings sx={{ color: '#00F0FF' }} />
                </ListItemIcon>
                <ListItemText>Account Settings</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout sx={{ color: '#00F0FF' }} />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <DashboardContainer maxWidth={false} disableGutters>
        {/* Floating background elements */}
        {floatingElements.map((props, index) => (
          <FloatingElement key={index} {...props} />
        ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 5, py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 4,
              background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Dashboard
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {/* Portfolio Summary */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <DashboardCard>
                <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                  Portfolio Summary
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceWallet sx={{ fontSize: 40, color: '#00F0FF', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {portfolioValue}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUp sx={{ color: '#4caf50', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2" sx={{ color: '#4caf50' }}>
                        {portfolioChange} (24h)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </DashboardCard>
            </motion.div>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <DashboardCard>
                <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { title: 'Deposit', icon: <AccountBalanceWallet sx={{ fontSize: 24, color: '#00F0FF' }} />, path: '/wallet' },
                    { title: 'Withdraw', icon: <TrendingUp sx={{ fontSize: 24, color: '#00F0FF' }} />, path: '/wallet' },
                    { title: 'Swap', icon: <SwapHoriz sx={{ fontSize: 24, color: '#00F0FF' }} />, path: '/swap' },
                  ].map((action, index) => (
                    <Grid item xs={4} key={action.title}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Box
                          component={Link}
                          to={action.path}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1.5,
                            borderRadius: '8px',
                            background: 'rgba(0, 240, 255, 0.05)',
                            border: '1px solid rgba(0, 240, 255, 0.1)',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            '&:hover': {
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          }}
                        >
                          {action.icon}
                          <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                            {action.title}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </DashboardCard>
            </motion.div>
          </Grid>

          {/* Assets */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <DashboardCard>
                <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                  Your Assets
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                  <Box sx={{ minWidth: 650, display: 'table', width: '100%' }}>
                    <Box sx={{ display: 'table-header-group' }}>
                      <Box sx={{ display: 'table-row' }}>
                        {['Asset', 'Balance', 'Value', 'Change'].map((header) => (
                          <Box key={header} sx={{
                            display: 'table-cell',
                            p: 1.5,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontWeight: 500,
                          }}>
                            {header}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'table-row-group' }}>
                      {assets.map((asset) => (
                        <motion.div
                          key={asset.symbol}
                          whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.05)' }}
                          style={{ display: 'table-row' }}
                        >
                          <Box sx={{ display: 'table-cell', p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ bgcolor: 'rgba(0, 240, 255, 0.1)', mr: 1, width: 32, height: 32 }}>
                                {asset.symbol.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body1">{asset.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                  {asset.symbol}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'table-cell', p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <Typography variant="body2">{asset.balance}</Typography>
                          </Box>
                          <Box sx={{ display: 'table-cell', p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <Typography variant="body2">{asset.value}</Typography>
                          </Box>
                          <Box sx={{ display: 'table-cell', p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <Typography variant="body2" sx={{ color: '#4caf50' }}>
                              {asset.change}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </DashboardCard>
            </motion.div>
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <DashboardCard>
                <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                  Recent Transactions
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                  <Box sx={{ minWidth: 650, display: 'table', width: '100%' }}>
                    <Box sx={{ display: 'table-header-group' }}>
                      <Box sx={{ display: 'table-row' }}>
                        {['Type', 'Asset', 'Amount', 'Value', 'Date'].map((header) => (
                          <Box key={header} sx={{
                            display: 'table-cell',
                            p: 1.5,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontWeight: 500,
                          }}>
                            {header}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'table-row-group' }}>
                      {transactions.map((tx, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.05)' }}
                          style={{ display: 'table-row' }}
                        >
                          <Box sx={{ display: 'table-cell', p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <Chip
                              label={tx.type}
                              size="small"
                              sx={{
                                bgcolor: tx.type === 'Buy' ? 'rgba(76, 175, 80, 0.1)' :
                                        tx.type === 'Sell' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(0, 240, 255, 0.1)',
                                color: tx.type === 'Buy' ? '#4caf50' :
                                      tx.type === 'Sell' ? '#f44336' : '#00F0FF',
                                borderRadius: '4px',
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'table-cell', p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <Typography variant="body2">{tx.asset}</Typography>
                          </Box>
                          <Box sx={{ display: 'table-cell', p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <Typography variant="body2">{tx.amount}</Typography>
                          </Box>
                          <Box sx={{ display: 'table-cell', p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <Typography variant="body2">{tx.value}</Typography>
                          </Box>
                          <Box sx={{ display: 'table-cell', p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              {tx.date}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </DashboardCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </DashboardContainer>
    </Box>
  );
}