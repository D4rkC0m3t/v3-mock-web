/**
 * Services Index
 * This file exports all API services for the application
 */

import api, { getStats } from './api';

// Market service - handles market data
const marketService = {
  // Get current market prices
  getMarketPrices: async () => {
    try {
      const response = await api.get('/api/market');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch market prices:', error);
      throw error;
    }
  },

  // Get detailed market data for a specific pair
  getMarketDetail: async (symbol) => {
    try {
      const response = await api.get(`/api/market/${symbol}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch market detail for ${symbol}:`, error);
      throw error;
    }
  }
};

// Wallet service - handles wallet operations
const walletService = {
  // Get user wallet balances
  getWalletBalances: async () => {
    try {
      const response = await api.get('/api/wallet');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wallet balances:', error);
      throw error;
    }
  },

  // Get wallet address for a specific currency
  getWalletAddress: async (currency) => {
    try {
      const response = await api.get(`/api/wallet/address/${currency}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch wallet address for ${currency}:`, error);
      throw error;
    }
  }
};

// History service - handles transaction history
const historyService = {
  // Get transaction history
  getTransactionHistory: async (filters = {}) => {
    try {
      const response = await api.get('/api/history', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      throw error;
    }
  },

  // Get details for a specific transaction
  getTransactionDetail: async (txId) => {
    try {
      const response = await api.get(`/api/history/${txId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch transaction detail for ${txId}:`, error);
      throw error;
    }
  }
};

// Export all services
export {
  api as default,
  getStats,
  marketService,
  walletService,
  historyService
};
