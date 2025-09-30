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
  const generateObstacles = (startZ: number = 20) => {
    const obstacles: Obstacle[] = [];
    const distance = Math.abs(ballPosition.z);
    const difficultyMultiplier = 1 + (distance / 350); // Even slower difficulty progression
    
    // More generous spacing for skill-based gameplay
    const baseSpacing = 22; // Increased spacing further
    const spacing = Math.max(12, baseSpacing - (distance / 400)); // Maintain wider gaps
    const numObstacles = Math.min(30, Math.floor(12 * difficultyMultiplier)); // Fewer obstacles for fairness

    for (let i = 0; i < numObstacles; i++) {
      const z = startZ + (i * spacing);
      const x = (Math.random() - 0.5) * 14; // Wider field
      
      // Balanced obstacle types with fair reaction times
      const rand = Math.random();
      const difficultyFactor = Math.min(distance / 600, 1); // Much slower special obstacle introduction
      
      let type: 'static' | 'moving' | 'disappearing' = 'static';
      let moveDirection = 0;
      let moveSpeed = 0;
      let size = new Vector3(1, 1, 1);
      
      if (difficultyFactor > 0.5 && rand < 0.25) { // Much later and less frequent
        // Moving obstacles with slower, more predictable movement
        type = 'moving';
        moveDirection = Math.random() > 0.5 ? 1 : -1;
        moveSpeed = 0.015 + (difficultyFactor * 0.02); // Slower movement for fairness
      } else if (difficultyFactor > 0.7 && rand < 0.4) { // Later introduction
        // Disappearing platforms with longer warning time
        type = 'disappearing';
        size = new Vector3(2, 0.2, 1);
      } else if (difficultyFactor > 0.8 && rand < 0.15) { // Very late introduction
        // Large moving blocks - rare and slower
        type = 'moving';
        moveDirection = Math.random() > 0.5 ? 1 : -1;
        moveSpeed = 0.01 + (difficultyFactor * 0.015); // Much slower for reaction time
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
        
        // Bounce off track boundaries (wider field)
        if (Math.abs(obstacle.position.x) > 7) { // Wider boundaries
          obstacle.moveDirection *= -1;
        }
      }
      
      // Disappearing platforms with longer warning
      if (obstacle.type === 'disappearing' && obstacle.disappearTimer !== undefined) {
        // Check if ball is near to trigger disappearing - increased warning distance
        const distanceToBall = Math.abs(obstacle.position.z - ballPosition.z);
        if (distanceToBall < 15 && obstacle.visible) { // Increased warning distance
          obstacle.disappearTimer -= delta;
          if (obstacle.disappearTimer <= 0) {
            obstacle.visible = false;
            // Longer reappear time for fairness
            setTimeout(() => {
              obstacle.visible = true;
              obstacle.disappearTimer = 4 + Math.random() * 2; // Longer timer
            }, 3000 + Math.random() * 2000); // Longer reappear time
          }
        }
      }
    });

    // Enhanced collision detection
    obstaclesRef.current.forEach(obstacle => {
      if (!obstacle.visible) return;
      
      const distance = ballPosition.distanceTo(obstacle.position);
      const collisionRadius = obstacle.type === 'disappearing' ? 1.4 : 1.1; // Adjusted for larger ball
      
      if (distance < collisionRadius) {
        endGame();
      }
    });

    // Generate new obstacles with more frequency
    const furthestObstacle = Math.max(...obstaclesRef.current.map(o => o.position.z));
    if (ballPosition.z > furthestObstacle - 80) {
      const newObstacles = generateObstacles(furthestObstacle + 15);
      obstaclesRef.current = [
        ...obstaclesRef.current,
        ...newObstacles
      ];
    }

    // Clean up distant obstacles
    obstaclesRef.current = obstaclesRef.current.filter(
      obstacle => obstacle.position.z > ballPosition.z - 100
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
          // All obstacles are now blue variants
          const glowColor = obstacle.type === 'moving' ? '#0080FF' : 
                           obstacle.type === 'disappearing' ? '#4040FF' : '#0066FF';
          
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