export const StartingStation = () => {
  return (
    <group position={[0, 0, -5]}>
      {/* Main hut structure */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[4, 3, 4]} />
        <meshPhongMaterial 
          color="#8B4513"
          emissive="#654321"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 4, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3, 2, 4]} />
        <meshPhongMaterial 
          color="#654321"
          emissive="#4A2C0A"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Door */}
      <mesh position={[0, 1, 2.1]}>
        <boxGeometry args={[0.8, 1.5, 0.1]} />
        <meshPhongMaterial 
          color="#2F1B14"
          emissive="#1F0F0A"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Windows */}
      <mesh position={[-1.2, 2.5, 2.1]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshPhongMaterial 
          color="#FFE135"
          emissive="#FFE135"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[1.2, 2.5, 2.1]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshPhongMaterial 
          color="#FFE135"
          emissive="#FFE135"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Chimney */}
      <mesh position={[1.5, 5.5, -0.5]}>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshPhongMaterial 
          color="#696969"
          emissive="#404040"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Smoke particles */}
      <mesh position={[1.5, 7, -0.5]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial 
          color="#CCCCCC"
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh position={[1.3, 7.5, -0.3]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial 
          color="#CCCCCC"
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Launch platform */}
      <mesh position={[0, 0.1, 3]}>
        <boxGeometry args={[6, 0.2, 2]} />
        <meshPhongMaterial 
          color="#4A90E2"
          emissive="#4A90E2"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Platform markings */}
      <mesh position={[0, 0.2, 3]}>
        <boxGeometry args={[0.2, 0.05, 1.8]} />
        <meshPhongMaterial 
          color="#FFE135"
          emissive="#FFE135"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};