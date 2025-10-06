import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { GameScene } from './GameScene';
import { GameUI } from './GameUI';
import { HomeScreen } from './HomeScreen';
import { useGameStore } from '../store/gameStore';

export const SlopeGame = () => {
  const { gameState, score, highScore, isGameRunning, restartGame } = useGameStore();
  const [controls, setControls] = useState({ left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          setControls(prev => ({ ...prev, left: true }));
          break;
        case 'arrowright':
        case 'd':
          setControls(prev => ({ ...prev, right: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          setControls(prev => ({ ...prev, left: false }));
          break;
        case 'arrowright':
        case 'd':
          setControls(prev => ({ ...prev, right: false }));
          break;
        case ' ':
          if (!isGameRunning) {
            restartGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameRunning, restartGame]);

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-background">
      {gameState === 'waiting' && (
        <HomeScreen onStartGame={restartGame} highScore={highScore} />
      )}
      
      <Canvas 
        shadows 
        className="bg-gradient-to-b from-cyber-dark to-background"
        gl={{ antialias: true, alpha: false }}
      >
        <PerspectiveCamera makeDefault position={[0, 12, 6]} fov={60} rotation={[-0.8, 0, 0]} />
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
        score={score}
        highScore={highScore}
        gameState={gameState}
        onRestart={restartGame}
      />
    </div>
  );
};