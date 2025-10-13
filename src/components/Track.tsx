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
    
    // Cycle through colors
    const colorIndex = ((i % 9) + 9) % 9; // Handle negative indices
    const colors = [
      '#1a237e', '#283593', '#3949ab', '#5c6bc0',
      '#7986cb', '#9fa8da', '#c5cae9', '#e8eaf6', '#f3e5f5',
    ];
    
    sections.push(
      <group key={i} position={[0, 0, zPos]}>
        {/* Main platform */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[TRACK_WIDTH, 0.2, SECTION_LENGTH - 0.2]} />
          <meshStandardMaterial 
            color={colors[colorIndex]}
            emissive={colors[colorIndex]}
            emissiveIntensity={0.2}
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
