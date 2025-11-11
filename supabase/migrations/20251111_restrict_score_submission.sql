-- Låt inte vem som helst skriva i DB
DROP POLICY IF EXISTS "Anyone can insert high scores" ON public.global_highscores;

-- Only allow inserts from the service role (used by Edge Functions)
CREATE POLICY "Only service role can insert high scores" 
ON public.global_highscores 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');