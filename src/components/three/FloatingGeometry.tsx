import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Box, Octahedron, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  type: 'sphere' | 'box' | 'octahedron' | 'torus';
  speed: number;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({ position, color, type, speed }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.01;
      meshRef.current.rotation.y += speed * 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.1;
    }
  });

  const renderShape = () => {
    const material = (
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.6} 
        metalness={0.8} 
        roughness={0.2}
      />
    );

    switch (type) {
      case 'sphere':
        return <Sphere ref={meshRef} args={[0.3]} position={position}>{material}</Sphere>;
      case 'box':
        return <Box ref={meshRef} args={[0.4, 0.4, 0.4]} position={position}>{material}</Box>;
      case 'octahedron':
        return <Octahedron ref={meshRef} args={[0.3]} position={position}>{material}</Octahedron>;
      case 'torus':
        return <Torus ref={meshRef} args={[0.2, 0.1]} position={position}>{material}</Torus>;
      default:
        return null;
    }
  };

  return renderShape();
};

const Scene: React.FC = () => {
  const shapes: FloatingShapeProps[] = [
    { position: [-2, 1, -2], color: "#FFD700", type: "sphere", speed: 1 },
    { position: [2, -1, -1], color: "#FF6B6B", type: "box", speed: 0.8 },
    { position: [-1, -2, -3], color: "#4ECDC4", type: "octahedron", speed: 1.2 },
    { position: [1.5, 2, -2.5], color: "#45B7D1", type: "torus", speed: 0.9 },
    { position: [-2.5, 0, -1.5], color: "#96CEB4", type: "sphere", speed: 1.1 },
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#FFD700" />
      
      {shapes.map((shape, index) => (
        <FloatingShape key={index} {...shape} />
      ))}
    </>
  );
};

const FloatingGeometry: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default FloatingGeometry;