import { Button, TextField, Typography, Link, Alert, Box, styled, Container, Paper } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import cryptoIcon from './assets/crypto-icon.svg';
import { motion } from 'framer-motion';

const LoginContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '2rem',
  background: '#0A0E17',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'radial-gradient(circle at 30% 20%, rgba(0, 240, 255, 0.08) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(0, 163, 255, 0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\' /%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
    opacity: 0.03,
    pointerEvents: 'none',
  }
});

const LoginCard = styled(Paper)({
  padding: '1.75rem',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  maxWidth: '420px',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-1px',
    borderRadius: '13px',
    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 163, 255, 0.2))',
    opacity: 0.5,
    zIndex: -1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(0, 163, 255, 0.05) 100%)',
    zIndex: -2,
  }
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(0, 240, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 240, 255, 0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(0, 240, 255, 0.5)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

const GradientButton = styled(Button)({
  background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
  color: 'white',
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(0, 240, 255, 0.2)',
  boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'all 0.5s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #2CF6FF, #0080FF)',
    boxShadow: '0 0 25px rgba(0, 240, 255, 0.7)',
    transform: 'translateY(-2px)',
    '&::before': {
      left: '100%',
    }
  },
  '&.Mui-disabled': {
    background: 'rgba(0, 240, 255, 0.3)',
    color: 'rgba(255, 255, 255, 0.5)',
  }
});

interface FloatingElementProps {
  size: string;
  color: string;
  left: number;
  top: number;
  delay: number;
}

const FloatingElement = ({ size, color, left, top, delay }: FloatingElementProps) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${color}, rgba(0,0,0,0))`,
        left: `${left}%`,
        top: `${top}%`,
        filter: 'blur(15px)',
        opacity: 0.4,
        zIndex: 0,
      }}
      animate={{
        y: ['-10%', '10%'],
        x: ['-5%', '5%'],
        scale: [0.95, 1.05, 0.95],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        y: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 8 + Math.random() * 4,
          ease: 'easeInOut',
          delay: delay,
        },
        x: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 10 + Math.random() * 4,
          ease: 'easeInOut',
          delay: delay + 1,
        },
        scale: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 12 + Math.random() * 4,
          ease: 'easeInOut',
          delay: delay,
        },
        opacity: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 6 + Math.random() * 2,
          ease: 'easeInOut',
          delay: delay,
        },
      }}
    />
  );
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For development/demo purposes, simulate successful login
      // Remove this block in production and use the actual API call
      if (email && password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock successful login
        localStorage.setItem('token', 'mock-jwt-token-for-demo');
        navigate('/dashboard');
        return;
      }

      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        mode: 'cors',
        credentials: 'include'
      });

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || `Login failed with status: ${response.status}`);
      }

      if (!data.token) {
        throw new Error('Authentication failed: No token received');
      }

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection or try again later.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Array of floating elements for the background
  const floatingElements = [
    { size: '400px', color: 'rgba(0, 240, 255, 0.15)', left: 10, top: 20, delay: 0 },
    { size: '300px', color: 'rgba(0, 163, 255, 0.12)', left: 75, top: 15, delay: 0.5 },
    { size: '350px', color: 'rgba(0, 240, 255, 0.1)', left: 85, top: 60, delay: 1 },
    { size: '250px', color: 'rgba(0, 163, 255, 0.08)', left: 25, top: 70, delay: 1.5 },
    { size: '320px', color: 'rgba(0, 240, 255, 0.12)', left: 40, top: 30, delay: 2 },
  ];

  return (
    <LoginContainer maxWidth={false} disableGutters>
      {/* Floating background elements */}
      {floatingElements.map((props, index) => (
        <FloatingElement key={index} {...props} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginCard elevation={0}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <img src={cryptoIcon} alt="VDEX Logo" style={{ width: '80px', height: '80px', marginBottom: '16px' }} />
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome Back
              </Typography>
            </Box>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '10px',
                  background: 'rgba(211, 47, 47, 0.1)',
                  color: '#ff5252',
                  border: '1px solid rgba(211, 47, 47, 0.3)',
                  '& .MuiAlert-icon': {
                    color: '#ff5252'
                  }
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                Sign In to Your Account
              </Typography>
            </Box>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StyledTextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiOutlinedInput-root': { height: '50px' } }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <StyledTextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiOutlinedInput-root': { height: '50px' } }}
                />
              </motion.div>

              <Box sx={{ textAlign: 'center', my: 1 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    p: 0.5,
                    background: 'rgba(0, 240, 255, 0.1)',
                    border: '1px solid rgba(0, 240, 255, 0.2)'
                  }}>
                    <Box sx={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0, 240, 255, 0.2)'
                    }}>
                      <Typography variant="h6" sx={{ color: '#00F0FF', fontWeight: 'bold' }}>OR</Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Box>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GradientButton
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ height: 50, fontSize: '1rem' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </GradientButton>
              </motion.div>
            </form>
          </Box>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Typography
              align="center"
              sx={{
                mt: 3,
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              New user?{' '}
              <Link
                component={RouterLink}
                to="/signup"
                sx={{
                  color: '#00F0FF',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Create account
              </Link>
            </Typography>
          </motion.div>
        </LoginCard>
      </motion.div>
    </LoginContainer>
  );
}