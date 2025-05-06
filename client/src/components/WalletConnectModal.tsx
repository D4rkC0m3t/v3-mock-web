import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  styled,
  Avatar,
  Tabs,
  Tab,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import {
  AccountBalanceWallet,
  Storage,
  Close,
  ArrowBack,
  Check,
  Error as ErrorIcon,
  KeyboardArrowRight
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  WalletType,
  NetworkType,
  HotWalletProvider,
  ColdWalletProvider,
  hotWalletProviders,
  coldWalletProviders,
  connectWallet,
  WalletConnectionOptions,
  WalletConnectionResult
} from '../utils/walletConnector';

// Styled components
const WalletOption = styled(Paper)(({ theme }) => ({
  padding: '1.5rem',
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
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
  }
}));

const ProviderOption = styled(Paper)(({ theme }) => ({
  padding: '1rem',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`network-tabpanel-${index}`}
      aria-labelledby={`network-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface WalletConnectModalProps {
  open: boolean;
  onClose: () => void;
  onConnect: (result: WalletConnectionResult) => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ open, onClose, onConnect }) => {
  // State for network selection
  const [networkTab, setNetworkTab] = useState(0);
  const [network, setNetwork] = useState<NetworkType>('mainnet');
  
  // State for wallet type and provider
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [provider, setProvider] = useState<HotWalletProvider | ColdWalletProvider | null>(null);
  
  // State for connection process
  const [activeStep, setActiveStep] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionResult, setConnectionResult] = useState<WalletConnectionResult | null>(null);
  
  // Handle network tab change
  const handleNetworkTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setNetworkTab(newValue);
    setNetwork(newValue === 0 ? 'mainnet' : 'testnet');
  };
  
  // Handle wallet type selection
  const handleWalletTypeSelect = (type: WalletType) => {
    setWalletType(type);
    setActiveStep(1);
  };
  
  // Handle provider selection
  const handleProviderSelect = (selectedProvider: HotWalletProvider | ColdWalletProvider) => {
    setProvider(selectedProvider);
    setActiveStep(2);
  };
  
  // Handle back button
  const handleBack = () => {
    if (activeStep === 1) {
      setWalletType(null);
      setActiveStep(0);
    } else if (activeStep === 2) {
      setProvider(null);
      setActiveStep(1);
    }
  };
  
  // Handle connection
  const handleConnect = async () => {
    if (!walletType || !provider) return;
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      const options: WalletConnectionOptions = {
        walletType,
        network,
        provider,
        timeout: 2000
      };
      
      const result = await connectWallet(options);
      
      if (result.success) {
        setConnectionResult(result);
        setActiveStep(3);
      } else {
        setConnectionError(result.error || 'Connection failed');
      }
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle confirmation
  const handleConfirm = () => {
    if (connectionResult) {
      onConnect(connectionResult);
      handleReset();
      onClose();
    }
  };
  
  // Reset the modal state
  const handleReset = () => {
    setNetworkTab(0);
    setNetwork('mainnet');
    setWalletType(null);
    setProvider(null);
    setActiveStep(0);
    setIsConnecting(false);
    setConnectionError(null);
    setConnectionResult(null);
  };
  
  // Handle modal close
  const handleModalClose = () => {
    handleReset();
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleModalClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: '#0A0E17',
          borderRadius: '16px',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {activeStep > 0 && (
            <IconButton 
              onClick={handleBack}
              sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ color: 'white' }}>
            {activeStep === 0 && 'Connect Wallet'}
            {activeStep === 1 && `Select ${walletType === 'hot' ? 'Hot' : 'Cold'} Wallet Provider`}
            {activeStep === 2 && 'Connect to Wallet'}
            {activeStep === 3 && 'Connection Successful'}
          </Typography>
        </Box>
        <IconButton onClick={handleModalClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ 
          mb: 4, 
          '.MuiStepLabel-label': { color: 'white' },
          '.MuiStepIcon-root': { color: 'rgba(0, 240, 255, 0.7)' },
          '.MuiStepIcon-text': { fill: '#000' },
          '.MuiStepConnector-line': { borderColor: 'rgba(0, 240, 255, 0.3)' }
        }}>
          <Step>
            <StepLabel>Select Wallet Type</StepLabel>
          </Step>
          <Step>
            <StepLabel>Choose Provider</StepLabel>
          </Step>
          <Step>
            <StepLabel>Connect</StepLabel>
          </Step>
          <Step>
            <StepLabel>Confirm</StepLabel>
          </Step>
        </Stepper>
        
        {activeStep === 0 && (
          <>
            <Box sx={{ mb: 3 }}>
              <Tabs 
                value={networkTab} 
                onChange={handleNetworkTabChange}
                variant="fullWidth"
                sx={{
                  '.MuiTabs-indicator': { backgroundColor: '#00F0FF' },
                  '.MuiTab-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '.Mui-selected': { color: '#00F0FF' }
                }}
              >
                <Tab label="Mainnet" />
                <Tab label="Testnet" />
              </Tabs>
              
              <TabPanel value={networkTab} index={0}>
                <Alert severity="info" sx={{ 
                  mb: 3, 
                  backgroundColor: 'rgba(0, 240, 255, 0.1)', 
                  color: 'white',
                  border: '1px solid rgba(0, 240, 255, 0.3)'
                }}>
                  Mainnet uses real assets and transactions will incur actual fees.
                </Alert>
              </TabPanel>
              
              <TabPanel value={networkTab} index={1}>
                <Alert severity="warning" sx={{ 
                  mb: 3, 
                  backgroundColor: 'rgba(255, 165, 0, 0.1)', 
                  color: 'white',
                  border: '1px solid rgba(255, 165, 0, 0.3)'
                }}>
                  Testnet uses test tokens with no real value. Perfect for testing and development.
                </Alert>
              </TabPanel>
            </Box>
            
            <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
              Select Wallet Type
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <WalletOption onClick={() => handleWalletTypeSelect('hot')}>
                    <Avatar sx={{ bgcolor: 'rgba(0, 240, 255, 0.2)', width: 64, height: 64, mb: 2 }}>
                      <AccountBalanceWallet sx={{ color: '#00F0FF', fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      Hot Wallet
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      Connect to a browser-based wallet for everyday transactions. 
                      Suitable for frequent trading and smaller amounts.
                    </Typography>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: '8px', 
                      bgcolor: 'rgba(0, 240, 255, 0.1)', 
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      width: '100%'
                    }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        MetaMask, Coinbase Wallet, WalletConnect
                      </Typography>
                    </Box>
                  </WalletOption>
                </motion.div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <WalletOption onClick={() => handleWalletTypeSelect('cold')}>
                    <Avatar sx={{ bgcolor: 'rgba(0, 240, 255, 0.2)', width: 64, height: 64, mb: 2 }}>
                      <Storage sx={{ color: '#00F0FF', fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      Cold Wallet
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      Connect to a hardware wallet for enhanced security.
                      Recommended for long-term storage and larger amounts.
                    </Typography>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: '8px', 
                      bgcolor: 'rgba(0, 240, 255, 0.1)', 
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      width: '100%'
                    }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        Ledger, Trezor, KeepKey
                      </Typography>
                    </Box>
                  </WalletOption>
                </motion.div>
              </Grid>
            </Grid>
          </>
        )}
        
        {activeStep === 1 && walletType && (
          <>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Select {walletType === 'hot' ? 'Hot' : 'Cold'} Wallet Provider
            </Typography>
            
            <Grid container spacing={2}>
              {(walletType === 'hot' ? hotWalletProviders : coldWalletProviders).map((item) => (
                <Grid item xs={12} sm={6} key={item.id}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ProviderOption 
                      onClick={() => handleProviderSelect(item.id as any)}
                      sx={{ p: 2 }}
                    >
                      <Box sx={{ fontSize: '32px', mr: 2 }}>{item.icon}</Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: 'white' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {item.description}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 'auto' }}>
                        <KeyboardArrowRight sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </Box>
                    </ProviderOption>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        
        {activeStep === 2 && walletType && provider && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: 'rgba(0, 240, 255, 0.2)', 
                width: 80, 
                height: 80, 
                mx: 'auto',
                mb: 2
              }}>
                {walletType === 'hot' ? (
                  <AccountBalanceWallet sx={{ color: '#00F0FF', fontSize: 40 }} />
                ) : (
                  <Storage sx={{ color: '#00F0FF', fontSize: 40 }} />
                )}
              </Avatar>
              
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Connecting to {
                  (walletType === 'hot' 
                    ? hotWalletProviders 
                    : coldWalletProviders
                  ).find(p => p.id === provider)?.name
                }
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                {walletType === 'hot' 
                  ? 'Please approve the connection request in your wallet extension'
                  : 'Please connect your hardware wallet and follow the instructions on the device'
                }
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                borderRadius: '8px', 
                bgcolor: 'rgba(0, 240, 255, 0.1)', 
                border: '1px solid rgba(0, 240, 255, 0.2)',
                mb: 3,
                maxWidth: '400px',
                mx: 'auto'
              }}>
                <Typography variant="body2" sx={{ color: 'white', textAlign: 'left' }}>
                  <strong>Network:</strong> {network === 'mainnet' ? 'Ethereum Mainnet' : 'Sepolia Testnet'}
                </Typography>
                {walletType === 'cold' && (
                  <Typography variant="body2" sx={{ color: 'white', textAlign: 'left', mt: 1 }}>
                    <strong>Steps:</strong> Connect device → Enter PIN → Open Ethereum app
                  </Typography>
                )}
              </Box>
              
              {connectionError && (
                <Alert severity="error" sx={{ 
                  mb: 3, 
                  backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                  color: 'white',
                  border: '1px solid rgba(255, 0, 0, 0.3)'
                }}>
                  {connectionError}
                </Alert>
              )}
              
              {isConnecting ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <CircularProgress size={24} sx={{ color: '#00F0FF' }} />
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    Connecting...
                  </Typography>
                </Box>
              ) : (
                <GradientButton 
                  onClick={handleConnect}
                  size="large"
                >
                  Connect
                </GradientButton>
              )}
            </Box>
          </Box>
        )}
        
        {activeStep === 3 && connectionResult && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: 'rgba(0, 255, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}>
              <Check sx={{ color: '#4CAF50', fontSize: 40 }} />
            </Box>
            
            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
              Wallet Connected Successfully
            </Typography>
            
            <Box sx={{ 
              p: 3, 
              borderRadius: '8px', 
              bgcolor: 'rgba(0, 240, 255, 0.1)', 
              border: '1px solid rgba(0, 240, 255, 0.2)',
              mb: 3,
              maxWidth: '400px',
              mx: 'auto',
              textAlign: 'left'
            }}>
              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                <strong>Wallet Type:</strong> {connectionResult.walletType === 'hot' ? 'Hot Wallet' : 'Cold Wallet'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                <strong>Provider:</strong> {
                  (connectionResult.walletType === 'hot' 
                    ? hotWalletProviders 
                    : coldWalletProviders
                  ).find(p => p.id === connectionResult.provider)?.name
                }
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                <strong>Network:</strong> {connectionResult.network === 'mainnet' ? 'Ethereum Mainnet' : 'Sepolia Testnet'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                <strong>Address:</strong> {connectionResult.address.slice(0, 8)}...{connectionResult.address.slice(-6)}
              </Typography>
              {connectionResult.balance && (
                <Typography variant="body2" sx={{ color: 'white' }}>
                  <strong>Balance:</strong> {connectionResult.balance} {connectionResult.network === 'mainnet' ? 'ETH' : 'SepoliaETH'}
                </Typography>
              )}
            </Box>
            
            <Alert severity="success" sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(0, 255, 0, 0.1)', 
              color: 'white',
              border: '1px solid rgba(0, 255, 0, 0.3)'
            }}>
              Your wallet is now connected. You can now use it to interact with the platform.
            </Alert>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button 
          onClick={handleModalClose}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Cancel
        </Button>
        
        {activeStep === 3 && connectionResult && (
          <GradientButton onClick={handleConfirm}>
            Continue
          </GradientButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WalletConnectModal;
