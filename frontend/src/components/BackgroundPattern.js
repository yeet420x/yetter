import React from 'react';
import './styles/BackgroundPattern.css';

const BackgroundPattern = () => {
  return (
    <div className="background-pattern">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="pattern-element" />
      ))}
    </div>
  );
};

export default BackgroundPattern; 