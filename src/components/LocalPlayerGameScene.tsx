import { useRef, useEffect, useState } from 'react';
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
  const glideDirectionRef = useRef<'left' | 'right' | null>(null);

  // Initialize position
  useEffect(() => {
    setBallPosition(new Vector3(0, 1, 0));
    velocityRef.current.set(0, 0, 0);
    setScore(0);
    setIsDead(false);
  }, []);

  useFrame((state, delta) => {
    if (!ballRef.current || playerStatus !== 'playing' || isDead) return;

    // Local player physics
    const speed = 8;
    const glideForce = 12;
    const maxXSpeed = 15;
    const gravity = -30;

    // Move forward automatically
    velocityRef.current.z = -speed;

    // Apply glide momentum
    if (glideDirectionRef.current) {
      if (glideDirectionRef.current === 'left') {
        velocityRef.current.x = Math.max(velocityRef.current.x - glideForce * delta, -maxXSpeed);
      } else if (glideDirectionRef.current === 'right') {
        velocityRef.current.x = Math.min(velocityRef.current.x + glideForce * delta, maxXSpeed);
      }
      glideDirectionRef.current = null;
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
      setIsDead(true);
      onPlayerDied(score);
      return;
    }

    setBallPosition(newPosition);
    ballRef.current.position.copy(newPosition);

    // Update score
    const newScore = Math.floor(Math.abs(newPosition.z) / 5);
    if (newScore > score) {
      setScore(newScore);
      onScoreUpdate(newScore);
    }

    // Update camera to follow
    if (state.camera) {
      state.camera.position.x = newPosition.x;
      state.camera.position.z = newPosition.z + 12;
      state.camera.lookAt(newPosition);
    }
  });

  // Handle glide controls for this player
  useEffect(() => {
    if (playerId === 1) {
      (window as any).handleGlidePlayer1 = (direction: 'left' | 'right') => {
        if (playerStatus === 'playing' && !isDead) {
          glideDirectionRef.current = direction;
        }
      };
    } else {
      (window as any).handleGlidePlayer2 = (direction: 'left' | 'right') => {
        if (playerStatus === 'playing' && !isDead) {
          glideDirectionRef.current = direction;
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
  }, [playerStatus, playerId, isDead]);

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
      <Ball ref={ballRef} skinId={playerSkin as any} />
      <Track ballPosition={ballPosition} />
      <Obstacles ballPosition={ballPosition} playerId={playerId} />
      <Coins ballPosition={ballPosition} />
      
      {isDead && (
        <DeathAnimation 
          position={[ballPosition.x, ballPosition.y, ballPosition.z]} 
          onComplete={() => {}} 
        />
      )}
    </>
  );
};
