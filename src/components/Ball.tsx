import { forwardRef } from 'react';
import { Mesh } from 'three';

export const Ball = forwardRef<Mesh>((props, ref) => {
  return (
    <mesh ref={ref} position={[0, 1, 0]} castShadow receiveShadow>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshPhongMaterial 
        color="#4A90E2"
        emissive="#2C5BA0"
        emissiveIntensity={0.3}
        shininess={100}
      />
    </mesh>
  );
});