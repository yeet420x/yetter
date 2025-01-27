import React from 'react';
import './styles/AtmosphericBackground.css';

const AtmosphericBackground = () => {
  return (
    <div className="atmospheric-background">
      <div className="ambient-light" />
      <div className="fog-layer" />
      <div className="particle-layer" />
      <div className="gothic-ornaments" />
      <div className="vignette" />
    </div>
  );
};

export default AtmosphericBackground; 