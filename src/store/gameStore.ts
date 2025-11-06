import { create } from 'zustand';
import { Vector3 } from 'three';

interface GameState {
  gameState: 'waiting' | 'playing' | 'gameOver';
  currentSection: number;
  ballPosition: Vector3;
  isJumping: boolean;
  isGameRunning: boolean;
  score: number;
  highScore: number;
  selectedSkin: 'classic' | 'fire' | 'ice' | 'rainbow' | 'golden';
  
  // Actions
  setBallPosition: (position: Vector3) => void;
  nextSection: () => void;
  setIsJumping: (jumping: boolean) => void;
  endGame: () => void;
  restartGame: () => void;
  updateScore: (score: number) => void;
  setSelectedSkin: (skin: 'classic' | 'fire' | 'ice' | 'rainbow' | 'golden') => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameState: 'waiting',
  currentSection: 0,
  ballPosition: new Vector3(0, 1, 0),
  isJumping: false,
  isGameRunning: false,
  score: 0,
  highScore: 0,
  selectedSkin: 'classic',

  setBallPosition: (position) => set({ ballPosition: position }),

  setIsJumping: (jumping) => set({ isJumping: jumping }),

  updateScore: (score) => set({ score }),

  setSelectedSkin: (skin) => set({ selectedSkin: skin }),

  nextSection: () => {
    const { currentSection } = get();
    set({ currentSection: currentSection + 1 });
  },

  endGame: () => {
    const { score, highScore } = get();
    set({ 
      gameState: 'gameOver',
      isGameRunning: false,
      highScore: Math.max(score, highScore)
    });
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