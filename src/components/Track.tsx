import { Vector3 } from 'three';

interface TrackProps {
  ballPosition: Vector3;
}

export const Track = ({ ballPosition }: TrackProps) => {
  const SECTION_LENGTH = 4;
  const TRACK_WIDTH = 12;
  const RENDER_DISTANCE = 50;
  
  const sections = [];
  
  const startSection = Math.floor((ballPosition.z - 10) / SECTION_LENGTH);
  const endSection = Math.floor((ballPosition.z + RENDER_DISTANCE) / SECTION_LENGTH);
  
  for (let i = startSection; i <= endSection; i++) {
    const zPos = i * SECTION_LENGTH + SECTION_LENGTH / 2;
    
    sections.push(
      <group key={i} position={[0, 0, zPos]}>
        {/* Dark midnight blue platform - New Year 2026 themed */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[TRACK_WIDTH, 0.2, SECTION_LENGTH - 0.2]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#0a1628' : '#0f1f38'}
            emissive={i % 2 === 0 ? '#1a0a3a' : '#0a1a4a'}
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        
        {/* Glittery top layer */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[TRACK_WIDTH - 0.5, 0.08, SECTION_LENGTH - 0.3]} />
          <meshStandardMaterial 
            color="#1a1a3e"
            emissive="#2a1a5e"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Golden/Silver New Year borders */}
        <mesh position={[TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#FFD700' : '#C0C0C0'}
            emissive={i % 2 === 0 ? '#FFA500' : '#808080'}
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[-TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#C0C0C0' : '#FFD700'}
            emissive={i % 2 === 0 ? '#808080' : '#FFA500'}
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* New Year 2026 decorations - champagne towers and fireworks */}
        {i % 5 === 0 && (
          <>
            {/* Champagne tower on left */}
            <group position={[-TRACK_WIDTH / 2 - 2, 0, 0]}>
              {/* Champagne bottle */}
              <mesh position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
                <meshStandardMaterial 
                  color="#1a472a" 
                  emissive="#0d2818" 
                  emissiveIntensity={0.3}
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
              {/* Golden top */}
              <mesh position={[0, 2.4, 0]}>
                <sphereGeometry args={[0.25, 8, 8]} />
                <meshStandardMaterial 
                  color="#FFD700" 
                  emissive="#FFA500" 
                  emissiveIntensity={0.8}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              {/* 2026 sparkle */}
              <mesh position={[0, 3, 0]}>
                <octahedronGeometry args={[0.4]} />
                <meshStandardMaterial 
                  color="#FFD700" 
                  emissive="#FFFF00" 
                  emissiveIntensity={1.2}
                />
              </mesh>
            </group>
            
            {/* Firework display on right */}
            <group position={[TRACK_WIDTH / 2 + 2, 0, 0]}>
              {/* Firework rocket */}
              <mesh position={[0, 1.5, 0]}>
                <coneGeometry args={[0.3, 1.5, 6]} />
                <meshStandardMaterial 
                  color="#FF1493" 
                  emissive="#FF00FF" 
                  emissiveIntensity={0.6}
                />
              </mesh>
              {/* Explosion effect */}
              <mesh position={[0, 2.8, 0]}>
                <icosahedronGeometry args={[0.6, 0]} />
                <meshStandardMaterial 
                  color="#00FFFF" 
                  emissive="#00FFFF" 
                  emissiveIntensity={1.5}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              {/* Sparkles */}
              {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
                <mesh 
                  key={idx}
                  position={[
                    Math.cos(angle * Math.PI / 180) * 0.8,
                    2.8 + Math.sin(angle * Math.PI / 180) * 0.5,
                    0
                  ]}
                >
                  <sphereGeometry args={[0.1, 6, 6]} />
                  <meshStandardMaterial 
                    color={idx % 2 === 0 ? '#FFD700' : '#FF1493'}
                    emissive={idx % 2 === 0 ? '#FFD700' : '#FF1493'}
                    emissiveIntensity={1.2}
                  />
                </mesh>
              ))}
            </group>
          </>
        )}
        
        {/* Festive New Year lights - gold, purple, cyan */}
        {i % 2 === 0 && (
          <>
            <pointLight position={[TRACK_WIDTH / 2, 0.5, -1]} color="#FFD700" intensity={0.6} distance={3} />
            <pointLight position={[-TRACK_WIDTH / 2, 0.5, 1]} color="#9400D3" intensity={0.6} distance={3} />
          </>
        )}
        {i % 3 === 0 && (
          <pointLight position={[0, 2, 0]} color="#00FFFF" intensity={0.4} distance={4} />
        )}
      </group>
    );
  }
  
  return <>{sections}</>;
};