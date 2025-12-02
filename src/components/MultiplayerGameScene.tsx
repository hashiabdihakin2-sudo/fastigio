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
  playerId: number;
  playerStatus: 'playing' | 'finished';
  opponentPosition: number;
  opponentScore: number;
}

export const MultiplayerGameScene = ({ isLocalPlayer, playerId, playerStatus, opponentPosition, opponentScore }: MultiplayerGameSceneProps) => {
  const ballRef = useRef<any>(null);
  const velocityRef = useRef(new Vector3(0, 0, 0));
  const opponentBallPositionRef = useRef(new Vector3(opponentPosition, 1, 0));
  
  const { 
    ballPosition, 
    setBallPosition, 
    updateScore, 
    endGame, 
    gameState,
    score
  } = useGameStore();

  // Initialize position for local player
  useEffect(() => {
    if (isLocalPlayer) {
      setBallPosition(new Vector3(0, 1, 0));
      velocityRef.current.set(0, 0, 0);
    }
  }, [isLocalPlayer, setBallPosition]);

  // Update opponent position from props
  useEffect(() => {
    if (!isLocalPlayer) {
      opponentBallPositionRef.current.x = opponentPosition;
      // Move opponent forward based on their score
      opponentBallPositionRef.current.z = -(opponentScore * 5);
    }
  }, [opponentPosition, opponentScore, isLocalPlayer]);

  useFrame((state, delta) => {
    if (!ballRef.current) return;

    if (isLocalPlayer && playerStatus === 'playing') {
      // Local player physics
      const speed = 8;
      const glideForce = 12;
      const maxXSpeed = 15;
      const gravity = -30;

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
        if (playerId === 1) {
          (window as any).onPlayer1Died?.(score);
        } else {
          (window as any).onPlayer2Died?.(score);
        }
        return;
      }

      setBallPosition(newPosition);
      ballRef.current.position.copy(newPosition);

      // Update score
      const newScore = Math.floor(Math.abs(newPosition.z) / 5);
      if (newScore > score) {
        updateScore(newScore);
        if (playerId === 1) {
          (window as any).updatePlayer1Score?.(newScore);
        } else {
          (window as any).updatePlayer2Score?.(newScore);
        }
      }

      // Update camera to follow
      if (state.camera) {
        state.camera.position.x = newPosition.x;
        state.camera.position.z = newPosition.z + 12;
        state.camera.lookAt(newPosition);
      }
    } else {
      // Opponent view - show their ball moving
      ballRef.current.position.copy(opponentBallPositionRef.current);
      
      // Camera follows opponent
      if (state.camera) {
        state.camera.position.x = opponentBallPositionRef.current.x;
        state.camera.position.z = opponentBallPositionRef.current.z + 12;
        state.camera.lookAt(opponentBallPositionRef.current);
      }
    }
  });

  // Handle glide controls for local player
  useEffect(() => {
    if (!isLocalPlayer) return;

    if (playerId === 1) {
      (window as any).handleGlidePlayer1 = (direction: 'left' | 'right') => {
        if (playerStatus === 'playing') {
          (window as any).glideDirection = direction;
        }
      };
    } else {
      (window as any).handleGlidePlayer2 = (direction: 'left' | 'right') => {
        if (playerStatus === 'playing') {
          (window as any).glideDirection = direction;
        }
      };
    }

    return () => {
      if (playerId === 1) {
        (window as any).handleGlidePlayer1 = undefined;
      } else {
        (window as any).handleGlidePlayer2 = undefined;
      }
    };
  }, [playerStatus, isLocalPlayer, playerId]);

  const displayPosition = isLocalPlayer ? ballPosition : opponentBallPositionRef.current;

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
      
      <CyberBackground ballPosition={displayPosition} />
      <Ball ref={ballRef} />
      <Track ballPosition={displayPosition} />
      <Obstacles ballPosition={displayPosition} />
      <Coins ballPosition={displayPosition} />
      
      {isLocalPlayer && gameState === 'gameOver' && (
        <DeathAnimation 
          position={[ballPosition.x, ballPosition.y, ballPosition.z]} 
          onComplete={() => {}} 
        />
      )}
    </>
  );
};