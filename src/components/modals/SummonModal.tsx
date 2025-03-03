import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useGameStore } from '../../store/useGameStore';
import { Dress, GeneticType } from '../../types/spider';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { POWER_RANGES } from '../../constants/game';

interface SummonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SummonModal({ isOpen, onClose }: SummonModalProps) {
  const { player, updateBalance, addSpider } = useGameStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDegrees, setSpinDegrees] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<'single' | 'multi'>('single');
  const [result, setResult] = useState<string | null>(null);
  const [summonType, setSummonType] = useState<'spider' | 'dress'>('spider');
  const [summonResults, setSummonResults] = useState<Array<{rarity: string, name: string, id: string}>>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Spider summon costs
  const spiderSingleSummonCost = 200;
  const spiderMultiSummonCost = 1800; // 10% discount for bulk summon

  // Dress summon costs
  const dressSingleSummonCost = 1; // 1 Gem
  const dressMultiSummonCost = 9.5; // 9.5 Gems (5% discount)

  // Spider rarities with their probabilities and colors - UPDATED VALUES
  const spiderWheelSegments = [
    { id: 'common1', rarity: 'Common', color: '#A0A0A0', probability: 0.60 },
    { id: 'excellent1', rarity: 'Excellent', color: '#4CAF50', probability: 0.20 },
    { id: 'rare1', rarity: 'Rare', color: '#2196F3', probability: 0.13 },
    { id: 'epic1', rarity: 'Epic', color: '#9C27B0', probability: 0.059 },
    { id: 'legendary1', rarity: 'Legendary', color: '#FF9800', probability: 0.0009 },
    { id: 'mythical1', rarity: 'Mythical', color: '#F44336', probability: 0.0001 },
    { id: 'common2', rarity: 'Common', color: '#A0A0A0', probability: 0.60 },
    { id: 'excellent2', rarity: 'Excellent', color: '#4CAF50', probability: 0.20 },
  ];

  // Dress rarities with their probabilities and colors - UPDATED VALUES
  const dressWheelSegments = [
    { id: 'common1', rarity: 'Common', color: '#A0A0A0', probability: 0.60 },
    { id: 'excellent1', rarity: 'Excellent', color: '#4CAF50', probability: 0.20 },
    { id: 'rare1', rarity: 'Rare', color: '#2196F3', probability: 0.13 },
    { id: 'epic1', rarity: 'Epic', color: '#9C27B0', probability: 0.059 },
    { id: 'legendary1', rarity: 'Legendary', color: '#FF9800', probability: 0.0009 },
    { id: 'mythical1', rarity: 'Mythical', color: '#F44336', probability: 0.0001 },
    { id: 'common2', rarity: 'Common', color: '#A0A0A0', probability: 0.60 },
    { id: 'excellent2', rarity: 'Excellent', color: '#4CAF50', probability: 0.20 },
  ];

  // Multi-summon probabilities for spiders - UPDATED VALUES
  const spiderMultiProbabilities = {
    'Common': 0.50,
    'Excellent': 0.18,
    'Rare': 0.16,
    'Epic': 0.149,
    'Legendary': 0.0108,
    'Mythical': 0.0002
  };

  // Multi-summon probabilities for dresses - UPDATED VALUES
  const dressMultiProbabilities = {
    'Common': 0.50,
    'Excellent': 0.18,
    'Rare': 0.16,
    'Epic': 0.149,
    'Legendary': 0.0108,
    'Mythical': 0.0002
  };

  // Calculate segment angles
  const getWheelSegments = () => summonType === 'spider' ? spiderWheelSegments : dressWheelSegments;
  const segmentAngle = 360 / getWheelSegments().length;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsSpinning(false);
      setSpinDegrees(0);
      setResult(null);
      setSummonResults([]);
      setShowConfetti(false);
    }
  }, [isOpen]);

  // Create confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleSpin = () => {
    if (isSpinning) return;
    
    let cost = 0;
    let currency: 'SPIDER' | 'gems' = 'SPIDER';
    
    if (summonType === 'spider') {
      cost = selectedAmount === 'single' ? spiderSingleSummonCost : spiderMultiSummonCost;
      currency = 'SPIDER';
    } else {
      cost = selectedAmount === 'single' ? dressSingleSummonCost : dressMultiSummonCost;
      currency = 'gems';
    }
    
    if (player.balance[currency] < cost) {
      alert(`Not enough ${currency === 'SPIDER' ? '$SPIDER tokens' : 'Gems'}!`);
      return;
    }
    
    // Deduct the cost
    updateBalance({ [currency]: player.balance[currency] - cost });
    
    setIsSpinning(true);
    setResult(null);
    setSummonResults([]);
    
    // Determine the result based on probabilities
    const wheelSegments = getWheelSegments();
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    let selectedSegment = wheelSegments[0];
    
    for (const segment of wheelSegments) {
      cumulativeProbability += segment.probability;
      if (randomValue <= cumulativeProbability) {
        selectedSegment = segment;
        break;
      }
    }
    
    // Calculate the degrees to spin
    // We want to spin at least 5 full rotations (1800 degrees) plus the position of the selected segment
    const segmentIndex = wheelSegments.findIndex(s => s.id === selectedSegment.id);
    const segmentPosition = segmentIndex * segmentAngle;
    const spinTo = 1800 + (360 - segmentPosition);
    
    setSpinDegrees(spinTo);
    
    // Set the result after the animation completes
    setTimeout(() => {
      setResult(selectedSegment.rarity);
      
      // Create new item(s) based on the result
      if (selectedAmount === 'single') {
        if (summonType === 'spider') {
          const newSpider = createNewSpider(selectedSegment.rarity);
          setSummonResults([{
            rarity: selectedSegment.rarity,
            name: newSpider.name,
            id: newSpider.id
          }]);
        } else {
          const newDress = createNewDress(selectedSegment.rarity);
          setSummonResults([{
            rarity: selectedSegment.rarity,
            name: newDress.name,
            id: newDress.id
          }]);
        }
      } else {
        // For multi-summon, create 10 items with weighted probabilities
        const results = [];
        for (let i = 0; i < 10; i++) {
          if (summonType === 'spider') {
            const randomRarity = getRandomRarityWithProbabilities(spiderMultiProbabilities);
            const newSpider = createNewSpider(randomRarity);
            results.push({
              rarity: randomRarity,
              name: newSpider.name,
              id: newSpider.id
            });
          } else {
            const randomRarity = getRandomRarityWithProbabilities(dressMultiProbabilities);
            const newDress = createNewDress(randomRarity);
            results.push({
              rarity: randomRarity,
              name: newDress.name,
              id: newDress.id
            });
          }
        }
        setSummonResults(results);
      }
      
      // Show confetti for rare results
      if (
        selectedSegment.rarity === 'Legendary' || 
        selectedSegment.rarity === 'Mythical' ||
        (selectedAmount === 'multi' && summonResults.some(r => 
          r.rarity === 'Legendary' || r.rarity === 'Mythical'
        ))
      ) {
        setShowConfetti(true);
      }
      
      setIsSpinning(false);
    }, 3000); // Match this with the CSS animation duration
  };
  
  const getRandomRarityWithProbabilities = (probabilities: Record<string, number>): string => {
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    
    for (const [rarity, probability] of Object.entries(probabilities)) {
      cumulativeProbability += probability;
      if (randomValue <= cumulativeProbability) {
        return rarity;
      }
    }
    
    return 'Common'; // Fallback
  };
  
  // Generate a random basic genetic type (only S, A, or J for summoning)
  const generateRandomBasicGenetics = (): GeneticType => {
    const basicTypes: GeneticType[] = ['S', 'A', 'J'];
    return basicTypes[Math.floor(Math.random() * basicTypes.length)];
  };
  
  const createNewSpider = (rarity: string) => {
    // Generate random genetics with only basic types for summoning
    const genetics = generateRandomBasicGenetics();
    
    // Calculate base power based on rarity using the POWER_RANGES constant
    const powerRange = POWER_RANGES[rarity as keyof typeof POWER_RANGES];
    const basePower = Math.floor(Math.random() * (powerRange.max - powerRange.min + 1)) + powerRange.min;
    
    // Add genetic bonus
    let geneticBonus = 0;
    switch (genetics) {
      case 'S': geneticBonus = 10; break;
      case 'A': geneticBonus = 12; break;
      case 'J': geneticBonus = 15; break;
      // No mutation genetics in summoning
    }
    
    const newSpider = {
      id: `spider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${rarity} Spider (${genetics})`,
      rarity: rarity as any,
      genetics: genetics,
      level: 1,
      experience: 0,
      power: basePower + geneticBonus,
      stats: {
        attack: 10 + Math.floor(Math.random() * 5),
        defense: 10 + Math.floor(Math.random() * 5),
        agility: 10 + Math.floor(Math.random() * 5),
        luck: 10 + Math.floor(Math.random() * 5),
      },
      condition: {
        health: 100,
        hunger: 100,
        hydration: 100,
      },
      generation: 1,
      lastFed: new Date().toISOString(),
      lastHydrated: new Date().toISOString(),
      lastGemCollection: new Date().toISOString(),
      lastTokenGeneration: new Date().toISOString(),
      isHibernating: false,
      isAlive: true,
      dresses: [],
      createdAt: new Date().toISOString(),
    };
    
    addSpider(newSpider);
    return newSpider;
  };
  
  const createNewDress = (rarity: string) => {
    // Calculate power bonus based on rarity
    let powerBonus = 10; // Common
    switch (rarity) {
      case 'Excellent': powerBonus = 25; break;
      case 'Rare': powerBonus = 50; break;
      case 'Epic': powerBonus = 100; break;
      case 'Legendary': powerBonus = 200; break;
      case 'Mythical': powerBonus = 350; break;
    }
    
    // Generate a random dress name
    const dressTypes = ['Cloak', 'Armor', 'Skin', 'Outfit', 'Costume', 'Garment'];
    const dressAdjectives = ['Silky', 'Venomous', 'Shadow', 'Glowing', 'Ancient', 'Mystic', 'Royal'];
    
    const randomType = dressTypes[Math.floor(Math.random() * dressTypes.length)];
    const randomAdjective = dressAdjectives[Math.floor(Math.random() * dressAdjectives.length)];
    
    const newDress: Dress = {
      id: `dress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${randomAdjective} ${rarity} ${randomType}`,
      rarity: rarity as any,
      powerBonus: powerBonus,
    };
    
    // In a real implementation, you would add this to the player's inventory
    // For now, we'll just return it
    return newDress;
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'Common': return 'text-gray-500';
      case 'Excellent': return 'text-green-500';
      case 'Rare': return 'text-blue-500';
      case 'Epic': return 'text-purple-500';
      case 'Legendary': return 'text-orange-500';
      case 'Mythical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRarityBgColor = (rarity: string): string => {
    switch (rarity) {
      case 'Common': return 'bg-gray-100';
      case 'Excellent': return 'bg-green-100';
      case 'Rare': return 'bg-blue-100';
      case 'Epic': return 'bg-purple-100';
      case 'Legendary': return 'bg-orange-100';
      case 'Mythical': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl relative">
          {/* Close button moved to the upper right corner */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          
          <Dialog.Title className="text-xl font-bold mb-4 text-center mt-1">
            <SparklesIcon className="w-5 h-5 inline-block mr-1 text-yellow-500" />
            Summoning Portal
          </Dialog.Title>

          <div className="space-y-4">
            {/* Compact Summon Type and Amount Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-center gap-2 text-sm">
                <button
                  onClick={() => setSummonType('spider')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                    summonType === 'spider' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <span className="text-sm">🕷️</span>
                  Spider
                </button>
                <button
                  onClick={() => setSummonType('dress')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                    summonType === 'dress' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <span className="text-sm">👕</span>
                  Dress
                </button>
              </div>
              
              <div className="flex justify-center gap-2 text-sm">
                <button
                  onClick={() => setSelectedAmount('single')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedAmount === 'single' 
                      ? summonType === 'spider' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  1x ({summonType === 'spider' ? `${spiderSingleSummonCost}` : `${dressSingleSummonCost} Gem`})
                </button>
                <button
                  onClick={() => setSelectedAmount('multi')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedAmount === 'multi' 
                      ? summonType === 'spider' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  10x ({summonType === 'spider' ? `${spiderMultiSummonCost}` : `${dressMultiSummonCost} Gems`})
                </button>
              </div>
            </div>
            
            {/* Current Balance - Compact */}
            <div className="text-center text-xs text-gray-600 -mt-1">
              Balance: {summonType === 'spider' ? `${player.balance.SPIDER} $SPIDER` : `${player.balance.gems} Gems`}
            </div>
            
            {/* Spinning Wheel Container */}
            <div className="relative w-56 h-56 mx-auto">
              {/* Wheel Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-4 z-10">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-500"></div>
              </div>
              
              {/* Spinning Wheel */}
              <div 
                ref={wheelRef}
                className="w-full h-full rounded-full overflow-hidden border-4 border-gray-800 relative transition-transform duration-3000 ease-out"
                style={{ 
                  transform: `rotate(${spinDegrees}deg)`,
                  transformOrigin: 'center',
                }}
              >
                {getWheelSegments().map((segment, index) => (
                  <div 
                    key={segment.id}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ 
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((index + 1) * segmentAngle * Math.PI / 180)}% ${50 + 50 * Math.sin((index + 1) * segmentAngle * Math.PI / 180)}%, 50% 50%)`,
                      transform: `rotate(${index * segmentAngle}deg)`,
                      backgroundColor: segment.color,
                    }}
                  >
                    <div 
                      className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white font-bold text-xs"
                      style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                    >
                      {segment.rarity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Confetti Effect */}
            {showConfetti && (
              <div className="confetti-container">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div 
                    key={i}
                    className="confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      backgroundColor: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'][Math.floor(Math.random() * 16)],
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${Math.random() * 2 + 3}s`,
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Single Result - More Compact */}
            {result && selectedAmount === 'single' && summonResults.length > 0 && (
              <div className={`text-center p-3 rounded-xl ${getRarityBgColor(result)} animate-fade-in`}>
                <p className="font-bold text-sm">Result:</p>
                <p className={`text-lg font-bold ${getRarityColor(result)}`}>
                  {summonResults[0].name}
                </p>
              </div>
            )}
            
            {/* Multiple Results - More Compact */}
            {selectedAmount === 'multi' && summonResults.length > 0 && (
              <div className="text-center p-3 bg-gray-100 rounded-xl animate-fade-in">
                <p className="font-bold text-sm mb-1">Results:</p>
                <div className="max-h-32 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {summonResults.map((result, index) => (
                      <div 
                        key={index} 
                        className={`p-1.5 rounded-lg ${getRarityBgColor(result.rarity)} animate-pop-in`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <p className={`font-medium ${getRarityColor(result.rarity)}`}>
                          {result.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Rarity Chances - More Compact */}
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              <p className="font-medium text-xs mb-1">Rarity Chances:</p>
              <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 text-xs">
                {Object.entries(
                  summonType === 'spider' 
                    ? (selectedAmount === 'single' ? spiderWheelSegments.reduce((acc, seg) => {
                        acc[seg.rarity] = (acc[seg.rarity] || 0) + seg.probability / 2;
                        return acc;
                      }, {} as Record<string, number>) : spiderMultiProbabilities) 
                    : (selectedAmount === 'single' ? dressWheelSegments.reduce((acc, seg) => {
                        acc[seg.rarity] = (acc[seg.rarity] || 0) + seg.probability / 2;
                        return acc;
                      }, {} as Record<string, number>) : dressMultiProbabilities)
                ).map(([rarity, chance]) => (
                  <div key={rarity} className="flex justify-between">
                    <span className={getRarityColor(rarity)}>{rarity}</span>
                    <span>{(chance * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spin Button */}
            <button
              onClick={handleSpin}
              disabled={
                isSpinning || 
                (summonType === 'spider' 
                  ? player.balance.SPIDER < (selectedAmount === 'single' ? spiderSingleSummonCost : spiderMultiSummonCost)
                  : player.balance.gems < (selectedAmount === 'single' ? dressSingleSummonCost : dressMultiSummonCost))
              }
              className={`w-full py-3 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                summonType === 'spider' 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {isSpinning ? 'Summoning...' : 'Summon Now'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}