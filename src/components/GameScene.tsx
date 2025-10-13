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
    isGameRunning
  } = useGameStore();

  const jumpStartY = useRef(0);
  const jumpProgress = useRef(0);
  const jumpStartZ = useRef(0);
  const jumpTargetZ = useRef(0);
  
  const SECTION_LENGTH = 4;
  const JUMP_HEIGHT = 2;
  const JUMP_DURATION = 30; // frames
  const gravity = -0.02;

  useFrame(() => {
    if (!isGameRunning || !ballRef.current) return;

    if (isJumping) {
      jumpProgress.current++;
      
      const t = jumpProgress.current / JUMP_DURATION;
      
      // Parabolic jump arc
      const heightProgress = Math.sin(t * Math.PI);
      const newY = jumpStartY.current + heightProgress * JUMP_HEIGHT;
      
      // Linear forward movement
      const newZ = jumpStartZ.current + (jumpTargetZ.current - jumpStartZ.current) * t;
      
      const newPosition = new Vector3(0, newY, newZ);
      setBallPosition(newPosition);
      ballRef.current.position.copy(newPosition);
      
      // End jump
      if (jumpProgress.current >= JUMP_DURATION) {
        setIsJumping(false);
        jumpProgress.current = 0;
        const landPosition = new Vector3(0, 0.5, jumpTargetZ.current);
        setBallPosition(landPosition);
        ballRef.current.position.copy(landPosition);
      }
    }

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
      setIsJumping(false);
      jumpProgress.current = 0;
    }
  }, [gameState, setBallPosition, setIsJumping]);

  // Start jump when section changes
  useEffect(() => {
    if (isGameRunning && !isJumping && ballRef.current) {
      jumpStartY.current = ballPosition.y;
      jumpStartZ.current = ballPosition.z;
      jumpTargetZ.current = currentSection * SECTION_LENGTH + SECTION_LENGTH;
      jumpProgress.current = 0;
      setIsJumping(true);
    }
  }, [currentSection]);

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