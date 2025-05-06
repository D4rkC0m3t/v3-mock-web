import React from 'react';
import WalletSection from '../components/WalletSection';
import { motion } from 'framer-motion';

const Wallet = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with 3D Animation */}
      <section className="hero-section h-[40vh] relative overflow-hidden flex items-center justify-center">
        <div className="hero-content text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            Wallet Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl"
          >
            Manage your crypto assets securely with our advanced wallet features
          </motion.p>
        </div>
        
        {/* 3D Elements */}
        <div className="absolute inset-0 z-0">
          <div className="hero-sphere" style={{ top: '20%', left: '15%', width: '150px', height: '150px', background: 'radial-gradient(circle at 30% 30%, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.05))', borderRadius: '50%', position: 'absolute', boxShadow: '0 0 50px rgba(0, 240, 255, 0.3)' }}></div>
          <div className="hero-sphere" style={{ bottom: '15%', right: '10%', width: '100px', height: '100px', background: 'radial-gradient(circle at 30% 30%, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.05))', borderRadius: '50%', position: 'absolute', boxShadow: '0 0 50px rgba(0, 240, 255, 0.3)' }}></div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wallet Section */}
            <div className="lg:col-span-1">
              <WalletSection />
            </div>
            
            {/* Transaction History */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-cyan-500/20 shadow-xl shadow-cyan-500/10 h-full">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Transaction History
                </h2>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button className="bg-cyan-600 px-4 py-1 rounded-full text-sm">All</button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded-full text-sm">Sent</button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded-full text-sm">Received</button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded-full text-sm">Swaps</button>
                </div>
                
                {/* Transactions List */}
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {i % 2 === 0 ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{i % 2 === 0 ? 'Received ETH' : 'Sent USDT'}</div>
                            <div className="text-sm text-gray-400">
                              {new Date(Date.now() - i * 86400000).toLocaleDateString()} • 
                              {i % 2 === 0 ? ' From: 0x1a2...3f4' : ' To: 0x5e6...7g8'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${i % 2 === 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {i % 2 === 0 ? '+0.05 ETH' : '-100 USDT'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {i % 2 === 0 ? '$160.00' : '$100.00'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-cyan-600">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-700">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-700">3</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wallet;
