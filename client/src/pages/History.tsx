import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  styled
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  SwapHoriz,
  Bolt,
  Star,
  ContentCopy,
  OpenInNew,
  Search,
  FilterList,
  CheckCircle,
  ErrorOutline,
  HourglassEmpty
} from '@mui/icons-material';
import { WalletTransaction, NetworkType } from '../types/wallet';

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

const PageTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontWeight: 600,
  marginBottom: '1.5rem',
}));

// Mock data for website-specific transactions (testnet only)
const websiteTransactions: WalletTransaction[] = [
  {
    type: 'deposit',
    asset: 'tETH',
    amount: '10.0',
    value: '$30,000.00',
    date: '2023-06-15',
    status: 'completed',
    txHash: '0xt1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0',
    network: 'testnet'
  },
  {
    type: 'withdraw',
    asset: 'tBTC',
    amount: '1.5',
    value: '$43,500.00',
    date: '2023-06-14',
    status: 'completed',
    txHash: '0xt2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1',
    network: 'testnet'
  },
  {
    type: 'swap',
    asset: 'tETH → tBTC',
    amount: '20.0',
    value: '$60,000.00',
    date: '2023-06-13',
    status: 'pending',
    txHash: '0xt3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2',
    network: 'testnet'
  },
  {
    type: 'stake',
    asset: 'tETH',
    amount: '50.0',
    value: '$150,000.00',
    date: '2023-06-12',
    status: 'completed',
    txHash: '0xt4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3',
    network: 'testnet'
  },
  {
    type: 'unstake',
    asset: 'tETH',
    amount: '15.0',
    value: '$45,000.00',
    date: '2023-06-11',
    status: 'failed',
    txHash: '0xt5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4',
    network: 'testnet'
  },
  {
    type: 'deposit',
    asset: 'tUSDT',
    amount: '5000.0',
    value: '$5,000.00',
    date: '2023-06-10',
    status: 'completed',
    txHash: '0xt6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5',
    network: 'testnet'
  },
  {
    type: 'swap',
    asset: 'tUSDT → tETH',
    amount: '2500.0',
    value: '$2,500.00',
    date: '2023-06-09',
    status: 'completed',
    txHash: '0xt7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6',
    network: 'testnet'
  },
  {
    type: 'withdraw',
    asset: 'tBTC',
    amount: '0.5',
    value: '$14,500.00',
    date: '2023-06-08',
    status: 'completed',
    txHash: '0xt8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7',
    network: 'testnet'
  },
  {
    type: 'reward',
    asset: 'tETH',
    amount: '0.25',
    value: '$750.00',
    date: '2023-06-07',
    status: 'completed',
    txHash: '0xt9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8',
    network: 'testnet'
  },
  {
    type: 'deposit',
    asset: 'tSOL',
    amount: '100.0',
    value: '$2,500.00',
    date: '2023-06-06',
    status: 'completed',
    txHash: '0xta0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9',
    network: 'testnet'
  },
  {
    type: 'stake',
    asset: 'tSOL',
    amount: '50.0',
    value: '$1,250.00',
    date: '2023-06-05',
    status: 'completed',
    txHash: '0xtb1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0',
    network: 'testnet'
  },
  {
    type: 'swap',
    asset: 'tSOL → tBTC',
    amount: '25.0',
    value: '$625.00',
    date: '2023-06-04',
    status: 'completed',
    txHash: '0xtc2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1',
    network: 'testnet'
  }
];

// Use only website transactions
const allTransactions = websiteTransactions;

const History: React.FC = () => {
  // State for filters
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assetFilter, setAssetFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for filtered transactions
  const [filteredTransactions, setFilteredTransactions] = useState<WalletTransaction[]>(allTransactions);

  // Get unique assets for filter dropdown
  const uniqueAssets = Array.from(new Set(allTransactions.map(tx => tx.asset.split(' → ')[0])));

  // Apply filters
  useEffect(() => {
    let result = [...allTransactions];

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(tx => tx.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(tx => tx.status === statusFilter);
    }

    // All transactions are from testnet by default

    // Apply asset filter
    if (assetFilter !== 'all') {
      result = result.filter(tx => tx.asset.includes(assetFilter));
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const startDate = new Date();

      switch (dateFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }

      result = result.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= startDate && txDate <= today;
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

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredTransactions(result);
  }, [typeFilter, statusFilter, assetFilter, dateFilter, searchQuery]);

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get transaction icon based on type
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
      default:
        return null;
    }
  };

  // Get status icon based on status
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

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Get platform transaction viewer URL
  const getTransactionViewerUrl = (txHash: string) => {
    // This would be your platform's transaction viewer URL
    return `/transaction/${txHash}`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageTitle variant="h4">Website Transaction History</PageTitle>
      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
        View and filter your transactions on our platform's testnet
      </Typography>

      {/* Filters */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
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

          <Grid item xs={6} md={1.8}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Type</InputLabel>
              <FilterSelect
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="deposit">Deposits</MenuItem>
                <MenuItem value="withdraw">Withdrawals</MenuItem>
                <MenuItem value="swap">Swaps</MenuItem>
                <MenuItem value="stake">Stakes</MenuItem>
                <MenuItem value="unstake">Unstakes</MenuItem>
                <MenuItem value="reward">Rewards</MenuItem>
              </FilterSelect>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={1.8}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</InputLabel>
              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </FilterSelect>
            </FormControl>
          </Grid>

          {/* Network filter removed since we only show testnet transactions */}

          <Grid item xs={6} md={1.8}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Asset</InputLabel>
              <FilterSelect
                value={assetFilter}
                onChange={(e) => setAssetFilter(e.target.value)}
                label="Asset"
              >
                <MenuItem value="all">All Assets</MenuItem>
                {uniqueAssets.map(asset => (
                  <MenuItem key={asset} value={asset}>{asset}</MenuItem>
                ))}
              </FilterSelect>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={1.8}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Date</InputLabel>
              <FilterSelect
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                label="Date"
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
              </FilterSelect>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results count */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Showing {filteredTransactions.length} transactions
        </Typography>
      </Box>

      {/* Transactions Table */}
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Network</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Transaction Hash</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((tx) => (
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
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <Chip
                      label="Platform Testnet"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(0, 240, 255, 0.1)',
                        color: '#00F0FF',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                      }}
                    />
                  </TableCell>
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
                      <Tooltip title="View transaction details">
                        <IconButton
                          size="small"
                          component="a"
                          href={getTransactionViewerUrl(tx.txHash)}
                          target="_blank"
                        >
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

      {/* Pagination */}
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
    </Container>
  );
};

export default History;
