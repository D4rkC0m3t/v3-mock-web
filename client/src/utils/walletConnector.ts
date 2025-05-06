// Wallet connection utility functions

// Supported wallet types
export type WalletType = 'hot' | 'cold';

// Supported networks
export type NetworkType = 'mainnet' | 'testnet';

// Wallet provider types
export type HotWalletProvider = 'metamask' | 'coinbase' | 'walletconnect' | 'phantom';
export type ColdWalletProvider = 'ledger' | 'trezor' | 'keepkey';

// Connection status
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Wallet connection options
export interface WalletConnectionOptions {
  walletType: WalletType;
  network: NetworkType;
  provider?: HotWalletProvider | ColdWalletProvider;
  timeout?: number; // in milliseconds
}

// Wallet connection result
export interface WalletConnectionResult {
  success: boolean;
  address: string;
  error?: string;
  balance?: string;
  network: NetworkType;
  walletType: WalletType;
  provider?: HotWalletProvider | ColdWalletProvider;
}

// Mock wallet providers data
export const hotWalletProviders = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Most popular Ethereum wallet' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', description: 'Secure wallet by Coinbase' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', description: 'Connect to mobile wallets' },
  { id: 'phantom', name: 'Phantom', icon: '👻', description: 'Solana wallet with multi-chain support' },
];

export const coldWalletProviders = [
  { id: 'ledger', name: 'Ledger', icon: '🔒', description: 'Hardware wallet with secure element' },
  { id: 'trezor', name: 'Trezor', icon: '🛡️', description: 'Open-source hardware wallet' },
  { id: 'keepkey', name: 'KeepKey', icon: '🔑', description: 'Secure hardware wallet with large display' },
];

// Network configuration
export const networkConfigs = {
  mainnet: {
    chainId: '0x1', // Ethereum mainnet
    rpcUrl: 'https://mainnet.infura.io/v3/your-infura-key',
    blockExplorerUrl: 'https://etherscan.io',
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    decimals: 18
  },
  testnet: {
    chainId: '0xaa36a7', // Sepolia testnet
    rpcUrl: 'https://sepolia.infura.io/v3/your-infura-key',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    decimals: 18
  }
};

