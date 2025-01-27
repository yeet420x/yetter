import React, { useEffect, useRef } from 'react';
import '../styles/cursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    let rafId = null;

    const updatePosition = (e) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        if (cursor) {
          const x = e.clientX;
          const y = e.clientY;
          cursor.style.transform = `translate(${x}px, ${y}px) rotate(-45deg)`;
        }
      });
    };

    const createElectricEffect = (e) => {
      const effect = document.createElement('div');
      effect.className = 'electric-effect';
      effect.style.left = `${e.clientX}px`;
      effect.style.top = `${e.clientY}px`;
      
      // Create multiple electric bolts
      for (let i = 0; i < 12; i++) {
        const bolt = document.createElement('div');
        bolt.className = 'electric-bolt';
        const angle = (i * 30) + Math.random() * 15;
        const length = 20 + Math.random() * 20;
        
        bolt.style.left = '50%';
        bolt.style.top = '50%';
        bolt.style.height = `${length}px`;
        bolt.style.transform = `
          translate(-50%, -50%) 
          rotate(${angle}deg) 
          translateY(-${length / 2}px)
        `;
        
        effect.appendChild(bolt);
      }
      
      document.body.appendChild(effect);

      // Create additional random bolts
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const extraBolt = document.createElement('div');
          extraBolt.className = 'electric-bolt';
          const randomAngle = Math.random() * 360;
          const randomLength = 15 + Math.random() * 25;
          
          extraBolt.style.left = `${e.clientX}px`;
          extraBolt.style.top = `${e.clientY}px`;
          extraBolt.style.height = `${randomLength}px`;
          extraBolt.style.transform = `
            translate(-50%, -50%) 
            rotate(${randomAngle}deg) 
            translateY(-${randomLength / 2}px)
          `;
          
          document.body.appendChild(extraBolt);
          
          setTimeout(() => extraBolt.remove(), 200);
        }, i * 50);
      }

      setTimeout(() => effect.remove(), 500);
    };

    document.addEventListener('mousemove', updatePosition, { passive: true });
    document.addEventListener('mousedown', createElectricEffect);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', createElectricEffect);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor">
      <div className="wand" />
    </div>
  );
};

export default CustomCursor; 