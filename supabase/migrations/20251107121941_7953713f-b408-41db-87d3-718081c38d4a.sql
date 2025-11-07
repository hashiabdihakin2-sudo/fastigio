-- Create global high scores table
CREATE TABLE public.global_highscores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  skin TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.global_highscores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read high scores
CREATE POLICY "Anyone can view high scores" 
ON public.global_highscores 
FOR SELECT 
USING (true);

-- Allow anyone to insert their own high score
CREATE POLICY "Anyone can insert high scores" 
ON public.global_highscores 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster sorting by score
CREATE INDEX idx_global_highscores_score ON public.global_highscores(score DESC);

-- Enable realtime for the high scores table
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_highscores;