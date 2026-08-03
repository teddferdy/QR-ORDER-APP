import React from 'react';
import { useOrderStore } from '../store/useOrderStore';
import CallWaiterButton from '../components/CallWaiterButton';
import { Headphones } from 'lucide-react';

const WaiterPage: React.FC = () => {
  const waiterRequests = useOrderStore((state) => state.getWaiterRequests());

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold">Pelayan</h2>

      <div className="bg-white rounded-3xl p-6 text-center space-y-4">
        <div className="text-6xl">
          <Headphones size={64} className="mx-auto text-primary" />
        </div>
        <h3 className="font-bold text-lg">Butuh Bantuan?</h3>
        <p className="text-gray-500 text-sm">
          Minta bantuan pelayan kapan saja. Pilih kebutuhanmu di bawah.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold">Permintaan Aktif</h3>
        {waiterRequests.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Belum ada permintaan aktif.
          </p>
        ) : (
          waiterRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {req.type === 'Sendok'
                    ? '🥄'
                    : req.type === 'Tisu'
                    ? '🧻'
                    : req.type === 'Refill'
                    ? '🥤'
                    : req.type === 'Bill'
                    ? '🧾'
                    : '🧑‍🍳'}
                </span>
                <div>
                  <p className="font-bold text-sm">{req.type}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(req.createdAt).toLocaleTimeString('id-ID')}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  req.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {req.status === 'Pending' ? 'Menunggu' : 'Diterima'}
              </span>
            </div>
          ))
        )}
      </div>

      <CallWaiterButton />
    </div>
  );
};

export default WaiterPage;