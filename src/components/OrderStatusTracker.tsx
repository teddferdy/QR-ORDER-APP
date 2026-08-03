import React from 'react';
import { CheckCircle2, Clock, ChefHat, Bike, MapPin } from 'lucide-react';
import type { OrderStatus } from '../types';

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
  compact?: boolean;
}

const statusSteps: { id: OrderStatus; label: string; icon: React.FC<{size?: number}> }[] = [
  { id: 'Menunggu Konfirmasi', label: 'Dikonfirmasi', icon: CheckCircle2 },
  { id: 'Diproses', label: 'Diproses', icon: Clock },
  { id: 'Sedang Dimasak', label: 'Dimasak', icon: ChefHat },
  { id: 'Siap Diantar', label: 'Siap', icon: Bike },
  { id: 'Sudah Diantar', label: 'Sampai', icon: MapPin },
];

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  currentStatus,
  compact = false,
}) => {
  const currentIndex = statusSteps.findIndex((s) => s.id === currentStatus);

  return (
    <div
      className={`${compact ? 'py-4' : 'p-6'} bg-white rounded-3xl`}
    >
      <div className="relative flex justify-between">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-0" />
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          return (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-2 z-10 ${compact ? 'scale-75' : ''}`}
            >
              <div
                className={`p-3 rounded-full ${
                  isCompleted
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Icon size={compact ? 16 : 20} />
              </div>
              <span
                className={`text-[10px] font-bold text-center ${
                  isCompleted ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm font-medium text-gray-600 mt-4">
        Status: {currentStatus}
      </p>
    </div>
  );
};

export default OrderStatusTracker;