import React from 'react';
import { CheckCircle2, Clock, ChefHat, Bike, MapPin, XCircle, Ban } from 'lucide-react';
import type { OrderStatus } from '../types';

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
  compact?: boolean;
}

const statusSteps: { id: OrderStatus; label: string; icon: React.FC<{size?: number}> }[] = [
  { id: 'Menunggu Konfirmasi', label: 'Menunggu', icon: Clock },
  { id: 'Diproses', label: 'Diproses', icon: CheckCircle2 },
  { id: 'Sedang Dimasak', label: 'Dimasak', icon: ChefHat },
  { id: 'Siap Diantar', label: 'Siap', icon: Bike },
  { id: 'Sudah Diantar', label: 'Sampai', icon: MapPin },
  { id: 'Ditolak', label: 'Ditolak', icon: XCircle },
  { id: 'Dibatalkan', label: 'Dibatalkan', icon: Ban },
];

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  currentStatus,
  compact = false,
}) => {
  const currentIndex = statusSteps.findIndex((s) => s.id === currentStatus);
  const isRejected = currentStatus === 'Ditolak' || currentStatus === 'Dibatalkan';

  return (
    <div
      className={`${compact ? 'py-4' : 'p-6'} bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700/50`}
    >
      <div className="relative flex justify-between">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-0" />
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-2 z-10 ${compact ? 'scale-75' : ''}`}
            >
              <div
                className={`p-3 rounded-full transition-all ${
                  isRejected && isCurrent
                    ? 'bg-destructive text-white shadow-md shadow-destructive/30'
                    : isCompleted
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <Icon size={compact ? 16 : 20} />
              </div>
              <span
                className={`text-[10px] font-bold text-center ${
                  isCompleted || (isRejected && isCurrent)
                    ? isRejected && isCurrent
                      ? 'text-destructive'
                      : 'text-primary'
                    : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 mt-4">
        Status: {currentStatus}
      </p>
    </div>
  );
};

export default OrderStatusTracker;
