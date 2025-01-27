import React from 'react';
import './styles/GothicBackground.css';

const GothicBackground = () => {
  return (
    <div className="gothic-background">
      <div className="floating-sigils">
        {Array(12).fill(null).map((_, i) => (
          <div key={i} className={`sigil sigil-${i + 1}`} />
        ))}
      </div>
      <div className="fog-overlay" />
      <div className="vignette" />
    </div>
  );
};

export default GothicBackground; 