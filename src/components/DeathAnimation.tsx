import { useEffect, useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';

interface DeathAnimationProps {
  position: [number, number, number];
  onComplete: () => void;
}

export const DeathAnimation = ({ position, onComplete }: DeathAnimationProps) => {
  const groupRef = useRef<Group>(null);
  const startTime = useRef(Date.now());
  const completed = useRef(false);

  useFrame(() => {
    if (!groupRef.current || completed.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;
    
    if (elapsed > 1.5) {
      if (!completed.current) {
        completed.current = true;
        onComplete();
      }
      return;
    }

    // Explosion effect - particles fly outward
    const scale = 1 - elapsed * 0.5;
    groupRef.current.scale.set(scale, scale, scale);
    groupRef.current.rotation.x += 0.1;
    groupRef.current.rotation.y += 0.15;
    groupRef.current.rotation.z += 0.05;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Central explosion sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshPhongMaterial 
          color="#FF4500" 
          emissive="#FF4500" 
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Particle fragments */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 0.5;
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(i * 0.5) * 0.3,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshPhongMaterial 
              color="#FFD700" 
              emissive="#FFA500" 
              emissiveIntensity={1.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};
