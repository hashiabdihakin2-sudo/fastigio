import { useState, useEffect } from 'react';
import { SlopeGame } from "@/components/SlopeGame";
import { MultiplayerLobby } from "@/components/MultiplayerLobby";
import { MultiplayerGame } from "@/components/MultiplayerGame";
import { useGameStore } from "@/store/gameStore";

const Index = () => {
  const [multiplayerMode, setMultiplayerMode] = useState(false);
  const [multiplayerRoomId, setMultiplayerRoomId] = useState<string | null>(null);
  const [isPlayer1, setIsPlayer1] = useState(false);
  const { playerName } = useGameStore();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'multiplayer') {
      setMultiplayerMode(true);
    }
  }, []);

  const handleStartMultiplayer = (roomId: string, player1: boolean) => {
    setMultiplayerRoomId(roomId);
    setIsPlayer1(player1);
  };

  const handleMultiplayerGameOver = () => {
    setMultiplayerMode(false);
    setMultiplayerRoomId(null);
    window.history.replaceState({}, '', '/');
  };

  if (multiplayerMode && !multiplayerRoomId) {
    return (
      <MultiplayerLobby 
        playerId={playerName || 'guest'}
        onStartGame={handleStartMultiplayer}
        onBack={() => {
          setMultiplayerMode(false);
          window.history.replaceState({}, '', '/');
        }}
      />
    );
  }

  if (multiplayerMode && multiplayerRoomId) {
    return (
      <MultiplayerGame 
        roomId={multiplayerRoomId}
        playerId={playerName || 'guest'}
        isPlayer1={isPlayer1}
        onGameOver={handleMultiplayerGameOver}
      />
    );
  }

  return <SlopeGame />;
};

export default Index;