import React from 'react';

function Misc() {
  const miscItems = [
    { id: 1, name: 'Daily Rewards', description: 'Claim your daily $SPIDER tokens' },
    { id: 2, name: 'Achievements', description: 'View your completed achievements' },
    { id: 3, name: 'Rankings', description: 'Global player rankings' },
    { id: 4, name: 'Help', description: 'Game guide and support' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Misc</h1>
      
      <div className="space-y-4">
        {miscItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <button className="text-blue-500">
              <span className="sr-only">Open {item.name}</span>
              →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Misc;