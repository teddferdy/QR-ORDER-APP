import React, { useState } from 'react';
import { Headphones } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import type { WaiterRequest } from '../types';

interface CallWaiterButtonProps {
  orderId?: string;
}

const waiterRequestTypes: WaiterRequest['type'][] = [
  'Sendok',
  'Tisu',
  'Refill',
  'Bill',
  'Panggil Pelayan',
];

const CallWaiterButton: React.FC<CallWaiterButtonProps> = ({ orderId }) => {
  const addWaiterRequest = useOrderStore((state) => state.addWaiterRequest);
  const [showMenu, setShowMenu] = useState(false);
  const [lastRequest, setLastRequest] = useState<string | null>(null);

  const handleRequest = (type: WaiterRequest['type']) => {
    const request: WaiterRequest = {
      id: crypto.randomUUID(),
      type,
      orderId,
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };
    addWaiterRequest(request);
    setLastRequest(type);
    setShowMenu(false);
    setTimeout(() => setLastRequest(null), 3000);
  };

  return (
    <div className="fixed bottom-24 left-4 z-40">
      {lastRequest && (
        <div className="bg-primary text-white px-4 py-3 rounded-2xl shadow-lg mb-3 flex items-center gap-2 text-sm font-bold animate-pulse">
          <span>✅</span> Permintaan "{lastRequest}" terkirim!
        </div>
      )}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-light transition-colors"
        >
          <Headphones size={24} />
        </button>
        {showMenu && (
          <div className="absolute bottom-16 left-0 bg-white rounded-3xl shadow-xl p-4 space-y-2 w-48">
            {waiterRequestTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleRequest(type)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallWaiterButton;