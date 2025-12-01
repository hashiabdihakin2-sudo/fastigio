import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Ball } from './Ball';
import { Track } from './Track';
import { Obstacles } from './Obstacles';
import { Coins } from './Coins';
import { CyberBackground } from './CyberBackground';
import { DeathAnimation } from './DeathAnimation';
import { useGameStore } from '../store/gameStore';

interface MultiplayerGameSceneProps {
  isLocalPlayer: boolean;
  opponentPosition: number;
  opponentScore: number;
}

export const MultiplayerGameScene = ({ isLocalPlayer, opponentPosition, opponentScore }: MultiplayerGameSceneProps) => {
  const ballRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const velocityRef = useRef(new Vector3(0, 0, 0));
  const { 
    ballPosition, 
    setBallPosition, 
    updateScore, 
    endGame, 
    gameState,
    score,
    selectedSkin 
  } = useGameStore();

  // Initialize position
  useEffect(() => {
    if (isLocalPlayer && gameState === 'playing') {
      setBallPosition(new Vector3(0, 1, 0));
      velocityRef.current.set(0, 0, 0);
    }
  }, [gameState, isLocalPlayer, setBallPosition]);

  useFrame((state, delta) => {
    if (!ballRef.current || gameState !== 'playing') return;

    const speed = 8;
    const glideForce = 12;
    const maxXSpeed = 15;
    const gravity = -30;

    if (isLocalPlayer) {
      // Move forward automatically
      velocityRef.current.z = -speed;

      // Apply glide momentum
      if ((window as any).glideDirection) {
        if ((window as any).glideDirection === 'left') {
          velocityRef.current.x = Math.max(velocityRef.current.x - glideForce * delta, -maxXSpeed);
        } else if ((window as any).glideDirection === 'right') {
          velocityRef.current.x = Math.min(velocityRef.current.x + glideForce * delta, maxXSpeed);
        }
        (window as any).glideDirection = null;
      }

      // Apply friction
      velocityRef.current.x *= 0.92;

      // Apply gravity
      velocityRef.current.y += gravity * delta;

      // Update position
      const newPosition = ballPosition.clone();
      newPosition.x += velocityRef.current.x * delta;
      newPosition.y += velocityRef.current.y * delta;
      newPosition.z += velocityRef.current.z * delta;

      // Clamp X position
      newPosition.x = Math.max(-4, Math.min(4, newPosition.x));

      // Ground collision
      if (newPosition.y <= 1) {
        newPosition.y = 1;
        velocityRef.current.y = 0;
      }

      // Death if fall off
      if (newPosition.y < -5) {
        endGame();
        return;
      }

      setBallPosition(newPosition);
      ballRef.current.position.copy(newPosition);

      // Update score
      const newScore = Math.floor(Math.abs(newPosition.z) / 5);
      if (newScore > score) {
        updateScore(newScore);
      }

      // Update camera to follow
      if (state.camera) {
        state.camera.position.x = newPosition.x;
        state.camera.position.z = newPosition.z + 12;
        state.camera.lookAt(newPosition);
      }
    } else {
      // Opponent ball - just show position
      const opponentPos = new Vector3(opponentPosition, 1, ballPosition.z);
      ballRef.current.position.copy(opponentPos);
    }
  });

  // Handle glide controls
  useEffect(() => {
    if (!isLocalPlayer) return;

    (window as any).handleGlide = (direction: 'left' | 'right') => {
      if (gameState === 'playing') {
        (window as any).glideDirection = direction;
      }
    };

    return () => {
      (window as any).handleGlide = undefined;
    };
  }, [gameState, isLocalPlayer]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#00ffff" />
      
      <CyberBackground ballPosition={ballPosition} />
      
      {isLocalPlayer ? (
        <>
          <Ball ref={ballRef} />
          <Track ballPosition={ballPosition} />
          <Obstacles ballPosition={ballPosition} />
          <Coins ballPosition={ballPosition} />
          {gameState === 'gameOver' && <DeathAnimation position={[ballPosition.x, ballPosition.y, ballPosition.z]} onComplete={() => {}} />}
        </>
      ) : (
        <Ball ref={ballRef} />
      )}
    </>
  );
};