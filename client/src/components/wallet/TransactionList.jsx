import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, IconButton, Tooltip, styled, TextField, InputAdornment 
} from '@mui/material';
import { 
  ArrowUpward, ArrowDownward, Search, FilterList, 
  OpenInNew, ArrowForward, ArrowBack 
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Styled components
const TransactionCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  height: '100%',
}));

const StyledTableContainer = styled(TableContainer)({
  maxHeight: 500,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
  },
});

const StyledTableCell = styled(TableCell)(({ theme, align, color }) => ({
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  padding: '12px 16px',
  color: color || 'white',
  textAlign: align || 'left',
}));

const StyledTableRow = styled(TableRow)({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
  },
});

const StatusChip = styled(Chip)(({ theme, status }) => {
  const colors = {
    completed: {
      background: 'rgba(0, 200, 83, 0.1)',
      border: 'rgba(0, 200, 83, 0.3)',
      color: '#00c853'
    },
    pending: {
      background: 'rgba(255, 171, 0, 0.1)',
      border: 'rgba(255, 171, 0, 0.3)',
      color: '#ffab00'
    },
    failed: {
      background: 'rgba(255, 82, 82, 0.1)',
      border: 'rgba(255, 82, 82, 0.3)',
      color: '#ff5252'
    }
  };
  
  const colorSet = colors[status] || colors.pending;
  
  return {
    background: colorSet.background,
    border: `1px solid ${colorSet.border}`,
    color: colorSet.color,
    fontWeight: 600,
  };
});

const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00F0FF',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#00F0FF',
    },
  },
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
}));

const PaginationButton = styled(IconButton)(({ theme, disabled }) => ({
  color: disabled ? 'rgba(255, 255, 255, 0.3)' : '#00F0FF',
  background: disabled ? 'transparent' : 'rgba(0, 240, 255, 0.1)',
  '&:hover': {
    background: disabled ? 'transparent' : 'rgba(0, 240, 255, 0.2)',
  },
}));

/**
 * TransactionList Component
 * Displays a list of cryptocurrency transactions with filtering and pagination
 */
const TransactionList = ({ 
  transactions = [],
}) => {
  // Generate sample data if none provided
  const sampleTransactions = transactions.length > 0 ? transactions : generateSampleTransactions();
  
  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  // Filter transactions based on search term
  const filteredTransactions = sampleTransactions.filter(tx => 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Paginate transactions
  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Handle pagination
  const handlePreviousPage = () => {
    setPage(prev => Math.max(0, prev - 1));
  };
  
  const handleNextPage = () => {
    setPage(prev => Math.min(Math.ceil(filteredTransactions.length / rowsPerPage) - 1, prev + 1));
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TransactionCard elevation={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Transaction History
          </Typography>
          
          <Tooltip title="Filter Transactions">
            <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>
        
        <SearchField
          label="Search Transactions"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </InputAdornment>
            ),
          }}
        />
        
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Type</StyledTableCell>
                <StyledTableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Symbol</StyledTableCell>
                <StyledTableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Amount</StyledTableCell>
                <StyledTableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Price</StyledTableCell>
                <StyledTableCell align="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</StyledTableCell>
                <StyledTableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Date</StyledTableCell>
                <StyledTableCell align="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((tx) => (
                <StyledTableRow key={tx.id}>
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {tx.type === 'buy' ? (
                        <ArrowDownward sx={{ color: '#00c853', mr: 1 }} />
                      ) : (
                        <ArrowUpward sx={{ color: '#ff5252', mr: 1 }} />
                      )}
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>{tx.symbol}</StyledTableCell>
                  <StyledTableCell align="right" color={tx.type === 'buy' ? '#00c853' : '#ff5252'}>
                    {tx.type === 'buy' ? '+' : '-'}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    ${tx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <StatusChip
                      label={tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      status={tx.status}
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell>{formatDate(tx.timestamp)}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton size="small" sx={{ color: '#00F0FF' }}>
                        <OpenInNew fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              
              {paginatedTransactions.length === 0 && (
                <StyledTableRow>
                  <StyledTableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 3 }}>
                      No transactions found
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        
        <PaginationContainer>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Showing {paginatedTransactions.length > 0 ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <PaginationButton 
              disabled={page === 0}
              onClick={handlePreviousPage}
            >
              <ArrowBack />
            </PaginationButton>
            
            <PaginationButton 
              disabled={page >= Math.ceil(filteredTransactions.length / rowsPerPage) - 1}
              onClick={handleNextPage}
            >
              <ArrowForward />
            </PaginationButton>
          </Box>
        </PaginationContainer>
      </TransactionCard>
    </motion.div>
  );
};

// Helper function to generate sample transactions
const generateSampleTransactions = () => {
  const types = ['buy', 'sell'];
  const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ADA/USDT', 'DOT/USDT'];
  const statuses = ['completed', 'pending', 'failed'];
  
  const transactions = [];
  
  for (let i = 0; i < 25; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const price = 1000 + Math.random() * 70000;
    const amount = 0.001 + Math.random() * 2;
    
    // Generate a random date within the last 30 days
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
    
    transactions.push({
      id: `tx${i + 1}`,
      type,
      symbol,
      amount,
      price,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: pastDate.toISOString(),
    });
  }
  
  // Sort by timestamp (newest first)
  return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export default TransactionList;
