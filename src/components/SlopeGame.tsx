import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { GameScene } from './GameScene';
import { GameUI } from './GameUI';
import { HomeScreen } from './HomeScreen';
import { useGameStore } from '../store/gameStore';
import { useGameMusic } from '../hooks/useGameMusic';

export const SlopeGame = () => {
  const { gameState, currentSection, isGameRunning, isJumping, restartGame, nextSection } = useGameStore();
  const [controls, setControls] = useState({ left: false, right: false });

  // Play music when game is running
  useGameMusic(isGameRunning);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameRunning) {
        if (e.key === ' ') {
          e.preventDefault();
          restartGame();
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        (window as any).handleGlide?.('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        (window as any).handleGlide?.('right');
      }
    };

    const handleClick = () => {
      if (!isGameRunning) {
        restartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [isGameRunning, restartGame]);

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-background">
      {gameState === 'waiting' && (
        <HomeScreen onStartGame={restartGame} />
      )}
      
      <Canvas 
        shadows 
        className="bg-gradient-to-b from-cyber-dark to-background"
        gl={{ antialias: true, alpha: false }}
      >
        <CameraController />
        <Suspense fallback={null}>
          <GameScene controls={controls} />
        </Suspense>
        <OrbitControls 
          enabled={false} 
          enablePan={false} 
          enableZoom={false} 
          enableRotate={false}
        />
      </Canvas>
      
      <GameUI 
        currentSection={currentSection}
        gameState={gameState}
        onRestart={restartGame}
      />
    </div>
  );
};

// Camera controller that follows the ball from behind with smooth movement
const CameraController = () => {
  const { camera } = useThree();
  const { ballPosition, isGameRunning } = useGameStore();

  useEffect(() => {
    if (!isGameRunning) return;
    
    // Camera positioned further behind to keep ball always visible
    const targetX = ballPosition.x;
    const targetY = ballPosition.y + 6; // 6 units above ball
    const targetZ = ballPosition.z - 12; // 12 units behind ball (further back)

    // Slower lerp for smoother camera movement (ball will appear faster)
    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.position.z += (targetZ - camera.position.z) * 0.08;

    // Look at the ball directly
    camera.lookAt(ballPosition.x, ballPosition.y, ballPosition.z);
  });

  return null;
};