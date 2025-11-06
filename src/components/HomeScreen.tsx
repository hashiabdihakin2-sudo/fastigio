import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

interface HomeScreenProps {
  onStartGame: () => void;
}

const SKINS = [
  { id: 'classic' as const, name: 'Klassisk', color: '#00BFFF', emoji: '⚡' },
  { id: 'fire' as const, name: 'Eld', color: '#FF4500', emoji: '🔥' },
  { id: 'ice' as const, name: 'Is', color: '#87CEEB', emoji: '❄️' },
  { id: 'rainbow' as const, name: 'Regnbåge', color: '#FF1493', emoji: '🌈' },
  { id: 'golden' as const, name: 'Guld', color: '#FFD700', emoji: '⭐' },
];

export const HomeScreen = ({ onStartGame }: HomeScreenProps) => {
  const { selectedSkin, setSelectedSkin } = useGameStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center z-10 overflow-y-auto">
      <div className="text-center space-y-8 p-8 max-w-2xl w-full">
        {/* Logo */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text">
            Hopp Spel
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Undvik hinder och samla poäng!
          </p>
        </div>

        {/* Mobile Orientation Warning */}
        {isMobile && !isLandscape && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-primary rotate-90" />
            <p className="text-sm text-foreground">
              Vrid din telefon till liggande läge för bästa spelupplevelse!
            </p>
          </div>
        )}

        {/* Skin Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Välj ditt utseende</h2>
          <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
            {SKINS.map((skin) => (
              <button
                key={skin.id}
                onClick={() => setSelectedSkin(skin.id)}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-200
                  ${selectedSkin === skin.id 
                    ? 'border-primary shadow-lg scale-110' 
                    : 'border-border hover:border-primary/50 hover:scale-105'
                  }
                `}
                style={{ backgroundColor: `${skin.color}20` }}
              >
                <div className="text-3xl mb-1">{skin.emoji}</div>
                <div className="text-xs font-medium text-foreground">{skin.name}</div>
                {selectedSkin === skin.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
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