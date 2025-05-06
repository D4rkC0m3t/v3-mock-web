import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';
import { motion } from 'framer-motion';

// Styled components
const StyledButton = styled(Button)(({ 
  theme, 
  gradientstart = '#00F0FF', 
  gradientend = '#00A3FF',
  hovereffect = 'true',
  gloweffect = 'false'
}) => ({
  background: `linear-gradient(135deg, ${gradientstart}, ${gradientend})`,
  color: 'white',
  borderRadius: '12px',
  padding: '10px 20px',
  fontWeight: 600,
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: 'none',
  ...(hovereffect === 'true' && {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 16px rgba(0, 0, 0, 0.2), 0 0 10px rgba(${parseInt(gradientstart.slice(1, 3), 16)}, ${parseInt(gradientstart.slice(3, 5), 16)}, ${parseInt(gradientstart.slice(5, 7), 16)}, 0.3)`,
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
      background: `radial-gradient(circle, ${gradientstart}33 0%, rgba(0,0,0,0) 70%)`,
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover::before': {
      opacity: 1,
    }
  })
}));

interface GradientButtonProps extends ButtonProps {
  gradientStart?: string;
  gradientEnd?: string;
  hoverEffect?: boolean;
  glowEffect?: boolean;
  animate?: boolean;
  animationProps?: any;
}

/**
 * GradientButton Component
 * A customizable button with gradient background and optional effects
 * 
 * @param {Object} props - Component props
 * @param {string} props.gradientStart - Start color of the gradient
 * @param {string} props.gradientEnd - End color of the gradient
 * @param {boolean} props.hoverEffect - Enable/disable hover effects
 * @param {boolean} props.glowEffect - Enable/disable glow effect
 * @param {boolean} props.animate - Enable/disable entrance animation
 * @param {Object} props.animationProps - Custom animation properties
 */
const GradientButton: React.FC<GradientButtonProps> = ({ 
  children,
  gradientStart = '#00F0FF',
  gradientEnd = '#00A3FF',
  hoverEffect = true,
  glowEffect = false,
  animate = true,
  animationProps = {},
  ...rest
}) => {
  // Default animation properties
  const defaultAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };
  
  // Merge default animation with custom animation props
  const animProps = { ...defaultAnimation, ...animationProps };
  
  // If animation is disabled, render without motion
  if (!animate) {
    return (
      <StyledButton
        gradientstart={gradientStart}
        gradientend={gradientEnd}
        hovereffect={hoverEffect.toString()}
        gloweffect={glowEffect.toString()}
        {...rest}
      >
        {children}
      </StyledButton>
    );
  }
  
  // Render with animation
  return (
    <motion.div
      initial={animProps.initial}
      animate={animProps.animate}
      transition={animProps.transition}
      style={{ display: 'inline-block' }}
    >
      <StyledButton
        gradientstart={gradientStart}
        gradientend={gradientEnd}
        hovereffect={hoverEffect.toString()}
        gloweffect={glowEffect.toString()}
        {...rest}
      >
        {children}
      </StyledButton>
    </motion.div>
  );
};

export default GradientButton;
