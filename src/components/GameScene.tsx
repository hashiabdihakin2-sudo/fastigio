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

  const jumpStartY = useRef(0);
  const jumpProgress = useRef(0);
  const jumpStartX = useRef(0);
  const jumpTargetX = useRef(0);
  
  const FORWARD_SPEED = 0.1;
  const JUMP_HEIGHT = 1.5;
  const JUMP_DURATION = 20; // frames
  const LANE_WIDTH = 1.5;
  const NUM_LANES = 7; // -3, -2, -1, 0, 1, 2, 3
  const currentLane = useRef(0);

  useFrame(() => {
    if (!isGameRunning || !ballRef.current) return;

    // Continuous forward movement
    const newZ = ballPosition.z + FORWARD_SPEED;
    let newX = ballPosition.x;
    let newY = ballPosition.y;

    // Update score based on distance
    const currentScore = Math.floor(Math.abs(newZ) * 10);
    updateScore(currentScore);

    if (isJumping) {
      jumpProgress.current++;
      
      const t = jumpProgress.current / JUMP_DURATION;
      
      // Parabolic jump arc
      const heightProgress = Math.sin(t * Math.PI);
      newY = jumpStartY.current + heightProgress * JUMP_HEIGHT;
      
      // Linear sideways movement
      newX = jumpStartX.current + (jumpTargetX.current - jumpStartX.current) * t;
      
      // End jump
      if (jumpProgress.current >= JUMP_DURATION) {
        setIsJumping(false);
        jumpProgress.current = 0;
        newY = 0.5;
        newX = jumpTargetX.current;
      }
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
      setIsJumping(false);
      jumpProgress.current = 0;
      currentLane.current = 0;
    }
  }, [gameState, setBallPosition, setIsJumping]);

  // Expose jump left/right function
  useEffect(() => {
    const handleJump = (direction: 'left' | 'right') => {
      if (isJumping || !isGameRunning) return;
      
      const newLane = direction === 'left' 
        ? Math.max(-3, currentLane.current - 1)
        : Math.min(3, currentLane.current + 1);
      
      if (newLane === currentLane.current) return;
      
      jumpStartY.current = ballPosition.y;
      jumpStartX.current = ballPosition.x;
      jumpTargetX.current = newLane * LANE_WIDTH;
      jumpProgress.current = 0;
      currentLane.current = newLane;
      setIsJumping(true);
    };

    (window as any).jumpBall = handleJump;
  }, [isJumping, isGameRunning, ballPosition]);

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