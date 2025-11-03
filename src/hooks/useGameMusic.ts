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

      // Dark techno-style melody with bass and synth elements
      const melody = [
        // Bass line
        { freq: 130.81, duration: 0.2, type: 'sawtooth' as OscillatorType }, // C3
        { freq: 130.81, duration: 0.1, type: 'sawtooth' as OscillatorType }, // C3
        { freq: 164.81, duration: 0.2, type: 'sawtooth' as OscillatorType }, // E3
        { freq: 196.00, duration: 0.1, type: 'sawtooth' as OscillatorType }, // G3
        { freq: 130.81, duration: 0.2, type: 'sawtooth' as OscillatorType }, // C3
        { freq: 146.83, duration: 0.1, type: 'sawtooth' as OscillatorType }, // D3
        
        // Synth hits
        { freq: 523.25, duration: 0.15, type: 'square' as OscillatorType }, // C5
        { freq: 659.25, duration: 0.15, type: 'square' as OscillatorType }, // E5
        { freq: 783.99, duration: 0.1, type: 'square' as OscillatorType }, // G5
        { freq: 659.25, duration: 0.1, type: 'square' as OscillatorType }, // E5
        
        // Bass drop
        { freq: 98.00, duration: 0.3, type: 'sawtooth' as OscillatorType }, // G2
        { freq: 110.00, duration: 0.2, type: 'sawtooth' as OscillatorType }, // A2
        
        // High synth
        { freq: 1046.50, duration: 0.1, type: 'sine' as OscillatorType }, // C6
        { freq: 880.00, duration: 0.1, type: 'sine' as OscillatorType }, // A5
        { freq: 783.99, duration: 0.15, type: 'sine' as OscillatorType }, // G5
        
        // Final bass
        { freq: 130.81, duration: 0.25, type: 'sawtooth' as OscillatorType }, // C3
      ];

      let currentTime = ctx.currentTime;

      const playMelody = () => {
        melody.forEach((note) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          
          osc.type = note.type || 'sine';
          osc.frequency.value = note.freq;
          
          // Adjust volume based on frequency range for better mix
          const baseVolume = note.freq < 200 ? 0.4 : 0.25;
          
          // Sharp attack and decay for techno feel
          noteGain.gain.setValueAtTime(0, currentTime);
          noteGain.gain.linearRampToValueAtTime(baseVolume, currentTime + 0.02);
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
