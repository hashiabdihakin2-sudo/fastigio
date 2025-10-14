import { Vector3 } from 'three';

interface TrackProps {
  ballPosition: Vector3;
}

export const Track = ({ ballPosition }: TrackProps) => {
  const SECTION_LENGTH = 4;
  const TRACK_WIDTH = 12;
  const RENDER_DISTANCE = 50; // How far ahead to render
  
  const sections = [];
  
  // Calculate which sections to render based on ball position
  const startSection = Math.floor((ballPosition.z - 10) / SECTION_LENGTH);
  const endSection = Math.floor((ballPosition.z + RENDER_DISTANCE) / SECTION_LENGTH);
  
  for (let i = startSection; i <= endSection; i++) {
    const zPos = i * SECTION_LENGTH + SECTION_LENGTH / 2;
    
    // Neon gradient colors - mer levande färger
    const colorIndex = ((i % 6) + 6) % 6;
    const neonColors = [
      '#FF00FF', // Magenta
      '#00FFFF', // Cyan
      '#FF0080', // Pink
      '#00FF00', // Green
      '#FFFF00', // Yellow
      '#FF6B00', // Orange
    ];
    
    sections.push(
      <group key={i} position={[0, 0, zPos]}>
        {/* Main neon platform */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[TRACK_WIDTH, 0.2, SECTION_LENGTH - 0.2]} />
          <meshStandardMaterial 
            color={neonColors[colorIndex]}
            emissive={neonColors[colorIndex]}
            emissiveIntensity={0.6}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
        
        {/* Platform borders */}
        <mesh position={[TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.2, 0.5, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color="#00FFFF"
            emissive="#00FFFF"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[-TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.2, 0.5, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color="#00FFFF"
            emissive="#00FFFF"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    );
  }
  
  return <>{sections}</>;
};
