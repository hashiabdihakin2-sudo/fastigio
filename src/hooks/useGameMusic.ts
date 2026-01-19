import { useEffect, useRef, useState } from 'react';

export const useGameMusic = (isPlaying: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isPlaying || isMuted) {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    // Create audio context
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    // Master gain for volume control
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(audioContext.destination);
    masterGainRef.current = masterGain;

    // Original upbeat electronic game melody
    const melodyNotes = [
      { freq: 523.25, duration: 0.2 },  // C5
      { freq: 587.33, duration: 0.2 },  // D5
      { freq: 659.25, duration: 0.2 },  // E5
      { freq: 783.99, duration: 0.4 },  // G5
      { freq: 659.25, duration: 0.2 },  // E5
      { freq: 587.33, duration: 0.2 },  // D5
      { freq: 523.25, duration: 0.4 },  // C5
      { freq: 392.00, duration: 0.2 },  // G4
      { freq: 440.00, duration: 0.2 },  // A4
      { freq: 523.25, duration: 0.4 },  // C5
      { freq: 0, duration: 0.2 },       // Rest
    ];

    // Driving bass line
    const bassNotes = [
      { freq: 130.81, duration: 0.3 },  // C3
      { freq: 130.81, duration: 0.3 },  // C3
      { freq: 98.00, duration: 0.3 },   // G2
      { freq: 98.00, duration: 0.3 },   // G2
      { freq: 110.00, duration: 0.3 },  // A2
      { freq: 110.00, duration: 0.3 },  // A2
      { freq: 130.81, duration: 0.6 },  // C3
    ];

    let bassTime = audioContext.currentTime;
    let melodyTime = audioContext.currentTime;

    const playBass = () => {
      bassNotes.forEach((note) => {
        if (note.freq > 0) {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.type = 'sine';
          osc.frequency.value = note.freq;
          
          gain.gain.setValueAtTime(0, bassTime);
          gain.gain.linearRampToValueAtTime(0.4, bassTime + 0.02);
          gain.gain.setValueAtTime(0.4, bassTime + note.duration - 0.1);
          gain.gain.linearRampToValueAtTime(0, bassTime + note.duration);
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.start(bassTime);
          osc.stop(bassTime + note.duration);
        }
        bassTime += note.duration;
      });
    };

    const playMelody = () => {
      melodyNotes.forEach((note) => {
        if (note.freq > 0) {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.type = 'square';
          osc.frequency.value = note.freq;
          
          gain.gain.setValueAtTime(0, melodyTime);
          gain.gain.linearRampToValueAtTime(0.15, melodyTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, melodyTime + note.duration);
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.start(melodyTime);
          osc.stop(melodyTime + note.duration);
        }
        melodyTime += note.duration;
      });
    };

    // Kick drum
    const playKick = () => {
      const kickInterval = 0.4;
      let kickTime = audioContext.currentTime;
      
      for (let i = 0; i < 40; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.frequency.setValueAtTime(150, kickTime);
        osc.frequency.exponentialRampToValueAtTime(50, kickTime + 0.1);
        
        gain.gain.setValueAtTime(0.5, kickTime);
        gain.gain.exponentialRampToValueAtTime(0.01, kickTime + 0.15);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(kickTime);
        osc.stop(kickTime + 0.15);
        
        kickTime += kickInterval;
      }
    };

    // Hi-hat pattern
    const playHiHat = () => {
      const hiHatInterval = 0.2;
      let hiHatTime = audioContext.currentTime;
      
      for (let i = 0; i < 80; i++) {
        const bufferSize = audioContext.sampleRate * 0.05;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.15));
        }
        
        const noise = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gain = audioContext.createGain();
        
        noise.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.value = 8000;
        
        const intensity = i % 4 === 0 ? 0.15 : 0.08;
        gain.gain.setValueAtTime(intensity, hiHatTime);
        gain.gain.exponentialRampToValueAtTime(0.01, hiHatTime + 0.08);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        noise.start(hiHatTime);
        
        hiHatTime += hiHatInterval;
      }
    };

    // Arpeggio synth
    const playArpeggio = () => {
      const arpNotes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      const arpInterval = 0.15;
      let arpTime = audioContext.currentTime;
      
      for (let i = 0; i < 60; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.value = arpNotes[i % arpNotes.length];
        
        gain.gain.setValueAtTime(0, arpTime);
        gain.gain.linearRampToValueAtTime(0.08, arpTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, arpTime + 0.12);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(arpTime);
        osc.stop(arpTime + 0.12);
        
        arpTime += arpInterval;
      }
    };

    // Start all patterns
    playKick();
    playHiHat();
    playBass();
    playMelody();
    playArpeggio();

    // Loop the music
    const totalDuration = 3;
    const loopInterval = setInterval(() => {
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        bassTime = audioContext.currentTime;
        melodyTime = audioContext.currentTime;
        playKick();
        playHiHat();
        playBass();
        playMelody();
        playArpeggio();
      }
    }, totalDuration * 1000);

    return () => {
      clearInterval(loopInterval);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isPlaying, isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return { isMuted, toggleMute };
};
