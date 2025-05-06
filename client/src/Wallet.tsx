import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Container,
  Grid,
  Chip,
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  CircularProgress
} from "@mui/material";
import {
  AccountBalanceWallet,
  Storage,
  Notifications,
  ArrowUpward,
  ArrowDownward,
  SwapHoriz,
  Bolt,
  ContentCopy,
  History,
  Star,
  Shield
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Logo from "./components/Logo";

// Lazy load wallet components
const WalletSelector = lazy(() => import('./components/WalletSelector'));
const HotWalletConnect = lazy(() => import('./components/HotWalletConnect'));
const ColdWalletConnect = lazy(() => import('./components/ColdWalletConnect'));
const TestComponent = lazy(() => import('./components/TestComponent'));

// Styled components
const WalletCard = styled(Paper)({
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

const ActionButton = styled(Button)({
  borderRadius: '12px',
  padding: '12px',
  textTransform: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  '&:hover': {
    background: 'rgba(0, 240, 255, 0.1)',
    borderColor: 'rgba(0, 240, 255, 0.3)',
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

// Interface for wallet asset
interface WalletAsset {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change: string;
  trending: boolean;
  icon: string;
}

// Interface for wallet transaction
interface WalletTransaction {
  type: 'deposit' | 'withdraw' | 'swap' | 'stake' | 'unstake' | 'reward';
  asset: string;
  amount: string;
  value: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
}

// Enum for wallet connection steps
enum WalletConnectionStep {
  SELECT_TYPE,
  CONNECT_HOT,
  CONNECT_COLD,
  CONNECTED
}

export default function Wallet() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} sx={{ color: '#00F0FF' }} />
      </Box>
    );
  }

  // State for wallet connection
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletType, setWalletType] = useState<'hot' | 'cold' | null>(null);
  const [walletNetwork, setWalletNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
  const [connectionStep, setConnectionStep] = useState<WalletConnectionStep>(WalletConnectionStep.SELECT_TYPE);

  // State for wallet assets
  const [assets, setAssets] = useState<WalletAsset[]>([]);

  // State for recent transactions
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // State for error handling
  const [error, setError] = useState<string | null>(null);

  // Array of floating elements for the background
  const floatingElements = [
    { size: '400px', color: 'rgba(0, 240, 255, 0.15)', left: 10, top: 20, delay: 0 },
    { size: '300px', color: 'rgba(0, 163, 255, 0.12)', left: 75, top: 15, delay: 0.5 },
    { size: '350px', color: 'rgba(0, 240, 255, 0.1)', left: 85, top: 60, delay: 1 },
    { size: '250px', color: 'rgba(0, 163, 255, 0.08)', left: 25, top: 70, delay: 1.5 },
  ];

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Function to handle wallet type selection
  const handleWalletTypeSelect = (type: 'hot' | 'cold', network: 'mainnet' | 'testnet') => {
    setWalletType(type);
    setWalletNetwork(network);
    setConnectionStep(type === 'hot' ? WalletConnectionStep.CONNECT_HOT : WalletConnectionStep.CONNECT_COLD);
  };

  // Function to handle wallet connection
  const handleWalletConnect = (address: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
    setConnectionStep(WalletConnectionStep.CONNECTED);

    // Load wallet data
    loadWalletData();
  };

  // Function to go back to wallet type selection
  const handleBackToSelection = () => {
    setConnectionStep(WalletConnectionStep.SELECT_TYPE);
    setWalletType(null);
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setWalletType(null);
    setWalletNetwork('mainnet');
    setConnectionStep(WalletConnectionStep.SELECT_TYPE);
    setAssets([]);
    setTransactions([]);
  };

  // Function to copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setError('Address copied to clipboard!');
    setTimeout(() => setError(null), 3000);
  };

  // Function to load wallet data
  const loadWalletData = () => {
    if (walletNetwork === 'mainnet') {
      // Generate mock mainnet assets
      const mockAssets: WalletAsset[] = [
        { symbol: 'BTC', name: 'Bitcoin', balance: '0.42', value: '$25,830.00', change: '+1.2%', trending: true, icon: '₿' },
        { symbol: 'ETH', name: 'Ethereum', balance: '3.5', value: '$10,937.50', change: '+0.8%', trending: true, icon: 'Ξ' },
        { symbol: 'SOL', name: 'Solana', balance: '45.2', value: '$6,458.60', change: '+4.5%', trending: true, icon: 'S' },
        { symbol: 'ADA', name: 'Cardano', balance: '1250', value: '$725.00', change: '-0.7%', trending: false, icon: 'A' },
        { symbol: 'DOT', name: 'Polkadot', balance: '120', value: '$867.60', change: '+3.1%', trending: true, icon: 'D' },
        { symbol: 'USDT', name: 'Tether', balance: '1500', value: '$1,500.00', change: '0.0%', trending: true, icon: 'T' },
      ];

      // Generate mock mainnet transactions
      const mockTransactions: WalletTransaction[] = [
        { type: 'deposit', asset: 'BTC', amount: '0.05', value: '$3,050.25', date: '2023-06-15', status: 'completed', txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t' },
        { type: 'withdraw', asset: 'ETH', amount: '1.2', value: '$3,750.00', date: '2023-06-12', status: 'completed', txHash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a' },
        { type: 'swap', asset: 'SOL → BTC', amount: '10.0', value: '$1,430.00', date: '2023-06-10', status: 'completed', txHash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b' },
        { type: 'stake', asset: 'ETH', amount: '0.5', value: '$1,562.50', date: '2023-06-08', status: 'completed', txHash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c' },
        { type: 'reward', asset: 'DOT', amount: '5.0', value: '$36.15', date: '2023-06-05', status: 'completed', txHash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d' },
        { type: 'unstake', asset: 'SOL', amount: '15.0', value: '$2,145.00', date: '2023-06-01', status: 'pending', txHash: '0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e' },
      ];

      setAssets(mockAssets);
      setTransactions(mockTransactions);
    } else {
      // Generate mock testnet assets
      const mockTestnetAssets: WalletAsset[] = [
        { symbol: 'tBTC', name: 'Test Bitcoin', balance: '10.5', value: '$645,750.00', change: '+2.5%', trending: true, icon: '₿' },
        { symbol: 'tETH', name: 'Test Ethereum', balance: '25.0', value: '$78,125.00', change: '+1.3%', trending: true, icon: 'Ξ' },
        { symbol: 'tSOL', name: 'Test Solana', balance: '500', value: '$71,500.00', change: '+6.2%', trending: true, icon: 'S' },
        { symbol: 'tADA', name: 'Test Cardano', balance: '10000', value: '$5,800.00', change: '+0.5%', trending: true, icon: 'A' },
        { symbol: 'tDOT', name: 'Test Polkadot', balance: '1000', value: '$7,230.00', change: '+4.2%', trending: true, icon: 'D' },
        { symbol: 'tUSDT', name: 'Test Tether', balance: '5000', value: '$5,000.00', change: '0.0%', trending: true, icon: 'T' },
      ];

      // Generate mock testnet transactions
      const mockTestnetTransactions: WalletTransaction[] = [
        { type: 'deposit', asset: 'tBTC', amount: '5.0', value: '$305,025.00', date: '2023-06-20', status: 'completed', txHash: '0xtest1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t' },
        { type: 'withdraw', asset: 'tETH', amount: '10.0', value: '$31,250.00', date: '2023-06-19', status: 'completed', txHash: '0xtest2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a' },
        { type: 'swap', asset: 'tSOL → tBTC', amount: '100.0', value: '$14,300.00', date: '2023-06-18', status: 'completed', txHash: '0xtest3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b' },
        { type: 'stake', asset: 'tETH', amount: '5.0', value: '$15,625.00', date: '2023-06-17', status: 'completed', txHash: '0xtest4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c' },
        { type: 'reward', asset: 'tDOT', amount: '50.0', value: '$361.50', date: '2023-06-16', status: 'completed', txHash: '0xtest5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d' },
        { type: 'unstake', asset: 'tSOL', amount: '150.0', value: '$21,450.00', date: '2023-06-15', status: 'pending', txHash: '0xtest6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e' },
        { type: 'deposit', asset: 'tADA', amount: '5000', value: '$2,900.00', date: '2023-06-14', status: 'completed', txHash: '0xtest7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e6f' },
        { type: 'deposit', asset: 'tUSDT', amount: '5000', value: '$5,000.00', date: '2023-06-13', status: 'completed', txHash: '0xtest8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e6f7g' },
      ];

      setAssets(mockTestnetAssets);
      setTransactions(mockTestnetTransactions);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0A0E17' }}>
      {/* Floating background elements */}
      {floatingElements.map((props, index) => (
        <FloatingElement key={index} {...props} />
      ))}

      {/* Navigation Bar */}
      <AppBar position="sticky" sx={{
        background: 'rgba(10, 14, 23, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Logo />

            <Box sx={{ ml: 4, display: { xs: 'none', md: 'flex' } }}>
              {['Dashboard', 'Trade', 'Wallet', 'History'].map((page) => (
                <Button
                  key={page}
                  component={Link}
                  to={`/${page.toLowerCase()}`}
                  sx={{
                    color: 'white',
                    mx: 1,
                    '&:hover': {
                      background: 'rgba(0, 240, 255, 0.1)',
                    },
                    ...(window.location.pathname === `/${page.toLowerCase()}` ? {
                      position: 'relative',
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
                      }
                    } : {})
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Notifications sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </IconButton>

            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                borderColor: 'rgba(0, 240, 255, 0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(0, 240, 255, 0.5)',
                  background: 'rgba(0, 240, 255, 0.1)',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Error message */}
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 240, 255, 0.1)', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
            <Typography variant="body1" sx={{ color: 'white' }}>
              {error}
            </Typography>
          </Box>
        )}

        {/* Test Component */}
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress sx={{ color: '#00F0FF' }} />
          </Box>
        }>
          <TestComponent />
        </Suspense>

        {/* Wallet Connection Flow */}
        {false && (
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress sx={{ color: '#00F0FF' }} />
            </Box>
          }>
            {connectionStep === WalletConnectionStep.SELECT_TYPE && !isWalletConnected && (
              <WalletSelector onSelectWallet={handleWalletTypeSelect} />
            )}

            {connectionStep === WalletConnectionStep.CONNECT_HOT && !isWalletConnected && (
              <HotWalletConnect
                onConnect={handleWalletConnect}
                onBack={handleBackToSelection}
                network={walletNetwork}
              />
            )}

            {connectionStep === WalletConnectionStep.CONNECT_COLD && !isWalletConnected && (
              <ColdWalletConnect
                onConnect={handleWalletConnect}
                onBack={handleBackToSelection}
                network={walletNetwork}
              />
            )}
          </Suspense>
        )}

        {connectionStep === WalletConnectionStep.CONNECTED && isWalletConnected && (
            <>
              {/* Wallet Address and Actions */}
              <Box sx={{ mb: 4 }}>
                <WalletCard sx={{
                  borderColor: walletNetwork === 'testnet' ? 'rgba(255, 165, 0, 0.3)' : 'rgba(0, 240, 255, 0.3)',
                  '&::before': {
                    background: walletNetwork === 'testnet'
                      ? 'linear-gradient(135deg, rgba(255, 165, 0, 0.2), rgba(255, 140, 0, 0.2))'
                      : 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 163, 255, 0.2))'
                  }
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{
                        bgcolor: 'rgba(0, 240, 255, 0.2)',
                        width: 48,
                        height: 48
                      }}>
                        {walletType === 'hot' ? (
                          <AccountBalanceWallet sx={{ color: '#00F0FF' }} />
                        ) : (
                          <Storage sx={{ color: '#00F0FF' }} />
                        )}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {walletType === 'hot' ? 'Hot Wallet' : 'Cold Wallet'}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              px: 1,
                              py: 0.25,
                              borderRadius: '4px',
                              bgcolor: walletNetwork === 'testnet' ? 'rgba(255, 165, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
                              border: `1px solid ${walletNetwork === 'testnet' ? 'rgba(255, 165, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)'}`
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: walletNetwork === 'testnet' ? '#FFA500' : '#4CAF50',
                                mr: 0.5
                              }}
                            />
                            <Typography variant="caption" sx={{ color: walletNetwork === 'testnet' ? '#FFA500' : '#4CAF50' }}>
                              {walletNetwork === 'testnet' ? 'Testnet' : 'Mainnet'}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ color: 'white' }}>
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                          </Typography>
                          <IconButton size="small" onClick={() => copyToClipboard(walletAddress)}>
                            <ContentCopy sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {walletType === 'cold' && (
                        <Chip
                          icon={<Shield sx={{ fontSize: 16 }} />}
                          label="Hardware Protected"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(0, 240, 255, 0.1)',
                            color: '#00F0FF',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            mr: 1
                          }}
                        />
                      )}
                      <Button
                        variant="outlined"
                        onClick={disconnectWallet}
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            background: 'rgba(255, 255, 255, 0.05)'
                          }
                        }}
                      >
                        Disconnect
                      </Button>
                    </Box>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3} component="div">
                      <ActionButton>
                        <ArrowUpward />
                        Send
                      </ActionButton>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} component="div">
                      <ActionButton>
                        <ArrowDownward />
                        Receive
                      </ActionButton>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} component="div">
                      <ActionButton>
                        <SwapHoriz />
                        Swap
                      </ActionButton>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} component="div">
                      <ActionButton>
                        <History />
                        History
                      </ActionButton>
                    </Grid>
                  </Grid>
                </WalletCard>
              </Box>

              {/* Assets List */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                  Assets
                </Typography>
                <Grid container spacing={2}>
                  {assets.map((asset) => (
                    <Grid item xs={12} sm={6} md={4} key={asset.symbol} component="div">
                      <WalletCard>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(0, 240, 255, 0.2)', width: 40, height: 40 }}>
                              {asset.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ color: 'white' }}>
                                {asset.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {asset.symbol}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={asset.change}
                            size="small"
                            sx={{
                              bgcolor: asset.change.startsWith('+') ? 'rgba(0, 255, 0, 0.1)' : asset.change.startsWith('-') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                              color: asset.change.startsWith('+') ? '#00FF00' : asset.change.startsWith('-') ? '#FF0000' : 'white',
                              border: `1px solid ${asset.change.startsWith('+') ? 'rgba(0, 255, 0, 0.3)' : asset.change.startsWith('-') ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'}`
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                            {asset.balance} {asset.symbol}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {asset.value}
                          </Typography>
                        </Box>
                      </WalletCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Recent Transactions */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                  Recent Transactions
                </Typography>
                <WalletCard>
                  {transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                      <Box key={tx.txHash}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: (() => {
                                  switch (tx.type) {
                                    case 'deposit': return 'rgba(0, 255, 0, 0.2)';
                                    case 'withdraw': return 'rgba(255, 0, 0, 0.2)';
                                    case 'swap': return 'rgba(0, 240, 255, 0.2)';
                                    case 'stake': return 'rgba(255, 165, 0, 0.2)';
                                    case 'unstake': return 'rgba(255, 165, 0, 0.2)';
                                    default: return 'rgba(255, 255, 255, 0.2)';
                                  }
                                })(),
                                width: 40,
                                height: 40
                              }}
                            >
                              {(() => {
                                switch (tx.type) {
                                  case 'deposit': return <ArrowDownward />;
                                  case 'withdraw': return <ArrowUpward />;
                                  case 'swap': return <SwapHoriz />;
                                  case 'stake': return <Bolt />;
                                  case 'unstake': return <Bolt />;
                                  default: return <Star />;
                                }
                              })()}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ color: 'white', textTransform: 'capitalize' }}>
                                {tx.type}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {tx.date}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle1" sx={{ color: 'white' }}>
                              {tx.amount} {tx.asset}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {tx.value}
                            </Typography>
                          </Box>
                        </Box>
                        {index < transactions.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        No transactions yet
                      </Typography>
                    </Box>
                  )}
                </WalletCard>
              </Box>
            </>
          )}
      </Box>
    </Box>
  );
}
