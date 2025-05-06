import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Typography, Box, Container, Grid, Paper, styled, AppBar, Toolbar,
  Button, IconButton
} from '@mui/material';
import {
  AccountBalanceWallet, Notifications, History as HistoryIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Logo from './components/Logo';
import TransactionHistory from './components/TransactionHistory';

// Styled components
const HistoryContainer = styled(Box)({
  minHeight: '100vh',
  background: '#0A0E17',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'radial-gradient(circle at 30% 20%, rgba(0, 240, 255, 0.08) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(0, 163, 255, 0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
});

const HistoryCard = styled(Paper)({
  padding: '1.5rem',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
  height: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-1px',
    borderRadius: '13px',
    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 163, 255, 0.2))',
    opacity: 0.5,
    zIndex: -1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(0, 163, 255, 0.05) 100%)',
    zIndex: -2,
  }
});

interface FloatingElementProps {
  size: string;
  color: string;
  left: number;
  top: number;
  delay: number;
}

// Floating element component for background animation
const FloatingElement = ({ size, color, left, top, delay }: FloatingElementProps) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${color}, rgba(0,0,0,0))`,
        left: `${left}%`,
        top: `${top}%`,
        filter: 'blur(15px)',
        opacity: 0.4,
        zIndex: 0,
      }}
      animate={{
        y: ['-10%', '10%'],
        x: ['-5%', '5%'],
        scale: [0.95, 1.05, 0.95],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        y: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 8 + Math.random() * 4,
          ease: 'easeInOut',
          delay: delay,
        },
        x: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 10 + Math.random() * 4,
          ease: 'easeInOut',
          delay: delay + 1,
        },
        scale: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 12 + Math.random() * 4,
          ease: 'easeInOut',
          delay: delay,
        },
        opacity: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 6 + Math.random() * 2,
          ease: 'easeInOut',
          delay: delay,
        },
      }}
    />
  );
};

// Interface for transaction history
interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'swap' | 'stake' | 'unstake' | 'reward' | 'buy' | 'sell';
  asset: string;
  amount: string;
  value: string;
  fee: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
}

export default function History() {
  // State for wallet address
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);

  // Function to handle logout
  const handleLogout = () => {
    auth.logout(navigate);
  };

  // Function to handle wallet connection
  const connectWallet = () => {
    // TODO: Implement wallet connection
    setWalletAddress('0x1234...5678');
  };

  // Generate mock data for transactions
  useEffect(() => {
    // Generate mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'deposit',
        asset: 'BTC',
        amount: '0.05',
        value: '$3,050.25',
        fee: '$0.50',
        date: '2023-06-15',
        time: '14:30:25',
        status: 'completed',
        txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t'
      },
      {
        id: '2',
        type: 'withdraw',
        asset: 'ETH',
        amount: '1.2',
        value: '$3,750.00',
        fee: '$1.20',
        date: '2023-06-12',
        time: '09:15:10',
        status: 'completed',
        txHash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a'
      },
      {
        id: '3',
        type: 'swap',
        asset: 'SOL → BTC',
        amount: '10.0',
        value: '$1,430.00',
        fee: '$2.50',
        date: '2023-06-10',
        time: '18:45:33',
        status: 'completed',
        txHash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b'
      },
      {
        id: '4',
        type: 'stake',
        asset: 'ETH',
        amount: '0.5',
        value: '$1,562.50',
        fee: '$0.75',
        date: '2023-06-08',
        time: '11:20:45',
        status: 'completed',
        txHash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c'
      },
      {
        id: '5',
        type: 'reward',
        asset: 'DOT',
        amount: '5.0',
        value: '$36.15',
        fee: '$0.00',
        date: '2023-06-05',
        time: '00:00:00',
        status: 'completed',
        txHash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d'
      },
      {
        id: '6',
        type: 'unstake',
        asset: 'SOL',
        amount: '15.0',
        value: '$2,145.00',
        fee: '$1.05',
        date: '2023-06-01',
        time: '16:30:22',
        status: 'pending',
        txHash: '0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e'
      },
      {
        id: '7',
        type: 'buy',
        asset: 'BTC',
        amount: '0.1',
        value: '$6,100.50',
        fee: '$3.05',
        date: '2023-05-28',
        time: '10:45:18',
        status: 'completed',
        txHash: '0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e6f'
      },
      {
        id: '8',
        type: 'sell',
        asset: 'ETH',
        amount: '2.0',
        value: '$6,250.00',
        fee: '$3.12',
        date: '2023-05-25',
        time: '14:22:36',
        status: 'completed',
        txHash: '0x8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e6f7g'
      },
      {
        id: '9',
        type: 'deposit',
        asset: 'USDT',
        amount: '1000.0',
        value: '$1,000.00',
        fee: '$0.00',
        date: '2023-05-20',
        time: '09:10:05',
        status: 'completed',
        txHash: '0x9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e6f7g8h'
      },
      {
        id: '10',
        type: 'withdraw',
        asset: 'SOL',
        amount: '25.0',
        value: '$3,575.00',
        fee: '$1.78',
        date: '2023-05-15',
        time: '17:05:42',
        status: 'failed',
        txHash: '0x0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e6f7g8h9i'
      },
    ];

    setTransactions(mockTransactions);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0A0E17' }}>
      {/* Navigation Bar */}
      <AppBar position="sticky" sx={{
        background: 'rgba(10, 14, 23, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Logo />

            <Box sx={{ ml: 4, display: { xs: 'none', md: 'flex' } }}>
              {['Dashboard', 'Trade', 'Wallet', 'History'].map((page) => (
                <Button
                  key={page}
                  component={Link}
                  to={`/${page.toLowerCase()}`}
                  sx={{
                    color: 'white',
                    mx: 1,
                    '&:hover': {
                      background: 'rgba(0, 240, 255, 0.1)',
                    },
                    ...(window.location.pathname === `/${page.toLowerCase()}` ? {
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '2px',
                        background: '#00F0FF',
                        borderRadius: '2px',
                      }
                    } : {})
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Notifications sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </IconButton>

            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                borderColor: 'rgba(0, 240, 255, 0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(0, 240, 255, 0.5)',
                  background: 'rgba(0, 240, 255, 0.1)',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <HistoryContainer>
        {/* Floating background elements */}
        {floatingElements.map((props, index) => (
          <FloatingElement key={index} {...props} />
        ))}

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 5, py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 4,
                background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Transaction History
            </Typography>
          </motion.div>

          {/* Transaction History Interface */}
          <Grid container spacing={3}>
            {/* Filters and Controls */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <HistoryCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Filters
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                          '& .MuiTabs-indicator': {
                            backgroundColor: '#00F0FF',
                          },
                          '& .MuiTab-root': {
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&.Mui-selected': {
                              color: '#00F0FF',
                            },
                          },
                        }}
                      >
                        <Tab label="All" />
                        <Tab label="Deposits" />
                        <Tab label="Withdrawals" />
                        <Tab label="Trades" />
                        <Tab label="Staking" />
                      </Tabs>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 120,
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(0, 240, 255, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(0, 240, 255, 0.5)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                        '& .MuiSelect-icon': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    >
                      <InputLabel id="status-filter-label">Status</InputLabel>
                      <Select
                        labelId="status-filter-label"
                        value={filter}
                        onChange={handleFilterChange}
                        label="Status"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      placeholder="Search by asset or hash"
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <Search sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />,
                      }}
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '4px',
                          '& fieldset': {
                            borderColor: 'rgba(0, 240, 255, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(0, 240, 255, 0.5)',
                          },
                        },
                      }}
                    />

                    <Button
                      variant="outlined"
                      startIcon={<CalendarToday />}
                      sx={{
                        borderColor: 'rgba(0, 240, 255, 0.3)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'rgba(0, 240, 255, 0.5)',
                          background: 'rgba(0, 240, 255, 0.1)',
                        }
                      }}
                    >
                      Date Range
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      sx={{
                        borderColor: 'rgba(0, 240, 255, 0.3)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'rgba(0, 240, 255, 0.5)',
                          background: 'rgba(0, 240, 255, 0.1)',
                        }
                      }}
                    >
                      Export
                    </Button>
                  </Box>
                </HistoryCard>
              </motion.div>
            </Grid>

            {/* Transaction History Table */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <HistoryCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Transaction History
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        <Refresh />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        <FilterList />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        <Download />
                      </IconButton>
                    </Box>
                  </Box>

                  <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 950 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <TableSortLabel
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.MuiTableSortLabel-active': {
                                  color: '#00F0FF',
                                },
                                '& .MuiTableSortLabel-icon': {
                                  color: '#00F0FF !important',
                                },
                              }}
                            >
                              Type
                            </TableSortLabel>
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <TableSortLabel
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.MuiTableSortLabel-active': {
                                  color: '#00F0FF',
                                },
                                '& .MuiTableSortLabel-icon': {
                                  color: '#00F0FF !important',
                                },
                              }}
                            >
                              Asset
                            </TableSortLabel>
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <TableSortLabel
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.MuiTableSortLabel-active': {
                                  color: '#00F0FF',
                                },
                                '& .MuiTableSortLabel-icon': {
                                  color: '#00F0FF !important',
                                },
                              }}
                            >
                              Amount
                            </TableSortLabel>
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <TableSortLabel
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.MuiTableSortLabel-active': {
                                  color: '#00F0FF',
                                },
                                '& .MuiTableSortLabel-icon': {
                                  color: '#00F0FF !important',
                                },
                              }}
                            >
                              Value
                            </TableSortLabel>
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <TableSortLabel
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.MuiTableSortLabel-active': {
                                  color: '#00F0FF',
                                },
                                '& .MuiTableSortLabel-icon': {
                                  color: '#00F0FF !important',
                                },
                              }}
                            >
                              Fee
                            </TableSortLabel>
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <TableSortLabel
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.MuiTableSortLabel-active': {
                                  color: '#00F0FF',
                                },
                                '& .MuiTableSortLabel-icon': {
                                  color: '#00F0FF !important',
                                },
                              }}
                            >
                              Date/Time
                            </TableSortLabel>
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <TableSortLabel
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.MuiTableSortLabel-active': {
                                  color: '#00F0FF',
                                },
                                '& .MuiTableSortLabel-icon': {
                                  color: '#00F0FF !important',
                                },
                              }}
                            >
                              Status
                            </TableSortLabel>
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            Transaction Hash
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions.map((tx) => (
                          <TableRow
                            key={tx.id}
                            hover
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(0, 240, 255, 0.05) !important',
                              },
                              '& .MuiTableCell-root': {
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                color: 'white',
                              }
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: 'rgba(0, 240, 255, 0.1)' }}>
                                  {getTransactionIcon(tx.type)}
                                </Avatar>
                                <Typography sx={{ textTransform: 'capitalize' }}>
                                  {tx.type}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{tx.asset}</TableCell>
                            <TableCell align="right">{tx.amount}</TableCell>
                            <TableCell align="right">{tx.value}</TableCell>
                            <TableCell align="right">{tx.fee}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Typography variant="body2">{tx.date}</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                  {tx.time}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
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
                                  borderRadius: '4px',
                                  '& .MuiChip-icon': {
                                    marginLeft: '4px',
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Typography variant="body2" sx={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  maxWidth: '100px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {tx.txHash.substring(0, 10)}...{tx.txHash.substring(tx.txHash.length - 4)}
                                </Typography>
                                <Tooltip title="Copy transaction hash">
                                  <IconButton
                                    size="small"
                                    sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.5)' }}
                                    onClick={() => copyToClipboard(tx.txHash)}
                                  >
                                    <ContentCopy fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="View on explorer">
                                  <IconButton
                                    size="small"
                                    sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                                    component="a"
                                    href={`https://etherscan.io/tx/${tx.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <OpenInNew fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Showing {transactions.length} of {transactions.length} transactions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled
                        sx={{
                          borderColor: 'rgba(0, 240, 255, 0.3)',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'rgba(0, 240, 255, 0.5)',
                            background: 'rgba(0, 240, 255, 0.1)',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.3)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled
                        sx={{
                          borderColor: 'rgba(0, 240, 255, 0.3)',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'rgba(0, 240, 255, 0.5)',
                            background: 'rgba(0, 240, 255, 0.1)',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.3)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                </HistoryCard>
              </motion.div>
            </Grid>

            {/* Transaction Summary */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <HistoryCard>
                  <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Transaction Summary
                  </Typography>

                  <Grid container spacing={2}>
                    {[
                      { label: 'Total Deposits', value: '$12,345.75', icon: <ArrowDownward sx={{ color: '#4caf50' }} />, color: '#4caf50' },
                      { label: 'Total Withdrawals', value: '$5,325.00', icon: <ArrowUpward sx={{ color: '#f44336' }} />, color: '#f44336' },
                      { label: 'Total Trades', value: '$8,780.50', icon: <SwapHoriz sx={{ color: '#00F0FF' }} />, color: '#00F0FF' },
                      { label: 'Total Fees', value: '$124.17', icon: <HistoryIcon sx={{ color: '#ff9800' }} />, color: '#ff9800' },
                    ].map((item, index) => (
                      <Grid item xs={6} key={index}>
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          height: '100%',
                          justifyContent: 'center',
                        }}>
                          <Avatar sx={{ bgcolor: `${item.color}20`, mb: 1, width: 40, height: 40 }}>
                            {item.icon}
                          </Avatar>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                            {item.label}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: item.color }}>
                            {item.value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </HistoryCard>
              </motion.div>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <HistoryCard>
                  <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Activity Overview
                  </Typography>

                  <Box sx={{ height: 250, mb: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { name: 'Jan', value: 4000 },
                          { name: 'Feb', value: 3000 },
                          { name: 'Mar', value: 5000 },
                          { name: 'Apr', value: 2780 },
                          { name: 'May', value: 1890 },
                          { name: 'Jun', value: 2390 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="name"
                          tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                          axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                        />
                        <YAxis
                          tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                          axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: 'rgba(10, 14, 23, 0.8)',
                            borderColor: 'rgba(0, 240, 255, 0.2)',
                            color: 'white',
                          }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#00F0FF"
                          fillOpacity={1}
                          fill="url(#colorValue)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Total Volume: $19,060
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowDropDown />}
                      sx={{
                        borderColor: 'rgba(0, 240, 255, 0.3)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'rgba(0, 240, 255, 0.5)',
                          background: 'rgba(0, 240, 255, 0.1)',
                        }
                      }}
                    >
                      Last 6 Months
                    </Button>
                  </Box>
                </HistoryCard>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HistoryContainer>
    </Box>
  );
}
