import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled } from '@mui/material';
import { GlassCard } from '../ui/GlassCard';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#fff',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  padding: '8px 16px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
}));

/**
 * OrderBook Component
 * Displays the order book with buy and sell orders
 */
const OrderBook = ({ buyOrders = [], sellOrders = [] }) => {
  return (
    <GlassCard sx={{ height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Order Book
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
            </TableRow>
          </TableHead>
          
          {/* Sell Orders */}
          <TableBody>
            {sellOrders.map((order, index) => (
              <StyledTableRow key={`sell-${index}`}>
                <StyledTableCell sx={{ color: '#ff5555' }}>
                  {order.price}
                </StyledTableCell>
                <StyledTableCell align="right">{order.amount}</StyledTableCell>
                <StyledTableCell align="right">{order.total}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>

          {/* Spread Indicator */}
          <TableBody>
            <StyledTableRow>
              <StyledTableCell colSpan={3} align="center" sx={{ py: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Spread: {sellOrders[0]?.price - buyOrders[0]?.price || 0}
                </Typography>
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>

          {/* Buy Orders */}
          <TableBody>
            {buyOrders.map((order, index) => (
              <StyledTableRow key={`buy-${index}`}>
                <StyledTableCell sx={{ color: '#00ff00' }}>
                  {order.price}
                </StyledTableCell>
                <StyledTableCell align="right">{order.amount}</StyledTableCell>
                <StyledTableCell align="right">{order.total}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </GlassCard>
  );
};

export default OrderBook;