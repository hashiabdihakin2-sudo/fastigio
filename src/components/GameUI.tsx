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

  const toggleFullscreen = () => {
    const doc = document as any;
    const elem = (fullscreenTarget?.current || document.documentElement) as any;

    const isCurrentlyFullscreen = !!(
      doc.fullscreenElement || 
      doc.webkitFullscreenElement || 
      doc.mozFullScreenElement || 
      doc.msFullscreenElement ||
      document.body.classList.contains('pseudo-fullscreen')
    );

    if (!isCurrentlyFullscreen) {
      // Try to enter fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => usePseudoFullscreen(true));
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else {
        // Fallback for iOS Safari and other browsers without fullscreen API
        usePseudoFullscreen(true);
      }
    } else {
      // Exit fullscreen
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => usePseudoFullscreen(false));
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      } else {
        usePseudoFullscreen(false);
      }
    }
  };

  const usePseudoFullscreen = (enable: boolean) => {
    if (enable) {
      document.body.classList.add('pseudo-fullscreen');
      // Scroll to top and hide address bar on mobile
      window.scrollTo(0, 1);
    } else {
      document.body.classList.remove('pseudo-fullscreen');
    }
    setIsFullscreen(enable);
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