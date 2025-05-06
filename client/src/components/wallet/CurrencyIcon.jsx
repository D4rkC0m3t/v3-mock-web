import React from 'react';
import { Box, Avatar, styled } from '@mui/material';

// Styled components
const IconWrapper = styled(Box)(({ theme, size = 32 }) => ({
  width: size,
  height: size,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}));

const StyledAvatar = styled(Avatar)(({ theme, size = 32, bgcolor }) => ({
  width: size,
  height: size,
  backgroundColor: bgcolor,
  fontSize: size * 0.5,
  fontWeight: 'bold',
}));

// Currency color mapping
const currencyColors = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  USDT: '#26A17B',
  SOL: '#14F195',
  ADA: '#0033AD',
  DOT: '#E6007A',
  DOGE: '#C3A634',
  XRP: '#23292F',
  LINK: '#2A5ADA',
  AVAX: '#E84142',
  MATIC: '#8247E5',
  // Add more as needed
};

// Currency icon mapping (you can replace these with actual SVG imports)
const currencyIcons = {
  // For now, we'll use the first letter of each currency
  // In a real app, you would import SVG icons for each currency
};

/**
 * CurrencyIcon Component
 * Displays an icon for a cryptocurrency
 * 
 * @param {Object} props - Component props
 * @param {string} props.currency - Currency code (e.g., 'BTC', 'ETH')
 * @param {number} props.size - Icon size in pixels
 * @param {Object} props.sx - Additional MUI sx props
 */
const CurrencyIcon = ({ currency, size = 32, sx = {}, ...rest }) => {
  // Get the background color for the currency, or use a default
  const bgColor = currencyColors[currency] || '#00F0FF';
  
  // Get the first letter of the currency for the fallback
  const firstLetter = currency.charAt(0);
  
  return (
    <IconWrapper size={size} sx={sx} {...rest}>
      <StyledAvatar 
        size={size} 
        bgcolor={bgColor}
        src={currencyIcons[currency]}
        alt={`${currency} icon`}
      >
        {firstLetter}
      </StyledAvatar>
    </IconWrapper>
  );
};

export default CurrencyIcon;
