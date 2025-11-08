import { forwardRef } from 'react';
import { Group } from 'three';
import { useGameStore } from '@/store/gameStore';

const SKIN_CONFIGS = {
  classic: { 
    color: '#00BFFF', 
    emissive: '#4DD0E1', 
    emissiveIntensity: 0.5,
    hat: null,
    accessory: null
  },
  fire: { 
    color: '#FF4500', 
    emissive: '#FF6347', 
    emissiveIntensity: 0.8,
    hat: 'flame',
    accessory: 'spark'
  },
  ice: { 
    color: '#87CEEB', 
    emissive: '#B0E0E6', 
    emissiveIntensity: 0.7,
    hat: 'snowflake',
    accessory: 'frost'
  },
  rainbow: { 
    color: '#FF1493', 
    emissive: '#9400D3', 
    emissiveIntensity: 0.9,
    hat: 'crown',
    accessory: 'stars'
  },
  golden: { 
    color: '#FFD700', 
    emissive: '#FFA500', 
    emissiveIntensity: 0.6,
    hat: 'kingCrown',
    accessory: 'goldRings'
  },
  ninja: {
    color: '#2C2C2C',
    emissive: '#FF0000',
    emissiveIntensity: 0.5,
    hat: 'ninjaHeadband',
    accessory: 'shurikens'
  },
  robot: {
    color: '#C0C0C0',
    emissive: '#00FF00',
    emissiveIntensity: 0.9,
    hat: 'antenna',
    accessory: 'circuits'
  },
  pirate: {
    color: '#8B4513',
    emissive: '#DAA520',
    emissiveIntensity: 0.6,
    hat: 'pirateHat',
    accessory: 'eyePatch'
  },
  wizard: {
    color: '#4B0082',
    emissive: '#9370DB',
    emissiveIntensity: 0.8,
    hat: 'wizardHat',
    accessory: 'magicWand'
  },
  dragon: {
    color: '#DC143C',
    emissive: '#FF4500',
    emissiveIntensity: 1.0,
    hat: 'dragonHorns',
    accessory: 'dragonWings'
  },
  alien: {
    color: '#7FFF00',
    emissive: '#00FF00',
    emissiveIntensity: 1.0,
    hat: 'alienAntenna',
    accessory: 'alienEyes'
  },
  superhero: {
    color: '#1E90FF',
    emissive: '#4169E1',
    emissiveIntensity: 0.9,
    hat: 'superheroCape',
    accessory: 'superheroBelt'
  },
  vampire: {
    color: '#8B0000',
    emissive: '#DC143C',
    emissiveIntensity: 0.7,
    hat: 'vampireCape',
    accessory: 'vampireFangs'
  },
  knight: {
    color: '#708090',
    emissive: '#B0C4DE',
    emissiveIntensity: 0.6,
    hat: 'knightHelmet',
    accessory: 'knightShield'
  },
  zombie: {
    color: '#556B2F',
    emissive: '#9ACD32',
    emissiveIntensity: 0.5,
    hat: 'zombieHead',
    accessory: 'zombieArms'
  },
  ghost: {
    color: '#F0F8FF',
    emissive: '#FFFFFF',
    emissiveIntensity: 0.9,
    hat: 'ghostSheet',
    accessory: 'ghostGlow'
  },
  samurai: {
    color: '#8B0000',
    emissive: '#DC143C',
    emissiveIntensity: 0.7,
    hat: 'samuraiHelmet',
    accessory: 'katana'
  },
  mummy: {
    color: '#DEB887',
    emissive: '#F5DEB3',
    emissiveIntensity: 0.4,
    hat: 'mummyWraps',
    accessory: 'ancientCurse'
  },
  cyber: {
    color: '#00FFFF',
    emissive: '#FF00FF',
    emissiveIntensity: 1.2,
    hat: 'cyberVisor',
    accessory: 'dataStream'
  },
  phoenix: {
    color: '#FF8C00',
    emissive: '#FFD700',
    emissiveIntensity: 1.0,
    hat: 'phoenixCrest',
    accessory: 'phoenixWings'
  }
};

