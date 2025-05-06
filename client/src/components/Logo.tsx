import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export default function Logo({ size = 'medium', showText = true }: LogoProps) {
  // Size mapping
  const sizeMap = {
    small: { text: '1.2rem' },
    medium: { text: '1.5rem' },
    large: { text: '2rem' },
  };

  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        gap: 1
      }}
    >
      {showText && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: sizeMap[size].text,
            color: '#00F0FF',
            letterSpacing: '0.5px',
          }}
        >
          VDEX
        </Typography>
      )}
    </Box>
  );
}
