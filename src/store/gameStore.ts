import { create } from 'zustand';
import { Vector3 } from 'three';

interface HighScore {
  score: number;
  date: string;
  skin: string;
  playerName: string;
}

const SKIN_PRICES = {
  // Standard
  classic: 0,
  fire: 800,
  ice: 800,
  ghost: 1000,
  rainbow: 1500,
  golden: 2500,
  ninja: 3500,
  robot: 4500,
  // International Women's Day - Iconic Women
  cleopatra: 2000,
  frida: 3000,
  amelia: 4000,
  curie: 5000,
  florence: 5500,
  rosa_w: 6000,
  harriet_w: 7000,
  coco: 8000,
  malala: 9000,
  joan: 10000,
  queen: 12000,
  wonder: 15000,
  serena: 18000,
  legend_woman: 25000,
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