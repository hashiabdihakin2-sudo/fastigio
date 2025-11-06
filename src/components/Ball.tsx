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
    </group>
  );
});
