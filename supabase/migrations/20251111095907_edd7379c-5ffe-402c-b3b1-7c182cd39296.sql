-- Add week tracking to global_highscores
ALTER TABLE global_highscores 
ADD COLUMN IF NOT EXISTS week_year TEXT DEFAULT to_char(CURRENT_DATE, 'IYYY-IW');

-- Create index for week queries
CREATE INDEX IF NOT EXISTS idx_global_highscores_week ON global_highscores(week_year);

-- Create table for premium skin unlock codes
CREATE TABLE IF NOT EXISTS public.premium_unlocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skin_id TEXT NOT NULL,
  unlock_code TEXT NOT NULL UNIQUE,
  user_identifier TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.premium_unlocks ENABLE ROW LEVEL SECURITY;

-- Anyone can check if a code is valid
CREATE POLICY "Anyone can validate unlock codes"
ON public.premium_unlocks
FOR SELECT
USING (true);

-- Create unique codes for each premium skin
INSERT INTO public.premium_unlocks (skin_id, unlock_code) VALUES
  ('diamond', 'DIAMOND2025'),
  ('cosmic', 'COSMIC2025'),
  ('legendary', 'LEGEND2025')
ON CONFLICT (unlock_code) DO NOTHING;