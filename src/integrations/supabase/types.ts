export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      matchmaking_queue: {
        Row: {
          created_at: string
          id: string
          matched_room_id: string | null
          player_id: string
          player_name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          matched_room_id?: string | null
          player_id: string
          player_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          matched_room_id?: string | null
          player_id?: string
          player_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matchmaking_queue_matched_room_id_fkey"
            columns: ["matched_room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          id: string
          is_host: boolean
          joined_at: string
          name: string
          player_id: string
          role: Database["public"]["Enums"]["player_role"]
          room_id: string
          score: number
        }
        Insert: {
          id?: string
          is_host?: boolean
          joined_at?: string
          name: string
          player_id: string
          role?: Database["public"]["Enums"]["player_role"]
          room_id: string
          score?: number
        }
        Update: {
          id?: string
          is_host?: boolean
          joined_at?: string
          name?: string
          player_id?: string
          role?: Database["public"]["Enums"]["player_role"]
          room_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          code: string
          created_at: string
          host_id: string
          id: string
          is_private: boolean
          mode: string
          password: string | null
          status: Database["public"]["Enums"]["room_status"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          host_id: string
          id?: string
          is_private?: boolean
          mode?: string
          password?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          host_id?: string
          id?: string
          is_private?: boolean
          mode?: string
          password?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          updated_at?: string
        }
        Relationships: []
      }
      rounds: {
        Row: {
          clue: string | null
          completed_at: string | null
          created_at: string
          guess_value: number | null
          guesser_id: string | null
          id: string
          left_extreme: string
          phase: Database["public"]["Enums"]["game_phase"]
          points_awarded: number | null
          predicted_side: string | null
          prediction_correct: boolean | null
          predictor_id: string | null
          psychic_id: string | null
          right_extreme: string
          room_id: string
          round_number: number
          target_center: number | null
          target_width: number | null
        }
        Insert: {
          clue?: string | null
          completed_at?: string | null
          created_at?: string
          guess_value?: number | null
          guesser_id?: string | null
          id?: string
          left_extreme: string
          phase?: Database["public"]["Enums"]["game_phase"]
          points_awarded?: number | null
          predicted_side?: string | null
          prediction_correct?: boolean | null
          predictor_id?: string | null
          psychic_id?: string | null
          right_extreme: string
          room_id: string
          round_number?: number
          target_center?: number | null
          target_width?: number | null
        }
        Update: {
          clue?: string | null
          completed_at?: string | null
          created_at?: string
          guess_value?: number | null
          guesser_id?: string | null
          id?: string
          left_extreme?: string
          phase?: Database["public"]["Enums"]["game_phase"]
          points_awarded?: number | null
          predicted_side?: string | null
          prediction_correct?: boolean | null
          predictor_id?: string | null
          psychic_id?: string | null
          right_extreme?: string
          room_id?: string
          round_number?: number
          target_center?: number | null
          target_width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rounds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      scoring_config: {
        Row: {
          config: Json
          created_at: string
          id: string
          name: string
        }
        Insert: {
          config: Json
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_matchmake: { Args: { p_player_id: string }; Returns: undefined }
      matchmake_two_player: {
        Args: { p_player_id: string; p_player_name: string }
        Returns: Json
      }
    }
    Enums: {
      game_phase:
        | "waiting"
        | "psychic_viewing"
        | "clue_giving"
        | "guessing"
        | "predicting"
        | "reveal"
        | "complete"
      player_role: "psychic" | "guesser" | "spectator"
      room_status: "waiting" | "playing" | "finished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      game_phase: [
        "waiting",
        "psychic_viewing",
        "clue_giving",
        "guessing",
        "predicting",
        "reveal",
        "complete",
      ],
      player_role: ["psychic", "guesser", "spectator"],
      room_status: ["waiting", "playing", "finished"],
    },
  },
} as const
