import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Chip, 
  Tooltip, 
  IconButton,
  Link
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  SwapHoriz,
  Bolt,
  Star,
  OpenInNew,
  ContentCopy
} from '@mui/icons-material';
import { NetworkType } from '../utils/walletConnector';

export type TransactionType = 'deposit' | 'withdraw' | 'swap' | 'stake' | 'unstake' | 'reward';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface TransactionProps {
  type: TransactionType;
  asset: string;
  amount: string;
  value: string;
  date: string;
  status: TransactionStatus;
  txHash: string;
  network: NetworkType;
}

const WalletTransaction: React.FC<TransactionProps> = ({
  type,
  asset,
  amount,
  value,
  date,
  status,
  txHash,
  network
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FFA500';
      case 'failed': return '#FF5252';
      default: return '#FFFFFF';
    }
  };
  
  const getTypeIcon = () => {
    switch (type) {
      case 'deposit': return <ArrowDownward />;
      case 'withdraw': return <ArrowUpward />;
      case 'swap': return <SwapHoriz />;
      case 'stake': return <Bolt />;
      case 'unstake': return <Bolt />;
      default: return <Star />;
    }
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'deposit': return 'rgba(0, 255, 0, 0.2)';
      case 'withdraw': return 'rgba(255, 0, 0, 0.2)';
      case 'swap': return 'rgba(0, 240, 255, 0.2)';
      case 'stake': return 'rgba(255, 165, 0, 0.2)';
      case 'unstake': return 'rgba(255, 165, 0, 0.2)';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  };
  
  const getExplorerUrl = () => {
    const baseUrl = network === 'mainnet' 
      ? 'https://etherscan.io/tx/' 
      : 'https://sepolia.etherscan.io/tx/';
    return `${baseUrl}${txHash}`;
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: getTypeColor(),
            width: 40,
            height: 40
          }}
        >
          {getTypeIcon()}
        </Avatar>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', textTransform: 'capitalize' }}>
              {type}
            </Typography>
            <Chip
              label={status}
              size="small"
              sx={{
                bgcolor: `${getStatusColor()}20`,
                color: getStatusColor(),
                border: `1px solid ${getStatusColor()}40`,
                height: '20px',
                '& .MuiChip-label': { px: 1 }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {formatDate(date)}
            </Typography>
            <Tooltip title="View on Explorer">
              <IconButton 
                size="small" 
                onClick={() => window.open(getExplorerUrl(), '_blank')}
                sx={{ color: 'rgba(255, 255, 255, 0.5)', p: 0 }}
              >
                <OpenInNew sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy Transaction Hash">
              <IconButton 
                size="small" 
                onClick={() => copyToClipboard(txHash)}
                sx={{ color: 'rgba(255, 255, 255, 0.5)', p: 0 }}
              >
                <ContentCopy sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="subtitle1" sx={{ color: 'white' }}>
          {amount} {asset}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default WalletTransaction;
