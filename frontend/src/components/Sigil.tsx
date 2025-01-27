import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Sigil: React.FC = () => {
  const sigilRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (sigilRef.current) {
      gsap.to(sigilRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
    }
  }, []);

  return (
    <svg
      ref={sigilRef}
      className="cyber-sigil"
      width="100"
      height="100"
      viewBox="0 0 100 100"
    >
      <path
        d="M50 10 L90 90 L10 90 Z"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1"
      />
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="var(--secondary)"
        strokeWidth="1"
      />
      {/* Add more geometric patterns here */}
    </svg>
  );
};

export default Sigil; 