import { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Ball } from './Ball';
import { Track } from './Track';
import { Obstacles } from './Obstacles';
import { Coins } from './Coins';
import { CyberBackground } from './CyberBackground';
import { DeathAnimation } from './DeathAnimation';

interface LocalPlayerGameSceneProps {
  playerId: number;
  playerStatus: 'playing' | 'finished';
  playerSkin?: string;
  onScoreUpdate: (score: number) => void;
  onPlayerDied: (score: number) => void;
}

export const LocalPlayerGameScene = ({ playerId, playerStatus, playerSkin = 'classic', onScoreUpdate, onPlayerDied }: LocalPlayerGameSceneProps) => {
  const ballRef = useRef<any>(null);
  const ballPositionRef = useRef(new Vector3(0, 0.5, 0));
  const [score, setScore] = useState(0);
  const [isDead, setIsDead] = useState(false);
  const [deathPosition, setDeathPosition] = useState<Vector3 | null>(null);
  const keysPressed = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const gameStarted = useRef(false);

  // Reset on mount
  useEffect(() => {
    ballPositionRef.current.set(0, 0.5, 0);
    setScore(0);
    setIsDead(false);
    setDeathPosition(null);
    gameStarted.current = true;
  }, []);

  // Handle death from obstacles
  useEffect(() => {
    const handleDeath = () => {
      if (!isDead && playerStatus === 'playing') {
        setDeathPosition(ballPositionRef.current.clone());
        setIsDead(true);
        onPlayerDied(score);
      }
    };

    if (playerId === 1) {
      (window as any).handleDeathPlayer1 = handleDeath;
    } else {
      (window as any).handleDeathPlayer2 = handleDeath;
    }

    return () => {
      if (playerId === 1) {
        (window as any).handleDeathPlayer1 = undefined;
      } else {
        (window as any).handleDeathPlayer2 = undefined;
      }
    };
  }, [playerId, isDead, playerStatus, score, onPlayerDied]);

  // Handle glide input
  const handleGlide = useCallback((direction: 'left' | 'right') => {
    if (playerStatus === 'playing' && !isDead) {
      if (direction === 'left') {
        keysPressed.current.left = true;
        setTimeout(() => { keysPressed.current.left = false; }, 100);
      } else {
        keysPressed.current.right = true;
        setTimeout(() => { keysPressed.current.right = false; }, 100);
      }
    }
  }, [playerStatus, isDead]);

  // Register glide handlers on window
  useEffect(() => {
    if (playerId === 1) {
      (window as any).handleGlidePlayer1 = handleGlide;
    } else {
      (window as any).handleGlidePlayer2 = handleGlide;
    }

    return () => {
      if (playerId === 1) {
        (window as any).handleGlidePlayer1 = undefined;
      } else {
        (window as any).handleGlidePlayer2 = undefined;
      }
    };
  }, [playerId, handleGlide]);

  useFrame((state, delta) => {
    if (!ballRef.current || playerStatus !== 'playing' || isDead || !gameStarted.current) return;

    // Clamp delta to prevent huge jumps
    const clampedDelta = Math.min(delta, 0.033);
    
    // Calculate speed multiplier based on score (matching single player: 1 + score/3000)
    const currentScore = Math.floor(Math.abs(ballPositionRef.current.z) * 10);
    const speedMultiplier = 1 + (currentScore / 3000);
    
    // Game physics - faster for 1v1 mode (even faster start)
    const BASE_FORWARD_SPEED = 0.18;
    const FORWARD_SPEED = BASE_FORWARD_SPEED * speedMultiplier;
    const GLIDE_SPEED = 0.22;
    const LANE_WIDTH = 1.5;
    const MAX_X = 3 * LANE_WIDTH;
    const MIN_X = -3 * LANE_WIDTH;

    // Move forward (positive Z direction)
    const newZ = ballPositionRef.current.z + FORWARD_SPEED;
    const newY = 0.5;

    // Handle lateral movement (inverted because camera is behind looking forward)
    let newX = ballPositionRef.current.x;
    if (keysPressed.current.left) {
      newX += GLIDE_SPEED;
    }
    if (keysPressed.current.right) {
      newX -= GLIDE_SPEED;
    }
    newX = Math.max(MIN_X, Math.min(MAX_X, newX));

    // Update position directly on ref to avoid re-renders
    ballRef.current.position.set(newX, newY, newZ);
    ballPositionRef.current.set(newX, newY, newZ);
    
    // Only update state for score
    const newScore = Math.floor(Math.abs(newZ) * 10);
    if (newScore > score) {
      setScore(newScore);
      onScoreUpdate(newScore);
    }

    // Camera follows ball - behind and above, looking forward (positive Z)
    state.camera.position.set(newX * 0.3, 5, newZ - 10);
    state.camera.lookAt(newX * 0.2, 0, newZ + 20);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#00ffff" />
      
      <CyberBackground ballPosition={ballPositionRef.current} />
      <Ball ref={ballRef} skinId={playerSkin as any} />
      <Track ballPosition={ballPositionRef.current} />
      <Obstacles ballPosition={ballPositionRef.current} playerId={playerId} />
      <Coins ballPosition={ballPositionRef.current} playerId={playerId} />
      
      {isDead && deathPosition && (
        <DeathAnimation 
          position={[deathPosition.x, deathPosition.y, deathPosition.z]} 
          onComplete={() => {}} 
        />
      )}
    </>
  );
};
