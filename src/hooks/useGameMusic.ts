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

    // Upbeat 60s Christmas pop inspired original melody
    // Energetic, driving feel with bells
    const melodyNotes = [
      // Upbeat, joyful phrase 1
      { freq: 392.00, duration: 0.15 },  // G4
      { freq: 440.00, duration: 0.15 },  // A4
      { freq: 493.88, duration: 0.3 },   // B4
      { freq: 523.25, duration: 0.2 },   // C5
      { freq: 493.88, duration: 0.2 },   // B4
      { freq: 440.00, duration: 0.4 },   // A4
      // Phrase 2 - energetic climb
      { freq: 349.23, duration: 0.15 },  // F4
      { freq: 392.00, duration: 0.15 },  // G4
      { freq: 440.00, duration: 0.3 },   // A4
      { freq: 523.25, duration: 0.4 },   // C5
      { freq: 493.88, duration: 0.2 },   // B4
      { freq: 392.00, duration: 0.4 },   // G4
      // Phrase 3 - resolution
      { freq: 329.63, duration: 0.2 },   // E4
      { freq: 392.00, duration: 0.2 },   // G4
      { freq: 523.25, duration: 0.5 },   // C5
      { freq: 0, duration: 0.1 },        // Rest
    ];

    // Driving bass line - "Wall of Sound" style
    const bassNotes = [
      { freq: 130.81, duration: 0.2 },   // C3
      { freq: 130.81, duration: 0.2 },   // C3
      { freq: 146.83, duration: 0.2 },   // D3
      { freq: 130.81, duration: 0.2 },   // C3
      { freq: 110.00, duration: 0.2 },   // A2
      { freq: 110.00, duration: 0.2 },   // A2
      { freq: 123.47, duration: 0.2 },   // B2
      { freq: 130.81, duration: 0.2 },   // C3
      { freq: 98.00, duration: 0.2 },    // G2
      { freq: 98.00, duration: 0.2 },    // G2
      { freq: 110.00, duration: 0.2 },   // A2
      { freq: 123.47, duration: 0.2 },   // B2
      { freq: 130.81, duration: 0.4 },   // C3
      { freq: 98.00, duration: 0.2 },    // G2
      { freq: 130.81, duration: 0.2 },   // C3
    ];
    
    // Rich, layered harmony - Christmas bells
    const harmonyNotes = [
      { freq: 659.25, duration: 0.3 },   // E5
      { freq: 783.99, duration: 0.3 },   // G5
      { freq: 659.25, duration: 0.3 },   // E5
      { freq: 587.33, duration: 0.3 },   // D5
      { freq: 523.25, duration: 0.4 },   // C5
      { freq: 659.25, duration: 0.3 },   // E5
      { freq: 783.99, duration: 0.3 },   // G5
      { freq: 880.00, duration: 0.4 },   // A5
      { freq: 783.99, duration: 0.3 },   // G5
      { freq: 659.25, duration: 0.3 },   // E5
      { freq: 523.25, duration: 0.4 },   // C5
    ];

    let bassTime = audioContext.currentTime;
    let melodyTime = audioContext.currentTime;
    let harmonyTime = audioContext.currentTime;

    const playBass = () => {
      bassNotes.forEach((note) => {
        if (note.freq > 0) {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.type = 'sine';
          osc.frequency.value = note.freq;
          
          // Soft, bouncy envelope
          gain.gain.setValueAtTime(0, bassTime);
          gain.gain.linearRampToValueAtTime(0.3, bassTime + 0.02);
          gain.gain.setValueAtTime(0.3, bassTime + note.duration - 0.1);
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
          
          // Triangle wave for warm Christmas bell sound
          osc.type = 'triangle';
          osc.frequency.value = note.freq;
          
          // Bright, bell-like attack
          gain.gain.setValueAtTime(0, melodyTime);
          gain.gain.linearRampToValueAtTime(0.3, melodyTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, melodyTime + note.duration);
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.start(melodyTime);
          osc.stop(melodyTime + note.duration);
        }
        melodyTime += note.duration;
      });
    };
    
    const playHarmony = () => {
      harmonyNotes.forEach((note) => {
        if (note.freq > 0) {
          // Add a second oscillator for bell shimmer
          const osc = audioContext.createOscillator();
          const osc2 = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          // Sine wave with slight detune for bell effect
          osc.type = 'sine';
          osc.frequency.value = note.freq;
          osc2.type = 'sine';
          osc2.frequency.value = note.freq * 2.01; // Slight detune for shimmer
          
          // Bell-like envelope with longer sustain
          gain.gain.setValueAtTime(0, harmonyTime);
          gain.gain.linearRampToValueAtTime(0.12, harmonyTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.02, harmonyTime + note.duration * 0.8);
          gain.gain.linearRampToValueAtTime(0, harmonyTime + note.duration);
          
          osc.connect(gain);
          osc2.connect(gain);
          gain.connect(masterGain);
          
          osc.start(harmonyTime);
          osc2.start(harmonyTime);
          osc.stop(harmonyTime + note.duration);
          osc2.stop(harmonyTime + note.duration);
        }
        harmonyTime += note.duration;
      });
    };

    // Sleigh bell jingle effect (replacing kick)
    const playSleighBells = () => {
      const bellInterval = 0.5;
      let bellTime = audioContext.currentTime;
      
      for (let i = 0; i < 32; i++) {
        // Create jingle bell sound with noise + high frequency
        const bufferSize = audioContext.sampleRate * 0.15;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let j = 0; j < bufferSize; j++) {
          // Mix of noise and sine for bell-like jingle
          const t = j / audioContext.sampleRate;
          const bell = Math.sin(2 * Math.PI * 3000 * t) * Math.exp(-t * 20);
          const jingle = Math.sin(2 * Math.PI * 5000 * t) * Math.exp(-t * 25);
          data[j] = (bell + jingle + (Math.random() - 0.5) * 0.3) * Math.exp(-j / (bufferSize * 0.3));
        }
        
        const noise = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gain = audioContext.createGain();
        
        noise.buffer = buffer;
        filter.type = 'bandpass';
        filter.frequency.value = 4000;
        filter.Q.value = 2;
        
        gain.gain.setValueAtTime(0.2, bellTime);
        gain.gain.exponentialRampToValueAtTime(0.01, bellTime + 0.15);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        noise.start(bellTime);
        
        bellTime += bellInterval;
      }
    };
    const playKick = () => {
      const kickInterval = 0.4;
      let kickTime = audioContext.currentTime;
      
      for (let i = 0; i < 40; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.frequency.setValueAtTime(120, kickTime);
        osc.frequency.exponentialRampToValueAtTime(50, kickTime + 0.08);
        
        gain.gain.setValueAtTime(0.6, kickTime);
        gain.gain.exponentialRampToValueAtTime(0.01, kickTime + 0.2);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(kickTime);
        osc.stop(kickTime + 0.2);
        
        kickTime += kickInterval;
      }
    };

    // Gentle hi-hat pattern
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

    // Start all Christmas patterns
    playSleighBells();
    playHiHat();
    playBass();
    playMelody();
    playHarmony();

    // Loop the music (4 seconds)
    const totalDuration = 4;
    const loopInterval = setInterval(() => {
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        bassTime = audioContext.currentTime;
        melodyTime = audioContext.currentTime;
        harmonyTime = audioContext.currentTime;
        playSleighBells();
        playHiHat();
        playBass();
        playMelody();
        playHarmony();
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
