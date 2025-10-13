import { create } from 'zustand';
import { Vector3 } from 'three';

interface GameState {
  gameState: 'waiting' | 'playing' | 'gameOver' | 'levelComplete';
  currentSection: number;
  ballPosition: Vector3;
  isJumping: boolean;
  isGameRunning: boolean;
  
  // Actions
  setBallPosition: (position: Vector3) => void;
  nextSection: () => void;
  setIsJumping: (jumping: boolean) => void;
  endGame: () => void;
  restartGame: () => void;
  completeLevel: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameState: 'waiting',
  currentSection: 0,
  ballPosition: new Vector3(0, 1, 0),
  isJumping: false,
  isGameRunning: false,

  setBallPosition: (position) => set({ ballPosition: position }),

  setIsJumping: (jumping) => set({ isJumping: jumping }),

  nextSection: () => {
    const { currentSection } = get();
    if (currentSection >= 8) {
      get().completeLevel();
    } else {
      set({ currentSection: currentSection + 1 });
    }
  },

  completeLevel: () => {
    set({ 
      gameState: 'levelComplete',
      isGameRunning: false
    });
  },

  endGame: () => {
    set({ 
      gameState: 'gameOver',
      isGameRunning: false
    });
  },

  restartGame: () => {
    set({
      gameState: 'playing',
      currentSection: 0,
      ballPosition: new Vector3(0, 1, 0),
      isGameRunning: true,
      isJumping: false
    });
  }
}));