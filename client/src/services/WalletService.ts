import axios from 'axios';

export const WalletService = {
  async getBalance(walletAddress: string) {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE}/api/wallet/balance`, {
      params: { wallet: walletAddress }
    });
    return response.data;
  },

  async getTransactions(walletAddress: string, page = 0) {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE}/api/transactions`, {
      params: {
        wallet: walletAddress,
        page,
        limit: 10
      }
    });
    return response.data;
  },

  async initiateTransfer(transferData: any) {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE}/api/transfer`,
      transferData
    );
    return response.data;
  }
};