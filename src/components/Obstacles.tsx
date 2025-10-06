import { Vector3 } from 'three';
import { useGameStore } from '../store/gameStore';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface Obstacle {
  position: Vector3;
  id: number;
  type: 'static' | 'moving' | 'disappearing';
  moveDirection?: number;
  moveSpeed?: number;
  visible?: boolean;
  disappearTimer?: number;
  size?: Vector3;
}

interface ObstaclesProps {
  ballPosition: Vector3;
}

export const Obstacles = ({ ballPosition }: ObstaclesProps) => {
  const { endGame } = useGameStore();
  const obstaclesRef = useRef<Obstacle[]>([]);
  const timeRef = useRef(0);

  // Generate obstacles procedurally with enhanced difficulty
  const generateObstacles = (startZ: number = -20) => {
    const obstacles: Obstacle[] = [];
    const distance = Math.abs(ballPosition.z);
    const difficultyMultiplier = 1 + (distance / 150); // Faster difficulty increase
    
    // More aggressive spacing and density
    const baseSpacing = 12;
    const spacing = Math.max(4, baseSpacing - (distance / 200)); // Much closer obstacles
    const numObstacles = Math.min(40, Math.floor(25 * difficultyMultiplier)); // More obstacles

    for (let i = 0; i < numObstacles; i++) {
      const z = startZ - (i * spacing);
      const x = (Math.random() - 0.5) * 10;
      
      // Random obstacle types based on difficulty
      const rand = Math.random();
      const difficultyFactor = Math.min(distance / 300, 1);
      
      let type: 'static' | 'moving' | 'disappearing' = 'static';
      let moveDirection = 0;
      let moveSpeed = 0;
      let size = new Vector3(1, 1, 1);
      
      if (difficultyFactor > 0.3 && rand < 0.4) {
        // Moving obstacles
        type = 'moving';
        moveDirection = Math.random() > 0.5 ? 1 : -1;
        moveSpeed = 0.02 + (difficultyFactor * 0.03);
      } else if (difficultyFactor > 0.5 && rand < 0.6) {
        // Disappearing platforms
        type = 'disappearing';
        size = new Vector3(2, 0.2, 1);
      } else if (difficultyFactor > 0.7 && rand < 0.2) {
        // Large moving blocks
        type = 'moving';
        moveDirection = Math.random() > 0.5 ? 1 : -1;
        moveSpeed = 0.015 + (difficultyFactor * 0.02);
        size = new Vector3(1.5, 1.5, 1);
      }
      
      obstacles.push({
        id: Date.now() + i + Math.random() * 1000,
        position: new Vector3(x, type === 'disappearing' ? 0.1 : 0.5, z),
        type,
        moveDirection,
        moveSpeed,
        visible: true,
        disappearTimer: type === 'disappearing' ? 3 + Math.random() * 2 : 0,
        size
      });
    }

    return obstacles;
  };

  // Initialize obstacles
  if (obstaclesRef.current.length === 0) {
    obstaclesRef.current = generateObstacles();
  }

  useFrame((state, delta) => {
    timeRef.current += delta;

    // Update obstacle behaviors
    obstaclesRef.current.forEach(obstacle => {
      // Moving obstacles
      if (obstacle.type === 'moving' && obstacle.moveDirection && obstacle.moveSpeed) {
        obstacle.position.x += obstacle.moveDirection * obstacle.moveSpeed;
        
        // Bounce off track boundaries
        if (Math.abs(obstacle.position.x) > 5) {
          obstacle.moveDirection *= -1;
        }
      }
      
      // Disappearing platforms
      if (obstacle.type === 'disappearing' && obstacle.disappearTimer !== undefined) {
        // Check if ball is near to trigger disappearing
        const distanceToBall = Math.abs(obstacle.position.z - ballPosition.z);
        if (distanceToBall < 8 && obstacle.visible) {
          obstacle.disappearTimer -= delta;
          if (obstacle.disappearTimer <= 0) {
            obstacle.visible = false;
            // Reappear after some time
            setTimeout(() => {
              obstacle.visible = true;
              obstacle.disappearTimer = 3 + Math.random() * 2;
            }, 2000 + Math.random() * 1000);
          }
        }
      }
    });

    // Enhanced collision detection
    obstaclesRef.current.forEach(obstacle => {
      if (!obstacle.visible) return;
      
      const distance = ballPosition.distanceTo(obstacle.position);
      const collisionRadius = obstacle.type === 'disappearing' ? 1.2 : 0.9;
      
      if (distance < collisionRadius) {
        endGame();
      }
    });

    // Generate new obstacles with more frequency
    const furthestObstacle = Math.min(...obstaclesRef.current.map(o => o.position.z));
    if (ballPosition.z < furthestObstacle + 80) {
      const newObstacles = generateObstacles(furthestObstacle - 15);
      obstaclesRef.current = [
        ...obstaclesRef.current,
        ...newObstacles
      ];
    }

    // Clean up distant obstacles
    obstaclesRef.current = obstaclesRef.current.filter(
      obstacle => obstacle.position.z < ballPosition.z + 100
    );
  });

  return (
    <>
      {obstaclesRef.current
        .filter(obstacle => 
          Math.abs(obstacle.position.z - ballPosition.z) < 60 && obstacle.visible
        )
        .map(obstacle => {
          const pulseIntensity = 0.8 + Math.sin(timeRef.current * 3) * 0.3;
          const glowColor = obstacle.type === 'moving' ? '#00FFFF' : 
                           obstacle.type === 'disappearing' ? '#FF6B00' : '#FF0080';
          
          return (
            <group key={obstacle.id}>
              <mesh 
                position={[obstacle.position.x, obstacle.position.y, obstacle.position.z]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[
                  obstacle.size?.x || 1, 
                  obstacle.size?.y || 1, 
                  obstacle.size?.z || 1
                ]} />
                <meshPhongMaterial 
                  color={glowColor}
                  emissive={glowColor}
                  emissiveIntensity={pulseIntensity}
                  transparent={obstacle.type === 'disappearing' && obstacle.disappearTimer && obstacle.disappearTimer < 1}
                  opacity={obstacle.type === 'disappearing' && obstacle.disappearTimer && obstacle.disappearTimer < 1 ? 0.5 : 1}
                />
              </mesh>
              
              {/* Neon glow effect */}
              <mesh 
                position={[obstacle.position.x, obstacle.position.y, obstacle.position.z]}
              >
                <boxGeometry args={[
                  (obstacle.size?.x || 1) * 1.1, 
                  (obstacle.size?.y || 1) * 1.1, 
                  (obstacle.size?.z || 1) * 1.1
                ]} />
                <meshBasicMaterial 
                  color={glowColor}
                  transparent
                  opacity={0.2 + Math.sin(timeRef.current * 4) * 0.1}
                />
              </mesh>
            </group>
          );
        })}
    </>
  );
};