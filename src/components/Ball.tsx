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
  fire: { color: '#FF4500', emissive: '#FF6347', emissiveIntensity: 0.8, hat: 'flame', accessory: 'fireOrbit' },
  ice: { color: '#87CEEB', emissive: '#B0E0E6', emissiveIntensity: 0.7, hat: 'iceCrystal', accessory: 'frostShield' },
  ghost: { color: '#F0F8FF', emissive: '#FFFFFF', emissiveIntensity: 0.9, hat: 'ghostSheet', accessory: 'ghostTrail' },
  neon: { color: '#39FF14', emissive: '#00FF41', emissiveIntensity: 1.0, hat: 'neonVisor', accessory: 'neonRings' },
  pixel: { color: '#FF69B4', emissive: '#FF1493', emissiveIntensity: 0.6, hat: 'pixelCap', accessory: 'pixelTrail' },
  rainbow: { color: '#FF1493', emissive: '#9400D3', emissiveIntensity: 0.9, hat: 'rainbowCrown', accessory: 'rainbowArcs' },
  golden: { color: '#FFD700', emissive: '#FFA500', emissiveIntensity: 0.6, hat: 'kingCrown', accessory: 'goldRings' },
  ninja: { color: '#2C2C2C', emissive: '#FF0000', emissiveIntensity: 0.5, hat: 'ninjaHeadband', accessory: 'shurikens' },
  robot: { color: '#C0C0C0', emissive: '#00FF00', emissiveIntensity: 0.9, hat: 'antenna', accessory: 'circuits' },

  // Mid-tier — all unique
  lava: { color: '#FF3300', emissive: '#FF4400', emissiveIntensity: 0.9, hat: 'lavaRock', accessory: 'lavaDrips' },
  ocean: { color: '#006994', emissive: '#0099CC', emissiveIntensity: 0.7, hat: 'coralCrown', accessory: 'bubbles' },
  electric: { color: '#FFFF00', emissive: '#FFD700', emissiveIntensity: 1.0, hat: 'lightningBolt', accessory: 'sparkField' },
  crystal: { color: '#E0E8FF', emissive: '#AABBFF', emissiveIntensity: 0.8, hat: 'crystalCluster', accessory: 'prismOrbit' },
  shadow: { color: '#1a1a2e', emissive: '#4a0080', emissiveIntensity: 0.6, hat: 'shadowHood', accessory: 'darkMist' },
  candy: { color: '#FF69B4', emissive: '#FF1493', emissiveIntensity: 0.7, hat: 'candySwirl', accessory: 'candyOrbit' },
  toxic: { color: '#7FFF00', emissive: '#ADFF2F', emissiveIntensity: 1.0, hat: 'hazardSign', accessory: 'toxicBubbles' },
  sunset: { color: '#FF6347', emissive: '#FF4500', emissiveIntensity: 0.8, hat: 'sunVisor', accessory: 'sunRays' },
  arctic: { color: '#B0E0E6', emissive: '#E0FFFF', emissiveIntensity: 0.7, hat: 'arcticHelm', accessory: 'iceShards' },
  chrome: { color: '#C0C0C0', emissive: '#E8E8E8', emissiveIntensity: 0.5, hat: 'chromeDome', accessory: 'mirrorOrbs' },

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
      
      {/* Fire - Layered flame mohawk */}
      {skinConfig.hat === 'flame' && (
        <group position={[0, 0.35, 0]}>
          <mesh><coneGeometry args={[0.15, 0.35, 8]} /><meshPhongMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={1.2} /></mesh>
          <mesh position={[0, 0.18, 0]}><coneGeometry args={[0.08, 0.22, 8]} /><meshPhongMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={1.2} /></mesh>
          <mesh position={[0, 0.28, 0]}><coneGeometry args={[0.04, 0.12, 8]} /><meshPhongMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={1} /></mesh>
          {/* Side flame wisps */}
          <mesh position={[-0.1, 0.05, 0]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.04, 0.15, 6]} /><meshPhongMaterial color="#FF6600" emissive="#FF6600" emissiveIntensity={1} /></mesh>
          <mesh position={[0.1, 0.05, 0]} rotation={[0, 0, -0.5]}><coneGeometry args={[0.04, 0.15, 6]} /><meshPhongMaterial color="#FF6600" emissive="#FF6600" emissiveIntensity={1} /></mesh>
        </group>
      )}

      {/* Ice - Crystal formation */}
      {skinConfig.hat === 'iceCrystal' && (
        <group position={[0, 0.35, 0]}>
          <mesh><cylinderGeometry args={[0.02, 0.06, 0.25, 6]} /><meshStandardMaterial color="#B0E0E6" metalness={0.3} roughness={0.1} emissive="#87CEEB" emissiveIntensity={0.8} /></mesh>
          <mesh position={[-0.08, -0.03, 0.05]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.015, 0.04, 0.18, 6]} /><meshStandardMaterial color="#E0FFFF" metalness={0.3} roughness={0.1} emissive="#B0E0E6" emissiveIntensity={0.6} /></mesh>
          <mesh position={[0.07, -0.02, -0.04]} rotation={[0, 0, -0.25]}><cylinderGeometry args={[0.015, 0.04, 0.2, 6]} /><meshStandardMaterial color="#ADD8E6" metalness={0.3} roughness={0.1} emissive="#87CEEB" emissiveIntensity={0.6} /></mesh>
          <mesh position={[0, -0.04, 0.08]} rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.01, 0.03, 0.12, 6]} /><meshStandardMaterial color="#FFFFFF" metalness={0.2} roughness={0.1} emissive="#E0FFFF" emissiveIntensity={0.5} /></mesh>
        </group>
      )}

      {/* Ghost - Wispy sheet */}
      {skinConfig.hat === 'ghostSheet' && (
        <group position={[0, 0.35, 0]}>
          <mesh><coneGeometry args={[0.28, 0.45, 32]} /><meshPhongMaterial color="#F0F8FF" emissive="#FFFFFF" emissiveIntensity={0.6} transparent opacity={0.7} /></mesh>
          {/* Ghost eyes on the sheet */}
          <mesh position={[-0.08, 0.05, 0.2]}><sphereGeometry args={[0.03, 8, 8]} /><meshPhongMaterial color="#000000" emissive="#4400FF" emissiveIntensity={0.5} /></mesh>
          <mesh position={[0.08, 0.05, 0.2]}><sphereGeometry args={[0.03, 8, 8]} /><meshPhongMaterial color="#000000" emissive="#4400FF" emissiveIntensity={0.5} /></mesh>
        </group>
      )}

      {/* Neon - Glowing visor/glasses */}
      {skinConfig.hat === 'neonVisor' && (
        <group position={[0, 0.08, 0.22]}>
          <mesh><boxGeometry args={[0.3, 0.06, 0.04]} /><meshPhongMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={2} transparent opacity={0.8} /></mesh>
          <mesh position={[-0.17, 0, 0.01]}><boxGeometry args={[0.04, 0.04, 0.02]} /><meshPhongMaterial color="#222222" /></mesh>
          <mesh position={[0.17, 0, 0.01]}><boxGeometry args={[0.04, 0.04, 0.02]} /><meshPhongMaterial color="#222222" /></mesh>
        </group>
      )}

      {/* Pixel - Retro gaming cap */}
      {skinConfig.hat === 'pixelCap' && (
        <group position={[0, 0.32, 0]}>
          <mesh><boxGeometry args={[0.28, 0.12, 0.28]} /><meshPhongMaterial color="#FF1493" /></mesh>
          <mesh position={[0, -0.04, 0.18]}><boxGeometry args={[0.3, 0.04, 0.08]} /><meshPhongMaterial color="#FF69B4" /></mesh>
          {/* Pixel pattern on cap */}
          {[-0.08, 0, 0.08].map((x, i) => (
            <mesh key={i} position={[x, 0.065, 0.14]}><boxGeometry args={[0.05, 0.05, 0.01]} /><meshPhongMaterial color={i === 1 ? '#FFFFFF' : '#FF69B4'} /></mesh>
          ))}
        </group>
      )}

      {/* Rainbow - Sparkly tiara */}
      {skinConfig.hat === 'rainbowCrown' && (
        <group position={[0, 0.32, 0]}>
          <mesh><torusGeometry args={[0.22, 0.025, 8, 32, Math.PI]} /><meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} /></mesh>
          {['#FF0000', '#FF8800', '#FFFF00', '#00FF00', '#0088FF', '#8800FF', '#FF00FF'].map((col, i) => (
            <mesh key={i} position={[Math.cos((i * 25 + 10) * Math.PI / 180) * 0.22, Math.sin((i * 25 + 10) * Math.PI / 180) * 0.22 + 0.02, 0]}>
              <sphereGeometry args={[0.025, 8, 8]} /><meshPhongMaterial color={col} emissive={col} emissiveIntensity={1} />
            </mesh>
          ))}
        </group>
      )}

      {/* Golden - Royal king crown with jewels */}
      {skinConfig.hat === 'kingCrown' && (
        <group position={[0, 0.38, 0]}>
          <mesh><cylinderGeometry args={[0.2, 0.22, 0.18, 8]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFA500" emissiveIntensity={0.5} /></mesh>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.2, 0.14, Math.sin((angle * Math.PI) / 180) * 0.2]}>
              <sphereGeometry args={[0.03, 8, 8]} /><meshPhongMaterial color={i % 2 === 0 ? '#FF0000' : '#0055FF'} emissive={i % 2 === 0 ? '#FF0000' : '#0055FF'} emissiveIntensity={0.8} />
            </mesh>
          ))}
          {/* Cross on top */}
          <mesh position={[0, 0.18, 0]}><boxGeometry args={[0.08, 0.02, 0.02]} /><meshStandardMaterial color="#FFD700" metalness={0.95} /></mesh>
          <mesh position={[0, 0.18, 0]}><boxGeometry args={[0.02, 0.02, 0.08]} /><meshStandardMaterial color="#FFD700" metalness={0.95} /></mesh>
        </group>
      )}

      {/* Ninja - Headband with trailing cloth */}
      {skinConfig.hat === 'ninjaHeadband' && (
        <group position={[0, 0.2, 0]}>
          <mesh><torusGeometry args={[0.32, 0.03, 8, 32]} /><meshPhongMaterial color="#000000" /></mesh>
          {/* Metal plate */}
          <mesh position={[0, 0, 0.33]}><boxGeometry args={[0.1, 0.08, 0.015]} /><meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} /></mesh>
          {/* Trailing cloth */}
          <mesh position={[-0.08, -0.05, -0.35]} rotation={[0.4, 0.1, 0]}><boxGeometry args={[0.06, 0.03, 0.25]} /><meshPhongMaterial color="#FF0000" /></mesh>
          <mesh position={[0.08, -0.08, -0.38]} rotation={[0.5, -0.1, 0]}><boxGeometry args={[0.06, 0.03, 0.28]} /><meshPhongMaterial color="#FF0000" /></mesh>
        </group>
      )}

      {/* Robot - Antenna with radar dish */}
      {skinConfig.hat === 'antenna' && (
        <group position={[0, 0.35, 0]}>
          <mesh><cylinderGeometry args={[0.02, 0.02, 0.3, 8]} /><meshStandardMaterial color="#C0C0C0" metalness={0.9} /></mesh>
          <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.05, 16, 16]} /><meshPhongMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={1.5} /></mesh>
          {/* Small radar dish */}
          <mesh position={[0.12, 0.1, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.06, 0.02, 0.03, 8]} /><meshStandardMaterial color="#C0C0C0" metalness={0.8} /></mesh>
        </group>
      )}

      {/* ========== MID-TIER HATS ========== */}

      {/* Lava - Volcanic rock crown with magma cracks */}
      {skinConfig.hat === 'lavaRock' && (
        <group position={[0, 0.33, 0]}>
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.14, i * 0.03, Math.sin((angle * Math.PI) / 180) * 0.14]}>
              <dodecahedronGeometry args={[0.07 + i * 0.005]} />
              <meshStandardMaterial color="#3d1f00" roughness={0.9} emissive="#FF4400" emissiveIntensity={0.3} />
            </mesh>
          ))}
          {/* Magma glow between rocks */}
          <mesh position={[0, 0.02, 0]}><torusGeometry args={[0.12, 0.02, 6, 12]} /><meshPhongMaterial color="#FF4400" emissive="#FF6600" emissiveIntensity={2} transparent opacity={0.7} /></mesh>
        </group>
      )}

      {/* Ocean - Coral crown with seashell */}
      {skinConfig.hat === 'coralCrown' && (
        <group position={[0, 0.35, 0]}>
          <mesh><torusGeometry args={[0.2, 0.03, 8, 16]} /><meshStandardMaterial color="#FF6B6B" roughness={0.7} /></mesh>
          {/* Coral branches */}
          {[-0.1, 0, 0.1].map((x, i) => (
            <mesh key={i} position={[x, 0.08, 0]} rotation={[0, 0, (i - 1) * 0.3]}>
              <cylinderGeometry args={[0.008, 0.02, 0.15, 6]} />
              <meshStandardMaterial color={i === 1 ? '#FF4444' : '#FF8888'} roughness={0.6} />
            </mesh>
          ))}
          {/* Seashell */}
          <mesh position={[0.15, 0.02, 0.1]}><coneGeometry args={[0.04, 0.06, 12]} /><meshStandardMaterial color="#FFF0E0" metalness={0.3} roughness={0.4} /></mesh>
          {/* Starfish */}
          <mesh position={[-0.12, 0.06, 0.08]}><dodecahedronGeometry args={[0.03]} /><meshPhongMaterial color="#FFD700" emissive="#FF8800" emissiveIntensity={0.3} /></mesh>
        </group>
      )}

      {/* Electric - Lightning bolt */}
      {skinConfig.hat === 'lightningBolt' && (
        <group position={[0, 0.4, 0]}>
          {/* Main bolt */}
          <mesh position={[0, 0.1, 0.02]} rotation={[0.1, 0, 0.15]}>
            <boxGeometry args={[0.06, 0.15, 0.02]} />
            <meshPhongMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0.03, 0, 0.02]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.08, 0.12, 0.02]} />
            <meshPhongMaterial color="#FFFF00" emissive="#FFD700" emissiveIntensity={2} />
          </mesh>
          <mesh position={[-0.02, -0.08, 0.02]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.05, 0.1, 0.02]} />
            <meshPhongMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={1.5} />
          </mesh>
          {/* Electric sparks */}
          {[0, 120, 240].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.1, 0.15, Math.sin((angle * Math.PI) / 180) * 0.1]}>
              <sphereGeometry args={[0.02, 6, 6]} /><meshPhongMaterial color="#FFFFFF" emissive="#FFFF00" emissiveIntensity={3} />
            </mesh>
          ))}
        </group>
      )}

      {/* Crystal - Cluster of gems */}
      {skinConfig.hat === 'crystalCluster' && (
        <group position={[0, 0.35, 0]}>
          <mesh rotation={[0, 0, 0.1]}><cylinderGeometry args={[0.01, 0.05, 0.22, 6]} /><meshStandardMaterial color="#AABBFF" metalness={0.4} roughness={0.05} emissive="#8899FF" emissiveIntensity={0.8} /></mesh>
          <mesh position={[-0.07, -0.02, 0.03]} rotation={[0, 0.3, 0.25]}><cylinderGeometry args={[0.008, 0.04, 0.16, 6]} /><meshStandardMaterial color="#CCDDFF" metalness={0.4} roughness={0.05} emissive="#AABBFF" emissiveIntensity={0.6} /></mesh>
          <mesh position={[0.06, -0.03, -0.04]} rotation={[0.2, 0, -0.2]}><cylinderGeometry args={[0.008, 0.035, 0.18, 6]} /><meshStandardMaterial color="#DDEEFF" metalness={0.3} roughness={0.05} emissive="#BBCCFF" emissiveIntensity={0.6} /></mesh>
          <mesh position={[0.03, -0.01, 0.06]} rotation={[0.15, 0, 0.1]}><cylinderGeometry args={[0.006, 0.025, 0.1, 6]} /><meshStandardMaterial color="#EEEEFF" metalness={0.5} roughness={0.02} emissive="#CCDDFF" emissiveIntensity={0.7} /></mesh>
        </group>
      )}

      {/* Shadow - Dark hood */}
      {skinConfig.hat === 'shadowHood' && (
        <group position={[0, 0.25, -0.05]}>
          <mesh><coneGeometry args={[0.3, 0.35, 16]} /><meshPhongMaterial color="#0a0a15" emissive="#1a0030" emissiveIntensity={0.3} /></mesh>
          {/* Glowing purple eyes under hood */}
          <mesh position={[-0.08, -0.08, 0.22]}><sphereGeometry args={[0.025, 8, 8]} /><meshPhongMaterial color="#9900FF" emissive="#9900FF" emissiveIntensity={2.5} /></mesh>
          <mesh position={[0.08, -0.08, 0.22]}><sphereGeometry args={[0.025, 8, 8]} /><meshPhongMaterial color="#9900FF" emissive="#9900FF" emissiveIntensity={2.5} /></mesh>
        </group>
      )}

      {/* Candy - Swirl lollipop */}
      {skinConfig.hat === 'candySwirl' && (
        <group position={[0, 0.4, 0]}>
          {/* Stick */}
          <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.015, 0.015, 0.15, 8]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
          {/* Swirl disk */}
          <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.12, 0.12, 0.03, 16]} /><meshPhongMaterial color="#FF69B4" /></mesh>
          {/* Swirl lines */}
          <mesh position={[0, 0.095, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.06, 0.012, 6, 16]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
          <mesh position={[0, 0.095, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.01, 6, 16]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
        </group>
      )}

      {/* Toxic - Hazard warning sign */}
      {skinConfig.hat === 'hazardSign' && (
        <group position={[0, 0.4, 0]}>
          {/* Triangle sign */}
          <mesh rotation={[0, 0, 0]}><coneGeometry args={[0.12, 0.02, 3]} /><meshPhongMaterial color="#FFFF00" /></mesh>
          <mesh position={[0, 0.02, 0]}><coneGeometry args={[0.1, 0.02, 3]} /><meshPhongMaterial color="#1a1a1a" /></mesh>
          {/* Radioactive symbol center */}
          <mesh position={[0, 0.04, 0.01]}><sphereGeometry args={[0.02, 8, 8]} /><meshPhongMaterial color="#7FFF00" emissive="#7FFF00" emissiveIntensity={2} /></mesh>
          {/* Gas mask tubes */}
          <mesh position={[-0.12, -0.15, 0.15]}><cylinderGeometry args={[0.02, 0.02, 0.1, 8]} /><meshPhongMaterial color="#333333" /></mesh>
          <mesh position={[0.12, -0.15, 0.15]}><cylinderGeometry args={[0.02, 0.02, 0.1, 8]} /><meshPhongMaterial color="#333333" /></mesh>
        </group>
      )}

      {/* Sunset - Sun visor with warm glow */}
      {skinConfig.hat === 'sunVisor' && (
        <group position={[0, 0.3, 0]}>
          {/* Visor brim */}
          <mesh position={[0, 0, 0.15]} rotation={[-0.4, 0, 0]}><boxGeometry args={[0.35, 0.02, 0.15]} /><meshPhongMaterial color="#FF6347" /></mesh>
          {/* Headband */}
          <mesh><torusGeometry args={[0.25, 0.02, 8, 16]} /><meshPhongMaterial color="#FF4500" /></mesh>
          {/* Mini sun */}
          <mesh position={[0, 0.12, 0.15]}><sphereGeometry args={[0.05, 12, 12]} /><meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} /></mesh>
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <mesh key={i} position={[Math.cos((a * Math.PI) / 180) * 0.09 + 0, 0.12 + Math.sin((a * Math.PI) / 180) * 0.09, 0.15]}>
              <boxGeometry args={[0.02, 0.005, 0.005]} /><meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1.5} />
            </mesh>
          ))}
        </group>
      )}

      {/* Arctic - Fur-lined helmet */}
      {skinConfig.hat === 'arcticHelm' && (
        <group position={[0, 0.3, 0]}>
          <mesh><sphereGeometry args={[0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhongMaterial color="#4682B4" /></mesh>
          {/* Fur rim */}
          <mesh position={[0, -0.02, 0]}><torusGeometry args={[0.24, 0.04, 8, 16]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
          {/* Ear flaps */}
          <mesh position={[-0.22, -0.1, 0]}><boxGeometry args={[0.08, 0.15, 0.06]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
          <mesh position={[0.22, -0.1, 0]}><boxGeometry args={[0.08, 0.15, 0.06]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
          {/* Goggles on top */}
          <mesh position={[0, 0.06, 0.18]}><torusGeometry args={[0.04, 0.015, 8, 12]} /><meshPhongMaterial color="#FF8800" emissive="#FF6600" emissiveIntensity={0.3} /></mesh>
        </group>
      )}

      {/* Chrome - Reflective dome helmet */}
      {skinConfig.hat === 'chromeDome' && (
        <group position={[0, 0.3, 0]}>
          <mesh><sphereGeometry args={[0.26, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#E8E8E8" metalness={0.98} roughness={0.02} /></mesh>
          {/* Visor slit */}
          <mesh position={[0, -0.02, 0.24]}><boxGeometry args={[0.2, 0.04, 0.02]} /><meshPhongMaterial color="#111111" emissive="#00AAFF" emissiveIntensity={0.5} /></mesh>
          {/* Chrome strip */}
          <mesh position={[0, 0.08, 0]}><torusGeometry args={[0.2, 0.01, 8, 16, Math.PI]} /><meshStandardMaterial color="#FFFFFF" metalness={0.99} roughness={0.01} /></mesh>
        </group>
      )}

      {/* ========== PREMIUM HATS ========== */}

      {/* Cleopatra */}
      {skinConfig.hat === 'cleopatraCrown' && (
        <group position={[0, 0.3, 0]}>
          <mesh><cylinderGeometry args={[0.22, 0.26, 0.15, 8]} /><meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0, 0.15, 0.2]}><coneGeometry args={[0.04, 0.15, 8]} /><meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.5} /></mesh>
          <mesh position={[-0.2, -0.05, 0]} rotation={[0, 0, 0.3]}><boxGeometry args={[0.08, 0.2, 0.02]} /><meshStandardMaterial color="#1a237e" metalness={0.5} /></mesh>
          <mesh position={[0.2, -0.05, 0]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.08, 0.2, 0.02]} /><meshStandardMaterial color="#1a237e" metalness={0.5} /></mesh>
        </group>
      )}

      {/* Coco Chanel */}
      {skinConfig.hat === 'cocoHat' && (
        <group position={[0, 0.3, 0]}>
          <mesh><cylinderGeometry args={[0.32, 0.32, 0.02, 32]} /><meshPhongMaterial color="#1a1a1a" /></mesh>
          <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.14, 0.16, 0.15, 16]} /><meshPhongMaterial color="#1a1a1a" /></mesh>
          <mesh position={[0, 0.02, 0]}><torusGeometry args={[0.16, 0.015, 8, 16]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
          <mesh position={[0.14, 0.04, 0.1]}><sphereGeometry args={[0.04, 8, 8]} /><meshPhongMaterial color="#FFFFFF" /></mesh>
        </group>
      )}

      {/* Phoenix */}
      {skinConfig.hat === 'phoenixCrest' && (
        <group position={[0, 0.3, 0]}>
          <mesh position={[0, 0.15, 0]}><coneGeometry args={[0.12, 0.4, 8]} /><meshPhongMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={1.5} /></mesh>
          <mesh position={[0, 0.25, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1.5} /></mesh>
          <mesh position={[0, 0.35, 0]}><coneGeometry args={[0.04, 0.15, 8]} /><meshPhongMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1} /></mesh>
          <mesh position={[-0.15, 0.1, 0]} rotation={[0, 0, 0.4]}><coneGeometry args={[0.06, 0.2, 6]} /><meshPhongMaterial color="#FF6600" emissive="#FF6600" emissiveIntensity={1.2} /></mesh>
          <mesh position={[0.15, 0.1, 0]} rotation={[0, 0, -0.4]}><coneGeometry args={[0.06, 0.2, 6]} /><meshPhongMaterial color="#FF6600" emissive="#FF6600" emissiveIntensity={1.2} /></mesh>
        </group>
      )}

      {/* Galaxy */}
      {skinConfig.hat === 'galaxyHalo' && (
        <group position={[0, 0.35, 0]}>
          <mesh rotation={[Math.PI / 6, 0, 0]}><torusGeometry args={[0.3, 0.04, 16, 32]} /><meshPhongMaterial color="#7B68EE" emissive="#7B68EE" emissiveIntensity={1} transparent opacity={0.7} /></mesh>
          <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}><torusGeometry args={[0.28, 0.02, 8, 32]} /><meshPhongMaterial color="#00CED1" emissive="#00CED1" emissiveIntensity={0.8} transparent opacity={0.5} /></mesh>
          <mesh position={[0, 0.1, 0]}><octahedronGeometry args={[0.06]} /><meshPhongMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} /></mesh>
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const colors = ['#FF69B4', '#00BFFF', '#FFD700', '#7B68EE', '#00FF7F'];
            return (
              <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.3, Math.sin(i * 0.7) * 0.08, Math.sin((angle * Math.PI) / 180) * 0.3]}>
                <octahedronGeometry args={[0.025]} /><meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={1.5} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Samurai */}
      {skinConfig.hat === 'samuraiHelmet' && (
        <group position={[0, 0.28, 0]}>
          <mesh><sphereGeometry args={[0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#8B0000" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0, 0.18, 0.15]} rotation={[0.3, 0, 0]}><torusGeometry args={[0.1, 0.015, 8, 16, Math.PI]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFA500" emissiveIntensity={0.5} /></mesh>
          {[-0.15, -0.1, -0.05].map((y, i) => (
            <mesh key={i} position={[0, y, -0.12]} rotation={[-0.3 - i * 0.1, 0, 0]}><boxGeometry args={[0.4 + i * 0.04, 0.04, 0.02]} /><meshStandardMaterial color="#8B0000" metalness={0.7} roughness={0.3} /></mesh>
          ))}
          <mesh position={[0, -0.08, 0.22]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.2, 0.08, 0.02]} /><meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} /></mesh>
        </group>
      )}

      {/* Dragon */}
      {skinConfig.hat === 'dragonHorns' && (
        <group position={[0, 0.3, 0]}>
          <mesh position={[-0.15, 0.1, 0]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.05, 0.3, 8]} /><meshStandardMaterial color="#2F4F2F" metalness={0.6} roughness={0.3} /></mesh>
          <mesh position={[-0.22, 0.22, 0]} rotation={[0, 0, 0.8]}><coneGeometry args={[0.03, 0.15, 6]} /><meshStandardMaterial color="#3B5B3B" metalness={0.5} roughness={0.3} /></mesh>
          <mesh position={[0.15, 0.1, 0]} rotation={[0, 0, -0.5]}><coneGeometry args={[0.05, 0.3, 8]} /><meshStandardMaterial color="#2F4F2F" metalness={0.6} roughness={0.3} /></mesh>
          <mesh position={[0.22, 0.22, 0]} rotation={[0, 0, -0.8]}><coneGeometry args={[0.03, 0.15, 6]} /><meshStandardMaterial color="#3B5B3B" metalness={0.5} roughness={0.3} /></mesh>
          {[0, 0.06, 0.12, 0.18].map((y, i) => (
            <mesh key={i} position={[0, 0.02 + y, -0.1 - i * 0.04]} rotation={[0.3, 0, 0]}><coneGeometry args={[0.025 - i * 0.003, 0.06, 4]} /><meshStandardMaterial color="#228B22" metalness={0.5} emissive="#32CD32" emissiveIntensity={0.2} /></mesh>
          ))}
          {/* Dragon glowing eyes */}
          <mesh position={[-0.1, 0.05, 0.26]}><sphereGeometry args={[0.045, 16, 16]} /><meshPhongMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={1.5} /></mesh>
          <mesh position={[0.1, 0.05, 0.26]}><sphereGeometry args={[0.045, 16, 16]} /><meshPhongMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={1.5} /></mesh>
          <mesh position={[-0.1, 0.05, 0.29]}><boxGeometry args={[0.01, 0.06, 0.01]} /><meshBasicMaterial color="#000000" /></mesh>
          <mesh position={[0.1, 0.05, 0.29]}><boxGeometry args={[0.01, 0.06, 0.01]} /><meshBasicMaterial color="#000000" /></mesh>
        </group>
      )}

      {/* Legend - Diamond-studded crown */}
      {skinConfig.hat === 'legendCrown' && (
        <group position={[0, 0.35, 0]}>
          <mesh><cylinderGeometry args={[0.22, 0.24, 0.18, 8]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFA500" emissiveIntensity={0.6} /></mesh>
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const colors = ['#FF0000', '#0066FF', '#00FF00', '#FF00FF', '#00FFFF'];
            return (
              <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.2, 0.15, Math.sin((angle * Math.PI) / 180) * 0.2]}>
                <octahedronGeometry args={[0.04]} /><meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={1} />
              </mesh>
            );
          })}
          <mesh position={[0, 0.25, 0]}><octahedronGeometry args={[0.06]} /><meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} /></mesh>
        </group>
      )}

      {/* ========== STANDARD ACCESSORIES ========== */}

      {/* Fire - Orbiting fire particles */}
      {skinConfig.accessory === 'fireOrbit' && (
        <group>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.42, Math.sin(i * 0.8) * 0.1, Math.sin((angle * Math.PI) / 180) * 0.42]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshPhongMaterial color={i % 2 === 0 ? '#FF4500' : '#FFA500'} emissive={i % 2 === 0 ? '#FF4500' : '#FFA500'} emissiveIntensity={1.8} transparent opacity={0.8} />
            </mesh>
          ))}
          {/* Fire trail ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.42, 0.01, 8, 32]} /><meshPhongMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={1} transparent opacity={0.3} /></mesh>
        </group>
      )}

      {/* Ice - Frost shield */}
      {skinConfig.accessory === 'frostShield' && (
        <group>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.38, 0, Math.sin((angle * Math.PI) / 180) * 0.38]}>
              <octahedronGeometry args={[0.04]} />
              <meshStandardMaterial color="#E0FFFF" metalness={0.3} roughness={0.1} emissive="#B0E0E6" emissiveIntensity={0.8} transparent opacity={0.7} />
            </mesh>
          ))}
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.38, 0.015, 8, 32]} /><meshPhongMaterial color="#B0E0E6" emissive="#B0E0E6" emissiveIntensity={0.6} transparent opacity={0.4} /></mesh>
        </group>
      )}

      {/* Ghost - Ghostly trailing wisps */}
      {skinConfig.accessory === 'ghostTrail' && (
        <group>
          {[0, 90, 180, 270].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.4, -0.1 - i * 0.05, Math.sin((angle * Math.PI) / 180) * 0.4]}>
              <sphereGeometry args={[0.06 - i * 0.01, 12, 12]} />
              <meshPhongMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1.2} transparent opacity={0.4 - i * 0.08} />
            </mesh>
          ))}
          {/* Spectral aura */}
          <mesh><sphereGeometry args={[0.4, 16, 16]} /><meshPhongMaterial color="#F0F8FF" emissive="#FFFFFF" emissiveIntensity={0.5} transparent opacity={0.12} /></mesh>
        </group>
      )}

      {/* Neon - Double glowing rings */}
      {skinConfig.accessory === 'neonRings' && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.38, 0.02, 16, 32]} /><meshPhongMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={2.5} transparent opacity={0.8} /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.38, 0.015, 16, 32]} /><meshPhongMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={2} transparent opacity={0.6} /></mesh>
          <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}><torusGeometry args={[0.42, 0.008, 8, 32]} /><meshPhongMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={1.5} transparent opacity={0.3} /></mesh>
        </group>
      )}

      {/* Pixel - Orbiting pixel cubes */}
      {skinConfig.accessory === 'pixelTrail' && (
        <group>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const colors = ['#FF1493', '#FF69B4', '#FF00FF', '#FF1493', '#FF69B4', '#FF00FF', '#FF1493', '#FF69B4'];
            return (
              <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.38, (i % 3) * 0.06 - 0.06, Math.sin((angle * Math.PI) / 180) * 0.38]}>
                <boxGeometry args={[0.05, 0.05, 0.05]} />
                <meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.8} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Rainbow - Colorful arcs */}
      {skinConfig.accessory === 'rainbowArcs' && (
        <group>
          {['#FF0000', '#FF8800', '#FFFF00', '#00FF00', '#0088FF', '#8800FF'].map((col, i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}>
              <torusGeometry args={[0.38 + i * 0.02, 0.008, 8, 32, Math.PI / 2]} />
              <meshPhongMaterial color={col} emissive={col} emissiveIntensity={1.2} transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {/* Golden - Royal gold rings */}
      {skinConfig.accessory === 'goldRings' && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.4, 0.03, 8, 32]} /><meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFA500" emissiveIntensity={0.5} /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.4, 0.03, 8, 32]} /><meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFA500" emissiveIntensity={0.5} /></mesh>
        </group>
      )}

      {/* Ninja - Shurikens */}
      {skinConfig.accessory === 'shurikens' && (
        <group>
          {[0, 120, 240].map((angle, i) => (
            <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
              <mesh position={[0.45, 0, 0]}>
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

      {/* Robot - Circuit nodes */}
      {skinConfig.accessory === 'circuits' && (
        <group>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <group key={i}>
              <mesh position={[Math.cos((angle * Math.PI) / 180) * 0.35, 0, Math.sin((angle * Math.PI) / 180) * 0.35]}>
                <boxGeometry args={[0.04, 0.04, 0.04]} /><meshPhongMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={1.2} />
              </mesh>
              {/* Connecting wires */}
              <mesh position={[Math.cos((angle * Math.PI) / 180) * 0.33, 0, Math.sin((angle * Math.PI) / 180) * 0.33]} rotation={[0, (angle * Math.PI) / 180, 0]}>
                <boxGeometry args={[0.12, 0.008, 0.008]} /><meshPhongMaterial color="#00AA00" emissive="#00AA00" emissiveIntensity={0.6} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* ========== MID-TIER ACCESSORIES ========== */}

      {/* Lava - Dripping magma blobs */}
      {skinConfig.accessory === 'lavaDrips' && (
        <group>
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <group key={i}>
              <mesh position={[Math.cos((angle * Math.PI) / 180) * 0.35, -0.15 - i * 0.03, Math.sin((angle * Math.PI) / 180) * 0.35]}>
                <sphereGeometry args={[0.04, 8, 8]} /><meshPhongMaterial color="#FF3300" emissive="#FF6600" emissiveIntensity={2} transparent opacity={0.8} />
              </mesh>
              {/* Drip trail */}
              <mesh position={[Math.cos((angle * Math.PI) / 180) * 0.34, -0.05, Math.sin((angle * Math.PI) / 180) * 0.34]}>
                <cylinderGeometry args={[0.015, 0.025, 0.1, 6]} /><meshPhongMaterial color="#FF4400" emissive="#FF4400" emissiveIntensity={1.5} transparent opacity={0.6} />
              </mesh>
            </group>
          ))}
          {/* Heat distortion ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.4, 0.02, 8, 32]} /><meshPhongMaterial color="#FF4400" emissive="#FF6600" emissiveIntensity={1} transparent opacity={0.2} /></mesh>
        </group>
      )}

      {/* Ocean - Floating bubbles */}
      {skinConfig.accessory === 'bubbles' && (
        <group>
          {[0, 50, 100, 150, 200, 250, 300, 350].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * (0.35 + i * 0.015), 0.1 + Math.sin(i * 1.2) * 0.15, Math.sin((angle * Math.PI) / 180) * (0.35 + i * 0.015)]}>
              <sphereGeometry args={[0.025 + (i % 3) * 0.01, 12, 12]} />
              <meshPhongMaterial color="#00BFFF" emissive="#0099CC" emissiveIntensity={0.5} transparent opacity={0.4} />
            </mesh>
          ))}
          {/* Water swirl */}
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.35, 0.015, 8, 32]} /><meshPhongMaterial color="#006994" emissive="#0099CC" emissiveIntensity={0.5} transparent opacity={0.3} /></mesh>
        </group>
      )}

      {/* Electric - Spark field */}
      {skinConfig.accessory === 'sparkField' && (
        <group>
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.42, Math.sin(i * 0.9) * 0.12, Math.sin((angle * Math.PI) / 180) * 0.42]}>
              <boxGeometry args={[0.015, 0.08 + (i % 3) * 0.03, 0.015]} />
              <meshPhongMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={3} transparent opacity={0.8} />
            </mesh>
          ))}
          {/* Tesla coil ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.42, 0.008, 8, 32]} /><meshPhongMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={2} transparent opacity={0.3} /></mesh>
        </group>
      )}

      {/* Crystal - Orbiting prisms */}
      {skinConfig.accessory === 'prismOrbit' && (
        <group>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const colors = ['#AABBFF', '#CCDDFF', '#DDEEFF', '#BBAAFF', '#AACCFF', '#DDBBFF'];
            return (
              <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.4, Math.sin(i * 0.6) * 0.08, Math.sin((angle * Math.PI) / 180) * 0.4]} rotation={[i * 0.5, i * 0.3, 0]}>
                <octahedronGeometry args={[0.035]} />
                <meshStandardMaterial color={colors[i]} metalness={0.5} roughness={0.02} emissive={colors[i]} emissiveIntensity={0.8} transparent opacity={0.8} />
              </mesh>
            );
          })}
          {/* Light refraction ring */}
          <mesh rotation={[Math.PI / 3, 0, 0]}><torusGeometry args={[0.4, 0.01, 8, 32]} /><meshPhongMaterial color="#FFFFFF" emissive="#AABBFF" emissiveIntensity={0.8} transparent opacity={0.3} /></mesh>
        </group>
      )}

      {/* Shadow - Dark mist tendrils */}
      {skinConfig.accessory === 'darkMist' && (
        <group>
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.38, -0.1 + Math.sin(i * 0.5) * 0.1, Math.sin((angle * Math.PI) / 180) * 0.38]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshPhongMaterial color="#0a0015" emissive="#4a0080" emissiveIntensity={0.8} transparent opacity={0.5} />
            </mesh>
          ))}
          {/* Shadow aura */}
          <mesh><sphereGeometry args={[0.42, 16, 16]} /><meshPhongMaterial color="#0a0015" emissive="#1a0030" emissiveIntensity={0.5} transparent opacity={0.15} /></mesh>
          {/* Dark wisps */}
          {[30, 150, 270].map((angle, i) => (
            <mesh key={`w-${i}`} position={[Math.cos((angle * Math.PI) / 180) * 0.32, -0.2, Math.sin((angle * Math.PI) / 180) * 0.32]}>
              <coneGeometry args={[0.03, 0.15, 6]} /><meshPhongMaterial color="#1a002e" emissive="#4a0080" emissiveIntensity={0.5} transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      )}

      {/* Candy - Orbiting candy pieces */}
      {skinConfig.accessory === 'candyOrbit' && (
        <group>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const colors = ['#FF69B4', '#FF1493', '#FF00FF', '#FF4488', '#FF69B4', '#FF1493'];
            const shapes = ['sphere', 'box', 'sphere', 'box', 'sphere', 'box'];
            return (
              <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.4, Math.sin(i * 0.7) * 0.08, Math.sin((angle * Math.PI) / 180) * 0.4]}>
                {shapes[i] === 'sphere' 
                  ? <sphereGeometry args={[0.035, 8, 8]} />
                  : <boxGeometry args={[0.05, 0.05, 0.05]} />
                }
                <meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.6} />
              </mesh>
            );
          })}
          {/* Candy wrapper trail */}
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.4, 0.012, 8, 32]} /><meshPhongMaterial color="#FF69B4" emissive="#FF1493" emissiveIntensity={0.5} transparent opacity={0.3} /></mesh>
        </group>
      )}

      {/* Toxic - Bubbling toxic waste */}
      {skinConfig.accessory === 'toxicBubbles' && (
        <group>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.38, 0.05 + Math.sin(i * 1.5) * 0.15, Math.sin((angle * Math.PI) / 180) * 0.38]}>
              <sphereGeometry args={[0.03 + (i % 3) * 0.008, 8, 8]} />
              <meshPhongMaterial color="#7FFF00" emissive="#ADFF2F" emissiveIntensity={2} transparent opacity={0.6} />
            </mesh>
          ))}
          {/* Toxic puddle */}
          <mesh position={[0, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.35, 16]} /><meshPhongMaterial color="#7FFF00" emissive="#7FFF00" emissiveIntensity={1} transparent opacity={0.2} /></mesh>
        </group>
      )}

      {/* Sunset - Sun ray beams */}
      {skinConfig.accessory === 'sunRays' && (
        <group>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.42, 0, Math.sin((angle * Math.PI) / 180) * 0.42]} rotation={[0, (angle * Math.PI) / 180, 0]}>
              <boxGeometry args={[0.02, 0.06, 0.15]} />
              <meshPhongMaterial color={i % 2 === 0 ? '#FF6347' : '#FFD700'} emissive={i % 2 === 0 ? '#FF6347' : '#FFD700'} emissiveIntensity={1.2} transparent opacity={0.6} />
            </mesh>
          ))}
          {/* Warm glow */}
          <mesh><sphereGeometry args={[0.42, 16, 16]} /><meshPhongMaterial color="#FF6347" emissive="#FF4500" emissiveIntensity={0.3} transparent opacity={0.1} /></mesh>
        </group>
      )}

      {/* Arctic - Floating ice shards */}
      {skinConfig.accessory === 'iceShards' && (
        <group>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.4, Math.sin(i * 0.8) * 0.1, Math.sin((angle * Math.PI) / 180) * 0.4]} rotation={[i * 0.4, i * 0.3, i * 0.2]}>
              <cylinderGeometry args={[0.005, 0.025, 0.12, 4]} />
              <meshStandardMaterial color="#E0FFFF" metalness={0.3} roughness={0.05} emissive="#B0E0E6" emissiveIntensity={0.7} transparent opacity={0.8} />
            </mesh>
          ))}
          {/* Frost ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.4, 0.01, 8, 32]} /><meshPhongMaterial color="#E0FFFF" emissive="#B0E0E6" emissiveIntensity={0.5} transparent opacity={0.3} /></mesh>
        </group>
      )}

      {/* Chrome - Reflective mirror orbs */}
      {skinConfig.accessory === 'mirrorOrbs' && (
        <group>
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.42, Math.sin(i * 0.6) * 0.08, Math.sin((angle * Math.PI) / 180) * 0.42]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color="#E8E8E8" metalness={0.98} roughness={0.02} />
            </mesh>
          ))}
          {/* Chrome ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.42, 0.015, 16, 32]} /><meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.05} /></mesh>
        </group>
      )}

      {/* ========== PREMIUM ACCESSORIES ========== */}

      {/* Cleopatra */}
      {skinConfig.accessory === 'cleopatraJewels' && (
        <group>
          <mesh position={[0, -0.08, 0]}><torusGeometry args={[0.32, 0.05, 8, 32]} /><meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.05} emissive="#B8860B" emissiveIntensity={0.4} /></mesh>
          <mesh position={[0, -0.13, 0]}><torusGeometry args={[0.34, 0.03, 8, 32]} /><meshStandardMaterial color="#1a237e" metalness={0.6} roughness={0.3} /></mesh>
          {[0, 30, 60, -30, -60, 90, -90].map((angle, i) => {
            const colors = ['#00BCD4', '#D4AF37', '#4CAF50', '#E91E63', '#D4AF37', '#00BCD4', '#4CAF50'];
            return (
              <mesh key={i} position={[Math.sin((angle * Math.PI) / 180) * 0.34, -0.17, Math.cos((angle * Math.PI) / 180) * 0.34]}>
                <sphereGeometry args={[0.02, 8, 8]} /><meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.6} />
              </mesh>
            );
          })}
          <mesh position={[0.36, -0.05, 0.12]}><torusGeometry args={[0.03, 0.008, 8, 12]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} /></mesh>
          <mesh position={[0.36, -0.1, 0.12]}><boxGeometry args={[0.015, 0.08, 0.008]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} /></mesh>
          <mesh position={[-0.15, 0.04, 0.27]}><boxGeometry args={[0.06, 0.01, 0.005]} /><meshBasicMaterial color="#000000" /></mesh>
          <mesh position={[0.15, 0.04, 0.27]}><boxGeometry args={[0.06, 0.01, 0.005]} /><meshBasicMaterial color="#000000" /></mesh>
        </group>
      )}

      {/* Coco Chanel */}
      {skinConfig.accessory === 'cocoPearls' && (
        <group>
          <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.27, 0.28, 0.22, 16]} /><meshPhongMaterial color="#1a1a1a" /></mesh>
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
          <mesh position={[0.05, 0.02, 0.29]}><torusGeometry args={[0.02, 0.004, 8, 12]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFD700" emissiveIntensity={0.3} /></mesh>
          <mesh position={[-0.01, 0.02, 0.29]}><torusGeometry args={[0.02, 0.004, 8, 12]} /><meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFD700" emissiveIntensity={0.3} /></mesh>
          <mesh position={[-0.35, -0.15, 0.1]}><boxGeometry args={[0.1, 0.08, 0.04]} /><meshPhongMaterial color="#1a1a1a" /></mesh>
        </group>
      )}

      {/* Phoenix */}
      {skinConfig.accessory === 'phoenixWings' && (
        <group>
          <group position={[-0.25, 0, -0.1]} rotation={[0.2, 0.5, 0.3]}>
            <mesh><boxGeometry args={[0.35, 0.02, 0.25]} /><meshPhongMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={0.8} transparent opacity={0.8} /></mesh>
            <mesh position={[-0.12, 0.02, 0]}><boxGeometry args={[0.15, 0.02, 0.2]} /><meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.6} transparent opacity={0.7} /></mesh>
          </group>
          <group position={[0.25, 0, -0.1]} rotation={[0.2, -0.5, -0.3]}>
            <mesh><boxGeometry args={[0.35, 0.02, 0.25]} /><meshPhongMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={0.8} transparent opacity={0.8} /></mesh>
            <mesh position={[0.12, 0.02, 0]}><boxGeometry args={[0.15, 0.02, 0.2]} /><meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.6} transparent opacity={0.7} /></mesh>
          </group>
          {[-0.08, 0, 0.08].map((x, i) => (
            <mesh key={i} position={[x, -0.1, -0.35]} rotation={[0.5 + i * 0.1, 0, i * 0.1 - 0.1]}>
              <boxGeometry args={[0.04, 0.02, 0.3]} /><meshPhongMaterial color={i === 1 ? '#FFD700' : '#FF4500'} emissive={i === 1 ? '#FFD700' : '#FF4500'} emissiveIntensity={1} />
            </mesh>
          ))}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={`ember-${i}`} position={[Math.cos((angle * Math.PI) / 180) * 0.42, Math.sin(i) * 0.15, Math.sin((angle * Math.PI) / 180) * 0.42]}>
              <sphereGeometry args={[0.025, 6, 6]} /><meshPhongMaterial color="#FF6600" emissive="#FF6600" emissiveIntensity={2} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {/* Galaxy */}
      {skinConfig.accessory === 'galaxyOrbit' && (
        <group>
          <mesh rotation={[Math.PI / 3, 0, 0]}><torusGeometry args={[0.5, 0.04, 8, 32]} /><meshStandardMaterial color="#7B68EE" metalness={0.6} roughness={0.3} emissive="#7B68EE" emissiveIntensity={0.6} transparent opacity={0.5} /></mesh>
          <mesh rotation={[Math.PI / 3, 0, 0]}><torusGeometry args={[0.42, 0.02, 8, 32]} /><meshPhongMaterial color="#00CED1" emissive="#00CED1" emissiveIntensity={0.8} transparent opacity={0.4} /></mesh>
          <mesh position={[0.48, 0.1, 0]}><sphereGeometry args={[0.04, 12, 12]} /><meshPhongMaterial color="#FF6347" emissive="#FF4500" emissiveIntensity={0.5} /></mesh>
          <mesh position={[-0.35, -0.2, 0.25]}><sphereGeometry args={[0.03, 12, 12]} /><meshPhongMaterial color="#4169E1" emissive="#4169E1" emissiveIntensity={0.5} /></mesh>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.55, Math.sin(i * 0.7) * 0.12, Math.sin((angle * Math.PI) / 180) * 0.55]}>
              <sphereGeometry args={[0.015, 6, 6]} /><meshPhongMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1.5} transparent opacity={0.5} />
            </mesh>
          ))}
        </group>
      )}

      {/* Samurai */}
      {skinConfig.accessory === 'samuraiArmor' && (
        <group>
          <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.3, 0.33, 0.22, 16]} /><meshStandardMaterial color="#8B0000" metalness={0.7} roughness={0.3} /></mesh>
          {[-0.04, 0, 0.04].map((y, i) => (
            <mesh key={i} position={[0, y - 0.1, 0]}><torusGeometry args={[0.31, 0.008, 8, 16]} /><meshStandardMaterial color="#FFD700" metalness={0.9} /></mesh>
          ))}
          <mesh position={[-0.32, 0.02, 0]} rotation={[0, 0, 0.4]}><boxGeometry args={[0.15, 0.12, 0.1]} /><meshStandardMaterial color="#8B0000" metalness={0.7} roughness={0.3} /></mesh>
          <mesh position={[0.32, 0.02, 0]} rotation={[0, 0, -0.4]}><boxGeometry args={[0.15, 0.12, 0.1]} /><meshStandardMaterial color="#8B0000" metalness={0.7} roughness={0.3} /></mesh>
          <mesh position={[-0.38, 0.05, -0.1]} rotation={[0.2, 0, 0.1]}><boxGeometry args={[0.018, 0.55, 0.006]} /><meshStandardMaterial color="#E0E0E0" metalness={0.98} roughness={0.02} /></mesh>
          <mesh position={[-0.38, 0.26, -0.1]}><cylinderGeometry args={[0.03, 0.03, 0.008, 8]} /><meshStandardMaterial color="#FFD700" metalness={0.95} /></mesh>
          <mesh position={[0, -0.04, 0.32]}><torusGeometry args={[0.03, 0.005, 8, 16]} /><meshStandardMaterial color="#FFD700" metalness={0.95} emissive="#FFA500" emissiveIntensity={0.3} /></mesh>
        </group>
      )}

      {/* Dragon */}
      {skinConfig.accessory === 'dragonWings' && (
        <group>
          <group position={[-0.2, 0.05, -0.15]} rotation={[0, 0.6, 0.2]}>
            <mesh><boxGeometry args={[0.4, 0.02, 0.3]} /><meshStandardMaterial color="#1a5a1a" metalness={0.4} roughness={0.5} emissive="#228B22" emissiveIntensity={0.2} /></mesh>
            <mesh position={[-0.15, 0.02, 0]}><boxGeometry args={[0.02, 0.02, 0.28]} /><meshStandardMaterial color="#2F4F2F" metalness={0.6} /></mesh>
            <mesh position={[-0.05, 0.02, 0]}><boxGeometry args={[0.02, 0.02, 0.25]} /><meshStandardMaterial color="#2F4F2F" metalness={0.6} /></mesh>
          </group>
          <group position={[0.2, 0.05, -0.15]} rotation={[0, -0.6, -0.2]}>
            <mesh><boxGeometry args={[0.4, 0.02, 0.3]} /><meshStandardMaterial color="#1a5a1a" metalness={0.4} roughness={0.5} emissive="#228B22" emissiveIntensity={0.2} /></mesh>
            <mesh position={[0.15, 0.02, 0]}><boxGeometry args={[0.02, 0.02, 0.28]} /><meshStandardMaterial color="#2F4F2F" metalness={0.6} /></mesh>
            <mesh position={[0.05, 0.02, 0]}><boxGeometry args={[0.02, 0.02, 0.25]} /><meshStandardMaterial color="#2F4F2F" metalness={0.6} /></mesh>
          </group>
          <mesh position={[0, -0.15, -0.35]} rotation={[0.5, 0, 0]}><coneGeometry args={[0.06, 0.35, 8]} /><meshStandardMaterial color="#228B22" metalness={0.4} roughness={0.4} /></mesh>
          <mesh position={[0, -0.25, -0.58]} rotation={[1, 0, 0]}><coneGeometry args={[0.03, 0.1, 4]} /><meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} /></mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={`fire-${i}`} position={[0, -0.08 + i * 0.02, 0.35 + i * 0.08]}>
              <sphereGeometry args={[0.04 - i * 0.01, 8, 8]} /><meshPhongMaterial color={i === 0 ? '#FF4500' : i === 1 ? '#FF6600' : '#FFD700'} emissive={i === 0 ? '#FF4500' : i === 1 ? '#FF6600' : '#FFD700'} emissiveIntensity={1.5} transparent opacity={0.7 - i * 0.15} />
            </mesh>
          ))}
        </group>
      )}

      {/* Legend */}
      {skinConfig.accessory === 'legendCape' && (
        <group>
          <mesh position={[0, -0.05, -0.25]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.65, 0.75, 0.02]} /><meshStandardMaterial color="#0033AA" metalness={0.6} roughness={0.2} emissive="#0044CC" emissiveIntensity={0.4} /></mesh>
          <mesh position={[0, 0.1, -0.24]}><boxGeometry args={[0.65, 0.03, 0.025]} /><meshStandardMaterial color="#FFD700" metalness={0.95} emissive="#FFA500" emissiveIntensity={0.5} /></mesh>
          <mesh position={[0, -0.15, 0]}><cylinderGeometry args={[0.3, 0.4, 0.25, 16]} /><meshStandardMaterial color="#0033AA" metalness={0.4} roughness={0.4} emissive="#0044CC" emissiveIntensity={0.2} /></mesh>
          <mesh position={[0, 0.1, 0.28]}><octahedronGeometry args={[0.04]} /><meshStandardMaterial color="#FFD700" metalness={0.95} emissive="#FFD700" emissiveIntensity={1.5} /></mesh>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const colors = ['#FF0000', '#00FF00', '#0066FF', '#FFD700', '#FF00FF', '#00FFFF', '#FF6600', '#7B68EE'];
            return (
              <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.48, Math.sin(i * 0.5) * 0.18, Math.sin((angle * Math.PI) / 180) * 0.48]}>
                <octahedronGeometry args={[0.03]} /><meshPhongMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={1.8} transparent opacity={0.7} />
              </mesh>
            );
          })}
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.5, 0.008, 8, 32]} /><meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} transparent opacity={0.4} /></mesh>
          <mesh rotation={[Math.PI / 3, 0, Math.PI / 4]}><torusGeometry args={[0.55, 0.006, 8, 32]} /><meshPhongMaterial color="#00BFFF" emissive="#00BFFF" emissiveIntensity={0.8} transparent opacity={0.3} /></mesh>
          <mesh position={[0, 0.55, 0]}><octahedronGeometry args={[0.06]} /><meshStandardMaterial color="#FFD700" metalness={0.95} emissive="#FFD700" emissiveIntensity={2} /></mesh>
        </group>
      )}
    </group>
  );
});

Ball.displayName = 'Ball';
