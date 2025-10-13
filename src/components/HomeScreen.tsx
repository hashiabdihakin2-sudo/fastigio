import { Button } from '@/components/ui/button';

interface HomeScreenProps {
  onStartGame: () => void;
}

export const HomeScreen = ({ onStartGame }: HomeScreenProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center z-10">
      <div className="text-center space-y-8 p-8">
        {/* Logo */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text">
            Hopp Spel
          </h1>
          <p className="text-xl text-muted-foreground">
            Undvik hinder och samla poäng!
          </p>
        </div>

        {/* Start Button */}
        <div className="space-y-4">
          <Button 
            onClick={onStartGame}
            size="lg"
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-glow"
          >
            Starta Spel
          </Button>
          
          {/* Controls */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Använd piltangenterna ← → för att hoppa åt sidan</p>
            <p>Bollen rullar framåt automatiskt!</p>
          </div>
        </div>
      </div>
    </div>
  );
};