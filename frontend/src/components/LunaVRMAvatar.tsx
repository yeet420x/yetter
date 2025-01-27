import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm';

interface LunaVRMAvatarProps {
  emotion?: string;
  isSpeaking?: boolean;
  isGreeting?: boolean;
  isHappy?: boolean;
}

const LunaVRMAvatar: React.FC<LunaVRMAvatarProps> = ({ 
  emotion = 'neutral',
  isSpeaking = false,
  isGreeting = false,
  isHappy = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const vrmRef = useRef<VRM | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const [loadingStatus, setLoadingStatus] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);
  const lastWinkTime = useRef(0);
  const lastSmileTime = useRef(0);
  const greetingAnimationRef = useRef<number>(0);
  const isGreetingRef = useRef(false);
  const blowingKissRef = useRef<number>(0);
  const isBlowingKissRef = useRef(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const resetToNeutralPosition = (humanoid: any) => {
    const head = humanoid.getNormalizedBoneNode('head');
    const rightArm = humanoid.getNormalizedBoneNode('rightUpperArm');
    const rightForeArm = humanoid.getNormalizedBoneNode('rightLowerArm');
    const rightHand = humanoid.getNormalizedBoneNode('rightHand');

    if (head) {
      head.rotation.set(0, 0, 0);
    }
    if (rightArm) {
      rightArm.rotation.set(0, 0, 0);
    }
    if (rightForeArm) {
      rightForeArm.rotation.set(0, 0, 0);
    }
    if (rightHand) {
      rightHand.rotation.set(0, 0, 0);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    const camera = new THREE.PerspectiveCamera(10, 1, 0.1, 20);
    camera.position.set(0, 0.8, 2.2);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const frontLight = new THREE.DirectionalLight(0xfff0e6, 0.8);
    frontLight.position.set(0, 1.2, 1.5);
    scene.add(frontLight);

    const fillLight = new THREE.DirectionalLight(0xe6e6ff, 0.3);
    fillLight.position.set(0, 0.2, 0.5);
    scene.add(fillLight);

    const leftLight = new THREE.DirectionalLight(0xffffff, 0.2);
    leftLight.position.set(-1, 1, 0);
    scene.add(leftLight);

    const rightLight = new THREE.DirectionalLight(0xffffff, 0.2);
    rightLight.position.set(1, 1, 0);
    scene.add(rightLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
    scene.add(ambientLight);

    const faceLight = new THREE.PointLight(0xfff0e6, 0.3, 2);
    faceLight.position.set(0, 1, 0.5);
    scene.add(faceLight);

    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    console.log('Starting VRM load...');
    setLoadingStatus('Loading model...');

    loader.load(
      '/models/luna.vrm',
      (gltf) => {
        console.log('VRM loaded successfully:', gltf);
        const vrm = gltf.userData.vrm;
        vrmRef.current = vrm;
        scene.add(vrm.scene);

        vrm.scene.traverse((object: THREE.Object3D) => {
          if (object instanceof THREE.Mesh) {
            console.log('Mesh name:', object.name);
            
            const materials = Array.isArray(object.material) 
              ? object.material 
              : [object.material];

            materials.forEach(material => {
              if (!material) return;

              try {
                if (object.name.toLowerCase().includes('hair') || 
                    object.name.toLowerCase().includes('bangs') || 
                    object.name.toLowerCase().includes('braid')) {
                  if (material.color) {
                    material.color.setRGB(0.75, 0.75, 0.75);
                    material.roughness = 0.3;
                    material.metalness = 0.4;
                  }
                  if (material.emissive) {
                    material.emissive.setRGB(0.05, 0.05, 0.05);
                  }
                }
                
                if (object.name.toLowerCase().includes('eye')) {
                  if (material.color) {
                    material.color.setRGB(0.2, 0.4, 1.0);
                    material.roughness = 0.1;
                  }
                  if (material.emissive) {
                    material.emissive.setRGB(0.05, 0.1, 0.3);
                  }
                }

                if (object.name.toLowerCase().includes('body') || 
                    object.name.toLowerCase().includes('face') || 
                    object.name.toLowerCase().includes('skin')) {
                  if (material.color) {
                    material.color.setRGB(0.99, 0.96, 0.93);
                    material.roughness = 0.3;
                    material.metalness = 0.0;
                  }
                  if (material.emissive) {
                    material.emissive.setRGB(0.1, 0.08, 0.08);
                  }
                }
              } catch (err) {
                console.warn('Could not modify material for:', object.name, err);
              }
            });
          }
        });

        vrm.scene.rotation.y = Math.PI;
        vrm.scene.position.y = -1.5;
        vrm.scene.position.z = 0;
        
        setLoadingStatus('Model loaded!');
        console.log('VRM setup complete');
      },
      (progress) => {
        const percentComplete = (progress.loaded / progress.total) * 100;
        setLoadingStatus(`Loading: ${percentComplete.toFixed(2)}%`);
        console.log('Loading progress:', percentComplete.toFixed(2) + '%');
      },
      (error) => {
        console.error('Error loading VRM:', error);
        setError(`Failed to load model: ${error.message}`);
      }
    );

    const animate = () => {
      const delta = clockRef.current.getDelta();
      const time = clockRef.current.getElapsedTime();
      
      if (vrmRef.current) {
        vrmRef.current.update(delta);
        
        const humanoid = vrmRef.current.humanoid;
        const expressions = vrmRef.current.expressionManager;
        
        if (humanoid) {
          const head = humanoid.getNormalizedBoneNode('head');
          
          if (isGreetingRef.current) {
            const greetingTime = time - greetingAnimationRef.current;
            if (greetingTime < 1.5) {
              if (head) {
                head.rotation.z = Math.sin(greetingTime * Math.PI) * 0.2;
                head.rotation.y = Math.sin(greetingTime * Math.PI * 2) * 0.15;
              }
            } else {
              isGreetingRef.current = false;
              resetToNeutralPosition(humanoid);
            }
          }

          if (isBlowingKissRef.current) {
            const kissTime = time - blowingKissRef.current;
            
            if (kissTime < 2) {
              const rightArm = humanoid.getNormalizedBoneNode('rightUpperArm');
              const rightForeArm = humanoid.getNormalizedBoneNode('rightLowerArm');
              const rightHand = humanoid.getNormalizedBoneNode('rightHand');
              
              if (rightArm && rightForeArm && rightHand) {
                rightArm.rotation.z = -Math.PI * 0.4 - Math.sin(kissTime * Math.PI) * 0.2;
                rightArm.rotation.x = Math.PI * 0.2;
                rightForeArm.rotation.z = -Math.PI * 0.1;
                
                if (kissTime < 1) {
                  rightHand.rotation.z = -Math.PI * 0.2 * (kissTime);
                } else {
                  rightHand.rotation.z = -Math.PI * 0.2 * (2 - kissTime);
                }
              }
            } else {
              isBlowingKissRef.current = false;
              resetToNeutralPosition(humanoid);
            }
          }

          if (!isGreetingRef.current && !isBlowingKissRef.current) {
            resetToNeutralPosition(humanoid);
          }
        }

        if (expressions) {
          if (time - lastSmileTime.current > 5 && Math.random() > 0.995) {
            lastSmileTime.current = time;
            expressions.setValue('happy', 0.3);
            
            setTimeout(() => {
              expressions.setValue('happy', 0);
            }, 2000);
          }

          if (isSpeaking && time - lastWinkTime.current > 4 && Math.random() > 0.7) {
            lastWinkTime.current = time;
            expressions.setValue('blink_l', 1);
            setTimeout(() => {
              expressions.setValue('blink_l', 0);
            }, 200);
          }

          const blinkFrequency = Math.sin(time * 3) * 0.5 + 0.5;
          if (blinkFrequency > 0.99) {
            expressions.setValue('blink', 1);
          } else {
            expressions.setValue('blink', 0);
          }

          if (isGreetingRef.current) {
            const greetingTime = time - greetingAnimationRef.current;
            if (greetingTime < 1.5) {
              expressions.setValue('happy', 0.4);
            } else {
              isGreetingRef.current = false;
            }
          }

          if (isBlowingKissRef.current) {
            const kissTime = time - blowingKissRef.current;
            if (kissTime < 2) {
              expressions.setValue('happy', 0.5);
              if (kissTime < 1) {
                expressions.setValue('aa', 0.2 * kissTime);
              } else {
                expressions.setValue('aa', 0.2 * (2 - kissTime));
              }
            }
          }
        }
      }
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    import('three/examples/jsm/controls/OrbitControls').then(({ OrbitControls }) => {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = false;
      controls.dampingFactor = 0;
      controls.screenSpacePanning = true;
      controls.enabled = false;
    });

    rendererRef.current = renderer;
    cameraRef.current = camera;

    return () => {
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    isGreetingRef.current = isGreeting;
    if (isGreeting) {
      greetingAnimationRef.current = clockRef.current.getElapsedTime();
    }
  }, [isGreeting]);

  useEffect(() => {
    if (isHappy && !isBlowingKissRef.current) {
      isBlowingKissRef.current = true;
      blowingKissRef.current = clockRef.current.getElapsedTime();
    }
  }, [isHappy]);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: window.innerWidth < 768 ? '300px' : '400px',
    aspectRatio: '1',
    position: 'relative' as const,
    overflow: 'hidden',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  };

  useEffect(() => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
    
    const width = window.innerWidth < 768 ? 300 : 400;
    const height = width;
    
    rendererRef.current.setSize(width, height);
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = window.innerWidth < 768 ? 300 : 400;
      const height = width;
      
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      style={containerStyle}
    >
      {error ? (
        <div style={{ color: '#ff6b6b', textAlign: 'center', padding: '1rem' }}>
          {error}
        </div>
      ) : !vrmRef.current && (
        <div style={{ color: '#6e4a9e', textAlign: 'center', padding: '1rem' }}>
          {loadingStatus}
        </div>
      )}
    </div>
  );
};

export default LunaVRMAvatar; 