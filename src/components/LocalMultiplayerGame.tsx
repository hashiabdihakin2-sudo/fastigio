import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { LocalPlayerGameScene } from './LocalPlayerGameScene';

interface LocalMultiplayerGameProps {
  onGameOver: () => void;
}

export const LocalMultiplayerGame = ({ onGameOver }: LocalMultiplayerGameProps) => {
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [player1Status, setPlayer1Status] = useState<'playing' | 'finished'>('playing');
  const [player2Status, setPlayer2Status] = useState<'playing' | 'finished'>('playing');
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Keyboard controls - Player 1 uses A/D, Player 2 uses Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Player 1 uses A and D
      if ((e.key === 'a' || e.key === 'A') && player1Status === 'playing') {
        e.preventDefault();
        (window as any).handleGlidePlayer1?.('left');
      } else if ((e.key === 'd' || e.key === 'D') && player1Status === 'playing') {
        e.preventDefault();
        (window as any).handleGlidePlayer1?.('right');
      }
      
      // Player 2 uses Arrow keys
      if (e.key === 'ArrowLeft' && player2Status === 'playing') {
        e.preventDefault();
        (window as any).handleGlidePlayer2?.('left');
      } else if (e.key === 'ArrowRight' && player2Status === 'playing') {
        e.preventDefault();
        (window as any).handleGlidePlayer2?.('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player1Status, player2Status]);

  const handlePlayer1ScoreUpdate = (score: number) => {
    setPlayer1Score(score);
  };

  const handlePlayer2ScoreUpdate = (score: number) => {
    setPlayer2Score(score);
  };

  const handlePlayer1Died = (finalScore: number) => {
    setPlayer1Score(finalScore);
    setPlayer1Status('finished');
  };

  const handlePlayer2Died = (finalScore: number) => {
    setPlayer2Score(finalScore);
    setPlayer2Status('finished');
  };

  // Check for game end conditions
  useEffect(() => {
    if (gameEnded) return;

    // Check if either player died
    if (player1Status === 'finished' && player2Status === 'playing') {
      setGameEnded(true);
      setWinner('Spelare 2 vann!');
    } else if (player2Status === 'finished' && player1Status === 'playing') {
      setGameEnded(true);
      setWinner('Spelare 1 vann!');
    } else if (player1Status === 'finished' && player2Status === 'finished') {
      // Both finished, highest score wins
      if (player1Score > player2Score) {
        setWinner('Spelare 1 vann!');
      } else if (player2Score > player1Score) {
        setWinner('Spelare 2 vann!');
      } else {
        setWinner('Oavgjort!');
      }
      setGameEnded(true);
    }
  }, [player1Status, player2Status, player1Score, player2Score, gameEnded]);

  return (
    <div className="relative w-full h-screen flex">
      {/* Left side - Player 1 */}
      <div className="w-1/2 h-full relative border-r-2 border-primary/30">
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
          <LocalPlayerGameScene 
            playerId={1}
            playerStatus={player1Status}
            onScoreUpdate={handlePlayer1ScoreUpdate}
            onPlayerDied={handlePlayer1Died}
          />
        </Canvas>
        
        <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur px-4 py-2 rounded-lg">
          <p className="font-bold text-white">Spelare 1 (A/D)</p>
          <p className="text-sm text-white">Poäng: {player1Score}</p>
        </div>
      </div>

      {/* Right side - Player 2 */}
      <div className="w-1/2 h-full relative">
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
          <LocalPlayerGameScene 
            playerId={2}
            playerStatus={player2Status}
            onScoreUpdate={handlePlayer2ScoreUpdate}
            onPlayerDied={handlePlayer2Died}
          />
        </Canvas>
        
        <div className="absolute top-4 right-4 bg-accent/80 backdrop-blur px-4 py-2 rounded-lg">
          <p className="font-bold text-white">Spelare 2 (← →)</p>
          <p className="text-sm text-white">Poäng: {player2Score}</p>
        </div>
      </div>

      {/* Game Over Screen */}
      {gameEnded && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50">
          <Card className="p-8 max-w-md w-full text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary">{winner}</h2>
            <div className="space-y-2">
              <p className="text-lg">Spelare 1: <span className="font-bold text-primary">{player1Score}</span></p>
              <p className="text-lg">Spelare 2: <span className="font-bold text-accent">{player2Score}</span></p>
            </div>
            <Button onClick={onGameOver} size="lg" className="w-full">
              Tillbaka till meny
            </Button>
          </Card>
        </div>
      )}

      {/* Center divider */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary-glow to-primary pointer-events-none" />
      
      {/* Mobile controls for Player 1 (A/D) */}
      <div className="absolute bottom-8 left-1/4 -translate-x-1/2 flex gap-4 pointer-events-auto z-10">
        <Button
          size="icon"
          variant="default"
          className="rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary shadow-glow w-16 h-16"
          onTouchStart={(e) => {
            e.preventDefault();
            if (player1Status === 'playing') {
              (window as any).handleGlidePlayer1?.('left');
            }
          }}
          onClick={() => {
            if (player1Status === 'playing') {
              (window as any).handleGlidePlayer1?.('left');
            }
          }}
        >
          A
        </Button>
        <Button
          size="icon"
          variant="default"
          className="rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary shadow-glow w-16 h-16"
          onTouchStart={(e) => {
            e.preventDefault();
            if (player1Status === 'playing') {
              (window as any).handleGlidePlayer1?.('right');
            }
          }}
          onClick={() => {
            if (player1Status === 'playing') {
              (window as any).handleGlidePlayer1?.('right');
            }
          }}
        >
          D
        </Button>
      </div>

      {/* Mobile controls for Player 2 (Arrow keys) */}
      <div className="absolute bottom-8 right-1/4 translate-x-1/2 flex gap-4 pointer-events-auto z-10">
        <Button
          size="icon"
          variant="default"
          className="rounded-full bg-accent/80 backdrop-blur-md hover:bg-accent shadow-glow w-16 h-16"
          onTouchStart={(e) => {
            e.preventDefault();
            if (player2Status === 'playing') {
              (window as any).handleGlidePlayer2?.('left');
            }
          }}
          onClick={() => {
            if (player2Status === 'playing') {
              (window as any).handleGlidePlayer2?.('left');
            }
          }}
        >
          ←
        </Button>
        <Button
          size="icon"
          variant="default"
          className="rounded-full bg-accent/80 backdrop-blur-md hover:bg-accent shadow-glow w-16 h-16"
          onTouchStart={(e) => {
            e.preventDefault();
            if (player2Status === 'playing') {
              (window as any).handleGlidePlayer2?.('right');
            }
          }}
          onClick={() => {
            if (player2Status === 'playing') {
              (window as any).handleGlidePlayer2?.('right');
            }
          }}
        >
          →
        </Button>
      </div>
    </div>
  );
};
