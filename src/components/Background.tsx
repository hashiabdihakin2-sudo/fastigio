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
    // Move background elements to create speed sensation
    if (starsRef.current) {
      starsRef.current.position.z = -ballPosition.z * 0.1; // Parallax effect
    }
    if (groundRef.current) {
      groundRef.current.position.z = -ballPosition.z * 0.3; // Ground moves faster
    }
  });

  // Generate stars
  const stars = [];
  for (let i = 0; i < 200; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = Math.random() * 50 + 10;
    const z = (Math.random() - 0.5) * 500;
    
    stars.push(
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[0.1, 4, 4]} />
        <meshBasicMaterial 
          color="#ffffff"
        />
      </mesh>
    );
  }

  // Generate ground pattern
  const groundPatterns = [];
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 100;
    const z = i * 20 - 200;
    
    groundPatterns.push(
      <mesh key={i} position={[x, -15, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 4, 8]} />
        <meshBasicMaterial 
          color="#4A90E2" 
          transparent
          opacity={0.6}
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