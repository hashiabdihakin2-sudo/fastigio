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
  
  // Historical Figures
  harriet: { color: '#8B6914', emissive: '#6B4F10', emissiveIntensity: 0.3, hat: 'harrietHeadwrap', accessory: 'harrietShawl' },
  rosa: { color: '#C4A35A', emissive: '#A08030', emissiveIntensity: 0.3, hat: 'rosaHat', accessory: 'rosaCoat' },
  mlk: { color: '#3C3C3C', emissive: '#555555', emissiveIntensity: 0.2, hat: null, accessory: 'mlkSuit' },
  malcolm: { color: '#1a1a1a', emissive: '#333333', emissiveIntensity: 0.2, hat: 'malcolmGlasses', accessory: 'malcolmSuit' },
  lincoln: { color: '#3C3C3C', emissive: '#555555', emissiveIntensity: 0.2, hat: 'lincolnTopHat', accessory: 'lincolnBeard' },
  obama: { color: '#1E3A5F', emissive: '#2A4A70', emissiveIntensity: 0.3, hat: null, accessory: 'obamaSuit' },
  mandela: { color: '#228B22', emissive: '#1A6B1A', emissiveIntensity: 0.3, hat: null, accessory: 'mandelaShirt' },
  douglass: { color: '#4a3728', emissive: '#3a2718', emissiveIntensity: 0.2, hat: null, accessory: 'douglassHair' },
  truth: { color: '#8B7355', emissive: '#6B5335', emissiveIntensity: 0.3, hat: 'truthBonnet', accessory: 'truthDress' },
  ali: { color: '#CC0000', emissive: '#990000', emissiveIntensity: 0.5, hat: null, accessory: 'aliGloves' },
  jackie: { color: '#003DA5', emissive: '#002D85', emissiveIntensity: 0.4, hat: 'jackieCap', accessory: 'jackieJersey' },
  maya: { color: '#6B3FA0', emissive: '#4B1F80', emissiveIntensity: 0.4, hat: 'mayaHeadwrap', accessory: 'mayaScarf' },
  jfk: { color: '#1C3A5F', emissive: '#0C2A4F', emissiveIntensity: 0.2, hat: null, accessory: 'jfkSuit' },
  tubman_legend: { color: '#FFD700', emissive: '#FFA500', emissiveIntensity: 0.8, hat: 'tubmanLegendCrown', accessory: 'tubmanLegendCape' },
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

      {/* ========== HISTORICAL FIGURE HATS ========== */}

      {/* Harriet Tubman - Head wrap (bandana style) */}
      {skinConfig.hat === 'harrietHeadwrap' && (
        <group position={[0, 0.28, 0]}>
          {/* Main wrap - fabric around head */}
          <mesh>
            <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhongMaterial color="#8B6914" emissive="#6B4F10" emissiveIntensity={0.3} />
          </mesh>
          {/* Knot on top */}
          <mesh position={[0.05, 0.15, 0.05]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshPhongMaterial color="#7B5904" />
          </mesh>
          <mesh position={[-0.05, 0.12, 0.05]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshPhongMaterial color="#7B5904" />
          </mesh>
          {/* Fabric folds */}
          {[0, 120, 240].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.22, 0.05, Math.sin((angle * Math.PI) / 180) * 0.22]}>
              <boxGeometry args={[0.08, 0.03, 0.06]} />
              <meshPhongMaterial color="#9B7924" />
            </mesh>
          ))}
        </group>
      )}

      {/* Rosa Parks - Elegant 1950s hat */}
      {skinConfig.hat === 'rosaHat' && (
        <group position={[0, 0.3, 0]}>
          {/* Hat brim */}
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.03, 32]} />
            <meshPhongMaterial color="#4a3828" />
          </mesh>
          {/* Hat dome */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.15, 0.18, 0.15, 16]} />
            <meshPhongMaterial color="#4a3828" />
          </mesh>
          {/* Hat band - ribbon */}
          <mesh position={[0, 0.03, 0]}>
            <torusGeometry args={[0.17, 0.02, 8, 16]} />
            <meshPhongMaterial color="#C4A35A" emissive="#aa8833" emissiveIntensity={0.4} />
          </mesh>
          {/* Small flower decoration */}
          <mesh position={[0.15, 0.06, 0.08]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshPhongMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.3} />
          </mesh>
        </group>
      )}

      {/* Malcolm X - Glasses */}
      {skinConfig.hat === 'malcolmGlasses' && (
        <group position={[0, 0.08, 0.2]}>
          {/* Left lens frame */}
          <mesh position={[-0.1, 0, 0.06]}>
            <torusGeometry args={[0.06, 0.01, 8, 16]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Right lens frame */}
          <mesh position={[0.1, 0, 0.06]}>
            <torusGeometry args={[0.06, 0.01, 8, 16]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Bridge */}
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.08, 0.01, 0.01]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
          </mesh>
          {/* Left temple */}
          <mesh position={[-0.16, 0, -0.02]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.01, 0.01, 0.15]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
          </mesh>
          {/* Right temple */}
          <mesh position={[0.16, 0, -0.02]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.01, 0.01, 0.15]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
          </mesh>
        </group>
      )}

      {/* Lincoln - Iconic tall top hat */}
      {skinConfig.hat === 'lincolnTopHat' && (
        <group position={[0, 0.32, 0]}>
          {/* Hat brim */}
          <mesh>
            <cylinderGeometry args={[0.28, 0.28, 0.03, 32]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
          {/* Tall hat body */}
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.17, 0.18, 0.4, 16]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
          {/* Hat band */}
          <mesh position={[0, 0.05, 0]}>
            <torusGeometry args={[0.18, 0.015, 8, 16]} />
            <meshPhongMaterial color="#333333" />
          </mesh>
          {/* Flat top */}
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.02, 16]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
        </group>
      )}

      {/* Sojourner Truth - Bonnet */}
      {skinConfig.hat === 'truthBonnet' && (
        <group position={[0, 0.28, 0]}>
          {/* Bonnet dome */}
          <mesh>
            <sphereGeometry args={[0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshPhongMaterial color="#F5F0E8" />
          </mesh>
          {/* Bonnet brim - frames the face */}
          <mesh position={[0, -0.02, 0.15]} rotation={[0.3, 0, 0]}>
            <torusGeometry args={[0.18, 0.03, 8, 16, Math.PI]} />
            <meshPhongMaterial color="#F5F0E8" />
          </mesh>
          {/* Ribbon tie */}
          <mesh position={[0, -0.08, 0.2]}>
            <boxGeometry args={[0.06, 0.15, 0.02]} />
            <meshPhongMaterial color="#C4A35A" />
          </mesh>
        </group>
      )}

      {/* Jackie Robinson - Baseball cap with 42 */}
      {skinConfig.hat === 'jackieCap' && (
        <group position={[0, 0.28, 0]}>
          {/* Cap dome */}
          <mesh>
            <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
          {/* Cap visor */}
          <mesh position={[0, -0.02, 0.2]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.2, 0.02, 0.15]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
          {/* "B" letter on front */}
          <mesh position={[0, 0.08, 0.22]}>
            <boxGeometry args={[0.06, 0.08, 0.01]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Cap button on top */}
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
        </group>
      )}

      {/* Maya Angelou - Colorful headwrap */}
      {skinConfig.hat === 'mayaHeadwrap' && (
        <group position={[0, 0.28, 0]}>
          {/* Main wrap */}
          <mesh>
            <sphereGeometry args={[0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhongMaterial color="#6B3FA0" emissive="#4B1F80" emissiveIntensity={0.3} />
          </mesh>
          {/* Wrap layers */}
          <mesh position={[0, 0.12, 0]}>
            <torusGeometry args={[0.2, 0.04, 8, 16]} />
            <meshPhongMaterial color="#8B5FC0" />
          </mesh>
          {/* Fabric folds on top */}
          <mesh position={[0.08, 0.2, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshPhongMaterial color="#9B6FD0" />
          </mesh>
          <mesh position={[-0.06, 0.18, 0.04]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshPhongMaterial color="#7B4FB0" />
          </mesh>
          {/* Gold accent pin */}
          <mesh position={[0.12, 0.1, 0.15]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* Tubman Legend - Golden crown with stars */}
      {skinConfig.hat === 'tubmanLegendCrown' && (
        <group position={[0, 0.35, 0]}>
          {/* Crown base */}
          <mesh>
            <cylinderGeometry args={[0.22, 0.24, 0.18, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFA500" emissiveIntensity={0.6} />
          </mesh>
          {/* Crown points */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.2, 0.15, Math.sin((angle * Math.PI) / 180) * 0.2]}>
              <coneGeometry args={[0.05, 0.2, 4]} />
              <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFD700" emissiveIntensity={0.8} />
            </mesh>
          ))}
          {/* Star on front */}
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

      {/* ========== HISTORICAL FIGURE ACCESSORIES ========== */}

      {/* Harriet Tubman - Shawl draped over shoulders */}
      {skinConfig.accessory === 'harrietShawl' && (
        <group>
          {/* Shawl body - draped fabric */}
          <mesh position={[0, -0.05, -0.15]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.55, 0.35, 0.02]} />
            <meshPhongMaterial color="#5a4020" />
          </mesh>
          {/* Left drape */}
          <mesh position={[-0.25, -0.15, 0]} rotation={[0, 0.3, 0.2]}>
            <boxGeometry args={[0.15, 0.3, 0.02]} />
            <meshPhongMaterial color="#5a4020" />
          </mesh>
          {/* Right drape */}
          <mesh position={[0.25, -0.15, 0]} rotation={[0, -0.3, -0.2]}>
            <boxGeometry args={[0.15, 0.3, 0.02]} />
            <meshPhongMaterial color="#5a4020" />
          </mesh>
        </group>
      )}

      {/* Rosa Parks - Coat with collar */}
      {skinConfig.accessory === 'rosaCoat' && (
        <group>
          {/* Coat body */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.32, 0.35, 0.25, 16]} />
            <meshPhongMaterial color="#3a2818" />
          </mesh>
          {/* Collar left */}
          <mesh position={[-0.15, 0.05, 0.2]} rotation={[0.5, 0.3, 0]}>
            <boxGeometry args={[0.12, 0.1, 0.02]} />
            <meshPhongMaterial color="#3a2818" />
          </mesh>
          {/* Collar right */}
          <mesh position={[0.15, 0.05, 0.2]} rotation={[0.5, -0.3, 0]}>
            <boxGeometry args={[0.12, 0.1, 0.02]} />
            <meshPhongMaterial color="#3a2818" />
          </mesh>
          {/* Buttons */}
          {[0, -0.06, -0.12].map((y, i) => (
            <mesh key={i} position={[0, y, 0.33]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#C4A35A" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* MLK - Suit with tie */}
      {skinConfig.accessory === 'mlkSuit' && (
        <group>
          {/* Suit jacket */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshPhongMaterial color="#2C2C2C" />
          </mesh>
          {/* White shirt collar */}
          <mesh position={[0, 0.02, 0.25]}>
            <boxGeometry args={[0.12, 0.06, 0.01]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Tie */}
          <mesh position={[0, -0.08, 0.3]}>
            <boxGeometry args={[0.04, 0.18, 0.01]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
          {/* Tie knot */}
          <mesh position={[0, 0.02, 0.3]}>
            <boxGeometry args={[0.05, 0.03, 0.01]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
          {/* Lapels */}
          <mesh position={[-0.1, -0.02, 0.26]} rotation={[0, 0.2, 0.3]}>
            <boxGeometry args={[0.08, 0.12, 0.01]} />
            <meshPhongMaterial color="#2C2C2C" />
          </mesh>
          <mesh position={[0.1, -0.02, 0.26]} rotation={[0, -0.2, -0.3]}>
            <boxGeometry args={[0.08, 0.12, 0.01]} />
            <meshPhongMaterial color="#2C2C2C" />
          </mesh>
        </group>
      )}

      {/* Malcolm X - Suit with bow tie */}
      {skinConfig.accessory === 'malcolmSuit' && (
        <group>
          {/* Suit */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
          {/* White shirt */}
          <mesh position={[0, 0, 0.27]}>
            <boxGeometry args={[0.1, 0.15, 0.01]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Bow tie */}
          <mesh position={[-0.04, 0.02, 0.29]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.06, 0.03, 0.01]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0.04, 0.02, 0.29]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.06, 0.03, 0.01]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0, 0.02, 0.29]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
        </group>
      )}

      {/* Lincoln - Beard */}
      {skinConfig.accessory === 'lincolnBeard' && (
        <group>
          {/* Chin beard - no mustache (accurate to Lincoln) */}
          <mesh position={[0, -0.15, 0.2]}>
            <boxGeometry args={[0.15, 0.12, 0.08]} />
            <meshPhongMaterial color="#2a2a2a" />
          </mesh>
          {/* Side whiskers */}
          <mesh position={[-0.18, -0.08, 0.12]}>
            <boxGeometry args={[0.05, 0.15, 0.05]} />
            <meshPhongMaterial color="#2a2a2a" />
          </mesh>
          <mesh position={[0.18, -0.08, 0.12]}>
            <boxGeometry args={[0.05, 0.15, 0.05]} />
            <meshPhongMaterial color="#2a2a2a" />
          </mesh>
          {/* Suit coat */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshPhongMaterial color="#2C2C2C" />
          </mesh>
          {/* Bow tie */}
          <mesh position={[0, 0, 0.28]}>
            <boxGeometry args={[0.1, 0.04, 0.01]} />
            <meshPhongMaterial color="#1a1a1a" />
          </mesh>
        </group>
      )}

      {/* Obama - Modern suit with American flag pin */}
      {skinConfig.accessory === 'obamaSuit' && (
        <group>
          {/* Suit jacket */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshPhongMaterial color="#1E3A5F" />
          </mesh>
          {/* White shirt */}
          <mesh position={[0, 0, 0.27]}>
            <boxGeometry args={[0.1, 0.15, 0.01]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Blue tie */}
          <mesh position={[0, -0.06, 0.3]}>
            <boxGeometry args={[0.04, 0.15, 0.01]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
          {/* American flag pin on lapel */}
          <mesh position={[-0.12, 0.02, 0.28]}>
            <boxGeometry args={[0.03, 0.02, 0.01]} />
            <meshPhongMaterial color="#CC0000" />
          </mesh>
          <mesh position={[-0.12, 0.005, 0.28]}>
            <boxGeometry args={[0.03, 0.01, 0.01]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[-0.12, -0.005, 0.28]}>
            <boxGeometry args={[0.03, 0.01, 0.01]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
        </group>
      )}

      {/* Mandela - Madiba shirt (patterned) */}
      {skinConfig.accessory === 'mandelaShirt' && (
        <group>
          {/* Shirt body */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshPhongMaterial color="#228B22" emissive="#1A6B1A" emissiveIntensity={0.2} />
          </mesh>
          {/* Shirt collar - Mandarin style */}
          <mesh position={[0, 0.03, 0.25]}>
            <boxGeometry args={[0.08, 0.06, 0.01]} />
            <meshPhongMaterial color="#228B22" />
          </mesh>
          {/* Pattern details on shirt */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.31, -0.1, Math.sin((angle * Math.PI) / 180) * 0.31]}>
              <boxGeometry args={[0.02, 0.05, 0.02]} />
              <meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
            </mesh>
          ))}
        </group>
      )}

      {/* Frederick Douglass - Distinguished hair and cravat */}
      {skinConfig.accessory === 'douglassHair' && (
        <group>
          {/* Wild distinguished hair */}
          <mesh position={[0, 0.2, -0.05]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshPhongMaterial color="#2a2a2a" />
          </mesh>
          <mesh position={[-0.15, 0.25, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshPhongMaterial color="#2a2a2a" />
          </mesh>
          <mesh position={[0.15, 0.25, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshPhongMaterial color="#2a2a2a" />
          </mesh>
          {/* Cravat/bow tie */}
          <mesh position={[0, -0.05, 0.28]}>
            <boxGeometry args={[0.12, 0.08, 0.02]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Coat */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshPhongMaterial color="#3a3a3a" />
          </mesh>
        </group>
      )}

      {/* Sojourner Truth - Long dress */}
      {skinConfig.accessory === 'truthDress' && (
        <group>
          {/* Dress bodice */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.25, 16]} />
            <meshPhongMaterial color="#4a3a2a" />
          </mesh>
          {/* White shawl/collar */}
          <mesh position={[0, 0.02, 0.2]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.3, 0.12, 0.02]} />
            <meshPhongMaterial color="#F5F0E8" />
          </mesh>
          {/* Brooch */}
          <mesh position={[0, 0, 0.3]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#C4A35A" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* Muhammad Ali - Boxing gloves */}
      {skinConfig.accessory === 'aliGloves' && (
        <group>
          {/* Left glove */}
          <mesh position={[-0.4, -0.05, 0.1]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshPhongMaterial color="#CC0000" emissive="#990000" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[-0.35, -0.05, 0.1]}>
            <cylinderGeometry args={[0.06, 0.08, 0.08, 8]} />
            <meshPhongMaterial color="#CC0000" />
          </mesh>
          {/* Right glove */}
          <mesh position={[0.4, -0.05, 0.1]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshPhongMaterial color="#CC0000" emissive="#990000" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.35, -0.05, 0.1]}>
            <cylinderGeometry args={[0.06, 0.08, 0.08, 8]} />
            <meshPhongMaterial color="#CC0000" />
          </mesh>
          {/* Boxing shorts */}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.28, 0.32, 0.15, 16]} />
            <meshPhongMaterial color="#FFD700" />
          </mesh>
          {/* Shorts stripe */}
          <mesh position={[0, -0.2, 0]}>
            <torusGeometry args={[0.3, 0.015, 8, 16]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
        </group>
      )}

      {/* Jackie Robinson - Dodgers jersey #42 */}
      {skinConfig.accessory === 'jackieJersey' && (
        <group>
          {/* Jersey body */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Number 4 */}
          <mesh position={[-0.04, -0.08, 0.31]}>
            <boxGeometry args={[0.03, 0.1, 0.01]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
          <mesh position={[-0.04, -0.03, 0.31]}>
            <boxGeometry args={[0.06, 0.02, 0.01]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
          <mesh position={[-0.01, -0.08, 0.31]}>
            <boxGeometry args={[0.03, 0.02, 0.01]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
          {/* Number 2 */}
          <mesh position={[0.06, -0.03, 0.31]}>
            <boxGeometry args={[0.06, 0.02, 0.01]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
          <mesh position={[0.085, -0.06, 0.31]}>
            <boxGeometry args={[0.02, 0.04, 0.01]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
          <mesh position={[0.06, -0.08, 0.31]}>
            <boxGeometry args={[0.06, 0.02, 0.01]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
          <mesh position={[0.035, -0.11, 0.31]}>
            <boxGeometry args={[0.02, 0.04, 0.01]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
          <mesh position={[0.06, -0.13, 0.31]}>
            <boxGeometry args={[0.06, 0.02, 0.01]} />
            <meshPhongMaterial color="#003DA5" />
          </mesh>
        </group>
      )}

      {/* Maya Angelou - Elegant scarf */}
      {skinConfig.accessory === 'mayaScarf' && (
        <group>
          {/* Elegant dress/blouse */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshPhongMaterial color="#6B3FA0" />
          </mesh>
          {/* Flowing scarf */}
          <mesh position={[0.1, -0.05, 0.25]} rotation={[0.2, -0.3, 0.5]}>
            <boxGeometry args={[0.08, 0.3, 0.01]} />
            <meshPhongMaterial color="#D4AF37" />
          </mesh>
          <mesh position={[-0.05, -0.1, 0.25]} rotation={[0.1, 0.2, -0.3]}>
            <boxGeometry args={[0.08, 0.25, 0.01]} />
            <meshPhongMaterial color="#D4AF37" />
          </mesh>
          {/* Earring */}
          <mesh position={[-0.22, -0.05, 0.1]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.22, -0.05, 0.1]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* JFK - Presidential suit */}
      {skinConfig.accessory === 'jfkSuit' && (
        <group>
          {/* Navy suit */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.3, 0.33, 0.2, 16]} />
            <meshPhongMaterial color="#1C3A5F" />
          </mesh>
          {/* White shirt */}
          <mesh position={[0, 0, 0.27]}>
            <boxGeometry args={[0.1, 0.15, 0.01]} />
            <meshPhongMaterial color="#FFFFFF" />
          </mesh>
          {/* Red tie */}
          <mesh position={[0, -0.06, 0.3]}>
            <boxGeometry args={[0.04, 0.15, 0.01]} />
            <meshPhongMaterial color="#CC0000" />
          </mesh>
          {/* PT-109 tie clip */}
          <mesh position={[0, -0.02, 0.31]}>
            <boxGeometry args={[0.03, 0.005, 0.005]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* Tubman Legend - Golden cape */}
      {skinConfig.accessory === 'tubmanLegendCape' && (
        <group>
          {/* Flowing golden cape */}
          <mesh position={[0, 0, -0.25]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.6, 0.7, 0.02]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} emissive="#FFA500" emissiveIntensity={0.5} />
          </mesh>
          {/* Cape clasp */}
          <mesh position={[0, 0.1, 0.25]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFD700" emissiveIntensity={1} />
          </mesh>
          {/* Glowing aura particles */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <mesh key={i} position={[
              Math.cos((angle * Math.PI) / 180) * 0.45,
              Math.sin(Date.now() * 0.002 + i) * 0.15,
              Math.sin((angle * Math.PI) / 180) * 0.45
            ]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshPhongMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
});

Ball.displayName = 'Ball';
