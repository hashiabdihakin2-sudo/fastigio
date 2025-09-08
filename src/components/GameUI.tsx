import { Button } from './ui/button';
import { Card } from './ui/card';

interface GameUIProps {
  score: number;
  highScore: number;
  gameState: 'waiting' | 'playing' | 'gameOver';
  onRestart: () => void;
}

export const GameUI = ({ score, highScore, gameState, onRestart }: GameUIProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Score display */}
      <div className="absolute top-8 left-8 pointer-events-auto">
        <Card className="cyber-border p-4 bg-card/80 backdrop-blur-md">
          <div className="text-lg font-bold text-neon-blue">
            Score: {Math.floor(score)}
          </div>
          <div className="text-sm text-muted-foreground">
            Best: {Math.floor(highScore)}
          </div>
        </Card>
      </div>

      {/* Controls hint */}
      {gameState === 'waiting' && (
        <div className="absolute top-8 right-8 pointer-events-auto">
          <Card className="cyber-border p-4 bg-card/80 backdrop-blur-md">
            <div className="text-sm text-muted-foreground text-right">
              <div>Use ← → or A D to steer</div>
              <div className="text-neon-purple">Press SPACE to start</div>
            </div>
          </Card>
        </div>
      )}

      {/* Game start/waiting screen */}
      {gameState === 'waiting' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <Card className="cyber-border p-8 bg-card/90 backdrop-blur-md text-center glow-effect">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              SLOPE RUSH
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Roll down the endless slope and avoid the red obstacles!
            </p>
            <Button 
              variant="default" 
              size="lg" 
              onClick={onRestart}
              className="glow-effect bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold"
            >
              START GAME
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
                Score: {Math.floor(score)}
              </div>
              {score > highScore && (
                <div className="text-game-success font-bold">NEW HIGH SCORE!</div>
              )}
              <div className="text-muted-foreground">
                Best: {Math.floor(highScore)}
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                variant="default" 
                size="lg" 
                onClick={onRestart}
                className="w-full glow-effect bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold"
              >
                PLAY AGAIN
              </Button>
              <div className="text-sm text-muted-foreground">
                Or press SPACE
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};