export const Ball = forwardRef<Group>((props, ref) => {
  const { selectedSkin } = useGameStore();
  const skinConfig = SKIN_CONFIGS[selectedSkin];

  return (
    <group ref={ref} position={[0, 1, 0]}>
      {/* Main ball */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhongMaterial 
          color={skinConfig.color}
          emissive={skinConfig.emissive}
          emissiveIntensity={skinConfig.emissiveIntensity}
          shininess={100}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 0.05, 0.25]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 0.05, 0.25]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Smile */}
      <mesh position={[0, -0.05, 0.26]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.12, 0.02, 8, 16, Math.PI]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Hats */}
      {skinConfig.hat === 'flame' && (
        <group position={[0, 0.35, 0]}>
          <mesh>
            <coneGeometry args={[0.15, 0.3, 8]} />
            <meshPhongMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={1} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <coneGeometry args={[0.1, 0.2, 8]} />
            <meshPhongMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={1} />
          </mesh>
        </group>
      )}

      {skinConfig.hat === 'snowflake' && (
        <group position={[0, 0.4, 0]}>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
              <boxGeometry args={[0.02, 0.02, 0.2]} />
              <meshPhongMaterial color="#FFFFFF" emissive="#B0E0E6" emissiveIntensity={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.hat === 'crown' && (
        <group position={[0, 0.35, 0]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.2, 0.15, 8]} />
            <meshPhongMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.7} />
          </mesh>
          {[0, 90, 180, 270].map((angle, i) => (
            <mesh key={i} position={[
              Math.cos((angle * Math.PI) / 180) * 0.18,
              0.1,
              Math.sin((angle * Math.PI) / 180) * 0.18
            ]}>
              <coneGeometry args={[0.05, 0.15, 4]} />
              <meshPhongMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.hat === 'kingCrown' && (
        <group position={[0, 0.4, 0]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.22, 0.2, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFA500" emissiveIntensity={0.5} />
          </mesh>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <mesh key={i} position={[
              Math.cos((angle * Math.PI) / 180) * 0.2,
              0.15,
              Math.sin((angle * Math.PI) / 180) * 0.2
            ]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshPhongMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.hat === 'ninjaHeadband' && (
        <group position={[0, 0.2, 0]}>
          <mesh>
            <torusGeometry args={[0.32, 0.03, 8, 32]} />
            <meshPhongMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0, -0.35]}>
            <boxGeometry args={[0.15, 0.1, 0.02]} />
            <meshPhongMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}

      {skinConfig.hat === 'antenna' && (
        <group position={[0, 0.35, 0]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshPhongMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={1.2} />
          </mesh>
        </group>
      )}

      {skinConfig.hat === 'pirateHat' && (
        <group position={[0, 0.35, 0]} rotation={[0.2, 0, 0]}>
          <mesh>
            <coneGeometry args={[0.25, 0.15, 3]} />
            <meshPhongMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0, 0.15]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
        </group>
      )}

      {skinConfig.hat === 'wizardHat' && (
        <group position={[0, 0.35, 0]}>
          <mesh>
            <coneGeometry args={[0.2, 0.5, 32]} />
            <meshPhongMaterial color="#4B0082" emissive="#9370DB" emissiveIntensity={0.6} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.2, 0.05, 8, 16]} />
            <meshPhongMaterial color="#4B0082" />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[
              Math.sin(i * 0.5) * 0.1,
              0.25 + i * 0.08,
              Math.cos(i * 0.5) * 0.1
            ]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} />
            </mesh>
          ))}
        </group>
      )}

      {/* Accessories */}
      {skinConfig.accessory === 'spark' && (
        <group>
          {[0, 120, 240].map((angle, i) => (
            <mesh key={i} position={[
              Math.cos((angle * Math.PI) / 180) * 0.4,
              0,
              Math.sin((angle * Math.PI) / 180) * 0.4
            ]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshPhongMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={1.5} transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.accessory === 'frost' && (
        <group>
          {[0, 90, 180, 270].map((angle, i) => (
            <mesh key={i} position={[
              Math.cos((angle * Math.PI) / 180) * 0.35,
              0,
              Math.sin((angle * Math.PI) / 180) * 0.35
            ]}>
              <octahedronGeometry args={[0.06, 0]} />
              <meshPhongMaterial color="#FFFFFF" emissive="#B0E0E6" emissiveIntensity={0.9} transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.accessory === 'stars' && (
        <group>
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <mesh key={i} position={[
              Math.cos((angle * Math.PI) / 180) * 0.4,
              Math.sin(i * 0.5) * 0.1,
              Math.sin((angle * Math.PI) / 180) * 0.4
            ]}>
              <sphereGeometry args={[0.04, 5, 5]} />
              <meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.accessory === 'goldRings' && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.4, 0.03, 8, 32]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFA500" emissiveIntensity={0.5} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.4, 0.03, 8, 32]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFA500" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {skinConfig.accessory === 'shurikens' && (
        <group>
          {[0, 120, 240].map((angle, i) => (
            <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
              <mesh position={[0.45, 0, 0]} rotation={[0, 0, Date.now() * 0.001]}>
                {[0, 90, 180, 270].map((a, idx) => (
                  <mesh key={idx} rotation={[0, 0, (a * Math.PI) / 180]}>
                    <boxGeometry args={[0.02, 0.15, 0.02]} />
                    <meshStandardMaterial color="#C0C0C0" metalness={0.9} />
                  </mesh>
                ))}
              </mesh>
            </group>
          ))}
        </group>
      )}

      {skinConfig.accessory === 'circuits' && (
        <group>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={i} position={[
              Math.cos((angle * Math.PI) / 180) * 0.32,
              0,
              Math.sin((angle * Math.PI) / 180) * 0.32
            ]}>
              <boxGeometry args={[0.03, 0.03, 0.03]} />
              <meshPhongMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.accessory === 'eyePatch' && (
        <group>
          <mesh position={[0.1, 0.05, 0.25]}>
            <circleGeometry args={[0.06, 16]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      )}

      {skinConfig.accessory === 'magicWand' && (
        <group position={[0.4, -0.1, 0]} rotation={[0, 0, -0.5]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshPhongMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshPhongMaterial color="#9370DB" emissive="#9370DB" emissiveIntensity={1.5} />
          </mesh>
        </group>
      )}

      {/* Dragon Hat */}
      {skinConfig.hat === 'dragonHorns' && (
        <group position={[0, 0.3, 0]}>
          <mesh position={[-0.15, 0.1, 0]} rotation={[0, 0, -0.3]}>
            <coneGeometry args={[0.06, 0.25, 8]} />
            <meshPhongMaterial color="#DC143C" emissive="#FF4500" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.15, 0.1, 0]} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.06, 0.25, 8]} />
            <meshPhongMaterial color="#DC143C" emissive="#FF4500" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* Dragon Wings */}
      {skinConfig.accessory === 'dragonWings' && (
        <group>
          <mesh position={[-0.3, 0, -0.1]} rotation={[0, -0.5, 0]}>
            <coneGeometry args={[0.15, 0.3, 3]} />
            <meshPhongMaterial color="#8B0000" emissive="#DC143C" emissiveIntensity={0.6} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.3, 0, -0.1]} rotation={[0, 0.5, 0]}>
            <coneGeometry args={[0.15, 0.3, 3]} />
            <meshPhongMaterial color="#8B0000" emissive="#DC143C" emissiveIntensity={0.6} transparent opacity={0.8} />
          </mesh>
        </group>
      )}

      {/* Alien Antenna */}
      {skinConfig.hat === 'alienAntenna' && (
        <group position={[0, 0.35, 0]}>
          <mesh position={[-0.1, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
            <meshPhongMaterial color="#7FFF00" emissive="#00FF00" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[-0.1, 0.15, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshPhongMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0.1, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
            <meshPhongMaterial color="#7FFF00" emissive="#00FF00" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.1, 0.15, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshPhongMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={1.5} />
          </mesh>
        </group>
      )}

      {/* Alien Eyes */}
      {skinConfig.accessory === 'alienEyes' && (
        <group>
          <mesh position={[-0.12, 0.1, 0.25]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshPhongMaterial color="#000000" emissive="#00FF00" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.12, 0.1, 0.25]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshPhongMaterial color="#000000" emissive="#00FF00" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {/* Superhero Cape */}
      {skinConfig.hat === 'superheroCape' && (
        <group position={[0, 0.1, -0.3]} rotation={[0.3, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.6, 0.02]} />
            <meshPhongMaterial color="#DC143C" emissive="#FF0000" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {/* Superhero Belt */}
      {skinConfig.accessory === 'superheroBelt' && (
        <group position={[0, -0.15, 0]}>
          <mesh>
            <torusGeometry args={[0.32, 0.04, 8, 32]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* Vampire Cape */}
      {skinConfig.hat === 'vampireCape' && (
        <group position={[0, 0.15, -0.3]} rotation={[0.2, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.7, 0.02]} />
            <meshPhongMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <coneGeometry args={[0.15, 0.2, 32]} />
            <meshPhongMaterial color="#000000" />
          </mesh>
        </group>
      )}

      {/* Vampire Fangs */}
      {skinConfig.accessory === 'vampireFangs' && (
        <group position={[0, -0.08, 0.28]}>
          <mesh position={[-0.08, 0, 0]}>
            <coneGeometry args={[0.02, 0.08, 8]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.08, 0, 0]}>
            <coneGeometry args={[0.02, 0.08, 8]} />
            <meshPhongMaterial color="#FFFFFF" />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
        </group>
      )}

      {/* Knight Helmet */}
      {skinConfig.hat === 'knightHelmet' && (
        <group position={[0, 0.25, 0]}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#708090" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.05, 0.2]}>
            <boxGeometry args={[0.3, 0.08, 0.02]} />
            <meshStandardMaterial color="#708090" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <coneGeometry args={[0.1, 0.2, 4]} />
            <meshStandardMaterial color="#DC143C" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* Knight Shield */}
      {skinConfig.accessory === 'knightShield' && (
        <group position={[0.35, 0, 0]} rotation={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.02, 0.25, 0.2]} />
            <meshStandardMaterial color="#708090" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.01, 0, 0]}>
            <boxGeometry args={[0.01, 0.15, 0.1]} />
            <meshPhongMaterial color="#DC143C" />
          </mesh>
        </group>
      )}

      {/* Zombie Head */}
      {skinConfig.hat === 'zombieHead' && (
        <group position={[0, 0.3, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.15, 0.1, 0.15]} />
            <meshPhongMaterial color="#556B2F" />
          </mesh>
        </group>
      )}

      {/* Zombie Arms */}
      {skinConfig.accessory === 'zombieArms' && (
        <group>
          <mesh position={[-0.35, -0.1, 0.1]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.08, 0.3, 0.08]} />
            <meshPhongMaterial color="#556B2F" emissive="#9ACD32" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.35, -0.1, 0.1]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.08, 0.3, 0.08]} />
            <meshPhongMaterial color="#556B2F" emissive="#9ACD32" emissiveIntensity={0.3} />
          </mesh>
        </group>
      )}

      {/* Ghost Sheet */}
      {skinConfig.hat === 'ghostSheet' && (
        <group position={[0, 0.35, 0]}>
          <mesh>
            <coneGeometry args={[0.25, 0.4, 32]} />
            <meshPhongMaterial color="#F0F8FF" emissive="#FFFFFF" emissiveIntensity={0.6} transparent opacity={0.8} />
          </mesh>
        </group>
      )}

      {/* Ghost Glow */}
      {skinConfig.accessory === 'ghostGlow' && (
        <group>
          {[0, 120, 240].map((angle, i) => (
            <mesh key={i} position={[
              Math.cos((angle * Math.PI) / 180) * 0.4,
              Math.sin(i * 0.3) * 0.1,
              Math.sin((angle * Math.PI) / 180) * 0.4
            ]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshPhongMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1.5} transparent opacity={0.5} />
            </mesh>
          ))}
        </group>
      )}

      {/* Samurai Helmet */}
      {skinConfig.hat === 'samuraiHelmet' && (
        <group position={[0, 0.3, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.25, 0.15, 6]} />
            <meshStandardMaterial color="#8B0000" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-0.2, 0.1, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.15, 0.3, 0.02]} />
            <meshPhongMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.2, 0.1, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.15, 0.3, 0.02]} />
            <meshPhongMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {/* Katana */}
      {skinConfig.accessory === 'katana' && (
        <group position={[0.35, -0.1, -0.1]} rotation={[0.5, 0, 0.3]}>
          <mesh>
            <boxGeometry args={[0.02, 0.5, 0.02]} />
            <meshStandardMaterial color="#C0C0C0" metalness={1.0} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.27, 0]}>
            <boxGeometry args={[0.03, 0.08, 0.03]} />
            <meshPhongMaterial color="#8B0000" />
          </mesh>
        </group>
      )}

      {/* Mummy Wraps */}
      {skinConfig.hat === 'mummyWraps' && (
        <group position={[0, 0.3, 0]}>
          {[0, 0.08, 0.16].map((y, i) => (
            <mesh key={i} position={[0, y - 0.08, 0]}>
              <torusGeometry args={[0.32, 0.03, 6, 16]} />
              <meshPhongMaterial color="#DEB887" />
            </mesh>
          ))}
        </group>
      )}

      {/* Ancient Curse */}
      {skinConfig.accessory === 'ancientCurse' && (
        <group>
          {[0, 90, 180, 270].map((angle, i) => (
            <mesh key={i} position={[
              Math.cos((angle * Math.PI) / 180) * 0.35,
              Math.sin(Date.now() * 0.001 + i) * 0.1,
              Math.sin((angle * Math.PI) / 180) * 0.35
            ]}>
              <boxGeometry args={[0.05, 0.05, 0.05]} />
              <meshPhongMaterial color="#F5DEB3" emissive="#DEB887" emissiveIntensity={0.8} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {/* Cyber Visor */}
      {skinConfig.hat === 'cyberVisor' && (
        <group position={[0, 0.15, 0]}>
          <mesh>
            <boxGeometry args={[0.35, 0.08, 0.25]} />
            <meshStandardMaterial color="#00FFFF" emissive="#FF00FF" emissiveIntensity={1.0} metalness={0.9} roughness={0.1} transparent opacity={0.7} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-0.15 + i * 0.15, 0, 0.13]}>
              <boxGeometry args={[0.02, 0.04, 0.01]} />
              <meshPhongMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={2.0} />
            </mesh>
          ))}
        </group>
      )}

      {/* Data Stream */}
      {skinConfig.accessory === 'dataStream' && (
        <group>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={i} position={[
              Math.cos((angle * Math.PI) / 180) * 0.4,
              Math.sin(Date.now() * 0.003 + i) * 0.2,
              Math.sin((angle * Math.PI) / 180) * 0.4
            ]}>
              <boxGeometry args={[0.02, 0.08, 0.02]} />
              <meshPhongMaterial color="#00FFFF" emissive="#FF00FF" emissiveIntensity={1.5} transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {/* Phoenix Crest */}
      {skinConfig.hat === 'phoenixCrest' && (
        <group position={[0, 0.35, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[
              (i - 1) * 0.1,
              0.1 + (i === 1 ? 0.15 : 0),
              0
            ]} rotation={[0.2, 0, (i - 1) * 0.3]}>
              <coneGeometry args={[0.08, 0.25, 8]} />
              <meshPhongMaterial color="#FF8C00" emissive="#FFD700" emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* Phoenix Wings */}
      {skinConfig.accessory === 'phoenixWings' && (
        <group>
          <mesh position={[-0.35, 0, -0.1]} rotation={[0, -0.8, 0.2]}>
            <coneGeometry args={[0.2, 0.4, 3]} />
            <meshPhongMaterial color="#FF8C00" emissive="#FFD700" emissiveIntensity={1.0} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0.35, 0, -0.1]} rotation={[0, 0.8, -0.2]}>
            <coneGeometry args={[0.2, 0.4, 3]} />
            <meshPhongMaterial color="#FF8C00" emissive="#FFD700" emissiveIntensity={1.0} transparent opacity={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
});
