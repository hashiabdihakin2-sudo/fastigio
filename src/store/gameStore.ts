import { create } from 'zustand';
import { Vector3 } from 'three';

interface HighScore {
  score: number;
  date: string;
  skin: string;
}

const SKIN_PRICES = {
  classic: 0,
  fire: 500,
  ice: 500,
  rainbow: 1000,
  golden: 1500,
  ninja: 2000,
  robot: 2500,
  pirate: 3000,
  wizard: 3500,
};


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
  unlockedSkins: ('classic' | 'fire' | 'ice' | 'rainbow' | 'golden' | 'ninja' | 'robot' | 'pirate' | 'wizard')[];
  selectedSkin: 'classic' | 'fire' | 'ice' | 'rainbow' | 'golden' | 'ninja' | 'robot' | 'pirate' | 'wizard';
  
  // Actions
  setBallPosition: (position: Vector3) => void;
  nextSection: () => void;
  setIsJumping: (jumping: boolean) => void;
  endGame: () => void;
  restartGame: () => void;
  updateScore: (score: number) => void;
  setSelectedSkin: (skin: 'classic' | 'fire' | 'ice' | 'rainbow' | 'golden' | 'ninja' | 'robot' | 'pirate' | 'wizard') => void;
  unlockSkin: (skin: 'classic' | 'fire' | 'ice' | 'rainbow' | 'golden' | 'ninja' | 'robot' | 'pirate' | 'wizard') => boolean;
  getSkinPrice: (skin: 'classic' | 'fire' | 'ice' | 'rainbow' | 'golden' | 'ninja' | 'robot' | 'pirate' | 'wizard') => number;
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
    const { score, highScore, highScores, selectedSkin } = get();
    const newHighScore = Math.max(score, highScore);
    
    // Lägg till i högpoänglistan
    const newHighScores = [...highScores, {
      score,
      date: new Date().toLocaleDateString('sv-SE'),
      skin: selectedSkin
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