import { forwardRef } from 'react';
import { Group } from 'three';
import { useGameStore } from '@/store/gameStore';

const SKIN_CONFIGS = {
  classic: { color: '#00BFFF', emissive: '#4DD0E1', emissiveIntensity: 0.5 },
  fire: { color: '#FF4500', emissive: '#FF6347', emissiveIntensity: 0.8 },
  ice: { color: '#87CEEB', emissive: '#B0E0E6', emissiveIntensity: 0.7 },
  rainbow: { color: '#FF1493', emissive: '#9400D3', emissiveIntensity: 0.9 },
  golden: { color: '#FFD700', emissive: '#FFA500', emissiveIntensity: 0.6 },
};

export const Ball = forwardRef<Group>((props, ref) => {
  const { selectedSkin } = useGameStore();
  const skinConfig = SKIN_CONFIGS[selectedSkin];

  return (
    <group ref={ref} position={[0, 1, 0]}>
      {/* Main ball */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhongMaterial 
          color={skinConfig.color}
          emissive={skinConfig.emissive}
          emissiveIntensity={skinConfig.emissiveIntensity}
          shininess={100}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 0.05, 0.25]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 0.05, 0.25]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Smile */}
      <mesh position={[0, -0.05, 0.26]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.12, 0.02, 8, 16, Math.PI]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
});