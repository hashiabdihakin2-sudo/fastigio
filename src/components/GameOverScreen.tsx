import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useGameStore } from '../store/gameStore';
import { Trophy, Coins, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GameOverScreenProps {
  onRestart: () => void;
  onBackToHome: () => void;
}

const SKINS = [
  { id: 'classic' as const, name: 'BENO', color: '#808080', emoji: '⚪' },
  { id: 'fire' as const, name: 'Fire', color: '#FF4500', emoji: '🔥' },
  { id: 'ice' as const, name: 'Ice', color: '#87CEEB', emoji: '❄️' },
  { id: 'ghost' as const, name: 'Ghost', color: '#F0F8FF', emoji: '👻' },
  { id: 'rainbow' as const, name: 'Rainbow', color: '#FF1493', emoji: '🌈' },
  { id: 'golden' as const, name: 'Golden', color: '#FFD700', emoji: '👑' },
  { id: 'ninja' as const, name: 'Ninja', color: '#2C2C2C', emoji: '🥷' },
  { id: 'robot' as const, name: 'Robot', color: '#C0C0C0', emoji: '🤖' },
  { id: 'cleopatra' as const, name: 'Cleopatra', color: '#D4AF37', emoji: '👸' },
  { id: 'frida' as const, name: 'Frida Kahlo', color: '#CC3333', emoji: '🎨' },
  { id: 'amelia' as const, name: 'A. Earhart', color: '#8B6914', emoji: '✈️' },
  { id: 'curie' as const, name: 'Marie Curie', color: '#4A90D9', emoji: '⚗️' },
  { id: 'florence' as const, name: 'Nightingale', color: '#F5F5F5', emoji: '🏥' },
  { id: 'rosa_w' as const, name: 'Rosa Parks', color: '#C4A35A', emoji: '🚌' },
  { id: 'harriet_w' as const, name: 'H. Tubman', color: '#8B6914', emoji: '🌟' },
  { id: 'coco' as const, name: 'Coco Chanel', color: '#1a1a1a', emoji: '💎' },
  { id: 'malala' as const, name: 'Malala', color: '#E91E63', emoji: '📚' },
  { id: 'joan' as const, name: 'Joan of Arc', color: '#C0C0C0', emoji: '⚔️' },
  { id: 'queen' as const, name: 'Queen', color: '#4169E1', emoji: '👑' },
  { id: 'wonder' as const, name: 'Wonder W.', color: '#CC0000', emoji: '⭐' },
  { id: 'serena' as const, name: 'Serena', color: '#FF69B4', emoji: '🎾' },
  { id: 'legend_woman' as const, name: 'Legend ★', color: '#FFD700', emoji: '💜' },
];

export const GameOverScreen = ({ onRestart, onBackToHome }: GameOverScreenProps) => {
  const { score, highScore, highScores, coins, selectedSkin, setSelectedSkin, unlockedSkins, unlockSkin, getSkinPrice, playerName, setPlayerName } = useGameStore();
  const [tempName, setTempName] = useState(playerName);
  const [globalHighScores, setGlobalHighScores] = useState<Array<{
    id: string;
    player_name: string;
    score: number;
    skin: string;
    created_at: string;
  }>>([]);

  // Helper function to get ISO week number
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // Fetch global high scores for current week
  useEffect(() => {
    const fetchGlobalHighScores = async () => {
      const now = new Date();
      const currentWeek = `${now.getFullYear()}-${String(getWeekNumber(now)).padStart(2, '0')}`;
      
      const { data, error } = await supabase
        .from('global_highscores')
        .select('*')
        .eq('week_year', currentWeek)
        .order('score', { ascending: false })
        .limit(10);

      if (data && !error) {
        setGlobalHighScores(data);
      }
    };

    fetchGlobalHighScores();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('global-highscores-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'global_highscores'
        },
        () => {
          fetchGlobalHighScores();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Save score to global high scores when component mounts
  useEffect(() => {
    const saveGlobalScore = async () => {
      if (score > 0 && playerName) {
        const now = new Date();
        const currentWeek = `${now.getFullYear()}-${String(getWeekNumber(now)).padStart(2, '0')}`;
        
        await supabase
          .from('global_highscores')
          .insert({
            player_name: playerName,
            score: score,
            skin: selectedSkin,
            week_year: currentWeek
          });
      }
    };

    saveGlobalScore();
  }, []);

  const handleSkinSelect = (skinId: typeof SKINS[number]['id']) => {
    if (unlockedSkins.includes(skinId)) {
      setSelectedSkin(skinId);
    } else {
      const price = getSkinPrice(skinId);
      const success = unlockSkin(skinId);
      if (!success) {
        alert(`Du behöver ${price} coins för att köpa denna skin!`);
      }
    }
  };

  const earnedCoins = Math.floor(score / 10);

  const handleRestart = () => {
    if (tempName.trim() && tempName !== playerName) {
      setPlayerName(tempName.trim());
    }
    window.location.reload();
  };

  const handleBackToHome = () => {
    if (tempName.trim() && tempName !== playerName) {
      setPlayerName(tempName.trim());
    }
    onBackToHome();
  };

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

        {/* Player Name Input */}
        <Card className="p-4 bg-card/80 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Ditt namn</h3>
          </div>
          <div className="max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Ange ditt namn..."
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              maxLength={20}
              className="text-center"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {tempName.trim() ? `Spelar som: ${tempName.trim()}` : 'Ange ett namn för topplistan'}
            </p>
          </div>
        </Card>

        {/* Global Högpoänglista */}
        <Card className="p-6 bg-card/80 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Trophy className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Global Top 10</h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {globalHighScores.length === 0 ? (
              <p className="text-muted-foreground text-sm">Inga resultat än!</p>
            ) : (
              globalHighScores.map((hs, index) => (
                <div 
                  key={hs.id}
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
                      <div className="font-semibold text-foreground">{hs.player_name}</div>
                      <div className="text-sm text-foreground/80">{hs.score} poäng</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(hs.created_at).toLocaleDateString('sv-SE')}
                      </div>
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
            <h3 className="text-lg font-bold text-foreground">Välj eller köp ny skin (Coins)</h3>
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
                  disabled={!isUnlocked && (typeof price === 'number' && coins < price)}
                  className={`
                    relative p-3 rounded-lg border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-primary shadow-lg scale-110 ring-2 ring-primary/50' 
                      : isUnlocked
                      ? 'border-border hover:border-primary/50 hover:scale-105'
                      : 'border-muted opacity-60 hover:opacity-80'
                    }
                    ${!isUnlocked && (typeof price === 'number' && coins < price) ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  style={{ backgroundColor: `${skin.color}20` }}
                >
                  <div className="text-2xl mb-1">{skin.emoji}</div>
                  <div className="text-xs font-medium text-foreground">{skin.name}</div>
                  
                  {!isUnlocked && typeof price === 'number' && (
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
            onClick={handleRestart}
            disabled={!tempName.trim()}
            size="lg"
            className="w-full text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Spela igen
          </Button>
          <Button 
            onClick={handleBackToHome}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Tillbaka till start
          </Button>
          {!tempName.trim() && (
            <p className="text-sm text-muted-foreground">Ange ditt namn för att fortsätta</p>
          )}
        </div>
      </div>
    </div>
  );
};
