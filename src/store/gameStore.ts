import { create } from 'zustand';
import { Vector3 } from 'three';

interface GameState {
  gameState: 'waiting' | 'playing' | 'gameOver';
  score: number;
  highScore: number;
  ballPosition: Vector3;
  isGameRunning: boolean;
  
  // Actions
  setBallPosition: (position: Vector3) => void;
  updateScore: (newScore: number) => void;
  endGame: () => void;
  restartGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameState: 'waiting',
  score: 0,
  highScore: typeof window !== 'undefined' ? 
    Number(localStorage.getItem('slopeHighScore') || '0') : 0,
  ballPosition: new Vector3(0, 1, 0),
  isGameRunning: false,

  setBallPosition: (position) => set({ ballPosition: position }),

  updateScore: (newScore) => {
    const currentScore = Math.max(get().score, newScore);
    set({ score: currentScore });
  },

  endGame: () => {
    const { score, highScore } = get();
    const newHighScore = Math.max(score, highScore);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('slopeHighScore', newHighScore.toString());
    }
    
    set({ 
      gameState: 'gameOver',
      isGameRunning: false,
      highScore: newHighScore
    });
  },

  restartGame: () => {
    set({
      gameState: 'playing',
      score: 0,
      ballPosition: new Vector3(0, 1, 0),
      isGameRunning: true
    });
  }
}));