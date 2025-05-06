import React from 'react';
import { Box, Typography } from '@mui/material';
import { GlassCard } from '../ui/GlassCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * PriceChart Component
 * Displays price chart for a trading pair using recharts
 */
const PriceChart = ({ data, title = 'Price Chart' }) => {
  return (
    <GlassCard
      sx={{
        height: '400px',
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      
      <Box sx={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time"
              stroke="#888"
              tick={{ fill: '#888' }}
            />
            <YAxis
              stroke="#888"
              tick={{ fill: '#888' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(13, 17, 28, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#00f0ff"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </GlassCard>
  );
};

export default PriceChart;