import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

const InteractiveOrb: React.FC = () => {
  const orbRef = useRef<THREE.Mesh>(null);
  const { viewport, mouse } = useThree();
  
  useFrame((state) => {
    if (orbRef.current) {
      // Mouse interaction
      orbRef.current.rotation.x = mouse.y * Math.PI * 0.1;
      orbRef.current.rotation.y = mouse.x * Math.PI * 0.1;
      
      // Floating animation
      orbRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      
      // Pulsing scale
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      orbRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Sphere ref={orbRef} args={[1, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#FFD700"
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.8}
        emissive="#FFD700"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
};

const InteractiveOrbCanvas: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF6B6B" />
        <InteractiveOrb />
      </Canvas>
    </div>
  );
};

export default InteractiveOrbCanvas;