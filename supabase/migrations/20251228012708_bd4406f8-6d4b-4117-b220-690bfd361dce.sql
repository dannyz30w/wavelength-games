-- Create enum for room status
CREATE TYPE room_status AS ENUM ('waiting', 'playing', 'finished');

-- Create enum for player role
CREATE TYPE player_role AS ENUM ('psychic', 'guesser', 'spectator');

-- Create enum for game phase
CREATE TYPE game_phase AS ENUM ('waiting', 'psychic_viewing', 'clue_giving', 'guessing', 'predicting', 'reveal', 'complete');

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  host_id TEXT NOT NULL,
  status room_status NOT NULL DEFAULT 'waiting',
  mode TEXT NOT NULL DEFAULT 'two_player',
  is_private BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role player_role NOT NULL DEFAULT 'spectator',
  score INTEGER NOT NULL DEFAULT 0,
  is_host BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, player_id)
);

-- Create rounds table
CREATE TABLE public.rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL DEFAULT 1,
  phase game_phase NOT NULL DEFAULT 'waiting',
  psychic_id TEXT,
  target_center INTEGER,
  target_width INTEGER,
  left_extreme TEXT NOT NULL,
  right_extreme TEXT NOT NULL,
  clue TEXT,
  guess_value INTEGER,
  guesser_id TEXT,
  predicted_side TEXT,
  predictor_id TEXT,
  points_awarded INTEGER,
  prediction_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create scoring config table
CREATE TABLE public.scoring_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default scoring config
INSERT INTO public.scoring_config (name, config) VALUES (
  'default',
  '{
    "bands": [
      {"range": 0, "points": 30},
      {"range": 10, "points": 20},
      {"range": 20, "points": 10},
      {"range": 999, "points": 0}
    ],
    "predictionBonus": 1
  }'::jsonb
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoring_config ENABLE ROW LEVEL SECURITY;

-- Public read access for rooms (to see available rooms)
CREATE POLICY "Rooms are publicly readable" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can create rooms" ON public.rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rooms" ON public.rooms FOR UPDATE USING (true);

-- Public access for players
CREATE POLICY "Players are publicly readable" ON public.players FOR SELECT USING (true);
CREATE POLICY "Anyone can join as player" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update player" ON public.players FOR UPDATE USING (true);
CREATE POLICY "Anyone can leave room" ON public.players FOR DELETE USING (true);

-- Public access for rounds
CREATE POLICY "Rounds are publicly readable" ON public.rounds FOR SELECT USING (true);
CREATE POLICY "Anyone can create rounds" ON public.rounds FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rounds" ON public.rounds FOR UPDATE USING (true);

-- Public read for scoring config
CREATE POLICY "Scoring config is publicly readable" ON public.scoring_config FOR SELECT USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rounds;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for rooms
CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();