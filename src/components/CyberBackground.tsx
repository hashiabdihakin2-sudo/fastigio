import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

interface CyberBackgroundProps {
  ballPosition: Vector3;
}

export const CyberBackground = ({ ballPosition }: CyberBackgroundProps) => {
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
  });

  const backgroundElements = [];
  
  // Cyber buildings with neon glow
  for (let i = 0; i < 20; i++) {
    const x = (i - 10) * 15;
    const height = 20 + Math.random() * 30;
    const z = ballPosition.z + 200 + Math.random() * 100;
    
    backgroundElements.push(
      <mesh key={`building-${i}`} position={[x, height / 2, z]}>
        <boxGeometry args={[8, height, 8]} />
        <meshBasicMaterial 
          color="#0a0a20"
          transparent
          opacity={0.3}
        />
      </mesh>
    );
    
    // Neon window lights
    for (let j = 0; j < 5; j++) {
      const lightY = 5 + j * (height / 6);
      const colors = ['#00BFFF', '#7B68EE', '#00CED1', '#FFD700'];
      backgroundElements.push(
        <mesh key={`light-${i}-${j}`} position={[x, lightY, z + 4]}>
          <boxGeometry args={[1, 1, 0.1]} />
          <meshBasicMaterial 
            color={colors[(i + j) % colors.length]}
            transparent
            opacity={0.5 + Math.sin(timeRef.current * 1.5 + i + j) * 0.2}
          />
        </mesh>
      );
    }
  }
  
  // Floating particles - cyan/blue
  for (let i = 0; i < 30; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = 10 + Math.random() * 20;
    const z = ballPosition.z + 50 + Math.random() * 150;
    const speed = 0.3 + Math.random() * 0.5;
    
    backgroundElements.push(
      <mesh 
        key={`particle-${i}`} 
        position={[
          x + Math.sin(timeRef.current * speed + i) * 3,
          y + Math.cos(timeRef.current * speed * 0.7 + i) * 2,
          z
        ]}
        rotation={[timeRef.current * 0.5 + i, timeRef.current * 0.3, 0]}
      >
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshBasicMaterial 
          color={i % 3 === 0 ? '#00BFFF' : i % 3 === 1 ? '#7B68EE' : '#00CED1'}
          transparent
          opacity={0.4 + Math.sin(timeRef.current * 2 + i) * 0.2}
        />
      </mesh>
    );
  }
  
  // Glowing rings - blue and cyan
  for (let i = 0; i < 8; i++) {
    const x = (Math.random() - 0.5) * 80;
    const y = 15 + Math.random() * 10;
    const z = ballPosition.z + 100 + i * 30;
    const scale = 1 + Math.sin(timeRef.current * 1.5 + i) * 0.2;
    
    backgroundElements.push(
      <mesh 
        key={`ring-${i}`}
        position={[x, y, z]}
        rotation={[Math.PI / 2, 0, timeRef.current * 0.3 + i]}
        scale={[scale, scale, 1]}
      >
        <ringGeometry args={[3, 3.15, 32]} />
        <meshBasicMaterial 
          color={i % 2 === 0 ? '#00BFFF' : '#7B68EE'}
          transparent
          opacity={0.25}
          side={2}
        />
      </mesh>
    );
  }

  return (
    <group>
      {backgroundElements}
      
      {/* Deep blue atmosphere */}
      <mesh position={[0, 0, ballPosition.z + 200]} scale={[200, 100, 200]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial 
          color="#020510"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};
