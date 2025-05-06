import React from 'react';
import SimpleApp from './SimpleApp';

function SimpleAppWrapper() {
  return (
    <div style={{ 
      backgroundColor: '#0A0E17', 
      color: 'white',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <SimpleApp />
    </div>
  );
}

export default SimpleAppWrapper;
