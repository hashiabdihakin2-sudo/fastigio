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

  // Generate obstacles procedurally
  const generateObstacles = () => {
    const obstacles = [];
    const spacing = 15;
    const numObstacles = 20;

    for (let i = 0; i < numObstacles; i++) {
      const z = (i * spacing) + 20; // Obstacles ahead of starting position
      const x = (Math.random() - 0.5) * 10; // Random x position within track bounds
      
      obstacles.push({
        id: i,
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

    // Generate new obstacles as ball moves forward
    const furthestObstacle = Math.max(...obstaclesRef.current.map(o => o.position.z));
    if (ballPosition.z > furthestObstacle - 100) {
      const newObstacles = generateObstacles();
      obstaclesRef.current = [
        ...obstaclesRef.current,
        ...newObstacles.map(o => ({
          ...o,
          position: new Vector3(o.position.x, o.position.y, o.position.z + furthestObstacle + 20)
        }))
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