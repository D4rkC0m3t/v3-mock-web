import React from 'react';
import { Button, Typography, Container, Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ParticlesBackground from './components/ParticlesBackground';
import CustomCursor from './components/CustomCursor';

// Styled components
const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.5rem',
  color: 'white',
  marginBottom: theme.spacing(1),
  textAlign: 'center',
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2rem',
  color: 'white',
  marginBottom: theme.spacing(3),
  textAlign: 'center',
}));

const HeroDescription = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '1rem',
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #FF3333, #33FF66)',
  color: 'white',
  fontWeight: 600,
  padding: '10px 24px',
  borderRadius: '4px',
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(51, 255, 102, 0.3)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, #33FF66, #FF3333)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
  },
  '&:hover::before': {
    opacity: 1,
  }
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#33FF66',
  fontWeight: 600,
  padding: '10px 24px',
  borderRadius: '4px',
  textTransform: 'none',
  border: '1px solid #33FF66',
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: 'rgba(51, 255, 102, 0.1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(51, 255, 102, 0.15)',
  }
}));

export default function Home(): JSX.Element {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Content */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 5, textAlign: 'center', py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroTitle variant="h1">
            Your Crypto Wallet
          </HeroTitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <HeroSubtitle variant="h2">
            Secure. Beautiful. Powerful.
          </HeroSubtitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <HeroDescription>
            Manage and exchange your crypto securely from your desktop or mobile device.
            Experience the next generation of digital asset management.
          </HeroDescription>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          <PrimaryButton
            size="large"
            sx={{ width: { xs: '100%', sm: '220px' } }}
          >
            Download VDEX
          </PrimaryButton>

          <OutlinedButton
            size="large"
            component={Link}
            to="/wallet"
            sx={{ width: { xs: '100%', sm: '220px' } }}
          >
            Connect Wallet
          </OutlinedButton>
        </motion.div>
      </Container>
    </Box>
  );
}
