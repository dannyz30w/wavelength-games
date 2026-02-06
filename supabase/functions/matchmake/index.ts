/// <reference types="https://deno.land/x/deno@v1.44.0/tsconfig/deno.json" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as {
      action?: "match" | "cancel";
      playerId?: string;
      playerName?: string;
    };

    const action = body.action ?? "match";
    const playerId = body.playerId;

    if (!playerId) {
      return new Response(JSON.stringify({ status: "error", message: "Missing playerId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient<any>(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    if (action === "cancel") {
      await supabaseAdmin.rpc("cancel_matchmake", { p_player_id: playerId });
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const playerName = (body.playerName ?? "").trim();
    if (!playerName) {
      return new Response(JSON.stringify({ status: "error", message: "Missing playerName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabaseAdmin.rpc("matchmake_two_player", {
      p_player_id: playerId,
      p_player_name: playerName,
    });

    if (error) {
      return new Response(JSON.stringify({ status: "error", message: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data ?? { status: "error", message: "No result" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ status: "error", message: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
