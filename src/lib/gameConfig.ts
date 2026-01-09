// Scoring configuration - matches visual zones
// Red (center): 30 pts, Orange: 20 pts, Yellow: 10 pts
// Zone sizes in degrees: Red = 6°, Orange = 8° each side, Yellow = 10° each side
export const SCORING_CONFIG = {
  redHalfWidth: 3,      // 3 degrees each side from center = 6 total
  orangeWidth: 8,       // 8 degrees each side
  yellowWidth: 10,      // 10 degrees each side
  redPoints: 30,
  orangePoints: 20,
  yellowPoints: 10,
};

// Fun, niche, and easy-to-judge extreme pairs
export const EXTREME_PAIRS = [
  // Food & Drink Opinions
  { left: "Underrated Food", right: "Overrated Food" },
  { left: "Breakfast Food", right: "Midnight Snack" },
  { left: "Guilty Pleasure Meal", right: "Fancy Restaurant Order" },
  { left: "Kid's Menu Item", right: "Acquired Taste" },
  { left: "Gas Station Snack", right: "Michelin Star Dish" },
  { left: "Eaten Cold", right: "Must Be Hot" },
  { left: "Shareable", right: "Don't Touch My Food" },
  { left: "Healthy But Tasty", right: "Worth the Calories" },
  { left: "Pineapple on Pizza Hater", right: "Pineapple on Pizza Lover" },
  { left: "Coffee Addict", right: "Tea Purist" },
  
  // Entertainment & Pop Culture
  { left: "Underrated Movie", right: "Overrated Movie" },
  { left: "Enjoyable YouTuber", right: "Annoying YouTuber" },
  { left: "Binge-worthy Show", right: "Background Noise Show" },
  { left: "Rewatchable Movie", right: "One and Done" },
  { left: "Guilty Pleasure Song", right: "Objectively Good Music" },
  { left: "Iconic Villain", right: "Forgettable Villain" },
  { left: "Deserved the Hype", right: "Overhyped" },
  { left: "Comfort Rewatch", right: "Life-Changing First Watch" },
  { left: "Skippable Episode", right: "Best Episode Ever" },
  { left: "Great Soundtrack", right: "Unmemorable Music" },
  
  // Social & Personality
  { left: "Acceptable to Do Alone", right: "Weird to Do Alone" },
  { left: "Good First Date Idea", right: "Terrible First Date" },
  { left: "Small Talk Topic", right: "Deep Conversation Topic" },
  { left: "Text Back Immediately", right: "Leave on Read" },
  { left: "Chaotic Friend Energy", right: "Mom Friend Energy" },
  { left: "Early Bird Activity", right: "Night Owl Activity" },
  { left: "Introvert Recharge", right: "Extrovert Recharge" },
  { left: "Good House Guest", right: "Overstayed Welcome" },
  { left: "Replies with Memes", right: "Replies with Paragraphs" },
  { left: "Chronically Online", right: "Touched Grass Today" },
  
  // Life & Experiences
  { left: "Childhood Dream Job", right: "Adult Reality Job" },
  { left: "Worth the Money", right: "Total Ripoff" },
  { left: "Green Flag", right: "Red Flag" },
  { left: "Main Character Moment", right: "NPC Moment" },
  { left: "Peak Adulting", right: "Faking Being an Adult" },
  { left: "Life Hack", right: "Just Being Lazy" },
  { left: "Justified Splurge", right: "Financial Mistake" },
  { left: "Skill Issue", right: "Game is Broken" },
  { left: "Humble Brag", right: "Genuine Complaint" },
  { left: "Good Advice", right: "Toxic Positivity" },
  
  // Things & Objects
  { left: "Essential Item", right: "Useless Gadget" },
  { left: "Status Symbol", right: "Actually Practical" },
  { left: "Aesthetic Purchase", right: "Functional Purchase" },
  { left: "Nostalgic Item", right: "Best Left in the Past" },
  { left: "DIY Project", right: "Just Buy It" },
  { left: "Gift Card Territory", right: "Thoughtful Gift Only" },
  { left: "IKEA Nightmare", right: "Surprisingly Easy Assembly" },
  { left: "Keeps Forever", right: "Throws Away Immediately" },
  
  // Places & Travel
  { left: "Tourist Trap", right: "Hidden Gem" },
  { left: "Vacation Destination", right: "Would Live There" },
  { left: "Instagram vs Reality", right: "Looks Better in Person" },
  { left: "Road Trip Worthy", right: "Fly There Only" },
  { left: "Cozy Vibes", right: "Party Destination" },
  { left: "Bucket List Destination", right: "Overrated Location" },
  { left: "Off the Beaten Path", right: "Basic Tourist Spot" },
  
  // Activities & Hobbies
  { left: "Relaxing Activity", right: "Secretly Stressful" },
  { left: "Fun in Theory", right: "Fun in Practice" },
  { left: "Solo Activity", right: "Needs a Group" },
  { left: "Cheap Hobby", right: "Money Pit Hobby" },
  { left: "Productive Procrastination", right: "Pure Procrastination" },
  { left: "Personality Trait Hobby", right: "Just a Hobby" },
  { left: "Would Try Once", right: "Do Every Weekend" },
  { left: "Requires Talent", right: "Anyone Can Learn" },
  
  // Opinions & Judgments  
  { left: "Valid Opinion", right: "Wrong Opinion" },
  { left: "Hot Take", right: "Room Temperature Take" },
  { left: "Based Take", right: "Cringe Take" },
  { left: "Controversial Opinion", right: "Everyone Agrees" },
  { left: "Aging Well", right: "Aging Poorly" },
  { left: "Peak Fiction", right: "Mid at Best" },
  { left: "Iconic", right: "Trying Too Hard" },
  { left: "Timeless", right: "Dated" },
  
  // Internet & Tech
  { left: "Reply All Offense", right: "Acceptable Reply All" },
  { left: "Good Meme", right: "Dead Meme" },
  { left: "Worth the Subscription", right: "Cancel Immediately" },
  { left: "Acceptable Screen Time", right: "Touch Grass Needed" },
  { left: "Actually Useful App", right: "Deleted After a Day" },
  { left: "Good WiFi Name", right: "Boring WiFi Name" },
  { left: "Notification On", right: "Immediately Muted" },
  
  // Work & Productivity
  { left: "Dream Job", right: "Nightmare Job" },
  { left: "Work From Home Win", right: "Office Only Task" },
  { left: "Meeting That Could Be an Email", right: "Valuable Meeting" },
  { left: "Monday Energy", right: "Friday Energy" },
  { left: "Career Advice Worth Taking", right: "Boomer Career Advice" },
  { left: "LinkedIn Cringe", right: "Actually Inspiring" },
  { left: "Side Hustle Energy", right: "9 to 5 Loyalty" },
  
  // Aesthetic & Style
  { left: "Pinterest Aesthetic", right: "Real Life Aesthetic" },
  { left: "Outfit Repeat Worthy", right: "One Time Only" },
  { left: "Effortlessly Cool", right: "Trying Too Hard" },
  { left: "Minimalist Chic", right: "Maximalist Chaos" },
  { left: "Timeless Style", right: "Trendy Right Now" },
  { left: "Dress for Comfort", right: "Dress to Impress" },
  
  // Relationships & Dating
  { left: "Swipe Right", right: "Swipe Left" },
  { left: "Dating App Gold", right: "Walking Red Flag" },
  { left: "Marriage Material", right: "Situationship Energy" },
  { left: "Meet the Parents Ready", right: "Secret for Now" },
  { left: "Couple Goals", right: "Codependent Behavior" },
  { left: "Healthy Boundary", right: "Playing Games" },
  
  // Animals & Nature
  { left: "Would Pet", right: "Would Run From" },
  { left: "Cute Animal", right: "Objectively Terrifying" },
  { left: "Ideal Pet", right: "Wild Animal Only" },
  { left: "Instagram Pet", right: "Chaotic Pet Energy" },
  { left: "Dog Person Energy", right: "Cat Person Energy" },
  
  // Misc Fun Categories
  { left: "Before Coffee", right: "After Coffee" },
  { left: "Airport Appropriate", right: "Home Only" },
  { left: "Acceptable Excuse", right: "Nobody Believes You" },
  { left: "Good Plot Twist", right: "Saw It Coming" },
  { left: "Satisfying Ending", right: "Ruined the Whole Thing" },
  { left: "Quotable Line", right: "Instantly Forgettable" },
  { left: "Core Memory", right: "Already Forgot" },
  { left: "Would Time Travel For", right: "Good Riddance" },
  { left: "Therapy Worthy Topic", right: "Just Get Over It" },
  { left: "Deserves a Documentary", right: "Not That Deep" },
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
  const width = 20; // Fixed width, not really used anymore but kept for compatibility
  
  // Zone half-width in degrees: 3 (red) + 8 (orange) + 10 (yellow) = 21°
  // Target angle must be between 21° and 159° (180 - 21) to keep zones visible
  // In 0-100 scale: min = (21/180)*100 ≈ 12, max = (159/180)*100 ≈ 88
  const minCenter = 15; // Slightly more margin for safety
  const maxCenter = 85;
  const center = Math.floor(Math.random() * (maxCenter - minCenter + 1)) + minCenter;
  
  return { center, width };
};

// Get random extreme pair
export const getRandomExtremes = (): { left: string; right: string } => {
  return EXTREME_PAIRS[Math.floor(Math.random() * EXTREME_PAIRS.length)];
};

// Calculate score based on guess angle vs target angle
// Uses the same zone sizes as the visual: red=6°, orange=8° each side, yellow=10° each side
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
