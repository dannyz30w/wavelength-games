import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, ArrowRight, Sparkles } from "lucide-react";

interface LobbyProps {
  onCreateRoom: (name: string, isPrivate: boolean) => Promise<string | null>;
  onJoinRoom: (code: string, name: string) => Promise<boolean>;
  isLoading: boolean;
}

export const Lobby: React.FC<LobbyProps> = ({
  onCreateRoom,
  onJoinRoom,
  isLoading,
}) => {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState<"initial" | "create" | "join">("initial");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreate = async () => {
    if (!playerName.trim()) return;
    await onCreateRoom(playerName.trim(), isPrivate);
  };

  const handleJoin = async () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    await onJoinRoom(roomCode.trim(), playerName.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-primary animate-pulse-glow" />
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight neon-text">
              WAVELENGTH
            </h1>
          </div>
          <p className="text-muted-foreground font-body text-lg">
            Read minds. Score points. Have fun.
          </p>
        </div>

        {/* Main Panel */}
        <div className="glass-panel p-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {mode === "initial" && (
            <div className="space-y-4">
              <Button
                variant="neon"
                size="xl"
                className="w-full"
                onClick={() => setMode("create")}
              >
                <Plus className="w-5 h-5" />
                Create Room
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                className="w-full"
                onClick={() => setMode("join")}
              >
                <Users className="w-5 h-5" />
                Join Room
              </Button>
            </div>
          )}

          {mode === "create" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Your Name
                </label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={20}
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPrivate}
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`
                    relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 
                    transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 
                    focus-visible:ring-primary focus-visible:ring-offset-2
                    ${isPrivate ? "bg-primary border-primary" : "bg-muted border-border"}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none block h-5 w-5 rounded-full bg-foreground shadow-lg 
                      ring-0 transition-transform duration-300
                      ${isPrivate ? "translate-x-5" : "translate-x-0.5"}
                    `}
                    style={{ marginTop: "1px" }}
                  />
                </button>
                <span className="text-sm font-body text-foreground">
                  Private Room
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setMode("initial")}
                >
                  Back
                </Button>
                <Button
                  variant="neon"
                  size="lg"
                  className="flex-1"
                  onClick={handleCreate}
                  disabled={!playerName.trim() || isLoading}
                >
                  {isLoading ? "Creating..." : "Create Room"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {mode === "join" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Your Name
                </label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={20}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Room Code
                </label>
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="XXXX"
                  maxLength={4}
                  className="text-center font-display text-2xl tracking-[0.3em] uppercase"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setMode("initial")}
                >
                  Back
                </Button>
                <Button
                  variant="neon"
                  size="lg"
                  className="flex-1"
                  onClick={handleJoin}
                  disabled={!playerName.trim() || !roomCode.trim() || isLoading}
                >
                  {isLoading ? "Joining..." : "Join Room"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          A mind-reading party game for 2+ players
        </p>
      </div>
    </div>
  );
};
