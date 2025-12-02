import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MultiplayerGameScene } from './MultiplayerGameScene';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { useGameStore } from '@/store/gameStore';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface MultiplayerGameProps {
  roomId: string;
  playerId: string;
  isPlayer1: boolean;
  onGameOver: () => void;
}

export const MultiplayerGame = ({ roomId, playerId, isPlayer1, onGameOver }: MultiplayerGameProps) => {
  const { room, updatePosition, updateScore, updateStatus } = useMultiplayer(playerId);
  const { score, ballPosition, restartGame } = useGameStore();
  const lastUpdateRef = useRef({ position: 0, score: 0 });
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Start game when component mounts
  useEffect(() => {
    restartGame();
    updateStatus('playing');
    
    return () => {
      updateStatus('finished');
    };
  }, [updateStatus, restartGame]);

  // Keyboard controls - Player 1 uses A/D, Player 2 uses Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPlayer1) {
        // Player 1 uses A and D
        if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          (window as any).handleGlidePlayer1?.('left');
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          (window as any).handleGlidePlayer1?.('right');
        }
      } else {
        // Player 2 uses Arrow keys
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          (window as any).handleGlidePlayer2?.('left');
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          (window as any).handleGlidePlayer2?.('right');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlayer1]);

  // Update position in database
  useEffect(() => {
    if (Math.abs(ballPosition.x - lastUpdateRef.current.position) > 0.3) {
      updatePosition(ballPosition.x);
      lastUpdateRef.current.position = ballPosition.x;
    }
  }, [ballPosition.x, updatePosition]);

  // Update score in database
  useEffect(() => {
    if (score !== lastUpdateRef.current.score) {
      updateScore(score);
      lastUpdateRef.current.score = score;
    }
  }, [score, updateScore]);

  // Check for game end conditions
  useEffect(() => {
    if (!room || gameEnded) return;

    const myScore = isPlayer1 ? room.player1_score : room.player2_score;
    const opponentScore = isPlayer1 ? room.player2_score : room.player1_score;
    const myStatus = isPlayer1 ? room.player1_status : room.player2_status;
    const opponentStatus = isPlayer1 ? room.player2_status : room.player1_status;

    // Check if either player died (stopped playing)
    if (opponentStatus === 'finished' && myStatus === 'playing') {
      // Opponent died, I win
      setGameEnded(true);
      setWinner('Du vann!');
      updateStatus('finished');
    } else if (myStatus === 'finished' && opponentStatus === 'playing') {
      // I died, opponent wins
      setGameEnded(true);
      setWinner('Motspelaren vann!');
    } else if (myStatus === 'finished' && opponentStatus === 'finished') {
      // Both finished, highest score wins
      if (myScore > opponentScore) {
        setWinner('Du vann!');
      } else if (opponentScore > myScore) {
        setWinner('Motspelaren vann!');
      } else {
        setWinner('Oavgjort!');
      }
      setGameEnded(true);
    }

    // Check if opponent left
    if (opponentStatus === 'left') {
      setGameEnded(true);
      setWinner('Motspelaren lämnade - Du vann!');
      updateStatus('finished');
    }
  }, [room, isPlayer1, gameEnded, updateStatus]);

  const opponentPosition = room ? (isPlayer1 ? room.player2_position : room.player1_position) : 0;
  const opponentScore = room ? (isPlayer1 ? room.player2_score : room.player1_score) : 0;
  const myScore = room ? (isPlayer1 ? room.player1_score : room.player2_score) : score;

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
          <p className="text-sm text-white">Poäng: {myScore}</p>
        </div>
      </div>

      {/* Right side - Opponent view */}
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

      {/* Game Over Screen */}
      {gameEnded && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50">
          <Card className="p-8 max-w-md w-full text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary">{winner}</h2>
            <div className="space-y-2">
              <p className="text-lg">Ditt poäng: <span className="font-bold text-primary">{myScore}</span></p>
              <p className="text-lg">Motspelare: <span className="font-bold text-accent">{opponentScore}</span></p>
            </div>
            <Button onClick={onGameOver} size="lg" className="w-full">
              Tillbaka till lobby
            </Button>
          </Card>
        </div>
      )}

      {/* Center divider */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary-glow to-primary pointer-events-none" />
      
      {/* Mobile controls for Player 1 (A/D) */}
      {isPlayer1 && (
        <div className="absolute bottom-8 left-1/4 -translate-x-1/2 flex gap-4 pointer-events-auto z-10">
          <Button
            size="icon"
            variant="default"
            className="rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary shadow-glow w-16 h-16"
            onTouchStart={(e) => {
              e.preventDefault();
              (window as any).handleGlidePlayer1?.('left');
            }}
            onClick={() => (window as any).handleGlidePlayer1?.('left')}
          >
            A
          </Button>
          <Button
            size="icon"
            variant="default"
            className="rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary shadow-glow w-16 h-16"
            onTouchStart={(e) => {
              e.preventDefault();
              (window as any).handleGlidePlayer1?.('right');
            }}
            onClick={() => (window as any).handleGlidePlayer1?.('right')}
          >
            D
          </Button>
        </div>
      )}

      {/* Mobile controls for Player 2 (Arrow keys) */}
      {!isPlayer1 && (
        <div className="absolute bottom-8 right-1/4 translate-x-1/2 flex gap-4 pointer-events-auto z-10">
          <Button
            size="icon"
            variant="default"
            className="rounded-full bg-accent/80 backdrop-blur-md hover:bg-accent shadow-glow w-16 h-16"
            onTouchStart={(e) => {
              e.preventDefault();
              (window as any).handleGlidePlayer2?.('left');
            }}
            onClick={() => (window as any).handleGlidePlayer2?.('left')}
          >
            ←
          </Button>
          <Button
            size="icon"
            variant="default"
            className="rounded-full bg-accent/80 backdrop-blur-md hover:bg-accent shadow-glow w-16 h-16"
            onTouchStart={(e) => {
              e.preventDefault();
              (window as any).handleGlidePlayer2?.('right');
            }}
            onClick={() => (window as any).handleGlidePlayer2?.('right')}
          >
            →
          </Button>
        </div>
      )}
    </div>
  );
};