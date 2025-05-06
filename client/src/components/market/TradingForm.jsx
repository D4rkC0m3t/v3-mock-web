import React, { useState } from 'react';
import { Box, Typography, TextField, Button, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';
import { GlassCard } from '../ui/GlassCard';

// Styled components
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0,240,255,0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00f0ff',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#888',
  },
}));

const ActionButton = styled(Button)(({ orderType }) => ({
  width: '100%',
  padding: '12px',
  background: orderType === 'buy' 
    ? 'linear-gradient(135deg, #00ff00, #00cc00)'
    : 'linear-gradient(135deg, #ff5555, #ff0000)',
  '&:hover': {
    background: orderType === 'buy'
      ? 'linear-gradient(135deg, #00cc00, #009900)'
      : 'linear-gradient(135deg, #ff0000, #cc0000)',
  },
}));

/**
 * TradingForm Component
 * Handles buy/sell order submissions
 */
const TradingForm = ({ onSubmit }) => {
  const [orderType, setOrderType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ orderType, amount, price });
  };

  return (
    <GlassCard>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Place Order
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <ToggleButtonGroup
          value={orderType}
          exclusive
          onChange={(e, value) => value && setOrderType(value)}
          sx={{ width: '100%', mb: 2 }}
        >
          <ToggleButton 
            value="buy"
            sx={{ 
              flex: 1,
              color: '#00ff00',
              '&.Mui-selected': { backgroundColor: 'rgba(0,255,0,0.1)' }
            }}
          >
            Buy
          </ToggleButton>
          <ToggleButton 
            value="sell"
            sx={{ 
              flex: 1,
              color: '#ff5555',
              '&.Mui-selected': { backgroundColor: 'rgba(255,0,0,0.1)' }
            }}
          >
            Sell
          </ToggleButton>
        </ToggleButtonGroup>

        <StyledTextField
          fullWidth
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ mb: 2 }}
        />

        <StyledTextField
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 3 }}
        />

        <ActionButton
          type="submit"
          variant="contained"
          orderType={orderType}
        >
          {orderType === 'buy' ? 'Buy' : 'Sell'}
        </ActionButton>
      </Box>
    </GlassCard>
  );
};

export default TradingForm;