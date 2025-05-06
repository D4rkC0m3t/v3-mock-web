import axios from 'axios';

// Use environment variable or fallback to relative URL for proxy support
const API_BASE_URL: string = import.meta.env.VITE_API_BASE ? String(import.meta.env.VITE_API_BASE) : '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config: any) => {
    // Add authentication token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    console.error('API Error:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server might be down');
    }
    if (!error.response) {
      throw new Error('Network error - server might be unreachable');
    }
    throw error;
  }
);

// API endpoints
const ENDPOINTS = {
  STATS: '/api/stats',
  MARKET: '/api/market',
  WALLET: '/api/wallet',
  HISTORY: '/api/history'
};

// Get statistics
export interface StatsData {
  volume: number;
  liquidity: number;
  pairs: number;
}

export const getStats = async (): Promise<StatsData> => {
  try {
    console.log('Fetching stats...');
    const response = await api.get(ENDPOINTS.STATS);
    console.log('Stats fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    throw error;
  }
};

export default api;