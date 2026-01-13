import { useState, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';

interface JumpScareProps {
  score: number;
}

export const JumpScare = ({ score }: JumpScareProps) => {
  const [showScare, setShowScare] = useState(false);
  const lastMilestoneRef = useRef(0);

  useEffect(() => {
    const currentMilestone = Math.floor(score / 1000) * 1000;
    
    if (currentMilestone > lastMilestoneRef.current && currentMilestone > 0) {
      lastMilestoneRef.current = currentMilestone;
      setShowScare(true);
      
      // Hide after 600ms
      const timer = setTimeout(() => {
        setShowScare(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [score]);

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
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 9999,
          animation: 'flashIn 0.6s ease-out forwards',
        }}
      >
        {/* Scary green block with face */}
        <div
          style={{
            width: 'min(70vw, 70vh)',
            height: 'min(70vw, 70vh)',
            background: 'linear-gradient(135deg, #00ff00 0%, #003300 50%, #00ff00 100%)',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'scareShake 0.05s linear infinite, scaleUp 0.2s ease-out',
            boxShadow: '0 0 100px #00ff00, 0 0 200px #00ff00, inset 0 0 100px rgba(0,0,0,0.5)',
            border: '8px solid #00ff00',
            position: 'relative',
          }}
        >
          {/* Creepy eyes */}
          <div style={{
            display: 'flex',
            gap: '15%',
            marginBottom: '5%',
          }}>
            <div style={{
              width: 'min(15vw, 15vh)',
              height: 'min(18vw, 18vh)',
              background: '#000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 30px #ff0000, 0 0 20px #ff0000',
              animation: 'eyePulse 0.15s linear infinite',
            }}>
              <div style={{
                width: '60%',
                height: '60%',
                background: 'radial-gradient(circle, #ff0000 0%, #660000 70%, #000 100%)',
                borderRadius: '50%',
                animation: 'pupilMove 0.1s linear infinite',
              }} />
            </div>
            <div style={{
              width: 'min(15vw, 15vh)',
              height: 'min(18vw, 18vh)',
              background: '#000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 30px #ff0000, 0 0 20px #ff0000',
              animation: 'eyePulse 0.15s linear infinite',
            }}>
              <div style={{
                width: '60%',
                height: '60%',
                background: 'radial-gradient(circle, #ff0000 0%, #660000 70%, #000 100%)',
                borderRadius: '50%',
                animation: 'pupilMove 0.1s linear infinite alternate',
              }} />
            </div>
          </div>
          
          {/* Scary mouth */}
          <div style={{
            width: '60%',
            height: '25%',
            background: '#000',
            borderRadius: '10px 10px 50% 50%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '2%',
            gap: '3%',
            boxShadow: 'inset 0 0 40px #330000',
          }}>
            {/* Teeth */}
            {[...Array(7)].map((_, i) => (
              <div key={i} style={{
                width: '10%',
                height: i % 2 === 0 ? '50%' : '35%',
                background: 'linear-gradient(180deg, #ffffcc 0%, #999966 100%)',
                borderRadius: '0 0 5px 5px',
                boxShadow: '0 0 5px rgba(255,255,200,0.5)',
              }} />
            ))}
          </div>

          {/* Dripping slime effect */}
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              bottom: '-10%',
              left: `${15 + i * 18}%`,
              width: '8%',
              height: '15%',
              background: 'linear-gradient(180deg, #00ff00 0%, #003300 100%)',
              borderRadius: '0 0 50% 50%',
              animation: `drip 0.3s ease-in ${i * 0.05}s infinite`,
            }} />
          ))}
        </div>
        
        {/* Score text */}
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            fontSize: 'min(12vw, 80px)',
            fontWeight: 'bold',
            color: '#00ff00',
            textShadow: '0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #003300',
            animation: 'scareShake 0.05s linear infinite',
            fontFamily: 'monospace',
          }}
        >
          {lastMilestoneRef.current} POÄNG!
        </div>

        {/* Screen flash effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#00ff00',
          animation: 'screenFlash 0.6s ease-out forwards',
          pointerEvents: 'none',
        }} />
      </div>
      <style>{`
        @keyframes flashIn {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes scaleUp {
          0% { transform: scale(3) rotate(10deg); }
          50% { transform: scale(0.9) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes scareShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-5px, 5px) rotate(-2deg); }
          50% { transform: translate(5px, -5px) rotate(2deg); }
          75% { transform: translate(-5px, -5px) rotate(-1deg); }
        }
        @keyframes eyePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes pupilMove {
          0% { transform: translate(-20%, -20%); }
          100% { transform: translate(20%, 20%); }
        }
        @keyframes drip {
          0% { height: 15%; opacity: 1; }
          100% { height: 30%; opacity: 0; }
        }
        @keyframes screenFlash {
          0% { opacity: 0.8; }
          20% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </Html>
  );
};
