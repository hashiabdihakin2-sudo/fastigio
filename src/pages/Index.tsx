import { useState, useEffect } from 'react';
import { SlopeGame } from "@/components/SlopeGame";
import { LocalMultiplayerGame } from "@/components/LocalMultiplayerGame";

const Index = () => {
  const [local1v1Mode, setLocal1v1Mode] = useState(false);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'local1v1') {
      setLocal1v1Mode(true);
    }
  }, []);

  const handleLocal1v1GameOver = () => {
    setLocal1v1Mode(false);
    window.history.replaceState({}, '', '/');
  };

  if (local1v1Mode) {
    return (
      <LocalMultiplayerGame 
        onGameOver={handleLocal1v1GameOver}
      />
    );
  }

  return <SlopeGame />;
};

export default Index;