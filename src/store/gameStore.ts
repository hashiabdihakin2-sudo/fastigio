import { create } from 'zustand';
import { Vector3 } from 'three';

interface HighScore {
  score: number;
  date: string;
  skin: string;
  playerName: string;
}

const SKIN_PRICES = {
  classic: 0,
  fire: 800,
  ice: 800,
  rainbow: 1500,
  golden: 2500,
  ninja: 3500,
  robot: 4500,
  pirate: 5500,
  wizard: 6500,
  dragon: 8000,
  alien: 9000,
  superhero: 10000,
  vampire: 11000,
  knight: 12000,
  zombie: 800,
  ghost: 1000,
  samurai: 7000,
  mummy: 6000,
  cyber: 9500,
  phoenix: 15000,
  christmas: 1200,
  santa: 3500,
  snowman: 2000,
  gingerbread: 1500,
  easter: 1200,
  bunny: 2500,
  egg: 1500,
  football: 2000,
  soccer: 2500,
  basketball: 2200,
  tennis: 1800,
  baseball: 2100,
  // New Year 2026 Premium Skins
  newyear2026: 25000,
  firework: 30000,
  champagne: 35000,
  diamond: 50000,
  galaxy: 75000,
} as const;


type SkinType = 'classic' | 'fire' | 'ice' | 'rainbow' | 'golden' | 'ninja' | 'robot' | 'pirate' | 'wizard' | 'dragon' | 'alien' | 'superhero' | 'vampire' | 'knight' | 'zombie' | 'ghost' | 'samurai' | 'mummy' | 'cyber' | 'phoenix' | 'christmas' | 'santa' | 'snowman' | 'gingerbread' | 'easter' | 'bunny' | 'egg' | 'football' | 'soccer' | 'basketball' | 'tennis' | 'baseball' | 'newyear2026' | 'firework' | 'champagne' | 'diamond' | 'galaxy';

interface GameState {
  gameState: 'waiting' | 'playing' | 'gameOver';
  currentSection: number;
  ballPosition: Vector3;
  isJumping: boolean;
  isGameRunning: boolean;
  score: number;
  highScore: number;
  highScores: HighScore[];
  coins: number;
  unlockedSkins: SkinType[];
  selectedSkin: SkinType;
  playerName: string;
  
  // Actions
  setBallPosition: (position: Vector3) => void;
  nextSection: () => void;
  setIsJumping: (jumping: boolean) => void;
  endGame: () => void;
  restartGame: () => void;
  updateScore: (score: number) => void;
  setSelectedSkin: (skin: SkinType) => void;
  unlockSkin: (skin: SkinType) => boolean;
  getSkinPrice: (skin: SkinType) => number;
  setPlayerName: (name: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameState: 'waiting',
  currentSection: 0,
  ballPosition: new Vector3(0, 1, 0),
  isJumping: false,
  isGameRunning: false,
  score: 0,
  highScore: parseInt(localStorage.getItem('highScore') || '0'),
  highScores: JSON.parse(localStorage.getItem('highScores') || '[]'),
  coins: parseInt(localStorage.getItem('coins') || '0'),
  unlockedSkins: JSON.parse(localStorage.getItem('unlockedSkins') || '["classic"]'),
  selectedSkin: 'classic',
  playerName: localStorage.getItem('playerName') || '',

  setBallPosition: (position) => set({ ballPosition: position }),

  setIsJumping: (jumping) => set({ isJumping: jumping }),

  updateScore: (score) => {
    const { coins } = get();
    const newCoins = Math.floor(score / 10); // Från poäng
    if (newCoins > coins) {
      set({ coins: newCoins });
      localStorage.setItem('coins', newCoins.toString());
    }
    set({ score });
  },

  setSelectedSkin: (skin) => set({ selectedSkin: skin }),

  setPlayerName: (name) => {
    set({ playerName: name });
    localStorage.setItem('playerName', name);
  },

  getSkinPrice: (skin) => SKIN_PRICES[skin],

  unlockSkin: (skin) => {
    const { coins, unlockedSkins } = get();
    const price = SKIN_PRICES[skin];
    
    if (unlockedSkins.includes(skin)) return true;
    if (coins < price) return false;
    
    const newCoins = coins - price;
    const newUnlockedSkins = [...unlockedSkins, skin];
    
    set({ 
      coins: newCoins, 
      unlockedSkins: newUnlockedSkins,
      selectedSkin: skin 
    });
    
    localStorage.setItem('coins', newCoins.toString());
    localStorage.setItem('unlockedSkins', JSON.stringify(newUnlockedSkins));
    
    return true;
  },

  nextSection: () => {
    const { currentSection } = get();
    set({ currentSection: currentSection + 1 });
  },

  endGame: () => {
    const { score, highScore, highScores, selectedSkin, playerName } = get();
    const newHighScore = Math.max(score, highScore);
    
    // Lägg till i högpoänglistan
    const newHighScores = [...highScores, {
      score,
      date: new Date().toLocaleDateString('sv-SE'),
      skin: selectedSkin,
      playerName: playerName || 'Anonym'
    }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    set({ 
      gameState: 'gameOver',
      isGameRunning: false,
      highScore: newHighScore,
      highScores: newHighScores
    });
    
    localStorage.setItem('highScore', newHighScore.toString());
    localStorage.setItem('highScores', JSON.stringify(newHighScores));
  },

  restartGame: () => {
    set({
      gameState: 'playing',
      currentSection: 0,
      ballPosition: new Vector3(0, 1, 0),
      isGameRunning: true,
      isJumping: false,
      score: 0
    });
  }
}));