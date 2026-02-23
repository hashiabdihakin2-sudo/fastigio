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
        {/* Elegant grey stone platform */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[TRACK_WIDTH, 0.2, SECTION_LENGTH - 0.2]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#2a2a2a' : '#333333'}
            emissive={i % 2 === 0 ? '#1a1a1a' : '#222222'}
            emissiveIntensity={0.2}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        
        {/* Subtle marble-like top layer */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[TRACK_WIDTH - 0.5, 0.08, SECTION_LENGTH - 0.3]} />
          <meshStandardMaterial 
            color="#3a3a3a"
            emissive="#2a2a2a"
            emissiveIntensity={0.15}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>
        
        {/* Gold and white borders */}
        <mesh position={[TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#c4a35a' : '#e0e0e0'}
            emissive={i % 2 === 0 ? '#aa8833' : '#aaaaaa'}
            emissiveIntensity={0.3}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[-TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#e0e0e0' : '#c4a35a'}
            emissive={i % 2 === 0 ? '#aaaaaa' : '#aa8833'}
            emissiveIntensity={0.3}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Monument pillars - classical style */}
        {i % 5 === 0 && (
          <>
            {/* Left pillar - classical column */}
            <group position={[-TRACK_WIDTH / 2 - 2, 0, 0]}>
              <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[1.2, 0.6, 1.2]} />
                <meshStandardMaterial color="#d0d0d0" metalness={0.2} roughness={0.6} />
              </mesh>
              <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.3, 0.35, 3, 12]} />
                <meshStandardMaterial color="#c8c8c8" metalness={0.3} roughness={0.5} />
              </mesh>
              <mesh position={[0, 3.7, 0]}>
                <boxGeometry args={[1, 0.4, 1]} />
                <meshStandardMaterial color="#d0d0d0" metalness={0.2} roughness={0.6} />
              </mesh>
            </group>
            
            {/* Right pillar */}
            <group position={[TRACK_WIDTH / 2 + 2, 0, 0]}>
              <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[1.2, 0.6, 1.2]} />
                <meshStandardMaterial color="#d0d0d0" metalness={0.2} roughness={0.6} />
              </mesh>
              <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.3, 0.35, 3, 12]} />
                <meshStandardMaterial color="#c8c8c8" metalness={0.3} roughness={0.5} />
              </mesh>
              <mesh position={[0, 3.7, 0]}>
                <boxGeometry args={[1, 0.4, 1]} />
                <meshStandardMaterial color="#d0d0d0" metalness={0.2} roughness={0.6} />
              </mesh>
            </group>
          </>
        )}
        
        {/* Warm ambient lights */}
        {i % 2 === 0 && (
          <>
            <pointLight position={[TRACK_WIDTH / 2, 0.5, -1]} color="#c4a35a" intensity={0.4} distance={3} />
            <pointLight position={[-TRACK_WIDTH / 2, 0.5, 1]} color="#e0d0b0" intensity={0.3} distance={3} />
          </>
        )}
        {i % 3 === 0 && (
          <pointLight position={[0, 2, 0]} color="#ffffff" intensity={0.3} distance={4} />
        )}
      </group>
    );
  }
  
  return <>{sections}</>;
};
