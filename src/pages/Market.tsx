import React from 'react';
import { useGameStore } from '../store/useGameStore';

function Market() {
  const { player } = useGameStore();
  const { balance } = player;

  const marketItems = [
    { id: 1, name: 'Spider Egg', price: 500, description: 'Hatch a new spider!' },
    { id: 2, name: 'Feeder Pack', price: 100, description: '10x Feeders' },
    { id: 3, name: 'Health Potion', price: 50, description: 'Restore spider health' },
    { id: 4, name: 'Experience Boost', price: 200, description: '2x EXP for 24h' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Market</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">Your Balance</p>
          <p className="font-bold">{balance.SPIDER} $SPIDER</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {marketItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="font-bold">{item.price} $SPIDER</span>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Market;