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
        {/* Deep blue neon platform - Black History Month themed */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[TRACK_WIDTH, 0.2, SECTION_LENGTH - 0.2]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#0a1832' : '#0d2045'}
            emissive={i % 2 === 0 ? '#001a4a' : '#002060'}
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        
        {/* Glowing neon top layer */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[TRACK_WIDTH - 0.5, 0.08, SECTION_LENGTH - 0.3]} />
          <meshStandardMaterial 
            color="#0a2550"
            emissive="#0040a0"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Pan-African colors borders - Red, Black, Green */}
        <mesh position={[TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 3 === 0 ? '#DC143C' : i % 3 === 1 ? '#1a1a1a' : '#228B22'}
            emissive={i % 3 === 0 ? '#FF0040' : i % 3 === 1 ? '#333333' : '#00FF40'}
            emissiveIntensity={0.7}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[-TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 3 === 0 ? '#228B22' : i % 3 === 1 ? '#DC143C' : '#1a1a1a'}
            emissive={i % 3 === 0 ? '#00FF40' : i % 3 === 1 ? '#FF0040' : '#333333'}
            emissiveIntensity={0.7}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Decorative monuments - celebrating Black excellence */}
        {i % 5 === 0 && (
          <>
            {/* Unity Fist monument on left */}
            <group position={[-TRACK_WIDTH / 2 - 2, 0, 0]}>
              {/* Base pedestal */}
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[1.5, 1, 1.5]} />
                <meshStandardMaterial 
                  color="#1a1a1a" 
                  emissive="#333333" 
                  emissiveIntensity={0.3}
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
              {/* Raised fist */}
              <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.4, 0.35, 1.5, 8]} />
                <meshStandardMaterial 
                  color="#8B4513" 
                  emissive="#5a3000" 
                  emissiveIntensity={0.4}
                  metalness={0.6}
                  roughness={0.4}
                />
              </mesh>
              {/* Glowing crown */}
              <mesh position={[0, 3, 0]}>
                <coneGeometry args={[0.5, 0.6, 5]} />
                <meshStandardMaterial 
                  color="#FFD700" 
                  emissive="#FFA500" 
                  emissiveIntensity={1}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            </group>
            
            {/* Adinkra symbol display on right */}
            <group position={[TRACK_WIDTH / 2 + 2, 0, 0]}>
              {/* Display pillar */}
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.2, 0.4, 3, 6]} />
                <meshStandardMaterial 
                  color="#228B22" 
                  emissive="#00FF40" 
                  emissiveIntensity={0.5}
                />
              </mesh>
              {/* Sankofa symbol (circle representing looking back) */}
              <mesh position={[0, 3.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.5, 0.15, 8, 16]} />
                <meshStandardMaterial 
                  color="#DC143C" 
                  emissive="#FF0040" 
                  emissiveIntensity={0.8}
                />
              </mesh>
              {/* Inner star */}
              <mesh position={[0, 3.2, 0]}>
                <octahedronGeometry args={[0.25]} />
                <meshStandardMaterial 
                  color="#FFD700"
                  emissive="#FFD700"
                  emissiveIntensity={1.2}
                />
              </mesh>
            </group>
          </>
        )}
        
        {/* Neon lights - Red, Green, Blue accents */}
        {i % 2 === 0 && (
          <>
            <pointLight position={[TRACK_WIDTH / 2, 0.5, -1]} color="#00BFFF" intensity={0.7} distance={3} />
            <pointLight position={[-TRACK_WIDTH / 2, 0.5, 1]} color="#FF1493" intensity={0.6} distance={3} />
          </>
        )}
        {i % 3 === 0 && (
          <pointLight position={[0, 2, 0]} color="#00FF80" intensity={0.5} distance={4} />
        )}
      </group>
    );
  }
  
  return <>{sections}</>;
};