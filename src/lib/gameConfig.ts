// Scoring configuration - easily tunable
// Multi-colored target zone: Red (center) = 30, Orange = 20, Yellow = 10
export const SCORING_CONFIG = {
  bands: [
    { range: 0, points: 30 },   // Red center zone (bullseye)
    { range: 5, points: 20 },   // Orange band (adjacent)
    { range: 15, points: 10 },  // Yellow band (outer)
    { range: 999, points: 0 },  // Miss
  ],
  predictionBonus: 1,
};

// Sample extreme pairs for quick demos
export const EXTREME_PAIRS = [
  { left: "Cold", right: "Hot" },
  { left: "Boring", right: "Exciting" },
  { left: "Common", right: "Rare" },
  { left: "Cheap", right: "Expensive" },
  { left: "Ugly", right: "Beautiful" },
  { left: "Weak", right: "Powerful" },
  { left: "Slow", right: "Fast" },
  { left: "Tiny", right: "Huge" },
  { left: "Ancient", right: "Modern" },
  { left: "Simple", right: "Complex" },
  { left: "Bad", right: "Good" },
  { left: "Quiet", right: "Loud" },
  { left: "Soft", right: "Hard" },
  { left: "Light", right: "Heavy" },
  { left: "Sad", right: "Happy" },
];

// Sample clues for demos (paired with extreme pairs)
export const SAMPLE_CLUES = [
  { extremes: { left: "Cold", right: "Hot" }, clue: "Ice cream", position: 15 },
  { extremes: { left: "Cold", right: "Hot" }, clue: "Coffee", position: 65 },
  { extremes: { left: "Boring", right: "Exciting" }, clue: "Tax returns", position: 5 },
  { extremes: { left: "Boring", right: "Exciting" }, clue: "Roller coaster", position: 90 },
  { extremes: { left: "Common", right: "Rare" }, clue: "Salt", position: 10 },
  { extremes: { left: "Common", right: "Rare" }, clue: "Unicorn", position: 95 },
];

// Game constants
export const GAME_CONSTANTS = {
  MIN_TARGET_WIDTH: 15,
  MAX_TARGET_WIDTH: 25,
  ROOM_CODE_LENGTH: 4,
  MAX_PLAYERS_TWO_PLAYER: 2,
  MAX_CLUE_LENGTH: 100,
};

// Generate a random room code
export const generateRoomCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < GAME_CONSTANTS.ROOM_CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Generate a random target
export const generateTarget = (): { center: number; width: number } => {
  const width = Math.floor(
    Math.random() * (GAME_CONSTANTS.MAX_TARGET_WIDTH - GAME_CONSTANTS.MIN_TARGET_WIDTH + 1)
  ) + GAME_CONSTANTS.MIN_TARGET_WIDTH;
  
  // Ensure target doesn't go off edges
  const minCenter = width / 2 + 5;
  const maxCenter = 100 - width / 2 - 5;
  const center = Math.floor(Math.random() * (maxCenter - minCenter + 1)) + minCenter;
  
  return { center, width };
};

// Get random extreme pair
export const getRandomExtremes = (): { left: string; right: string } => {
  return EXTREME_PAIRS[Math.floor(Math.random() * EXTREME_PAIRS.length)];
};

// Calculate score based on guess and target
export const calculateScore = (
  guessValue: number,
  targetCenter: number,
  targetWidth: number
): number => {
  const targetStart = targetCenter - targetWidth / 2;
  const targetEnd = targetCenter + targetWidth / 2;
  
  // Check if guess is within target
  if (guessValue >= targetStart && guessValue <= targetEnd) {
    return SCORING_CONFIG.bands[0].points;
  }
  
  // Calculate distance from target
  const distance = guessValue < targetStart 
    ? targetStart - guessValue 
    : guessValue - targetEnd;
  
  // Find appropriate band
  for (const band of SCORING_CONFIG.bands) {
    if (distance <= band.range) {
      return band.points;
    }
  }
  
  return 0;
};

// Determine which side the target is relative to the guess
export const getTargetSide = (
  guessValue: number,
  targetCenter: number
): "left" | "right" | "exact" => {
  if (Math.abs(guessValue - targetCenter) < 1) return "exact";
  return guessValue < targetCenter ? "right" : "left";
};

// Generate a unique player ID
export const generatePlayerId = (): string => {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
