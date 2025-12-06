import { Button } from './ui/button';
import { Card } from './ui/card';
import { useGameStore } from '../store/gameStore';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Coins, Maximize } from 'lucide-react';
import { useState, useEffect, type RefObject } from 'react';


interface GameUIProps {
  currentSection: number;
  gameState: 'waiting' | 'playing' | 'gameOver';
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  fullscreenTarget?: RefObject<HTMLElement>;
}

export const GameUI = ({ currentSection, gameState, onRestart, isMuted, onToggleMute, fullscreenTarget }: GameUIProps) => {
  const { score, highScore, coins } = useGameStore();
  const [isLandscape, setIsLandscape] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    const checkFullscreen = () => {
      const doc = document as any;
      const inFS = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
      const pseudo = document.body.classList.contains('pseudo-fullscreen');
      setIsFullscreen(inFS || pseudo);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen as any);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen as any);
    };
  }, []);

  const toggleFullscreen = async () => {
    const doc = document as any;
    const elem = (fullscreenTarget?.current || document.documentElement) as any;

    const canNativeFS = !!(
      elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen
    );

    try {
      if (
        !doc.fullscreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.msFullscreenElement
      ) {
        if (canNativeFS) {
          if (elem.requestFullscreen) await elem.requestFullscreen();
          else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
          else if (elem.mozRequestFullScreen) await elem.mozRequestFullScreen();
          else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
        } else {
          document.body.classList.add('pseudo-fullscreen');
          setIsFullscreen(true);
          window.scrollTo(0, 0);
        }
      } else {
        if (doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
        else if (doc.mozCancelFullScreen) await doc.mozCancelFullScreen();
        else if (doc.msExitFullscreen) await doc.msExitFullscreen();
        else {
          document.body.classList.remove('pseudo-fullscreen');
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      // Fallback if native request fails (e.g., iOS Safari inside iframe)
      document.body.classList.toggle('pseudo-fullscreen');
      setIsFullscreen(document.body.classList.contains('pseudo-fullscreen'));
      console.error('Fullscreen error:', err);
    }
  };
  
  const handleMobileControl = (direction: 'left' | 'right') => {
    (window as any).handleGlide?.(direction);
  };

  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Score display */}
      <div className="absolute top-2 left-2 sm:top-8 sm:left-8 pointer-events-auto">
        <Card className="cyber-border p-2 sm:p-4 bg-card/80 backdrop-blur-md">
          <div className="text-lg sm:text-2xl font-bold text-neon-blue">
            {score}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            Rekord: {highScore}
          </div>
          <div className="text-[10px] sm:text-xs text-accent flex items-center gap-1 mt-0.5 sm:mt-1">
            <Coins className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {coins} coins
          </div>
        </Card>
      </div>

      {/* Controls hint, fullscreen and mute button */}
      {gameState === 'playing' && (
        <div className="absolute top-2 right-2 sm:top-8 sm:right-8 pointer-events-auto flex items-start gap-1 sm:gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={toggleFullscreen}
            className="cyber-border bg-card/80 backdrop-blur-md hover:bg-card w-8 h-8 sm:w-10 sm:h-10"
            title={isFullscreen ? "Avsluta fullskärm" : "Fullskärm"}
          >
            <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={onToggleMute}
            className="cyber-border bg-card/80 backdrop-blur-md hover:bg-card w-8 h-8 sm:w-10 sm:h-10"
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
          <Card className="cyber-border p-2 sm:p-4 bg-card/80 backdrop-blur-md hidden md:block">
            <div className="text-sm text-muted-foreground text-right">
              <div>Piltangenter ← →</div>
              <div className="text-neon-purple">för att hoppa åt sidan</div>
            </div>
          </Card>
        </div>
      )}

      {/* Game start/waiting screen */}
      {gameState === 'waiting' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <Card className="cyber-border p-8 bg-card/90 backdrop-blur-md text-center glow-effect">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              HOPP SPEL
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Undvik hinder och överlev så länge du kan!
            </p>
            <Button 
              variant="default" 
              size="lg" 
              onClick={onRestart}
              className="glow-effect bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold"
            >
              STARTA SPEL
            </Button>
          </Card>
        </div>
      )}

      {/* Game over screen - now handled by GameOverScreen component */}

      {/* Mobile controls */}
      {gameState === 'playing' && (
        <div className={`absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center pointer-events-auto px-4 ${isLandscape ? 'gap-16' : 'gap-6 sm:gap-8'}`}>
          <Button
            size="icon"
            variant="default"
            className={`rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary shadow-glow active:scale-95 ${isLandscape ? 'w-20 h-20' : 'w-14 h-14 sm:w-16 sm:h-16'}`}
            onTouchStart={(e) => {
              e.preventDefault();
              handleMobileControl('left');
            }}
            onClick={() => handleMobileControl('left')}
          >
            <ChevronLeft className={isLandscape ? 'w-10 h-10' : 'w-7 h-7 sm:w-8 sm:h-8'} />
          </Button>
          <Button
            size="icon"
            variant="default"
            className={`rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary shadow-glow active:scale-95 ${isLandscape ? 'w-20 h-20' : 'w-14 h-14 sm:w-16 sm:h-16'}`}
            onTouchStart={(e) => {
              e.preventDefault();
              handleMobileControl('right');
            }}
            onClick={() => handleMobileControl('right')}
          >
            <ChevronRight className={isLandscape ? 'w-10 h-10' : 'w-7 h-7 sm:w-8 sm:h-8'} />
          </Button>
        </div>
      )}
    </div>
  );
};