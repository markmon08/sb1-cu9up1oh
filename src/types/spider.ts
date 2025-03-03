export type Rarity = 'Common' | 'Excellent' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical';
export type GeneticType = 'S' | 'A' | 'J' | 'SA' | 'SJ' | 'AJ' | 'SAJ';

export interface Dress {
  id: string;
  name: string;
  rarity: string;
  powerBonus: number;
}

export interface Spider {
  id: string;
  name: string;
  rarity: Rarity;
  genetics: GeneticType;
  level: number;
  experience: number;
  power: number;
  stats: {
    attack: number;
    defense: number;
    agility: number;
    luck: number;
  };
  condition: {
    health: number;
    hunger: number;
    hydration: number;
  };
  generation: number;
  parents?: {
    father: string;
    mother: string;
  };
  lastFed: string;
  lastHydrated: string;
  lastGemCollection: string;
  lastTokenGeneration: string;
  isHibernating: boolean;
  isAlive: boolean;
  dresses: Dress[];
  createdAt: string;
}

export interface Player {
  id: string;
  name: string;
  spiders: Spider[];
  balance: {
    SPIDER: number;
    feeders: number;
    gems: number;
  };
  createdAt: string;
  lastLogin: string;
}