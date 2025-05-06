import React, { useEffect } from 'react';

const CustomCursor: React.FC = () => {
  useEffect(() => {
    // Check if TweenMax is loaded
    if (!window.TweenMax) {
      console.error('TweenMax library not loaded');
      return;
    }

    // Create cursor elements if they don't exist
    if (!document.querySelector('.cursor')) {
      const cursor = document.createElement('div');
      cursor.className = 'cursor';
      document.body.appendChild(cursor);
    }

    if (!document.querySelector('.cursor-follower')) {
      const follower = document.createElement('div');
      follower.className = 'cursor-follower';
      document.body.appendChild(follower);
    }

    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (!cursor || !follower) {
      console.error('Cursor elements not found');
      return;
    }

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    TweenMax.to({}, 0.016, {
      repeat: -1,
      onRepeat: function() {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;
        
        TweenMax.set(follower, {
          css: {
            left: posX,
            top: posY
          }
        });
        
        TweenMax.set(cursor, {
          css: {
            left: mouseX,
            top: mouseY
          }
        });
      }
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Add hover effect for interactive elements
    const addHoverEffect = () => {
      const hoverElements = document.querySelectorAll('a, button, .feature-card');
      hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
          cursor.classList.add('hover');
          follower.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
          cursor.classList.remove('hover');
          follower.classList.remove('hover');
        });
      });
    };

    // Initial setup
    addHoverEffect();

    // Setup mutation observer to handle dynamically added elements
    const observer = new MutationObserver(addHoverEffect);
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything directly
};

export default CustomCursor;
