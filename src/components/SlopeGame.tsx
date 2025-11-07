import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { GameScene } from './GameScene';
import { GameUI } from './GameUI';
import { HomeScreen } from './HomeScreen';
import { GameOverScreen } from './GameOverScreen';
import { useGameStore } from '../store/gameStore';
import { useGameMusic } from '../hooks/useGameMusic';

export const SlopeGame = () => {
  const { gameState, currentSection, isGameRunning, isJumping, restartGame, nextSection } = useGameStore();
  const [controls, setControls] = useState({ left: false, right: false });
  const { isMuted, toggleMute } = useGameMusic(isGameRunning);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameRunning) {
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

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameRunning, restartGame]);

  const handleBackToHome = () => {
    useGameStore.setState({ gameState: 'waiting', isGameRunning: false });
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-background">
      {gameState === 'waiting' && (
        <HomeScreen onStartGame={restartGame} />
      )}
      
      {gameState === 'gameOver' && (
        <GameOverScreen 
          onRestart={restartGame}
          onBackToHome={handleBackToHome}
        />
      )}
      
      <Canvas 
        shadows 
        className="bg-gradient-to-b from-cyber-dark to-background"
        gl={{ antialias: true, alpha: false }}
      >
        <PerspectiveCamera makeDefault position={[0, 6, 12]} fov={60} />
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
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />
    </div>
  );
};