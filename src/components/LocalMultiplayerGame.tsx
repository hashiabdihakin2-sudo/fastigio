import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { LocalPlayerGameScene } from './LocalPlayerGameScene';
import { LocalMultiplayerLobby, PlayerConfig } from './LocalMultiplayerLobby';

interface LocalMultiplayerGameProps {
  onGameOver: () => void;
}

export const LocalMultiplayerGame = ({ onGameOver }: LocalMultiplayerGameProps) => {
  const [gamePhase, setGamePhase] = useState<'lobby' | 'playing' | 'ended'>('lobby');
  const [player1Config, setPlayer1Config] = useState<PlayerConfig | null>(null);
  const [player2Config, setPlayer2Config] = useState<PlayerConfig | null>(null);
  
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [player1Status, setPlayer1Status] = useState<'playing' | 'finished'>('playing');
  const [player2Status, setPlayer2Status] = useState<'playing' | 'finished'>('playing');
  const [winner, setWinner] = useState<string | null>(null);

  const handleStartGame = (p1: PlayerConfig, p2: PlayerConfig) => {
    setPlayer1Config(p1);
    setPlayer2Config(p2);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setPlayer1Status('playing');
    setPlayer2Status('playing');
    setWinner(null);
    setGamePhase('playing');
  };

  // Keyboard controls - Player 1 uses A/D, Player 2 uses Arrow keys
  useEffect(() => {
    if (gamePhase !== 'playing') return;

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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase, player1Status, player2Status]);

  const handlePlayer1ScoreUpdate = (score: number) => setPlayer1Score(score);
  const handlePlayer2ScoreUpdate = (score: number) => setPlayer2Score(score);

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
    if (gamePhase !== 'playing') return;

    if (player1Status === 'finished' && player2Status === 'playing') {
      setGamePhase('ended');
      setWinner(`${player2Config?.name || 'Spelare 2'} vann!`);
    } else if (player2Status === 'finished' && player1Status === 'playing') {
      setGamePhase('ended');
      setWinner(`${player1Config?.name || 'Spelare 1'} vann!`);
    } else if (player1Status === 'finished' && player2Status === 'finished') {
      setGamePhase('ended');
      if (player1Score > player2Score) {
        setWinner(`${player1Config?.name || 'Spelare 1'} vann!`);
      } else if (player2Score > player1Score) {
        setWinner(`${player2Config?.name || 'Spelare 2'} vann!`);
      } else {
        setWinner('Oavgjort!');
      }
    }
  }, [player1Status, player2Status, player1Score, player2Score, gamePhase, player1Config, player2Config]);

  const handlePlayAgain = () => {
    window.location.reload();
  };

  // Show lobby
  if (gamePhase === 'lobby') {
    return <LocalMultiplayerLobby onStartGame={handleStartGame} onBack={onGameOver} />;
  }

  return (
    <div className="relative w-full h-[100dvh] flex flex-row overflow-hidden bg-background">
      {/* Player 1 Side - Left */}
      <div className="flex-1 w-1/2 h-full relative border-r border-primary/30">
        <Canvas shadows gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}>
          <PerspectiveCamera makeDefault position={[0, 6, -12]} fov={70} />
          <LocalPlayerGameScene 
            playerId={1}
            playerStatus={player1Status}
            playerSkin={player1Config?.skin || 'classic'}
            onScoreUpdate={handlePlayer1ScoreUpdate}
            onPlayerDied={handlePlayer1Died}
          />
        </Canvas>
        
        <div className="absolute top-1 left-1 bg-primary/80 backdrop-blur px-2 py-0.5 rounded-lg z-10">
          <p className="font-bold text-white text-[10px]">{player1Config?.name || 'P1'}</p>
          <p className="text-[10px] text-white">{player1Score}</p>
        </div>

        {/* Mobile control - Player 1 */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col gap-2 pointer-events-auto z-10">
          <Button
            size="icon"
            className="rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary shadow-glow w-10 h-10 text-sm font-bold active:scale-95"
            onTouchStart={(e) => { e.preventDefault(); if (player1Status === 'playing') (window as any).handleGlidePlayer1?.('left'); }}
          >
            ←
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary shadow-glow w-10 h-10 text-sm font-bold active:scale-95"
            onTouchStart={(e) => { e.preventDefault(); if (player1Status === 'playing') (window as any).handleGlidePlayer1?.('right'); }}
          >
            →
          </Button>
        </div>
      </div>

      {/* Player 2 Side - Right */}
      <div className="flex-1 w-1/2 h-full relative">
        <Canvas shadows gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}>
          <PerspectiveCamera makeDefault position={[0, 6, -12]} fov={70} />
          <LocalPlayerGameScene 
            playerId={2}
            playerStatus={player2Status}
            playerSkin={player2Config?.skin || 'fire'}
            onScoreUpdate={handlePlayer2ScoreUpdate}
            onPlayerDied={handlePlayer2Died}
          />
        </Canvas>
        
        <div className="absolute top-1 right-1 bg-accent/80 backdrop-blur px-2 py-0.5 rounded-lg text-right z-10">
          <p className="font-bold text-white text-[10px]">{player2Config?.name || 'P2'}</p>
          <p className="text-[10px] text-white">{player2Score}</p>
        </div>

        {/* Mobile control - Player 2 */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col gap-2 pointer-events-auto z-10">
          <Button
            size="icon"
            className="rounded-full bg-accent/80 backdrop-blur-md hover:bg-accent shadow-glow w-10 h-10 text-sm font-bold active:scale-95"
            onTouchStart={(e) => { e.preventDefault(); if (player2Status === 'playing') (window as any).handleGlidePlayer2?.('left'); }}
          >
            ←
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-accent/80 backdrop-blur-md hover:bg-accent shadow-glow w-10 h-10 text-sm font-bold active:scale-95"
            onTouchStart={(e) => { e.preventDefault(); if (player2Status === 'playing') (window as any).handleGlidePlayer2?.('right'); }}
          >
            →
          </Button>
        </div>
      </div>

      {/* Center divider */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary-glow to-accent pointer-events-none z-5" />

      {/* Game Over Screen */}
      {gamePhase === 'ended' && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <Card className="p-4 sm:p-8 max-w-md w-full text-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">{winner}</h2>
            <div className="space-y-2">
              <p className="text-base sm:text-lg">
                {player1Config?.name || 'Spelare 1'}: <span className="font-bold text-primary">{player1Score}</span>
              </p>
              <p className="text-base sm:text-lg">
                {player2Config?.name || 'Spelare 2'}: <span className="font-bold text-accent">{player2Score}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button onClick={handlePlayAgain} size="lg" className="flex-1">
                Spela igen
              </Button>
              <Button onClick={onGameOver} size="lg" variant="outline" className="flex-1">
                Tillbaka till meny
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
