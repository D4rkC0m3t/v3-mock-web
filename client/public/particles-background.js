/**
 * Particles.js Background Integration
 * This file initializes the particles.js background and custom cursor
 */

// Initialize particles.js with configuration from API
async function initParticlesBackground() {
  try {
    // Fetch configuration from API
    const response = await fetch('/api/particles-config');
    if (!response.ok) {
      throw new Error(`Failed to fetch particles config: ${response.status}`);
    }
    
    const config = await response.json();
    
    // Initialize particles.js with the fetched configuration
    if (window.particlesJS) {
      window.particlesJS('particles-js', config);
      console.log('Particles.js initialized with API configuration');
    } else {
      console.error('Particles.js library not loaded');
    }
  } catch (error) {
    console.error('Error initializing particles background:', error);
    
    // Fallback to default configuration if API fails
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        "particles": {
          "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
          "color": { "value": ["#FF3333", "#33FF66"] },
          "shape": { "type": "circle" },
          "opacity": { "value": 0.7, "random": true },
          "size": { "value": 3, "random": true },
          "line_linked": { "enable": true, "distance": 150, "color": "#33FF66", "opacity": 0.4, "width": 1 },
          "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "bounce", "bounce": true }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": { "enable": true, "mode": "bubble" },
            "onclick": { "enable": true, "mode": "repulse" }
          }
        }
      });
      console.log('Particles.js initialized with fallback configuration');
    }
  }
}

// Initialize custom cursor
function initCustomCursor() {
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
  
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Hover effect for links and buttons
  const hoverElements = document.querySelectorAll('a, button, .feature-card');
  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    element.addEventListener('mouseleave', function() {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
  
  console.log('Custom cursor initialized');
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if particles container exists, create if not
  if (!document.getElementById('particles-js')) {
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-js';
    particlesContainer.className = 'particles-container';
    document.body.insertBefore(particlesContainer, document.body.firstChild);
    
    // Add gradient overlay
    const gradientOverlay = document.createElement('div');
    gradientOverlay.className = 'gradient-overlay';
    document.body.insertBefore(gradientOverlay, document.body.firstChild.nextSibling);
    
    console.log('Particles container and gradient overlay created');
  }
  
  // Initialize particles background
  initParticlesBackground();
  
  // Initialize custom cursor
  initCustomCursor();
});
