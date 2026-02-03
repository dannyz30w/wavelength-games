// Scoring configuration - matches visual zones
// Red (center): 30 pts, Orange: 20 pts, Yellow: 10 pts
// Zone sizes in degrees: Red = 4°, Orange = 6° each side, Yellow = 8° each side (3/4 original size)
export const SCORING_CONFIG = {
  redHalfWidth: 2,      // 2 degrees each side from center = 4 total
  orangeWidth: 6,       // 6 degrees each side
  yellowWidth: 8,       // 8 degrees each side
  redPoints: 30,
  orangePoints: 20,
  yellowPoints: 10,
};

// Fun prompts - 150 pairs
export const EXTREME_PAIRS = [
  { left: "Worst superpower", right: "Best superpower" },
  { left: "Totally useless", right: "Super valuable" },
  { left: "Boring date idea", right: "Amazing date idea" },
  { left: "Weak villain", right: "Terrifying villain" },
  { left: "Terrible pizza topping", right: "Perfect pizza topping" },
  { left: "Mild inconvenience", right: "Total disaster" },
  { left: "Lazy pet", right: "Chaotic pet" },
  { left: "Cringe pickup line", right: "Smooth pickup line" },
  { left: "Worst gift", right: "Best gift" },
  { left: "Childish", right: "Mature" },
  { left: "Underrated", right: "Overrated" },
  { left: "Boring hobby", right: "Exciting hobby" },
  { left: "Terrible band name", right: "Epic band name" },
  { left: "Weak excuse", right: "Valid excuse" },
  { left: "Dying first in horror movie", right: "Surviving horror movie" },
  { left: "Bad roommate trait", right: "Good roommate trait" },
  { left: "Worst sandwich", right: "Best sandwich" },
  { left: "Mild fear", right: "Terrifying fear" },
  { left: "Awkward", right: "Confident" },
  { left: "Bad tattoo idea", right: "Cool tattoo idea" },
  { left: "Boring emoji", right: "Best emoji" },
  { left: "Bad first impression", right: "Great first impression" },
  { left: "Worst cereal", right: "Best cereal" },
  { left: "Lame party trick", right: "Impressive party trick" },
  { left: "Forgettable", right: "Unforgettable" },
  { left: "Bad ice cream flavor", right: "Amazing ice cream flavor" },
  { left: "Weak apology", right: "Sincere apology" },
  { left: "Worst road trip snack", right: "Best road trip snack" },
  { left: "Boring sport", right: "Exciting sport" },
  { left: "Bad text response", right: "Good text response" },
  { left: "Terrible movie genre", right: "Best movie genre" },
  { left: "Mild annoyance", right: "Rage-inducing" },
  { left: "Bad karaoke song", right: "Perfect karaoke song" },
  { left: "Useless skill", right: "Impressive skill" },
  { left: "Bad haircut", right: "Great haircut" },
  { left: "Worst candy", right: "Best candy" },
  { left: "Boring vacation", right: "Dream vacation" },
  { left: "Weak coffee", right: "Strong coffee" },
  { left: "Bad advice", right: "Life-changing advice" },
  { left: "Terrible restaurant name", right: "Great restaurant name" },
  { left: "Not spicy", right: "Extremely spicy" },
  { left: "Bad dance move", right: "Sick dance move" },
  { left: "Lazy Sunday activity", right: "Productive Sunday activity" },
  { left: "Bad icebreaker", right: "Good icebreaker" },
  { left: "Mild injury", right: "Serious injury" },
  { left: "Worst breakfast", right: "Best breakfast" },
  { left: "Awkward hug", right: "Perfect hug" },
  { left: "Boring podcast topic", right: "Fascinating podcast topic" },
  { left: "Bad party theme", right: "Fun party theme" },
  { left: "Worst drink order", right: "Best drink order" },
  { left: "Mild embarrassment", right: "Mortifying embarrassment" },
  { left: "Terrible nickname", right: "Cool nickname" },
  { left: "Bad outfit choice", right: "Fire outfit" },
  { left: "Mild weather", right: "Extreme weather" },
  { left: "Bad meme", right: "Top tier meme" },
  { left: "Worst way to wake up", right: "Best way to wake up" },
  { left: "Awkward conversation", right: "Deep conversation" },
  { left: "Terrible Christmas gift", right: "Amazing Christmas gift" },
  { left: "Boring TikTok", right: "Viral TikTok" },
  { left: "Worst condiment", right: "Best condiment" },
  { left: "Mild pain", right: "Excruciating pain" },
  { left: "Terrible pet name", right: "Cute pet name" },
  { left: "Boring board game", right: "Addictive board game" },
  { left: "Worst fast food", right: "Best fast food" },
  { left: "Bad flirting technique", right: "Smooth flirting" },
  { left: "Boring car", right: "Dream car" },
  { left: "Worst office snack", right: "Best office snack" },
  { left: "Awkward photo", right: "Instagram-worthy photo" },
  { left: "Bad video game", right: "Masterpiece video game" },
  { left: "Terrible life hack", right: "Genius life hack" },
  { left: "Bad Netflix show", right: "Addictive Netflix show" },
  { left: "Worst shoes", right: "Best shoes" },
  { left: "Bad comeback", right: "Devastating comeback" },
  { left: "Terrible Halloween costume", right: "Epic Halloween costume" },
  { left: "Mild annoyance", right: "Deal breaker" },
  { left: "Worst frozen food", right: "Best frozen food" },
  { left: "Bad movie sequel", right: "Better than original sequel" },
  { left: "Terrible bucket list item", right: "Must-do bucket list item" },
  { left: "Bad high five", right: "Perfect high five" },
  { left: "Worst energy drink", right: "Best energy drink" },
  { left: "Not cringe", right: "Maximum cringe" },
  { left: "Bad dad joke", right: "Legendary dad joke" },
  { left: "Worst sauce", right: "Best sauce" },
  { left: "Bad conspiracy theory", right: "Believable conspiracy theory" },
  { left: "Boring class", right: "Interesting class" },
  { left: "Worst chip flavor", right: "Best chip flavor" },
  { left: "Bad concert experience", right: "Best concert experience" },
  { left: "Worst salad", right: "Delicious salad" },
  { left: "Boring tradition", right: "Fun tradition" },
  { left: "Terrible New Year's resolution", right: "Achievable resolution" },
  { left: "Small insult", right: "Brutal roast" },
  { left: "Worst type of weather", right: "Perfect weather" },
  { left: "Boring documentary", right: "Gripping documentary" },
  { left: "Worst gum flavor", right: "Best gum flavor" },
  { left: "Small drama", right: "Major drama" },
  { left: "Terrible road trip game", right: "Fun road trip game" },
  { left: "Worst leftover food", right: "Better as leftovers" },
  { left: "Awkward goodbye", right: "Sweet goodbye" },
  { left: "Terrible sleeping position", right: "Comfortable sleeping position" },
  { left: "Worst hot sauce", right: "Best hot sauce" },
  { left: "Mild surprise", right: "Shocking surprise" },
  { left: "Terrible white elephant gift", right: "Everyone fights for it" },
  { left: "Worst smoothie", right: "Perfect smoothie" },
  { left: "Worst cookie", right: "Best cookie" },
  { left: "Boring commute", right: "Scenic commute" },
  { left: "Worst coffee order", right: "Elite coffee order" },
  { left: "Awkward wave", right: "Cool wave" },
  { left: "Terrible party snack", right: "Party favorite snack" },
  { left: "Worst burrito", right: "Perfect burrito" },
  { left: "Mild disappointment", right: "Crushing disappointment" },
  { left: "Boring mascot", right: "Hype mascot" },
  { left: "Bad fist bump", right: "Perfect fist bump" },
  { left: "Worst popcorn flavor", right: "Best popcorn flavor" },
  { left: "Awkward small talk", right: "Engaging small talk" },
  { left: "Bad group project partner", right: "Carries the team partner" },
  { left: "Mild headache", right: "Migraine" },
  { left: "Worst taco", right: "Perfect taco" },
  { left: "Boring lecture", right: "Engaging lecture" },
  { left: "Worst ramen flavor", right: "Best ramen flavor" },
  { left: "Mild regret", right: "Haunting regret" },
  { left: "Worst nap", right: "Perfect nap" },
  { left: "Awkward exit", right: "Smooth exit" },
  { left: "Mild anger", right: "Pure rage" },
  { left: "Worst leftovers", right: "Slaps reheated" },
  { left: "Bad joke", right: "Hilarious joke" },
  { left: "Terrible movie", right: "Masterpiece movie" },
  { left: "Boring app", right: "Addictive app" },
  { left: "Worst topping", right: "Best topping" },
  { left: "Bad song", right: "Perfect song" },
  { left: "Terrible smell", right: "Amazing smell" },
  { left: "Boring color", right: "Best color" },
  { left: "Worst pet", right: "Best pet" },
  { left: "Bad restaurant", right: "Amazing restaurant" },
  { left: "Terrible haircut", right: "Perfect haircut" },
  { left: "Boring job", right: "Dream job" },
  { left: "Worst season", right: "Best season" },
  { left: "Bad phone", right: "Perfect phone" },
  { left: "Terrible vacation spot", right: "Dream destination" },
  { left: "Boring website", right: "Can't stop scrolling" },
  { left: "Worst drink", right: "Best drink" },
  { left: "Bad friend trait", right: "Best friend trait" },
  { left: "Terrible way to die", right: "Peaceful way to die" },
  { left: "Boring superpower", right: "Godlike superpower" },
  { left: "Worst excuse", right: "Perfect excuse" },
  { left: "Bad compliment", right: "Best compliment" },
  { left: "Terrible punishment", right: "Deserved punishment" },
  { left: "Boring activity", right: "Thrilling activity" },
  { left: "Worst smell", right: "Best smell" },
  { left: "Bad motivation", right: "Inspiring motivation" },
  { left: "Terrible snack", right: "Perfect snack" },
];

