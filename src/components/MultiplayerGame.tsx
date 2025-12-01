import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MultiplayerGameScene } from './MultiplayerGameScene';
import { GameUI } from './GameUI';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { useGameStore } from '@/store/gameStore';

interface MultiplayerGameProps {
  roomId: string;
  playerId: string;
  isPlayer1: boolean;
  onGameOver: () => void;
}

export const MultiplayerGame = ({ roomId, playerId, isPlayer1, onGameOver }: MultiplayerGameProps) => {
  const { room, updatePosition, updateScore, updateStatus } = useMultiplayer(playerId);
  const { score, ballPosition, gameState } = useGameStore();
  const lastUpdateRef = useRef({ position: 0, score: 0 });
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    updateStatus('playing');
    
    return () => {
      updateStatus('finished');
    };
  }, [updateStatus]);

  useEffect(() => {
    if (Math.abs(ballPosition.x - lastUpdateRef.current.position) > 0.5) {
      updatePosition(ballPosition.x);
      lastUpdateRef.current.position = ballPosition.x;
    }
  }, [ballPosition.x, updatePosition]);

  useEffect(() => {
    if (score !== lastUpdateRef.current.score) {
      updateScore(score);
      lastUpdateRef.current.score = score;
    }
  }, [score, updateScore]);

  useEffect(() => {
    if (room) {
      const opponentStatus = isPlayer1 ? room.player2_status : room.player1_status;
      
      if (opponentStatus === 'finished' || opponentStatus === 'left') {
        onGameOver();
      }
    }
  }, [room, isPlayer1, onGameOver]);

  const opponentPosition = room ? (isPlayer1 ? room.player2_position : room.player1_position) : 0;
  const opponentScore = room ? (isPlayer1 ? room.player2_score : room.player1_score) : 0;

  return (
    <div className="relative w-full h-screen flex">
      {/* Left side - Local player */}
      <div className="w-1/2 h-full relative border-r-2 border-primary/30">
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
          <MultiplayerGameScene 
            isLocalPlayer={true} 
            opponentPosition={opponentPosition}
            opponentScore={opponentScore}
          />
        </Canvas>
        
        <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur px-4 py-2 rounded-lg">
          <p className="font-bold text-white">Du</p>
          <p className="text-sm text-white">Poäng: {score}</p>
        </div>
      </div>

      {/* Right side - Opponent */}
      <div className="w-1/2 h-full relative">
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
          <MultiplayerGameScene 
            isLocalPlayer={false} 
            opponentPosition={opponentPosition}
            opponentScore={opponentScore}
          />
        </Canvas>
        
        <div className="absolute top-4 right-4 bg-accent/80 backdrop-blur px-4 py-2 rounded-lg">
          <p className="font-bold text-white">Motspelare</p>
          <p className="text-sm text-white">Poäng: {opponentScore}</p>
        </div>
      </div>

      {/* Game UI overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <GameUI 
          currentSection={0}
          gameState={gameState}
          onRestart={() => {}}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
        />
      </div>

      {/* Center divider */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary-glow to-primary pointer-events-none" />
    </div>
  );
};