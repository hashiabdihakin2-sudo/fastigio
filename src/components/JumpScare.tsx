import { useState, useEffect, useRef, useCallback } from 'react';
import { Html } from '@react-three/drei';

interface JumpScareProps {
  score: number;
}

export const JumpScare = ({ score }: JumpScareProps) => {
  const [showScare, setShowScare] = useState(false);
  const lastMilestoneRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoadingAudioRef = useRef(false);

  const playScreamSound = useCallback(async () => {
    if (isLoadingAudioRef.current) return;
    isLoadingAudioRef.current = true;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scary-scream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.volume = 0.8;
        audioRef.current = audio;
        await audio.play();
      }
    } catch (error) {
      console.error("Failed to play scream sound:", error);
    } finally {
      isLoadingAudioRef.current = false;
    }
  }, []);

  useEffect(() => {
    const currentMilestone = Math.floor(score / 1000) * 1000;
    
    if (currentMilestone > lastMilestoneRef.current && currentMilestone > 0) {
      lastMilestoneRef.current = currentMilestone;
      setShowScare(true);
      
      // Play scary sound
      playScreamSound();
      
      // Hide after 2.5 seconds
      const timer = setTimeout(() => {
        setShowScare(false);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [score, playScreamSound]);

  if (!showScare) return null;

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          zIndex: 99999,
          animation: 'flashIn 2.5s ease-out forwards',
        }}
      >
        {/* Giant scary green cube with face */}
        <div
          style={{
            width: '90vmin',
            height: '90vmin',
            background: 'linear-gradient(135deg, #00ff00 0%, #001100 30%, #00ff00 50%, #002200 70%, #00ff00 100%)',
            borderRadius: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'scareShake 0.03s linear infinite, cubeAppear 0.15s ease-out',
            boxShadow: '0 0 150px #00ff00, 0 0 300px #00ff00, 0 0 500px #003300, inset 0 0 150px rgba(0,0,0,0.7)',
            border: '12px solid #00ff00',
            position: 'relative',
            transform: 'perspective(500px) rotateX(5deg)',
          }}
        >
          {/* Creepy glowing eyes */}
          <div style={{
            display: 'flex',
            gap: '20%',
            marginBottom: '5%',
            marginTop: '-5%',
          }}>
            <div style={{
              width: '20vmin',
              height: '25vmin',
              background: 'radial-gradient(ellipse, #000 60%, #001100 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 50px #ff0000, 0 0 40px #ff0000, 0 0 80px #ff0000',
              animation: 'eyePulse 0.1s linear infinite',
              border: '4px solid #330000',
            }}>
              <div style={{
                width: '70%',
                height: '70%',
                background: 'radial-gradient(circle, #ff0000 0%, #ff0000 30%, #880000 60%, #330000 80%, #000 100%)',
                borderRadius: '50%',
                animation: 'pupilMove 0.08s linear infinite',
                boxShadow: '0 0 30px #ff0000, inset 0 0 20px #ff6600',
              }} />
            </div>
            <div style={{
              width: '20vmin',
              height: '25vmin',
              background: 'radial-gradient(ellipse, #000 60%, #001100 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 50px #ff0000, 0 0 40px #ff0000, 0 0 80px #ff0000',
              animation: 'eyePulse 0.1s linear infinite 0.05s',
              border: '4px solid #330000',
            }}>
              <div style={{
                width: '70%',
                height: '70%',
                background: 'radial-gradient(circle, #ff0000 0%, #ff0000 30%, #880000 60%, #330000 80%, #000 100%)',
                borderRadius: '50%',
                animation: 'pupilMove 0.08s linear infinite alternate',
                boxShadow: '0 0 30px #ff0000, inset 0 0 20px #ff6600',
              }} />
            </div>
          </div>
          
          {/* Giant terrifying mouth */}
          <div style={{
            width: '70%',
            height: '30%',
            background: 'linear-gradient(180deg, #000 0%, #110000 50%, #000 100%)',
            borderRadius: '20px 20px 50% 50%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '2%',
            gap: '2%',
            boxShadow: 'inset 0 0 60px #440000, 0 0 30px rgba(255,0,0,0.5)',
            border: '4px solid #220000',
            animation: 'mouthOpen 0.15s ease-out',
          }}>
            {/* Sharp teeth */}
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{
                width: '8%',
                height: i % 2 === 0 ? '60%' : '40%',
                background: 'linear-gradient(180deg, #ffffaa 0%, #cccc66 50%, #666633 100%)',
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 0 10px rgba(255,255,180,0.5), inset 0 -5px 10px rgba(0,0,0,0.3)',
                clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)',
              }} />
            ))}
          </div>
          
          {/* Bottom teeth */}
          <div style={{
            position: 'absolute',
            bottom: '15%',
            width: '60%',
            display: 'flex',
            justifyContent: 'center',
            gap: '3%',
          }}>
            {[...Array(7)].map((_, i) => (
              <div key={i} style={{
                width: '7%',
                height: i % 2 === 0 ? '8vmin' : '5vmin',
                background: 'linear-gradient(0deg, #ffffaa 0%, #999966 100%)',
                borderRadius: '8px 8px 0 0',
                boxShadow: '0 0 8px rgba(255,255,180,0.4)',
                clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)',
              }} />
            ))}
          </div>

          {/* Dripping slime from eyes */}
          {[...Array(4)].map((_, i) => (
            <div key={`slime-${i}`} style={{
              position: 'absolute',
              top: '35%',
              left: `${20 + i * 20}%`,
              width: '4%',
              height: '20%',
              background: 'linear-gradient(180deg, #00ff00 0%, #003300 100%)',
              borderRadius: '0 0 50% 50%',
              animation: `drip 0.2s ease-in ${i * 0.05}s infinite`,
              opacity: 0.8,
            }} />
          ))}

          {/* Cracks on face */}
          {[...Array(6)].map((_, i) => (
            <div key={`crack-${i}`} style={{
              position: 'absolute',
              top: `${10 + i * 15}%`,
              left: i % 2 === 0 ? '5%' : '85%',
              width: '10%',
              height: '3px',
              background: '#003300',
              transform: `rotate(${i % 2 === 0 ? 30 : -30}deg)`,
              boxShadow: '0 0 10px #00ff00',
            }} />
          ))}
        </div>
        
        {/* Score text */}
        <div
          style={{
            position: 'absolute',
            bottom: '3%',
            fontSize: 'min(15vw, 100px)',
            fontWeight: '900',
            color: '#00ff00',
            textShadow: '0 0 30px #00ff00, 0 0 60px #00ff00, 0 0 90px #003300, 0 0 120px #00ff00',
            animation: 'scareShake 0.03s linear infinite, textPulse 0.2s ease-in-out infinite',
            fontFamily: 'Impact, sans-serif',
            letterSpacing: '10px',
          }}
        >
          {lastMilestoneRef.current}!
        </div>

        {/* Screen flash effects */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#00ff00',
          animation: 'screenFlash 2.5s ease-out forwards',
          pointerEvents: 'none',
        }} />
        
        {/* Red vignette */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, transparent 30%, rgba(255,0,0,0.3) 100%)',
          pointerEvents: 'none',
          animation: 'vignetteFlash 0.3s ease-in-out infinite',
        }} />

        {/* Glitch lines */}
        {[...Array(8)].map((_, i) => (
          <div key={`glitch-${i}`} style={{
            position: 'absolute',
            top: `${i * 12.5}%`,
            left: 0,
            width: '100%',
            height: '2px',
            background: i % 2 === 0 ? '#00ff00' : '#ff0000',
            opacity: 0.5,
            animation: `glitchLine 0.05s linear infinite ${i * 0.01}s`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes flashIn {
          0% { opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes cubeAppear {
          0% { transform: perspective(500px) rotateX(5deg) scale(5); opacity: 0; }
          50% { transform: perspective(500px) rotateX(5deg) scale(0.9); }
          100% { transform: perspective(500px) rotateX(5deg) scale(1); opacity: 1; }
        }
        @keyframes scareShake {
          0%, 100% { transform: perspective(500px) rotateX(5deg) translate(0, 0) rotate(0deg); }
          25% { transform: perspective(500px) rotateX(5deg) translate(-8px, 8px) rotate(-1deg); }
          50% { transform: perspective(500px) rotateX(5deg) translate(8px, -8px) rotate(1deg); }
          75% { transform: perspective(500px) rotateX(5deg) translate(-8px, -8px) rotate(-0.5deg); }
        }
        @keyframes eyePulse {
          0%, 100% { transform: scale(1); box-shadow: inset 0 0 50px #ff0000, 0 0 40px #ff0000, 0 0 80px #ff0000; }
          50% { transform: scale(1.15); box-shadow: inset 0 0 70px #ff0000, 0 0 60px #ff0000, 0 0 120px #ff0000; }
        }
        @keyframes pupilMove {
          0% { transform: translate(-30%, -30%) scale(1.1); }
          50% { transform: translate(30%, 30%) scale(0.9); }
          100% { transform: translate(-30%, 30%) scale(1.1); }
        }
        @keyframes mouthOpen {
          0% { height: 5%; }
          100% { height: 30%; }
        }
        @keyframes drip {
          0% { height: 20%; opacity: 0.8; }
          100% { height: 40%; opacity: 0; transform: translateY(20px); }
        }
        @keyframes screenFlash {
          0% { opacity: 1; }
          10% { opacity: 0; }
          15% { opacity: 0.5; }
          20% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes textPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes vignetteFlash {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes glitchLine {
          0%, 100% { transform: translateX(0); opacity: 0.3; }
          50% { transform: translateX(10px); opacity: 0.8; }
        }
      `}</style>
    </Html>
  );
};
