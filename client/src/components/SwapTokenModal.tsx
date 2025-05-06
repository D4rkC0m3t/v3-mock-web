import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { NetworkType, getSwapQuote, executeSwap } from '../utils/walletConnector';
import { WalletAsset, SwapQuote } from '../types/wallet';
import SwapForm from './swap/SwapForm';
import SwapReview from './swap/SwapReview';
import SwapComplete from './swap/SwapComplete';

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

// Steps for the swap process
enum SwapStep {
  FORM,
  REVIEW,
  COMPLETE
}

interface SwapTokenModalProps {
  open: boolean;
  onClose: () => void;
  assets: WalletAsset[];
  network: NetworkType;
  onSwapComplete: (txHash: string) => void;
}

const SwapTokenModal: React.FC<SwapTokenModalProps> = ({
  open,
  onClose,
  assets,
  network,
  onSwapComplete
}) => {
  // State for swap steps
  const [activeStep, setActiveStep] = useState<SwapStep>(SwapStep.FORM);

  // State for form values
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(0.5);

  // State for swap quote
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // State for swap execution
  const [isExecutingSwap, setIsExecutingSwap] = useState<boolean>(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string>('');

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

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
  }, [assets, network]);

  // Reset form
  const resetForm = () => {
    setActiveStep(SwapStep.FORM);
    setAmount('');
    setSlippage(0.5);
    setQuote(null);
    setIsLoadingQuote(false);
    setQuoteError(null);
    setIsExecutingSwap(false);
    setSwapError(null);
    setTransactionHash('');

    // Don't reset tokens to preserve user's last selection
    if (assets.length > 0 && !fromToken) {
      setFromToken(assets[0].symbol);
    }
    if (assets.length > 1 && !toToken) {
      setToToken(assets[1].symbol);
    }
  };

  // Get step title
  const getStepTitle = () => {
    switch (activeStep) {
      case SwapStep.FORM:
        return 'Swap Tokens';
      case SwapStep.REVIEW:
        return 'Review Swap';
      case SwapStep.COMPLETE:
        return 'Swap Complete';
      default:
        return 'Swap Tokens';
    }
  };

  // Handle close
  const handleClose = () => {
    if (!isExecutingSwap && !isLoadingQuote) {
      resetForm();
      onClose();
    }
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    if (!fromToken || !toToken || !amount) return;

    setIsLoadingQuote(true);
    setQuoteError(null);

    try {
      const swapQuote = await getSwapQuote(fromToken, toToken, amount, network);
      setQuote(swapQuote);
      setActiveStep(SwapStep.REVIEW);
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : 'Failed to get swap quote');
    } finally {
      setIsLoadingQuote(false);
    }
  };

  // Handle swap execution
  const handleExecuteSwap = async () => {
    if (!fromToken || !toToken || !amount || !quote) return;

    setIsExecutingSwap(true);
    setSwapError(null);

    try {
      const txHash = await executeSwap(fromToken, toToken, amount, slippage, network);
      setTransactionHash(txHash);
      setActiveStep(SwapStep.COMPLETE);
      onSwapComplete(txHash);
    } catch (error) {
      setSwapError(error instanceof Error ? error.message : 'Swap failed');
    } finally {
      setIsExecutingSwap(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (activeStep === SwapStep.REVIEW) {
      setActiveStep(SwapStep.FORM);
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
          {getStepTitle()}
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
        <Stepper activeStep={activeStep} alternativeLabel sx={{
          mb: 4,
          '.MuiStepLabel-label': { color: 'white' },
          '.MuiStepIcon-root': { color: 'rgba(0, 240, 255, 0.7)' },
          '.MuiStepIcon-text': { fill: '#000' },
          '.MuiStepConnector-line': { borderColor: 'rgba(0, 240, 255, 0.3)' }
        }}>
          <Step>
            <StepLabel>Enter Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Review Swap</StepLabel>
          </Step>
          <Step>
            <StepLabel>Complete</StepLabel>
          </Step>
        </Stepper>

        {activeStep === SwapStep.FORM && (
          <SwapForm
            assets={assets}
            network={network}
            fromToken={fromToken}
            toToken={toToken}
            amount={amount}
            slippage={slippage}
            isLoadingQuote={isLoadingQuote}
            quoteError={quoteError}
            onFromTokenChange={setFromToken}
            onToTokenChange={setToToken}
            onAmountChange={setAmount}
            onSlippageChange={setSlippage}
            onSwapTokens={() => {
              setFromToken(toToken);
              setToToken(fromToken);
            }}
          />
        )}

        {activeStep === SwapStep.REVIEW && quote && (
          <SwapReview
            quote={quote}
            slippage={slippage}
            network={network}
            isExecutingSwap={isExecutingSwap}
            swapError={swapError}
          />
        )}

        {activeStep === SwapStep.COMPLETE && (
          <SwapComplete
            transactionHash={transactionHash}
            network={network}
            fromToken={fromToken}
            toToken={toToken}
            fromAmount={amount}
            toAmount={quote?.toAmount || ''}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {activeStep === SwapStep.FORM && (
          <>
            <Button
              onClick={handleClose}
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
            <GradientButton
              onClick={handleFormSubmit}
              disabled={!fromToken || !toToken || !amount || isLoadingQuote}
              startIcon={isLoadingQuote ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoadingQuote ? 'Getting Quote...' : 'Review Swap'}
            </GradientButton>
          </>
        )}

        {activeStep === SwapStep.REVIEW && (
          <>
            <Button
              onClick={handleBack}
              disabled={isExecutingSwap}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Back
            </Button>
            <GradientButton
              onClick={handleExecuteSwap}
              disabled={isExecutingSwap}
              startIcon={isExecutingSwap ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isExecutingSwap ? 'Processing...' : 'Confirm Swap'}
            </GradientButton>
          </>
        )}

        {activeStep === SwapStep.COMPLETE && (
          <GradientButton onClick={handleClose} fullWidth>
            Close
          </GradientButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SwapTokenModal;
