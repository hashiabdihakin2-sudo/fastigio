import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/gameStore';
import { useState, useEffect } from 'react';
import { Smartphone, Coins } from 'lucide-react';

interface HomeScreenProps {
  onStartGame: () => void;
}

// Alla skins sorterade efter pris (billigast först)
const ALL_SKINS = [
  // Gratis & billiga (0-1500)
  { id: 'classic' as const, name: 'BENO', color: '#00BFFF', emoji: '⚪', price: 0 },
  { id: 'fire' as const, name: 'Fire', color: '#FF4500', emoji: '🔥', price: 800 },
  { id: 'ice' as const, name: 'Ice', color: '#87CEEB', emoji: '❄️', price: 800 },
  { id: 'zombie' as const, name: 'Zombie', color: '#556B2F', emoji: '🧟', price: 800 },
  { id: 'ghost' as const, name: 'Ghost', color: '#F0F8FF', emoji: '👻', price: 1000 },
  { id: 'christmas' as const, name: 'Jul', color: '#C41E3A', emoji: '🎄', price: 1200 },
  { id: 'easter' as const, name: 'Påsk', color: '#FF69B4', emoji: '🌸', price: 1200 },
  { id: 'rainbow' as const, name: 'Rainbow', color: '#FF1493', emoji: '🌈', price: 1500 },
  { id: 'gingerbread' as const, name: 'Peppar', color: '#8B4513', emoji: '🍪', price: 1500 },
  { id: 'egg' as const, name: 'Påskägg', color: '#FFEB3B', emoji: '🥚', price: 1500 },
  
  // Medium (1800-3500)
  { id: 'tennis' as const, name: 'Tennis', color: '#FFFF00', emoji: '🎾', price: 1800 },
  { id: 'pumpkin' as const, name: 'Pumpa', color: '#FF6600', emoji: '🎃', price: 1800 },
  { id: 'football' as const, name: 'Fotboll', color: '#8B4513', emoji: '🏈', price: 2000 },
  { id: 'snowman' as const, name: 'Snögubbe', color: '#FFFFFF', emoji: '⛄', price: 2000 },
  { id: 'baseball' as const, name: 'Baseball', color: '#FFFFFF', emoji: '⚾', price: 2100 },
  { id: 'basketball' as const, name: 'Basket', color: '#FF8C00', emoji: '🏀', price: 2200 },
  { id: 'golf' as const, name: 'Golf', color: '#228B22', emoji: '⛳', price: 2300 },
  { id: 'hockey' as const, name: 'Hockey', color: '#1E90FF', emoji: '🏒', price: 2400 },
  { id: 'golden' as const, name: 'Golden', color: '#FFD700', emoji: '👑', price: 2500 },
  { id: 'soccer' as const, name: 'Soccer', color: '#FFFFFF', emoji: '⚽', price: 2500 },
  { id: 'bunny' as const, name: 'Påskhare', color: '#FFB6C1', emoji: '🐰', price: 2500 },
  { id: 'ninja' as const, name: 'Ninja', color: '#2C2C2C', emoji: '🥷', price: 3500 },
  { id: 'santa' as const, name: 'Tomte', color: '#DC143C', emoji: '🎅', price: 3500 },
  
  // Dyra (4500-12000)
  { id: 'robot' as const, name: 'Robot', color: '#C0C0C0', emoji: '🤖', price: 4500 },
  { id: 'pirate' as const, name: 'Pirate', color: '#8B4513', emoji: '🏴‍☠️', price: 5500 },
  { id: 'mummy' as const, name: 'Mummy', color: '#DEB887', emoji: '🏺', price: 6000 },
  { id: 'wizard' as const, name: 'Wizard', color: '#4B0082', emoji: '🧙', price: 6500 },
  { id: 'samurai' as const, name: 'Samurai', color: '#8B0000', emoji: '🗾', price: 7000 },
  { id: 'dragon' as const, name: 'Dragon', color: '#DC143C', emoji: '🐉', price: 8000 },
  { id: 'alien' as const, name: 'Alien', color: '#7FFF00', emoji: '👽', price: 9000 },
  { id: 'cyber' as const, name: 'Cyber', color: '#00FFFF', emoji: '🤖', price: 9500 },
  { id: 'superhero' as const, name: 'Hero', color: '#1E90FF', emoji: '🦸', price: 10000 },
  { id: 'vampire' as const, name: 'Vampire', color: '#8B0000', emoji: '🧛', price: 11000 },
  { id: 'knight' as const, name: 'Knight', color: '#708090', emoji: '⚔️', price: 12000 },
  { id: 'phoenix' as const, name: 'Phoenix', color: '#FF8C00', emoji: '🔥', price: 15000 },
  
  // Premium Nyår 2026 (25000+)
  { id: 'newyear2026' as const, name: '2026', color: '#FFD700', emoji: '🎆', price: 25000 },
  { id: 'confetti' as const, name: 'Konfetti', color: '#FF69B4', emoji: '🎊', price: 28000 },
  { id: 'firework' as const, name: 'Fyrverkeri', color: '#FF1493', emoji: '🎇', price: 30000 },
  { id: 'champagne' as const, name: 'Champagne', color: '#F7E7CE', emoji: '🍾', price: 35000 },
  { id: 'aurora' as const, name: 'Aurora', color: '#00FF7F', emoji: '🌈', price: 40000 },
  { id: 'midnight' as const, name: 'Midnatt', color: '#191970', emoji: '🌙', price: 45000 },
  { id: 'diamond' as const, name: 'Diamant', color: '#B9F2FF', emoji: '💎', price: 50000 },
  { id: 'galaxy' as const, name: 'Galax', color: '#9400D3', emoji: '🌌', price: 75000 },
];

