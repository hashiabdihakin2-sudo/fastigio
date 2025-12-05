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
  const velocityRef = useRef(new Vector3(0, 0, 0));
  const [ballPosition, setBallPosition] = useState(new Vector3(0, 1, 0));
  const [score, setScore] = useState(0);
  const [isDead, setIsDead] = useState(false);
  const keysPressed = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const gameStarted = useRef(false);

  // Reset on mount
  useEffect(() => {
    setBallPosition(new Vector3(0, 1, 0));
    velocityRef.current.set(0, 0, 0);
    setScore(0);
    setIsDead(false);
    gameStarted.current = true;
  }, []);

  // Handle death from obstacles
  useEffect(() => {
    const handleDeath = () => {
      if (!isDead && playerStatus === 'playing') {
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

    const clampedDelta = Math.min(delta, 0.05);
    
    // Game physics constants
    const speed = 12;
    const glideForce = 25;
    const maxXSpeed = 18;
    const gravity = -35;
    const friction = 0.88;

    // Move forward automatically (negative Z is forward)
    velocityRef.current.z = -speed;

    // Apply lateral movement based on input
    if (keysPressed.current.left) {
      velocityRef.current.x = Math.max(velocityRef.current.x - glideForce * clampedDelta * 10, -maxXSpeed);
    }
    if (keysPressed.current.right) {
      velocityRef.current.x = Math.min(velocityRef.current.x + glideForce * clampedDelta * 10, maxXSpeed);
    }

    // Apply friction to lateral movement
    velocityRef.current.x *= friction;

    // Apply gravity
    velocityRef.current.y += gravity * clampedDelta;

    // Update position
    const newPosition = ballPosition.clone();
    newPosition.x += velocityRef.current.x * clampedDelta;
    newPosition.y += velocityRef.current.y * clampedDelta;
    newPosition.z += velocityRef.current.z * clampedDelta;

    // Clamp X position to track bounds
    newPosition.x = Math.max(-4, Math.min(4, newPosition.x));

    // Ground collision
    if (newPosition.y <= 1) {
      newPosition.y = 1;
      velocityRef.current.y = 0;
    }

    // Death if fall off track
    if (newPosition.y < -10) {
      setIsDead(true);
      onPlayerDied(score);
      return;
    }

    setBallPosition(newPosition);
    
    if (ballRef.current) {
      ballRef.current.position.copy(newPosition);
    }

    // Update score based on distance traveled
    const newScore = Math.floor(Math.abs(newPosition.z) / 5);
    if (newScore > score) {
      setScore(newScore);
      onScoreUpdate(newScore);
    }

    // Update camera to follow ball - camera behind the ball looking forward
    state.camera.position.x = newPosition.x * 0.5;
    state.camera.position.y = 6;
    state.camera.position.z = newPosition.z + 15; // Camera behind the ball
    state.camera.lookAt(newPosition.x * 0.3, 1, newPosition.z - 10); // Look ahead of the ball
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#00ffff" />
      
      <CyberBackground ballPosition={ballPosition} />
      <Ball ref={ballRef} skinId={playerSkin as any} />
      <Track ballPosition={ballPosition} />
      <Obstacles ballPosition={ballPosition} playerId={playerId} />
      <Coins ballPosition={ballPosition} playerId={playerId} />
      
      {isDead && (
        <DeathAnimation 
          position={[ballPosition.x, ballPosition.y, ballPosition.z]} 
          onComplete={() => {}} 
        />
      )}
    </>
  );
};
