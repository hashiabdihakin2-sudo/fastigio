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
        {/* Dark blue platform */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[TRACK_WIDTH, 0.2, SECTION_LENGTH - 0.2]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#0a1628' : '#0d1a30'}
            emissive={i % 2 === 0 ? '#0a2040' : '#081830'}
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        
        {/* Glowing top layer */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[TRACK_WIDTH - 0.5, 0.08, SECTION_LENGTH - 0.3]} />
          <meshStandardMaterial 
            color="#0a1a35"
            emissive="#0066CC"
            emissiveIntensity={0.15}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        
        {/* Cyan and blue neon borders */}
        <mesh position={[TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#00BFFF' : '#7B68EE'}
            emissive={i % 2 === 0 ? '#0099CC' : '#6A5ACD'}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[-TRACK_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[0.25, 0.6, SECTION_LENGTH]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#7B68EE' : '#00BFFF'}
            emissive={i % 2 === 0 ? '#6A5ACD' : '#0099CC'}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Cyber pillars */}
        {i % 5 === 0 && (
          <>
            <group position={[-TRACK_WIDTH / 2 - 2, 0, 0]}>
              <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[1.2, 0.6, 1.2]} />
                <meshStandardMaterial color="#1a1a3e" metalness={0.5} roughness={0.4} />
              </mesh>
              <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.25, 0.3, 3, 16]} />
                <meshStandardMaterial color="#1a1a40" metalness={0.6} roughness={0.3} emissive="#0066CC" emissiveIntensity={0.15} />
              </mesh>
              <mesh position={[0, 3.7, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="#00BFFF" metalness={0.6} roughness={0.2} emissive="#00BFFF" emissiveIntensity={0.3} />
              </mesh>
            </group>
            
            <group position={[TRACK_WIDTH / 2 + 2, 0, 0]}>
              <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[1.2, 0.6, 1.2]} />
                <meshStandardMaterial color="#1a1a3e" metalness={0.5} roughness={0.4} />
              </mesh>
              <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.25, 0.3, 3, 16]} />
                <meshStandardMaterial color="#1a1a40" metalness={0.6} roughness={0.3} emissive="#0066CC" emissiveIntensity={0.15} />
              </mesh>
              <mesh position={[0, 3.7, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="#00BFFF" metalness={0.6} roughness={0.2} emissive="#00BFFF" emissiveIntensity={0.3} />
              </mesh>
            </group>
          </>
        )}
        
        {/* Blue/cyan ambient lights */}
        {i % 2 === 0 && (
          <>
            <pointLight position={[TRACK_WIDTH / 2, 0.5, -1]} color="#00BFFF" intensity={0.4} distance={3} />
            <pointLight position={[-TRACK_WIDTH / 2, 0.5, 1]} color="#7B68EE" intensity={0.3} distance={3} />
          </>
        )}
        {i % 3 === 0 && (
          <pointLight position={[0, 2, 0]} color="#87CEEB" intensity={0.3} distance={4} />
        )}
      </group>
    );
  }
  
  return <>{sections}</>;
};
