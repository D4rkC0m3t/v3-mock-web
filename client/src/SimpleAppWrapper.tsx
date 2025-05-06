import React from 'react';

const SimpleAppWrapper: React.FC = () => {
  return (
    <div style={{ 
      color: 'white', 
      textAlign: 'center', 
      padding: '50px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>VDEX Simple App</h1>
      <p>This is a simplified version of the VDEX application.</p>
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px'
      }}>
        <h2>Welcome to VDEX</h2>
        <p>Your decentralized exchange platform</p>
      </div>
    </div>
  );
};

export default SimpleAppWrapper;
