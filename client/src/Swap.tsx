import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { SwapHoriz, Info, ArrowDownward } from '@mui/icons-material';
import { GlassCard } from './components';
import SwapForm from './components/swap/SwapForm';
import { NetworkType } from './utils/walletConnector';
import { WalletAsset } from './types/wallet';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(3),
  background: '#0A0E17',
  backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.1) 0%, transparent 50%)',
}));

const SwapCard = styled(GlassCard)(({ theme }) => ({
  maxWidth: 480,
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const InfoCard = styled(GlassCard)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
}));

// Mock data for wallet assets
const mockAssets: WalletAsset[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: '1.5', value: '$3,000.00', icon: '🔷' },
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.05', value: '$2,500.00', icon: '₿' },
  { symbol: 'USDT', name: 'Tether', balance: '5000', value: '$5,000.00', icon: '💵' },
  { symbol: 'USDC', name: 'USD Coin', balance: '2500', value: '$2,500.00', icon: '💲' },
  { symbol: 'SOL', name: 'Solana', balance: '25', value: '$1,250.00', icon: '◎' },
];

const Swap: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for swap form
  const [fromToken, setFromToken] = useState<string>('ETH');
  const [toToken, setToToken] = useState<string>('USDT');
  const [amount, setAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  
  // Network state (mainnet or testnet)
  const [network, setNetwork] = useState<NetworkType>('testnet');
  
  // Handle swap tokens
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };
  
  // Handle form submission
  const handleFormSubmit = async () => {
    if (!fromToken || !toToken || !amount) return;
    
    setIsLoadingQuote(true);
    setQuoteError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Failed to get swap quote. Please try again.');
      }
      
      // Success - would navigate to review step in a real implementation
      console.log('Swap quote fetched successfully');
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : 'Failed to get swap quote');
    } finally {
      setIsLoadingQuote(false);
    }
  };
  
  return (
    <PageContainer>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Swap Tokens
          </Typography>
        </motion.div>
        
        <Grid container spacing={4}>
          {/* Swap Form */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SwapCard>
                <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
                  Swap
                </Typography>
                
                <SwapForm
                  assets={mockAssets}
                  network={network}
                  fromToken={fromToken}
                  toToken={toToken}
                  amount={amount}
                  slippage={slippage}
                  isLoadingQuote={isLoadingQuote}
                  quoteError={quoteError}
                  onFromTokenChange={setFromToken}
                  onToTokenChange={setToToken}
                  onAmountChange={setAmount}
                  onSlippageChange={setSlippage}
                  onSwapTokens={handleSwapTokens}
                />
                
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!fromToken || !toToken || !amount || isLoadingQuote}
                  onClick={handleFormSubmit}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
                    borderRadius: '12px',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00E0F0, #0090E0)',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(0, 240, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }
                  }}
                >
                  {isLoadingQuote ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Swap Tokens'
                  )}
                </Button>
                
                {quoteError && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 0, 0, 0.3)'
                    }}
                  >
                    {quoteError}
                  </Alert>
                )}
              </SwapCard>
            </motion.div>
          </Grid>
          
          {/* Info Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <InfoCard>
                <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
                  About Swapping
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Info sx={{ color: '#00F0FF', mr: 1, mt: 0.5 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Swap tokens at competitive rates with minimal slippage. Our smart routing system finds the best prices across multiple liquidity sources.
                  </Typography>
                </Box>
                
                <Alert
                  severity="info"
                  sx={{
                    mb: 3,
                    backgroundColor: 'rgba(0, 240, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(0, 240, 255, 0.3)'
                  }}
                >
                  Currently connected to {network === 'mainnet' ? 'Ethereum Mainnet' : 'Sepolia Testnet'}
                </Alert>
                
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'white' }}>
                  How it works:
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { step: 1, text: 'Select the tokens you want to swap' },
                    { step: 2, text: 'Enter the amount you want to exchange' },
                    { step: 3, text: 'Review the quote and confirm the transaction' },
                    { step: 4, text: 'Wait for the transaction to be confirmed on the blockchain' }
                  ].map((item) => (
                    <Box
                      key={item.step}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: '8px',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          bgcolor: 'rgba(0, 240, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#00F0FF', fontWeight: 'bold' }}>
                          {item.step}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </InfoCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default Swap;
