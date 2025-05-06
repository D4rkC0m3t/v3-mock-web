import React from 'react';
import { Box, Typography, Paper, Grid, styled, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import CurrencyIcon from './CurrencyIcon';

// Styled components
const BalanceCard = styled(Paper)(({ theme }) => ({
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

const TotalValueText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.75rem',
  background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const CurrencyAmount = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.25rem',
}));

const CurrencyValue = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '0.875rem',
}));

const DistributionBar = styled(LinearProgress)(({ color }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: color,
  }
}));

/**
 * WalletBalance Component
 * Displays user's wallet balances and portfolio distribution
 */
const WalletBalance = ({ balances, totalValueUsd }) => {
  // Color map for different cryptocurrencies
  const colorMap = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    USDT: '#26A17B',
    SOL: '#14F195',
    ADA: '#0033AD',
    DOT: '#E6007A',
    // Add more as needed
  };
  
  // Calculate percentage for each currency
  const balancesWithPercentage = balances.map(balance => ({
    ...balance,
    percentage: (balance.value_usd / totalValueUsd) * 100,
    color: colorMap[balance.currency] || '#00F0FF'
  }));
  
  return (
    <Box sx={{ mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <BalanceCard elevation={0}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
              Total Balance
            </Typography>
            <TotalValueText>
              ${totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </TotalValueText>
          </Box>
          
          <Typography variant="h6" sx={{ mb: 2 }}>
            Portfolio Distribution
          </Typography>
          
          <Grid container spacing={2}>
            {balancesWithPercentage.map((balance, index) => (
              <Grid item xs={12} key={balance.currency}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CurrencyIcon currency={balance.currency} size={24} sx={{ mr: 1 }} />
                        <CurrencyAmount>
                          {balance.amount.toLocaleString(undefined, { 
                            minimumFractionDigits: balance.amount < 0.01 ? 6 : 2, 
                            maximumFractionDigits: balance.amount < 0.01 ? 6 : 2 
                          })} {balance.currency}
                        </CurrencyAmount>
                      </Box>
                      <CurrencyValue>
                        ${balance.value_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </CurrencyValue>
                    </Box>
                    <DistributionBar 
                      variant="determinate" 
                      value={balance.percentage} 
                      color={balance.color}
                    />
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </BalanceCard>
      </motion.div>
    </Box>
  );
};

export default WalletBalance;
