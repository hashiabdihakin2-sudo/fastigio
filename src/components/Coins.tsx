import { Vector3 } from 'three';
import { useGameStore } from '../store/gameStore';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface Coin {
  position: Vector3;
  id: number;
  collected: boolean;
  rotation: number;
}

interface CoinsProps {
  ballPosition: Vector3;
}

export const Coins = ({ ballPosition }: CoinsProps) => {
  const { coins, updateScore, score } = useGameStore();
  const coinsRef = useRef<Coin[]>([]);
  const timeRef = useRef(0);
  const collectedCoinsRef = useRef(0);

  // Generate coins near obstacles
  const generateCoins = (startZ: number = 20) => {
    const newCoins: Coin[] = [];
    const numCoins = 30;
    const spacing = 8;

    for (let i = 0; i < numCoins; i++) {
      const z = startZ + (i * spacing);
      // Place coins at various x positions, including challenging ones
      const patterns = [
        (Math.random() - 0.5) * 8,  // Random position
        Math.random() > 0.5 ? -4 : 4,  // Far left or right
        0,  // Center
        Math.random() > 0.5 ? -2.5 : 2.5  // Mid positions
      ];
      const x = patterns[Math.floor(Math.random() * patterns.length)];
      
      newCoins.push({
        id: Date.now() + i + Math.random() * 10000,
        position: new Vector3(x, 0.5, z),
        collected: false,
        rotation: Math.random() * Math.PI * 2
      });
    }

    return newCoins;
  };

  // Initialize coins
  if (coinsRef.current.length === 0) {
    coinsRef.current = generateCoins(ballPosition.z + 10);
  }

  useFrame((state, delta) => {
    timeRef.current += delta;

    // Rotate coins
    coinsRef.current.forEach(coin => {
      if (!coin.collected) {
        coin.rotation += delta * 2;
      }
    });

    // Check collision with ball
    coinsRef.current.forEach(coin => {
      if (coin.collected) return;
      
      const distance = new Vector3(
        ballPosition.x,
        ballPosition.y,
        ballPosition.z
      ).distanceTo(coin.position);
      
      if (distance < 0.8) {
        coin.collected = true;
        collectedCoinsRef.current += 1;
        
        // Update coins in store - 100 coins per pickup
        const currentCoins = useGameStore.getState().coins;
        useGameStore.setState({ coins: currentCoins + 100 });
        localStorage.setItem('coins', (currentCoins + 100).toString());
      }
    });

    // Generate new coins ahead
    const furthestCoin =
      coinsRef.current.length > 0
        ? Math.max(...coinsRef.current.map((c) => c.position.z))
        : ballPosition.z;

    if (ballPosition.z > furthestCoin - 80) {
      const newCoins = generateCoins(furthestCoin + 10);
      coinsRef.current = [...coinsRef.current, ...newCoins];
    }

    // Clean up distant coins
    coinsRef.current = coinsRef.current.filter(
      coin => coin.position.z > ballPosition.z - 50
    );
  });

  return (
    <>
      {coinsRef.current
        .filter(coin => 
          !coin.collected && 
          Math.abs(coin.position.z - ballPosition.z) < 60
        )
        .map(coin => {
          const floatOffset = Math.sin(timeRef.current * 2 + coin.id) * 0.2;
          const pulseScale = 1 + Math.sin(timeRef.current * 4 + coin.id) * 0.1;
          
          return (
            <group 
              key={coin.id}
              position={[
                coin.position.x, 
                coin.position.y + floatOffset, 
                coin.position.z
              ]}
              rotation={[0, coin.rotation, 0]}
              scale={[pulseScale, pulseScale, pulseScale]}
            >
              {/* Main coin */}
              <mesh castShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
                <meshStandardMaterial 
                  color="#FFD700"
                  emissive="#FFD700"
                  emissiveIntensity={0.8}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              
              {/* Glow effect */}
              <mesh>
                <cylinderGeometry args={[0.5, 0.5, 0.15, 16]} />
                <meshBasicMaterial 
                  color="#FFD700"
                  transparent
                  opacity={0.3}
                />
              </mesh>
              
              {/* Outer ring glow */}
              <mesh>
                <torusGeometry args={[0.4, 0.05, 8, 16]} />
                <meshBasicMaterial 
                  color="#FFA500"
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </group>
          );
        })}
    </>
  );
};
