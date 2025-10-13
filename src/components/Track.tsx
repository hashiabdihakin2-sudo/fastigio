import { Vector3 } from 'three';

interface TrackProps {
  ballPosition: Vector3;
}

export const Track = ({ ballPosition }: TrackProps) => {
  const NUM_SECTIONS = 9;
  const SECTION_LENGTH = 4;
  const TRACK_WIDTH = 6;
  
  const sections = [];
  
  for (let i = 0; i < NUM_SECTIONS; i++) {
    const zPos = i * SECTION_LENGTH + SECTION_LENGTH / 2;
    
    // Alternate colors for visual distinction
    const colors = [
      '#1a237e', // dark blue
      '#283593', // medium blue
      '#3949ab', // light blue
      '#5c6bc0', // lighter blue
      '#7986cb', // very light blue
      '#9fa8da', // pale blue
      '#c5cae9', // very pale blue
      '#e8eaf6', // almost white blue
      '#f3e5f5', // pinkish white
    ];
    
    sections.push(
      <group key={i} position={[0, 0, zPos]}>
        {/* Main platform */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[TRACK_WIDTH, 0.2, SECTION_LENGTH - 0.2]} />
          <meshStandardMaterial 
            color={colors[i]}
            emissive={colors[i]}
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
        
        {/* Section number indicator */}
        <mesh position={[0, 0.05, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial 
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.3}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
    );
  }
  
  return <>{sections}</>;
};
