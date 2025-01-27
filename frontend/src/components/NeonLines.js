import React from 'react';
import './styles/NeonLines.css';

const NeonLines = () => {
  return (
    <div className="neon-lines">
      {Array.from({ length: 8 }).map((_, index) => (
        <div 
          key={index} 
          className="neon-line"
          style={{
            left: `${index * 12.5}%`,
            height: '100%',
            width: '2px',
            transform: 'skew(-20deg)',
          }}
        />
      ))}
    </div>
  );
};

export default NeonLines; 