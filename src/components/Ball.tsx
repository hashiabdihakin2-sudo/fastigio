import { forwardRef } from 'react';
import { Group } from 'three';

export const Ball = forwardRef<Group>((props, ref) => {
  return (
    <group ref={ref} position={[0, 1, 0]}>
      {/* Main ball */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhongMaterial 
          color="#4A90E2"
          emissive="#2C5BA0"
          emissiveIntensity={0.3}
          shininess={100}
        />
      </mesh>
      
      {/* Left eye */}
      <mesh position={[-0.1, 0.1, 0.25]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
      
      {/* Right eye */}
      <mesh position={[0.1, 0.1, 0.25]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
      
      {/* Smile */}
      <mesh position={[0, -0.05, 0.28]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
    </group>
  );
});