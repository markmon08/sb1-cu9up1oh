import React from 'react';
import { Dialog } from '@headlessui/react';
import { useGameStore } from '../../store/useGameStore';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { SpiderLevelInfo } from '../SpiderLevelInfo';

interface SpiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  spiderId: string;
}

export function SpiderModal({ isOpen, onClose, spiderId }: SpiderModalProps) {
  const { player } = useGameStore();
  const spider = player.spiders.find(s => s.id === spiderId);

  if (!spider) return null;

  // Get genetic display text with color
  const getGeneticDisplay = (genetic: string) => {
    const colors: Record<string, string> = {
      'S': 'text-blue-500',
      'A': 'text-green-500',
      'J': 'text-purple-500',
      'SA': 'text-indigo-500',
      'SJ': 'text-cyan-500',
      'AJ': 'text-emerald-500',
      'SAJ': 'text-amber-500 font-bold',
    };
    
    return <span className={colors[genetic] || 'text-gray-500'}>{genetic}</span>;
  };

  // Get rarity color
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

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl relative sm:max-w-md md:max-w-lg">
          {/* Close button in the upper right corner */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          
          <Dialog.Title className="text-xl font-bold mb-4 text-center mt-1">
            Spider Details
          </Dialog.Title>

          <div className="space-y-4">
            {/* Spider Image and Basic Info */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src="https://placehold.co/200x200/teal/white?text=🕷️" 
                  alt="Spider" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{spider.name}</h3>
                <p className={`${getRarityColor(spider.rarity)} font-medium`}>{spider.rarity}</p>
                <p className="text-sm text-gray-600">Genetics: {getGeneticDisplay(spider.genetics)}</p>
                <p className="text-sm text-gray-600">Generation: {spider.generation}</p>
              </div>
            </div>

            {/* Level Info */}
            <SpiderLevelInfo spider={spider} />
            
            {/* Power */}
            <div className="bg-purple-100 p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-medium">Power</span>
                <span className="font-bold text-purple-700">{spider.power}</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-medium mb-3">Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ATK</span>
                    <span className="font-bold text-red-500">{spider.stats.attack}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(spider.stats.attack / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">DEF</span>
                    <span className="font-bold text-blue-500">{spider.stats.defense}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(spider.stats.defense / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">AGI</span>
                    <span className="font-bold text-green-500">{spider.stats.agility}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(spider.stats.agility / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">LUCK</span>
                    <span className="font-bold text-yellow-500">{spider.stats.luck}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${(spider.stats.luck / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Condition */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-medium mb-2">Condition</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Health</span>
                    <span>{Math.round(spider.condition.health)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${spider.condition.health}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Hunger</span>
                    <span>{Math.round(spider.condition.hunger)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${spider.condition.hunger}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Hydration</span>
                    <span>{Math.round(spider.condition.hydration)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${spider.condition.hydration}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}