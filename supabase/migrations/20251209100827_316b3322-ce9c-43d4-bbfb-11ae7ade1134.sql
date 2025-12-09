-- Create table for 1v1 multiplayer highscores
CREATE TABLE public.multiplayer_highscores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  winner_name TEXT NOT NULL,
  winner_score INTEGER NOT NULL,
  loser_name TEXT NOT NULL,
  loser_score INTEGER NOT NULL,
  winner_skin TEXT NOT NULL,
  loser_skin TEXT NOT NULL,
  week_year TEXT DEFAULT to_char((CURRENT_DATE)::timestamp with time zone, 'IYYY-IW'::text)
);

-- Enable Row Level Security
ALTER TABLE public.multiplayer_highscores ENABLE ROW LEVEL SECURITY;

-- Anyone can view highscores
CREATE POLICY "Anyone can view multiplayer highscores"
ON public.multiplayer_highscores
FOR SELECT
USING (true);

-- Anyone can insert highscores
CREATE POLICY "Anyone can insert multiplayer highscores"
ON public.multiplayer_highscores
FOR INSERT
WITH CHECK (true);