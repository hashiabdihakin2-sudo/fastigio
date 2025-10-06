import { Vector3 } from 'three';
import { useGameStore } from '../store/gameStore';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface ObstaclesProps {
  ballPosition: Vector3;
}

export const Obstacles = ({ ballPosition }: ObstaclesProps) => {
  const { endGame } = useGameStore();
  const obstaclesRef = useRef<{ position: Vector3; id: number }[]>([]);

  // Generate obstacles procedurally with progressive difficulty
  const generateObstacles = (startZ: number = 20) => {
    const obstacles = [];
    const distance = Math.abs(ballPosition.z);
    const difficultyMultiplier = 1 + (distance / 300); // Difficulty increases every 300 units
    
    // Progressive spacing and density
    const baseSpacing = 15;
    const spacing = Math.max(8, baseSpacing - (distance / 400)); // Closer obstacles over time
    const numObstacles = Math.min(30, Math.floor(20 * difficultyMultiplier)); // More obstacles

    for (let i = 0; i < numObstacles; i++) {
      const z = startZ + (i * spacing);
      const x = (Math.random() - 0.5) * 10; // Random x position within track bounds
      
      obstacles.push({
        id: Date.now() + i, // Unique IDs for new obstacles
        position: new Vector3(x, 0.5, z)
      });
    }

    return obstacles;
  };

  // Initialize obstacles
  if (obstaclesRef.current.length === 0) {
    obstaclesRef.current = generateObstacles();
  }

  useFrame(() => {
    // Check collision with obstacles
    obstaclesRef.current.forEach(obstacle => {
      const distance = ballPosition.distanceTo(obstacle.position);
      if (distance < 0.8) { // Ball radius + obstacle size
        endGame();
      }
    });

    // Generate new obstacles as ball moves forward with progressive difficulty
    const furthestObstacle = Math.max(...obstaclesRef.current.map(o => o.position.z));
    if (ballPosition.z > furthestObstacle - 100) {
      const newObstacles = generateObstacles(furthestObstacle + 20);
      obstaclesRef.current = [
        ...obstaclesRef.current,
        ...newObstacles
      ];
    }
  });

  return (
    <>
      {obstaclesRef.current
        .filter(obstacle => Math.abs(obstacle.position.z - ballPosition.z) < 50)
        .map(obstacle => (
          <mesh 
            key={obstacle.id} 
            position={[obstacle.position.x, obstacle.position.y, obstacle.position.z]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshPhongMaterial 
              color="#FF0040"
              emissive="#FF0040"
              emissiveIntensity={0.6}
            />
          </mesh>
        ))}
    </>
  );
};