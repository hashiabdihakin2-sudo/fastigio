import { forwardRef } from 'react';
import { Group } from 'three';
import { useGameStore } from '@/store/gameStore';

const SKIN_CONFIGS: Record<string, { 
  color: string; 
  emissive: string; 
  emissiveIntensity: number;
  hat: string | null;
  accessory: string | null;
}> = {
  classic: { color: '#808080', emissive: '#999999', emissiveIntensity: 0.3, hat: null, accessory: null },
  fire: { color: '#FF4500', emissive: '#FF6347', emissiveIntensity: 0.8, hat: 'flame', accessory: 'spark' },
  ice: { color: '#87CEEB', emissive: '#B0E0E6', emissiveIntensity: 0.7, hat: 'snowflake', accessory: 'frost' },
  ghost: { color: '#F0F8FF', emissive: '#FFFFFF', emissiveIntensity: 0.9, hat: 'ghostSheet', accessory: 'ghostGlow' },
  rainbow: { color: '#FF1493', emissive: '#9400D3', emissiveIntensity: 0.9, hat: 'crown', accessory: 'stars' },
  golden: { color: '#FFD700', emissive: '#FFA500', emissiveIntensity: 0.6, hat: 'kingCrown', accessory: 'goldRings' },
  ninja: { color: '#2C2C2C', emissive: '#FF0000', emissiveIntensity: 0.5, hat: 'ninjaHeadband', accessory: 'shurikens' },
  robot: { color: '#C0C0C0', emissive: '#00FF00', emissiveIntensity: 0.9, hat: 'antenna', accessory: 'circuits' },
  
  // Premium
  cleopatra: { color: '#D4AF37', emissive: '#B8860B', emissiveIntensity: 0.5, hat: 'cleopatraCrown', accessory: 'cleopatraJewels' },
  coco: { color: '#1a1a1a', emissive: '#333333', emissiveIntensity: 0.2, hat: 'cocoHat', accessory: 'cocoPearls' },
  phoenix: { color: '#FF4500', emissive: '#FF6600', emissiveIntensity: 1.0, hat: 'phoenixCrest', accessory: 'phoenixWings' },
  galaxy: { color: '#4B0082', emissive: '#7B68EE', emissiveIntensity: 0.8, hat: 'galaxyHalo', accessory: 'galaxyOrbit' },
  samurai: { color: '#8B0000', emissive: '#CC0000', emissiveIntensity: 0.4, hat: 'samuraiHelmet', accessory: 'samuraiArmor' },
  dragon: { color: '#228B22', emissive: '#32CD32', emissiveIntensity: 0.6, hat: 'dragonHorns', accessory: 'dragonWings' },
  legend: { color: '#FFD700', emissive: '#FFA500', emissiveIntensity: 0.8, hat: 'legendCrown', accessory: 'legendCape' },
};

interface BallProps {
  skinId?: string;
}