export const HomeScreen = ({ onStartGame }: HomeScreenProps) => {
  const { selectedSkin, setSelectedSkin, coins, unlockedSkins, unlockSkin, playerName, setPlayerName, getSkinPrice } = useGameStore();
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


  const handleSkinSelect = (skinId: string) => {
    if (unlockedSkins.includes(skinId as any)) {
      setSelectedSkin(skinId as any);
    } else {
      const success = unlockSkin(skinId as any);
      if (!success) {
        alert(`Du behöver ${getSkinPrice(skinId as any)} coins för att köpa denna skin!`);
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
      <div className="text-center space-y-6 p-6 max-w-4xl w-full my-8">
        {/* Logo */}
        <div className="space-y-3">
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

        {/* Skin Selection - Sorterat efter pris */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Välj ditt utseende</h2>
          
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
            {ALL_SKINS.map((skin) => {
              const isUnlocked = unlockedSkins.includes(skin.id);
              const isSelected = selectedSkin === skin.id;
              const price = skin.price;

              return (
                <button
                  key={skin.id}
                  onClick={() => handleSkinSelect(skin.id)}
                  disabled={!isUnlocked && coins < price}
                  className={`
                    relative p-2 sm:p-3 rounded-lg border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-primary shadow-lg scale-105 ring-2 ring-primary/50' 
                      : isUnlocked
                      ? 'border-border hover:border-primary/50 hover:scale-102'
                      : 'border-muted opacity-60 hover:opacity-80'
                    }
                    ${!isUnlocked && coins < price ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  style={{ backgroundColor: `${skin.color}15` }}
                >
                  <div className="text-2xl sm:text-3xl mb-0.5">{skin.emoji}</div>
                  <div className="text-[10px] sm:text-xs font-medium text-foreground truncate">{skin.name}</div>
                  
                  {!isUnlocked && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[9px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                      <Coins className="w-2.5 h-2.5" />
                      {price >= 1000 ? `${(price/1000).toFixed(0)}k` : price}
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-[10px]">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Player Name Input */}
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

        {/* Start Buttons */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
          <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
            <p>Singel: Piltangenterna ← → | 1v1: Spelare 1: A/D, Spelare 2: ← →</p>
          </div>
        </div>
      </div>
    </div>
  );
};
