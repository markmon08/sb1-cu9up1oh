import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { TonConnectButton } from '@tonconnect/ui-react';
import { Dialog } from '@headlessui/react';

function Profile() {
  const { player } = useGameStore();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const stats = {
    totalSpiders: player.spiders.length,
    highestLevel: Math.max(...player.spiders.map(s => s.level)),
    totalPower: player.spiders.reduce((sum, s) => sum + s.power, 0),
    accountCreated: new Date(player.createdAt).toLocaleDateString(),
  };

  const handleWithdraw = () => {
    // Implement TON withdrawal logic here
    console.log('Withdrawing:', withdrawAmount);
    setIsWithdrawOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <TonConnectButton />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Account Balance</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">$SPIDER</p>
                <p className="font-bold">{player.balance.SPIDER}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Feeders</p>
                <p className="font-bold">{player.balance.feeders}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Withdraw $SPIDER
          </button>

          <div>
            <h2 className="text-lg font-semibold mb-2">Statistics</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Spiders</span>
                <span className="font-bold">{stats.totalSpiders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Highest Level</span>
                <span className="font-bold">{stats.highestLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Power</span>
                <span className="font-bold">{stats.totalPower}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Created</span>
                <span className="font-bold">{stats.accountCreated}</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button className="w-full bg-red-500 text-white py-2 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-bold mb-4">
              Withdraw $SPIDER
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to withdraw
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter amount"
                  max={player.balance.SPIDER}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available: {player.balance.SPIDER} $SPIDER
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsWithdrawOpen(false)}
                  className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={!withdrawAmount || Number(withdrawAmount) > player.balance.SPIDER}
                >
                  Withdraw
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default Profile;