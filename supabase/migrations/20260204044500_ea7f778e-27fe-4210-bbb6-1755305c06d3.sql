-- Create matchmaking queue table
CREATE TABLE public.matchmaking_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched', 'cancelled')),
  matched_room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent duplicate entries
CREATE UNIQUE INDEX matchmaking_queue_player_waiting_idx ON public.matchmaking_queue (player_id) WHERE status = 'waiting';

-- Enable RLS
ALTER TABLE public.matchmaking_queue ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can join queue" ON public.matchmaking_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view queue" ON public.matchmaking_queue FOR SELECT USING (true);
CREATE POLICY "Anyone can update queue" ON public.matchmaking_queue FOR UPDATE USING (true);
CREATE POLICY "Anyone can leave queue" ON public.matchmaking_queue FOR DELETE USING (true);

-- Enable realtime for the queue
ALTER PUBLICATION supabase_realtime ADD TABLE public.matchmaking_queue;

-- Add trigger for updated_at
CREATE TRIGGER update_matchmaking_queue_updated_at
  BEFORE UPDATE ON public.matchmaking_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();