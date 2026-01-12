import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import * as THREE from 'three';

interface FireworksProps {
  ballPosition: Vector3;
}

interface Firework {
  position: [number, number, number];
  color: string;
  particles: Float32Array;
  velocities: Float32Array;
  life: number;
  maxLife: number;
}

const FIREWORK_COLORS = [
  '#FFD700', // Gold
  '#FF1493', // Pink
  '#00FFFF', // Cyan
  '#9400D3', // Purple
  '#FF4500', // Orange
  '#00FF00', // Green
];

export const Fireworks = ({ ballPosition }: FireworksProps) => {
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const lastSpawnTime = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  
  // Spawn new fireworks occasionally
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Spawn a new firework every 2-4 seconds
    if (time - lastSpawnTime.current > 2 + Math.random() * 2) {
      lastSpawnTime.current = time;
      
      // Random position around the player
      const newFirework: Firework = {
        position: [
          ballPosition.x + (Math.random() - 0.5) * 30,
          8 + Math.random() * 10,
          ballPosition.z + 20 + Math.random() * 40
        ],
        color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        particles: new Float32Array(30 * 3), // 30 particles per firework
        velocities: new Float32Array(30 * 3),
        life: 0,
        maxLife: 60 + Math.random() * 30 // frames
      };
      
      // Initialize particles in burst pattern
      for (let i = 0; i < 30; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 0.1 + Math.random() * 0.15;
        
        newFirework.particles[i * 3] = 0;
        newFirework.particles[i * 3 + 1] = 0;
        newFirework.particles[i * 3 + 2] = 0;
        
        newFirework.velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        newFirework.velocities[i * 3 + 1] = Math.cos(phi) * speed;
        newFirework.velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
      }
      
      setFireworks(prev => [...prev.slice(-4), newFirework]); // Keep max 5 fireworks
    }
    
    // Update existing fireworks
    setFireworks(prev => prev.map(fw => {
      const newParticles = new Float32Array(fw.particles);
      
      for (let i = 0; i < 30; i++) {
        newParticles[i * 3] += fw.velocities[i * 3];
        newParticles[i * 3 + 1] += fw.velocities[i * 3 + 1] - 0.003; // gravity
        newParticles[i * 3 + 2] += fw.velocities[i * 3 + 2];
      }
      
      return {
        ...fw,
        particles: newParticles,
        life: fw.life + 1
      };
    }).filter(fw => fw.life < fw.maxLife));
  });
  
  return (
    <group ref={groupRef}>
      {fireworks.map((fw, idx) => {
        const opacity = Math.max(0, 1 - fw.life / fw.maxLife);
        
        return (
          <group key={idx} position={fw.position}>
            <points>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={30}
                  array={fw.particles}
                  itemSize={3}
                />
              </bufferGeometry>
              <pointsMaterial
                size={0.3}
                color={fw.color}
                transparent
                opacity={opacity}
                sizeAttenuation
              />
            </points>
            {/* Central glow */}
            <pointLight
              position={[0, 0, 0]}
              color={fw.color}
              intensity={opacity * 2}
              distance={8}
            />
          </group>
        );
      })}
    </group>
  );
};