export const Ball = forwardRef<Group, BallProps>(({ skinId }, ref) => {
  const { selectedSkin } = useGameStore();
  const skinConfig = SKIN_CONFIGS[skinId || selectedSkin] || SKIN_CONFIGS.classic;

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

      {/* ========== STANDARD HATS ========== */}
      
      {skinConfig.hat === 'flame' && (
        <group position={[0, 0.35, 0]}>
          <mesh><coneGeometry args={[0.15, 0.3, 8]} /><meshPhongMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={1} /></mesh>
          <mesh position={[0, 0.15, 0]}><coneGeometry args={[0.1, 0.2, 8]} /><meshPhongMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={1} /></mesh>
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
          <mesh><cylinderGeometry args={[0.18, 0.2, 0.15, 8]} /><meshPhongMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.7} /></mesh>
          {[0, 90, 180, 270].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.18, 0.1, Math.sin((angle * Math.PI) / 180) * 0.18]}>
              <coneGeometry args={[0.05, 0.15, 4]} /><meshPhongMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.hat === 'kingCrown' && (
        <group position={[0, 0.4, 0]}>
          <mesh><cylinderGeometry args={[0.2, 0.22, 0.2, 8]} /><meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFA500" emissiveIntensity={0.5} /></mesh>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.2, 0.15, Math.sin((angle * Math.PI) / 180) * 0.2]}>
              <sphereGeometry args={[0.04, 8, 8]} /><meshPhongMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.hat === 'ninjaHeadband' && (
        <group position={[0, 0.2, 0]}>
          <mesh><torusGeometry args={[0.32, 0.03, 8, 32]} /><meshPhongMaterial color="#000000" /></mesh>
          <mesh position={[0, 0, -0.35]}><boxGeometry args={[0.15, 0.1, 0.02]} /><meshPhongMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.6} /></mesh>
        </group>
      )}

      {skinConfig.hat === 'antenna' && (
        <group position={[0, 0.35, 0]}>
          <mesh><cylinderGeometry args={[0.02, 0.02, 0.3, 8]} /><meshStandardMaterial color="#C0C0C0" metalness={0.9} /></mesh>
          <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.06, 16, 16]} /><meshPhongMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={1.2} /></mesh>
        </group>
      )}

      {skinConfig.hat === 'ghostSheet' && (
        <group position={[0, 0.35, 0]}>
          <mesh><coneGeometry args={[0.25, 0.4, 32]} /><meshPhongMaterial color="#F0F8FF" emissive="#FFFFFF" emissiveIntensity={0.6} transparent opacity={0.8} /></mesh>
        </group>
      )}

      {/* ========== PREMIUM HATS ========== */}

      {/* Cleopatra - Egyptian headdress with cobra */}
      {skinConfig.hat === 'cleopatraCrown' && (
        <group position={[0, 0.3, 0]}>
          <mesh><cylinderGeometry args={[0.22, 0.26, 0.15, 8]} /><meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0, 0.15, 0.2]}><coneGeometry args={[0.04, 0.15, 8]} /><meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.5} /></mesh>
          <mesh position={[-0.2, -0.05, 0]} rotation={[0, 0, 0.3]}><boxGeometry args={[0.08, 0.2, 0.02]} /><meshStandardMaterial color="#1a237e" metalness={0.5} /></mesh>
          <mesh position={[0.2, -0.05, 0]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.08, 0.2, 0.02]} /><meshStandardMaterial color="#1a237e" metalness={0.5} /></mesh>
          <mesh position={[0, 0.08, 0]}><torusGeometry args={[0.23, 0.02, 8, 16]} /><meshStandardMaterial color="#1a237e" metalness={0.6} /></mesh>
        </group>
      )}

      {/* Coco Chanel - Elegant black hat */}
      {skinConfig.hat === 'cocoHat' && (
        <group position={[0, 0.3, 0]}>
          <mesh><cylinderGeometry args={[0.32, 0.32, 0.02, 32]} /><meshPhongMaterial color="#1a1a1a" /></mesh>
          <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.14, 0.16, 0.15, 16]} /><meshPhongMaterial color="#1a1a1a" /></mesh>
          <mesh position={[0, 0.02, 0]}><torusGeometry args={[0.16, 0.015, 8, 16]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
          <mesh position={[0.14, 0.04, 0.1]}><sphereGeometry args={[0.04, 8, 8]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
        </group>
      )}

      {/* Phoenix - Flaming crest with multiple fire layers */}
      {skinConfig.hat === 'phoenixCrest' && (
        <group position={[0, 0.3, 0]}>
          {/* Central flame */}
          <mesh position={[0, 0.15, 0]}><coneGeometry args={[0.12, 0.4, 8]} /><meshPhongMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={1.5} /></mesh>
          <mesh position={[0, 0.25, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1.5} /></mesh>
          <mesh position={[0, 0.35, 0]}><coneGeometry args={[0.04, 0.15, 8]} /><meshPhongMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1} /></mesh>
          {/* Side flames */}
          <mesh position={[-0.15, 0.1, 0]} rotation={[0, 0, 0.4]}><coneGeometry args={[0.06, 0.2, 6]} /><meshPhongMaterial color="#FF6600" emissive="#FF6600" emissiveIntensity={1.2} /></mesh>
          <mesh position={[0.15, 0.1, 0]} rotation={[0, 0, -0.4]}><coneGeometry args={[0.06, 0.2, 6]} /><meshPhongMaterial color="#FF6600" emissive="#FF6600" emissiveIntensity={1.2} /></mesh>
          {/* Back plume feathers */}
          <mesh position={[-0.1, 0.12, -0.1]} rotation={[0.3, 0, 0.3]}><coneGeometry args={[0.04, 0.25, 6]} /><meshPhongMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.8} /></mesh>
          <mesh position={[0.1, 0.12, -0.1]} rotation={[0.3, 0, -0.3]}><coneGeometry args={[0.04, 0.25, 6]} /><meshPhongMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.8} /></mesh>
        </group>
      )}

      {/* Galaxy - Cosmic halo with orbiting stars */}
      {skinConfig.hat === 'galaxyHalo' && (
        <group position={[0, 0.35, 0]}>
          {/* Nebula halo ring */}
          <mesh rotation={[Math.PI / 6, 0, 0]}><torusGeometry args={[0.3, 0.04, 16, 32]} /><meshPhongMaterial color="#7B68EE" emissive="#7B68EE" emissiveIntensity={1} transparent opacity={0.7} /></mesh>
          {/* Second tilted ring */}
          <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}><torusGeometry args={[0.28, 0.02, 8, 32]} /><meshPhongMaterial color="#00CED1" emissive="#00CED1" emissiveIntensity={0.8} transparent opacity={0.5} /></mesh>
          {/* Central star */}
          <mesh position={[0, 0.1, 0]}><octahedronGeometry args={[0.06]} /><meshPhongMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} /></mesh>
          {/* Orbiting mini stars */}
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const colors = ['#FF69B4', '#00BFFF', '#FFD700', '#7B68EE', '#00FF7F'];
            return (
              <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.3, Math.sin(i * 0.7) * 0.08, Math.sin((angle * Math.PI) / 180) * 0.3]}>
                <octahedronGeometry args={[0.025]} />
                <meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={1.5} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Samurai - Kabuto helmet with menpo facemask */}
      {skinConfig.hat === 'samuraiHelmet' && (
        <group position={[0, 0.28, 0]}>
          {/* Kabuto dome */}
          <mesh><sphereGeometry args={[0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#8B0000" metalness={0.8} roughness={0.2} /></mesh>
          {/* Maedate (front crest) - crescent moon */}
          <mesh position={[0, 0.18, 0.15]} rotation={[0.3, 0, 0]}>
            <torusGeometry args={[0.1, 0.015, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFA500" emissiveIntensity={0.5} />
          </mesh>
          {/* Shikoro (neck guard plates) */}
          {[-0.15, -0.1, -0.05].map((y, i) => (
            <mesh key={i} position={[0, y, -0.12]} rotation={[-0.3 - i * 0.1, 0, 0]}>
              <boxGeometry args={[0.4 + i * 0.04, 0.04, 0.02]} />
              <meshStandardMaterial color="#8B0000" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
          {/* Fukigaeshi (side flaps) */}
          <mesh position={[-0.24, 0, 0]} rotation={[0, 0.3, 0.2]}><boxGeometry args={[0.06, 0.1, 0.02]} /><meshStandardMaterial color="#FFD700" metalness={0.9} /></mesh>
          <mesh position={[0.24, 0, 0]} rotation={[0, -0.3, -0.2]}><boxGeometry args={[0.06, 0.1, 0.02]} /><meshStandardMaterial color="#FFD700" metalness={0.9} /></mesh>
          {/* Menpo (face mask) */}
          <mesh position={[0, -0.08, 0.22]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.2, 0.08, 0.02]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* Dragon - Horns with glowing eyes and scales */}
      {skinConfig.hat === 'dragonHorns' && (
        <group position={[0, 0.3, 0]}>
          {/* Left horn - curved */}
          <mesh position={[-0.15, 0.1, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.05, 0.3, 8]} />
            <meshStandardMaterial color="#2F4F2F" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-0.22, 0.22, 0]} rotation={[0, 0, 0.8]}>
            <coneGeometry args={[0.03, 0.15, 6]} />
            <meshStandardMaterial color="#3B5B3B" metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Right horn - curved */}
          <mesh position={[0.15, 0.1, 0]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[0.05, 0.3, 8]} />
            <meshStandardMaterial color="#2F4F2F" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0.22, 0.22, 0]} rotation={[0, 0, -0.8]}>
            <coneGeometry args={[0.03, 0.15, 6]} />
            <meshStandardMaterial color="#3B5B3B" metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Scale ridge on top */}
          {[0, 0.06, 0.12, 0.18].map((y, i) => (
            <mesh key={i} position={[0, 0.02 + y, -0.1 - i * 0.04]} rotation={[0.3, 0, 0]}>
              <coneGeometry args={[0.025 - i * 0.003, 0.06, 4]} />
              <meshStandardMaterial color="#228B22" metalness={0.5} emissive="#32CD32" emissiveIntensity={0.2} />
            </mesh>
          ))}
          {/* Glowing dragon eyes (replace normal eyes) */}
          <mesh position={[-0.1, 0.05, 0.26]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshPhongMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0.1, 0.05, 0.26]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshPhongMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={1.5} />
          </mesh>
          {/* Slit pupils */}
          <mesh position={[-0.1, 0.05, 0.29]}>
            <boxGeometry args={[0.01, 0.06, 0.01]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[0.1, 0.05, 0.29]}>
            <boxGeometry args={[0.01, 0.06, 0.01]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      )}

      {/* Legend - Golden crown with diamonds */}
      {skinConfig.hat === 'legendCrown' && (
        <group position={[0, 0.35, 0]}>
          <mesh><cylinderGeometry args={[0.22, 0.24, 0.18, 8]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFA500" emissiveIntensity={0.6} /></mesh>
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const colors = ['#FF0000', '#0066FF', '#00FF00', '#FF00FF', '#00FFFF'];
            return (
              <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.2, 0.15, Math.sin((angle * Math.PI) / 180) * 0.2]}>
                <octahedronGeometry args={[0.04]} />
                <meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={1} />
              </mesh>
            );
          })}
          <mesh position={[0, 0.25, 0]}>
            <octahedronGeometry args={[0.06]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
          </mesh>
        </group>
      )}

      {/* ========== STANDARD ACCESSORIES ========== */}
      
      {skinConfig.accessory === 'spark' && (
        <group>
          {[0, 120, 240].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.4, 0, Math.sin((angle * Math.PI) / 180) * 0.4]}>
              <sphereGeometry args={[0.05, 8, 8]} /><meshPhongMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={1.5} transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.accessory === 'frost' && (
        <group>
          {[0, 90, 180, 270].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.35, 0, Math.sin((angle * Math.PI) / 180) * 0.35]}>
              <octahedronGeometry args={[0.06, 0]} /><meshPhongMaterial color="#FFFFFF" emissive="#B0E0E6" emissiveIntensity={0.9} transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.accessory === 'stars' && (
        <group>
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.4, Math.sin(i * 0.5) * 0.1, Math.sin((angle * Math.PI) / 180) * 0.4]}>
              <sphereGeometry args={[0.04, 5, 5]} /><meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.accessory === 'goldRings' && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.4, 0.03, 8, 32]} /><meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFA500" emissiveIntensity={0.5} /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.4, 0.03, 8, 32]} /><meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFA500" emissiveIntensity={0.5} /></mesh>
        </group>
      )}

      {skinConfig.accessory === 'shurikens' && (
        <group>
          {[0, 120, 240].map((angle, i) => (
            <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
              <mesh position={[0.45, 0, 0]} rotation={[0, 0, Date.now() * 0.001]}>
                {[0, 90, 180, 270].map((a, idx) => (
                  <mesh key={idx} rotation={[0, 0, (a * Math.PI) / 180]}>
                    <boxGeometry args={[0.02, 0.15, 0.02]} /><meshStandardMaterial color="#C0C0C0" metalness={0.9} />
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
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.32, 0, Math.sin((angle * Math.PI) / 180) * 0.32]}>
              <boxGeometry args={[0.03, 0.03, 0.03]} /><meshPhongMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      )}

      {skinConfig.accessory === 'ghostGlow' && (
        <group>
          {[0, 120, 240].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.4, Math.sin(i * 0.3) * 0.1, Math.sin((angle * Math.PI) / 180) * 0.4]}>
              <sphereGeometry args={[0.06, 16, 16]} /><meshPhongMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1.5} transparent opacity={0.5} />
            </mesh>
          ))}
        </group>
      )}

      {/* ========== PREMIUM ACCESSORIES ========== */}

      {/* Cleopatra - Gold jewelry & Egyptian collar */}
      {skinConfig.accessory === 'cleopatraJewels' && (
        <group>
          <mesh position={[0, -0.08, 0]}><torusGeometry args={[0.32, 0.05, 8, 32]} /><meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.05} emissive="#B8860B" emissiveIntensity={0.4} /></mesh>
          <mesh position={[0, -0.13, 0]}><torusGeometry args={[0.34, 0.03, 8, 32]} /><meshStandardMaterial color="#1a237e" metalness={0.6} roughness={0.3} /></mesh>
          {[0, 30, 60, -30, -60, 90, -90].map((angle, i) => {
            const colors = ['#00BCD4', '#D4AF37', '#4CAF50', '#E91E63', '#D4AF37', '#00BCD4', '#4CAF50'];
            return (
              <mesh key={i} position={[Math.sin((angle * Math.PI) / 180) * 0.34, -0.17, Math.cos((angle * Math.PI) / 180) * 0.34]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.6} />
              </mesh>
            );
          })}
          {/* Ankh */}
          <mesh position={[0.36, -0.05, 0.12]}><torusGeometry args={[0.03, 0.008, 8, 12]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} /></mesh>
          <mesh position={[0.36, -0.1, 0.12]}><boxGeometry args={[0.015, 0.08, 0.008]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} /></mesh>
          <mesh position={[0.36, -0.08, 0.12]}><boxGeometry args={[0.04, 0.015, 0.008]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} /></mesh>
          {/* Kohl eyeliner */}
          <mesh position={[-0.15, 0.04, 0.27]}><boxGeometry args={[0.06, 0.01, 0.005]} /><meshBasicMaterial color="#000000" /></mesh>
          <mesh position={[0.15, 0.04, 0.27]}><boxGeometry args={[0.06, 0.01, 0.005]} /><meshBasicMaterial color="#000000" /></mesh>
        </group>
      )}

      {/* Coco Chanel - Little black dress, pearls, CC logo, bag */}
      {skinConfig.accessory === 'cocoPearls' && (
        <group>
          <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.27, 0.28, 0.22, 16]} /><meshPhongMaterial color="#1a1a1a" /></mesh>
          <mesh position={[0, -0.23, 0]}><torusGeometry args={[0.28, 0.01, 8, 32]} /><meshPhongMaterial color="#222222" /></mesh>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <mesh key={`p1-${i}`} position={[Math.cos((angle * Math.PI) / 180) * 0.3, -0.02, Math.sin((angle * Math.PI) / 180) * 0.3]}>
              <sphereGeometry args={[0.022, 8, 8]} /><meshStandardMaterial color="#FFF8E7" metalness={0.4} roughness={0.3} />
            </mesh>
          ))}
          {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350].map((angle, i) => (
            <mesh key={`p2-${i}`} position={[Math.cos((angle * Math.PI) / 180) * 0.34, -0.07, Math.sin((angle * Math.PI) / 180) * 0.34]}>
              <sphereGeometry args={[0.018, 8, 8]} /><meshStandardMaterial color="#FFF0D0" metalness={0.3} roughness={0.4} />
            </mesh>
          ))}
          {/* CC logo */}
          <mesh position={[0.05, 0.02, 0.29]}><torusGeometry args={[0.02, 0.004, 8, 12]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFD700" emissiveIntensity={0.3} /></mesh>
          <mesh position={[-0.01, 0.02, 0.29]}><torusGeometry args={[0.02, 0.004, 8, 12]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFD700" emissiveIntensity={0.3} /></mesh>
          {/* Quilted bag */}
          <mesh position={[-0.35, -0.15, 0.1]}><boxGeometry args={[0.1, 0.08, 0.04]} /><meshPhongMaterial color="#1a1a1a" /></mesh>
          <mesh position={[-0.35, -0.08, 0.1]} rotation={[0, 0, 0.3]}><torusGeometry args={[0.05, 0.005, 6, 12, Math.PI]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} /></mesh>
        </group>
      )}

      {/* Phoenix - Fire wings and tail feathers */}
      {skinConfig.accessory === 'phoenixWings' && (
        <group>
          {/* Left wing */}
          <group position={[-0.25, 0, -0.1]} rotation={[0.2, 0.5, 0.3]}>
            <mesh><boxGeometry args={[0.35, 0.02, 0.25]} /><meshPhongMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={0.8} transparent opacity={0.8} /></mesh>
            <mesh position={[-0.12, 0.02, 0]}><boxGeometry args={[0.15, 0.02, 0.2]} /><meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.6} transparent opacity={0.7} /></mesh>
          </group>
          {/* Right wing */}
          <group position={[0.25, 0, -0.1]} rotation={[0.2, -0.5, -0.3]}>
            <mesh><boxGeometry args={[0.35, 0.02, 0.25]} /><meshPhongMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={0.8} transparent opacity={0.8} /></mesh>
            <mesh position={[0.12, 0.02, 0]}><boxGeometry args={[0.15, 0.02, 0.2]} /><meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.6} transparent opacity={0.7} /></mesh>
          </group>
          {/* Tail feathers */}
          {[-0.08, 0, 0.08].map((x, i) => (
            <mesh key={i} position={[x, -0.1, -0.35]} rotation={[0.5 + i * 0.1, 0, i * 0.1 - 0.1]}>
              <boxGeometry args={[0.04, 0.02, 0.3]} />
              <meshPhongMaterial color={i === 1 ? '#FFD700' : '#FF4500'} emissive={i === 1 ? '#FFD700' : '#FF4500'} emissiveIntensity={1} />
            </mesh>
          ))}
          {/* Fire aura */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.45, 0.015, 8, 32]} />
            <meshPhongMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={1.2} transparent opacity={0.3} />
          </mesh>
          {/* Ember particles */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={`ember-${i}`} position={[Math.cos((angle * Math.PI) / 180) * 0.42, Math.sin(Date.now() * 0.003 + i) * 0.15, Math.sin((angle * Math.PI) / 180) * 0.42]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshPhongMaterial color="#FF6600" emissive="#FF6600" emissiveIntensity={2} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {/* Galaxy - Cosmic orbit with planet ring and stardust */}
      {skinConfig.accessory === 'galaxyOrbit' && (
        <group>
          {/* Saturn-like ring */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.5, 0.04, 8, 32]} />
            <meshStandardMaterial color="#7B68EE" metalness={0.6} roughness={0.3} emissive="#7B68EE" emissiveIntensity={0.6} transparent opacity={0.5} />
          </mesh>
          {/* Inner ring */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.42, 0.02, 8, 32]} />
            <meshPhongMaterial color="#00CED1" emissive="#00CED1" emissiveIntensity={0.8} transparent opacity={0.4} />
          </mesh>
          {/* Orbiting planets */}
          <mesh position={[0.48, 0.1, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshPhongMaterial color="#FF6347" emissive="#FF4500" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-0.35, -0.2, 0.25]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshPhongMaterial color="#4169E1" emissive="#4169E1" emissiveIntensity={0.5} />
          </mesh>
          {/* Stardust trail */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.55, Math.sin(Date.now() * 0.002 + i) * 0.12, Math.sin((angle * Math.PI) / 180) * 0.55]}>
              <sphereGeometry args={[0.015, 6, 6]} />
              <meshPhongMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1.5} transparent opacity={0.5} />
            </mesh>
          ))}
          {/* Nebula cloak */}
          <mesh position={[0, -0.1, -0.2]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.4, 0.35, 0.02]} />
            <meshPhongMaterial color="#4B0082" emissive="#7B68EE" emissiveIntensity={0.4} transparent opacity={0.5} />
          </mesh>
        </group>
      )}

      {/* Samurai - Full O-Yoroi armor with katana */}
      {skinConfig.accessory === 'samuraiArmor' && (
        <group>
          {/* Do (chest armor) */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.22, 16]} />
            <meshStandardMaterial color="#8B0000" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Armor lacing */}
          {[-0.04, 0, 0.04].map((y, i) => (
            <mesh key={i} position={[0, y - 0.1, 0]}>
              <torusGeometry args={[0.31, 0.008, 8, 16]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} />
            </mesh>
          ))}
          {/* Sode (shoulder guards) */}
          <mesh position={[-0.32, 0.02, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.15, 0.12, 0.1]} />
            <meshStandardMaterial color="#8B0000" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.32, 0.02, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.15, 0.12, 0.1]} />
            <meshStandardMaterial color="#8B0000" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Kusazuri (skirt plates) */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={`kus-${i}`} position={[Math.cos((angle * Math.PI) / 180) * 0.3, -0.25, Math.sin((angle * Math.PI) / 180) * 0.3]}>
              <boxGeometry args={[0.08, 0.12, 0.02]} />
              <meshStandardMaterial color="#8B0000" metalness={0.6} roughness={0.3} />
            </mesh>
          ))}
          {/* Katana */}
          <mesh position={[-0.38, 0.05, -0.1]} rotation={[0.2, 0, 0.1]}>
            <boxGeometry args={[0.018, 0.55, 0.006]} />
            <meshStandardMaterial color="#E0E0E0" metalness={0.98} roughness={0.02} />
          </mesh>
          {/* Katana tsuba (guard) */}
          <mesh position={[-0.38, 0.26, -0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 0.008, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} />
          </mesh>
          {/* Katana tsuka (handle) */}
          <mesh position={[-0.38, -0.08, -0.1]} rotation={[0.2, 0, 0.1]}>
            <cylinderGeometry args={[0.015, 0.015, 0.18, 8]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
          {/* Mon (clan crest) on chest */}
          <mesh position={[0, -0.04, 0.32]}>
            <torusGeometry args={[0.03, 0.005, 8, 16]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} emissive="#FFA500" emissiveIntensity={0.3} />
          </mesh>
        </group>
      )}

      {/* Dragon - Scaled wings, fire breath, tail */}
      {skinConfig.accessory === 'dragonWings' && (
        <group>
          {/* Left bat wing */}
          <group position={[-0.2, 0.05, -0.15]} rotation={[0, 0.6, 0.2]}>
            <mesh><boxGeometry args={[0.4, 0.02, 0.3]} /><meshStandardMaterial color="#1a5a1a" metalness={0.4} roughness={0.5} emissive="#228B22" emissiveIntensity={0.2} /></mesh>
            {/* Wing bones */}
            <mesh position={[-0.15, 0.02, 0]}><boxGeometry args={[0.02, 0.02, 0.28]} /><meshStandardMaterial color="#2F4F2F" metalness={0.6} /></mesh>
            <mesh position={[-0.05, 0.02, 0]}><boxGeometry args={[0.02, 0.02, 0.25]} /><meshStandardMaterial color="#2F4F2F" metalness={0.6} /></mesh>
          </group>
          {/* Right bat wing */}
          <group position={[0.2, 0.05, -0.15]} rotation={[0, -0.6, -0.2]}>
            <mesh><boxGeometry args={[0.4, 0.02, 0.3]} /><meshStandardMaterial color="#1a5a1a" metalness={0.4} roughness={0.5} emissive="#228B22" emissiveIntensity={0.2} /></mesh>
            <mesh position={[0.15, 0.02, 0]}><boxGeometry args={[0.02, 0.02, 0.28]} /><meshStandardMaterial color="#2F4F2F" metalness={0.6} /></mesh>
            <mesh position={[0.05, 0.02, 0]}><boxGeometry args={[0.02, 0.02, 0.25]} /><meshStandardMaterial color="#2F4F2F" metalness={0.6} /></mesh>
          </group>
          {/* Tail */}
          <mesh position={[0, -0.15, -0.35]} rotation={[0.5, 0, 0]}>
            <coneGeometry args={[0.06, 0.35, 8]} />
            <meshStandardMaterial color="#228B22" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.22, -0.5]} rotation={[0.8, 0, 0]}>
            <coneGeometry args={[0.04, 0.15, 6]} />
            <meshStandardMaterial color="#32CD32" metalness={0.3} emissive="#32CD32" emissiveIntensity={0.3} />
          </mesh>
          {/* Tail spike */}
          <mesh position={[0, -0.25, -0.58]} rotation={[1, 0, 0]}>
            <coneGeometry args={[0.03, 0.1, 4]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Fire breath particles */}
          {[0, 1, 2].map((i) => (
            <mesh key={`fire-${i}`} position={[0, -0.08 + i * 0.02, 0.35 + i * 0.08]}>
              <sphereGeometry args={[0.04 - i * 0.01, 8, 8]} />
              <meshPhongMaterial color={i === 0 ? '#FF4500' : i === 1 ? '#FF6600' : '#FFD700'} emissive={i === 0 ? '#FF4500' : i === 1 ? '#FF6600' : '#FFD700'} emissiveIntensity={1.5} transparent opacity={0.7 - i * 0.15} />
            </mesh>
          ))}
          {/* Scale belly */}
          <mesh position={[0, -0.15, 0.2]}>
            <boxGeometry args={[0.15, 0.12, 0.01]} />
            <meshStandardMaterial color="#90EE90" metalness={0.3} roughness={0.5} />
          </mesh>
        </group>
      )}

      {/* Legend - Golden cape with orbiting gems, aura rings */}
      {skinConfig.accessory === 'legendCape' && (
        <group>
          {/* Grand flowing cape */}
          <mesh position={[0, -0.05, -0.25]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.65, 0.75, 0.02]} />
            <meshStandardMaterial color="#0033AA" metalness={0.6} roughness={0.2} emissive="#0044CC" emissiveIntensity={0.4} />
          </mesh>
          {/* Cape gold trim */}
          <mesh position={[0, 0.1, -0.24]}>
            <boxGeometry args={[0.65, 0.03, 0.025]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} emissive="#FFA500" emissiveIntensity={0.5} />
          </mesh>
          {/* Elegant gown */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 0.25, 16]} />
            <meshStandardMaterial color="#0033AA" metalness={0.4} roughness={0.4} emissive="#0044CC" emissiveIntensity={0.2} />
          </mesh>
          {/* Diamond brooch */}
          <mesh position={[0, 0.1, 0.28]}>
            <octahedronGeometry args={[0.04]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} emissive="#FFD700" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0, 0.1, 0.3]}>
            <octahedronGeometry args={[0.02]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.3} emissive="#FFFFFF" emissiveIntensity={2} />
          </mesh>
          {/* Orbiting gems */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const colors = ['#FF0000', '#00FF00', '#0066FF', '#FFD700', '#FF00FF', '#00FFFF', '#FF6600', '#7B68EE'];
            return (
              <mesh key={i} position={[
                Math.cos((angle * Math.PI) / 180) * 0.48,
                Math.sin(Date.now() * 0.002 + i) * 0.18,
                Math.sin((angle * Math.PI) / 180) * 0.48
              ]}>
                <octahedronGeometry args={[0.03]} />
                <meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={1.8} transparent opacity={0.7} />
              </mesh>
            );
          })}
          {/* Golden aura rings */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.008, 8, 32]} />
            <meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} transparent opacity={0.4} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 3, 0, Math.PI / 4]}>
            <torusGeometry args={[0.55, 0.006, 8, 32]} />
            <meshPhongMaterial color="#00BFFF" emissive="#00BFFF" emissiveIntensity={0.8} transparent opacity={0.3} />
          </mesh>
          {/* Star symbol floating above */}
          <mesh position={[0, 0.55, 0]}>
            <octahedronGeometry args={[0.06]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} emissive="#FFD700" emissiveIntensity={2} />
          </mesh>
        </group>
      )}
    </group>
  );
});

Ball.displayName = 'Ball';
