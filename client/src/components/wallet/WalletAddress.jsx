import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, IconButton, Tooltip, styled } from '@mui/material';
import { ContentCopy, QrCode2, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

// Styled components
const AddressCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(0, 240, 255, 0.3)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00F0FF',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#00F0FF',
    },
  },
}));

const QRCodeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  background: 'white',
  borderRadius: '12px',
  width: 'fit-content',
  margin: '0 auto 20px auto',
}));

const CopyButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
  color: 'white',
  fontWeight: 600,
  padding: '10px 20px',
  borderRadius: '8px',
  '&:hover': {
    background: 'linear-gradient(135deg, #00e0f0, #0090e0)',
  },
}));

/**
 * WalletAddress Component
 * Displays a cryptocurrency wallet address with QR code and copy functionality
 */
const WalletAddress = ({ 
  currency = 'BTC',
  address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  label = 'Bitcoin Deposit Address',
  network = 'Bitcoin Mainnet',
}) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    
    // Reset copied state after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  // Toggle QR code display
  const toggleQR = () => {
    setShowQR(!showQR);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AddressCard elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            {label}
          </Typography>
          <Tooltip title={showQR ? "Hide QR Code" : "Show QR Code"}>
            <IconButton onClick={toggleQR} sx={{ color: '#00F0FF' }}>
              <QrCode2 />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
          Network: {network}
        </Typography>
        
        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <QRCodeContainer>
              <QRCodeSVG 
                value={address}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={false}
              />
            </QRCodeContainer>
          </motion.div>
        )}
        
        <StyledTextField
          label="Wallet Address"
          variant="outlined"
          fullWidth
          value={address}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <Tooltip title="Copy Address">
                <IconButton edge="end" onClick={handleCopy}>
                  {copied ? <CheckCircle sx={{ color: '#00c853' }} /> : <ContentCopy />}
                </IconButton>
              </Tooltip>
            ),
          }}
        />
        
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
          Only send {currency} to this address. Sending any other cryptocurrency may result in permanent loss.
        </Typography>
        
        <CopyButton
          fullWidth
          startIcon={copied ? <CheckCircle /> : <ContentCopy />}
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy Address'}
        </CopyButton>
      </AddressCard>
    </motion.div>
  );
};

export default WalletAddress;
