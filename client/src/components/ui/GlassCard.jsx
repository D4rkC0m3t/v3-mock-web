import React from 'react';
import { Box, Paper, styled } from '@mui/material';
import { motion } from 'framer-motion';

// Styled components
const GlassContainer = styled(Paper)(({ 
  theme, 
  elevation = 0, 
  bordercolor = 'rgba(255, 255, 255, 0.1)',
  hovereffect = 'true',
  gloweffect = 'false',
  glowcolor = 'rgba(0, 240, 255, 0.3)'
}) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '20px',
  border: `1px solid ${bordercolor}`,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  ...(hovereffect === 'true' && {
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      border: `1px solid rgba(0, 240, 255, 0.3)`,
    }
  }),
  ...(gloweffect === 'true' && {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: `radial-gradient(circle, ${glowcolor} 0%, rgba(0,0,0,0) 70%)`,
      opacity: 0.2,
      zIndex: -1,
    }
  })
}));

/**
 * GlassCard Component
 * A reusable glass-morphism style card component with optional animations and effects
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.borderColor - Border color (CSS color string)
 * @param {boolean} props.hoverEffect - Enable/disable hover effects
 * @param {boolean} props.glowEffect - Enable/disable glow effect
 * @param {string} props.glowColor - Glow effect color (CSS color string)
 * @param {Object} props.sx - Additional MUI sx props
 * @param {boolean} props.animate - Enable/disable entrance animation
 * @param {Object} props.animationProps - Custom animation properties
 */
const GlassCard = ({ 
  children, 
  borderColor = 'rgba(255, 255, 255, 0.1)', 
  hoverEffect = true,
  glowEffect = false,
  glowColor = 'rgba(0, 240, 255, 0.3)',
  sx = {},
  animate = true,
  animationProps = {},
  ...rest
}) => {
  // Default animation properties
  const defaultAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };
  
  // Merge default animation with custom animation props
  const animProps = { ...defaultAnimation, ...animationProps };
  
  // If animation is disabled, render without motion
  if (!animate) {
    return (
      <GlassContainer 
        elevation={0}
        bordercolor={borderColor}
        hovereffect={hoverEffect.toString()}
        gloweffect={glowEffect.toString()}
        glowcolor={glowColor}
        sx={sx}
        {...rest}
      >
        {children}
      </GlassContainer>
    );
  }
  
  // Render with animation
  return (
    <motion.div
      initial={animProps.initial}
      animate={animProps.animate}
      transition={animProps.transition}
    >
      <GlassContainer 
        elevation={0}
        bordercolor={borderColor}
        hovereffect={hoverEffect.toString()}
        gloweffect={glowEffect.toString()}
        glowcolor={glowColor}
        sx={sx}
        {...rest}
      >
        {children}
      </GlassContainer>
    </motion.div>
  );
};

export default GlassCard;
