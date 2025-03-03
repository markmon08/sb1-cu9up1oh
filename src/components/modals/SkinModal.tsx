import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useGameStore } from '../../store/useGameStore';
import { Dress } from '../../types/spider';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SkinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SkinModal({ isOpen, onClose }: SkinModalProps) {
  const { player, updateSpider } = useGameStore();
  const activeSpider = player.spiders[0];
  const [selectedSkin, setSelectedSkin] = useState<string | null>(null);

  const availableSkins: Dress[] = [
    { id: 'skin1', name: 'Basic Skin', rarity: 'Common', powerBonus: 10 },
    { id: 'skin2', name: 'Forest Camouflage', rarity: 'Uncommon', powerBonus: 25 },
    { id: 'skin3', name: 'Toxic Glow', rarity: 'Epic', powerBonus: 50 },
    { id: 'skin4', name: 'Golden Weaver', rarity: 'Legendary', powerBonus: 160 },
  ];

  const handleEquipSkin = () => {
    if (!selectedSkin || !activeSpider) return;
    
    const skin = availableSkins.find(s => s.id === selectedSkin);
    if (!skin) return;
    
    // Check if the skin is already equipped
    const isEquipped = activeSpider.dresses.some(d => d.id === skin.id);
    
    if (isEquipped) {
      // Remove the skin
      const updatedDresses = activeSpider.dresses.filter(d => d.id !== skin.id);
      updateSpider(activeSpider.id, { 
        dresses: updatedDresses,
        power: activeSpider.power - skin.powerBonus
      });
    } else {
      // Add the skin
      const updatedDresses = [...activeSpider.dresses, skin];
      updateSpider(activeSpider.id, { 
        dresses: updatedDresses,
        power: activeSpider.power + skin.powerBonus
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl relative">
          {/* Close button in the upper right corner */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          
          <Dialog.Title className="text-xl font-bold mb-4 text-center mt-1">
            Spider Skins
          </Dialog.Title>

          <div className="space-y-4">
            <p className="text-gray-600 text-center">Select a skin for your spider:</p>
            
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {availableSkins.map((skin) => {
                const isEquipped = activeSpider?.dresses.some(d => d.id === skin.id);
                return (
                  <button
                    key={skin.id}
                    onClick={() => setSelectedSkin(skin.id)}
                    className={`p-4 rounded-xl border-2 transition-colors w-full text-left ${
                      selectedSkin === skin.id
                        ? 'border-blue-500 bg-blue-50'
                        : isEquipped
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{skin.name}</div>
                        <div className="text-sm text-gray-500">Rarity: {skin.rarity}</div>
                        <div className="text-sm text-gray-500">Power Bonus: +{skin.powerBonus}</div>
                      </div>
                      {isEquipped && (
                        <div className="text-green-500 font-bold">Equipped</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleEquipSkin}
              disabled={!selectedSkin}
              className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {activeSpider?.dresses.some(d => d.id === selectedSkin) ? 'Unequip' : 'Equip'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}