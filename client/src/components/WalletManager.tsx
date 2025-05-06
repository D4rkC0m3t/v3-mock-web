import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { AccountBalanceWallet, Storage, Shield, Warning } from '@mui/icons-material';

interface WalletManagerProps {
  onWalletConnect: (walletType: 'hot' | 'cold', address: string) => void;
  onError: (error: string) => void;
}

interface WalletState {
  isConnecting: boolean;
  error: string | null;
  address: string | null;
  type: 'hot' | 'cold' | null;
}

export const WalletManager: React.FC<WalletManagerProps> = ({ onWalletConnect, onError }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnecting: false,
    error: null,
    address: null,
    type: null,
  });

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });

  // Function to handle hot wallet connection
  const connectHotWallet = async () => {
    try {
      setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];

      // Update state and notify parent
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        address,
        type: 'hot',
      }));

      onWalletConnect('hot', address);
      showNotification('Hot wallet connected successfully!', 'success');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect hot wallet';
      handleError(errorMessage);
    }
  };

  // Function to handle cold wallet connection
  const connectColdWallet = async () => {
    try {
      setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

      // Implement cold wallet connection logic here
      // This could involve QR code scanning, hardware wallet integration, etc.
      // For now, we'll simulate a connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      const simulatedAddress = '0x' + Array(40).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)).join('');

      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        address: simulatedAddress,
        type: 'cold',
      }));

      onWalletConnect('cold', simulatedAddress);
      showNotification('Cold wallet connected successfully!', 'success');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect cold wallet';
      handleError(errorMessage);
    }
  };

  // Error handling function
  const handleError = (errorMessage: string) => {
    setWalletState(prev => ({
      ...prev,
      isConnecting: false,
      error: errorMessage,
    }));
    onError(errorMessage);
    showNotification(errorMessage, 'error');
  };

  // Notification helper
  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({
      open: true,
      message: '',
      severity,
    });
    setTimeout(() => setNotification(prev => ({ ...prev, open: false })), 1500);
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Effect to handle wallet events
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setWalletState(prev => ({
            ...prev,
            address: null,
            type: null,
          }));
          showNotification('Wallet disconnected', 'info');
        } else if (walletState.type === 'hot') {
          // Update the connected address
          setWalletState(prev => ({
            ...prev,
            address: accounts[0],
          }));
          showNotification('Wallet account changed', 'info');
        }
      };

      const handleChainChanged = () => {
        // Reload the page when the chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletState.type]);

  return (
    <Box sx={{ width: '100%' }}>
      {walletState.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {walletState.error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AccountBalanceWallet />}
          onClick={connectHotWallet}
          disabled={walletState.isConnecting || walletState.type === 'hot'}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {walletState.isConnecting && walletState.type === null ? (
            <CircularProgress size={24} color="inherit" />
          ) : walletState.type === 'hot' ? (
            'Connected to Hot Wallet'
          ) : (
            'Connect Hot Wallet'
          )}
        </Button>

        <Button
          variant="contained"
          startIcon={<Storage />}
          onClick={connectColdWallet}
          disabled={walletState.isConnecting || walletState.type === 'cold'}
          sx={{
            bgcolor: 'secondary.main',
            '&:hover': { bgcolor: 'secondary.dark' },
          }}
        >
          {walletState.isConnecting && walletState.type === null ? (
            <CircularProgress size={24} color="inherit" />
          ) : walletState.type === 'cold' ? (
            'Connected to Cold Wallet'
          ) : (
            'Connect Cold Wallet'
          )}
        </Button>
      </Box>

      {walletState.address && (
        <Typography variant="body2" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Shield fontSize="small" color="success" />
          Connected Address: {walletState.address}
        </Typography>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={1500}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          icon={notification.severity === 'success' ? '✓' : '!'}
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{

            minWidth: 'auto',
            padding: '6px 16px',
            '& .MuiAlert-message': {
              display: 'none'
            }
          }}
        />
      </Snackbar>
    </Box>
  );
};

export default WalletManager;