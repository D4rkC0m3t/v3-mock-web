import React, { useState } from 'react';
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
  CircularProgress,
  IconButton,
  Alert
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { NetworkType, sendTransaction } from '../utils/walletConnector';
import { WalletAsset } from '../types/wallet';

interface SimpleSendTokenModalProps {
  open: boolean;
  onClose: () => void;
  assets: WalletAsset[];
  network: NetworkType;
  walletAddress: string;
  onSendComplete: (txHash: string) => void;
}

const SimpleSendTokenModal: React.FC<SimpleSendTokenModalProps> = ({
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  // Reset form
  const resetForm = () => {
    setSelectedAsset(assets.length > 0 ? assets[0].symbol : '');
    setRecipientAddress('');
    setAmount('');
    setAddressError('');
    setAmountError('');
    setIsProcessing(false);
    setTransactionHash('');
    setTransactionError('');
    setIsComplete(false);
  };
  
  // Handle close
  const handleClose = () => {
    if (!isProcessing) {
      resetForm();
      onClose();
    }
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
      const asset = assets.find(a => a.symbol === selectedAsset);
      
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
  
  // Handle send
  const handleSend = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    setTransactionError('');
    
    try {
      const txHash = await sendTransaction(recipientAddress, amount, network);
      setTransactionHash(txHash);
      setIsComplete(true);
      onSendComplete(txHash);
    } catch (error) {
      setTransactionError(error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle max amount
  const handleMaxAmount = () => {
    const asset = assets.find(a => a.symbol === selectedAsset);
    if (asset) {
      setAmount(asset.balance);
    }
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
          {isComplete ? 'Transaction Complete' : 'Send Tokens'}
        </Typography>
        <IconButton onClick={handleClose} disabled={isProcessing} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {!isComplete ? (
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
              onChange={(e) => setRecipientAddress(e.target.value)}
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
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={!!amountError}
                helperText={amountError}
                sx={{
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
              
              <Button
                variant="outlined"
                onClick={handleMaxAmount}
                sx={{
                  height: '56px',
                  borderColor: 'rgba(0, 240, 255, 0.3)',
                  color: 'rgba(0, 240, 255, 0.7)',
                  '&:hover': {
                    borderColor: 'rgba(0, 240, 255, 0.5)',
                    background: 'rgba(0, 240, 255, 0.1)',
                  }
                }}
              >
                MAX
              </Button>
            </Box>
            
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
            
            <Alert severity="info" sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(0, 240, 255, 0.1)', 
              color: 'white',
              border: '1px solid rgba(0, 240, 255, 0.3)'
            }}>
              Transaction fees will be calculated based on current network conditions.
            </Alert>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
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
              mb: 3
            }}>
              <Typography variant="body2" sx={{ color: 'white', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {transactionHash}
              </Typography>
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
        {!isComplete ? (
          <>
            <Button 
              onClick={handleClose}
              disabled={isProcessing}
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
            <Button 
              variant="contained"
              onClick={handleSend}
              disabled={isProcessing}
              startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2CF6FF, #0080FF)',
                }
              }}
            >
              {isProcessing ? 'Processing...' : 'Send'}
            </Button>
          </>
        ) : (
          <Button 
            variant="contained"
            onClick={handleClose}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #2CF6FF, #0080FF)',
              }
            }}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SimpleSendTokenModal;
