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
        {/* Purple/magenta gradient platform */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[TRACK_WIDTH, 0.2, SECTION_LENGTH - 0.2]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#1a0a2e' : '#200e3a'}
            emissive={i % 2 === 0 ? '#3a1060' : '#2a0850'}
            emissiveIntensity={0.3}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
        
        {/* Shimmering top layer */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[TRACK_WIDTH - 0.5, 0.08, SECTION_LENGTH - 0.3]} />
          <meshStandardMaterial 
            color="#2a1050"
            emissive="#4a1880"
            emissiveIntensity={0.2}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
        
        {/* Gold and magenta borders */}
        <mesh position={[TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#D4AF37' : '#E91E63'}
            emissive={i % 2 === 0 ? '#aa8833' : '#C2185B'}
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[-TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#E91E63' : '#D4AF37'}
            emissive={i % 2 === 0 ? '#C2185B' : '#aa8833'}
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Elegant arches - classical feminine architecture */}
        {i % 5 === 0 && (
          <>
            {/* Left arch */}
            <group position={[-TRACK_WIDTH / 2 - 2, 0, 0]}>
              <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[1.2, 0.6, 1.2]} />
                <meshStandardMaterial color="#E8D0F0" metalness={0.3} roughness={0.5} />
              </mesh>
              <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.25, 0.3, 3, 16]} />
                <meshStandardMaterial color="#F0E0F8" metalness={0.4} roughness={0.4} emissive="#9C27B0" emissiveIntensity={0.1} />
              </mesh>
              <mesh position={[0, 3.7, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="#E91E63" metalness={0.5} roughness={0.3} emissive="#E91E63" emissiveIntensity={0.2} />
              </mesh>
            </group>
            
            {/* Right arch */}
            <group position={[TRACK_WIDTH / 2 + 2, 0, 0]}>
              <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[1.2, 0.6, 1.2]} />
                <meshStandardMaterial color="#E8D0F0" metalness={0.3} roughness={0.5} />
              </mesh>
              <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.25, 0.3, 3, 16]} />
                <meshStandardMaterial color="#F0E0F8" metalness={0.4} roughness={0.4} emissive="#9C27B0" emissiveIntensity={0.1} />
              </mesh>
              <mesh position={[0, 3.7, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="#E91E63" metalness={0.5} roughness={0.3} emissive="#E91E63" emissiveIntensity={0.2} />
              </mesh>
            </group>
          </>
        )}
        
        {/* Warm purple/pink ambient lights */}
        {i % 2 === 0 && (
          <>
            <pointLight position={[TRACK_WIDTH / 2, 0.5, -1]} color="#E91E63" intensity={0.4} distance={3} />
            <pointLight position={[-TRACK_WIDTH / 2, 0.5, 1]} color="#9C27B0" intensity={0.3} distance={3} />
          </>
        )}
        {i % 3 === 0 && (
          <pointLight position={[0, 2, 0]} color="#F8BBD9" intensity={0.3} distance={4} />
        )}
      </group>
    );
  }
  
  return <>{sections}</>;
};