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

// Massive list of extreme pairs for variety
export const EXTREME_PAIRS = [
  // Temperature & Sensation
  { left: "Cold", right: "Hot" },
  { left: "Freezing", right: "Boiling" },
  { left: "Cool", right: "Warm" },
  { left: "Numb", right: "Sensitive" },
  { left: "Smooth", right: "Rough" },
  { left: "Soft", right: "Hard" },
  { left: "Wet", right: "Dry" },
  { left: "Slippery", right: "Sticky" },
  
  // Size & Scale
  { left: "Tiny", right: "Huge" },
  { left: "Microscopic", right: "Gigantic" },
  { left: "Short", right: "Tall" },
  { left: "Thin", right: "Thick" },
  { left: "Narrow", right: "Wide" },
  { left: "Shallow", right: "Deep" },
  { left: "Light", right: "Heavy" },
  { left: "Empty", right: "Full" },
  
  // Speed & Time
  { left: "Slow", right: "Fast" },
  { left: "Sluggish", right: "Lightning" },
  { left: "Ancient", right: "Futuristic" },
  { left: "Old", right: "New" },
  { left: "Vintage", right: "Modern" },
  { left: "Brief", right: "Eternal" },
  { left: "Instant", right: "Gradual" },
  { left: "Early", right: "Late" },
  
  // Emotions & Feelings
  { left: "Sad", right: "Happy" },
  { left: "Depressed", right: "Ecstatic" },
  { left: "Calm", right: "Angry" },
  { left: "Relaxed", right: "Stressed" },
  { left: "Bored", right: "Excited" },
  { left: "Fearful", right: "Brave" },
  { left: "Shy", right: "Confident" },
  { left: "Lonely", right: "Popular" },
  { left: "Hopeless", right: "Hopeful" },
  { left: "Apathetic", right: "Passionate" },
  
  // Quality & Value
  { left: "Bad", right: "Good" },
  { left: "Terrible", right: "Amazing" },
  { left: "Cheap", right: "Expensive" },
  { left: "Worthless", right: "Priceless" },
  { left: "Fake", right: "Authentic" },
  { left: "Broken", right: "Perfect" },
  { left: "Flawed", right: "Flawless" },
  { left: "Basic", right: "Premium" },
  
  // Appearance
  { left: "Ugly", right: "Beautiful" },
  { left: "Plain", right: "Fancy" },
  { left: "Dull", right: "Shiny" },
  { left: "Dark", right: "Bright" },
  { left: "Pale", right: "Colorful" },
  { left: "Invisible", right: "Obvious" },
  { left: "Hidden", right: "Exposed" },
  { left: "Blurry", right: "Sharp" },
  
  // Sound
  { left: "Quiet", right: "Loud" },
  { left: "Silent", right: "Deafening" },
  { left: "Whisper", right: "Scream" },
  { left: "Muffled", right: "Clear" },
  { left: "Monotone", right: "Musical" },
  { left: "Annoying", right: "Soothing" },
  
  // Taste & Food
  { left: "Bitter", right: "Sweet" },
  { left: "Bland", right: "Spicy" },
  { left: "Sour", right: "Sugary" },
  { left: "Disgusting", right: "Delicious" },
  { left: "Healthy", right: "Junk" },
  { left: "Raw", right: "Cooked" },
  { left: "Fresh", right: "Rotten" },
  { left: "Diet", right: "Indulgent" },
  
  // Difficulty & Complexity  
  { left: "Easy", right: "Hard" },
  { left: "Simple", right: "Complex" },
  { left: "Obvious", right: "Mysterious" },
  { left: "Clear", right: "Confusing" },
  { left: "Beginner", right: "Expert" },
  { left: "Amateur", right: "Professional" },
  { left: "Basic", right: "Advanced" },
  { left: "Intuitive", right: "Technical" },
  
  // Social & Status
  { left: "Unknown", right: "Famous" },
  { left: "Unpopular", right: "Trending" },
  { left: "Niche", right: "Mainstream" },
  { left: "Underground", right: "Commercial" },
  { left: "Outcast", right: "Celebrity" },
  { left: "Forgettable", right: "Iconic" },
  { left: "Common", right: "Rare" },
  { left: "Ordinary", right: "Legendary" },
  
  // Morality & Ethics
  { left: "Evil", right: "Good" },
  { left: "Villain", right: "Hero" },
  { left: "Illegal", right: "Legal" },
  { left: "Sinful", right: "Virtuous" },
  { left: "Corrupt", right: "Honest" },
  { left: "Cruel", right: "Kind" },
  { left: "Selfish", right: "Generous" },
  { left: "Guilty", right: "Innocent" },
  
  // Power & Strength
  { left: "Weak", right: "Powerful" },
  { left: "Fragile", right: "Indestructible" },
  { left: "Helpless", right: "Capable" },
  { left: "Useless", right: "Useful" },
  { left: "Ineffective", right: "Devastating" },
  { left: "Harmless", right: "Dangerous" },
  { left: "Safe", right: "Risky" },
  { left: "Tame", right: "Wild" },
  
  // Intelligence & Knowledge
  { left: "Stupid", right: "Genius" },
  { left: "Ignorant", right: "Wise" },
  { left: "Clueless", right: "Informed" },
  { left: "Naive", right: "Experienced" },
  { left: "Foolish", right: "Clever" },
  { left: "Irrational", right: "Logical" },
  { left: "Fantasy", right: "Reality" },
  { left: "Myth", right: "Fact" },
  
  // Age & Maturity
  { left: "Childish", right: "Mature" },
  { left: "Juvenile", right: "Adult" },
  { left: "Immature", right: "Sophisticated" },
  { left: "Rookie", right: "Veteran" },
  { left: "Fresh", right: "Seasoned" },
  { left: "Newborn", right: "Ancient" },
  
  // Nature & Environment
  { left: "Natural", right: "Artificial" },
  { left: "Organic", right: "Synthetic" },
  { left: "Rural", right: "Urban" },
  { left: "Wild", right: "Domesticated" },
  { left: "Polluted", right: "Pure" },
  { left: "Desert", right: "Jungle" },
  { left: "Mountain", right: "Ocean" },
  { left: "Earth", right: "Space" },
  
  // Style & Fashion
  { left: "Casual", right: "Formal" },
  { left: "Messy", right: "Neat" },
  { left: "Shabby", right: "Elegant" },
  { left: "Conservative", right: "Provocative" },
  { left: "Classic", right: "Trendy" },
  { left: "Minimalist", right: "Maximalist" },
  { left: "Subtle", right: "Flashy" },
  { left: "Understated", right: "Extravagant" },
  
  // Behavior & Personality
  { left: "Lazy", right: "Hardworking" },
  { left: "Passive", right: "Aggressive" },
  { left: "Introverted", right: "Extroverted" },
  { left: "Reserved", right: "Outgoing" },
  { left: "Serious", right: "Playful" },
  { left: "Rigid", right: "Flexible" },
  { left: "Pessimistic", right: "Optimistic" },
  { left: "Skeptical", right: "Gullible" },
  
  // Art & Entertainment
  { left: "Boring", right: "Entertaining" },
  { left: "Tragedy", right: "Comedy" },
  { left: "Drama", right: "Action" },
  { left: "Realistic", right: "Fantastical" },
  { left: "Indie", right: "Blockbuster" },
  { left: "Cult", right: "Mainstream" },
  { left: "Underrated", right: "Overrated" },
  { left: "Flop", right: "Hit" },
  
  // Technology
  { left: "Analog", right: "Digital" },
  { left: "Obsolete", right: "Cutting Edge" },
  { left: "Manual", right: "Automated" },
  { left: "Offline", right: "Online" },
  { left: "Hardware", right: "Software" },
  { left: "Wired", right: "Wireless" },
  { left: "Broken", right: "Working" },
  { left: "Buggy", right: "Polished" },
  
  // Food & Drink
  { left: "Breakfast", right: "Dinner" },
  { left: "Appetizer", right: "Dessert" },
  { left: "Snack", right: "Feast" },
  { left: "Water", right: "Alcohol" },
  { left: "Coffee", right: "Tea" },
  { left: "Vegetarian", right: "Carnivore" },
  { left: "Homemade", right: "Restaurant" },
  { left: "Fast Food", right: "Gourmet" },
  
  // Sports & Activities
  { left: "Relaxing", right: "Exhausting" },
  { left: "Solo", right: "Team" },
  { left: "Indoor", right: "Outdoor" },
  { left: "Beginner", right: "Olympic" },
  { left: "Recreational", right: "Competitive" },
  { left: "Mental", right: "Physical" },
  { left: "Strategy", right: "Luck" },
  { left: "Practice", right: "Performance" },
  
  // Relationships
  { left: "Stranger", right: "Soulmate" },
  { left: "Enemy", right: "Best Friend" },
  { left: "Acquaintance", right: "Family" },
  { left: "Distant", right: "Intimate" },
  { left: "Toxic", right: "Healthy" },
  { left: "Temporary", right: "Permanent" },
  { left: "Casual", right: "Committed" },
  { left: "Platonic", right: "Romantic" },
  
  // Work & Career
  { left: "Unemployed", right: "CEO" },
  { left: "Intern", right: "Executive" },
  { left: "Part Time", right: "Workaholic" },
  { left: "Blue Collar", right: "White Collar" },
  { left: "Freelance", right: "Corporate" },
  { left: "Startup", right: "Fortune 500" },
  { left: "Passion", right: "Paycheck" },
  { left: "Creative", right: "Analytical" },
  
  // Weather & Climate
  { left: "Cloudy", right: "Sunny" },
  { left: "Rainy", right: "Drought" },
  { left: "Stormy", right: "Calm" },
  { left: "Winter", right: "Summer" },
  { left: "Arctic", right: "Tropical" },
  { left: "Humid", right: "Arid" },
  { left: "Windy", right: "Still" },
  { left: "Foggy", right: "Clear" },
  
  // Animals
  { left: "Predator", right: "Prey" },
  { left: "Pet", right: "Wild Beast" },
  { left: "Insect", right: "Mammal" },
  { left: "Herbivore", right: "Carnivore" },
  { left: "Nocturnal", right: "Diurnal" },
  { left: "Aquatic", right: "Land" },
  { left: "Endangered", right: "Overpopulated" },
  { left: "Cute", right: "Terrifying" },
  
  // Music
  { left: "Acoustic", right: "Electronic" },
  { left: "Classical", right: "Modern" },
  { left: "Slow Jam", right: "Banger" },
  { left: "Sad Song", right: "Party Anthem" },
  { left: "Deep Cut", right: "Hit Single" },
  { left: "Live", right: "Studio" },
  { left: "Instrumental", right: "Vocal" },
  { left: "Chill", right: "Hype" },
  
  // Places
  { left: "Hometown", right: "Foreign" },
  { left: "Cozy", right: "Grand" },
  { left: "Crowded", right: "Secluded" },
  { left: "Cheap", right: "Luxurious" },
  { left: "Touristy", right: "Hidden Gem" },
  { left: "Dangerous", right: "Paradise" },
  { left: "Boring", right: "Adventure" },
  { left: "Familiar", right: "Exotic" },
  
  // Misc Contrasts
  { left: "Failure", right: "Success" },
  { left: "Nightmare", right: "Dream" },
  { left: "Curse", right: "Blessing" },
  { left: "Problem", right: "Solution" },
  { left: "Question", right: "Answer" },
  { left: "Beginning", right: "End" },
  { left: "Cause", right: "Effect" },
  { left: "Theory", right: "Proof" },
  
  // Pop Culture
  { left: "Villain Origin", right: "Hero Origin" },
  { left: "Sequel", right: "Original" },
  { left: "Remake", right: "Classic" },
  { left: "Meme", right: "Art" },
  { left: "Cringe", right: "Based" },
  { left: "Mid", right: "Goated" },
  { left: "Normie", right: "Degen" },
  { left: "Touch Grass", right: "Chronically Online" },
  
  // Abstract Concepts
  { left: "Chaos", right: "Order" },
  { left: "Death", right: "Life" },
  { left: "War", right: "Peace" },
  { left: "Hate", right: "Love" },
  { left: "Fear", right: "Courage" },
  { left: "Doubt", right: "Faith" },
  { left: "Destruction", right: "Creation" },
  { left: "Silence", right: "Noise" },
  
  // Random Fun
  { left: "Breakfast", right: "Midnight Snack" },
  { left: "Monday", right: "Friday" },
  { left: "Zoom Call", right: "In Person" },
  { left: "Rewatch", right: "First Time" },
  { left: "Skip", right: "Replay" },
  { left: "Spoiler", right: "Surprise" },
  { left: "Cancel", right: "Stan" },
  { left: "Flop Era", right: "Peak" },
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
