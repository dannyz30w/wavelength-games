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

// Fun prompts from user
export const EXTREME_PAIRS = [
  { left: "Underrated YouTuber", right: "Overrated YouTuber" },
  { left: "Underrated Movie", right: "Overrated Movie" },
  { left: "Underrated Song", right: "Overplayed Song" },
  { left: "Underrated App", right: "Overused App" },
  { left: "Underrated School Subject", right: "Useless School Subject" },
  { left: "Underrated Sport", right: "Boring Sport" },
  { left: "Underrated Food", right: "Gross Food" },
  { left: "Underrated Hobby", right: "Waste of Time" },
  { left: "Underrated Celebrity", right: "Annoying Celebrity" },
  { left: "Underrated Brand", right: "Cash Grab Brand" },
  { left: "Best Study Spot", right: "Worst Study Spot" },
  { left: "Best Snack", right: "Worst Snack" },
  { left: "Best Ice Cream Flavor", right: "Worst Ice Cream Flavor" },
  { left: "Best Pizza Topping", right: "Should Be Illegal" },
  { left: "Best Fast Food", right: "Barely Edible" },
  { left: "Relaxing Sound", right: "Stress-Inducing Sound" },
  { left: "Comfort Movie", right: "Hard to Sit Through" },
  { left: "Comfort Food", right: "Regret Food" },
  { left: "Comfort Outfit", right: "Embarrassing Outfit" },
  { left: "Smart Purchase", right: "Complete Ripoff" },
  { left: "Worth the Money", right: "Not Worth It" },
  { left: "Good Deal", right: "Scam" },
  { left: "Fun Party Game", right: "Party Killer" },
  { left: "Fun Class", right: "Painful Class" },
  { left: "Fun Job", right: "Soul Draining Job" },
  { left: "Useful App", right: "Phone Storage Waste" },
  { left: "Useful Skill", right: "Useless Skill" },
  { left: "Cool Trend", right: "Cringe Trend" },
  { left: "Cool Slang", right: "Embarrassing Slang" },
  { left: "Impressive Talent", right: "Weird Flex" },
  { left: "Impressive Resume Line", right: "Resume Filler" },
  { left: "Healthy Habit", right: "Annoying Habit" },
  { left: "Bad Habit", right: "Dealbreaker Habit" },
  { left: "Great Teacher Trait", right: "Terrible Teacher Trait" },
  { left: "Great Boss", right: "Nightmare Boss" },
  { left: "Ideal Vacation", right: "Stressful Trip" },
  { left: "Ideal Weather", right: "Awful Weather" },
  { left: "Easy Class", right: "GPA Destroyer" },
  { left: "Easy Test", right: "Impossible Test" },
  { left: "Good Advice", right: "Terrible Advice" },
  { left: "Helpful Feedback", right: "Personal Attack" },
  { left: "Good Gift", right: "Useless Gift" },
  { left: "Thoughtful Gift", right: "Last-Minute Gift" },
  { left: "Good Movie Ending", right: "Ruined Ending" },
  { left: "Good Plot Twist", right: "Nonsense Twist" },
  { left: "Realistic Goal", right: "Delusional Goal" },
  { left: "Ambitious", right: "Unrealistic" },
  { left: "Productive Day", right: "Wasted Day" },
  { left: "Productive Procrastination", right: "Actual Procrastination" },
  { left: "Organized Desk", right: "Disaster Desk" },
  { left: "Cool Teacher", right: "Tries Too Hard" },
  { left: "Cool Parent", right: "Embarrassing Parent" },
  { left: "Funny Joke", right: "Painfully Unfunny" },
  { left: "Clever Pun", right: "Groan-Worthy Pun" },
  { left: "Interesting Class Topic", right: "Instant Nap" },
  { left: "Interesting Podcast", right: "Background Noise" },
  { left: "Worth Watching", right: "Not Finishing" },
  { left: "Worth Reading", right: "Skimming Only" },
  { left: "Good Roommate", right: "Nightmare Roommate" },
  { left: "Good Neighbor", right: "Avoid at All Costs" },
  { left: "Useful Feature", right: "Gimmick" },
  { left: "Innovative", right: "Pointless" },
  { left: "Fair Rule", right: "Dumb Rule" },
  { left: "Necessary Rule", right: "Power Trip" },
  { left: "Calm Debate", right: "Heated Argument" },
  { left: "Friendly Roast", right: "Mean-Spirited Roast" },
  { left: "Good Team Player", right: "Carries the Team" },
  { left: "Team Liability", right: "Dead Weight" },
  { left: "Healthy Competition", right: "Toxic Competition" },
  { left: "Good School Lunch", right: "Crime Against Food" },
  { left: "Best Breakfast Food", right: "Worst Breakfast Food" },
  { left: "Easy Decision", right: "Impossible Choice" },
  { left: "Socially Acceptable", right: "Awkward" },
  { left: "Confident", right: "Arrogant" },
  { left: "Polite Honesty", right: "Brutal Honesty" },
  { left: "Productive Meeting", right: "Waste of Time Meeting" },
  { left: "Good First Impression", right: "Bad First Impression" },
  { left: "Cool Hobby", right: "Weird Hobby" },
  { left: "Smart Shortcut", right: "Lazy Shortcut" },
  { left: "Good Rule Break", right: "Bad Rule Break" },
  { left: "Worth Studying", right: "Useless Memorization" },
  { left: "Inspiring Speaker", right: "Boring Speaker" },
  { left: "Helpful Notification", right: "Annoying Notification" },
  { left: "Useful Update", right: "Ruined the App" },
  { left: "Good Username", right: "Regrettable Username" },
  { left: "Iconic Movie Scene", right: "Forgettable Scene" },
  { left: "Catchy Song", right: "Song You Skip" },
  { left: "Good School Tradition", right: "Outdated Tradition" },
  { left: "Good Trend", right: "Trend That Should End" },
  { left: "Great Sequel", right: "Unnecessary Sequel" },
  { left: "Worth Staying Up For", right: "Not Worth Losing Sleep" },
  { left: "Productive All-Nighter", right: "Bad Idea" },
  { left: "Good Group Project", right: "Nightmare Group Project" },
  { left: "Fair Grading", right: "Unfair Grading" },
  { left: "Fun Challenge", right: "Stressful Challenge" },
  { left: "Good Competition", right: "Rigged Competition" },
  { left: "Impressive Achievement", right: "Luck" },
  { left: "Good Strategy", right: "Overthinking" },
  { left: "Peak Experience", right: "Forgettable Moment" },
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
