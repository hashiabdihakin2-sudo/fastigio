import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3, Group } from 'three';

interface BackgroundProps {
  ballPosition: Vector3;
}

export const Background = ({ ballPosition }: BackgroundProps) => {
  const starsRef = useRef<Group>(null);
  const groundRef = useRef<Group>(null);

  useFrame(() => {
    // Move background elements to create smooth speed sensation
    if (starsRef.current) {
      starsRef.current.position.z = ballPosition.z * 0.05; // Subtle parallax effect
    }
    if (groundRef.current) {
      groundRef.current.position.z = ballPosition.z * 0.15; // Ground moves with ball
    }
  });

  // Generate fewer stars for smoother performance
  const stars = [];
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 150;
    const y = Math.random() * 30 + 15;
    const z = (Math.random() - 0.5) * 300;
    
    stars.push(
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.8}
        />
      </mesh>
    );
  }

  // Generate simpler ground pattern
  const groundPatterns = [];
  for (let i = 0; i < 20; i++) {
    const x = (Math.random() - 0.5) * 80;
    const z = i * 30 - 150;
    
    groundPatterns.push(
      <mesh key={i} position={[x, -12, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 3, 6]} />
        <meshBasicMaterial 
          color="#4A90E2" 
          transparent
          opacity={0.4}
        />
      </mesh>
    );
  }

  return (
    <>
      {/* Stars */}
      <group ref={starsRef}>
        {stars}
      </group>
      
      {/* Ground patterns */}
      <group ref={groundRef}>
        {groundPatterns}
      </group>
      
      {/* Distant buildings/structures */}
      <group>
        {Array.from({ length: 20 }, (_, i) => (
          <mesh 
            key={i} 
            position={[
              (Math.random() - 0.5) * 150,
              Math.random() * 20 + 5,
              i * 50 - 100
            ]}
          >
            <boxGeometry args={[
              2 + Math.random() * 3,
              10 + Math.random() * 15,
              2 + Math.random() * 3
            ]} />
            <meshPhongMaterial 
              color="#1a1a2e"
              emissive="#16213e"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>
    </>
  );
};