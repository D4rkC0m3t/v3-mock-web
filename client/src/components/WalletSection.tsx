import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  HardDrive, 
  Link, 
  LinkOff,
  Server, 
  Zap, 
  ChevronDown,
  Copy,
  ExternalLink,
  Power,
  TestTube2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

interface Network {
  name: string;
  rpc: string;
  explorer: string;
  icon: React.ReactNode;
}

interface Token {
  symbol: string;
  amount: number;
  value: number;
}

const WalletSection: React.FC = () => {
  // Wallet states
  const [activeTab, setActiveTab] = useState<'hot' | 'cold'>('hot');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>('mainnet');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showNetworkSwitcher, setShowNetworkSwitcher] = useState<boolean>(false);

  // Mock connection function
  const connectWallet = (): void => {
    setIsConnected(true);
    setWalletAddress('0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t');
  };

  // Networks available
  const networks: Record<string, Network> = {
    mainnet: {
      name: 'Ethereum Mainnet',
      rpc: 'https://mainnet.infura.io/v3/YOUR_KEY',
      explorer: 'https://etherscan.io',
      icon: <Server className="text-green-500" size={16} />
    },
    sepolia: {
      name: 'Sepolia Testnet',
      rpc: 'https://sepolia.infura.io/v3/YOUR_KEY',
      explorer: 'https://sepolia.etherscan.io',
      icon: <TestTube2 className="text-yellow-500" size={16} />
    },
    bsc: {
      name: 'BSC Mainnet',
      rpc: 'https://bsc-dataseed.binance.org',
      explorer: 'https://bscscan.com',
      icon: <Server className="text-yellow-400" size={16} />
    }
  };

  // Token balances mock
  const tokens: Token[] = [
    { symbol: 'ETH', amount: 2.45, value: 7840 },
    { symbol: 'USDT', amount: 1250, value: 1250 },
    { symbol: 'BTC', amount: 0.023, value: 974 }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-500/10">
      {/* Header with network switcher */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {activeTab === 'hot' ? (
            <Wallet className="text-cyan-400" size={20} />
          ) : (
            <HardDrive className="text-purple-400" size={20} />
          )}
          {activeTab === 'hot' ? 'Hot Wallet' : 'Cold Wallet'}
        </h2>
        
        <div className="relative">
          <button 
            onClick={() => setShowNetworkSwitcher(!showNetworkSwitcher)}
            className="flex items-center gap-2 bg-gray-700/70 hover:bg-gray-600/70 px-3 py-1 rounded-lg text-sm"
          >
            {networks[network].icon}
            <span>{networks[network].name}</span>
            <ChevronDown size={16} />
          </button>
          
          <AnimatePresence>
            {showNetworkSwitcher && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
              >
                {Object.entries(networks).map(([key, net]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setNetwork(key);
                      setShowNetworkSwitcher(false);
                    }}
                    className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-700 ${network === key ? 'bg-cyan-900/30' : ''}`}
                  >
                    {net.icon}
                    <span>{net.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected ? (
        <div className="text-center py-8">
          <div className="mx-auto bg-gray-700/50 rounded-full p-4 w-max mb-4">
            {activeTab === 'hot' ? (
              <Wallet className="text-gray-400 mx-auto" size={32} />
            ) : (
              <HardDrive className="text-gray-400 mx-auto" size={32} />
            )}
          </div>
          <h3 className="text-lg font-bold mb-2">
            {activeTab === 'hot' ? 'Connect Browser Wallet' : 'Connect Hardware Wallet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {activeTab === 'hot' 
              ? 'MetaMask, Coinbase Wallet, etc.' 
              : 'Ledger, Trezor, etc.'}
          </p>
          <button 
            onClick={connectWallet}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-xl font-bold"
          >
            {activeTab === 'hot' ? 'Connect Wallet' : 'Pair Device'}
          </button>
        </div>
      ) : (
        <>
          {/* Wallet Address */}
          <div className="bg-gray-800/50 rounded-lg p-3 mb-6 flex items-center justify-between">
            <span className="font-mono text-sm truncate flex-1">{walletAddress}</span>
            <div className="flex gap-2 ml-3">
              <button 
                onClick={() => navigator.clipboard.writeText(walletAddress)}
                className="text-gray-400 hover:text-cyan-400"
                data-tooltip-id="copy-tooltip"
                data-tooltip-content="Copy Address"
              >
                <Copy size={16} />
              </button>
              <a 
                href={`${networks[network].explorer}/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400"
                data-tooltip-id="explorer-tooltip"
                data-tooltip-content="View on Explorer"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Network Status */}
          <div className="flex items-center gap-2 bg-gray-800/30 rounded-lg px-3 py-2 mb-6 w-max">
            <div className={`w-2 h-2 rounded-full ${network === 'mainnet' || network === 'bsc' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm">
              {network === 'mainnet' || network === 'bsc' ? 'Mainnet' : 'Testnet'} - {networks[network].name}
            </span>
          </div>

          {/* Token Balances */}
          <div className="space-y-3 mb-6">
            <h3 className="font-bold text-gray-300 mb-2">Assets</h3>
            {tokens.map((token) => (
              <div key={token.symbol} className="flex items-center justify-between p-3 hover:bg-gray-700/30 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    {token.symbol === 'ETH' ? '🟣' : token.symbol === 'USDT' ? '🔶' : '🟡'}
                  </div>
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-gray-400">{token.amount}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">${token.value.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Disconnect Button */}
          <button 
            onClick={() => setIsConnected(false)}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-400 py-2 border border-gray-700 rounded-lg transition"
          >
            <Power size={16} />
            {activeTab === 'hot' ? 'Disconnect Wallet' : 'Disconnect Device'}
          </button>
        </>
      )}

      {/* Wallet Type Toggle */}
      <div className="flex border border-gray-700 rounded-lg p-1 mt-6">
        <button
          onClick={() => setActiveTab('hot')}
          className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 ${activeTab === 'hot' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}
        >
          <Wallet size={16} />
          Hot Wallet
        </button>
        <button
          onClick={() => setActiveTab('cold')}
          className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 ${activeTab === 'cold' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
        >
          <HardDrive size={16} />
          Cold Wallet
        </button>
      </div>

      {/* Tooltips */}
      <Tooltip id="copy-tooltip" />
      <Tooltip id="explorer-tooltip" />
    </div>
  );
};

export default WalletSection;