// Generate a random wallet address
const generateRandomAddress = (): string => {
  return '0x' + Array(40).fill(0).map(() =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Simulate connection delay
const simulateDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Simulate random connection error
const simulateRandomError = (errorRate: number = 0.2): boolean => {
  return Math.random() < errorRate;
};

// Connect to wallet
export const connectWallet = async (options: WalletConnectionOptions): Promise<WalletConnectionResult> => {
  const { walletType, network, provider, timeout = 2000 } = options;

  try {
    // Simulate connection delay
    await simulateDelay(timeout);

    // Simulate random connection error
    if (simulateRandomError(0.2)) {
      throw new Error(`Failed to connect to ${provider} on ${network}`);
    }

    // Generate a random wallet address
    const address = generateRandomAddress();

    // Return successful connection result
    return {
      success: true,
      address,
      network,
      walletType,
      provider: provider as HotWalletProvider | ColdWalletProvider,
      balance: network === 'testnet' ? '1000.0' : '0.5'
    };
  } catch (error) {
    // Return error result
    return {
      success: false,
      address: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      network,
      walletType
    };
  }
};

// Disconnect wallet
export const disconnectWallet = async (): Promise<boolean> => {
  // Simulate disconnection delay
  await simulateDelay(500);

  // Always return success for disconnection
  return true;
};

// Switch network
export const switchNetwork = async (network: NetworkType): Promise<boolean> => {
  // Simulate network switching delay
  await simulateDelay(1000);

  // Simulate random error
  if (simulateRandomError(0.1)) {
    throw new Error(`Failed to switch to ${network}`);
  }

  return true;
};

// Get wallet balance
export const getWalletBalance = async (address: string, network: NetworkType): Promise<string> => {
  // Simulate balance fetching delay
  await simulateDelay(800);

  // Return mock balance based on network
  return network === 'testnet' ? '1000.0' : '0.5';
};

// Sign message (for verification)
export const signMessage = async (message: string): Promise<string> => {
  // Simulate signing delay
  await simulateDelay(1500);

  // Simulate random error
  if (simulateRandomError(0.15)) {
    throw new Error('User rejected signing request');
  }

  // Return mock signature
  return `0x${Array(130).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
};

// Send transaction
export const sendTransaction = async (
  to: string,
  amount: string,
  network: NetworkType
): Promise<string> => {
  // Simulate transaction delay
  await simulateDelay(2000);

  // Simulate random error
  if (simulateRandomError(0.25)) {
    throw new Error('Transaction failed. Please try again.');
  }

  // Return mock transaction hash
  return `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
};

// Get transaction status
export const getTransactionStatus = async (txHash: string): Promise<'pending' | 'completed' | 'failed'> => {
  // Simulate status check delay
  await simulateDelay(1000);

  // Simulate random status
  const random = Math.random();
  if (random < 0.7) {
    return 'completed';
  } else if (random < 0.9) {
    return 'pending';
  } else {
    return 'failed';
  }
};

// Get swap quote
export const getSwapQuote = async (
  fromToken: string,
  toToken: string,
  amount: string,
  network: NetworkType
): Promise<{
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  fee: string;
  estimatedGas: string;
  minReceived: string;
  priceImpact: string;
}> => {
  // Simulate quote delay
  await simulateDelay(1500);

  // Simulate random error
  if (simulateRandomError(0.1)) {
    throw new Error('Failed to get swap quote. Please try again.');
  }

  // Calculate mock exchange rate based on token symbols
  const getExchangeRate = () => {
    const rates: Record<string, Record<string, number>> = {
      'BTC': { 'ETH': 15.5, 'USDT': 61500, 'SOL': 430, 'ADA': 52000, 'DOT': 710 },
      'ETH': { 'BTC': 0.0645, 'USDT': 3950, 'SOL': 27.8, 'ADA': 3350, 'DOT': 45.8 },
      'SOL': { 'BTC': 0.00233, 'ETH': 0.036, 'USDT': 143, 'ADA': 121, 'DOT': 1.65 },
      'ADA': { 'BTC': 0.0000192, 'ETH': 0.000298, 'USDT': 1.18, 'SOL': 0.00826, 'DOT': 0.0136 },
      'DOT': { 'BTC': 0.00141, 'ETH': 0.0218, 'USDT': 86.2, 'SOL': 0.606, 'ADA': 73.5 },
      'USDT': { 'BTC': 0.0000163, 'ETH': 0.000253, 'SOL': 0.00699, 'ADA': 0.847, 'DOT': 0.0116 },
      // Testnet tokens
      'tBTC': { 'tETH': 15.5, 'tUSDT': 61500, 'tSOL': 430, 'tADA': 52000, 'tDOT': 710 },
      'tETH': { 'tBTC': 0.0645, 'tUSDT': 3950, 'tSOL': 27.8, 'tADA': 3350, 'tDOT': 45.8 },
      'tSOL': { 'tBTC': 0.00233, 'tETH': 0.036, 'tUSDT': 143, 'tADA': 121, 'tDOT': 1.65 },
      'tADA': { 'tBTC': 0.0000192, 'tETH': 0.000298, 'tUSDT': 1.18, 'tSOL': 0.00826, 'tDOT': 0.0136 },
      'tDOT': { 'tBTC': 0.00141, 'tETH': 0.0218, 'tUSDT': 86.2, 'tSOL': 0.606, 'tADA': 73.5 },
      'tUSDT': { 'tBTC': 0.0000163, 'tETH': 0.000253, 'tSOL': 0.00699, 'tADA': 0.847, 'tDOT': 0.0116 },
    };

    // Get rate or generate a random one if not found
    const fromRates = rates[fromToken] || {};
    const rate = fromRates[toToken] || (Math.random() * 100);

    return rate;
  };

  const exchangeRate = getExchangeRate();
  const numAmount = parseFloat(amount);
  const toAmount = (numAmount * exchangeRate).toFixed(6);

  // Calculate other swap parameters
  const fee = (numAmount * 0.003).toFixed(6); // 0.3% fee
  const estimatedGas = network === 'mainnet' ? '0.005 ETH' : '0.005 SepoliaETH';
  const slippage = 0.5; // 0.5% slippage
  const minReceived = (parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6);
  const priceImpact = (Math.random() * 0.5).toFixed(2) + '%'; // Random price impact between 0-0.5%

  return {
    fromToken,
    toToken,
    fromAmount: amount,
    toAmount,
    exchangeRate: exchangeRate.toString(),
    fee,
    estimatedGas,
    minReceived,
    priceImpact
  };
};

// Execute token swap
export const executeSwap = async (
  _fromToken: string,
  _toToken: string,
  _amount: string,
  _slippage: number,
  _network: NetworkType
): Promise<string> => {
  // Simulate swap delay
  await simulateDelay(3000);

  // Simulate random error
  if (simulateRandomError(0.15)) {
    throw new Error('Swap failed. Please try again.');
  }

  // Return mock transaction hash
  return `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
};
