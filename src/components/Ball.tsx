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
  
  // Iconic Women
  cleopatra: { color: '#D4AF37', emissive: '#B8860B', emissiveIntensity: 0.5, hat: 'cleopatraCrown', accessory: 'cleopatraJewels' },
  frida: { color: '#CC3333', emissive: '#8B0000', emissiveIntensity: 0.3, hat: 'fridaFlowers', accessory: 'fridaDress' },
  amelia: { color: '#8B6914', emissive: '#6B4F10', emissiveIntensity: 0.3, hat: 'ameliaGoggles', accessory: 'ameliaJacket' },
  curie: { color: '#4A90D9', emissive: '#2060A9', emissiveIntensity: 0.5, hat: null, accessory: 'curieLabcoat' },
  florence: { color: '#F5F5F5', emissive: '#DDDDDD', emissiveIntensity: 0.3, hat: 'florenceCap', accessory: 'florenceApron' },
  rosa_w: { color: '#C4A35A', emissive: '#A08030', emissiveIntensity: 0.3, hat: 'rosaWHat', accessory: 'rosaWCoat' },
  harriet_w: { color: '#8B6914', emissive: '#6B4F10', emissiveIntensity: 0.3, hat: 'harrietWHeadwrap', accessory: 'harrietWShawl' },
  coco: { color: '#1a1a1a', emissive: '#333333', emissiveIntensity: 0.2, hat: 'cocoHat', accessory: 'cocoPearls' },
  malala: { color: '#E91E63', emissive: '#C2185B', emissiveIntensity: 0.4, hat: 'malalaScarf', accessory: 'malalaBook' },
  joan: { color: '#C0C0C0', emissive: '#A0A0A0', emissiveIntensity: 0.4, hat: 'joanHelmet', accessory: 'joanArmor' },
  queen: { color: '#4169E1', emissive: '#2040B0', emissiveIntensity: 0.4, hat: 'queenCrown', accessory: 'queenRobe' },
  wonder: { color: '#CC0000', emissive: '#990000', emissiveIntensity: 0.5, hat: 'wonderTiara', accessory: 'wonderArmor' },
  serena: { color: '#FF69B4', emissive: '#FF1493', emissiveIntensity: 0.4, hat: 'serenaHeadband', accessory: 'serenaOutfit' },
  legend_woman: { color: '#FFD700', emissive: '#FFA500', emissiveIntensity: 0.8, hat: 'legendCrown', accessory: 'legendCape' },
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

      {/* ========== ICONIC WOMEN HATS ========== */}

      {/* Cleopatra - Egyptian headdress with cobra */}
      {skinConfig.hat === 'cleopatraCrown' && (
        <group position={[0, 0.3, 0]}>
          {/* Nemes headdress */}
          <mesh>
            <cylinderGeometry args={[0.22, 0.26, 0.15, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Cobra uraeus on front */}
          <mesh position={[0, 0.15, 0.2]}>
            <coneGeometry args={[0.04, 0.15, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.5} />
          </mesh>
          {/* Side flaps */}
          <mesh position={[-0.2, -0.05, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.08, 0.2, 0.02]} />
            <meshStandardMaterial color="#1a237e" metalness={0.5} />
          </mesh>
          <mesh position={[0.2, -0.05, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.08, 0.2, 0.02]} />
            <meshStandardMaterial color="#1a237e" metalness={0.5} />
          </mesh>
          {/* Blue/gold stripes */}
          <mesh position={[0, 0.08, 0]}>
            <torusGeometry args={[0.23, 0.02, 8, 16]} />
            <meshStandardMaterial color="#1a237e" metalness={0.6} />
          </mesh>
        </group>
      )}

      {/* Frida Kahlo - Flower crown */}
      {skinConfig.hat === 'fridaFlowers' && (
        <group position={[0, 0.3, 0]}>
          {/* Flower ring */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const colors = ['#FF1744', '#E91E63', '#FF9800', '#FFEB3B', '#FF5722', '#F44336', '#E040FB', '#FF6D00'];
            return (
              <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.22, 0.05, Math.sin((angle * Math.PI) / 180) * 0.22]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.3} />
              </mesh>
            );
          })}
          {/* Leaves */}
          {[30, 150, 270].map((angle, i) => (
            <mesh key={`leaf-${i}`} position={[Math.cos((angle * Math.PI) / 180) * 0.25, 0, Math.sin((angle * Math.PI) / 180) * 0.25]}>
              <boxGeometry args={[0.04, 0.02, 0.08]} />
              <meshPhongMaterial color="#2E7D32" />
            </mesh>
          ))}
          {/* Unibrow detail */}
          <mesh position={[0, 0.1, 0.28]}>
            <boxGeometry args={[0.15, 0.015, 0.01]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
        </group>
      )}

      {/* Amelia Earhart - Aviator goggles on leather cap */}
      {skinConfig.hat === 'ameliaGoggles' && (
        <group position={[0, 0.28, 0]}>
          {/* Leather flying cap */}
          <mesh>
            <sphereGeometry args={[0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhongMaterial color="#8B4513" />
          </mesh>
          {/* Ear flaps */}
          <mesh position={[-0.22, -0.05, 0]}>
            <boxGeometry args={[0.08, 0.15, 0.06]} />
            <meshPhongMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0.22, -0.05, 0]}>
            <boxGeometry args={[0.08, 0.15, 0.06]} />
            <meshPhongMaterial color="#8B4513" />
          </mesh>
          {/* Goggle strap */}
          <mesh position={[0, 0.08, 0]}>
            <torusGeometry args={[0.23, 0.015, 8, 16]} />
            <meshPhongMaterial color="#333333" />
          </mesh>
          {/* Left goggle lens */}
          <mesh position={[-0.1, 0.08, 0.2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
            <meshStandardMaterial color="#88CCFF" metalness={0.5} roughness={0.2} />
          </mesh>
          {/* Right goggle lens */}
          <mesh position={[0.1, 0.08, 0.2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
            <meshStandardMaterial color="#88CCFF" metalness={0.5} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* Florence Nightingale - Nurse cap */}
      {skinConfig.hat === 'florenceCap' && (
        <group position={[0, 0.3, 0]}>
          {/* White nurse cap */}
          <mesh>
            <boxGeometry args={[0.3, 0.12, 0.15]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Red cross */}
          <mesh position={[0, 0.02, 0.08]}>
            <boxGeometry args={[0.04, 0.08, 0.01]} />
            <meshPhongMaterial color="#CC0000" />
          </mesh>
          <mesh position={[0, 0.02, 0.08]}>
            <boxGeometry args={[0.08, 0.04, 0.01]} />
            <meshPhongMaterial color="#CC0000" />
          </mesh>
        </group>
      )}

      {/* Rosa Parks - Elegant 1950s hat */}
      {skinConfig.hat === 'rosaWHat' && (
        <group position={[0, 0.3, 0]}>
          <mesh><cylinderGeometry args={[0.3, 0.3, 0.03, 32]} /><meshPhongMaterial color="#4a3828" /></mesh>
          <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.15, 0.18, 0.15, 16]} /><meshPhongMaterial color="#4a3828" /></mesh>
          <mesh position={[0, 0.03, 0]}><torusGeometry args={[0.17, 0.02, 8, 16]} /><meshPhongMaterial color="#C4A35A" emissive="#aa8833" emissiveIntensity={0.4} /></mesh>
          <mesh position={[0.15, 0.06, 0.08]}><sphereGeometry args={[0.03, 8, 8]} /><meshPhongMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} /></mesh>
        </group>
      )}

      {/* Harriet Tubman - Head wrap */}
      {skinConfig.hat === 'harrietWHeadwrap' && (
        <group position={[0, 0.28, 0]}>
          <mesh><sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhongMaterial color="#8B6914" /></mesh>
          <mesh position={[0.05, 0.15, 0.05]}><sphereGeometry args={[0.08, 8, 8]} /><meshPhongMaterial color="#7B5904" /></mesh>
          <mesh position={[-0.05, 0.12, 0.05]}><sphereGeometry args={[0.06, 8, 8]} /><meshPhongMaterial color="#7B5904" /></mesh>
        </group>
      )}

      {/* Coco Chanel - Elegant black hat with pearl */}
      {skinConfig.hat === 'cocoHat' && (
        <group position={[0, 0.3, 0]}>
          {/* Wide brim hat */}
          <mesh><cylinderGeometry args={[0.32, 0.32, 0.02, 32]} /><meshPhongMaterial color="#1a1a1a" /></mesh>
          {/* Hat body */}
          <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.14, 0.16, 0.15, 16]} /><meshPhongMaterial color="#1a1a1a" /></mesh>
          {/* Ribbon */}
          <mesh position={[0, 0.02, 0]}><torusGeometry args={[0.16, 0.015, 8, 16]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
          {/* Camellia flower */}
          <mesh position={[0.14, 0.04, 0.1]}><sphereGeometry args={[0.04, 8, 8]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
        </group>
      )}

      {/* Malala - Headscarf */}
      {skinConfig.hat === 'malalaScarf' && (
        <group position={[0, 0.25, 0]}>
          {/* Main scarf draped over head */}
          <mesh><sphereGeometry args={[0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} /><meshPhongMaterial color="#E91E63" /></mesh>
          {/* Scarf drape left */}
          <mesh position={[-0.15, -0.1, 0.15]} rotation={[0, 0.2, 0.3]}>
            <boxGeometry args={[0.12, 0.25, 0.02]} />
            <meshPhongMaterial color="#C2185B" />
          </mesh>
          {/* Scarf drape right */}
          <mesh position={[0.15, -0.1, 0.15]} rotation={[0, -0.2, -0.3]}>
            <boxGeometry args={[0.12, 0.25, 0.02]} />
            <meshPhongMaterial color="#C2185B" />
          </mesh>
          {/* Gold pattern detail */}
          <mesh position={[0, 0.15, 0]}><torusGeometry args={[0.22, 0.01, 8, 16]} /><meshStandardMaterial color="#FFD700" metalness={0.8} /></mesh>
        </group>
      )}

      {/* Joan of Arc - Knight helmet */}
      {skinConfig.hat === 'joanHelmet' && (
        <group position={[0, 0.3, 0]}>
          {/* Helmet dome */}
          <mesh><sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.2} /></mesh>
          {/* Visor */}
          <mesh position={[0, -0.02, 0.22]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.2, 0.1, 0.02]} />
            <meshStandardMaterial color="#A0A0A0" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Plume */}
          <mesh position={[0, 0.2, -0.05]}>
            <coneGeometry args={[0.04, 0.3, 8]} />
            <meshPhongMaterial color="#E91E63" emissive="#C2185B" emissiveIntensity={0.3} />
          </mesh>
          {/* Cross on forehead */}
          <mesh position={[0, 0.1, 0.25]}>
            <boxGeometry args={[0.02, 0.06, 0.01]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.1, 0.25]}>
            <boxGeometry args={[0.04, 0.02, 0.01]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* Queen Elizabeth - Royal crown */}
      {skinConfig.hat === 'queenCrown' && (
        <group position={[0, 0.35, 0]}>
          <mesh><cylinderGeometry args={[0.2, 0.22, 0.15, 8]} /><meshStandardMaterial color="#4169E1" metalness={0.3} roughness={0.5} /></mesh>
          {/* Gold crown band */}
          <mesh position={[0, 0.08, 0]}><torusGeometry args={[0.21, 0.025, 8, 16]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} /></mesh>
          {/* Crown points */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.2, 0.12, Math.sin((angle * Math.PI) / 180) * 0.2]}>
              <coneGeometry args={[0.03, 0.12, 4]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} />
            </mesh>
          ))}
          {/* Jewels */}
          <mesh position={[0, 0.08, 0.21]}><sphereGeometry args={[0.025, 8, 8]} /><meshPhongMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} /></mesh>
          <mesh position={[0.2, 0.08, 0]}><sphereGeometry args={[0.02, 8, 8]} /><meshPhongMaterial color="#0000FF" emissive="#0000FF" emissiveIntensity={0.5} /></mesh>
        </group>
      )}

      {/* Wonder Woman - Tiara */}
      {skinConfig.hat === 'wonderTiara' && (
        <group position={[0, 0.25, 0]}>
          {/* Gold tiara band */}
          <mesh><torusGeometry args={[0.28, 0.025, 8, 32, Math.PI]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFA500" emissiveIntensity={0.5} /></mesh>
          {/* Star centerpiece */}
          <mesh position={[0, 0.08, 0.25]}>
            <octahedronGeometry args={[0.05]} />
            <meshStandardMaterial color="#CC0000" metalness={0.8} emissive="#CC0000" emissiveIntensity={0.5} />
          </mesh>
          {/* Long flowing hair */}
          <mesh position={[0, -0.05, -0.2]}>
            <boxGeometry args={[0.35, 0.4, 0.05]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
        </group>
      )}

      {/* Serena Williams - Athletic headband */}
      {skinConfig.hat === 'serenaHeadband' && (
        <group position={[0, 0.22, 0]}>
          {/* Nike-style headband */}
          <mesh><torusGeometry args={[0.28, 0.03, 8, 32]} /><meshPhongMaterial color="#FF69B4" emissive="#FF1493" emissiveIntensity={0.3} /></mesh>
          {/* Hair bun */}
          <mesh position={[0, 0.15, -0.05]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
        </group>
      )}

      {/* Legend Woman - Golden crown with flowers */}
      {skinConfig.hat === 'legendCrown' && (
        <group position={[0, 0.35, 0]}>
          <mesh><cylinderGeometry args={[0.22, 0.24, 0.18, 8]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFA500" emissiveIntensity={0.6} /></mesh>
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const colors = ['#E91E63', '#9C27B0', '#FF5722', '#FF1744', '#F50057'];
            return (
              <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.2, 0.15, Math.sin((angle * Math.PI) / 180) * 0.2]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.6} />
              </mesh>
            );
          })}
          <mesh position={[0, 0.25, 0.2]}>
            <octahedronGeometry args={[0.05]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1.5} />
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

      {/* ========== ICONIC WOMEN ACCESSORIES ========== */}

      {/* Cleopatra - Gold jewelry and Egyptian collar */}
      {skinConfig.accessory === 'cleopatraJewels' && (
        <group>
          {/* Egyptian collar necklace */}
          <mesh position={[0, -0.1, 0]}>
            <torusGeometry args={[0.32, 0.04, 8, 32]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} emissive="#B8860B" emissiveIntensity={0.3} />
          </mesh>
          {/* Jeweled pendants */}
          {[0, 40, 80, -40, -80].map((angle, i) => {
            const colors = ['#00BCD4', '#D4AF37', '#4CAF50', '#D4AF37', '#E91E63'];
            return (
              <mesh key={i} position={[Math.sin((angle * Math.PI) / 180) * 0.32, -0.15, Math.cos((angle * Math.PI) / 180) * 0.32]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.5} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Frida Kahlo - Traditional Mexican dress */}
      {skinConfig.accessory === 'fridaDress' && (
        <group>
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.38, 0.25, 16]} />
            <meshPhongMaterial color="#CC3333" />
          </mesh>
          {/* Embroidered patterns */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.31, -0.1, Math.sin((angle * Math.PI) / 180) * 0.31]}>
              <boxGeometry args={[0.03, 0.04, 0.03]} />
              <meshPhongMaterial color={i % 2 === 0 ? '#FFEB3B' : '#4CAF50'} emissive={i % 2 === 0 ? '#FFEB3B' : '#4CAF50'} emissiveIntensity={0.3} />
            </mesh>
          ))}
          {/* Necklace */}
          <mesh position={[0, 0, 0.28]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* Amelia Earhart - Leather flying jacket */}
      {skinConfig.accessory === 'ameliaJacket' && (
        <group>
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshPhongMaterial color="#8B4513" />
          </mesh>
          {/* Jacket collar */}
          <mesh position={[-0.12, 0.03, 0.2]} rotation={[0.5, 0.3, 0]}>
            <boxGeometry args={[0.1, 0.08, 0.02]} />
            <meshPhongMaterial color="#A0522D" />
          </mesh>
          <mesh position={[0.12, 0.03, 0.2]} rotation={[0.5, -0.3, 0]}>
            <boxGeometry args={[0.1, 0.08, 0.02]} />
            <meshPhongMaterial color="#A0522D" />
          </mesh>
          {/* Scarf */}
          <mesh position={[0.12, -0.05, 0.25]} rotation={[0.2, -0.3, 0.5]}>
            <boxGeometry args={[0.06, 0.2, 0.01]} />
            <meshPhongMaterial color="#F5F5DC" />
          </mesh>
        </group>
      )}

      {/* Marie Curie - Lab coat with glowing vial */}
      {skinConfig.accessory === 'curieLabcoat' && (
        <group>
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.25, 16]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Lab coat lapels */}
          <mesh position={[-0.08, 0, 0.27]} rotation={[0, 0.2, 0.2]}>
            <boxGeometry args={[0.06, 0.1, 0.01]} />
            <meshPhongMaterial color="#F0F0F0" />
          </mesh>
          <mesh position={[0.08, 0, 0.27]} rotation={[0, -0.2, -0.2]}>
            <boxGeometry args={[0.06, 0.1, 0.01]} />
            <meshPhongMaterial color="#F0F0F0" />
          </mesh>
          {/* Glowing radioactive vial */}
          <mesh position={[0.35, -0.05, 0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
            <meshPhongMaterial color="#00E676" emissive="#00E676" emissiveIntensity={1.5} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.35, 0.03, 0.1]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshPhongMaterial color="#00E676" emissive="#00E676" emissiveIntensity={1} />
          </mesh>
        </group>
      )}

      {/* Florence Nightingale - Nurse apron with lamp */}
      {skinConfig.accessory === 'florenceApron' && (
        <group>
          {/* Dress */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.25, 16]} />
            <meshPhongMaterial color="#4a4a4a" />
          </mesh>
          {/* White apron */}
          <mesh position={[0, -0.1, 0.28]}>
            <boxGeometry args={[0.2, 0.22, 0.01]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Oil lamp */}
          <mesh position={[0.38, -0.05, 0.1]}>
            <cylinderGeometry args={[0.03, 0.04, 0.08, 8]} />
            <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.38, 0.03, 0.1]}>
            <coneGeometry args={[0.02, 0.06, 8]} />
            <meshPhongMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={1.5} />
          </mesh>
        </group>
      )}

      {/* Rosa Parks - Coat */}
      {skinConfig.accessory === 'rosaWCoat' && (
        <group>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.32, 0.35, 0.25, 16]} />
            <meshPhongMaterial color="#3a2818" />
          </mesh>
          <mesh position={[-0.15, 0.05, 0.2]} rotation={[0.5, 0.3, 0]}><boxGeometry args={[0.12, 0.1, 0.02]} /><meshPhongMaterial color="#3a2818" /></mesh>
          <mesh position={[0.15, 0.05, 0.2]} rotation={[0.5, -0.3, 0]}><boxGeometry args={[0.12, 0.1, 0.02]} /><meshPhongMaterial color="#3a2818" /></mesh>
          {[0, -0.06, -0.12].map((y, i) => (
            <mesh key={i} position={[0, y, 0.33]}><sphereGeometry args={[0.015, 8, 8]} /><meshStandardMaterial color="#C4A35A" metalness={0.8} roughness={0.2} /></mesh>
          ))}
        </group>
      )}

      {/* Harriet Tubman - Shawl */}
      {skinConfig.accessory === 'harrietWShawl' && (
        <group>
          <mesh position={[0, -0.05, -0.15]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.55, 0.35, 0.02]} /><meshPhongMaterial color="#5a4020" /></mesh>
          <mesh position={[-0.25, -0.15, 0]} rotation={[0, 0.3, 0.2]}><boxGeometry args={[0.15, 0.3, 0.02]} /><meshPhongMaterial color="#5a4020" /></mesh>
          <mesh position={[0.25, -0.15, 0]} rotation={[0, -0.3, -0.2]}><boxGeometry args={[0.15, 0.3, 0.02]} /><meshPhongMaterial color="#5a4020" /></mesh>
        </group>
      )}

      {/* Coco Chanel - Pearls and little black dress */}
      {skinConfig.accessory === 'cocoPearls' && (
        <group>
          {/* Little black dress */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.28, 0.3, 0.22, 16]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
          {/* Pearl necklace - double strand */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.3, -0.02, Math.sin((angle * Math.PI) / 180) * 0.3]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#FFF8E7" metalness={0.3} roughness={0.4} />
            </mesh>
          ))}
          {/* CC logo brooch */}
          <mesh position={[0, 0.02, 0.29]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>
      )}

      {/* Malala - Book */}
      {skinConfig.accessory === 'malalaBook' && (
        <group>
          {/* Simple outfit */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshPhongMaterial color="#E91E63" />
          </mesh>
          {/* Book held in front */}
          <mesh position={[0.3, -0.1, 0.15]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.12, 0.15, 0.03]} />
            <meshPhongMaterial color="#1565C0" />
          </mesh>
          {/* Book pages */}
          <mesh position={[0.3, -0.1, 0.135]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.1, 0.13, 0.02]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
        </group>
      )}

      {/* Joan of Arc - Armor */}
      {skinConfig.accessory === 'joanArmor' && (
        <group>
          {/* Chest plate */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.22, 16]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Cross on chest */}
          <mesh position={[0, -0.06, 0.31]}>
            <boxGeometry args={[0.02, 0.1, 0.01]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.04, 0.31]}>
            <boxGeometry args={[0.06, 0.02, 0.01]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} />
          </mesh>
          {/* Sword */}
          <mesh position={[-0.4, 0, -0.05]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.02, 0.5, 0.01]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[-0.4, 0.22, -0.05]}>
            <boxGeometry args={[0.08, 0.02, 0.02]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* Queen Elizabeth - Royal robe */}
      {skinConfig.accessory === 'queenRobe' && (
        <group>
          {/* Royal blue dress */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.38, 0.25, 16]} />
            <meshPhongMaterial color="#4169E1" />
          </mesh>
          {/* Ermine-trimmed robe */}
          <mesh position={[0, -0.05, -0.2]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.5, 0.35, 0.02]} />
            <meshPhongMaterial color="#8B0000" />
          </mesh>
          {/* White fur trim */}
          <mesh position={[0, 0.05, 0.25]}>
            <torusGeometry args={[0.3, 0.03, 8, 16, Math.PI]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Scepter */}
          <mesh position={[0.38, 0, 0.05]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.38, 0.22, 0.05]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFA500" emissiveIntensity={0.3} />
          </mesh>
        </group>
      )}

      {/* Wonder Woman - Amazonian armor */}
      {skinConfig.accessory === 'wonderArmor' && (
        <group>
          {/* Armored bustier */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshStandardMaterial color="#CC0000" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Gold eagle emblem */}
          <mesh position={[0, -0.02, 0.3]}>
            <boxGeometry args={[0.1, 0.03, 0.01]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFA500" emissiveIntensity={0.5} />
          </mesh>
          {/* Bracelets of submission */}
          <mesh position={[-0.35, -0.05, 0.1]}>
            <torusGeometry args={[0.06, 0.015, 8, 16]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.35, -0.05, 0.1]}>
            <torusGeometry args={[0.06, 0.015, 8, 16]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Lasso of truth */}
          <mesh position={[0.2, -0.2, -0.15]} rotation={[0.5, 0, 0.3]}>
            <torusGeometry args={[0.1, 0.01, 8, 16]} />
            <meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* Serena Williams - Tennis outfit */}
      {skinConfig.accessory === 'serenaOutfit' && (
        <group>
          {/* Athletic top */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.28, 0.3, 0.18, 16]} />
            <meshPhongMaterial color="#FF69B4" />
          </mesh>
          {/* Skirt */}
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.3, 0.38, 0.1, 16]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Tennis racket */}
          <mesh position={[0.4, 0.05, 0]} rotation={[0, 0, 0.5]}>
            <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
            <meshStandardMaterial color="#333333" metalness={0.5} />
          </mesh>
          <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, 0.5]}>
            <torusGeometry args={[0.08, 0.01, 8, 16]} />
            <meshStandardMaterial color="#333333" metalness={0.5} />
          </mesh>
        </group>
      )}

      {/* Legend Woman - Golden cape with flowers */}
      {skinConfig.accessory === 'legendCape' && (
        <group>
          <mesh position={[0, 0, -0.25]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.6, 0.7, 0.02]} />
            <meshStandardMaterial color="#9C27B0" metalness={0.5} roughness={0.3} emissive="#7B1FA2" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0.1, 0.25]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFD700" emissiveIntensity={1} />
          </mesh>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const colors = ['#E91E63', '#FF5722', '#9C27B0', '#F50057', '#FF4081', '#D500F9'];
            return (
              <mesh key={i} position={[
                Math.cos((angle * Math.PI) / 180) * 0.45,
                Math.sin(Date.now() * 0.002 + i) * 0.15,
                Math.sin((angle * Math.PI) / 180) * 0.45
              ]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={1.5} transparent opacity={0.6} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
});

Ball.displayName = 'Ball';