import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  styled,
  Grid,
  Avatar,
  Chip,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  AccountBalanceWallet,
  Storage,
  Notifications,
  ArrowUpward,
  ArrowDownward,
  SwapHoriz,
  History,
  ContentCopy,
  Shield,
  Refresh,
  PowerSettingsNew,
  Settings,
  SwapVert
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import WalletConnectModal from './components/WalletConnectModal';
import NetworkIndicator from './components/NetworkIndicator';
import WalletTransaction from './components/WalletTransaction';
import SimpleSendTokenModal from './components/SimpleSendTokenModal';
import SimpleReceiveTokenModal from './components/SimpleReceiveTokenModal';
import SimpleSwapTokenModal from './components/SimpleSwapTokenModal';
import {
  WalletConnectionResult,
  NetworkType,
  WalletType,
  switchNetwork,
  disconnectWallet,
  getWalletBalance,
  sendTransaction
} from './utils/walletConnector';
import { WalletAsset, WalletTransaction as WalletTx } from './types/wallet';
import Logo from './components/Logo';

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

// Interface for wallet connection state
interface WalletState {
  isConnected: boolean;
  address: string;
  type: WalletType | null;
  network: NetworkType;
  provider?: string;
  balance?: string;
  isLoading: boolean;
  error: string | null;
}

