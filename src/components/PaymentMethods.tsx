import React from 'react';
import type { PaymentMethod } from '../types';

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  splitCount: number;
  onSplitChange: (count: number) => void;
  total: number;
}

const paymentOptions: { id: PaymentMethod; label: string; icon: string; description: string }[] = [
  { id: 'QRIS', label: 'QRIS', icon: '📱', description: 'Scan QR untuk bayar' },
  { id: 'E-Wallet', label: 'E-Wallet', icon: '👛', description: 'GoPay, OVO, Dana, dll.' },
  { id: 'Kartu Kredit', label: 'Kartu Kredit', icon: '💳', description: 'Visa, Mastercard, dll.' },
  { id: 'Tunai', label: 'Tunai', icon: '💵', description: 'Bayar tunai di kasir' },
  { id: 'Postpaid', label: 'Postpaid', icon: '🧾', description: 'Bayar setelah makan' },
  { id: 'Split Bill', label: 'Split Bill', icon: '✂️', description: 'Bagi tagihan' },
];

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onSelect,
  splitCount,
  onSplitChange,
  total,
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-bold text-sm">Pilih Metode Pembayaran</h4>
      <div className="grid grid-cols-2 gap-3">
        {paymentOptions.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-100 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-bold text-sm">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.description}</div>
            </button>
          );
        })}
      </div>
      {selectedMethod === 'Split Bill' && (
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <h5 className="font-bold text-sm">Jumlah Pembagi</h5>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSplitChange(Math.max(2, splitCount - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 font-bold text-lg"
            >
              −
            </button>
            <span className="text-2xl font-bold flex-1 text-center">
              {splitCount}
            </span>
            <button
              onClick={() => onSplitChange(splitCount + 1)}
              className="w-10 h-10 rounded-full bg-gray-100 font-bold text-lg"
            >
              +
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Setiap orang membayar:{' '}
            <span className="font-bold text-primary">
              Rp{(total / splitCount).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;