import { supabase } from "@/integrations/supabase/client";

export type MatchmakeTwoPlayerResult =
  | { status: "waiting"; queue_id: string }
  | { status: "matched"; room_code: string; room_id?: string }
  | { status: "error"; message: string };

export async function matchmakeTwoPlayer(playerId: string, playerName: string): Promise<MatchmakeTwoPlayerResult> {
  const { data, error } = await supabase.functions.invoke("matchmake", {
    body: {
      action: "match",
      playerId,
      playerName,
    },
  });

  if (error) return { status: "error", message: error.message };
  return (data ?? { status: "error", message: "No response" }) as MatchmakeTwoPlayerResult;
}

export async function cancelMatchmake(playerId: string): Promise<void> {
  await supabase.functions.invoke("matchmake", {
    body: {
      action: "cancel",
      playerId,
    },
  });
}
