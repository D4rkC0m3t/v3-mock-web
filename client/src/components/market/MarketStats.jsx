import React from 'react';
import { Box, Typography, Grid, Paper, styled } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

// Styled components
const StatsCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  height: '100%',
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px',
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '0.875rem',
  marginBottom: '4px',
}));

const StatValue = styled(Typography)(({ theme, color }) => ({
  fontWeight: 600,
  fontSize: '1.25rem',
  color: color || 'white',
}));

const ChangeIndicator = styled(Box)(({ theme, isPositive }) => ({
  display: 'flex',
  alignItems: 'center',
  color: isPositive ? '#00c853' : '#ff5252',
  fontSize: '0.875rem',
  fontWeight: 500,
}));

/**
 * MarketStats Component
 * Displays market statistics for a cryptocurrency pair
 */
const MarketStats = ({ 
  symbol = 'BTC/USDT',
  price = 65432.10,
  change24h = 2.5,
  high24h = 66789.50,
  low24h = 64123.75,
  volume24h = 1234567890,
  marketCap = 1234567890123,
}) => {
  const isPositive = change24h >= 0;
  
  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StatsCard elevation={0}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {symbol} Market Stats
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StatValue color="#00F0FF">
              ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </StatValue>
            <ChangeIndicator isPositive={isPositive} sx={{ ml: 2 }}>
              {isPositive ? <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />}
              {isPositive ? '+' : ''}{change24h}%
            </ChangeIndicator>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <StatItem>
              <StatLabel>24h High</StatLabel>
              <StatValue>
                ${high24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </StatValue>
            </StatItem>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <StatItem>
              <StatLabel>24h Low</StatLabel>
              <StatValue>
                ${low24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </StatValue>
            </StatItem>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <StatItem>
              <StatLabel>24h Volume</StatLabel>
              <StatValue>
                {formatNumber(volume24h)}
              </StatValue>
            </StatItem>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <StatItem>
              <StatLabel>Market Cap</StatLabel>
              <StatValue>
                {formatNumber(marketCap)}
              </StatValue>
            </StatItem>
          </Grid>
        </Grid>
      </StatsCard>
    </motion.div>
  );
};

export default MarketStats;
