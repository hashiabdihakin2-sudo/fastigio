import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Vector3, Group, Mesh } from 'three';
import { Ball } from './Ball';
import { Track } from './Track';
import { Obstacles } from './Obstacles';
import { CyberBackground } from './CyberBackground';
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
  const baseBallSpeed = 0.15;
  const gravity = -0.03;
  
  // Lane-based movement
  const NUM_LANES = 10;
  const LANE_WIDTH = 1.0;
  const currentLane = useRef(4); // Start in middle lane (0-9, so 4 is middle)
  const canSwitch = useRef(true);
  const switchCooldown = 150; // ms between lane switches
  
  const getLanePosition = (lane: number) => {
    return (lane - 4.5) * LANE_WIDTH; // Center lanes around 0
  };

  useFrame(() => {
    if (!isGameRunning || !ballRef.current) return;

    // Calculate progressive difficulty
    const distance = Math.abs(ballPosition.z);
    const progressMultiplier = 1 + (distance / 100);
    const currentBallSpeed = baseBallSpeed * progressMultiplier;

    // Handle lane switching
    if (canSwitch.current) {
      if (controls.left && currentLane.current > 0) {
        currentLane.current -= 1;
        canSwitch.current = false;
        setTimeout(() => { canSwitch.current = true; }, switchCooldown);
      } else if (controls.right && currentLane.current < NUM_LANES - 1) {
        currentLane.current += 1;
        canSwitch.current = false;
        setTimeout(() => { canSwitch.current = true; }, switchCooldown);
      }
    }

    // Smoothly move to target lane
    const targetX = getLanePosition(currentLane.current);
    const laneTransitionSpeed = 0.2;
    velocity.current.x = (targetX - ballPosition.x) * laneTransitionSpeed;

    // Apply gravity and forward movement
    velocity.current.y += gravity;
    velocity.current.z = -currentBallSpeed;

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
      currentLane.current = 4; // Reset to middle lane
      canSwitch.current = true;
      ballRef.current.position.set(0, 1, 0);
    }
  }, [gameState]);

  return (
    <group ref={groupRef}>
      {/* Enhanced futuristic lighting */}
      <ambientLight intensity={0.2} color="#0066FF" />
      <directionalLight
        position={[15, 25, 10]}
        intensity={1.2}
        color="#00CCFF"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight position={[0, 15, 0]} intensity={0.8} color="#FF0080" />
      <pointLight position={[-10, 8, 0]} intensity={0.6} color="#00FFFF" />
      <pointLight position={[10, 8, 0]} intensity={0.6} color="#FF6B00" />
      
      {/* Dynamic rim lighting */}
      <spotLight
        position={[0, 20, ballPosition.z + 5]}
        target-position={[0, 0, ballPosition.z]}
        intensity={1}
        color="#FFFFFF"
        angle={0.3}
        penumbra={0.5}
        castShadow
      />

      {/* Game objects */}
      <CyberBackground ballPosition={ballPosition} />
      <Ball ref={ballRef} />
      <Track ballPosition={ballPosition} />
      <Obstacles ballPosition={ballPosition} />
    </group>
  );
};