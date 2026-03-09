import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/gameStore';
import { useState, useEffect } from 'react';
import { Smartphone, Coins } from 'lucide-react';

interface HomeScreenProps {
  onStartGame: () => void;
}

const ALL_SKINS = [
  // Standard skins
  { id: 'classic' as const, name: 'BENO', color: '#808080', emoji: '⚪', price: 0 },
  { id: 'fire' as const, name: 'Fire', color: '#FF4500', emoji: '🔥', price: 800 },
  { id: 'ice' as const, name: 'Ice', color: '#87CEEB', emoji: '❄️', price: 800 },
  { id: 'ghost' as const, name: 'Ghost', color: '#F0F8FF', emoji: '👻', price: 1000 },
  { id: 'rainbow' as const, name: 'Rainbow', color: '#FF1493', emoji: '🌈', price: 1500 },
  { id: 'golden' as const, name: 'Golden', color: '#FFD700', emoji: '👑', price: 2500 },
  { id: 'ninja' as const, name: 'Ninja', color: '#2C2C2C', emoji: '🥷', price: 3500 },
  { id: 'robot' as const, name: 'Robot', color: '#C0C0C0', emoji: '🤖', price: 4500 },

  // 💜 Iconic Women 💜
  { id: 'cleopatra' as const, name: 'Cleopatra', color: '#D4AF37', emoji: '👸', price: 2000, desc: 'Queen of Egypt' },
  { id: 'frida' as const, name: 'Frida Kahlo', color: '#CC3333', emoji: '🎨', price: 3000, desc: 'Viva la Vida' },
  { id: 'amelia' as const, name: 'A. Earhart', color: '#8B6914', emoji: '✈️', price: 4000, desc: 'Pioneer Aviator' },
  { id: 'curie' as const, name: 'Marie Curie', color: '#4A90D9', emoji: '⚗️', price: 5000, desc: 'Nobel Laureate' },
  { id: 'florence' as const, name: 'F. Nightingale', color: '#F5F5F5', emoji: '🏥', price: 5500, desc: 'Lady with the Lamp' },
  { id: 'rosa_w' as const, name: 'Rosa Parks', color: '#C4A35A', emoji: '🚌', price: 6000, desc: 'Civil Rights Icon' },
  { id: 'harriet_w' as const, name: 'H. Tubman', color: '#8B6914', emoji: '🌟', price: 7000, desc: 'Freedom Fighter' },
  { id: 'coco' as const, name: 'Coco Chanel', color: '#1a1a1a', emoji: '💎', price: 8000, desc: 'Fashion Pioneer' },
  { id: 'malala' as const, name: 'Malala', color: '#E91E63', emoji: '📚', price: 9000, desc: 'Education Activist' },
  { id: 'joan' as const, name: 'Joan of Arc', color: '#C0C0C0', emoji: '⚔️', price: 10000, desc: 'Warrior Saint' },
  { id: 'queen' as const, name: 'Queen Elizabeth', color: '#4169E1', emoji: '👑', price: 12000, desc: 'The Queen' },
  { id: 'wonder' as const, name: 'Wonder Woman', color: '#CC0000', emoji: '⭐', price: 15000, desc: 'Amazonian Hero' },
  { id: 'serena' as const, name: 'Serena Williams', color: '#FF69B4', emoji: '🎾', price: 18000, desc: 'Tennis GOAT' },
  { id: 'legend_woman' as const, name: 'Legend ★', color: '#FFD700', emoji: '💜', price: 25000, desc: 'Legendary Edition' },
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

  const standardSkins = ALL_SKINS.filter(s => !('desc' in s));
  const womenSkins = ALL_SKINS.filter(s => 'desc' in s);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center z-10 overflow-y-auto">
      <div className="text-center space-y-6 p-6 max-w-4xl w-full my-8">
        {/* Logo */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text">
            💜 Women's Day 💜
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground italic">
            Celebrating women who changed the world
          </p>
          <div className="flex items-center justify-center gap-2 text-accent">
            <Coins className="w-5 h-5" />
            <span className="font-bold text-xl">{coins} coins</span>
          </div>
        </div>

        {isMobile && !isLandscape && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-primary rotate-90" />
            <p className="text-sm text-foreground">
              Vrid din telefon till liggande läge för bästa spelupplevelse!
            </p>
          </div>
        )}

        {/* Standard Skins */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Standard</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {standardSkins.map((skin) => {
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

        {/* Iconic Women */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">💜 Iconic Women</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 max-h-[300px] overflow-y-auto pr-2">
            {womenSkins.map((skin) => {
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
                  {'desc' in skin && (
                    <div className="text-[8px] text-muted-foreground truncate">{(skin as any).desc}</div>
                  )}
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
          <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
            <p>Singel: Piltangenterna ← → | 1v1: Spelare 1: A/D, Spelare 2: ← →</p>
          </div>
        </div>
      </div>
    </div>
  );
};