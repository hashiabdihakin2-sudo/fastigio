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
  const cameraGroupRef = useRef<Group>(null);
  const ballRef = useRef<Mesh>(null);
  const { 
    ballPosition, 
    setBallPosition, 
    gameState, 
    updateScore, 
    endGame,
    isGameRunning,
    cameraMode
  } = useGameStore();

  const velocity = useRef(new Vector3(0, 0, 0));
  const baseBallSpeed = 0.08; // Slower base speed for skill-based gameplay
  const gravity = -0.02; // Gentler gravity
  const baseSteerForce = 0.18; // More responsive steering for precision

  useFrame(() => {
    if (!isGameRunning || !ballRef.current) return;

    // Slower, more skill-based progression
    const distance = Math.abs(ballPosition.z);
    const progressMultiplier = 1 + (distance / 200); // Slower speed increase
    const difficultyMultiplier = Math.min(progressMultiplier, 3); // Lower cap for fairness
    
    // Smoother, more precise controls
    const currentBallSpeed = baseBallSpeed * Math.min(progressMultiplier, 2.5);
    const currentSteerForce = baseSteerForce * Math.min(1.3, 1 + (distance / 800)); // Better precision
    const steerDamping = Math.max(0.88, 0.96 - (distance / 1500)); // Smoother damping

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

    // Simple ground collision (track surface) - adjusted for larger ball
    if (newPosition.y < 0.6) { // Adjusted for larger ball radius
      newPosition.y = 0.6;
      velocity.current.y = 0;
    }

    // Track boundaries (wider field)
    if (Math.abs(newPosition.x) > 8) { // Wider boundaries
      endGame();
      return;
    }

    setBallPosition(newPosition);
    
    // Update score based on distance (positive Z movement)
    updateScore(Math.abs(newPosition.z * 10));

    // Update ball mesh position
    ballRef.current.position.copy(newPosition);

    // Dynamic camera system based on selected mode
    if (groupRef.current) {
      switch (cameraMode) {
        case 'first-person':
          // Camera at ball position, looking forward
          groupRef.current.position.set(-newPosition.x, -newPosition.y + 0.2, -newPosition.z);
          groupRef.current.rotation.set(0, 0, 0);
          break;
        case 'third-person':
          // Camera behind ball
          groupRef.current.position.set(-newPosition.x * 0.3, 0, -newPosition.z - 12);
          groupRef.current.rotation.set(0, 0, 0);
          break;
        case 'top-down':
          // Camera above looking down
          groupRef.current.position.set(-newPosition.x * 0.5, -25, -newPosition.z + 5);
          groupRef.current.rotation.set(Math.PI / 2.2, 0, 0);
          break;
      }
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
    <group ref={cameraGroupRef}>
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
    </group>
  );
};