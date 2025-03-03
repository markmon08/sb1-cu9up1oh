import { Spider, Player } from '../types/spider';
import { RARITY_LEVELS, FEEDER_CONSUMPTION, EXP_REQUIREMENTS, POWER_INCREASE_PER_LEVEL } from '../constants/game';

// Constants
const TOKEN_GENERATION_RATE = 0.1; // Tokens generated per power point per hour
const BASE_XP_PER_FEED = 1; // Each feed counts as exactly 1 feed
const XP_PER_HYDRATE = 1; // Each hydration counts as exactly 1 feed

// Helper: Get feeders needed based on level
export const getFeedersNeeded = (level: number): number => {
  if (level <= 10) return FEEDER_CONSUMPTION['1-10'];
  if (level <= 20) return FEEDER_CONSUMPTION['11-20'];
  if (level <= 25) return FEEDER_CONSUMPTION['21-25'];
  if (level <= 30) return FEEDER_CONSUMPTION['26-30'];
  if (level <= 45) return FEEDER_CONSUMPTION['31-45'];
  if (level <= 60) return FEEDER_CONSUMPTION['46-60'];
  if (level <= 80) return FEEDER_CONSUMPTION['61-80'];
  return FEEDER_CONSUMPTION['81-100']; // Level 81-100
};

// Helper: Get feeding cost based on level - now using the same values as feeder consumption
export const getFeedingCost = (level: number): number => {
  if (level <= 10) return FEEDER_CONSUMPTION['1-10'];
  if (level <= 20) return FEEDER_CONSUMPTION['11-20'];
  if (level <= 25) return FEEDER_CONSUMPTION['21-25'];
  if (level <= 30) return FEEDER_CONSUMPTION['26-30'];
  if (level <= 45) return FEEDER_CONSUMPTION['31-45'];
  if (level <= 60) return FEEDER_CONSUMPTION['46-60'];
  if (level <= 80) return FEEDER_CONSUMPTION['61-80'];
  return FEEDER_CONSUMPTION['81-100']; // Level 81-100
};

// Helper: Get experience needed for next level based on current level
export const getExpRequiredForLevel = (level: number): number => {
  if (level <= 10) return EXP_REQUIREMENTS['1-10'];
  if (level <= 20) return EXP_REQUIREMENTS['11-20'];
  if (level <= 30) return EXP_REQUIREMENTS['21-30'];
  if (level <= 40) return EXP_REQUIREMENTS['31-40'];
  if (level <= 50) return EXP_REQUIREMENTS['41-50'];
  if (level <= 60) return EXP_REQUIREMENTS['51-60'];
  if (level <= 70) return EXP_REQUIREMENTS['61-70'];
  if (level <= 80) return EXP_REQUIREMENTS['71-80'];
  if (level <= 90) return EXP_REQUIREMENTS['81-90'];
  return EXP_REQUIREMENTS['91-100']; // Level 91-100
};

// Helper: Calculate experience needed for the current level
export const experienceForCurrentLevel = (level: number): number => {
  if (level <= 1) return 0;
  
  let totalExp = 0;
  for (let i = 1; i < level; i++) {
    totalExp += getExpRequiredForLevel(i);
  }
  
  return totalExp;
};

// Helper: Calculate experience needed for next level
export const experienceForNextLevel = (level: number): number => {
  return experienceForCurrentLevel(level) + getExpRequiredForLevel(level);
};

// Helper: Check if spider can level up based on rarity
export const canLevelUp = (spider: Spider): boolean => {
  const maxLevel = RARITY_LEVELS[spider.rarity];
  return spider.level < maxLevel;
};

// Helper: Calculate level from experience
export const calculateLevel = (experience: number): number => {
  if (experience < getExpRequiredForLevel(1)) return 1;
  
  let level = 1;
  let expForNextLevel = getExpRequiredForLevel(1);
  
  while (experience >= expForNextLevel) {
    level++;
    if (level > 100) return 100; // Cap at level 100
    expForNextLevel += getExpRequiredForLevel(level);
  }
  
  return level;
};

// Helper: Calculate power increase for level up based on rarity
export const calculatePowerIncrease = (rarity: string): number => {
  const powerRange = POWER_INCREASE_PER_LEVEL[rarity];
  return Math.floor(Math.random() * (powerRange.max - powerRange.min + 1)) + powerRange.min;
};

