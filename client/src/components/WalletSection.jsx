import { useState, useEffect } from 'react';
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

const WalletSection = () => {
  const [activeTab, setActiveTab] = useState('hot');
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState('mainnet');
  const [walletAddress, setWalletAddress] = useState('');
  const [showNetworkSwitcher, setShowNetworkSwitcher] = useState(false);

  const networks = {
    mainnet: {
      name: 'Ethereum Mainnet',
      explorer: 'https://etherscan.io',
      icon: <Server className="text-green-500" size={16} />
    },
    sepolia: {
      name: 'Sepolia Testnet',
      explorer: 'https://sepolia.etherscan.io',
      icon: <TestTube2 className="text-yellow-500" size={16} />
    }
  };

  const connectWallet = () => {
    setIsConnected(true);
    setWalletAddress('0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t');
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-500/10">
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
          <Tooltip id="copy-tooltip" />
          <Tooltip id="explorer-tooltip" />
        </div>
      )}
    </div>
  );
};

export default WalletSection;
