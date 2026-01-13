import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import { Vector3, Group, Mesh } from 'three';
import { Ball } from './Ball';
import { Track } from './Track';
import { Obstacles } from './Obstacles';
import { Coins } from './Coins';
import { CyberBackground } from './CyberBackground';
import { DeathAnimation } from './DeathAnimation';
import { Snow } from './Snow';
import { Fireworks } from './Fireworks';
import { JumpScare } from './JumpScare';
import { useGameStore } from '../store/gameStore';

interface GameSceneProps {
  controls: { left: boolean; right: boolean };
}

export const GameScene = ({ controls }: GameSceneProps) => {
  const groupRef = useRef<Group>(null);
  const ballRef = useRef<Group>(null);
  const [showDeathAnimation, setShowDeathAnimation] = useState(false);
  const [deathPosition, setDeathPosition] = useState<[number, number, number]>([0, 0, 0]);
  const hasInit = useRef(false);
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

  const velocityX = useRef(0);
  const BASE_FORWARD_SPEED = 0.14; // Mycket snabbare start
  const GLIDE_IMPULSE = 0.18; // Snabbare impulse
  const FRICTION = 0.92; // Friktion för smooth gliding
  const LANE_WIDTH = 1.5;
  const NUM_LANES = 7;
  const MAX_X = 3 * LANE_WIDTH;
  const MIN_X = -3 * LANE_WIDTH;

  useFrame(() => {
    // Initialize on (re)start once Ball is mounted
    if (gameState === 'playing' && ballRef.current && !hasInit.current) {
      const startPosition = new Vector3(0, 0.5, 0);
      setBallPosition(startPosition);
      ballRef.current.position.copy(startPosition);
      velocityX.current = 0;
      if (groupRef.current) groupRef.current.position.z = 0;
      setShowDeathAnimation(false);
      hasInit.current = true;
    }

    if (!isGameRunning || !ballRef.current) return;

    // Calculate speed multiplier based on score
    const currentScore = Math.floor(Math.abs(ballPosition.z) * 10);
    const speedMultiplier = 1 + (currentScore / 3000); // Snabbare progression
    const FORWARD_SPEED = BASE_FORWARD_SPEED * speedMultiplier;

    // Continuous forward movement
    const newZ = ballPosition.z + FORWARD_SPEED;
    const newY = 0.5;

    // Update score
    updateScore(currentScore);

    // Apply friction to velocity for smooth gliding
    velocityX.current *= FRICTION;

    // Calculate new X position with velocity
    let newX = ballPosition.x + velocityX.current;
    newX = Math.max(MIN_X, Math.min(MAX_X, newX)); // Clamp to boundaries

    const newPosition = new Vector3(newX, newY, newZ);
    setBallPosition(newPosition);
    ballRef.current.position.copy(newPosition);

    // Camera follows ball from behind (positive Z = forward)
    if (groupRef.current) {
      groupRef.current.position.z = -ballPosition.z;
    }
  });

  // Reset flag when leaving playing state
  useEffect(() => {
    if (gameState !== 'playing') {
      hasInit.current = false;
    }
  }, [gameState]);

  // Trigger death animation when game ends
  useEffect(() => {
    if (gameState === 'gameOver' && ballRef.current && !showDeathAnimation) {
      setDeathPosition([ballPosition.x, ballPosition.y, ballPosition.z]);
      setShowDeathAnimation(true);
      hasInit.current = false;
    }
  }, [gameState, ballPosition, showDeathAnimation]);

  // Handle gliding impulse on key press
  useEffect(() => {
    const handleGlide = (direction: 'left' | 'right') => {
      if (!isGameRunning) return;
      
      if (direction === 'left') {
        velocityX.current = -GLIDE_IMPULSE;
      } else {
        velocityX.current = GLIDE_IMPULSE;
      }
    };

    (window as any).handleGlide = handleGlide;
  }, [isGameRunning]);

  return (
    <group ref={groupRef}>
      {/* New Year 2026 themed lighting - midnight celebration */}
      <ambientLight intensity={0.25} color="#1a1a3e" />
      <directionalLight
        position={[15, 25, 10]}
        intensity={0.8}
        color="#ffeedd"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      {/* New Year celebration lights - gold, pink, purple */}
      <pointLight position={[0, 15, 0]} intensity={0.7} color="#FFD700" />
      <pointLight position={[-10, 8, 0]} intensity={0.6} color="#FF1493" />
      <pointLight position={[10, 8, 0]} intensity={0.6} color="#9400D3" />
      
      {/* Midnight starlight effect */}
      <spotLight
        position={[0, 30, ballPosition.z + 5]}
        target-position={[0, 0, ballPosition.z]}
        intensity={0.6}
        color="#b0c4de"
        angle={0.4}
        penumbra={0.6}
        castShadow
      />

      {/* Game objects */}
      <Snow ballPosition={ballPosition} />
      <Fireworks ballPosition={ballPosition} />
      <JumpScare score={Math.floor(Math.abs(ballPosition.z) * 10)} />
      <CyberBackground ballPosition={ballPosition} />
      {!showDeathAnimation && <Ball ref={ballRef} />}
      <Track ballPosition={ballPosition} />
      <Obstacles ballPosition={ballPosition} />
      <Coins ballPosition={ballPosition} />
      
      {/* Death Animation */}
      {showDeathAnimation && (
        <DeathAnimation 
          position={deathPosition} 
          onComplete={() => {}} 
        />
      )}
    </group>
  );
};