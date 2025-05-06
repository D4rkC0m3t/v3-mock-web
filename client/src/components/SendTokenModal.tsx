import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  IconButton,
  Divider,
  Alert,
  InputAdornment,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Close,
  ArrowForward,
  ContentCopy,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { NetworkType, sendTransaction } from '../utils/walletConnector';
import { WalletAsset } from '../types/wallet';

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

interface SendTokenModalProps {
  open: boolean;
  onClose: () => void;
  assets: WalletAsset[];
  network: NetworkType;
  walletAddress: string;
  onSendComplete: (txHash: string) => void;
}

const SendTokenModal: React.FC<SendTokenModalProps> = ({
  open,
  onClose,
  assets,
  network,
  walletAddress,
  onSendComplete
}) => {
  // State for form fields
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  
  // State for form validation
  const [addressError, setAddressError] = useState('');
  const [amountError, setAmountError] = useState('');
  
  // State for transaction process
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionError, setTransactionError] = useState('');
  
  // Get selected asset details
  const getSelectedAssetDetails = () => {
    return assets.find(asset => asset.symbol === selectedAsset);
  };
  
  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);
  
  // Set initial asset when assets change
  useEffect(() => {
    if (assets.length > 0 && !selectedAsset) {
      setSelectedAsset(assets[0].symbol);
    }
  }, [assets]);
  
  // Reset form
  const resetForm = () => {
    setSelectedAsset(assets.length > 0 ? assets[0].symbol : '');
    setRecipientAddress('');
    setAmount('');
    setAddressError('');
    setAmountError('');
    setActiveStep(0);
    setIsProcessing(false);
    setTransactionHash('');
    setTransactionError('');
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    // Validate address
    if (!recipientAddress) {
      setAddressError('Recipient address is required');
      isValid = false;
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      setAddressError('Invalid Ethereum address format');
      isValid = false;
    } else {
      setAddressError('');
    }
    
    // Validate amount
    if (!amount) {
      setAmountError('Amount is required');
      isValid = false;
    } else {
      const numAmount = parseFloat(amount);
      const asset = getSelectedAssetDetails();
      
      if (isNaN(numAmount) || numAmount <= 0) {
        setAmountError('Amount must be greater than 0');
        isValid = false;
      } else if (asset && numAmount > parseFloat(asset.balance)) {
        setAmountError('Insufficient balance');
        isValid = false;
      } else {
        setAmountError('');
      }
    }
    
    return isValid;
  };
  
  // Handle asset change
  const handleAssetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedAsset(event.target.value as string);
  };
  
  // Handle address change
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(event.target.value);
    if (addressError) validateForm();
  };
  
  // Handle amount change
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
    if (amountError) validateForm();
  };
  
  // Handle max amount
  const handleMaxAmount = () => {
    const asset = getSelectedAssetDetails();
    if (asset) {
      setAmount(asset.balance);
    }
  };
  
  // Handle review
  const handleReview = () => {
    if (validateForm()) {
      setActiveStep(1);
    }
  };
  
  // Handle send
  const handleSend = async () => {
    setIsProcessing(true);
    setTransactionError('');
    
    try {
      const txHash = await sendTransaction(recipientAddress, amount, network);
      setTransactionHash(txHash);
      setActiveStep(2);
      onSendComplete(txHash);
    } catch (error) {
      setTransactionError(error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  // Handle close
  const handleClose = () => {
    if (!isProcessing) {
      resetForm();
      onClose();
    }
  };
  
  // Get transaction explorer URL
  const getTransactionExplorerUrl = () => {
    const baseUrl = network === 'mainnet' 
      ? 'https://etherscan.io/tx/' 
      : 'https://sepolia.etherscan.io/tx/';
    return `${baseUrl}${transactionHash}`;
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
        <Typography variant="h6" sx={{ color: 'white' }}>
          {activeStep === 0 && 'Send Tokens'}
          {activeStep === 1 && 'Review Transaction'}
          {activeStep === 2 && 'Transaction Complete'}
        </Typography>
        <IconButton onClick={handleClose} disabled={isProcessing} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
            <StepLabel>Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Review</StepLabel>
          </Step>
          <Step>
            <StepLabel>Complete</StepLabel>
          </Step>
        </Stepper>
        
        {activeStep === 0 && (
          <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="asset-select-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Asset</InputLabel>
              <Select
                labelId="asset-select-label"
                value={selectedAsset}
                onChange={handleAssetChange}
                label="Asset"
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 240, 255, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 240, 255, 0.5)',
                  },
                  '.MuiSvgIcon-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  }
                }}
              >
                {assets.map((asset) => (
                  <MenuItem key={asset.symbol} value={asset.symbol}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{asset.symbol}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        (Balance: {asset.balance})
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Recipient Address"
              value={recipientAddress}
              onChange={handleAddressChange}
              error={!!addressError}
              helperText={addressError}
              sx={{
                mb: 3,
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
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
                '& .MuiFormHelperText-root': {
                  color: '#FF5252',
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Amount"
              value={amount}
              onChange={handleAmountChange}
              error={!!amountError}
              helperText={amountError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={handleMaxAmount}
                      sx={{
                        color: 'rgba(0, 240, 255, 0.7)',
                        '&:hover': {
                          background: 'rgba(0, 240, 255, 0.1)',
                        }
                      }}
                    >
                      MAX
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
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
                '& .MuiFormHelperText-root': {
                  color: '#FF5252',
                }
              }}
            />
            
            <Alert severity="info" sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(0, 240, 255, 0.1)', 
              color: 'white',
              border: '1px solid rgba(0, 240, 255, 0.3)'
            }}>
              Transaction fees will be calculated based on current network conditions.
            </Alert>
          </Box>
        )}
        
        {activeStep === 1 && (
          <Box>
            <Box sx={{ 
              p: 3, 
              borderRadius: '8px', 
              bgcolor: 'rgba(0, 240, 255, 0.1)', 
              border: '1px solid rgba(0, 240, 255, 0.2)',
              mb: 3
            }}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                From
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', mb: 2, wordBreak: 'break-all' }}>
                {walletAddress}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
                <ArrowForward sx={{ color: 'rgba(0, 240, 255, 0.7)' }} />
              </Box>
              
              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                To
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', mb: 2, wordBreak: 'break-all' }}>
                {recipientAddress}
              </Typography>
              
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Asset
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {selectedAsset}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Amount
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {amount} {selectedAsset}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Network
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {network === 'mainnet' ? 'Ethereum Mainnet' : 'Sepolia Testnet'}
                </Typography>
              </Box>
            </Box>
            
            <Alert severity="warning" sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(255, 165, 0, 0.1)', 
              color: 'white',
              border: '1px solid rgba(255, 165, 0, 0.3)'
            }}>
              Please verify all details carefully. Transactions cannot be reversed once confirmed.
            </Alert>
            
            {transactionError && (
              <Alert severity="error" sx={{ 
                mb: 3, 
                backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                color: 'white',
                border: '1px solid rgba(255, 0, 0, 0.3)'
              }}>
                {transactionError}
              </Alert>
            )}
          </Box>
        )}
        
        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: 'rgba(0, 255, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <CheckCircle sx={{ color: '#4CAF50', fontSize: 40 }} />
            </Box>
            
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Transaction Submitted
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              Your transaction has been submitted to the network and is waiting for confirmation.
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: '8px', 
              bgcolor: 'rgba(0, 240, 255, 0.1)', 
              border: '1px solid rgba(0, 240, 255, 0.2)',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="body2" sx={{ color: 'white', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {transactionHash.slice(0, 20)}...{transactionHash.slice(-4)}
              </Typography>
              <Box>
                <IconButton 
                  size="small" 
                  onClick={() => copyToClipboard(transactionHash)}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => window.open(getTransactionExplorerUrl(), '_blank')}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <ArrowForward fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            
            <Alert severity="info" sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(0, 240, 255, 0.1)', 
              color: 'white',
              border: '1px solid rgba(0, 240, 255, 0.3)'
            }}>
              It may take a few minutes for the transaction to be confirmed on the blockchain.
            </Alert>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {activeStep === 0 && (
          <>
            <Button 
              onClick={handleClose}
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
            <GradientButton onClick={handleReview}>
              Review
            </GradientButton>
          </>
        )}
        
        {activeStep === 1 && (
          <>
            <Button 
              onClick={() => setActiveStep(0)}
              disabled={isProcessing}
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
            <GradientButton 
              onClick={handleSend}
              disabled={isProcessing}
              startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isProcessing ? 'Processing...' : 'Confirm & Send'}
            </GradientButton>
          </>
        )}
        
        {activeStep === 2 && (
          <GradientButton onClick={handleClose} fullWidth>
            Close
          </GradientButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SendTokenModal;
