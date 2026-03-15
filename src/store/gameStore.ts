import { create } from 'zustand';
import { Vector3 } from 'three';

interface HighScore {
  score: number;
  date: string;
  skin: string;
  playerName: string;
}

const SKIN_PRICES = {
  // Standard (free & cheap)
  classic: 0,
  fire: 200,
  ice: 200,
  ghost: 300,
  neon: 300,
  pixel: 400,
  rainbow: 500,
  golden: 600,
  ninja: 700,
  robot: 800,
  // Mid-tier
  lava: 1000,
  ocean: 1000,
  electric: 1200,
  crystal: 1200,
  shadow: 1500,
  candy: 1500,
  toxic: 1800,
  sunset: 1800,
  arctic: 2000,
  chrome: 2000,
  // Premium
  cleopatra: 3000,
  coco: 3500,
  phoenix: 4000,
  galaxy: 5000,
  samurai: 6000,
  dragon: 8000,
  legend: 12000,
} as const;

type SkinType = keyof typeof SKIN_PRICES;

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
    const newCoins = Math.floor(score / 10);
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

  getSkinPrice: (skin) => SKIN_PRICES[skin] ?? 1000,

  unlockSkin: (skin) => {
    const { coins, unlockedSkins } = get();
    const price = SKIN_PRICES[skin] ?? 1000;
    
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
