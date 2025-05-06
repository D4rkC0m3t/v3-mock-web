import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  theme?: 'light' | 'dark';
  height?: string | number;
  width?: string | number;
  hideTopBar?: boolean;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = 'BTCUSDT',
  interval = '1h',
  theme = 'dark',
  height = '100%',
  width = '100%',
  hideTopBar = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Create a container for the chart
    const container = containerRef.current;
    if (!container) return;

    // Clean up any existing chart
    container.innerHTML = '';

    // Create the TradingView widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: theme === 'dark' ? '#1E222D' : '#f1f3f6',
          enable_publishing: false,
          hide_top_toolbar: hideTopBar,
          hide_legend: false,
          save_image: false,
          container_id: container.id,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          studies: ['RSI@tv-basicstudies', 'MAExp@tv-basicstudies'],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
        });
      }
    };

    // Add the script to the document
    document.head.appendChild(script);
    scriptRef.current = script;

    // Clean up
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, [symbol, interval, theme, hideTopBar]);

  // For small charts, simulate a simple chart with CSS
  if (height === 'small') {
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.1) 0%, rgba(0, 163, 255, 0.1) 100%)',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: `linear-gradient(90deg, 
              ${symbol.includes('BTC') ? 'rgba(247, 147, 26, 0.2)' : 'rgba(98, 126, 234, 0.2)'} 0%, 
              transparent 100%)`,
            clipPath: 'polygon(0 100%, 10% 80%, 20% 90%, 30% 70%, 40% 80%, 50% 60%, 60% 70%, 70% 50%, 80% 60%, 90% 40%, 100% 50%, 100% 100%, 0 100%)',
          }
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        height: height,
        width: width,
        background: theme === 'dark' ? '#1E222D' : '#f1f3f6',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        id={`tradingview_${Math.random().toString(36).substring(2, 9)}`}
        ref={containerRef}
        style={{ height: '100%', width: '100%' }}
      />
    </Box>
  );
};

// Add TradingView to the Window interface
declare global {
  interface Window {
    TradingView: any;
  }
}

export default TradingViewChart;
