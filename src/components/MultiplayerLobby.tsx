import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { supabase } from '@/integrations/supabase/client';
import { Users, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MultiplayerLobbyProps {
  playerId: string;
  onStartGame: (roomId: string, isPlayer1: boolean) => void;
  onBack: () => void;
}

export const MultiplayerLobby = ({ playerId, onStartGame, onBack }: MultiplayerLobbyProps) => {
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const { roomId, room, isPlayer1, createRoom, joinRoom } = useMultiplayer(playerId);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase
        .from('game_rooms')
        .select()
        .eq('game_status', 'waiting')
        .is('player2_id', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) setAvailableRooms(data);
    };

    fetchRooms();

    const channel = supabase
      .channel('lobby')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rooms'
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (room && room.game_status === 'ready' && roomId) {
      setTimeout(() => {
        onStartGame(roomId, isPlayer1);
      }, 2000);
    }
  }, [room, roomId, isPlayer1, onStartGame]);

  const handleCreateRoom = async () => {
    await createRoom();
  };

  const handleJoinRoom = async (targetRoomId: string) => {
    await joinRoom(targetRoomId);
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      toast({
        title: "Kopierad!",
        description: "Rum-ID kopierat till urklipp",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (roomId && room) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center z-10">
        <Card className="p-8 max-w-md w-full space-y-6 bg-background/80 backdrop-blur">
          <div className="text-center space-y-4">
            <Users className="w-16 h-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Väntar på spelare...</h2>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">Rum-ID:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-background px-3 py-2 rounded text-sm font-mono">
                  {roomId}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyRoomId}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="font-medium">Spelare 1:</span>
                <span className="text-primary">{isPlayer1 ? 'Du' : room.player1_id.slice(0, 8)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Spelare 2:</span>
                <span className={room.player2_id ? "text-primary" : "text-muted-foreground"}>
                  {room.player2_id ? (isPlayer1 ? room.player2_id.slice(0, 8) : 'Du') : 'Väntar...'}
                </span>
              </div>
            </div>

            {room.game_status === 'ready' && (
              <div className="text-primary font-bold animate-pulse">
                Spelet startar om 2 sekunder...
              </div>
            )}
          </div>

          <Button onClick={onBack} variant="outline" className="w-full">
            Avbryt
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center z-10 overflow-y-auto p-4">
      <div className="max-w-4xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text">
            1v1 Multiplayer
          </h1>
          <p className="text-muted-foreground">Tävla mot andra spelare i realtid!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4 bg-background/80 backdrop-blur">
            <h2 className="text-xl font-bold text-foreground">Skapa rum</h2>
            <p className="text-sm text-muted-foreground">
              Skapa ett nytt rum och dela ID:t med en vän
            </p>
            <Button onClick={handleCreateRoom} className="w-full">
              Skapa nytt rum
            </Button>
          </Card>

          <Card className="p-6 space-y-4 bg-background/80 backdrop-blur">
            <h2 className="text-xl font-bold text-foreground">Tillgängliga rum</h2>
            {availableRooms.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Inga rum tillgängliga just nu
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableRooms.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-mono">{r.id.slice(0, 12)}...</p>
                      <p className="text-xs text-muted-foreground">
                        Skapad av {r.player1_id.slice(0, 8)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleJoinRoom(r.id)}
                    >
                      Gå med
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Button onClick={onBack} variant="outline" className="w-full">
          Tillbaka
        </Button>
      </div>
    </div>
  );
};