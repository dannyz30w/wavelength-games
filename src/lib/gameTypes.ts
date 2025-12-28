export type RoomStatus = "waiting" | "playing" | "finished";
export type PlayerRole = "psychic" | "guesser" | "spectator";
export type GamePhase = "waiting" | "psychic_viewing" | "clue_giving" | "guessing" | "predicting" | "reveal" | "complete";

export interface Room {
  id: string;
  code: string;
  host_id: string;
  status: RoomStatus;
  mode: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  room_id: string;
  player_id: string;
  name: string;
  role: PlayerRole;
  score: number;
  is_host: boolean;
  joined_at: string;
}

export interface Round {
  id: string;
  room_id: string;
  round_number: number;
  phase: GamePhase;
  psychic_id: string | null;
  target_center: number | null;
  target_width: number | null;
  left_extreme: string;
  right_extreme: string;
  clue: string | null;
  guess_value: number | null;
  guesser_id: string | null;
  predicted_side: string | null;
  predictor_id: string | null;
  points_awarded: number | null;
  prediction_correct: boolean | null;
  created_at: string;
  completed_at: string | null;
}

export interface GameState {
  room: Room | null;
  players: Player[];
  currentRound: Round | null;
  myPlayer: Player | null;
}

// Real-time event payloads
export interface CreateRoomPayload {
  roomId: string;
  hostId: string;
  mode: "two_player" | "team";
}

export interface JoinRoomPayload {
  roomId: string;
  playerId: string;
  name: string;
}

export interface StartRoundPayload {
  roomId: string;
  psychicId: string;
}

export interface TargetSetPayload {
  roomId: string;
  targetCenter: number;
  targetWidth: number;
  extremes: { left: string; right: string };
}

export interface GiveCluePayload {
  roomId: string;
  psychicId: string;
  clueText: string;
}

export interface SubmitGuessPayload {
  roomId: string;
  playerId: string;
  guessValue: number;
}

export interface PredictSidePayload {
  roomId: string;
  playerId: string;
  side: "left" | "right";
}

export interface RevealResultPayload {
  roomId: string;
  targetCenter: number;
  targetWidth: number;
  guessValue: number;
  awardedPoints: number;
  predictedSideCorrect: boolean;
}
