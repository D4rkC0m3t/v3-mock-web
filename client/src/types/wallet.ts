// Wallet types and interfaces

import { NetworkType, WalletType } from '../utils/walletConnector';

// Interface for wallet asset
export interface WalletAsset {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change: string;
  icon: string;
  network: NetworkType;
}

// Interface for wallet transaction
export interface WalletTransaction {
  type: 'deposit' | 'withdraw' | 'swap' | 'stake' | 'unstake' | 'reward';
  asset: string;
  amount: string;
  value: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
  network: NetworkType;
}

// Interface for wallet connection state
export interface WalletState {
  isConnected: boolean;
  address: string;
  type: WalletType | null;
  network: NetworkType;
  provider?: string;
  balance?: string;
  isLoading: boolean;
  error: string | null;
}

// Interface for token swap
export interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: string;
  slippage: number;
  network: NetworkType;
}

// Interface for token swap quote
export interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  fee: string;
  estimatedGas: string;
  minReceived: string;
  priceImpact: string;
}
