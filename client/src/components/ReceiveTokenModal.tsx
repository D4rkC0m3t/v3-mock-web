import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Close,
  ContentCopy,
  QrCode
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { NetworkType } from '../utils/walletConnector';
import { WalletAsset } from '../types/wallet';
import QRCode from 'qrcode.react';

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

interface ReceiveTokenModalProps {
  open: boolean;
  onClose: () => void;
  assets: WalletAsset[];
  network: NetworkType;
  walletAddress: string;
}

const ReceiveTokenModal: React.FC<ReceiveTokenModalProps> = ({
  open,
  onClose,
  assets,
  network,
  walletAddress
}) => {
  // State for selected asset
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  
  // State for copy notification
  const [copied, setCopied] = useState(false);
  
  // Handle asset change
  const handleAssetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedAsset(event.target.value as string);
  };
  
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
  
  // Get QR code value
  const getQRCodeValue = () => {
    return `ethereum:${walletAddress}${selectedAsset ? `?asset=${selectedAsset}` : ''}`;
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
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box sx={{ 
              p: 3, 
              bgcolor: 'white', 
              borderRadius: '8px',
              mb: 3
            }}>
              <QRCode 
                value={getQRCodeValue()} 
                size={200}
                level="H"
                includeMargin={true}
                renderAs="svg"
              />
            </Box>
            
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
              <Typography variant="caption" sx={{ color: '#4CAF50', mt: 1 }}>
                Address copied to clipboard!
              </Typography>
            )}
          </Box>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="asset-select-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Select Asset (Optional)
            </InputLabel>
            <Select
              labelId="asset-select-label"
              value={selectedAsset}
              onChange={handleAssetChange}
              label="Select Asset (Optional)"
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
              <MenuItem value="">
                <em>Any Asset</em>
              </MenuItem>
              {assets.map((asset) => (
                <MenuItem key={asset.symbol} value={asset.symbol}>
                  {asset.name} ({asset.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Alert severity="info" sx={{ 
            mb: 3, 
            backgroundColor: 'rgba(0, 240, 255, 0.1)', 
            color: 'white',
            border: '1px solid rgba(0, 240, 255, 0.3)'
          }}>
            Make sure to only receive tokens on the {getNetworkName()} network. Tokens sent from other networks may be lost.
          </Alert>
          
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
          
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            Network
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            {getNetworkName()}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <GradientButton onClick={onClose} fullWidth>
          Close
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiveTokenModal;
