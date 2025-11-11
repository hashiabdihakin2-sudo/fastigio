import { Card } from './ui/card';
import { Button } from './ui/button';
import { useGameStore } from '../store/gameStore';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PREMIUM_SKINS = [
  { 
    id: 'diamond' as const, 
    name: 'Diamond', 
    emoji: '💎', 
    price: '5 kr',
    description: 'Glittrande diamant med kristaller'
  },
  { 
    id: 'cosmic' as const, 
    name: 'Cosmic', 
    emoji: '🌌', 
    price: '7 kr',
    description: 'Rymdtema med planeter och stjärnor'
  },
  { 
    id: 'legendary' as const, 
    name: 'Legendary', 
    emoji: '⚡', 
    price: '10 kr',
    description: 'Ultimat guld-effekt med blixt'
  },
];

const SWISH_NUMBER = '1236739916';

export const PremiumShop = () => {
  const { unlockedSkins, setSelectedSkin, selectedSkin, playerName } = useGameStore();
  const [copiedSwish, setCopiedSwish] = useState(false);
  const [selectedPremium, setSelectedPremium] = useState<string | null>(null);

  const handleCopySwish = () => {
    navigator.clipboard.writeText(SWISH_NUMBER);
    setCopiedSwish(true);
    setTimeout(() => setCopiedSwish(false), 2000);
  };

  const handleSelectPremium = (skinId: typeof PREMIUM_SKINS[number]['id']) => {
    if (unlockedSkins.includes(skinId)) {
      setSelectedSkin(skinId);
    } else {
      setSelectedPremium(skinId);
    }
  };

  const handleUnlockCode = async () => {
    const code = prompt('Ange din upplåsningskod (du får denna efter betalning):');
    if (!code) return;

    try {
      const { data, error } = await supabase.functions.invoke('validate-unlock-code', {
        body: {
          unlockCode: code,
          userIdentifier: playerName || 'anonymous',
        },
      });

      if (error) throw error;

      if (data?.success) {
        const skinId = data.skinId;
        const currentUnlocked = JSON.parse(localStorage.getItem('unlockedSkins') || '["classic"]');
        const newUnlocked = [...currentUnlocked, skinId];
        localStorage.setItem('unlockedSkins', JSON.stringify(newUnlocked));
        toast.success('Skin upplåst! 🎉', {
          description: `${skinId} skin är nu tillgänglig!`,
        });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error validating code:', error);
      toast.error('Ogiltig kod', {
        description: 'Kontrollera din kod och försök igen.',
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card/90 to-primary/5 backdrop-blur-md border-2 border-primary/20">
      <div className="flex items-center gap-2 mb-4 justify-center">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text">
          Premium Skins
        </h3>
      </div>

      <p className="text-sm text-muted-foreground text-center mb-6">
        Köp exklusiva premium skins med riktiga pengar via Swish
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {PREMIUM_SKINS.map((skin) => {
          const isUnlocked = unlockedSkins.includes(skin.id);
          const isSelected = selectedSkin === skin.id;

          return (
            <button
              key={skin.id}
              onClick={() => handleSelectPremium(skin.id)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-primary shadow-xl scale-105 ring-2 ring-primary/50 bg-gradient-to-br from-primary/20 to-accent/20' 
                  : isUnlocked
                  ? 'border-primary/40 hover:border-primary hover:scale-105 bg-gradient-to-br from-primary/10 to-accent/10'
                  : 'border-primary/30 hover:border-primary/50 hover:scale-105 bg-gradient-to-br from-background to-card'
                }
                cursor-pointer
              `}
            >
              <div className="text-5xl mb-3">{skin.emoji}</div>
              <div className="text-lg font-bold text-foreground mb-1">{skin.name}</div>
              <div className="text-xs text-muted-foreground mb-3">{skin.description}</div>
              
              {isUnlocked ? (
                <div className="text-sm font-bold text-primary">Upplåst ✓</div>
              ) : (
                <div className="text-lg font-bold text-primary">{skin.price}</div>
              )}

              {isSelected && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm text-primary-foreground font-bold">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedPremium && !unlockedSkins.includes(selectedPremium as any) && (
        <div className="space-y-4 p-4 bg-card/50 rounded-lg border border-primary/20">
          <h4 className="font-bold text-foreground">Så här köper du:</h4>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Swisha beloppet till numret nedan</li>
            <li>Skriv "{PREMIUM_SKINS.find(s => s.id === selectedPremium)?.name}" i meddelandet</li>
            <li>Du får en upplåsningskod via SMS</li>
            <li>Ange koden här för att låsa upp din skin</li>
          </ol>

          <div className="flex items-center gap-2 p-4 bg-background/50 rounded-lg border border-border">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">Swish-nummer:</div>
              <div className="text-2xl font-bold text-foreground font-mono">{SWISH_NUMBER}</div>
            </div>
            <Button
              onClick={handleCopySwish}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {copiedSwish ? (
                <>
                  <Check className="w-4 h-4" />
                  Kopierat!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Kopiera
                </>
              )}
            </Button>
          </div>

          <Button
            onClick={handleUnlockCode}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-primary"
          >
            Jag har betalat - Ange kod
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-4">
        Alla köp är slutgiltiga. Support: kontakta oss om du har problem.
      </p>
    </Card>
  );
};
