import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GameRoom {
  id: string;
  player1_id: string;
  player2_id: string | null;
  player1_position: number;
  player2_position: number;
  player1_score: number;
  player2_score: number;
  player1_status: string;
  player2_status: string;
  game_status: string;
  winner_id: string | null;
}

export const useMultiplayer = (playerId: string) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [isPlayer1, setIsPlayer1] = useState(false);
  const { toast } = useToast();

  const createRoom = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('game_rooms')
        .insert({
          player1_id: playerId,
          game_status: 'waiting'
        })
        .select()
        .single();

      if (error) throw error;

      setRoomId(data.id);
      setIsPlayer1(true);
      toast({
        title: "Rum skapat!",
        description: "Väntar på en motspelare...",
      });

      return data.id;
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Fel",
        description: "Kunde inte skapa rum",
        variant: "destructive",
      });
      return null;
    }
  }, [playerId, toast]);

  const joinRoom = useCallback(async (targetRoomId: string) => {
    try {
      const { data: existingRoom, error: fetchError } = await supabase
        .from('game_rooms')
        .select()
        .eq('id', targetRoomId)
        .single();

      if (fetchError || !existingRoom) {
        toast({
          title: "Fel",
          description: "Rummet finns inte",
          variant: "destructive",
        });
        return false;
      }

      if (existingRoom.player2_id) {
        toast({
          title: "Rummet är fullt",
          description: "Välj ett annat rum",
          variant: "destructive",
        });
        return false;
      }

      const { error: updateError } = await supabase
        .from('game_rooms')
        .update({ 
          player2_id: playerId,
          game_status: 'ready'
        })
        .eq('id', targetRoomId);

      if (updateError) throw updateError;

      setRoomId(targetRoomId);
      setIsPlayer1(false);
      toast({
        title: "Gick med i rummet!",
        description: "Spelet börjar snart...",
      });

      return true;
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Fel",
        description: "Kunde inte gå med i rummet",
        variant: "destructive",
      });
      return false;
    }
  }, [playerId, toast]);

  const updatePosition = useCallback(async (position: number) => {
    if (!roomId) return;

    const updateField = isPlayer1 ? 'player1_position' : 'player2_position';
    
    await supabase
      .from('game_rooms')
      .update({ [updateField]: position })
      .eq('id', roomId);
  }, [roomId, isPlayer1]);

  const updateScore = useCallback(async (score: number) => {
    if (!roomId) return;

    const updateField = isPlayer1 ? 'player1_score' : 'player2_score';
    
    await supabase
      .from('game_rooms')
      .update({ [updateField]: score })
      .eq('id', roomId);
  }, [roomId, isPlayer1]);

  const updateStatus = useCallback(async (status: string) => {
    if (!roomId) return;

    const updateField = isPlayer1 ? 'player1_status' : 'player2_status';
    
    await supabase
      .from('game_rooms')
      .update({ [updateField]: status })
      .eq('id', roomId);
  }, [roomId, isPlayer1]);

  const leaveRoom = useCallback(async () => {
    if (!roomId) return;

    await updateStatus('left');
    setRoomId(null);
    setRoom(null);
  }, [roomId, updateStatus]);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`game-room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          setRoom(payload.new as GameRoom);
        }
      )
      .subscribe();

    const fetchRoom = async () => {
      const { data } = await supabase
        .from('game_rooms')
        .select()
        .eq('id', roomId)
        .single();
      
      if (data) setRoom(data as GameRoom);
    };

    fetchRoom();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return {
    roomId,
    room,
    isPlayer1,
    createRoom,
    joinRoom,
    updatePosition,
    updateScore,
    updateStatus,
    leaveRoom
  };
};