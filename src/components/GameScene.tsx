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
    currentSection,
    isJumping,
    setIsJumping,
    endGame,
    isGameRunning,
    updateScore
  } = useGameStore();

  const BASE_FORWARD_SPEED = 0.1;
  const GLIDE_SPEED = 0.12; // Smooth sideways gliding speed
  const LANE_WIDTH = 1.5;
  const NUM_LANES = 7; // -3, -2, -1, 0, 1, 2, 3
  const MAX_X = 3 * LANE_WIDTH; // Maximum sideways position
  const MIN_X = -3 * LANE_WIDTH; // Minimum sideways position

  useFrame(() => {
    if (!isGameRunning || !ballRef.current) return;

    // Calculate speed multiplier based on score
    const currentScore = Math.floor(Math.abs(ballPosition.z) * 10);
    const speedMultiplier = 1 + (currentScore / 1000); // Speed increases gradually
    const FORWARD_SPEED = BASE_FORWARD_SPEED * speedMultiplier;

    // Continuous forward movement with progressive speed
    const newZ = ballPosition.z + FORWARD_SPEED;
    let newX = ballPosition.x;
    const newY = 0.5; // Keep ball at constant height for smoother gliding

    // Update score based on distance
    updateScore(currentScore);

    // Smooth continuous sideways gliding movement
    if (controls.left) {
      newX = Math.max(MIN_X, ballPosition.x - GLIDE_SPEED);
    } else if (controls.right) {
      newX = Math.min(MAX_X, ballPosition.x + GLIDE_SPEED);
    }

    const newPosition = new Vector3(newX, newY, newZ);
    setBallPosition(newPosition);
    ballRef.current.position.copy(newPosition);

    // Camera follows ball
    if (groupRef.current) {
      groupRef.current.position.z = -ballPosition.z;
    }
  });

  // Reset ball when game restarts
  useEffect(() => {
    if (gameState === 'waiting' && ballRef.current) {
      const startPosition = new Vector3(0, 0.5, 0);
      setBallPosition(startPosition);
      ballRef.current.position.copy(startPosition);
    }
  }, [gameState, setBallPosition]);

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