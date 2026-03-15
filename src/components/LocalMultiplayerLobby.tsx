import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Coins, ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

const SKINS = [
  { id: 'classic' as const, name: 'BENO', color: '#808080', emoji: '⚪' },
  { id: 'fire' as const, name: 'Fire', color: '#FF4500', emoji: '🔥' },
  { id: 'ice' as const, name: 'Ice', color: '#87CEEB', emoji: '❄️' },
  { id: 'ghost' as const, name: 'Ghost', color: '#F0F8FF', emoji: '👻' },
  { id: 'neon' as const, name: 'Neon', color: '#39FF14', emoji: '💚' },
  { id: 'pixel' as const, name: 'Pixel', color: '#FF69B4', emoji: '🎮' },
  { id: 'rainbow' as const, name: 'Rainbow', color: '#FF1493', emoji: '🌈' },
  { id: 'golden' as const, name: 'Golden', color: '#FFD700', emoji: '👑' },
  { id: 'ninja' as const, name: 'Ninja', color: '#2C2C2C', emoji: '🥷' },
  { id: 'robot' as const, name: 'Robot', color: '#C0C0C0', emoji: '🤖' },
  { id: 'lava' as const, name: 'Lava', color: '#FF3300', emoji: '🌋' },
  { id: 'ocean' as const, name: 'Ocean', color: '#006994', emoji: '🌊' },
  { id: 'electric' as const, name: 'Electric', color: '#FFFF00', emoji: '⚡' },
  { id: 'crystal' as const, name: 'Crystal', color: '#E0E8FF', emoji: '💠' },
  { id: 'shadow' as const, name: 'Shadow', color: '#1a1a2e', emoji: '🖤' },
  { id: 'candy' as const, name: 'Candy', color: '#FF69B4', emoji: '🍬' },
  { id: 'toxic' as const, name: 'Toxic', color: '#7FFF00', emoji: '☢️' },
  { id: 'sunset' as const, name: 'Sunset', color: '#FF6347', emoji: '🌅' },
  { id: 'arctic' as const, name: 'Arctic', color: '#B0E0E6', emoji: '🧊' },
  { id: 'chrome' as const, name: 'Chrome', color: '#C0C0C0', emoji: '🪞' },
  { id: 'cleopatra' as const, name: 'Cleopatra', color: '#D4AF37', emoji: '👸' },
  { id: 'coco' as const, name: 'Chanel', color: '#1a1a1a', emoji: '💎' },
  { id: 'phoenix' as const, name: 'Phoenix', color: '#FF4500', emoji: '🔥' },
  { id: 'galaxy' as const, name: 'Galaxy', color: '#4B0082', emoji: '🌌' },
  { id: 'samurai' as const, name: 'Samurai', color: '#8B0000', emoji: '⚔️' },
  { id: 'dragon' as const, name: 'Dragon', color: '#228B22', emoji: '🐉' },
  { id: 'legend' as const, name: 'Legend ★', color: '#FFD700', emoji: '⭐' },
];

export type SkinId = typeof SKINS[number]['id'];

export interface PlayerConfig {
  name: string;
  skin: SkinId;
}

interface LocalMultiplayerLobbyProps {
  onStartGame: (player1: PlayerConfig, player2: PlayerConfig) => void;
  onBack: () => void;
}

