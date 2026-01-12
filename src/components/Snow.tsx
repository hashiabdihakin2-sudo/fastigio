import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import * as THREE from 'three';

interface SnowProps {
  ballPosition: Vector3;
}

// New Year 2026 - Confetti/Glitter instead of snow
export const Snow = ({ ballPosition }: SnowProps) => {
  const snowRef = useRef<THREE.Points>(null);
  const particleCount = 400;
  
  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const confettiColors = [
      [1, 0.84, 0],      // Gold
      [1, 0.08, 0.58],   // Pink
      [0, 1, 1],         // Cyan
      [0.58, 0, 0.83],   // Purple
      [1, 1, 1],         // White
      [1, 0.65, 0],      // Orange
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Spread confetti in a box around origin
      positions[i * 3] = (Math.random() - 0.5) * 40; // x
      positions[i * 3 + 1] = Math.random() * 30; // y (height)
      positions[i * 3 + 2] = Math.random() * 60; // z (depth)
      
      // Random fall velocities - slower than snow, more floaty
      velocities[i * 3] = (Math.random() - 0.5) * 0.04; // x drift (more drift)
      velocities[i * 3 + 1] = -0.015 - Math.random() * 0.02; // y fall speed (slower)
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02; // z drift
      
      // Random colors
      const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    }
    
    return { positions, velocities, colors };
  }, []);
  
  useFrame(() => {
    if (!snowRef.current) return;
    
    const positionArray = snowRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      // Update positions with slight wobble for confetti effect
      positionArray[i * 3] += velocities[i * 3] + Math.sin(Date.now() * 0.001 + i) * 0.01;
      positionArray[i * 3 + 1] += velocities[i * 3 + 1];
      positionArray[i * 3 + 2] += velocities[i * 3 + 2];
      
      // Reset confetti if it falls below ground or too far from ball
      if (positionArray[i * 3 + 1] < -2) {
        positionArray[i * 3] = ballPosition.x + (Math.random() - 0.5) * 40;
        positionArray[i * 3 + 1] = 25 + Math.random() * 10;
        positionArray[i * 3 + 2] = ballPosition.z + Math.random() * 50;
      }
      
      // Keep snow near ball in z direction
      if (positionArray[i * 3 + 2] < ballPosition.z - 20) {
        positionArray[i * 3 + 2] = ballPosition.z + 40 + Math.random() * 20;
        positionArray[i * 3] = ballPosition.x + (Math.random() - 0.5) * 40;
      }
    }
    
    snowRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={snowRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
};
