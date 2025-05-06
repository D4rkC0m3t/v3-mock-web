import React, { useState, useEffect } from 'react';
import { WalletTransaction, NetworkType } from '../types/wallet';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  styled,
  Tooltip,
  CircularProgress,
  Grid,
  Button
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  ArrowUpward,
  ArrowDownward,
  SwapHoriz,
  Bolt,
  Star,
  ContentCopy,
  OpenInNew,
  CheckCircle,
  ErrorOutline,
  HourglassEmpty,
  FilterList,
  Search
} from '@mui/icons-material';

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  overflow: 'hidden',
  '& .MuiTableCell-root': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
  '& .MuiTableRow-root:hover': {
    background: 'rgba(0, 240, 255, 0.1)',
  }
}));

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
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
});

const FilterSelect = styled(Select)({
  color: 'white',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.23)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#00F0FF',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});



interface TransactionHistoryProps {
  transactions: WalletTransaction[];
  isLoading?: boolean;
  network: NetworkType;
  walletAddress: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions: initialTransactions,
  isLoading = false,
  network,
  walletAddress
}) => {
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter state
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredTransactions, setFilteredTransactions] = useState<WalletTransaction[]>([]);

  // Apply filters and search to transactions
  useEffect(() => {
    let result = [...initialTransactions];

    // Apply type filter
    if (filter !== 'all') {
      result = result.filter(tx => {
        if (filter === 'trade') {
          return tx.type === 'buy' || tx.type === 'sell';
        }
        return tx.type === filter;
      });
    }

    // Apply date filters
    if (startDate) {
      result = result.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= startDate;
      });
    }

    if (endDate) {
      // Set end date to end of day
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      result = result.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate <= endOfDay;
      });
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tx =>
        tx.asset.toLowerCase().includes(query) ||
        tx.txHash.toLowerCase().includes(query) ||
        tx.type.toLowerCase().includes(query) ||
        tx.amount.toString().includes(query) ||
        tx.value.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(result);
  }, [initialTransactions, filter, searchQuery, startDate, endDate]);

  // Get paginated transactions
  const getPaginatedTransactions = () => {
    const startIndex = page * rowsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + rowsPerPage);
  };

  const getTransactionIcon = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownward sx={{ color: '#4caf50' }} />;
      case 'withdraw':
        return <ArrowUpward sx={{ color: '#f44336' }} />;
      case 'swap':
        return <SwapHoriz sx={{ color: '#00F0FF' }} />;
      case 'stake':
        return <Bolt sx={{ color: '#ff9800' }} />;
      case 'unstake':
        return <Bolt sx={{ color: '#9c27b0' }} />;
      case 'reward':
        return <Star sx={{ color: '#ffeb3b' }} />;
      case 'buy':
        return <ArrowDownward sx={{ color: '#4caf50' }} />;
      case 'sell':
        return <ArrowUpward sx={{ color: '#f44336' }} />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: WalletTransaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle sx={{ color: '#4caf50' }} />;
      case 'pending':
        return <HourglassEmpty sx={{ color: '#ff9800' }} />;
      case 'failed':
        return <ErrorOutline sx={{ color: '#f44336' }} />;
      default:
        return null;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress sx={{ color: '#00F0FF' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: '#f44336' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <SearchField
              label="Search transactions"
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Type</InputLabel>
              <FilterSelect
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Type"
                startAdornment={<FilterList sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} />}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="deposit">Deposits</MenuItem>
                <MenuItem value="withdraw">Withdrawals</MenuItem>
                <MenuItem value="swap">Swaps</MenuItem>
                <MenuItem value="stake">Stakes</MenuItem>
                <MenuItem value="trade">Trades</MenuItem>
              </FilterSelect>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(0, 240, 255, 0.3)' },
                        '&.Mui-focused fieldset': { borderColor: 'rgba(0, 240, 255, 0.5)' },
                      },
                      '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(0, 240, 255, 0.3)' },
                        '&.Mui-focused fieldset': { borderColor: 'rgba(0, 240, 255, 0.5)' },
                      },
                      '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Box>

      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Fee</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Transaction Hash</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getPaginatedTransactions().map((tx) => (
              <TableRow key={tx.txHash}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTransactionIcon(tx.type)}
                    <Typography sx={{ textTransform: 'capitalize' }}>{tx.type}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{tx.asset}</TableCell>
                <TableCell align="right">{tx.amount}</TableCell>
                <TableCell align="right">{tx.value}</TableCell>
                <TableCell align="right">{tx.fee}</TableCell>
                <TableCell>{`${tx.date} ${tx.time}`}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(tx.status)}
                    label={tx.status}
                    size="small"
                    sx={{
                      bgcolor: tx.status === 'completed' ? 'rgba(76, 175, 80, 0.1)' :
                              tx.status === 'pending' ? 'rgba(255, 152, 0, 0.1)' :
                              'rgba(244, 67, 54, 0.1)',
                      color: tx.status === 'completed' ? '#4caf50' :
                             tx.status === 'pending' ? '#ff9800' :
                             '#f44336',
                      border: `1px solid ${tx.status === 'completed' ? 'rgba(76, 175, 80, 0.5)' :
                                          tx.status === 'pending' ? 'rgba(255, 152, 0, 0.5)' :
                                          'rgba(244, 67, 54, 0.5)'}`,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontFamily: 'monospace' }}>
                      {`${tx.txHash.slice(0, 6)}...${tx.txHash.slice(-4)}`}
                    </Typography>
                    <Tooltip title="Copy hash">
                      <IconButton size="small" onClick={() => copyToClipboard(tx.txHash)}>
                        <ContentCopy sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View on explorer">
                      <IconButton size="small" component="a" href={`https://${network === 'mainnet' ? 'etherscan.io' : 'sepolia.etherscan.io'}/tx/${tx.txHash}`} target="_blank">
                        <OpenInNew sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <TablePagination
        component="div"
        count={filteredTransactions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: 'white',
          '& .MuiTablePagination-select': {
            color: 'white',
          },
          '& .MuiTablePagination-selectIcon': {
            color: 'white',
          },
        }}
      />
    </Box>
  );
};

export default TransactionHistory;