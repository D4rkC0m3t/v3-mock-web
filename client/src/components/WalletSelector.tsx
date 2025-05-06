import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  styled,
  Avatar,
  Button
} from '@mui/material';
import {
  AccountBalanceWallet,
  Storage
} from '@mui/icons-material';
import { motion } from 'framer-motion';

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

interface WalletSelectorProps {
  onSelectWallet: (type: 'hot' | 'cold', network: 'mainnet' | 'testnet') => void;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ onSelectWallet }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
  const [selectedWalletType, setSelectedWalletType] = useState<'hot' | 'cold' | null>(null);

  const handleNetworkChange = (network: 'mainnet' | 'testnet') => {
    setSelectedNetwork(network);
  };

  const handleWalletSelect = (type: 'hot' | 'cold') => {
    setSelectedWalletType(type);
  };

  const handleContinue = () => {
    if (selectedWalletType) {
      onSelectWallet(selectedWalletType, selectedNetwork);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'white', textAlign: 'center' }}>
        Select Wallet Type and Network
      </Typography>

      {/* Network Selection */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{
          display: 'flex',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 240, 255, 0.3)',
        }}>
          <Button
            onClick={() => handleNetworkChange('mainnet')}
            sx={{
              px: 3,
              py: 1,
              color: 'white',
              backgroundColor: selectedNetwork === 'mainnet' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: selectedNetwork === 'mainnet' ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Mainnet
          </Button>
          <Button
            onClick={() => handleNetworkChange('testnet')}
            sx={{
              px: 3,
              py: 1,
              color: 'white',
              backgroundColor: selectedNetwork === 'testnet' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: selectedNetwork === 'testnet' ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Testnet
          </Button>
        </Box>
      </Box>

      {/* Network Info */}
      <Box sx={{
        mb: 4,
        p: 2,
        borderRadius: '8px',
        bgcolor: selectedNetwork === 'testnet' ? 'rgba(255, 165, 0, 0.1)' : 'rgba(0, 240, 255, 0.1)',
        border: `1px solid ${selectedNetwork === 'testnet' ? 'rgba(255, 165, 0, 0.3)' : 'rgba(0, 240, 255, 0.3)'}`,
        textAlign: 'center'
      }}>
        {selectedNetwork === 'mainnet' ? (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Mainnet is the primary network where actual transactions occur with real assets.
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Testnet is for development and testing. Transactions use test tokens with no real value.
          </Typography>
        )}
      </Box>

      {/* Wallet Type Selection */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <WalletOption
              onClick={() => handleWalletSelect('hot')}
              sx={{
                border: selectedWalletType === 'hot' ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: selectedWalletType === 'hot' ? '0 0 20px rgba(0, 240, 255, 0.3)' : 'none'
              }}
            >
              <Avatar sx={{ bgcolor: 'rgba(0, 240, 255, 0.2)', width: 64, height: 64, mb: 2 }}>
                <AccountBalanceWallet sx={{ color: '#00F0FF', fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Hot Wallet
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Connect to a browser-based wallet for everyday transactions.
                Suitable for frequent trading and smaller amounts.
              </Typography>
              <Box sx={{
                mt: 2,
                p: 1,
                borderRadius: '8px',
                bgcolor: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.2)'
              }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Supports MetaMask, Coinbase Wallet, WalletConnect
                </Typography>
              </Box>
            </WalletOption>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <WalletOption
              onClick={() => handleWalletSelect('cold')}
              sx={{
                border: selectedWalletType === 'cold' ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: selectedWalletType === 'cold' ? '0 0 20px rgba(0, 240, 255, 0.3)' : 'none'
              }}
            >
              <Avatar sx={{ bgcolor: 'rgba(0, 240, 255, 0.2)', width: 64, height: 64, mb: 2 }}>
                <Storage sx={{ color: '#00F0FF', fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Cold Wallet
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Connect to a hardware wallet for enhanced security.
                Recommended for long-term storage and larger amounts.
              </Typography>
              <Box sx={{
                mt: 2,
                p: 1,
                borderRadius: '8px',
                bgcolor: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.2)'
              }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Supports Ledger, Trezor, KeepKey
                </Typography>
              </Box>
            </WalletOption>
          </motion.div>
        </Grid>
      </Grid>

      {/* Continue Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          disabled={!selectedWalletType}
          onClick={handleContinue}
          sx={{
            background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
            color: 'white',
            borderRadius: '12px',
            padding: '12px 24px',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #2CF6FF, #0080FF)',
            },
            '&.Mui-disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default WalletSelector;
