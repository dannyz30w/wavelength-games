-- Ensure unique room codes
CREATE UNIQUE INDEX IF NOT EXISTS rooms_code_unique ON public.rooms (code);

-- Helpful indexes for matchmaking
CREATE INDEX IF NOT EXISTS matchmaking_queue_status_created_at_idx
  ON public.matchmaking_queue (status, created_at);

CREATE INDEX IF NOT EXISTS matchmaking_queue_player_status_idx
  ON public.matchmaking_queue (player_id, status);

-- Make sure realtime can stream changes
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.rounds;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.matchmaking_queue;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Atomic matchmaking (prevents race conditions where one client gets stuck waiting)
CREATE OR REPLACE FUNCTION public.matchmake_two_player(p_player_id text, p_player_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_my_entry public.matchmaking_queue%ROWTYPE;
  v_other_entry public.matchmaking_queue%ROWTYPE;
  v_room public.rooms%ROWTYPE;
  v_room_code text;
  v_attempt int := 0;
BEGIN
  -- Serialize matchmaking to avoid races
  PERFORM pg_advisory_xact_lock(77889911);

  -- Cancel stale waiting entries
  UPDATE public.matchmaking_queue
    SET status = 'cancelled'
  WHERE status = 'waiting'
    AND created_at < now() - interval '5 minutes';

  -- Cancel any existing waiting entry for this player
  UPDATE public.matchmaking_queue
    SET status = 'cancelled'
  WHERE player_id = p_player_id
    AND status = 'waiting';

  -- Insert this player into the queue
  INSERT INTO public.matchmaking_queue (player_id, player_name, status)
  VALUES (p_player_id, p_player_name, 'waiting')
  RETURNING * INTO v_my_entry;

  -- Find the oldest other waiting player
  SELECT * INTO v_other_entry
  FROM public.matchmaking_queue
  WHERE status = 'waiting'
    AND player_id <> p_player_id
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'status', 'waiting',
      'queue_id', v_my_entry.id
    );
  END IF;

  -- Generate a unique 4-char room code (hex)
  LOOP
    v_attempt := v_attempt + 1;
    v_room_code := upper(substr(encode(gen_random_bytes(2), 'hex'), 1, 4));

    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.rooms r WHERE r.code = v_room_code);
    EXIT WHEN v_attempt >= 10;
  END LOOP;

  -- Create room
  INSERT INTO public.rooms (code, host_id, is_private, mode, status)
  VALUES (v_room_code, v_other_entry.player_id, false, 'two_player', 'waiting')
  RETURNING * INTO v_room;

  -- Mark both queue entries as matched
  UPDATE public.matchmaking_queue
    SET status = 'matched',
        matched_room_id = v_room.id
  WHERE id IN (v_my_entry.id, v_other_entry.id);

  -- Create both players immediately so each client can "join" reliably
  INSERT INTO public.players (room_id, player_id, name, is_host, role)
  VALUES
    (v_room.id, v_other_entry.player_id, v_other_entry.player_name, true, 'spectator'),
    (v_room.id, v_my_entry.player_id, p_player_name, false, 'spectator');

  RETURN jsonb_build_object(
    'status', 'matched',
    'room_code', v_room.code,
    'room_id', v_room.id,
    'host_id', v_room.host_id
  );
END;
$$;

-- Cancel matchmaking for a player
CREATE OR REPLACE FUNCTION public.cancel_matchmake(p_player_id text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.matchmaking_queue
    SET status = 'cancelled'
  WHERE player_id = p_player_id
    AND status = 'waiting';
$$;