// Core System: Feed a spider
export const feedSpider = (spider: Spider, availableFeeders: number): Spider | null => {
  const feedersNeeded = getFeedingCost(spider.level);
  if (availableFeeders < feedersNeeded) {
    return null;
  }

  // Check if spider can level up based on rarity
  if (!canLevelUp(spider) && spider.level >= RARITY_LEVELS[spider.rarity]) {
    // Still allow feeding for hunger but no XP gain
    return {
      ...spider,
      condition: {
        ...spider.condition,
        hunger: Math.min(100, spider.condition.hunger + 20),
      },
      lastFed: new Date().toISOString(),
    };
  }

  // Each feed counts as 1 full feed toward level up
  const xpGained = BASE_XP_PER_FEED;
  const newExperience = spider.experience + xpGained;
  const newLevel = calculateLevel(newExperience);
  
  // Calculate power increase if the spider leveled up
  let newPower = spider.power;
  if (newLevel > spider.level) {
    // Add power for each level gained
    for (let i = 0; i < newLevel - spider.level; i++) {
      newPower += calculatePowerIncrease(spider.rarity);
    }
  }

  return {
    ...spider,
    condition: {
      ...spider.condition,
      hunger: Math.min(100, spider.condition.hunger + 20), // Increase hunger by 20%
    },
    experience: newExperience,
    level: Math.min(newLevel, RARITY_LEVELS[spider.rarity]), // Cap level based on rarity
    power: newPower, // Update power with level-up bonus
    lastFed: new Date().toISOString(),
  };
};

// Core System: Hydrate a spider
export const hydrateSpider = (spider: Spider): Spider => {
  // Check if spider can level up based on rarity
  if (!canLevelUp(spider) && spider.level >= RARITY_LEVELS[spider.rarity]) {
    // Still allow hydration for thirst but no XP gain
    return {
      ...spider,
      condition: {
        ...spider.condition,
        hydration: Math.min(100, spider.condition.hydration + 20),
      },
      lastHydrated: new Date().toISOString(),
    };
  }

  // Each hydration counts as 1 full feed toward level up
  const xpGained = XP_PER_HYDRATE;
  const newExperience = spider.experience + xpGained;
  const newLevel = calculateLevel(newExperience);
  
  // Calculate power increase if the spider leveled up
  let newPower = spider.power;
  if (newLevel > spider.level) {
    // Add power for each level gained
    for (let i = 0; i < newLevel - spider.level; i++) {
      newPower += calculatePowerIncrease(spider.rarity);
    }
  }

  return {
    ...spider,
    condition: {
      ...spider.condition,
      hydration: Math.min(100, spider.condition.hydration + 20), // Increase hydration by 20%
    },
    experience: newExperience,
    level: Math.min(newLevel, RARITY_LEVELS[spider.rarity]), // Cap level based on rarity
    power: newPower, // Update power with level-up bonus
    lastHydrated: new Date().toISOString(),
  };
};

// Core System: Calculate tokens generated by a spider
export const calculateTokensGenerated = (spider: Spider): number => {
  if (spider.isHibernating) {
    return 0; // No tokens generated during hibernation
  }

  const now = new Date();
  const lastGenerationTime = new Date(spider.lastTokenGeneration);
  const timeElapsed = (now.getTime() - lastGenerationTime.getTime()) / (1000 * 60 * 60); // Time in hours

  const tokensGenerated = spider.power * TOKEN_GENERATION_RATE * timeElapsed;
  return Math.floor(tokensGenerated * 100) / 100; // Round to 2 decimal places
};

// Core System: Update player tokens based on all spiders
export const updatePlayerTokens = (player: Player): Player => {
  let totalTokensGenerated = 0;

  const updatedSpiders = player.spiders.map((spider) => {
    const tokensGenerated = calculateTokensGenerated(spider);
    totalTokensGenerated += tokensGenerated;

    return {
      ...spider,
      lastTokenGeneration: new Date().toISOString(),
    };
  });

  return {
    ...player,
    balance: {
      ...player.balance,
      SPIDER: Math.floor((player.balance.SPIDER + totalTokensGenerated) * 100) / 100,
    },
    spiders: updatedSpiders,
  };
};