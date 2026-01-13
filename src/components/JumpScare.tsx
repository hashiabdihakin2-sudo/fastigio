import { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

interface JumpScareProps {
  score: number;
}

const SCARY_EMOJIS = ['👻', '💀', '🎃', '👹', '😈', '🦇', '🕷️', '☠️'];

export const JumpScare = ({ score }: JumpScareProps) => {
  const [showScare, setShowScare] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);
  const [scareEmoji, setScareEmoji] = useState('👻');

  useEffect(() => {
    const currentMilestone = Math.floor(score / 1000) * 1000;
    
    if (currentMilestone > lastMilestone && currentMilestone > 0) {
      setLastMilestone(currentMilestone);
      setScareEmoji(SCARY_EMOJIS[Math.floor(Math.random() * SCARY_EMOJIS.length)]);
      setShowScare(true);
      
      // Hide after 400ms
      setTimeout(() => {
        setShowScare(false);
      }, 400);
    }
  }, [score, lastMilestone]);

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
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          animation: 'jumpScare 0.4s ease-out forwards',
        }}
      >
        <div
          style={{
            fontSize: 'min(50vw, 50vh)',
            animation: 'scareShake 0.1s linear infinite',
            textShadow: '0 0 50px red, 0 0 100px red',
            filter: 'drop-shadow(0 0 30px red)',
          }}
        >
          {scareEmoji}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#ff0000',
            textShadow: '0 0 20px red, 0 0 40px red',
            animation: 'scareShake 0.1s linear infinite',
          }}
        >
          {lastMilestone}!
        </div>
      </div>
      <style>{`
        @keyframes jumpScare {
          0% { opacity: 0; transform: scale(3); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(0.5); }
        }
        @keyframes scareShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-10px, 10px) rotate(-5deg); }
          50% { transform: translate(10px, -10px) rotate(5deg); }
          75% { transform: translate(-10px, -10px) rotate(-5deg); }
        }
      `}</style>
    </Html>
  );
};
