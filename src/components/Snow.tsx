import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import * as THREE from 'three';

interface SnowProps {
  ballPosition: Vector3;
}

export const Snow = ({ ballPosition }: SnowProps) => {
  const snowRef = useRef<THREE.Points>(null);
  const particleCount = 500;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Spread snowflakes in a box around origin
      positions[i * 3] = (Math.random() - 0.5) * 40; // x
      positions[i * 3 + 1] = Math.random() * 30; // y (height)
      positions[i * 3 + 2] = Math.random() * 60; // z (depth)
      
      // Random fall velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02; // x drift
      velocities[i * 3 + 1] = -0.02 - Math.random() * 0.03; // y fall speed
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01; // z drift
    }
    
    return { positions, velocities };
  }, []);
  
  useFrame(() => {
    if (!snowRef.current) return;
    
    const positionArray = snowRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      // Update positions
      positionArray[i * 3] += velocities[i * 3];
      positionArray[i * 3 + 1] += velocities[i * 3 + 1];
      positionArray[i * 3 + 2] += velocities[i * 3 + 2];
      
      // Reset snowflake if it falls below ground or too far from ball
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
          attach={"attributes-position"}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={"#ffffff"}
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
};

