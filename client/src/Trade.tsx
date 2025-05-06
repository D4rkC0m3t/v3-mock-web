import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Typography, Box, Container, Grid, Paper, styled, Avatar, Chip, AppBar, Toolbar,
  Button, IconButton, Tab, Tabs, TextField, Select, MenuItem, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  Pagination, TablePagination, ButtonGroup
} from '@mui/material';
import {
  AccountBalanceWallet, TrendingUp, SwapHoriz, Notifications, ArrowDropDown,
  ArrowDropUp, History, Settings, Refresh, Star, StarBorder, Search
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Logo from './components/Logo';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Area, AreaChart, BarChart, Bar, Legend, Scatter, ScatterChart,
  ComposedChart, Brush, ReferenceLine
} from 'recharts';

// Styled components
const TradeContainer = styled(Box)({
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

const TradeCard = styled(Paper)({
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

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
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
});

const GradientButton = styled(Button)({
  background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
  color: 'white',
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(0, 240, 255, 0.2)',
  boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'all 0.5s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #2CF6FF, #0080FF)',
    boxShadow: '0 0 25px rgba(0, 240, 255, 0.7)',
    transform: 'translateY(-2px)',
    '&::before': {
      left: '100%',
    }
  },
  '&.Mui-disabled': {
    background: 'rgba(0, 240, 255, 0.3)',
    color: 'rgba(255, 255, 255, 0.5)',
  }
});

const StyledSelect = styled(Select)({
  color: 'white',
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '12px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 240, 255, 0.2)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 240, 255, 0.5)',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
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

// Interface for order book entry
interface OrderBookEntry {
  price: string;
  amount: string;
  total: string;
}

// Interface for trade history entry
interface TradeHistoryEntry {
  price: string;
  amount: string;
  time: string;
  type: 'buy' | 'sell';
}

// Interface for chart data point
interface ChartDataPoint {
  time: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  rsi?: number;
  macd?: number;
  signal?: number;
  histogram?: number;
  ma20?: number;
  ma50?: number;
  ma200?: number;
}

export default function Trade() {
  // State for active tab
  const [activeTab, setActiveTab] = useState(0);
  const [orderFormTab, setOrderFormTab] = useState(0);

  // State for trading pair
  const [tradingPair, setTradingPair] = useState('BTC/USDT');

  // State for buy/sell form
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [buyPrice, setBuyPrice] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [takeProfitPrice, setTakeProfitPrice] = useState('');

  // State for order book
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);

  // State for market depth
  const [showDepthChart, setShowDepthChart] = useState(false);

  // State for trade history
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryEntry[]>([]);
  const [tradeHistoryFilter, setTradeHistoryFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [tradeHistoryPage, setTradeHistoryPage] = useState(0);
  const [tradeHistoryRowsPerPage, setTradeHistoryRowsPerPage] = useState(10);

  // State for chart data
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // State for chart type and timeframe
  const [chartType, setChartType] = useState<'area' | 'candlestick' | 'line'>('area');
  const [timeframe, setTimeframe] = useState<'1H' | '1D' | '1W' | '1M'>('1D');

  // State for technical indicators
  const [showVolume, setShowVolume] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [showMACD, setShowMACD] = useState(false);
  const [showMA, setShowMA] = useState(false);

  // Array of floating elements for the background
  const floatingElements = [
    { size: '400px', color: 'rgba(0, 240, 255, 0.15)', left: 10, top: 20, delay: 0 },
    { size: '300px', color: 'rgba(0, 163, 255, 0.12)', left: 75, top: 15, delay: 0.5 },
    { size: '350px', color: 'rgba(0, 240, 255, 0.1)', left: 85, top: 60, delay: 1 },
    { size: '250px', color: 'rgba(0, 163, 255, 0.08)', left: 25, top: 70, delay: 1.5 },
  ];

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Function to handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Function to handle order form tab change
  const handleOrderFormTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setOrderFormTab(newValue);
  };

  // Function to handle order type change
  const handleOrderTypeChange = (type: 'market' | 'limit' | 'stop') => {
    setOrderType(type);
  };

  // Function to handle buy
  const handleBuy = () => {
    switch (orderType) {
      case 'market':
        console.log('Market Buy:', buyAmount, 'at market price');
        break;
      case 'limit':
        console.log('Limit Buy:', buyAmount, 'at', buyPrice);
        break;
      case 'stop':
        console.log('Stop Buy:', buyAmount, 'at', buyPrice, 'with stop at', stopPrice, 'and take profit at', takeProfitPrice);
        break;
    }
    // Add actual buy logic here
  };

  // Function to handle sell
  const handleSell = () => {
    switch (orderType) {
      case 'market':
        console.log('Market Sell:', sellAmount, 'at market price');
        break;
      case 'limit':
        console.log('Limit Sell:', sellAmount, 'at', sellPrice);
        break;
      case 'stop':
        console.log('Stop Sell:', sellAmount, 'at', sellPrice, 'with stop at', stopPrice, 'and take profit at', takeProfitPrice);
        break;
    }
    // Add actual sell logic here
  };

  // Function to handle chart type change
  const handleChartTypeChange = (type: 'area' | 'candlestick' | 'line') => {
    setChartType(type);
  };

  // Function to handle timeframe change
  const handleTimeframeChange = (tf: '1H' | '1D' | '1W' | '1M') => {
    setTimeframe(tf);
    // In a real app, you would fetch new data for the selected timeframe
    console.log(`Fetching data for ${tf} timeframe`);
  };

  // Function to toggle technical indicators
  const toggleIndicator = (indicator: 'volume' | 'rsi' | 'macd' | 'ma') => {
    switch (indicator) {
      case 'volume':
        setShowVolume(!showVolume);
        break;
      case 'rsi':
        setShowRSI(!showRSI);
        break;
      case 'macd':
        setShowMACD(!showMACD);
        break;
      case 'ma':
        setShowMA(!showMA);
        break;
    }
  };

  // Function to handle trade history filter change
  const handleTradeHistoryFilterChange = (filter: 'all' | 'buy' | 'sell') => {
    setTradeHistoryFilter(filter);
    setTradeHistoryPage(0); // Reset to first page when filter changes
  };

  // Function to handle trade history pagination
  const handleTradeHistoryPageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setTradeHistoryPage(newPage);
  };

  // Function to handle rows per page change
  const handleTradeHistoryRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTradeHistoryRowsPerPage(parseInt(event.target.value, 10));
    setTradeHistoryPage(0);
  };

  // Generate mock data for order book and trade history
  useEffect(() => {
    // Generate mock asks (sell orders)
    const mockAsks = Array.from({ length: 10 }, (_, i) => {
      const price = (61245 + (i + 1) * 15).toFixed(2);
      const amount = (Math.random() * 2).toFixed(4);
      const total = (parseFloat(price) * parseFloat(amount)).toFixed(2);
      return { price, amount, total };
    }).reverse();

    // Generate mock bids (buy orders)
    const mockBids = Array.from({ length: 10 }, (_, i) => {
      const price = (61245 - (i + 1) * 12).toFixed(2);
      const amount = (Math.random() * 2).toFixed(4);
      const total = (parseFloat(price) * parseFloat(amount)).toFixed(2);
      return { price, amount, total };
    });

    // Generate mock trade history
    const mockTradeHistory = Array.from({ length: 20 }, (_, i) => {
      const isBuy = Math.random() > 0.5;
      const price = (61245 + (Math.random() * 200 - 100)).toFixed(2);
      const amount = (Math.random() * 1).toFixed(4);
      const now = new Date();
      now.setMinutes(now.getMinutes() - i * 2);
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { price, amount, time, type: isBuy ? 'buy' : 'sell' as const };
    });

    // Generate mock chart data with candlestick and technical indicators
    const mockChartData = [
      { time: '00:00', price: 60100, open: 60000, high: 60200, low: 59800, close: 60100, volume: 1200, rsi: 55, macd: 10, signal: 8, histogram: 2, ma20: 59900, ma50: 59800, ma200: 59500 },
      { time: '04:00', price: 60400, open: 60100, high: 60500, low: 60050, close: 60400, volume: 1500, rsi: 58, macd: 12, signal: 9, histogram: 3, ma20: 60000, ma50: 59850, ma200: 59550 },
      { time: '08:00', price: 59800, open: 60400, high: 60450, low: 59700, close: 59800, volume: 1800, rsi: 48, macd: 8, signal: 9, histogram: -1, ma20: 60050, ma50: 59900, ma200: 59600 },
      { time: '12:00', price: 61200, open: 59800, high: 61300, low: 59750, close: 61200, volume: 2200, rsi: 65, macd: 15, signal: 10, histogram: 5, ma20: 60200, ma50: 59950, ma200: 59650 },
      { time: '16:00', price: 60700, open: 61200, high: 61250, low: 60600, close: 60700, volume: 1900, rsi: 60, macd: 14, signal: 12, histogram: 2, ma20: 60300, ma50: 60000, ma200: 59700 },
      { time: '20:00', price: 61500, open: 60700, high: 61600, low: 60650, close: 61500, volume: 2100, rsi: 68, macd: 18, signal: 14, histogram: 4, ma20: 60400, ma50: 60050, ma200: 59750 },
      { time: '24:00', price: 61245, open: 61500, high: 61550, low: 61100, close: 61245, volume: 1700, rsi: 63, macd: 16, signal: 15, histogram: 1, ma20: 60500, ma50: 60100, ma200: 59800 },
    ];

    setAsks(mockAsks);
    setBids(mockBids);
    setTradeHistory(mockTradeHistory);
    setChartData(mockChartData);

    // Set initial prices
    setBuyPrice('61245.00');
    setSellPrice('61245.00');
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

      <TradeContainer>
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
              Trade
            </Typography>
          </motion.div>

          {/* Trading Interface */}
          <Grid container spacing={3}>
            {/* Market Selection */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <TradeCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Select Market
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        <Refresh />
                      </IconButton>
                      <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        <Settings />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
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
                      <Tab label="USDT" />
                      <Tab label="BTC" />
                      <Tab label="ETH" />
                      <Tab label="Favorites" icon={<Star sx={{ fontSize: 16 }} />} iconPosition="end" />
                    </Tabs>
                  </Box>

                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <StyledTextField
                      placeholder="Search"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: <Search sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />,
                      }}
                      sx={{ maxWidth: 300 }}
                    />
                  </Box>

                  {/* Market Pairs Table */}
                  <TableContainer>
                    <Table size="small">
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
                              Pair
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
                              Price
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
                              Change
                            </TableSortLabel>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          { pair: 'BTC/USDT', price: '61,245.32', change: '+2.4%', trending: true },
                          { pair: 'ETH/USDT', price: '3,125.67', change: '+1.8%', trending: true },
                          { pair: 'SOL/USDT', price: '142.89', change: '+5.2%', trending: true },
                          { pair: 'ADA/USDT', price: '0.58', change: '-0.7%', trending: false },
                          { pair: 'DOT/USDT', price: '7.23', change: '+3.1%', trending: true },
                          { pair: 'AVAX/USDT', price: '35.67', change: '+2.9%', trending: true },
                          { pair: 'LINK/USDT', price: '18.45', change: '-1.2%', trending: false },
                          { pair: 'MATIC/USDT', price: '0.89', change: '+0.5%', trending: true },
                        ].map((row) => (
                          <TableRow
                            key={row.pair}
                            hover
                            onClick={() => setTradingPair(row.pair)}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 240, 255, 0.05) !important',
                              },
                              '& .MuiTableCell-root': {
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                              }
                            }}
                          >
                            <TableCell sx={{ color: 'white' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'rgba(0, 240, 255, 0.1)' }}>
                                  {row.pair.split('/')[0].charAt(0)}
                                </Avatar>
                                {row.pair}
                                <IconButton size="small" sx={{ ml: 1 }}>
                                  <StarBorder sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell align="right" sx={{ color: 'white' }}>${row.price}</TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: row.trending ? '#4caf50' : '#f44336',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end'
                              }}
                            >
                              {row.trending ?
                                <ArrowDropUp sx={{ color: '#4caf50' }} /> :
                                <ArrowDropDown sx={{ color: '#f44336' }} />
                              }
                              {row.change}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TradeCard>
              </motion.div>
            </Grid>

            {/* Price Chart */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TradeCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      BTC/USDT
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label="$61,245.32"
                        sx={{
                          bgcolor: 'rgba(0, 240, 255, 0.1)',
                          color: 'white',
                          mr: 1
                        }}
                      />
                      <Chip
                        label="+2.4%"
                        sx={{
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4caf50'
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      {/* Chart Type Selector */}
                      <Button
                        variant={chartType === 'area' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleChartTypeChange('area')}
                        sx={{
                          mr: 1,
                          ...(chartType === 'area' ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        Area
                      </Button>
                      <Button
                        variant={chartType === 'candlestick' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleChartTypeChange('candlestick')}
                        sx={{
                          mr: 1,
                          ...(chartType === 'candlestick' ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        Candlestick
                      </Button>
                      <Button
                        variant={chartType === 'line' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleChartTypeChange('line')}
                        sx={{
                          mr: 1,
                          ...(chartType === 'line' ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        Line
                      </Button>
                    </Box>

                    <Box sx={{ display: 'flex', mb: 1 }}>
                      {/* Timeframe Selector */}
                      <Button
                        variant={timeframe === '1H' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleTimeframeChange('1H')}
                        sx={{
                          mr: 1,
                          ...(timeframe === '1H' ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        1H
                      </Button>
                      <Button
                        variant={timeframe === '1D' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleTimeframeChange('1D')}
                        sx={{
                          mr: 1,
                          ...(timeframe === '1D' ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        1D
                      </Button>
                      <Button
                        variant={timeframe === '1W' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleTimeframeChange('1W')}
                        sx={{
                          mr: 1,
                          ...(timeframe === '1W' ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        1W
                      </Button>
                      <Button
                        variant={timeframe === '1M' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleTimeframeChange('1M')}
                        sx={{
                          mr: 1,
                          ...(timeframe === '1M' ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        1M
                      </Button>
                    </Box>

                    <Box sx={{ display: 'flex', mb: 1 }}>
                      {/* Indicators Selector */}
                      <Button
                        variant={showVolume ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => toggleIndicator('volume')}
                        sx={{
                          mr: 1,
                          ...(showVolume ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        Volume
                      </Button>
                      <Button
                        variant={showRSI ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => toggleIndicator('rsi')}
                        sx={{
                          mr: 1,
                          ...(showRSI ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        RSI
                      </Button>
                      <Button
                        variant={showMACD ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => toggleIndicator('macd')}
                        sx={{
                          mr: 1,
                          ...(showMACD ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        MACD
                      </Button>
                      <Button
                        variant={showMA ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => toggleIndicator('ma')}
                        sx={{
                          mr: 1,
                          ...(showMA ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        MA
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ height: showVolume || showRSI || showMACD ? 500 : 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'area' && (
                        <ComposedChart
                          data={chartData}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="time"
                            tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                          />
                          <YAxis
                            yAxisId="price"
                            domain={['dataMin - 1000', 'dataMax + 1000']}
                            tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                          />
                          {showVolume && (
                            <YAxis
                              yAxisId="volume"
                              orientation="right"
                              domain={[0, 'dataMax + 500']}
                              tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                              tickFormatter={(value) => `${value}`}
                            />
                          )}
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: 'rgba(10, 14, 23, 0.8)',
                              borderColor: 'rgba(0, 240, 255, 0.2)',
                              color: 'white',
                            }}
                            formatter={(value: number, name: string) => {
                              if (name === 'price' || name === 'close') return [`$${value.toLocaleString()}`, 'Price'];
                              if (name === 'volume') return [value, 'Volume'];
                              if (name === 'ma20') return [`$${value.toLocaleString()}`, '20 MA'];
                              if (name === 'ma50') return [`$${value.toLocaleString()}`, '50 MA'];
                              if (name === 'ma200') return [`$${value.toLocaleString()}`, '200 MA'];
                              return [value, name];
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            yAxisId="price"
                            stroke="#00F0FF"
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            strokeWidth={2}
                          />
                          {showMA && (
                            <>
                              <Line
                                type="monotone"
                                dataKey="ma20"
                                yAxisId="price"
                                stroke="#FF9800"
                                dot={false}
                                strokeWidth={1.5}
                              />
                              <Line
                                type="monotone"
                                dataKey="ma50"
                                yAxisId="price"
                                stroke="#E91E63"
                                dot={false}
                                strokeWidth={1.5}
                              />
                              <Line
                                type="monotone"
                                dataKey="ma200"
                                yAxisId="price"
                                stroke="#9C27B0"
                                dot={false}
                                strokeWidth={1.5}
                              />
                            </>
                          )}
                          {showVolume && (
                            <Bar
                              dataKey="volume"
                              yAxisId="volume"
                              fill="url(#colorVolume)"
                              opacity={0.5}
                            />
                          )}
                          <Brush
                            dataKey="time"
                            height={30}
                            stroke="#00F0FF"
                            fill="rgba(10, 14, 23, 0.8)"
                            tickFormatter={() => ''}
                          />
                        </ComposedChart>
                      )}

                      {chartType === 'line' && (
                        <ComposedChart
                          data={chartData}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="time"
                            tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                          />
                          <YAxis
                            yAxisId="price"
                            domain={['dataMin - 1000', 'dataMax + 1000']}
                            tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                          />
                          {showVolume && (
                            <YAxis
                              yAxisId="volume"
                              orientation="right"
                              domain={[0, 'dataMax + 500']}
                              tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                              tickFormatter={(value) => `${value}`}
                            />
                          )}
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: 'rgba(10, 14, 23, 0.8)',
                              borderColor: 'rgba(0, 240, 255, 0.2)',
                              color: 'white',
                            }}
                            formatter={(value: number, name: string) => {
                              if (name === 'price' || name === 'close') return [`$${value.toLocaleString()}`, 'Price'];
                              if (name === 'volume') return [value, 'Volume'];
                              if (name === 'ma20') return [`$${value.toLocaleString()}`, '20 MA'];
                              if (name === 'ma50') return [`$${value.toLocaleString()}`, '50 MA'];
                              if (name === 'ma200') return [`$${value.toLocaleString()}`, '200 MA'];
                              return [value, name];
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            yAxisId="price"
                            stroke="#00F0FF"
                            strokeWidth={2}
                            dot={{ fill: '#00F0FF', r: 4 }}
                            activeDot={{ r: 6, fill: '#00F0FF', stroke: 'white' }}
                          />
                          {showMA && (
                            <>
                              <Line
                                type="monotone"
                                dataKey="ma20"
                                yAxisId="price"
                                stroke="#FF9800"
                                dot={false}
                                strokeWidth={1.5}
                              />
                              <Line
                                type="monotone"
                                dataKey="ma50"
                                yAxisId="price"
                                stroke="#E91E63"
                                dot={false}
                                strokeWidth={1.5}
                              />
                              <Line
                                type="monotone"
                                dataKey="ma200"
                                yAxisId="price"
                                stroke="#9C27B0"
                                dot={false}
                                strokeWidth={1.5}
                              />
                            </>
                          )}
                          {showVolume && (
                            <Bar
                              dataKey="volume"
                              yAxisId="volume"
                              fill="url(#colorVolume)"
                              opacity={0.5}
                            />
                          )}
                          <Brush
                            dataKey="time"
                            height={30}
                            stroke="#00F0FF"
                            fill="rgba(10, 14, 23, 0.8)"
                            tickFormatter={() => ''}
                          />
                        </ComposedChart>
                      )}

                      {chartType === 'candlestick' && (
                        <ComposedChart
                          data={chartData}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="time"
                            tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                          />
                          <YAxis
                            yAxisId="price"
                            domain={['dataMin - 1000', 'dataMax + 1000']}
                            tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                          />
                          {showVolume && (
                            <YAxis
                              yAxisId="volume"
                              orientation="right"
                              domain={[0, 'dataMax + 500']}
                              tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                              tickFormatter={(value) => `${value}`}
                            />
                          )}
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: 'rgba(10, 14, 23, 0.8)',
                              borderColor: 'rgba(0, 240, 255, 0.2)',
                              color: 'white',
                            }}
                            formatter={(value: number, name: string) => {
                              if (name === 'open') return [`$${value.toLocaleString()}`, 'Open'];
                              if (name === 'high') return [`$${value.toLocaleString()}`, 'High'];
                              if (name === 'low') return [`$${value.toLocaleString()}`, 'Low'];
                              if (name === 'close') return [`$${value.toLocaleString()}`, 'Close'];
                              if (name === 'volume') return [value, 'Volume'];
                              if (name === 'ma20') return [`$${value.toLocaleString()}`, '20 MA'];
                              if (name === 'ma50') return [`$${value.toLocaleString()}`, '50 MA'];
                              if (name === 'ma200') return [`$${value.toLocaleString()}`, '200 MA'];
                              return [value, name];
                            }}
                          />
                          {/* Custom implementation of candlestick chart using Bar components */}
                          {chartData.map((entry, index) => {
                            const isIncreasing = entry.close >= entry.open;
                            const color = isIncreasing ? '#4caf50' : '#f44336';

                            return (
                              <g key={`candlestick-${index}`}>
                                {/* High-Low line */}
                                <line
                                  x1={index + 0.5}
                                  x2={index + 0.5}
                                  y1={entry.high}
                                  y2={entry.low}
                                  stroke={color}
                                  strokeWidth={1}
                                />
                                {/* Open-Close body */}
                                <rect
                                  x={index + 0.3}
                                  y={isIncreasing ? entry.open : entry.close}
                                  width={0.4}
                                  height={Math.abs(entry.close - entry.open)}
                                  fill={color}
                                  stroke={color}
                                />
                              </g>
                            );
                          })}
                          {showMA && (
                            <>
                              <Line
                                type="monotone"
                                dataKey="ma20"
                                yAxisId="price"
                                stroke="#FF9800"
                                dot={false}
                                strokeWidth={1.5}
                              />
                              <Line
                                type="monotone"
                                dataKey="ma50"
                                yAxisId="price"
                                stroke="#E91E63"
                                dot={false}
                                strokeWidth={1.5}
                              />
                              <Line
                                type="monotone"
                                dataKey="ma200"
                                yAxisId="price"
                                stroke="#9C27B0"
                                dot={false}
                                strokeWidth={1.5}
                              />
                            </>
                          )}
                          {showVolume && (
                            <Bar
                              dataKey="volume"
                              yAxisId="volume"
                              fill="url(#colorVolume)"
                              opacity={0.5}
                            />
                          )}
                          <Brush
                            dataKey="time"
                            height={30}
                            stroke="#00F0FF"
                            fill="rgba(10, 14, 23, 0.8)"
                            tickFormatter={() => ''}
                          />
                        </ComposedChart>
                      )}
                    </ResponsiveContainer>

                    {/* Technical Indicators */}
                    {showRSI && (
                      <Box sx={{ height: 100, width: '100%', mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                          RSI (14)
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <XAxis dataKey="time" hide />
                            <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255, 255, 255, 0.5)' }} />
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <ReferenceLine y={70} stroke="#f44336" strokeDasharray="3 3" />
                            <ReferenceLine y={30} stroke="#4caf50" strokeDasharray="3 3" />
                            <Line type="monotone" dataKey="rsi" stroke="#FF9800" dot={false} />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: 'rgba(10, 14, 23, 0.8)',
                                borderColor: 'rgba(0, 240, 255, 0.2)',
                                color: 'white',
                              }}
                              formatter={(value: number) => [value, 'RSI']}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </Box>
                    )}

                    {showMACD && (
                      <Box sx={{ height: 100, width: '100%', mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                          MACD (12,26,9)
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <XAxis dataKey="time" hide />
                            <YAxis tick={{ fill: 'rgba(255, 255, 255, 0.5)' }} />
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.3)" />
                            <Bar dataKey="histogram" fill="#8884d8" />
                            <Line type="monotone" dataKey="macd" stroke="#00F0FF" dot={false} />
                            <Line type="monotone" dataKey="signal" stroke="#FF9800" dot={false} />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: 'rgba(10, 14, 23, 0.8)',
                                borderColor: 'rgba(0, 240, 255, 0.2)',
                                color: 'white',
                              }}
                              formatter={(value: number, name: string) => {
                                if (name === 'macd') return [value, 'MACD'];
                                if (name === 'signal') return [value, 'Signal'];
                                if (name === 'histogram') return [value, 'Histogram'];
                                return [value, name];
                              }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                  </Box>
                </TradeCard>
              </motion.div>
            </Grid>

            {/* Order Form */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TradeCard>
                  <Box sx={{ mb: 2 }}>
                    <Tabs
                      value={orderFormTab}
                      onChange={handleOrderFormTabChange}
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
                      <Tab label="Buy" />
                      <Tab label="Sell" />
                    </Tabs>
                  </Box>

                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <ButtonGroup size="small" sx={{ '& .MuiButton-root': { minWidth: '80px' } }}>
                      <Button
                        variant={orderType === 'market' ? 'contained' : 'outlined'}
                        onClick={() => handleOrderTypeChange('market')}
                        sx={{
                          ...(orderType === 'market' ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        Market
                      </Button>
                      <Button
                        variant={orderType === 'limit' ? 'contained' : 'outlined'}
                        onClick={() => handleOrderTypeChange('limit')}
                        sx={{
                          ...(orderType === 'limit' ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        Limit
                      </Button>
                      <Button
                        variant={orderType === 'stop' ? 'contained' : 'outlined'}
                        onClick={() => handleOrderTypeChange('stop')}
                        sx={{
                          ...(orderType === 'stop' ? {
                            bgcolor: 'rgba(0, 240, 255, 0.2)',
                            color: '#00F0FF',
                            '&:hover': {
                              bgcolor: 'rgba(0, 240, 255, 0.3)',
                            }
                          } : {
                            borderColor: 'rgba(0, 240, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(0, 240, 255, 0.5)',
                              background: 'rgba(0, 240, 255, 0.1)',
                            }
                          })
                        }}
                      >
                        Stop
                      </Button>
                    </ButtonGroup>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                      Price
                    </Typography>
                    <StyledTextField
                      fullWidth
                      placeholder="0.00"
                      variant="outlined"
                      size="small"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      InputProps={{
                        endAdornment: <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>USDT</Typography>,
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                      Amount
                    </Typography>
                    <StyledTextField
                      fullWidth
                      placeholder="0.00"
                      variant="outlined"
                      size="small"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      InputProps={{
                        endAdornment: <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>BTC</Typography>,
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                      Total
                    </Typography>
                    <StyledTextField
                      fullWidth
                      placeholder="0.00"
                      variant="outlined"
                      size="small"
                      disabled
                      value={buyPrice && buyAmount ? (parseFloat(buyPrice) * parseFloat(buyAmount)).toFixed(2) : ''}
                      InputProps={{
                        endAdornment: <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>USDT</Typography>,
                      }}
                    />
                  </Box>

                  {orderType === 'stop' && (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                          Stop Price
                        </Typography>
                        <StyledTextField
                          fullWidth
                          placeholder="0.00"
                          variant="outlined"
                          size="small"
                          value={stopPrice}
                          onChange={(e) => setStopPrice(e.target.value)}
                          InputProps={{
                            endAdornment: <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>USDT</Typography>,
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                          Take Profit
                        </Typography>
                        <StyledTextField
                          fullWidth
                          placeholder="0.00"
                          variant="outlined"
                          size="small"
                          value={takeProfitPrice}
                          onChange={(e) => setTakeProfitPrice(e.target.value)}
                          InputProps={{
                            endAdornment: <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>USDT</Typography>,
                          }}
                        />
                      </Box>
                    </>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Available: 12,450.75 USDT
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#00F0FF' }}>
                      Max
                    </Typography>
                  </Box>

                  <GradientButton
                    fullWidth
                    size="large"
                    onClick={handleBuy}
                    sx={{ height: 50, fontSize: '1rem' }}
                  >
                    {orderType === 'market' && 'Buy BTC'}
                    {orderType === 'limit' && 'Place Limit Order'}
                    {orderType === 'stop' && 'Place Stop Order'}
                  </GradientButton>
                </TradeCard>
              </motion.div>
            </Grid>

            {/* Order Book and Recent Trades */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <TradeCard>
                  <Grid container spacing={2}>
                    {/* Order Book */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Order Book
                        </Typography>
                        <Button
                          variant={showDepthChart ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => setShowDepthChart(!showDepthChart)}
                          sx={{
                            ...(showDepthChart ? {
                              bgcolor: 'rgba(0, 240, 255, 0.2)',
                              color: '#00F0FF',
                              '&:hover': {
                                bgcolor: 'rgba(0, 240, 255, 0.3)',
                              }
                            } : {
                              borderColor: 'rgba(0, 240, 255, 0.3)',
                              color: 'white',
                              '&:hover': {
                                borderColor: 'rgba(0, 240, 255, 0.5)',
                                background: 'rgba(0, 240, 255, 0.1)',
                              }
                            })
                          }}
                        >
                          {showDepthChart ? 'Hide Depth' : 'Show Depth'}
                        </Button>
                      </Box>

                      {showDepthChart && (
                        <Box sx={{ height: 200, mb: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                              data={[...bids.map(bid => ({ price: parseFloat(bid.price), amount: parseFloat(bid.amount), type: 'bid' })), ...asks.map(ask => ({ price: parseFloat(ask.price), amount: parseFloat(ask.amount), type: 'ask' }))].sort((a, b) => a.price - b.price)}
                              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                            >
                              <XAxis
                                dataKey="price"
                                domain={['dataMin', 'dataMax']}
                                tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                              />
                              <YAxis
                                tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                              />
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                              <RechartsTooltip
                                contentStyle={{
                                  backgroundColor: 'rgba(10, 14, 23, 0.8)',
                                  borderColor: 'rgba(0, 240, 255, 0.2)',
                                  color: 'white',
                                }}
                                formatter={(value: number, name: string, props: any) => {
                                  const { payload } = props;
                                  return [`$${payload.price.toLocaleString()}`, payload.type === 'bid' ? 'Bid' : 'Ask'];
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="amount"
                                fill="rgba(76, 175, 80, 0.3)"
                                stroke="#4caf50"
                                fillOpacity={1}
                                name="bid"
                                activeDot={{ r: 6 }}
                              />
                              <Area
                                type="monotone"
                                dataKey="amount"
                                fill="rgba(244, 67, 54, 0.3)"
                                stroke="#f44336"
                                fillOpacity={1}
                                name="ask"
                                activeDot={{ r: 6 }}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </Box>
                      )}

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', pb: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ flex: 1, color: 'rgba(255, 255, 255, 0.5)' }}>Price (USDT)</Typography>
                          <Typography variant="body2" sx={{ flex: 1, color: 'rgba(255, 255, 255, 0.5)', textAlign: 'right' }}>Amount (BTC)</Typography>
                          <Typography variant="body2" sx={{ flex: 1, color: 'rgba(255, 255, 255, 0.5)', textAlign: 'right' }}>Total (USDT)</Typography>
                        </Box>

                        {/* Asks (Sell Orders) */}
                        <Box sx={{ mb: 1, maxHeight: '200px', overflow: 'auto' }}>
                          {asks.map((ask, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                py: 0.5,
                                position: 'relative',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  right: 0,
                                  top: 0,
                                  bottom: 0,
                                  width: `${Math.min(100, parseFloat(ask.amount) * 50)}%`,
                                  background: 'rgba(244, 67, 54, 0.1)',
                                  zIndex: 0,
                                }
                              }}
                            >
                              <Typography variant="body2" sx={{ flex: 1, color: '#f44336', position: 'relative', zIndex: 1 }}>${ask.price}</Typography>
                              <Typography variant="body2" sx={{ flex: 1, textAlign: 'right', position: 'relative', zIndex: 1 }}>{ask.amount}</Typography>
                              <Typography variant="body2" sx={{ flex: 1, textAlign: 'right', position: 'relative', zIndex: 1 }}>${ask.total}</Typography>
                            </Box>
                          ))}
                        </Box>

                        {/* Current Price */}
                        <Box
                          sx={{
                            display: 'flex',
                            py: 0.5,
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              flex: 1,
                              fontWeight: 'bold',
                              color: '#00F0FF',
                            }}
                          >
                            $61,245.32
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#4caf50',
                            }}
                          >
                            +2.4%
                          </Typography>
                        </Box>

                        {/* Bids (Buy Orders) */}
                        <Box sx={{ mt: 1, maxHeight: '200px', overflow: 'auto' }}>
                          {bids.map((bid, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                py: 0.5,
                                position: 'relative',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  right: 0,
                                  top: 0,
                                  bottom: 0,
                                  width: `${Math.min(100, parseFloat(bid.amount) * 50)}%`,
                                  background: 'rgba(76, 175, 80, 0.1)',
                                  zIndex: 0,
                                }
                              }}
                            >
                              <Typography variant="body2" sx={{ flex: 1, color: '#4caf50', position: 'relative', zIndex: 1 }}>${bid.price}</Typography>
                              <Typography variant="body2" sx={{ flex: 1, textAlign: 'right', position: 'relative', zIndex: 1 }}>{bid.amount}</Typography>
                              <Typography variant="body2" sx={{ flex: 1, textAlign: 'right', position: 'relative', zIndex: 1 }}>${bid.total}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>

                    {/* Recent Trades */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Recent Trades
                        </Typography>
                        <ButtonGroup size="small" sx={{ '& .MuiButton-root': { minWidth: '60px' } }}>
                          <Button
                            variant={tradeHistoryFilter === 'all' ? 'contained' : 'outlined'}
                            onClick={() => handleTradeHistoryFilterChange('all')}
                            sx={{
                              ...(tradeHistoryFilter === 'all' ? {
                                bgcolor: 'rgba(0, 240, 255, 0.2)',
                                color: '#00F0FF',
                                '&:hover': {
                                  bgcolor: 'rgba(0, 240, 255, 0.3)',
                                }
                              } : {
                                borderColor: 'rgba(0, 240, 255, 0.3)',
                                color: 'white',
                                '&:hover': {
                                  borderColor: 'rgba(0, 240, 255, 0.5)',
                                  background: 'rgba(0, 240, 255, 0.1)',
                                }
                              })
                            }}
                          >
                            All
                          </Button>
                          <Button
                            variant={tradeHistoryFilter === 'buy' ? 'contained' : 'outlined'}
                            onClick={() => handleTradeHistoryFilterChange('buy')}
                            sx={{
                              ...(tradeHistoryFilter === 'buy' ? {
                                bgcolor: 'rgba(76, 175, 80, 0.2)',
                                color: '#4caf50',
                                '&:hover': {
                                  bgcolor: 'rgba(76, 175, 80, 0.3)',
                                }
                              } : {
                                borderColor: 'rgba(0, 240, 255, 0.3)',
                                color: 'white',
                                '&:hover': {
                                  borderColor: 'rgba(0, 240, 255, 0.5)',
                                  background: 'rgba(0, 240, 255, 0.1)',
                                }
                              })
                            }}
                          >
                            Buy
                          </Button>
                          <Button
                            variant={tradeHistoryFilter === 'sell' ? 'contained' : 'outlined'}
                            onClick={() => handleTradeHistoryFilterChange('sell')}
                            sx={{
                              ...(tradeHistoryFilter === 'sell' ? {
                                bgcolor: 'rgba(244, 67, 54, 0.2)',
                                color: '#f44336',
                                '&:hover': {
                                  bgcolor: 'rgba(244, 67, 54, 0.3)',
                                }
                              } : {
                                borderColor: 'rgba(0, 240, 255, 0.3)',
                                color: 'white',
                                '&:hover': {
                                  borderColor: 'rgba(0, 240, 255, 0.5)',
                                  background: 'rgba(0, 240, 255, 0.1)',
                                }
                              })
                            }}
                          >
                            Sell
                          </Button>
                        </ButtonGroup>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', pb: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ flex: 1, color: 'rgba(255, 255, 255, 0.5)' }}>Price (USDT)</Typography>
                          <Typography variant="body2" sx={{ flex: 1, color: 'rgba(255, 255, 255, 0.5)', textAlign: 'right' }}>Amount (BTC)</Typography>
                          <Typography variant="body2" sx={{ flex: 1, color: 'rgba(255, 255, 255, 0.5)', textAlign: 'right' }}>Time</Typography>
                        </Box>

                        <Box sx={{ maxHeight: '350px', overflow: 'auto' }}>
                          {tradeHistory
                            .filter(trade => tradeHistoryFilter === 'all' || trade.type === tradeHistoryFilter)
                            .slice(tradeHistoryPage * tradeHistoryRowsPerPage, tradeHistoryPage * tradeHistoryRowsPerPage + tradeHistoryRowsPerPage)
                            .map((trade, index) => (
                              <Box
                                key={index}
                                sx={{
                                  display: 'flex',
                                  py: 0.5,
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 240, 255, 0.05)'
                                  }
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    flex: 1,
                                    color: trade.type === 'buy' ? '#4caf50' : '#f44336',
                                  }}
                                >
                                  ${trade.price}
                                </Typography>
                                <Typography variant="body2" sx={{ flex: 1, textAlign: 'right' }}>{trade.amount}</Typography>
                                <Typography variant="body2" sx={{ flex: 1, textAlign: 'right', color: 'rgba(255, 255, 255, 0.5)' }}>{trade.time}</Typography>
                              </Box>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <TablePagination
                            component="div"
                            count={tradeHistory.filter(trade => tradeHistoryFilter === 'all' || trade.type === tradeHistoryFilter).length}
                            page={tradeHistoryPage}
                            onPageChange={handleTradeHistoryPageChange}
                            rowsPerPage={tradeHistoryRowsPerPage}
                            onRowsPerPageChange={handleTradeHistoryRowsPerPageChange}
                            rowsPerPageOptions={[5, 10, 25]}
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              '.MuiTablePagination-selectIcon': {
                                color: 'rgba(255, 255, 255, 0.7)'
                              },
                              '.MuiTablePagination-select': {
                                color: 'rgba(255, 255, 255, 0.7)'
                              },
                              '.MuiTablePagination-selectLabel': {
                                color: 'rgba(255, 255, 255, 0.7)'
                              },
                              '.MuiTablePagination-displayedRows': {
                                color: 'rgba(255, 255, 255, 0.7)'
                              },
                              '.MuiTablePagination-actions': {
                                color: 'rgba(255, 255, 255, 0.7)'
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </TradeCard>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </TradeContainer>
    </Box>
  );
}