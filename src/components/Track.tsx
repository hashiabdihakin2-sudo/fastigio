import { Vector3 } from 'three';

interface TrackProps {
  ballPosition: Vector3;
}

export const Track = ({ ballPosition }: TrackProps) => {
  const SECTION_LENGTH = 4;
  const TRACK_WIDTH = 12;
  const RENDER_DISTANCE = 80; // How far ahead to render (increased for infinite effect)
  
  const sections = [];
  
  // Calculate which sections to render based on ball position - infinite track
  const startSection = Math.floor((ballPosition.z - 20) / SECTION_LENGTH);
  const endSection = Math.floor((ballPosition.z + RENDER_DISTANCE) / SECTION_LENGTH);
  
  for (let i = startSection; i <= endSection; i++) {
    const zPos = i * SECTION_LENGTH + SECTION_LENGTH / 2;
    
    // Enfärgad neon - mörkblå
    const neonColor = '#1E3A8A'; // Mörkblå
    
    sections.push(
      <group key={i} position={[0, 0, zPos]}>
        {/* Main neon platform */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[TRACK_WIDTH, 0.2, SECTION_LENGTH - 0.2]} />
          <meshStandardMaterial 
            color={neonColor}
            emissive={neonColor}
            emissiveIntensity={0.8}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
        
        {/* Platform borders */}
        <mesh position={[TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.2, 0.5, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color="#60A5FA"
            emissive="#60A5FA"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[-TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.2, 0.5, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color="#60A5FA"
            emissive="#60A5FA"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    );
  }
  
  return <>{sections}</>;
};
