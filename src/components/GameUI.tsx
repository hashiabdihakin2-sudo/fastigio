import { Button } from './ui/button';
import { Card } from './ui/card';
import { useGameStore } from '../store/gameStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GameUIProps {
  currentSection: number;
  gameState: 'waiting' | 'playing' | 'gameOver';
  onRestart: () => void;
}

export const GameUI = ({ currentSection, gameState, onRestart }: GameUIProps) => {
  const { score, highScore } = useGameStore();
  
  const handleMobileControl = (direction: 'left' | 'right') => {
    (window as any).handleGlide?.(direction);
  };
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Score display */}
      <div className="absolute top-8 left-8 pointer-events-auto">
        <Card className="cyber-border p-4 bg-card/80 backdrop-blur-md">
          <div className="text-2xl font-bold text-neon-blue">
            {score}
          </div>
          <div className="text-xs text-muted-foreground">
            Rekord: {highScore}
          </div>
        </Card>
      </div>

      {/* Controls hint */}
      {gameState === 'playing' && (
        <div className="absolute top-8 right-8 pointer-events-auto">
          <Card className="cyber-border p-4 bg-card/80 backdrop-blur-md">
            <div className="text-sm text-muted-foreground text-right">
              <div>Piltangenter ← →</div>
              <div className="text-neon-purple">för att hoppa åt sidan</div>
            </div>
          </Card>
        </div>
      )}

      {/* Game start/waiting screen */}
      {gameState === 'waiting' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <Card className="cyber-border p-8 bg-card/90 backdrop-blur-md text-center glow-effect">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              HOPP SPEL
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Undvik hinder och överlev så länge du kan!
            </p>
            <Button 
              variant="default" 
              size="lg" 
              onClick={onRestart}
              className="glow-effect bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold"
            >
              STARTA SPEL
            </Button>
          </Card>
        </div>
      )}

      {/* Game over screen */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <Card className="cyber-border p-8 bg-card/90 backdrop-blur-md text-center glow-effect">
            <h2 className="text-3xl font-bold mb-4 text-game-danger">
              GAME OVER
            </h2>
            <div className="mb-6">
              <div className="text-xl font-semibold text-neon-blue mb-2">
                Poäng: {score}
              </div>
              <div className="text-muted-foreground">
                Bästa: {highScore}
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                variant="default" 
                size="lg" 
                onClick={onRestart}
                className="w-full glow-effect bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold"
              >
                FÖRSÖK IGEN
              </Button>
              <div className="text-sm text-muted-foreground">
                Eller klicka/tryck mellanslag
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Mobile controls */}
      {gameState === 'playing' && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 pointer-events-auto px-4">
          <Button
            size="icon"
            variant="default"
            className="w-16 h-16 rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary shadow-glow"
            onTouchStart={(e) => {
              e.preventDefault();
              handleMobileControl('left');
            }}
            onClick={() => handleMobileControl('left')}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          <Button
            size="icon"
            variant="default"
            className="w-16 h-16 rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary shadow-glow"
            onTouchStart={(e) => {
              e.preventDefault();
              handleMobileControl('right');
            }}
            onClick={() => handleMobileControl('right')}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>
      )}
    </div>
  );
};
