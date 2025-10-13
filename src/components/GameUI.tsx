import { Button } from './ui/button';
import { Card } from './ui/card';

interface GameUIProps {
  currentSection: number;
  gameState: 'waiting' | 'playing' | 'gameOver' | 'levelComplete';
  onRestart: () => void;
}

export const GameUI = ({ currentSection, gameState, onRestart }: GameUIProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Section progress */}
      <div className="absolute top-8 left-8 pointer-events-auto">
        <Card className="cyber-border p-4 bg-card/80 backdrop-blur-md">
          <div className="text-lg font-bold text-neon-blue">
            Sektion: {currentSection + 1} / 9
          </div>
        </Card>
      </div>

      {/* Controls hint */}
      {gameState === 'playing' && (
        <div className="absolute top-8 right-8 pointer-events-auto">
          <Card className="cyber-border p-4 bg-card/80 backdrop-blur-md">
            <div className="text-sm text-muted-foreground text-right">
              <div>Klicka eller tryck mellanslag</div>
              <div className="text-neon-purple">för att hoppa framåt</div>
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
              Hoppa genom 9 sektioner för att vinna!
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

      {/* Level complete screen */}
      {gameState === 'levelComplete' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <Card className="cyber-border p-8 bg-card/90 backdrop-blur-md text-center glow-effect">
            <h2 className="text-3xl font-bold mb-4 text-game-success">
              🎉 DU VANN! 🎉
            </h2>
            <div className="mb-6">
              <div className="text-xl font-semibold text-neon-blue mb-2">
                Level Complete!
              </div>
              <div className="text-muted-foreground">
                Du hoppade genom alla 9 sektioner!
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                variant="default" 
                size="lg" 
                onClick={onRestart}
                className="w-full glow-effect bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold"
              >
                SPELA IGEN
              </Button>
              <div className="text-sm text-muted-foreground">
                Eller klicka/tryck mellanslag
              </div>
            </div>
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
                Du nådde sektion: {currentSection + 1}
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
    </div>
  );
};
