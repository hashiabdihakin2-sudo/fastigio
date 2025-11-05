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

    // Dark techno bassline (inspired by FEIN)
    const bassNotes = [
      { freq: 55, duration: 0.5 },    // A1
      { freq: 55, duration: 0.5 },    // A1
      { freq: 65.41, duration: 0.5 }, // C2
      { freq: 73.42, duration: 0.5 }, // D2
      { freq: 55, duration: 0.5 },    // A1
      { freq: 55, duration: 0.5 },    // A1
      { freq: 49, duration: 0.5 },    // G1
      { freq: 55, duration: 0.5 },    // A1
    ];

    // Aggressive synth melody
    const melodyNotes = [
      { freq: 220, duration: 0.25 },   // A3
      { freq: 261.63, duration: 0.25 }, // C4
      { freq: 293.66, duration: 0.25 }, // D4
      { freq: 329.63, duration: 0.25 }, // E4
      { freq: 293.66, duration: 0.25 }, // D4
      { freq: 261.63, duration: 0.25 }, // C4
      { freq: 220, duration: 0.5 },     // A3
      { freq: 0, duration: 0.25 },      // Rest
    ];

    let bassTime = audioContext.currentTime;
    let melodyTime = audioContext.currentTime;

    const playBass = () => {
      bassNotes.forEach((note) => {
        if (note.freq > 0) {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.type = 'sawtooth';
          osc.frequency.value = note.freq;
          
          // Hard attack, sustained release
          gain.gain.setValueAtTime(0, bassTime);
          gain.gain.linearRampToValueAtTime(0.8, bassTime + 0.01);
          gain.gain.setValueAtTime(0.8, bassTime + note.duration - 0.05);
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
          
          // Sharp attack
          gain.gain.setValueAtTime(0, melodyTime);
          gain.gain.linearRampToValueAtTime(0.3, melodyTime + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.01, melodyTime + note.duration);
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.start(melodyTime);
          osc.stop(melodyTime + note.duration);
        }
        melodyTime += note.duration;
      });
    };

    // 808-style kick drum
    const playKick = () => {
      const kickInterval = 0.5;
      let kickTime = audioContext.currentTime;
      
      for (let i = 0; i < 32; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.frequency.setValueAtTime(150, kickTime);
        osc.frequency.exponentialRampToValueAtTime(40, kickTime + 0.1);
        
        gain.gain.setValueAtTime(1, kickTime);
        gain.gain.exponentialRampToValueAtTime(0.01, kickTime + 0.3);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(kickTime);
        osc.stop(kickTime + 0.3);
        
        kickTime += kickInterval;
      }
    };

    // Hi-hat pattern
    const playHiHat = () => {
      const hiHatInterval = 0.25;
      let hiHatTime = audioContext.currentTime;
      
      for (let i = 0; i < 64; i++) {
        const bufferSize = audioContext.sampleRate * 0.1;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.1));
        }
        
        const noise = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gain = audioContext.createGain();
        
        noise.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.value = 7000;
        
        const intensity = i % 4 === 0 ? 0.3 : 0.15;
        gain.gain.setValueAtTime(intensity, hiHatTime);
        gain.gain.exponentialRampToValueAtTime(0.01, hiHatTime + 0.1);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        noise.start(hiHatTime);
        
        hiHatTime += hiHatInterval;
      }
    };

    // Start all patterns
    playKick();
    playHiHat();
    playBass();
    playMelody();

    // Loop the music
    const totalDuration = 4; // 4 seconds loop
    const loopInterval = setInterval(() => {
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        bassTime = audioContext.currentTime;
        melodyTime = audioContext.currentTime;
        playKick();
        playHiHat();
        playBass();
        playMelody();
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
