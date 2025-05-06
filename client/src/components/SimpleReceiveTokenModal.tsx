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
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { Close, ContentCopy } from '@mui/icons-material';
import { NetworkType } from '../utils/walletConnector';

interface SimpleReceiveTokenModalProps {
  open: boolean;
  onClose: () => void;
  network: NetworkType;
  walletAddress: string;
}

const SimpleReceiveTokenModal: React.FC<SimpleReceiveTokenModalProps> = ({
  open,
  onClose,
  network,
  walletAddress
}) => {
  // State for copy notification
  const [copied, setCopied] = useState(false);
  
  // Handle copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  
  // Get network name
  const getNetworkName = () => {
    return network === 'mainnet' ? 'Ethereum Mainnet' : 'Sepolia Testnet';
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          Receive Tokens
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            Share your address to receive tokens on {getNetworkName()}
          </Typography>
          
          <Box sx={{ 
            p: 3, 
            borderRadius: '8px', 
            bgcolor: 'rgba(0, 240, 255, 0.1)', 
            border: '1px solid rgba(0, 240, 255, 0.2)',
            mb: 3
          }}>
            <TextField
              fullWidth
              variant="outlined"
              value={walletAddress}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => copyToClipboard(walletAddress)}
                      sx={{ color: copied ? '#4CAF50' : 'rgba(255, 255, 255, 0.7)' }}
                    >
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
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
              }}
            />
            
            {copied && (
              <Typography variant="caption" sx={{ color: '#4CAF50', mt: 1, display: 'block' }}>
                Address copied to clipboard!
              </Typography>
            )}
          </Box>
          
          <Alert severity="info" sx={{ 
            mb: 3, 
            backgroundColor: 'rgba(0, 240, 255, 0.1)', 
            color: 'white',
            border: '1px solid rgba(0, 240, 255, 0.3)'
          }}>
            Make sure to only receive tokens on the {getNetworkName()} network. Tokens sent from other networks may be lost.
          </Alert>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button 
          variant="contained"
          onClick={onClose}
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
      </DialogActions>
    </Dialog>
  );
};

export default SimpleReceiveTokenModal;
