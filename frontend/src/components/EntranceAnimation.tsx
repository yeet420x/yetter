import React, { useEffect } from 'react';
import './styles/EntranceAnimation.css';

interface EntranceAnimationProps {
  onComplete: () => void;
}

const EntranceAnimation: React.FC<EntranceAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    console.log('EntranceAnimation mounted');
    
    const timer = setTimeout(() => {
      console.log('Animation complete');
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      color: '#6e4a9e',
      fontSize: '2rem',
      fontFamily: 'monospace'
    }}>
      INITIALIZING LUNA AI...
    </div>
  );
};

export default EntranceAnimation; 