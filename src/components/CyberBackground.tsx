import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

interface CyberBackgroundProps {
  ballPosition: Vector3;
}

export const CyberBackground = ({ ballPosition }: CyberBackgroundProps) => {
  const timeRef = useRef(0);
  const particlesRef = useRef<any[]>([]);

  useFrame((state, delta) => {
    timeRef.current += delta;
  });

  // Generate background elements
  const backgroundElements = [];
  
  // Distant city skyline
  for (let i = 0; i < 20; i++) {
    const x = (i - 10) * 15;
    const height = 20 + Math.random() * 30;
    const z = ballPosition.z + 200 + Math.random() * 100;
    
    backgroundElements.push(
      <mesh key={`building-${i}`} position={[x, height / 2, z]}>
        <boxGeometry args={[8, height, 8]} />
        <meshBasicMaterial 
          color="#001122"
          transparent
          opacity={0.3}
        />
      </mesh>
    );
    
    // Building lights
    for (let j = 0; j < 5; j++) {
      const lightY = 5 + j * (height / 6);
      backgroundElements.push(
        <mesh key={`light-${i}-${j}`} position={[x, lightY, z + 4]}>
          <boxGeometry args={[1, 1, 0.1]} />
          <meshBasicMaterial 
            color={Math.random() > 0.7 ? "#00FFFF" : "#FF0080"}
            transparent
            opacity={0.8 + Math.sin(timeRef.current * 2 + i + j) * 0.2}
          />
        </mesh>
      );
    }
  }
  
  // Floating data streams
  for (let i = 0; i < 30; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = 10 + Math.random() * 20;
    const z = ballPosition.z + 50 + Math.random() * 150;
    const speed = 0.5 + Math.random() * 1;
    
    backgroundElements.push(
      <mesh 
        key={`stream-${i}`} 
        position={[
          x + Math.sin(timeRef.current * speed + i) * 5,
          y + Math.cos(timeRef.current * speed * 0.7 + i) * 2,
          z
        ]}
      >
        <boxGeometry args={[0.1, 0.1, 2]} />
        <meshBasicMaterial 
          color="#00FF00"
          transparent
          opacity={0.6 + Math.sin(timeRef.current * 3 + i) * 0.3}
        />
      </mesh>
    );
  }
  
  // Holographic rings
  for (let i = 0; i < 10; i++) {
    const x = (Math.random() - 0.5) * 80;
    const y = 15 + Math.random() * 10;
    const z = ballPosition.z + 100 + i * 30;
    const scale = 1 + Math.sin(timeRef.current * 2 + i) * 0.3;
    
    backgroundElements.push(
      <mesh 
        key={`ring-${i}`}
        position={[x, y, z]}
        rotation={[Math.PI / 2, 0, timeRef.current * 0.5 + i]}
        scale={[scale, scale, 1]}
      >
        <ringGeometry args={[3, 3.2, 32]} />
        <meshBasicMaterial 
          color="#FF6B00"
          transparent
          opacity={0.4}
          side={2}
        />
      </mesh>
    );
  }
  
  // Energy bolts
  for (let i = 0; i < 15; i++) {
    const x = (Math.random() - 0.5) * 60;
    const y = 20 + Math.random() * 15;
    const z = ballPosition.z + 80 + Math.random() * 100;
    const intensity = 0.5 + Math.sin(timeRef.current * 8 + i) * 0.5;
    
    if (intensity > 0.8) {
      backgroundElements.push(
        <mesh key={`bolt-${i}`} position={[x, y, z]}>
          <boxGeometry args={[0.2, 10, 0.2]} />
          <meshBasicMaterial 
            color="#FFFFFF"
            transparent
            opacity={intensity}
          />
        </mesh>
      );
    }
  }

  return (
    <group>
      {backgroundElements}
      
      {/* Animated fog/atmosphere */}
      <mesh position={[0, 0, ballPosition.z + 200]} scale={[200, 100, 200]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial 
          color="#000044"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};