export const LocalMultiplayerLobby = ({ onStartGame, onBack }: LocalMultiplayerLobbyProps) => {
  const { coins, unlockedSkins, unlockSkin, getSkinPrice } = useGameStore();
  
  const [player1Name, setPlayer1Name] = useState('Spelare 1');
  const [player2Name, setPlayer2Name] = useState('Spelare 2');
  const [player1Skin, setPlayer1Skin] = useState<SkinId>('classic');
  const [player2Skin, setPlayer2Skin] = useState<SkinId>('fire');

  const handleSkinSelect = (player: 1 | 2, skinId: SkinId) => {
    if (unlockedSkins.includes(skinId)) {
      if (player === 1) setPlayer1Skin(skinId);
      else setPlayer2Skin(skinId);
    } else {
      const success = unlockSkin(skinId);
      if (success) {
        if (player === 1) setPlayer1Skin(skinId);
        else setPlayer2Skin(skinId);
      } else {
        alert(`Du behöver ${getSkinPrice(skinId)} coins för att köpa denna skin!`);
      }
    }
  };

  const canStart = player1Name.trim() && player2Name.trim();

  const handleStart = () => {
    if (canStart) {
      onStartGame(
        { name: player1Name.trim(), skin: player1Skin },
        { name: player2Name.trim(), skin: player2Skin }
      );
    }
  };

  const SkinSelector = ({ player, selectedSkin, onSelect }: { 
    player: 1 | 2; 
    selectedSkin: SkinId; 
    onSelect: (skinId: SkinId) => void;
  }) => (
    <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 gap-1 sm:gap-2">
      {SKINS.map((skin) => {
        const isUnlocked = unlockedSkins.includes(skin.id);
        const isSelected = selectedSkin === skin.id;
        const price = getSkinPrice(skin.id);

        return (
          <button
            key={skin.id}
            onClick={() => onSelect(skin.id)}
            disabled={!isUnlocked && coins < price}
            className={`
              relative p-1 sm:p-2 rounded-lg border-2 transition-all duration-200
              ${isSelected 
                ? 'border-primary shadow-lg scale-105 ring-2 ring-primary/50' 
                : isUnlocked
                ? 'border-border hover:border-primary/50'
                : 'border-muted opacity-60'
              }
              ${!isUnlocked && coins < price ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{ backgroundColor: `${skin.color}20` }}
          >
            <div className="text-lg sm:text-2xl">{skin.emoji}</div>
            <div className="text-[8px] sm:text-xs font-medium text-foreground truncate">{skin.name}</div>
            
            {!isUnlocked && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[8px] px-1 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                <Coins className="w-2 h-2" />
                {price}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 flex flex-col z-10 overflow-y-auto">
      <div className="flex items-center justify-between p-2 sm:p-4 border-b border-border/50">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Tillbaka</span>
        </Button>
        <h1 className="text-lg sm:text-2xl font-bold text-transparent bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text">
          ⚡ 1v1 Battle ⚡
        </h1>
        <div className="flex items-center gap-1 text-accent">
          <Coins className="w-4 h-4" />
          <span className="font-bold text-sm">{coins}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-4 p-2 sm:p-4 overflow-y-auto">
        <div className="flex-1 bg-primary/5 rounded-lg p-2 sm:p-4 border border-primary/20">
          <div className="text-center mb-2 sm:mb-4">
            <h2 className="text-base sm:text-xl font-bold text-primary">Spelare 1</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Kontroll: A och D</p>
          </div>
          <div className="space-y-2 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground">Namn</label>
              <Input type="text" placeholder="Ange namn..." value={player1Name} onChange={(e) => setPlayer1Name(e.target.value)} maxLength={15} className="text-center text-sm h-8 sm:h-10" />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground mb-1 block">Välj skin</label>
              <SkinSelector player={1} selectedSkin={player1Skin} onSelect={(id) => handleSkinSelect(1, id)} />
            </div>
          </div>
        </div>

        <div className="flex lg:flex-col items-center justify-center py-2 lg:py-0 lg:px-2">
          <div className="text-2xl sm:text-4xl font-bold text-primary/50">VS</div>
        </div>

        <div className="flex-1 bg-accent/5 rounded-lg p-2 sm:p-4 border border-accent/20">
          <div className="text-center mb-2 sm:mb-4">
            <h2 className="text-base sm:text-xl font-bold text-accent">Spelare 2</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Kontroll: ← och →</p>
          </div>
          <div className="space-y-2 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground">Namn</label>
              <Input type="text" placeholder="Ange namn..." value={player2Name} onChange={(e) => setPlayer2Name(e.target.value)} maxLength={15} className="text-center text-sm h-8 sm:h-10" />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground mb-1 block">Välj skin</label>
              <SkinSelector player={2} selectedSkin={player2Skin} onSelect={(id) => handleSkinSelect(2, id)} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 sm:p-4 border-t border-border/50">
        <Button onClick={handleStart} disabled={!canStart} size="lg" className="w-full text-base sm:text-lg py-4 sm:py-6 bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-accent transition-all duration-300 shadow-glow disabled:opacity-50">
          Starta Spelet!
        </Button>
      </div>
    </div>
  );
};

export { SKINS };
