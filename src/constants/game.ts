export const RARITY_LEVELS = {
  Common: 25,
  Excellent: 35,
  Rare: 55,
  Epic: 70,
  Legendary: 80,
  Mythical: 100,
} as const;

export const FEEDER_CONSUMPTION = {
  '1-10': 7,
  '11-20': 10,
  '21-25': 12,
  '26-30': 15,
  '31-45': 20,
  '46-60': 25,
  '61-80': 30,
  '81-100': 40,
} as const;

export const EXP_REQUIREMENTS = {
  '1-10': 3,
  '11-20': 5,
  '21-30': 6,
  '31-40': 7,
  '41-50': 8,
  '51-60': 9,
  '61-70': 10,
  '71-80': 11,
  '81-90': 12,
  '91-100': 15,
} as const;

export const POWER_RANGES = {
  Common: { min: 50, max: 80 },
  Excellent: { min: 100, max: 140 },
  Rare: { min: 160, max: 220 },
  Epic: { min: 230, max: 320 },
  Legendary: { min: 330, max: 460 },
  Mythical: { min: 470, max: 600 },
} as const;

export const POWER_INCREASE_PER_LEVEL = {
  Common: { min: 18, max: 33 },
  Excellent: { min: 34, max: 45 },
  Rare: { min: 46, max: 60 },
  Epic: { min: 61, max: 90 },
  Legendary: { min: 91, max: 130 },
  Mythical: { min: 131, max: 180 },
} as const;

export const DRESS_POWER_BONUS = {
  Common: 10,
  Uncommon: 25,
  Epic: 50,
  Legendary: 160,
  Mythical: 200,
} as const;