import { Vector3 } from 'three';
import { useGameStore } from '../store/gameStore';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface ObstaclesProps {
  ballPosition: Vector3;
}

export const Obstacles = ({ ballPosition }: ObstaclesProps) => {
  const { endGame } = useGameStore();
  const obstaclesRef = useRef<{ position: Vector3; id: number; type: string; moveDirection: number }[]>([]);

  // Generate obstacles procedurally with progressive difficulty
  const generateObstacles = (startZ: number = -20) => {
    const obstacles = [];
    const distance = Math.abs(ballPosition.z);
    const difficultyMultiplier = 1 + (distance / 300);
    
    const baseSpacing = 15;
    const spacing = Math.max(8, baseSpacing - (distance / 400));
    const numObstacles = Math.min(30, Math.floor(20 * difficultyMultiplier));

    for (let i = 0; i < numObstacles; i++) {
      const z = startZ - (i * spacing); // Negative direction
      const x = (Math.random() - 0.5) * 16; // Wider spread for bigger track
      
      // Different obstacle types based on random chance
      const obstacleType = Math.random();
      let type = 'cube';
      if (obstacleType < 0.3) type = 'spike';
      else if (obstacleType < 0.6) type = 'wall';
      else if (obstacleType < 0.8) type = 'moving';
      
      obstacles.push({
        id: Date.now() + i,
        position: new Vector3(x, 0.5, z),
        type,
        moveDirection: Math.random() > 0.5 ? 1 : -1
      });
    }

    return obstacles;
  };

  // Initialize obstacles
  if (obstaclesRef.current.length === 0) {
    obstaclesRef.current = generateObstacles();
  }

  useFrame(() => {
    // Update moving obstacles
    obstaclesRef.current.forEach(obstacle => {
      if (obstacle.type === 'moving') {
        obstacle.position.x += obstacle.moveDirection * 0.02;
        // Reverse direction if hitting track bounds
        if (Math.abs(obstacle.position.x) > 8) {
          obstacle.moveDirection *= -1;
        }
      }
    });

    // Check collision with obstacles
    obstaclesRef.current.forEach(obstacle => {
      const distance = ballPosition.distanceTo(obstacle.position);
      const collisionRadius = obstacle.type === 'wall' ? 2.0 : 1.5; // Bigger collision
      if (distance < collisionRadius) {
        endGame();
      }
    });

    // Generate new obstacles as ball moves backward with progressive difficulty
    const furthestObstacle = Math.min(...obstaclesRef.current.map(o => o.position.z));
    if (ballPosition.z < furthestObstacle + 100) {
      const newObstacles = generateObstacles(furthestObstacle - 20);
      obstaclesRef.current = [
        ...obstaclesRef.current,
        ...newObstacles
      ];
    }
  });

  const renderObstacle = (obstacle: any) => {
    const baseProps = {
      key: obstacle.id,
      position: [obstacle.position.x, obstacle.position.y, obstacle.position.z] as [number, number, number],
      castShadow: true,
      receiveShadow: true
    };

    switch (obstacle.type) {
      case 'spike':
        return (
          <mesh {...baseProps}>
            <coneGeometry args={[1.5, 3.5, 6]} />
            <meshPhongMaterial 
              color="#FF4444"
              emissive="#FF4444"
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      
      case 'wall':
        return (
          <mesh {...baseProps} position={[obstacle.position.x, 2.5, obstacle.position.z]}>
            <boxGeometry args={[2.5, 5, 0.5]} />
            <meshPhongMaterial 
              color="#8B0000"
              emissive="#8B0000"
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      
      case 'moving':
        return (
          <mesh {...baseProps}>
            <octahedronGeometry args={[1.5]} />
            <meshPhongMaterial 
              color="#FF6600"
              emissive="#FF6600"
              emissiveIntensity={0.7}
            />
          </mesh>
        );
      
      default: // cube
        return (
          <mesh {...baseProps}>
            <boxGeometry args={[2, 2, 2]} />
            <meshPhongMaterial 
              color="#FF0040"
              emissive="#FF0040"
              emissiveIntensity={0.6}
            />
          </mesh>
        );
    }
  };

  return (
    <>
      {obstaclesRef.current
        .filter(obstacle => Math.abs(obstacle.position.z - ballPosition.z) < 50)
        .map(renderObstacle)}
    </>
  );
};