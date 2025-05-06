import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Slider,
  FormHelperText,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  SwapVert,
  Info
} from '@mui/icons-material';
import { NetworkType } from '../../utils/walletConnector';
import { WalletAsset } from '../../types/wallet';

interface SwapFormProps {
  assets: WalletAsset[];
  network: NetworkType;
  fromToken: string;
  toToken: string;
  amount: string;
  slippage: number;
  isLoadingQuote: boolean;
  quoteError: string | null;
  onFromTokenChange: (token: string) => void;
  onToTokenChange: (token: string) => void;
  onAmountChange: (amount: string) => void;
  onSlippageChange: (slippage: number) => void;
  onSwapTokens: () => void;
}

const SwapForm: React.FC<SwapFormProps> = ({
  assets,
  network,
  fromToken,
  toToken,
  amount,
  slippage,
  isLoadingQuote,
  quoteError,
  onFromTokenChange,
  onToTokenChange,
  onAmountChange,
  onSlippageChange,
  onSwapTokens
}) => {
  // State for form validation
  const [amountError, setAmountError] = useState<string>('');
  
  // Get asset by symbol
  const getAssetBySymbol = (symbol: string) => {
    return assets.find(asset => asset.symbol === symbol);
  };
  
  // Get from asset
  const fromAsset = getAssetBySymbol(fromToken);
  
  // Validate amount when it changes
  useEffect(() => {
    validateAmount(amount);
  }, [amount, fromToken]);
  
  // Validate amount
  const validateAmount = (value: string) => {
    if (!value) {
      setAmountError('Amount is required');
      return false;
    }
    
    const numAmount = parseFloat(value);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError('Amount must be greater than 0');
      return false;
    }
    
    if (fromAsset && numAmount > parseFloat(fromAsset.balance)) {
      setAmountError('Insufficient balance');
      return false;
    }
    
    setAmountError('');
    return true;
  };
  
  // Handle from token change
  const handleFromTokenChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newFromToken = event.target.value as string;
    
    // If new fromToken is the same as toToken, swap them
    if (newFromToken === toToken) {
      onToTokenChange(fromToken);
    }
    
    onFromTokenChange(newFromToken);
  };
  
  // Handle to token change
  const handleToTokenChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newToToken = event.target.value as string;
    
    // If new toToken is the same as fromToken, swap them
    if (newToToken === fromToken) {
      onFromTokenChange(toToken);
    }
    
    onToTokenChange(newToToken);
  };
  
  // Handle amount change
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAmountChange(event.target.value);
  };
  
  // Handle max amount
  const handleMaxAmount = () => {
    if (fromAsset) {
      onAmountChange(fromAsset.balance);
    }
  };
  
  // Handle slippage change
  const handleSlippageChange = (event: Event, newValue: number | number[]) => {
    onSlippageChange(newValue as number);
  };
  
  // Handle custom slippage
  const handleCustomSlippage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0.1 && value <= 5) {
      onSlippageChange(value);
    }
  };
  
  return (
    <Box>
      {/* From Token */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
          From
        </Typography>
        <Box sx={{ 
          p: 2, 
          borderRadius: '12px', 
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <FormControl sx={{ width: '48%' }}>
              <InputLabel id="from-token-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Token
              </InputLabel>
              <Select
                labelId="from-token-label"
                value={fromToken}
                onChange={handleFromTokenChange}
                label="Token"
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 240, 255, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 240, 255, 0.5)',
                  },
                  '.MuiSvgIcon-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  }
                }}
              >
                {assets.map((asset) => (
                  <MenuItem key={asset.symbol} value={asset.symbol}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{asset.symbol}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Amount"
              value={amount}
              onChange={handleAmountChange}
              error={!!amountError}
              helperText={amountError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        cursor: 'pointer', 
                        color: 'rgba(0, 240, 255, 0.7)',
                        '&:hover': { color: '#00F0FF' }
                      }}
                      onClick={handleMaxAmount}
                    >
                      MAX
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '48%',
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 240, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(0, 240, 255, 0.5)',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#FF5252',
                }
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Balance: {fromAsset ? fromAsset.balance : '0'} {fromToken}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              ≈ {fromAsset ? fromAsset.value : '$0.00'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Swap Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <IconButton 
          onClick={onSwapTokens}
          sx={{ 
            bgcolor: 'rgba(0, 240, 255, 0.1)', 
            border: '1px solid rgba(0, 240, 255, 0.2)',
            '&:hover': {
              bgcolor: 'rgba(0, 240, 255, 0.2)',
            }
          }}
        >
          <SwapVert sx={{ color: '#00F0FF' }} />
        </IconButton>
      </Box>
      
      {/* To Token */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
          To
        </Typography>
        <Box sx={{ 
          p: 2, 
          borderRadius: '12px', 
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="to-token-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Token
            </InputLabel>
            <Select
              labelId="to-token-label"
              value={toToken}
              onChange={handleToTokenChange}
              label="Token"
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 240, 255, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 240, 255, 0.5)',
                },
                '.MuiSvgIcon-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            >
              {/* Include all tokens except the fromToken */}
              {assets
                .filter(asset => asset.symbol !== fromToken)
                .map((asset) => (
                  <MenuItem key={asset.symbol} value={asset.symbol}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{asset.symbol}</Typography>
                    </Box>
                  </MenuItem>
                ))
              }
              {/* Add other common tokens that might not be in assets */}
              {network === 'testnet' ? (
                ['tBTC', 'tETH', 'tUSDT', 'tSOL', 'tADA', 'tDOT']
                  .filter(symbol => !assets.some(asset => asset.symbol === symbol) && symbol !== fromToken)
                  .map(symbol => (
                    <MenuItem key={symbol} value={symbol}>
                      <Typography>{symbol}</Typography>
                    </MenuItem>
                  ))
              ) : (
                ['BTC', 'ETH', 'USDT', 'SOL', 'ADA', 'DOT']
                  .filter(symbol => !assets.some(asset => asset.symbol === symbol) && symbol !== fromToken)
                  .map(symbol => (
                    <MenuItem key={symbol} value={symbol}>
                      <Typography>{symbol}</Typography>
                    </MenuItem>
                  ))
              )}
            </Select>
          </FormControl>
          
          <Box sx={{ 
            p: 2, 
            borderRadius: '8px', 
            bgcolor: 'rgba(0, 240, 255, 0.05)', 
            border: '1px solid rgba(0, 240, 255, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {isLoadingQuote ? (
              <CircularProgress size={24} sx={{ color: '#00F0FF' }} />
            ) : (
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Enter an amount to see the estimated exchange rate
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      
      {/* Slippage Tolerance */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Slippage Tolerance
          </Typography>
          <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.5)', ml: 0.5 }}>
            <Info fontSize="small" />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Slider
            value={slippage}
            onChange={handleSlippageChange}
            min={0.1}
            max={5}
            step={0.1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
            sx={{
              color: '#00F0FF',
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(0, 240, 255, 0.16)',
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          />
          
          <TextField
            value={slippage}
            onChange={handleCustomSlippage}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            inputProps={{
              min: 0.1,
              max: 5,
              step: 0.1,
            }}
            sx={{
              width: '100px',
              '& .MuiInputBase-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
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
        </Box>
      </Box>
      
      {/* Error Message */}
      {quoteError && (
        <Alert severity="error" sx={{ 
          mb: 3, 
          backgroundColor: 'rgba(255, 0, 0, 0.1)', 
          color: 'white',
          border: '1px solid rgba(255, 0, 0, 0.3)'
        }}>
          {quoteError}
        </Alert>
      )}
      
      {/* Network Info */}
      <Alert severity="info" sx={{ 
        mb: 3, 
        backgroundColor: 'rgba(0, 240, 255, 0.1)', 
        color: 'white',
        border: '1px solid rgba(0, 240, 255, 0.3)'
      }}>
        Swapping on {network === 'mainnet' ? 'Ethereum Mainnet' : 'Sepolia Testnet'}. Make sure you have enough ETH for gas fees.
      </Alert>
    </Box>
  );
};

export default SwapForm;
