import { Button } from '@/components/ui/button';

interface HomeScreenProps {
  onStartGame: () => void;
  highScore: number;
}

export const HomeScreen = ({ onStartGame, highScore }: HomeScreenProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center z-10">
      <div className="text-center space-y-8 p-8">
        {/* Logo */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text">
            fastig.io
          </h1>
          <p className="text-xl text-muted-foreground">
            Roll fast, survive longer
          </p>
        </div>

        {/* High Score */}
        {highScore > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Best Score</p>
            <p className="text-3xl font-bold text-primary">{Math.floor(highScore)}</p>
          </div>
        )}

        {/* Start Button */}
        <div className="space-y-4">
          <Button 
            onClick={onStartGame}
            size="lg"
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-glow"
          >
            Start Game
          </Button>
          
          {/* Controls */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Use arrow keys or A/D to steer</p>
            <p>Avoid red obstacles and stay on track</p>
          </div>
        </div>
      </div>
    </div>
  );
};