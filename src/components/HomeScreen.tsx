import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/gameStore';
import { useState, useEffect } from 'react';
import { Smartphone, Coins } from 'lucide-react';

interface HomeScreenProps {
  onStartGame: () => void;
}

const SKINS = [
  { id: 'classic' as const, name: 'BENO', color: '#00BFFF', emoji: '⚪' },
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
  { id: 'zombie' as const, name: 'Zombie', color: '#556B2F', emoji: '🧟' },
  { id: 'ghost' as const, name: 'Ghost', color: '#F0F8FF', emoji: '👻' },
  { id: 'samurai' as const, name: 'Samurai', color: '#8B0000', emoji: '🗾' },
  { id: 'mummy' as const, name: 'Mummy', color: '#DEB887', emoji: '🏺' },
  { id: 'cyber' as const, name: 'Cyber', color: '#00FFFF', emoji: '🤖' },
  { id: 'phoenix' as const, name: 'Phoenix', color: '#FF8C00', emoji: '🔥' },
  { id: 'christmas' as const, name: 'Jul', color: '#C41E3A', emoji: '🎄' },
  { id: 'santa' as const, name: 'Tomte', color: '#DC143C', emoji: '🎅' },
  { id: 'snowman' as const, name: 'Snögubbe', color: '#FFFFFF', emoji: '⛄' },
  { id: 'gingerbread' as const, name: 'Peppar', color: '#8B4513', emoji: '🍪' },
  { id: 'easter' as const, name: 'Påsk', color: '#FF69B4', emoji: '🌸' },
  { id: 'bunny' as const, name: 'Påskhare', color: '#FFB6C1', emoji: '🐰' },
  { id: 'egg' as const, name: 'Påskägg', color: '#FFEB3B', emoji: '🥚' },
  { id: 'football' as const, name: 'Fotboll', color: '#8B4513', emoji: '🏈' },
  { id: 'soccer' as const, name: 'Soccer', color: '#FFFFFF', emoji: '⚽' },
  { id: 'basketball' as const, name: 'Basket', color: '#FF8C00', emoji: '🏀' },
  { id: 'tennis' as const, name: 'Tennis', color: '#FFFF00', emoji: '🎾' },
  { id: 'baseball' as const, name: 'Baseball', color: '#FFFFFF', emoji: '⚾' },
  // New Year 2026 Premium Skins
  { id: 'newyear2026' as const, name: '2026', color: '#FFD700', emoji: '🎆' },
  { id: 'firework' as const, name: 'Fyrverkeri', color: '#FF1493', emoji: '🎇' },
  { id: 'champagne' as const, name: 'Champagne', color: '#F7E7CE', emoji: '🍾' },
  { id: 'diamond' as const, name: 'Diamant', color: '#B9F2FF', emoji: '💎' },
  { id: 'galaxy' as const, name: 'Galax', color: '#9400D3', emoji: '🌌' },
];

export const HomeScreen = ({ onStartGame }: HomeScreenProps) => {
  const { selectedSkin, setSelectedSkin, coins, unlockedSkins, unlockSkin, getSkinPrice, playerName, setPlayerName } = useGameStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [tempName, setTempName] = useState(playerName);

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

  const handleStartGame = () => {
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
    }
    onStartGame();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center z-10 overflow-y-auto">
      <div className="text-center space-y-8 p-8 max-w-2xl w-full">
        {/* Logo */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text">
            🎆 Nyår 2026 🎆
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Rulla in i det nya året - undvik hinder och samla poäng!
          </p>
          <div className="flex items-center justify-center gap-2 text-accent">
            <Coins className="w-5 h-5" />
            <span className="font-bold text-xl">{coins} coins</span>
          </div>
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
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3 max-w-4xl mx-auto">

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
                    relative p-4 rounded-lg border-2 transition-all duration-200
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
                  <div className="text-3xl mb-1">{skin.emoji}</div>
                  <div className="text-xs font-medium text-foreground">{skin.name}</div>
                  
                  {!isUnlocked && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {price}
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleStartGame}
              disabled={!tempName.trim()}
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Singel spelare
            </Button>
            <Button 
              onClick={() => window.location.href = '/?mode=local1v1'}
              disabled={!tempName.trim()}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              1v1 Lokal (Split-Screen)
            </Button>
          </div>
          {!tempName.trim() && (
            <p className="text-sm text-muted-foreground">Ange ditt namn för att börja spela</p>
          )}
          
          {/* Controls */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Singel: Använd piltangenterna ← → för att hoppa åt sidan</p>
            <p>1v1: Spelare 1 använder A och D, Spelare 2 använder ← →</p>
            <p>Bollen rullar framåt automatiskt!</p>
          </div>
        </div>

        {/* Player Name Input - Moved to bottom */}
        <div className="space-y-2 max-w-md mx-auto">
          <label className="text-sm font-medium text-foreground">Ditt namn (för topplistan)</label>
          <Input
            type="text"
            placeholder="Ange ditt namn..."
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            maxLength={20}
            className="text-center"
          />
        </div>
      </div>
    </div>
  );
};
