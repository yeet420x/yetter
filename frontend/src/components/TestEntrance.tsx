import React, { useEffect } from 'react';
import './styles/EntranceAnimation.css';

const TestEntrance = () => {
  useEffect(() => {
    console.log("TestEntrance mounted"); // Debug log
  }, []);

  return (
    <div 
      className="entrance-animation" 
      style={{
        backgroundColor: 'blue',
        color: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
    >
      <div className="gothic-text">
        <p style={{ fontSize: '24px' }}>TEST MESSAGE</p>
        <p style={{ fontSize: '24px' }}>IF YOU CAN SEE THIS</p>
        <p style={{ fontSize: '24px' }}>THE COMPONENT IS WORKING</p>
      </div>
    </div>
  );
};

export default TestEntrance; 