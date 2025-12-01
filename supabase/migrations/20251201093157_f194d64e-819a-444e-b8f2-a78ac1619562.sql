-- Create table for multiplayer game rooms
CREATE TABLE public.game_rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id text NOT NULL,
  player2_id text,
  player1_position real DEFAULT 0,
  player2_position real DEFAULT 0,
  player1_score integer DEFAULT 0,
  player2_score integer DEFAULT 0,
  player1_status text DEFAULT 'waiting',
  player2_status text DEFAULT 'waiting',
  game_status text DEFAULT 'waiting',
  winner_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  started_at timestamp with time zone,
  ended_at timestamp with time zone
);

-- Enable Row Level Security
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view game rooms
CREATE POLICY "Anyone can view game rooms"
ON public.game_rooms
FOR SELECT
USING (true);

-- Allow anyone to create game rooms
CREATE POLICY "Anyone can create game rooms"
ON public.game_rooms
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update game rooms
CREATE POLICY "Anyone can update game rooms"
ON public.game_rooms
FOR UPDATE
USING (true);

-- Enable realtime for game rooms
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;