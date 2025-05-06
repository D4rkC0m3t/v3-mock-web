import React from 'react';
import { Box, Typography, Chip, styled } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Styled components
const CardContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(0, 240, 255, 0.3)',
  }
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const ChangeChip = styled(Chip)(({ isPositive }) => ({
  background: isPositive ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
  color: isPositive ? '#00ff00' : '#ff5555',
  fontWeight: 600,
  border: `1px solid ${isPositive ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`,
}));

/**
 * MarketCard Component
 * Displays market information for a cryptocurrency pair
 */
const MarketCard = ({ symbol, price, change, onClick }) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CardContainer onClick={onClick}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {symbol}
          </Typography>
          <ChangeChip 
            isPositive={isPositive}
            icon={isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
            label={`${isPositive ? '+' : ''}${change}%`}
            size="small"
          />
        </Box>
        
        <PriceText>
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </PriceText>
      </CardContainer>
    </motion.div>
  );
};

export default MarketCard;
