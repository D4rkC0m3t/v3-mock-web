/**
 * Components Index
 * This file exports all reusable components for the application
 */

// Import all components
import Logo from './Logo';
import GlossyNavbar from './GlossyNavbar';
import StandardNavbar from './StandardNavbar';
import MainLayout from './MainLayout';
import AuthLayout from './AuthLayout';

// Market components
import MarketCard from './market/MarketCard';
// Commented out imports for components that might not exist yet
// import PriceChart from './market/PriceChart';
// import OrderBook from './market/OrderBook';
// import TradingForm from './market/TradingForm';
// import MarketStats from './market/MarketStats';

// Wallet components
import WalletBalance from './wallet/WalletBalance';
import WalletAddress from './wallet/WalletAddress';
import TransactionList from './wallet/TransactionList';
import CurrencyIcon from './wallet/CurrencyIcon';

// UI components
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorBoundary from './ui/ErrorBoundary';
import GradientButton from './ui/GradientButton';
import GlassCard from './ui/GlassCard';
import Notification from './ui/Notification';

// Export all components
export {
  // Layout components
  Logo,
  GlossyNavbar,
  StandardNavbar,
  MainLayout,
  AuthLayout,

  // Market components
  MarketCard,
  // PriceChart,
  // OrderBook,
  // TradingForm,
  // MarketStats,

  // Wallet components
  WalletBalance,
  WalletAddress,
  TransactionList,
  CurrencyIcon,

  // UI components
  LoadingSpinner,
  ErrorBoundary,
  GradientButton,
  GlassCard,
  Notification
};
