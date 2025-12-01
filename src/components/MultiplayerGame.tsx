import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GameScene } from './GameScene';
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
    <div className="relative w-full h-screen">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <GameScene controls={{ left: false, right: false }} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      <GameUI 
        currentSection={0}
        gameState={gameState}
        onRestart={() => {}}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
      />
      
      {/* Opponent Info */}
      <div className="absolute top-20 right-4 bg-background/80 backdrop-blur p-4 rounded-lg space-y-2">
        <h3 className="font-bold text-sm text-muted-foreground">Motspelare</h3>
        <div className="space-y-1">
          <p className="text-sm">Position: {opponentPosition.toFixed(1)}</p>
          <p className="text-sm">Poäng: {opponentScore}</p>
        </div>
      </div>
    </div>
  );
};