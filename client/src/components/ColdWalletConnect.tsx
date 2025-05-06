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
  Divider,
  Step,
  Stepper,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Storage,
  ArrowForward,
  KeyboardBackspace,
  QrCodeScanner,
  CheckCircle,
  Error
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

interface ColdWalletConnectProps {
  onConnect: (address: string) => void;
  onBack: () => void;
  network: 'mainnet' | 'testnet';
}

// Mock hardware wallet providers
const hardwareWallets = [
  { id: 'ledger', name: 'Ledger', icon: '🔒' },
  { id: 'trezor', name: 'Trezor', icon: '🛡️' },
  { id: 'keepkey', name: 'KeepKey', icon: '🔑' },
];

const ColdWalletConnect: React.FC<ColdWalletConnectProps> = ({ onConnect, onBack, network }) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [walletAddress, setWalletAddress] = useState('');

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId);
    setActiveStep(1);
  };

  const handleConnect = () => {
    setConnectionStatus('connecting');
    setIsConnecting(true);

    // Simulate connection process
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo

      if (success) {
        setConnectionStatus('success');
        // Generate a random wallet address
        const address = '0x' + Array(40).fill(0).map(() =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        setWalletAddress(address);
        setActiveStep(2);
      } else {
        setConnectionStatus('error');
      }

      setIsConnecting(false);
    }, 3000);
  };

  const handleRetry = () => {
    setConnectionStatus('idle');
  };

  const handleConfirm = () => {
    onConnect(walletAddress);
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
            Connect Cold Wallet
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
        <Stepper activeStep={activeStep} orientation="vertical" sx={{
          '.MuiStepLabel-label': { color: 'white' },
          '.MuiStepIcon-root': { color: 'rgba(0, 240, 255, 0.7)' },
          '.MuiStepIcon-text': { fill: '#000' },
          '.MuiStepConnector-line': { borderColor: 'rgba(0, 240, 255, 0.3)' }
        }}>
          <Step>
            <StepLabel>Select Hardware Wallet</StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                Choose your hardware wallet device:
              </Typography>

              <Grid container spacing={2}>
                {hardwareWallets.map((wallet) => (
                  <Grid item xs={12} sm={4} key={wallet.id}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <WalletButton
                        fullWidth
                        onClick={() => handleWalletSelect(wallet.id)}
                        sx={{ height: '120px' }}
                      >
                        <Box sx={{ fontSize: '32px', mb: 1 }}>{wallet.icon}</Box>
                        <Typography variant="body1" sx={{ color: 'white' }}>
                          {wallet.name}
                        </Typography>
                      </WalletButton>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Connect Device</StepLabel>
            <StepContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                  Please follow these steps to connect your {hardwareWallets.find(w => w.id === selectedWallet)?.name}:
                </Typography>

                <Box sx={{ pl: 2, borderLeft: '2px solid rgba(0, 240, 255, 0.3)' }}>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                    1. Connect your device to your computer via USB
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                    2. Enter your PIN on the device
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                    3. Open the Ethereum app on your device
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                    4. Click "Connect" below and approve the connection on your device
                  </Typography>
                </Box>
              </Box>

              {connectionStatus === 'connecting' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} sx={{ color: '#00F0FF', mr: 2 }} />
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    Connecting to your device...
                  </Typography>
                </Box>
              ) : connectionStatus === 'error' ? (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: '8px',
                  bgcolor: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  mb: 2
                }}>
                  <Error sx={{ color: '#ff5252', mr: 2 }} />
                  <Box>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      Connection failed
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Please make sure your device is connected and unlocked
                    </Typography>
                  </Box>
                </Box>
              ) : null}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(0)}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  Back
                </Button>

                {connectionStatus === 'error' ? (
                  <GradientButton onClick={handleRetry}>
                    Retry Connection
                  </GradientButton>
                ) : (
                  <GradientButton
                    onClick={handleConnect}
                    disabled={isConnecting}
                    endIcon={isConnecting ? <CircularProgress size={16} color="inherit" /> : <ArrowForward />}
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Device'}
                  </GradientButton>
                )}
              </Box>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Confirm Connection</StepLabel>
            <StepContent>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderRadius: '8px',
                bgcolor: 'rgba(0, 255, 0, 0.1)',
                border: '1px solid rgba(0, 255, 0, 0.3)',
                mb: 3
              }}>
                <CheckCircle sx={{ color: '#4caf50', mr: 2 }} />
                <Box>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    Device connected successfully
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Your {hardwareWallets.find(w => w.id === selectedWallet)?.name} is now connected
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  Connected wallet address:
                </Typography>
                <Box sx={{
                  p: 2,
                  borderRadius: '8px',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  wordBreak: 'break-all'
                }}>
                  <Typography variant="body1" sx={{ color: 'white', fontFamily: 'monospace' }}>
                    {walletAddress}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(1)}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  Back
                </Button>

                <GradientButton onClick={handleConfirm}>
                  Confirm & Continue
                </GradientButton>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </WalletCard>
    </Box>
  );
};

export default ColdWalletConnect;
