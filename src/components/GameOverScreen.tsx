import { Button } from './ui/button';
import { Card } from './ui/card';
import { useGameStore } from '../store/gameStore';
import { Trophy, Coins } from 'lucide-react';

interface GameOverScreenProps {
  onRestart: () => void;
  onBackToHome: () => void;
}

const SKINS = [
  { id: 'classic' as const, name: 'Classic', color: '#00BFFF', emoji: '⚪' },
  { id: 'fire' as const, name: 'Fire', color: '#FF4500', emoji: '🔥' },
  { id: 'ice' as const, name: 'Ice', color: '#87CEEB', emoji: '❄️' },
  { id: 'rainbow' as const, name: 'Rainbow', color: '#FF1493', emoji: '🌈' },
  { id: 'golden' as const, name: 'Golden', color: '#FFD700', emoji: '👑' },
  { id: 'ninja' as const, name: 'Ninja', color: '#2C2C2C', emoji: '🥷' },
  { id: 'robot' as const, name: 'Robot', color: '#C0C0C0', emoji: '🤖' },
  { id: 'pirate' as const, name: 'Pirate', color: '#8B4513', emoji: '🏴‍☠️' },
  { id: 'wizard' as const, name: 'Wizard', color: '#4B0082', emoji: '🧙' },
  { id: 'dragon' as const, name: 'Dragon', color: '#DC143C', emoji: '🐉' },
  { id: 'alien' as const, name: 'Alien', color: '#7FFF00', emoji: '👽' },
  { id: 'superhero' as const, name: 'Hero', color: '#1E90FF', emoji: '🦸' },
  { id: 'vampire' as const, name: 'Vampire', color: '#8B0000', emoji: '🧛' },
  { id: 'knight' as const, name: 'Knight', color: '#708090', emoji: '⚔️' },
];

export const GameOverScreen = ({ onRestart, onBackToHome }: GameOverScreenProps) => {
  const { score, highScore, highScores, coins, selectedSkin, setSelectedSkin, unlockedSkins, unlockSkin, getSkinPrice } = useGameStore();

  const handleSkinSelect = (skinId: typeof SKINS[number]['id']) => {
    if (unlockedSkins.includes(skinId)) {
      setSelectedSkin(skinId);
    } else {
      const success = unlockSkin(skinId);
      if (!success) {
        alert(`Du behöver ${getSkinPrice(skinId)} coins för att köpa denna skin!`);
      }
    }
  };

  const earnedCoins = Math.floor(score / 10);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center z-10 overflow-y-auto">
      <div className="text-center space-y-6 p-4 md:p-8 max-w-4xl w-full">
        
        {/* Game Over Header */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-destructive via-primary to-accent bg-clip-text">
            Game Over!
          </h2>
          <div className="flex justify-center gap-8">
            <Card className="p-4 bg-card/80 backdrop-blur-md">
              <div className="text-3xl font-bold text-primary">{score}</div>
              <div className="text-sm text-muted-foreground">Poäng</div>
            </Card>
            <Card className="p-4 bg-card/80 backdrop-blur-md">
              <div className="text-3xl font-bold text-accent flex items-center gap-2">
                <Coins className="w-6 h-6" />
                {coins}
              </div>
              <div className="text-sm text-muted-foreground">+{earnedCoins} coins</div>
            </Card>
          </div>
        </div>

        {/* Högpoänglista */}
        <Card className="p-6 bg-card/80 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Trophy className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Top 10 Högpoäng</h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {highScores.length === 0 ? (
              <p className="text-muted-foreground text-sm">Inga resultat än!</p>
            ) : (
              highScores.map((hs, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index === 0 ? 'bg-primary/20 border border-primary/40' :
                    index === 1 ? 'bg-accent/10 border border-accent/20' :
                    index === 2 ? 'bg-secondary/10 border border-secondary/20' :
                    'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-foreground w-6">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <span className="text-2xl">
                      {SKINS.find(s => s.id === hs.skin)?.emoji || '⚡'}
                    </span>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{hs.playerName}</div>
                      <div className="text-sm text-foreground/80">{hs.score} poäng</div>
                      <div className="text-xs text-muted-foreground">{hs.date}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Skin Selection / Shop */}
        <Card className="p-6 bg-card/80 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Coins className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-foreground">Välj eller köp ny skin</h3>
          </div>
          <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto mb-4">
            {SKINS.map((skin) => {
              const isUnlocked = unlockedSkins.includes(skin.id);
              const isSelected = selectedSkin === skin.id;
              const price = getSkinPrice(skin.id);

              return (
                <button
                  key={skin.id}
                  onClick={() => handleSkinSelect(skin.id)}
                  disabled={!isUnlocked && coins < price}
                  className={`
                    relative p-3 rounded-lg border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-primary shadow-lg scale-110 ring-2 ring-primary/50' 
                      : isUnlocked
                      ? 'border-border hover:border-primary/50 hover:scale-105'
                      : 'border-muted opacity-60 hover:opacity-80'
                    }
                    ${!isUnlocked && coins < price ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  style={{ backgroundColor: `${skin.color}20` }}
                >
                  <div className="text-2xl mb-1">{skin.emoji}</div>
                  <div className="text-xs font-medium text-foreground">{skin.name}</div>
                  
                  {!isUnlocked && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {price}
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-glow">
                      <span className="text-xs text-primary-foreground font-bold">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Du har {coins} coins. Spela mer för att tjäna fler!
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 max-w-md mx-auto">
          <Button 
            onClick={onRestart}
            size="lg"
            className="w-full text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-glow"
          >
            Spela igen
          </Button>
          <Button 
            onClick={onBackToHome}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Tillbaka till start
          </Button>
        </div>
      </div>
    </div>
  );
};
