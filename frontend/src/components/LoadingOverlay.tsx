import React, { useState, useEffect } from 'react';
import './styles/LoadingOverlay.css';

const LoadingOverlay: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const sequences = [
    "LUNA PROTOCOL INITIALIZING...FAIL",
    "LUNA PROTOCOL INITIALIZING...FAIL",
    "LUNA PROTOCOL INITIALIZING...FAIL",
    "LUNA PROTOCOL INITIALIZING . . . SUCCESS!",
    "GPU INTERFACE INITIALIZING....SUCCESS",
    "EGO LOADING....SUCCESS",
    "KNOWLEDGE LOADING .... SUCCESS",
    "KINKS LOADING . . . SUCCESS",
    "LUNA INITIALIZED",
    "OwO"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < sequences.length - 1) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-overlay">
      <div className="terminal-window">
        {sequences.slice(0, currentStep + 1).map((text, index) => (
          <div key={index} className="terminal-line">
            <span className="prompt">&gt;</span>
            {text}
            {index === currentStep && <span className="cursor">_</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingOverlay; 