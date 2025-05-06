import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { SwapQuote } from '../../types/wallet';
import { NetworkType } from '../../utils/walletConnector';

interface SwapReviewProps {
  quote: SwapQuote;
  slippage: number;
  network: NetworkType;
  isExecutingSwap: boolean;
  swapError: string | null;
}

const SwapReview: React.FC<SwapReviewProps> = ({
  quote,
  slippage,
  network,
  isExecutingSwap,
  swapError
}) => {
  return (
    <Box>
      {/* Swap Summary */}
      <Box sx={{ 
        p: 3, 
        borderRadius: '8px', 
        bgcolor: 'rgba(0, 240, 255, 0.1)', 
        border: '1px solid rgba(0, 240, 255, 0.2)',
        mb: 3
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            You Pay
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
            {quote.fromAmount} {quote.fromToken}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            You Receive
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
            {quote.toAmount} {quote.toToken}
          </Typography>
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Exchange Rate
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            1 {quote.fromToken} = {parseFloat(quote.exchangeRate).toFixed(6)} {quote.toToken}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Minimum Received
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            {quote.minReceived} {quote.toToken}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Slippage Tolerance
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            {slippage}%
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Price Impact
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            {quote.priceImpact}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Liquidity Provider Fee
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            {quote.fee} {quote.fromToken}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Estimated Gas Fee
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            {quote.estimatedGas}
          </Typography>
        </Box>
      </Box>
      
      {/* Network Info */}
      <Alert severity="info" sx={{ 
        mb: 3, 
        backgroundColor: 'rgba(0, 240, 255, 0.1)', 
        color: 'white',
        border: '1px solid rgba(0, 240, 255, 0.3)'
      }}>
        Swapping on {network === 'mainnet' ? 'Ethereum Mainnet' : 'Sepolia Testnet'}
      </Alert>
      
      {/* Warning */}
      <Alert severity="warning" sx={{ 
        mb: 3, 
        backgroundColor: 'rgba(255, 165, 0, 0.1)', 
        color: 'white',
        border: '1px solid rgba(255, 165, 0, 0.3)'
      }}>
        Please verify all details carefully. Swaps cannot be reversed once confirmed.
      </Alert>
      
      {/* Error Message */}
      {swapError && (
        <Alert severity="error" sx={{ 
          mb: 3, 
          backgroundColor: 'rgba(255, 0, 0, 0.1)', 
          color: 'white',
          border: '1px solid rgba(255, 0, 0, 0.3)'
        }}>
          {swapError}
        </Alert>
      )}
      
      {/* Loading State */}
      {isExecutingSwap && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} sx={{ color: '#00F0FF', mr: 2 }} />
          <Typography variant="body1" sx={{ color: 'white' }}>
            Processing swap...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SwapReview;