// Game constants
export const GAME_CONSTANTS = {
  MIN_TARGET_WIDTH: 15,
  MAX_TARGET_WIDTH: 25,
  ROOM_CODE_LENGTH: 4,
  PASSWORD_LENGTH: 4,
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

// Generate a random password for private rooms
export const generatePassword = (): string => {
  const chars = "0123456789";
  let password = "";
  for (let i = 0; i < GAME_CONSTANTS.PASSWORD_LENGTH; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Generate a random target - now can be at far ends
export const generateTarget = (): { center: number; width: number } => {
  const width = 20;
  
  // Allow targets at far ends now (5-95 range)
  const minCenter = 5;
  const maxCenter = 95;
  const center = Math.floor(Math.random() * (maxCenter - minCenter + 1)) + minCenter;
  
  return { center, width };
};

// Get random extreme pair
export const getRandomExtremes = (): { left: string; right: string } => {
  return EXTREME_PAIRS[Math.floor(Math.random() * EXTREME_PAIRS.length)];
};

// Calculate score based on guess angle vs target angle
// Uses the same zone sizes as the visual: red=4°, orange=6° each side, yellow=8° each side
export const calculateScore = (
  guessValue: number,  // 0-100 scale
  targetCenter: number, // 0-100 scale
  _targetWidth: number  // unused, kept for compatibility
): number => {
  // Convert both to angle (0-180 degrees)
  const guessAngle = (guessValue / 100) * 180;
  const targetAngle = (targetCenter / 100) * 180;
  
  // Calculate angular distance
  const distance = Math.abs(guessAngle - targetAngle);
  
  const { redHalfWidth, orangeWidth, yellowWidth, redPoints, orangePoints, yellowPoints } = SCORING_CONFIG;
  
  // Red zone (center bullseye)
  if (distance <= redHalfWidth) {
    return redPoints; // 30 points
  }
  
  // Orange zone
  if (distance <= redHalfWidth + orangeWidth) {
    return orangePoints; // 20 points
  }
  
  // Yellow zone
  if (distance <= redHalfWidth + orangeWidth + yellowWidth) {
    return yellowPoints; // 10 points
  }
  
  // Miss
  return 0;
};

// Generate a unique player ID
export const generatePlayerId = (): string => {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
