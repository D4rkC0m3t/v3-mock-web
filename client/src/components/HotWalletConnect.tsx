import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  styled,
  Avatar,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  AccountBalanceWallet,
  ArrowForward,
  KeyboardBackspace
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Styled components
const WalletCard = styled(Paper)(({ theme }) => ({
  padding: '1.5rem',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
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
}));

const WalletButton = styled(Button)(({ theme }) => ({
  padding: '1rem',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  '&:hover': {
    background: 'rgba(0, 240, 255, 0.1)',
    borderColor: 'rgba(0, 240, 255, 0.3)',
  }
}));

const GradientButton = styled(Button)({
  background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
  color: 'white',
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(0, 240, 255, 0.2)',
  boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'all 0.5s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #2CF6FF, #0080FF)',
    boxShadow: '0 0 25px rgba(0, 240, 255, 0.7)',
    transform: 'translateY(-2px)',
    '&::before': {
      left: '100%',
    }
  },
  '&.Mui-disabled': {
    background: 'rgba(0, 240, 255, 0.3)',
    color: 'rgba(255, 255, 255, 0.5)',
  }
});

interface HotWalletConnectProps {
  onConnect: (address: string) => void;
  onBack: () => void;
  network: 'mainnet' | 'testnet';
}

// Mock wallet providers
const walletProviders = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
  { id: 'phantom', name: 'Phantom', icon: '👻' },
];

const HotWalletConnect: React.FC<HotWalletConnectProps> = ({ onConnect, onBack, network }) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    // Simulate connection process
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      // Generate a random wallet address
      const address = '0x' + Array(40).fill(0).map(() =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      onConnect(address);
    }, 2000);
  };

  const handleManualConnect = () => {
    if (manualAddress.trim() && (manualAddress.startsWith('0x') || manualAddress.startsWith('bc1'))) {
      onConnect(manualAddress);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<KeyboardBackspace />}
          onClick={onBack}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Back
        </Button>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h5" sx={{ color: 'white' }}>
            Connect Hot Wallet
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: network === 'testnet' ? '#FFA500' : '#4CAF50',
                mr: 1
              }}
            />
            <Typography variant="body2" sx={{ color: network === 'testnet' ? '#FFA500' : '#4CAF50' }}>
              {network === 'testnet' ? 'Testnet Mode' : 'Mainnet Mode'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <WalletCard sx={{
        borderColor: network === 'testnet' ? 'rgba(255, 165, 0, 0.3)' : 'rgba(0, 240, 255, 0.3)',
        '&::before': {
          background: network === 'testnet'
            ? 'linear-gradient(135deg, rgba(255, 165, 0, 0.2), rgba(255, 140, 0, 0.2))'
            : 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 163, 255, 0.2))'
        }
      }}>
        {isConnecting ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#00F0FF', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white' }}>
              Connecting to {walletProviders.find(p => p.id === selectedProvider)?.name}...
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
              Please check your wallet application and approve the connection
            </Typography>
          </Box>
        ) : (
          <>
            {!showManualInput ? (
              <>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
                  Select a wallet provider to connect:
                </Typography>

                <Grid container spacing={2}>
                  {walletProviders.map((provider) => (
                    <Grid item xs={12} sm={6} key={provider.id}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <WalletButton
                          fullWidth
                          onClick={() => handleProviderSelect(provider.id)}
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            py: 2
                          }}
                        >
                          <Box sx={{ fontSize: '24px', mr: 2 }}>{provider.icon}</Box>
                          <Typography variant="body1" sx={{ color: 'white' }}>
                            {provider.name}
                          </Typography>
                        </WalletButton>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="text"
                    onClick={() => setShowManualInput(true)}
                    sx={{
                      color: 'rgba(0, 240, 255, 0.8)',
                      '&:hover': {
                        color: '#00F0FF',
                        background: 'rgba(0, 240, 255, 0.1)'
                      }
                    }}
                  >
                    Enter wallet address manually
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
                  Enter your wallet address:
                </Typography>

                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="0x... or bc1..."
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      background: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 240, 255, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(0, 240, 255, 0.5)',
                      },
                    },
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowManualInput(false)}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                  >
                    Back to providers
                  </Button>

                  <GradientButton
                    onClick={handleManualConnect}
                    disabled={!manualAddress.trim() || !(manualAddress.startsWith('0x') || manualAddress.startsWith('bc1'))}
                    endIcon={<ArrowForward />}
                  >
                    Connect Wallet
                  </GradientButton>
                </Box>
              </>
            )}
          </>
        )}
      </WalletCard>
    </Box>
  );
};

export default HotWalletConnect;
