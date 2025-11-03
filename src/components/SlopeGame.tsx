import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useEffect, useState, useRef } from 'react';
import { GameScene } from './GameScene';
import { GameUI } from './GameUI';
import { HomeScreen } from './HomeScreen';
import { useGameStore } from '../store/gameStore';

export const SlopeGame = () => {
  const { gameState, currentSection, isGameRunning, isJumping, restartGame, nextSection } = useGameStore();
  const [controls, setControls] = useState({ left: false, right: false });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Start music when game starts
  useEffect(() => {
    if (isGameRunning && audioRef.current) {
      audioRef.current.play();
    } else if (!isGameRunning && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isGameRunning]);

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
      {/* Background music */}
      <audio
        ref={audioRef}
        loop
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w=="
      />
      
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

// Camera controller that follows the ball from behind
const CameraController = () => {
  const { camera } = useThree();
  const { ballPosition } = useGameStore();

  useEffect(() => {
    // Position camera behind and above the ball
    const targetX = ballPosition.x;
    const targetY = ballPosition.y + 4; // 4 units above ball
    const targetZ = ballPosition.z - 8; // 8 units behind ball

    camera.position.set(targetX, targetY, targetZ);
    camera.lookAt(ballPosition.x, ballPosition.y, ballPosition.z + 3);
  }, [ballPosition, camera]);

  return null;
};