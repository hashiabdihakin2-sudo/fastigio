import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Vector3, Group, Mesh } from 'three';
import { Ball } from './Ball';
import { Track } from './Track';
import { Obstacles } from './Obstacles';
import { Background } from './Background';
import { StartingStation } from './StartingStation';
import { useGameStore } from '../store/gameStore';

interface GameSceneProps {
  controls: { left: boolean; right: boolean };
}

export const GameScene = ({ controls }: GameSceneProps) => {
  const groupRef = useRef<Group>(null);
  const ballRef = useRef<Mesh>(null);
  const { 
    ballPosition, 
    setBallPosition, 
    gameState, 
    updateScore, 
    endGame,
    isGameRunning
  } = useGameStore();

  const velocity = useRef(new Vector3(0, 0, 0));
  const baseBallSpeed = 0.1;
  const gravity = -0.025;
  const baseSteerForce = 0.12;

  useFrame(() => {
    if (!isGameRunning || !ballRef.current) return;

    // Calculate progressive difficulty based on distance
    const distance = Math.abs(ballPosition.z);
    const progressMultiplier = 1 + (distance / 200); // Speed increases every 200 units
    const difficultyMultiplier = Math.min(progressMultiplier, 3); // Cap at 3x speed
    
    // Dynamic values based on progress
    const currentBallSpeed = baseBallSpeed * progressMultiplier;
    const currentSteerForce = baseSteerForce * Math.min(1.5, 1 + (distance / 500)); // Better steering with progress
    const steerDamping = Math.max(0.85, 0.95 - (distance / 1000)); // Less damping = more responsive

    // Apply steering with improved responsiveness
    if (controls.left) {
      velocity.current.x -= currentSteerForce;
    }
    if (controls.right) {
      velocity.current.x += currentSteerForce;
    }

    // Apply gravity and progressive forward movement
    velocity.current.y += gravity;
    velocity.current.z = currentBallSpeed;

    // Progressive damping for x movement (less damping = more responsive)
    velocity.current.x *= steerDamping;

    // Update ball position
    const newPosition = new Vector3(
      ballPosition.x + velocity.current.x,
      ballPosition.y + velocity.current.y,
      ballPosition.z + velocity.current.z
    );

    // Check for falling off track
    if (newPosition.y < -10) {
      endGame();
      return;
    }

    // Simple ground collision (track surface)
    if (newPosition.y < 0.5) {
      newPosition.y = 0.5;
      velocity.current.y = 0;
    }

    // Track boundaries
    if (Math.abs(newPosition.x) > 6) {
      endGame();
      return;
    }

    setBallPosition(newPosition);
    
    // Update score based on distance (positive Z movement)
    updateScore(Math.abs(newPosition.z * 10));

    // Update ball mesh position
    ballRef.current.position.copy(newPosition);

    // Move camera to follow ball (camera follows from behind)
    if (groupRef.current) {
      groupRef.current.position.z = -newPosition.z - 10; // Camera stays behind ball
    }
  });

  // Reset ball when game restarts
  useEffect(() => {
    if (gameState === 'waiting' && ballRef.current) {
      velocity.current.set(0, 0, 0);
      ballRef.current.position.set(0, 1, 0);
    }
  }, [gameState]);

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#4A90E2" />
      <directionalLight
        position={[10, 20, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#9D4EDD" />

      {/* Background elements */}
      <Background ballPosition={ballPosition} />
      
      {/* Starting station */}
      <StartingStation />
      
      {/* Game objects */}
      <Ball ref={ballRef} />
      <Track ballPosition={ballPosition} />
      <Obstacles ballPosition={ballPosition} />
    </group>
  );
};