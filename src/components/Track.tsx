import { Vector3 } from 'three';

interface TrackProps {
  ballPosition: Vector3;
}

export const Track = ({ ballPosition }: TrackProps) => {
  const trackSegments = [];
  const segmentLength = 10;
  const numSegments = 10;

  // Generate track segments ahead of the ball (negative Z direction)
  for (let i = 0; i < numSegments; i++) {
    const z = ballPosition.z - (i * segmentLength); // Track ahead of ball (negative direction)
    
    trackSegments.push(
      <group key={i} position={[0, 0, z]}>
        {/* Main track surface (wider) */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[20, 0.2, segmentLength]} />
          <meshPhongMaterial 
            color="#1a1a2e"
            emissive="#16213e"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Track borders with neon glow */}
        <mesh position={[-10, 0.2, 0]}>
          <boxGeometry args={[0.2, 0.6, segmentLength]} />
          <meshPhongMaterial 
            color="#4A90E2"
            emissive="#4A90E2"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[10, 0.2, 0]}>
          <boxGeometry args={[0.2, 0.6, segmentLength]} />
          <meshPhongMaterial 
            color="#4A90E2"
            emissive="#4A90E2"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Lane dividers for jumping */}
        <mesh position={[-6.67, 0.01, 0]}>
          <boxGeometry args={[0.15, 0.02, segmentLength]} />
          <meshPhongMaterial 
            color="#9D4EDD"
            emissive="#9D4EDD"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[-3.33, 0.01, 0]}>
          <boxGeometry args={[0.15, 0.02, segmentLength]} />
          <meshPhongMaterial 
            color="#9D4EDD"
            emissive="#9D4EDD"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.15, 0.02, segmentLength]} />
          <meshPhongMaterial 
            color="#9D4EDD"
            emissive="#9D4EDD"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[3.33, 0.01, 0]}>
          <boxGeometry args={[0.15, 0.02, segmentLength]} />
          <meshPhongMaterial 
            color="#9D4EDD"
            emissive="#9D4EDD"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[6.67, 0.01, 0]}>
          <boxGeometry args={[0.15, 0.02, segmentLength]} />
          <meshPhongMaterial 
            color="#9D4EDD"
            emissive="#9D4EDD"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    );
  }

  return <>{trackSegments}</>;
};