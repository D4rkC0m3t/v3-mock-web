import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  ContentCopy,
  ArrowForward
} from '@mui/icons-material';
import { NetworkType } from '../../utils/walletConnector';

interface SwapCompleteProps {
  transactionHash: string;
  network: NetworkType;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
}

const SwapComplete: React.FC<SwapCompleteProps> = ({
  transactionHash,
  network,
  fromToken,
  toToken,
  fromAmount,
  toAmount
}) => {
  // Handle copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  // Get transaction explorer URL
  const getTransactionExplorerUrl = () => {
    const baseUrl = network === 'mainnet' 
      ? 'https://etherscan.io/tx/' 
      : 'https://sepolia.etherscan.io/tx/';
    return `${baseUrl}${transactionHash}`;
  };
  
  return (
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
        Swap Submitted
      </Typography>
      
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
        Your swap from {fromAmount} {fromToken} to approximately {toAmount} {toToken} has been submitted to the network and is waiting for confirmation.
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
        It may take a few minutes for the transaction to be confirmed on the blockchain. You can check the status by clicking the link above.
      </Alert>
    </Box>
  );
};

export default SwapComplete;
