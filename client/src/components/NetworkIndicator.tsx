import React from 'react';
import { Box, Typography, Chip, Tooltip, styled } from '@mui/material';
import { NetworkType } from '../utils/walletConnector';

const NetworkChip = styled(Chip)(({ theme }) => ({
  borderRadius: '16px',
  height: '24px',
  '& .MuiChip-label': {
    paddingLeft: '8px',
    paddingRight: '8px',
  }
}));

interface NetworkIndicatorProps {
  network: NetworkType;
  showLabel?: boolean;
  size?: 'small' | 'medium';
}

const NetworkIndicator: React.FC<NetworkIndicatorProps> = ({ 
  network, 
  showLabel = true,
  size = 'medium'
}) => {
  const isTestnet = network === 'testnet';
  
  const getNetworkColor = () => {
    return isTestnet ? '#FFA500' : '#4CAF50';
  };
  
  const getNetworkName = () => {
    return isTestnet ? 'Sepolia Testnet' : 'Ethereum Mainnet';
  };
  
  const getNetworkDescription = () => {
    return isTestnet 
      ? 'Test network for Ethereum. Tokens have no real value.'
      : 'Main Ethereum network. Real assets and transactions.';
  };
  
  if (showLabel) {
    return (
      <Tooltip title={getNetworkDescription()}>
        <NetworkChip
          label={getNetworkName()}
          size={size}
          sx={{
            bgcolor: isTestnet ? 'rgba(255, 165, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
            color: getNetworkColor(),
            border: `1px solid ${isTestnet ? 'rgba(255, 165, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)'}`,
          }}
          icon={
            <Box
              sx={{
                width: size === 'small' ? 6 : 8,
                height: size === 'small' ? 6 : 8,
                borderRadius: '50%',
                bgcolor: getNetworkColor(),
                ml: 1
              }}
            />
          }
        />
      </Tooltip>
    );
  }
  
  return (
    <Tooltip title={getNetworkName()}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Box
          sx={{
            width: size === 'small' ? 6 : 8,
            height: size === 'small' ? 6 : 8,
            borderRadius: '50%',
            bgcolor: getNetworkColor(),
          }}
        />
        <Typography 
          variant={size === 'small' ? 'caption' : 'body2'} 
          sx={{ color: getNetworkColor() }}
        >
          {isTestnet ? 'Testnet' : 'Mainnet'}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default NetworkIndicator;
