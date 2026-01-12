import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Round } from "@/lib/gameTypes";

export const useRoundHistory = (roomId: string | undefined) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRounds = useCallback(async () => {
    if (!roomId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("rounds")
        .select("*")
        .eq("room_id", roomId)
        .order("round_number", { ascending: true });

      if (error) throw error;
      setRounds((data || []) as Round[]);
    } catch (error) {
      console.error("Error fetching rounds:", error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchRounds();
  }, [fetchRounds]);

  // Subscribe to round changes
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`round-history-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rounds",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          fetchRounds();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, fetchRounds]);

  return { rounds, isLoading, refetch: fetchRounds };
};
