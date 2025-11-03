import { useEffect, useRef } from 'react';

export const useGameMusic = (isPlaying: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;

    // Create gain node for volume control
    if (!gainNodeRef.current) {
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.connect(ctx.destination);
      gainNodeRef.current.gain.value = 0.15; // Lower volume
    }

    if (isPlaying && oscillatorsRef.current.length === 0) {
      // Resume audio context if suspended (required by some browsers)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create an exciting, fast-paced melody
      const melody = [
        { freq: 659.25, duration: 0.15 }, // E5
        { freq: 783.99, duration: 0.15 }, // G5
        { freq: 880.00, duration: 0.15 }, // A5
        { freq: 1046.50, duration: 0.15 }, // C6
        { freq: 880.00, duration: 0.1 }, // A5
        { freq: 1046.50, duration: 0.1 }, // C6
        { freq: 1174.66, duration: 0.2 }, // D6
        { freq: 1046.50, duration: 0.15 }, // C6
        { freq: 880.00, duration: 0.15 }, // A5
        { freq: 783.99, duration: 0.15 }, // G5
        { freq: 880.00, duration: 0.1 }, // A5
        { freq: 1046.50, duration: 0.1 }, // C6
        { freq: 1318.51, duration: 0.3 }, // E6
        { freq: 1174.66, duration: 0.15 }, // D6
        { freq: 1046.50, duration: 0.15 }, // C6
        { freq: 880.00, duration: 0.2 }, // A5
      ];

      let currentTime = ctx.currentTime;

      const playMelody = () => {
        melody.forEach((note) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          
          osc.type = 'sine'; // Smooth, light sound
          osc.frequency.value = note.freq;
          
          // ADSR envelope for smoother notes
          noteGain.gain.setValueAtTime(0, currentTime);
          noteGain.gain.linearRampToValueAtTime(0.3, currentTime + 0.05);
          noteGain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
          
          osc.connect(noteGain);
          noteGain.connect(gainNodeRef.current!);
          
          osc.start(currentTime);
          osc.stop(currentTime + note.duration);
          
          currentTime += note.duration;
        });
      };

      // Play melody in loop
      const loopMelody = () => {
        playMelody();
        const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0);
        setTimeout(loopMelody, totalDuration * 1000);
      };

      loopMelody();
    } else if (!isPlaying && oscillatorsRef.current.length > 0) {
      // Stop all oscillators
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      oscillatorsRef.current = [];
    }

    return () => {
      // Cleanup
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      oscillatorsRef.current = [];
    };
  }, [isPlaying]);

  return null;
};
