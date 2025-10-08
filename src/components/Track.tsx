import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface TrackProps {
  ballPosition: Vector3;
}

export const Track = ({ ballPosition }: TrackProps) => {
  const timeRef = useRef(0);
  const trackSegments = [];
  const segmentLength = 10;
  const numSegments = 15; // More segments for better depth

  useFrame((state, delta) => {
    timeRef.current += delta;
  });

  // Generate track segments ahead of the ball (positive Z direction)
  for (let i = 0; i < numSegments; i++) {
    const z = ballPosition.z + (i * segmentLength);
    const pulseIntensity = 0.3 + Math.sin(timeRef.current * 2 + i * 0.5) * 0.2;
    const gridOpacity = 0.6 + Math.sin(timeRef.current * 3 + i * 0.3) * 0.3;
    
    trackSegments.push(
      <group key={i} position={[0, 0, z]}>
        {/* Main track surface with grid pattern */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[12, 0.2, segmentLength]} />
          <meshPhongMaterial 
            color="#0A0A0F"
            emissive="#001122"
            emissiveIntensity={pulseIntensity}
          />
        </mesh>
        
        {/* Futuristic grid lines */}
        {[...Array(5)].map((_, gridIndex) => (
          <mesh key={`grid-${gridIndex}`} position={[-4 + gridIndex * 2, 0.01, 0]}>
            <boxGeometry args={[0.05, 0.01, segmentLength]} />
            <meshBasicMaterial 
              color="#00FFFF"
              transparent
              opacity={gridOpacity * 0.7}
            />
          </mesh>
        ))}
        
        {/* Perpendicular grid lines */}
        {[...Array(Math.floor(segmentLength / 2))].map((_, gridIndex) => (
          <mesh key={`grid-perp-${gridIndex}`} position={[0, 0.01, -segmentLength/2 + gridIndex * 2]}>
            <boxGeometry args={[12, 0.01, 0.05]} />
            <meshBasicMaterial 
              color="#0066FF"
              transparent
              opacity={gridOpacity * 0.5}
            />
          </mesh>
        ))}
        
        {/* Enhanced track borders with sharp neon lines */}
        <mesh position={[-6, 0.3, 0]}>
          <boxGeometry args={[0.1, 0.8, segmentLength]} />
          <meshPhongMaterial 
            color="#00FFFF"
            emissive="#00FFFF"
            emissiveIntensity={1.2}
          />
        </mesh>
        <mesh position={[6, 0.3, 0]}>
          <boxGeometry args={[0.1, 0.8, segmentLength]} />
          <meshPhongMaterial 
            color="#00FFFF"
            emissive="#00FFFF"
            emissiveIntensity={1.2}
          />
        </mesh>
        
        {/* Glowing border effects */}
        <mesh position={[-6, 0.3, 0]}>
          <boxGeometry args={[0.3, 1, segmentLength]} />
          <meshBasicMaterial 
            color="#00FFFF"
            transparent
            opacity={0.2 + Math.sin(timeRef.current * 4 + i * 0.5) * 0.1}
          />
        </mesh>
        <mesh position={[6, 0.3, 0]}>
          <boxGeometry args={[0.3, 1, segmentLength]} />
          <meshBasicMaterial 
            color="#00FFFF"
            transparent
            opacity={0.2 + Math.sin(timeRef.current * 4 + i * 0.5) * 0.1}
          />
        </mesh>

        {/* Central racing line with pulsing effect */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.2, 0.02, segmentLength]} />
          <meshPhongMaterial 
            color="#FF0080"
            emissive="#FF0080"
            emissiveIntensity={0.8 + Math.sin(timeRef.current * 5 + i * 0.8) * 0.4}
          />
        </mesh>
        
        {/* Side accent lines */}
        <mesh position={[-3, 0.01, 0]}>
          <boxGeometry args={[0.1, 0.01, segmentLength]} />
          <meshBasicMaterial 
            color="#FF6B00"
            transparent
            opacity={0.8 + Math.sin(timeRef.current * 3 + i * 0.4) * 0.2}
          />
        </mesh>
        <mesh position={[3, 0.01, 0]}>
          <boxGeometry args={[0.1, 0.01, segmentLength]} />
          <meshBasicMaterial 
            color="#FF6B00"
            transparent
            opacity={0.8 + Math.sin(timeRef.current * 3 + i * 0.4) * 0.2}
          />
        </mesh>
        
        {/* Digital rain effect - vertical lines */}
        {Math.random() > 0.7 && (
          <mesh position={[(Math.random() - 0.5) * 10, 2 + Math.random() * 3, 0]}>
            <boxGeometry args={[0.02, 1, 0.02]} />
            <meshBasicMaterial 
              color="#00FF00"
              transparent
              opacity={0.7}
            />
          </mesh>
        )}
      </group>
    );
  }

  return <>{trackSegments}</>;
};