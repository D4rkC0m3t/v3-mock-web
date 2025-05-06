import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Alert,
  Divider
} from '@mui/material';
import { Close, SwapVert } from '@mui/icons-material';
import { NetworkType, getSwapQuote, executeSwap } from '../utils/walletConnector';
import { WalletAsset } from '../types/wallet';

interface SimpleSwapTokenModalProps {
  open: boolean;
  onClose: () => void;
  assets: WalletAsset[];
  network: NetworkType;
  onSwapComplete: (txHash: string) => void;
}

const SimpleSwapTokenModal: React.FC<SimpleSwapTokenModalProps> = ({
  open,
  onClose,
  assets,
  network,
  onSwapComplete
}) => {
  // State for form values
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  
  // State for form validation
  const [amountError, setAmountError] = useState('');
  
  // State for swap quote
  const [quote, setQuote] = useState<any | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  
  // State for swap execution
  const [isExecutingSwap, setIsExecutingSwap] = useState<boolean>(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  // Set initial tokens when assets change
  useEffect(() => {
    if (assets.length > 0) {
      if (!fromToken) {
        setFromToken(assets[0].symbol);
      }
      if (!toToken && assets.length > 1) {
        setToToken(assets[1].symbol);
      } else if (!toToken && assets.length === 1) {
        // If only one asset, default toToken to something else
        const prefix = network === 'testnet' ? 't' : '';
        setToToken(fromToken === `${prefix}ETH` ? `${prefix}BTC` : `${prefix}ETH`);
      }
    }
  }, [assets, network, fromToken, toToken]);
  
  // Reset form
  const resetForm = () => {
    setAmount('');
    setQuote(null);
    setIsLoadingQuote(false);
    setQuoteError(null);
    setIsExecutingSwap(false);
    setSwapError(null);
    setTransactionHash('');
    setIsComplete(false);
    
    // Don't reset tokens to preserve user's last selection
    if (assets.length > 0 && !fromToken) {
      setFromToken(assets[0].symbol);
    }
    if (assets.length > 1 && !toToken) {
      setToToken(assets[1].symbol);
    }
  };
  
  // Handle close
  const handleClose = () => {
    if (!isExecutingSwap && !isLoadingQuote) {
      resetForm();
      onClose();
    }
  };
  
  // Validate amount
  const validateAmount = () => {
    if (!amount) {
      setAmountError('Amount is required');
      return false;
    }
    
    const numAmount = parseFloat(amount);
    const fromAsset = assets.find(asset => asset.symbol === fromToken);
    
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
      setToToken(fromToken);
    }
    
    setFromToken(newFromToken);
    setQuote(null);
  };
  
  // Handle to token change
  const handleToTokenChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newToToken = event.target.value as string;
    
    // If new toToken is the same as fromToken, swap them
    if (newToToken === fromToken) {
      setFromToken(toToken);
    }
    
    setToToken(newToToken);
    setQuote(null);
  };
  
  // Handle amount change
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
    setQuote(null);
  };
  
  // Handle max amount
  const handleMaxAmount = () => {
    const fromAsset = assets.find(asset => asset.symbol === fromToken);
    if (fromAsset) {
      setAmount(fromAsset.balance);
      setQuote(null);
    }
  };
  
  // Handle swap tokens
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setQuote(null);
  };
  
  // Handle get quote
  const handleGetQuote = async () => {
    if (!validateAmount()) return;
    
    setIsLoadingQuote(true);
    setQuoteError(null);
    
    try {
      const swapQuote = await getSwapQuote(fromToken, toToken, amount, network);
      setQuote(swapQuote);
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : 'Failed to get swap quote');
    } finally {
      setIsLoadingQuote(false);
    }
  };
  
  // Handle execute swap
  const handleExecuteSwap = async () => {
    if (!fromToken || !toToken || !amount || !quote) return;
    
    setIsExecutingSwap(true);
    setSwapError(null);
    
    try {
      const txHash = await executeSwap(fromToken, toToken, amount, 0.5, network);
      setTransactionHash(txHash);
      setIsComplete(true);
      onSwapComplete(txHash);
    } catch (error) {
      setSwapError(error instanceof Error ? error.message : 'Swap failed');
    } finally {
      setIsExecutingSwap(false);
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: '#0A0E17',
          borderRadius: '16px',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 2
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          {isComplete ? 'Swap Complete' : 'Swap Tokens'}
        </Typography>
        <IconButton 
          onClick={handleClose} 
          disabled={isExecutingSwap || isLoadingQuote}
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {!isComplete ? (
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
                        <Button 
                          variant="text" 
                          onClick={handleMaxAmount}
                          sx={{ 
                            color: 'rgba(0, 240, 255, 0.7)',
                            '&:hover': { color: '#00F0FF' }
                          }}
                        >
                          MAX
                        </Button>
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
                    Balance: {assets.find(a => a.symbol === fromToken)?.balance || '0'} {fromToken}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Swap Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <IconButton 
                onClick={handleSwapTokens}
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
                  ) : quote ? (
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {quote.toAmount} {toToken}
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {amount ? 'Click "Get Quote" to see the estimated amount' : 'Enter an amount to see the estimated exchange rate'}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
            
            {/* Quote Details */}
            {quote && (
              <Box sx={{ 
                p: 2, 
                borderRadius: '8px', 
                bgcolor: 'rgba(0, 240, 255, 0.1)', 
                border: '1px solid rgba(0, 240, 255, 0.2)',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Exchange Rate
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    1 {fromToken} = {parseFloat(quote.exchangeRate).toFixed(6)} {toToken}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Minimum Received
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {quote.minReceived} {toToken}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Fee
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {quote.fee} {fromToken}
                  </Typography>
                </Box>
              </Box>
            )}
            
            {/* Error Messages */}
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
            
            {swapError && (
              <Alert severity="error" sx={{ 
                mb: 3, 
                backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                color: 'white',
                border: '1px solid rgba(255, 0, 0, 0.3)'
              }}>
                {swapError}
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
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Swap Submitted
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              Your swap from {amount} {fromToken} to approximately {quote?.toAmount} {toToken} has been submitted to the network and is waiting for confirmation.
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              borderRadius: '8px', 
              bgcolor: 'rgba(0, 240, 255, 0.1)', 
              border: '1px solid rgba(0, 240, 255, 0.2)',
              mb: 3
            }}>
              <Typography variant="body2" sx={{ color: 'white', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {transactionHash}
              </Typography>
            </Box>
            
            <Alert severity="info" sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(0, 240, 255, 0.1)', 
              color: 'white',
              border: '1px solid rgba(0, 240, 255, 0.3)'
            }}>
              It may take a few minutes for the transaction to be confirmed on the blockchain.
            </Alert>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {!isComplete ? (
          <>
            <Button 
              onClick={handleClose}
              disabled={isExecutingSwap || isLoadingQuote}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Cancel
            </Button>
            
            {!quote ? (
              <Button 
                variant="contained"
                onClick={handleGetQuote}
                disabled={!fromToken || !toToken || !amount || isLoadingQuote}
                startIcon={isLoadingQuote ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2CF6FF, #0080FF)',
                  }
                }}
              >
                {isLoadingQuote ? 'Loading...' : 'Get Quote'}
              </Button>
            ) : (
              <Button 
                variant="contained"
                onClick={handleExecuteSwap}
                disabled={isExecutingSwap}
                startIcon={isExecutingSwap ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2CF6FF, #0080FF)',
                  }
                }}
              >
                {isExecutingSwap ? 'Processing...' : 'Swap Now'}
              </Button>
            )}
          </>
        ) : (
          <Button 
            variant="contained"
            onClick={handleClose}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #2CF6FF, #0080FF)',
              }
            }}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SimpleSwapTokenModal;
