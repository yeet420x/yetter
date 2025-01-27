import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Luna3DAvatarProps {
  emotionalState?: {
    comfort_level: number;
    melancholy: number;
    introspection: number;
  };
}

const Luna3DAvatar: React.FC<Luna3DAvatarProps> = ({ emotionalState = { comfort_level: 0, melancholy: 0.6, introspection: 0.8 } }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  let sphere: THREE.Mesh;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let animationFrameId: number;

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Renderer setup with alpha and antialias
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(400, 400); // Fixed size for stability
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Only append if not already present
    if (mountRef.current.childNodes.length === 0) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Sphere setup
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x6e4a9e, // Purple color
      emissive: 0x2a0a4a,
      specular: 0x9b6ddf,
      shininess: 30,
      transparent: true,
      opacity: 0.9
    });
    
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x9b6ddf, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    // Animation function
    const animate = () => {
      if (!isVisible) return;

      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;

      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup function
    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Dispose of resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isVisible]); // Add isVisible to dependency array

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(400, 400);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        width: '400px',
        height: '400px',
        position: 'relative',
        overflow: 'hidden',
        display: isVisible ? 'block' : 'none'
      }}
    />
  );
};

export default Luna3DAvatar;