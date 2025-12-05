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
  playerId?: number;
}

export const Obstacles = ({ ballPosition, playerId }: ObstaclesProps) => {
  const { endGame } = useGameStore();
  const obstaclesRef = useRef<Obstacle[]>([]);
  const timeRef = useRef(0);
  const lastGeneratedZ = useRef(0);
  const OBSTACLE_START_THRESHOLD = 50; // Start obstacles after some distance

  // Generate obstacles ahead of the ball (negative Z direction = forward)
  const generateObstacles = (startZ: number) => {
    const obstacles: Obstacle[] = [];
    const distance = Math.abs(ballPosition.z);
    
    const difficultyMultiplier = 1 + (distance / 200);
    const baseSpacing = 15;
    const spacing = Math.max(8, baseSpacing - (distance / 400));
    const numObstacles = Math.min(30, Math.floor(15 * difficultyMultiplier));

    for (let i = 0; i < numObstacles; i++) {
      // Generate obstacles ahead (more negative Z)
      const z = startZ - (i * spacing);
      const x = (Math.random() - 0.5) * 8;
      
      const rand = Math.random();
      const difficultyFactor = Math.min(distance / 400, 1);
      
      let type: 'static' | 'moving' | 'disappearing' = 'static';
      let moveDirection = 0;
      let moveSpeed = 0;
      let size = new Vector3(1, 1, 1);
      
      if (difficultyFactor > 0.3 && rand < 0.3) {
        type = 'moving';
        moveDirection = Math.random() > 0.5 ? 1 : -1;
        moveSpeed = 0.02 + (difficultyFactor * 0.02);
      } else if (difficultyFactor > 0.5 && rand < 0.45) {
        type = 'disappearing';
        size = new Vector3(2, 0.3, 1);
      }
      
      obstacles.push({
        id: Date.now() + i + Math.random() * 10000,
        position: new Vector3(x, type === 'disappearing' ? 0.15 : 0.5, z),
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

  useFrame((state, delta) => {
    timeRef.current += delta;
    const distance = Math.abs(ballPosition.z);

    // Initialize obstacles when ball has traveled enough (negative Z)
    if (distance >= OBSTACLE_START_THRESHOLD && obstaclesRef.current.length === 0) {
      const startZ = ballPosition.z - 30;
      obstaclesRef.current = generateObstacles(startZ);
      lastGeneratedZ.current = startZ;
    }

    // Generate more obstacles as player progresses (negative Z)
    if (obstaclesRef.current.length > 0) {
      const furthestZ = Math.min(...obstaclesRef.current.map(o => o.position.z));
      
      // If ball is approaching the furthest obstacle, generate more ahead
      if (ballPosition.z - 80 < furthestZ) {
        const newObstacles = generateObstacles(furthestZ - 20);
        obstaclesRef.current = [...obstaclesRef.current, ...newObstacles];
      }
    }

    // Update obstacle behaviors
    obstaclesRef.current.forEach(obstacle => {
      if (obstacle.type === 'moving' && obstacle.moveDirection && obstacle.moveSpeed) {
        obstacle.position.x += obstacle.moveDirection * obstacle.moveSpeed;
        if (Math.abs(obstacle.position.x) > 4.5) {
          obstacle.moveDirection *= -1;
        }
      }
      
      if (obstacle.type === 'disappearing' && obstacle.disappearTimer !== undefined) {
        const distanceToBall = Math.abs(obstacle.position.z - ballPosition.z);
        if (distanceToBall < 10 && obstacle.visible) {
          obstacle.disappearTimer -= delta;
          if (obstacle.disappearTimer <= 0) {
            obstacle.visible = false;
            setTimeout(() => {
              obstacle.visible = true;
              obstacle.disappearTimer = 3 + Math.random() * 2;
            }, 2000);
          }
        }
      }
    });

    // Collision detection
    obstaclesRef.current.forEach(obstacle => {
      if (!obstacle.visible) return;
      
      const dx = ballPosition.x - obstacle.position.x;
      const dy = ballPosition.y - obstacle.position.y;
      const dz = ballPosition.z - obstacle.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const collisionRadius = obstacle.type === 'disappearing' ? 1.0 : 0.85;
      
      if (dist < collisionRadius) {
        if (playerId === 1) {
          (window as any).handleDeathPlayer1?.();
        } else if (playerId === 2) {
          (window as any).handleDeathPlayer2?.();
        } else {
          endGame();
        }
      }
    });

    // Clean up obstacles that are far behind the ball (positive Z = behind)
    obstaclesRef.current = obstaclesRef.current.filter(
      obstacle => obstacle.position.z < ballPosition.z + 50
    );
  });

  return (
    <>
      {obstaclesRef.current
        .filter(obstacle => 
          Math.abs(obstacle.position.z - ballPosition.z) < 80 && obstacle.visible
        )
        .map(obstacle => {
          const pulseIntensity = 0.8 + Math.sin(timeRef.current * 3) * 0.3;
          const glowColor = obstacle.type === 'moving' ? '#FF00FF' : 
                           obstacle.type === 'disappearing' ? '#FF6B00' : '#00FF00';
          
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
