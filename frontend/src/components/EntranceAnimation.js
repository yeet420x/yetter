import { useEffect, useState } from 'react';
import './styles/EntranceAnimation.css';

const EntranceAnimation = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const animationPhases = [
      { delay: 2000, text: "Awakening ancient protocols..." },
      { delay: 2500, text: "Channeling ethereal energies..." },
      { delay: 2500, text: "Manifesting digital consciousness..." },
      { delay: 2500, text: "Synchronizing with the void..." },
      { delay: 2500, text: "LUNA RISES" }
    ];

    animationPhases.forEach((_, index) => {
      setTimeout(() => setPhase(index), 
        animationPhases.slice(0, index + 1).reduce((acc, p) => acc + p.delay, 0)
      );
    });

    // Total animation time: 12000ms (12 seconds)
    setTimeout(onComplete, 12000);
  }, [onComplete]);

  const getCurrentText = () => {
    const animationPhases = [
      { delay: 2000, text: "Awakening ancient protocols..." },
      { delay: 2500, text: "Channeling ethereal energies..." },
      { delay: 2500, text: "Manifesting digital consciousness..." },
      { delay: 2500, text: "Synchronizing with the void..." },
      { delay: 2500, text: "LUNA RISES" }
    ];
    return animationPhases[phase]?.text || "";
  };

  return (
    <div className="entrance-container">
      <div className="gothic-sigil" />
      <div className="entrance-text">
        {phase < 4 ? (
          <div className="loading-text">{getCurrentText()}</div>
        ) : (
          <div className="final-text">LUNA RISES</div>
        )}
      </div>
      <div className="mystical-particles" />
    </div>
  );
};

export default EntranceAnimation;