export default function SimpleWallet() {
  // State for wallet connection
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: '',
    type: null,
    network: 'testnet',
    isLoading: false,
    error: null
  });

  // State for wallet connect modal
  const [isConnectModalOpen, setConnectModalOpen] = useState(false);

  // State for send token modal
  const [isSendModalOpen, setSendModalOpen] = useState(false);

  // State for receive token modal
  const [isReceiveModalOpen, setReceiveModalOpen] = useState(false);

  // State for swap token modal
  const [isSwapModalOpen, setSwapModalOpen] = useState(false);

  // State for network menu
  const [networkMenuAnchor, setNetworkMenuAnchor] = useState<null | HTMLElement>(null);

  // State for wallet menu
  const [walletMenuAnchor, setWalletMenuAnchor] = useState<null | HTMLElement>(null);

  // State for wallet assets
  const [assets, setAssets] = useState<WalletAsset[]>([]);

  // State for recent transactions
  const [transactions, setTransactions] = useState<WalletTx[]>([]);

  // State for loading states
  const [isAssetsLoading, setAssetsLoading] = useState(false);
  const [isTransactionsLoading, setTransactionsLoading] = useState(false);

  // Function to open wallet connect modal
  const openConnectModal = () => {
    setConnectModalOpen(true);
  };

  // Function to close wallet connect modal
  const closeConnectModal = () => {
    setConnectModalOpen(false);
  };

  // Function to open send token modal
  const openSendModal = () => {
    setSendModalOpen(true);
  };

  // Function to close send token modal
  const closeSendModal = () => {
    setSendModalOpen(false);
  };

  // Function to open receive token modal
  const openReceiveModal = () => {
    setReceiveModalOpen(true);
  };

  // Function to close receive token modal
  const closeReceiveModal = () => {
    setReceiveModalOpen(false);
  };

  // Function to open swap token modal
  const openSwapModal = () => {
    setSwapModalOpen(true);
  };

  // Function to close swap token modal
  const closeSwapModal = () => {
    setSwapModalOpen(false);
  };

  // Function to handle transaction completion
  const handleTransactionComplete = (txHash: string) => {
    // Refresh wallet data after transaction
    setTimeout(() => {
      loadWalletData(walletState.network);
    }, 2000);
  };

  // Function to handle wallet connection
  const handleWalletConnect = (result: WalletConnectionResult) => {
    if (result.success) {
      setWalletState({
        isConnected: true,
        address: result.address,
        type: result.walletType,
        network: result.network,
        provider: result.provider,
        balance: result.balance,
        isLoading: false,
        error: null
      });

      // Load wallet data
      loadWalletData(result.network);
    }
  };

  // Function to handle network menu open
  const handleNetworkMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNetworkMenuAnchor(event.currentTarget);
  };

  // Function to handle network menu close
  const handleNetworkMenuClose = () => {
    setNetworkMenuAnchor(null);
  };

  // Function to handle wallet menu open
  const handleWalletMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setWalletMenuAnchor(event.currentTarget);
  };

  // Function to handle wallet menu close
  const handleWalletMenuClose = () => {
    setWalletMenuAnchor(null);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Function to handle network switch
  const handleNetworkSwitch = async (network: NetworkType) => {
    handleNetworkMenuClose();

    if (network === walletState.network) return;

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await switchNetwork(network);

      if (success) {
        setWalletState(prev => ({ ...prev, network, isLoading: false }));
        loadWalletData(network);
      } else {
        throw new Error(`Failed to switch to ${network}`);
      }
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to switch network'
      }));
    }
  };

  // Function to disconnect wallet
  const handleDisconnectWallet = async () => {
    handleWalletMenuClose();

    setWalletState(prev => ({ ...prev, isLoading: true }));

    try {
      await disconnectWallet();

      setWalletState({
        isConnected: false,
        address: '',
        type: null,
        network: 'testnet',
        isLoading: false,
        error: null
      });

      setAssets([]);
      setTransactions([]);
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to disconnect wallet'
      }));
    }
  };

  // Function to refresh wallet data
  const handleRefreshWallet = () => {
    handleWalletMenuClose();
    loadWalletData(walletState.network);
  };

  // Function to copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setWalletState(prev => ({ ...prev, error: 'Address copied to clipboard!' }));
    setTimeout(() => setWalletState(prev => ({ ...prev, error: null })), 3000);
  };

  // Function to load wallet data
  const loadWalletData = async (network: NetworkType) => {
    setAssetsLoading(true);
    setTransactionsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock assets based on network
      const mockAssets: WalletAsset[] = network === 'testnet'
        ? [
            { symbol: 'tBTC', name: 'Test Bitcoin', balance: '10.5', value: '$645,750.00', change: '+2.5%', icon: '₿', network },
            { symbol: 'tETH', name: 'Test Ethereum', balance: '25.0', value: '$78,125.00', change: '+1.3%', icon: 'Ξ', network },
            { symbol: 'tSOL', name: 'Test Solana', balance: '500', value: '$71,500.00', change: '+6.2%', icon: 'S', network },
            { symbol: 'tADA', name: 'Test Cardano', balance: '10000', value: '$5,800.00', change: '+0.5%', icon: 'A', network },
            { symbol: 'tDOT', name: 'Test Polkadot', balance: '1000', value: '$7,230.00', change: '+4.2%', icon: 'D', network },
            { symbol: 'tUSDT', name: 'Test Tether', balance: '5000', value: '$5,000.00', change: '0.0%', icon: 'T', network },
          ]
        : [
            { symbol: 'BTC', name: 'Bitcoin', balance: '0.42', value: '$25,830.00', change: '+1.2%', icon: '₿', network },
            { symbol: 'ETH', name: 'Ethereum', balance: '3.5', value: '$10,937.50', change: '+0.8%', icon: 'Ξ', network },
            { symbol: 'SOL', name: 'Solana', balance: '45.2', value: '$6,458.60', change: '+4.5%', icon: 'S', network },
            { symbol: 'ADA', name: 'Cardano', balance: '1250', value: '$725.00', change: '-0.7%', icon: 'A', network },
            { symbol: 'DOT', name: 'Polkadot', balance: '120', value: '$867.60', change: '+3.1%', icon: 'D', network },
            { symbol: 'USDT', name: 'Tether', balance: '1500', value: '$1,500.00', change: '0.0%', icon: 'T', network },
          ];

      // Generate mock transactions based on network
      const mockTransactions: WalletTx[] = network === 'testnet'
        ? [
            { type: 'deposit', asset: 'tBTC', amount: '5.0', value: '$305,025.00', date: '2023-06-20', status: 'completed', txHash: '0xtest1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t', network },
            { type: 'withdraw', asset: 'tETH', amount: '10.0', value: '$31,250.00', date: '2023-06-19', status: 'completed', txHash: '0xtest2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a', network },
            { type: 'swap', asset: 'tSOL → tBTC', amount: '100.0', value: '$14,300.00', date: '2023-06-18', status: 'completed', txHash: '0xtest3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b', network },
            { type: 'stake', asset: 'tETH', amount: '5.0', value: '$15,625.00', date: '2023-06-17', status: 'completed', txHash: '0xtest4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c', network },
            { type: 'reward', asset: 'tDOT', amount: '50.0', value: '$361.50', date: '2023-06-16', status: 'completed', txHash: '0xtest5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d', network },
            { type: 'unstake', asset: 'tSOL', amount: '150.0', value: '$21,450.00', date: '2023-06-15', status: 'pending', txHash: '0xtest6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e', network },
          ]
        : [
            { type: 'deposit', asset: 'BTC', amount: '0.05', value: '$3,050.25', date: '2023-06-15', status: 'completed', txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t', network },
            { type: 'withdraw', asset: 'ETH', amount: '1.2', value: '$3,750.00', date: '2023-06-12', status: 'completed', txHash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a', network },
            { type: 'swap', asset: 'SOL → BTC', amount: '10.0', value: '$1,430.00', date: '2023-06-10', status: 'completed', txHash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b', network },
            { type: 'stake', asset: 'ETH', amount: '0.5', value: '$1,562.50', date: '2023-06-08', status: 'completed', txHash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c', network },
          ];

      setAssets(mockAssets);
      setTransactions(mockTransactions);
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load wallet data'
      }));
    } finally {
      setAssetsLoading(false);
      setTransactionsLoading(false);
    }
  };

  // Load wallet data on component mount if wallet is connected
  useEffect(() => {
    if (walletState.isConnected) {
      loadWalletData(walletState.network);
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0A0E17' }}>
      {/* Wallet Connect Modal */}
      <WalletConnectModal
        open={isConnectModalOpen}
        onClose={closeConnectModal}
        onConnect={handleWalletConnect}
      />

      {/* Send Token Modal */}
      {walletState.isConnected && (
        <SimpleSendTokenModal
          open={isSendModalOpen}
          onClose={closeSendModal}
          assets={assets}
          network={walletState.network}
          walletAddress={walletState.address}
          onSendComplete={handleTransactionComplete}
        />
      )}

      {/* Receive Token Modal */}
      {walletState.isConnected && (
        <SimpleReceiveTokenModal
          open={isReceiveModalOpen}
          onClose={closeReceiveModal}
          network={walletState.network}
          walletAddress={walletState.address}
        />
      )}

      {/* Swap Token Modal */}
      {walletState.isConnected && (
        <SimpleSwapTokenModal
          open={isSwapModalOpen}
          onClose={closeSwapModal}
          assets={assets}
          network={walletState.network}
          onSwapComplete={handleTransactionComplete}
        />
      )}

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
        {walletState.error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 240, 255, 0.1)', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
            <Typography variant="body1" sx={{ color: 'white' }}>
              {walletState.error}
            </Typography>
          </Box>
        )}

        {/* Wallet Connection Status */}
        {!walletState.isConnected ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>
              Connect your wallet to view assets and transactions
            </Typography>
            <Button
              variant="contained"
              startIcon={<AccountBalanceWallet />}
              onClick={openConnectModal}
              sx={{
                background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
                color: 'white',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2CF6FF, #0080FF)',
                }
              }}
            >
              Connect Wallet
            </Button>
          </Box>
        ) : (
          <>
            {/* Wallet Address and Actions */}
            <Box sx={{ mb: 4 }}>
              <WalletCard sx={{
                borderColor: walletState.network === 'testnet' ? 'rgba(255, 165, 0, 0.3)' : 'rgba(0, 240, 255, 0.3)',
                '&::before': {
                  background: walletState.network === 'testnet'
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
                      {walletState.type === 'hot' ? (
                        <AccountBalanceWallet sx={{ color: '#00F0FF' }} />
                      ) : (
                        <Storage sx={{ color: '#00F0FF' }} />
                      )}
                    </Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {walletState.type === 'hot' ? 'Hot Wallet' : 'Cold Wallet'}
                        </Typography>
                        <NetworkIndicator network={walletState.network} size="small" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ color: 'white' }}>
                          {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
                        </Typography>
                        <IconButton size="small" onClick={() => copyToClipboard(walletState.address)}>
                          <ContentCopy sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {walletState.type === 'cold' && (
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

                    {/* Network Menu Button */}
                    <Button
                      variant="outlined"
                      onClick={handleNetworkMenuOpen}
                      endIcon={<SwapVert />}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        mr: 1,
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                    >
                      Network
                    </Button>
                    <Menu
                      anchorEl={networkMenuAnchor}
                      open={Boolean(networkMenuAnchor)}
                      onClose={handleNetworkMenuClose}
                      PaperProps={{
                        sx: {
                          bgcolor: '#0A0E17',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                          color: 'white',
                          minWidth: '180px'
                        }
                      }}
                    >
                      <MenuItem
                        onClick={() => handleNetworkSwitch('mainnet')}
                        selected={walletState.network === 'mainnet'}
                        sx={{
                          '&.Mui-selected': { bgcolor: 'rgba(0, 240, 255, 0.1)' },
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
                        }}
                      >
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: '#4CAF50',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText>Mainnet</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleNetworkSwitch('testnet')}
                        selected={walletState.network === 'testnet'}
                        sx={{
                          '&.Mui-selected': { bgcolor: 'rgba(255, 165, 0, 0.1)' },
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
                        }}
                      >
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: '#FFA500',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText>Testnet</ListItemText>
                      </MenuItem>
                    </Menu>

                    {/* Wallet Menu Button */}
                    <Button
                      variant="outlined"
                      onClick={handleWalletMenuOpen}
                      endIcon={<Settings />}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                    >
                      Wallet
                    </Button>
                    <Menu
                      anchorEl={walletMenuAnchor}
                      open={Boolean(walletMenuAnchor)}
                      onClose={handleWalletMenuClose}
                      PaperProps={{
                        sx: {
                          bgcolor: '#0A0E17',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                          color: 'white',
                          minWidth: '180px'
                        }
                      }}
                    >
                      <MenuItem onClick={handleRefreshWallet}>
                        <ListItemIcon>
                          <Refresh sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </ListItemIcon>
                        <ListItemText>Refresh</ListItemText>
                      </MenuItem>
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      <MenuItem onClick={handleDisconnectWallet}>
                        <ListItemIcon>
                          <PowerSettingsNew sx={{ color: '#FF5252' }} />
                        </ListItemIcon>
                        <ListItemText sx={{ color: '#FF5252' }}>Disconnect</ListItemText>
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <ActionButton onClick={openSendModal}>
                      <ArrowUpward />
                      Send
                    </ActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ActionButton onClick={openReceiveModal}>
                      <ArrowDownward />
                      Receive
                    </ActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ActionButton onClick={openSwapModal}>
                      <SwapHoriz />
                      Swap
                    </ActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ActionButton component={Link} to="/history">
                      <History />
                      History
                    </ActionButton>
                  </Grid>
                </Grid>
              </WalletCard>
            </Box>

            {/* Assets List */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Assets
                </Typography>
                <NetworkIndicator network={walletState.network} showLabel={true} />
              </Box>

              {isAssetsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: '#00F0FF' }} />
                </Box>
              ) : assets.length > 0 ? (
                <Grid container spacing={2}>
                  {assets.map((asset) => (
                    <Grid item xs={12} sm={6} md={4} key={asset.symbol}>
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
              ) : (
                <WalletCard>
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      No assets found for this wallet
                    </Typography>
                  </Box>
                </WalletCard>
              )}
            </Box>

            {/* Recent Transactions */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Recent Transactions
                </Typography>
                <Button
                  variant="text"
                  startIcon={<Refresh />}
                  onClick={() => loadWalletData(walletState.network)}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: 'white',
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  Refresh
                </Button>
              </Box>

              <WalletCard>
                {isTransactionsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: '#00F0FF' }} />
                  </Box>
                ) : transactions.length > 0 ? (
                  <>
                    {transactions.map((tx, index) => (
                      <Box key={tx.txHash}>
                        <WalletTransaction {...tx} />
                        {index < transactions.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                      </Box>
                    ))}
                  </>
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
