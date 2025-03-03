import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useGameStore } from '../../store/useGameStore';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface WebtrapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WebtrapModal({ isOpen, onClose }: WebtrapModalProps) {
  const { player, updateBalance } = useGameStore();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const durations = [
    { hours: 1, cost: 100, reward: '10-20 Feeders' },
    { hours: 3, cost: 250, reward: '30-60 Feeders' },
    { hours: 8, cost: 500, reward: '80-150 Feeders' },
    { hours: 24, cost: 1000, reward: '200-400 Feeders' },
  ];

  const handleSetWebtrap = () => {
    if (!selectedDuration) return;
    
    const duration = durations.find(d => d.hours === selectedDuration);
    if (!duration || player.balance.SPIDER < duration.cost) return;
    
    // Deduct the cost
    updateBalance({ SPIDER: player.balance.SPIDER - duration.cost });
    
    // In a real game, you would set a timer or store the end time in the database
    // For this demo, we'll simulate immediate completion
    
    // Calculate reward based on duration
    let reward = 0;
    switch (selectedDuration) {
      case 1:
        reward = Math.floor(Math.random() * 11) + 10; // 10-20
        break;
      case 3:
        reward = Math.floor(Math.random() * 31) + 30; // 30-60
        break;
      case 8:
        reward = Math.floor(Math.random() * 71) + 80; // 80-150
        break;
      case 24:
        reward = Math.floor(Math.random() * 201) + 200; // 200-400
        break;
    }
    
    // Add the reward
    updateBalance({ feeders: player.balance.feeders + reward });
    
    alert(`Webtrap set! You gained ${reward} feeders.`);
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
            Set Webtrap
          </Dialog.Title>

          <div className="space-y-4">
            <p className="text-gray-600 text-center">Set a webtrap to catch prey automatically:</p>
            
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {durations.map((duration) => (
                <button
                  key={duration.hours}
                  onClick={() => setSelectedDuration(duration.hours)}
                  className={`p-4 rounded-xl border-2 transition-colors w-full text-left ${
                    selectedDuration === duration.hours
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{duration.hours} {duration.hours === 1 ? 'hour' : 'hours'}</div>
                      <div className="text-sm text-gray-500">Potential Reward: {duration.reward}</div>
                    </div>
                    <div className="text-blue-500 font-bold">{duration.cost} $SPIDER</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSetWebtrap}
              disabled={!selectedDuration || player.balance.SPIDER < (durations.find(d => d.hours === selectedDuration)?.cost || 0)}
              className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set Webtrap
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}