import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { RankingModal } from '../components/modals/RankingModal';
import { BreedingModal } from '../components/modals/BreedingModal';
import { RedeemModal } from '../components/modals/RedeemModal';
import { SummonModal } from '../components/modals/SummonModal';
import { SkinModal } from '../components/modals/SkinModal';
import { WebtrapModal } from '../components/modals/WebtrapModal';
import { DevourModal } from '../components/modals/DevourModal';
import { BreakthroughModal } from '../components/modals/BreakthroughModal';
import { SpiderModal } from '../components/modals/SpiderModal';
import { Menu } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { experienceForNextLevel, getFeedersNeeded, getFeedingCost } from '../utils/core';

function Dashboard() {
  const { player, feedSpiderAction, hydrateSpiderAction, updateTokens, updateBalance, updateSpider } = useGameStore();
  const activeSpider = player.spiders[0];

  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [isBreedingOpen, setIsBreedingOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isSummonOpen, setIsSummonOpen] = useState(false);
  const [isSkinOpen, setIsSkinOpen] = useState(false);
  const [isWebtrapOpen, setIsWebtrapOpen] = useState(false);
  const [isDevourOpen, setIsDevourOpen] = useState(false);
  const [isBreakthroughOpen, setIsBreakthroughOpen] = useState(false);
  const [isSpiderModalOpen, setIsSpiderModalOpen] = useState(false);

  // Calculate level progress
  const nextLevelXP = activeSpider ? experienceForNextLevel(activeSpider.level) : 0;
  const currentLevelXP = activeSpider ? experienceForNextLevel(activeSpider.level - 1) : 0;
  const progressToNextLevel = activeSpider
    ? ((activeSpider.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    : 0;

  // Update tokens periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateTokens();
    }, 60000);
    return () => clearInterval(interval);
  }, [updateTokens]);

  const handleFeed = () => {
    if (activeSpider) {
      const feedingCost = getFeedingCost(activeSpider.level);
      if (player.balance.feeders >= feedingCost) {
        feedSpiderAction(activeSpider.id);
      }
    }
  };

  const handleHydrate = () => {
    if (activeSpider) {
      const feedersNeeded = getFeedersNeeded(activeSpider.level);
      if (player.balance.feeders >= feedersNeeded) {
        hydrateSpiderAction(activeSpider.id);
      }
    }
  };

  const handleHeal = () => {
    const healCost = 50;
    if (activeSpider && player.balance.SPIDER >= healCost) {
      updateSpider(activeSpider.id, {
        condition: {
          ...activeSpider.condition,
          health: Math.min(100, activeSpider.condition.health + 20),
        }
      });
      updateBalance({ SPIDER: player.balance.SPIDER - healCost });
    }
  };

  const sideButtonClasses = "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform bg-cover bg-center bg-no-repeat";

  if (!activeSpider) {
    return (
      <div className="game-container">
        <div className="flex items-center justify-center h-full">
          <p className="text-white text-xl">No spider available. Visit the market to get one!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Balance Display - Updated with placeholder images */}
      <div className="fixed top-4 left-0 right-0 px-6 z-40">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 max-w-md mx-auto flex justify-center gap-4">
          {/* $SPIDER Balance */}
          <div className="flex items-center gap-2">
            <img 
              src="https://placehold.co/20x20/blue/white?text=$" 
              alt="SPIDER token" 
              className="w-5 h-5 rounded-full"
            />
            <span className="text-white text-sm">|</span>
            <span className="text-white text-sm font-bold">{player.balance.SPIDER}</span>
          </div>
          
          {/* Feeders Balance */}
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">🍖</span>
            <span className="text-white text-sm">|</span>
            <span className="text-white text-sm font-bold">{player.balance.feeders}</span>
          </div>
        </div>
      </div>

      <div className="side-buttons">
        <button 
          onClick={() => setIsRankingOpen(true)}
          className={`${sideButtonClasses} bg-yellow-500`}
          style={{ backgroundImage: "url('https://placehold.co/100x100/yellow/white?text=⭐')" }}
        >
          <span className="sr-only">Rankings</span>
        </button>
        <button 
          onClick={() => setIsBreedingOpen(true)}
          className={`${sideButtonClasses} bg-purple-500`}
          style={{ backgroundImage: "url('https://placehold.co/100x100/purple/white?text=🕷️')" }}
        >
          <span className="sr-only">Breeding</span>
        </button>
        <button 
          onClick={() => setIsRedeemOpen(true)}
          className={`${sideButtonClasses} bg-blue-500`}
          style={{ backgroundImage: "url('https://placehold.co/100x100/blue/white?text=$')" }}
        >
          <span className="sr-only">Redeem</span>
        </button>
        <button 
          onClick={() => setIsDevourOpen(true)}
          className={`${sideButtonClasses} bg-red-500`}
          style={{ backgroundImage: "url('https://placehold.co/100x100/red/white?text=🍽️')" }}
        >
          <span className="sr-only">Devour</span>
        </button>
        <button 
          onClick={() => setIsBreakthroughOpen(true)}
          className={`${sideButtonClasses} bg-purple-700`}
          style={{ backgroundImage: "url('https://placehold.co/100x100/purple/white?text=⚡')" }}
        >
          <span className="sr-only">Breakthrough</span>
        </button>
      </div>

      <div className="right-buttons fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-40">
        <button 
          onClick={() => setIsSummonOpen(true)}
          className={`${sideButtonClasses} bg-orange-500`}
          style={{ backgroundImage: "url('https://placehold.co/100x100/orange/white?text=🎯')" }}
        >
          <span className="sr-only">Summon</span>
        </button>
        <button 
          onClick={() => setIsSkinOpen(true)}
          className={`${sideButtonClasses} bg-purple-500`}
          style={{ backgroundImage: "url('https://placehold.co/100x100/purple/white?text=👕')" }}
        >
          <span className="sr-only">Skin</span>
        </button>
        <button 
          onClick={() => setIsWebtrapOpen(true)}
          className={`${sideButtonClasses} bg-blue-500`}
          style={{ backgroundImage: "url('https://placehold.co/100x100/blue/white?text=🕸️')" }}
        >
          <span className="sr-only">Webtrap</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <img 
            src="data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M200 0 L400 200 L200 400 L0 200 Z' fill='none' stroke='white' stroke-width='2'/%3E%3C/svg%3E"
            alt="Spider Web"
            className="w-full opacity-80"
          />
          <div className="absolute top-1/4 right-1/4">
            <button 
              onClick={() => setIsSpiderModalOpen(true)}
              className="w-12 h-12 bg-green-800 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform"
            >
              <img 
                src="https://placehold.co/100x100/teal/white?text=🕷️" 
                alt="Spider" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </button>
          </div>
          
          {/* Spider Level Bar */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-teal-700/90 backdrop-blur-sm px-3 py-1 rounded-xl w-28">
            <div className="flex justify-center items-center">
              <span className="text-white font-bold text-sm">Level {activeSpider.level}</span>
            </div>
            <div className="w-full h-1.5 bg-teal-900/50 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bars Container - Smaller and with tooltips */}
      <div className="fixed bottom-24 left-0 right-0 px-6 z-40">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 max-w-md mx-auto">
          {/* Health Bar */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <span className="text-white text-sm">❤️</span>
                <span className="text-white text-xs font-medium">Health</span>
              </div>
              <span className="text-white text-xs font-bold">{Math.round(activeSpider.condition.health)}%</span>
            </div>
            <div className="relative group">
              <div className="h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
                  style={{ width: `${activeSpider.condition.health}%` }}
                ></div>
              </div>
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-xs rounded pointer-events-none whitespace-nowrap">
                Cost: 50 $SPIDER
              </div>
              <button 
                onClick={handleHeal}
                disabled={player.balance.SPIDER < 50}
                className="absolute -right-1 -top-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Hunger Bar */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <span className="text-white text-sm">🍖</span>
                <span className="text-white text-xs font-medium">Hunger</span>
              </div>
              <span className="text-white text-xs font-bold">{Math.round(activeSpider.condition.hunger)}%</span>
            </div>
            <div className="relative group">
              <div className="h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${activeSpider.condition.hunger}%` }}
                ></div>
              </div>
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-xs rounded pointer-events-none whitespace-nowrap">
                Cost: {getFeedingCost(activeSpider.level)} Feeders (Adds XP even at 100%)
              </div>
              <button 
                onClick={handleFeed}
                disabled={player.balance.feeders < getFeedingCost(activeSpider.level)}
                className="absolute -right-1 -top-1 bg-amber-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:bg-amber-600 disabled:opacity-50 disabled:hover:bg-amber-500"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Hydration Bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <span className="text-white text-sm">💧</span>
                <span className="text-white text-xs font-medium">Hydration</span>
              </div>
              <span className="text-white text-xs font-bold">{Math.round(activeSpider.condition.hydration)}%</span>
            </div>
            <div className="relative group">
              <div className="h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
                  style={{ width: `${activeSpider.condition.hydration}%` }}
                ></div>
              </div>
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-xs rounded pointer-events-none whitespace-nowrap">
                Cost: {getFeedersNeeded(activeSpider.level)} Feeders (Adds XP even at 100%)
              </div>
              <button 
                onClick={handleHydrate}
                disabled={player.balance.feeders < getFeedersNeeded(activeSpider.level)}
                className="absolute -right-1 -top-1 bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RankingModal isOpen={isRankingOpen} onClose={() => setIsRankingOpen(false)} />
      <BreedingModal isOpen={isBreedingOpen} onClose={() => setIsBreedingOpen(false)} />
      <RedeemModal isOpen={isRedeemOpen} onClose={() => setIsRedeemOpen(false)} />
      <SummonModal isOpen={isSummonOpen} onClose={() => setIsSummonOpen(false)} />
      <SkinModal isOpen={isSkinOpen} onClose={() => setIsSkinOpen(false)} />
      <WebtrapModal isOpen={isWebtrapOpen} onClose={() => setIsWebtrapOpen(false)} />
      <DevourModal isOpen={isDevourOpen} onClose={() => setIsDevourOpen(false)} />
      <BreakthroughModal isOpen={isBreakthroughOpen} onClose={() => setIsBreakthroughOpen(false)} />
      <SpiderModal isOpen={isSpiderModalOpen} onClose={() => setIsSpiderModalOpen(false)} spiderId={activeSpider.id} />
    </div>
  );
}

export default Dashboard;