import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { GameScene } from './GameScene';
import { GameUI } from './GameUI';
import { HomeScreen } from './HomeScreen';
import { useGameStore } from '../store/gameStore';

export const SlopeGame = () => {
  const { gameState, currentSection, isGameRunning, isJumping, restartGame, nextSection } = useGameStore();
  const [controls, setControls] = useState({ left: false, right: false });

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
        setControls(prev => ({ ...prev, left: true }));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setControls(prev => ({ ...prev, right: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setControls(prev => ({ ...prev, left: false }));
      } else if (e.key === 'ArrowRight') {
        setControls(prev => ({ ...prev, right: false }));
      }
    };

    const handleClick = () => {
      if (!isGameRunning) {
        restartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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
        <PerspectiveCamera makeDefault position={[0, 8, 8]} fov={60} />
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