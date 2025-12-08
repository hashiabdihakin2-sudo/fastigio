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
    
    sections.push(
      <group key={i} position={[0, 0, zPos]}>
        {/* Snowy ice platform - Christmas themed */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[TRACK_WIDTH, 0.2, SECTION_LENGTH - 0.2]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#1a472a' : '#165B33'}
            emissive={i % 2 === 0 ? '#0d2818' : '#0f3d22'}
            emissiveIntensity={0.3}
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        
        {/* Snow layer on top */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[TRACK_WIDTH - 0.5, 0.08, SECTION_LENGTH - 0.3]} />
          <meshStandardMaterial 
            color="#f0f8ff"
            emissive="#e8f4ff"
            emissiveIntensity={0.2}
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        
        {/* Christmas red borders with candy cane stripes */}
        <mesh position={[TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#BB2528' : '#ffffff'}
            emissive={i % 2 === 0 ? '#8B0000' : '#f5f5f5'}
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[-TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#ffffff' : '#BB2528'}
            emissive={i % 2 === 0 ? '#f5f5f5' : '#8B0000'}
            emissiveIntensity={0.4}
          />
        </mesh>
        
        {/* Occasional Christmas decorations */}
        {i % 5 === 0 && (
          <>
            {/* Christmas tree on left */}
            <group position={[-TRACK_WIDTH / 2 - 2, 0, 0]}>
              <mesh position={[0, 1.5, 0]}>
                <coneGeometry args={[1, 2.5, 8]} />
                <meshStandardMaterial color="#165B33" emissive="#0d2818" emissiveIntensity={0.3} />
              </mesh>
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.2, 0.25, 0.6]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              {/* Star on top */}
              <mesh position={[0, 2.9, 0]}>
                <octahedronGeometry args={[0.3]} />
                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} />
              </mesh>
            </group>
            {/* Christmas tree on right */}
            <group position={[TRACK_WIDTH / 2 + 2, 0, 0]}>
              <mesh position={[0, 1.5, 0]}>
                <coneGeometry args={[1, 2.5, 8]} />
                <meshStandardMaterial color="#165B33" emissive="#0d2818" emissiveIntensity={0.3} />
              </mesh>
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.2, 0.25, 0.6]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              {/* Star on top */}
              <mesh position={[0, 2.9, 0]}>
                <octahedronGeometry args={[0.3]} />
                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} />
              </mesh>
            </group>
          </>
        )}
        
        {/* Christmas lights along the borders */}
        {i % 2 === 0 && (
          <>
            <pointLight position={[TRACK_WIDTH / 2, 0.5, -1]} color="#FF0000" intensity={0.5} distance={3} />
            <pointLight position={[-TRACK_WIDTH / 2, 0.5, 1]} color="#00FF00" intensity={0.5} distance={3} />
          </>
        )}
      </group>
    );
  }
  
  return <>{sections}</>;
};
