import React, { useEffect } from 'react';

interface ParticlesBackgroundProps {
  id?: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ id = 'particles-js' }) => {
  useEffect(() => {
    const initParticles = async () => {
      try {
        // Check if particles.js is loaded
        if (window.particlesJS) {
          // Try to fetch configuration from API
          try {
            const response = await fetch('/api/particles-config');
            if (response.ok) {
              const config = await response.json();
              window.particlesJS(id, config);
              console.log('Particles.js initialized with API configuration');
              return;
            }
          } catch (error) {
            console.error('Error fetching particles config from API:', error);
          }

          // Fallback configuration if API fetch fails
          window.particlesJS(id, {
            "particles": {
              "number": {
                "value": 100,
                "density": {
                  "enable": true,
                  "value_area": 1000
                }
              },
              "color": {
                "value": ["#FF3333", "#33FF66"]  // Red and green colors
              },
              "shape": {
                "type": "circle",
                "stroke": {
                  "width": 0,
                  "color": "#000000"
                },
                "polygon": {
                  "nb_sides": 5
                }
              },
              "opacity": {
                "value": 0.7,
                "random": true,
                "anim": {
                  "enable": true,
                  "speed": 1,
                  "opacity_min": 0.1,
                  "sync": false
                }
              },
              "size": {
                "value": 3.5,
                "random": true,
                "anim": {
                  "enable": true,
                  "speed": 2,
                  "size_min": 0.3,
                  "sync": false
                }
              },
              "line_linked": {
                "enable": true,
                "distance": 180,
                "color": "#33FF66",  // Green connections
                "opacity": 0.5,
                "width": 1.2,
                "shadow": {
                  "enable": true,
                  "blur": 5,
                  "color": "#33FF66"
                }
              },
              "move": {
                "enable": true,
                "speed": 3,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "bounce",
                "bounce": true,
                "attract": {
                  "enable": true,
                  "rotateX": 600,
                  "rotateY": 1200
                }
              }
            },
            "interactivity": {
              "detect_on": "canvas",
              "events": {
                "onhover": {
                  "enable": true,
                  "mode": "bubble"
                },
                "onclick": {
                  "enable": true,
                  "mode": "repulse"
                },
                "resize": true
              },
              "modes": {
                "grab": {
                  "distance": 200,
                  "line_linked": {
                    "opacity": 1
                  }
                },
                "bubble": {
                  "distance": 250,
                  "size": 6,
                  "duration": 2,
                  "opacity": 1,
                  "speed": 3,
                  "color": "#FF3333"
                },
                "repulse": {
                  "distance": 300,
                  "duration": 1
                },
                "push": {
                  "particles_nb": 4
                },
                "remove": {
                  "particles_nb": 2
                }
              }
            },
            "retina_detect": true
          });
          console.log('Particles.js initialized with fallback configuration');
        } else {
          console.error('Particles.js library not loaded');
        }
      } catch (error) {
        console.error('Error initializing particles:', error);
      }
    };

    initParticles();
  }, [id]);

  return (
    <>
      <div id={id} className="particles-container"></div>
      <div className="gradient-overlay"></div>
    </>
  );
};

export default ParticlesBackground;
