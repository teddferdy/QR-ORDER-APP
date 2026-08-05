import React from 'react';
import { useCartStore } from '../store/useCartStore';

interface CartSummaryProps {
  showDetails?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ showDetails = true }) => {
  const { subtotal, tax, serviceCharge, totalPrice, totalItems } =
    useCartStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 space-y-4 border border-gray-50 dark:border-gray-700/50 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-600 dark:text-gray-400 font-medium">Total Item</span>
        <span className="font-bold text-gray-900 dark:text-gray-100">{totalItems()}</span>
      </div>
      {showDetails && (
        <>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-700 dark:text-gray-300">Rp{subtotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Pajak (11%)</span>
            <span className="text-gray-700 dark:text-gray-300">Rp{tax().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Service Charge (5%)</span>
            <span className="text-gray-700 dark:text-gray-300">Rp{serviceCharge().toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg">
            <span className="text-gray-900 dark:text-gray-100">Total</span>
            <span className="text-primary">
              Rp{totalPrice().toLocaleString()}
            </span>
          </div>
        </>
      )}
      {!showDetails && (
        <div className="flex justify-between font-bold text-lg">
          <span className="text-gray-900 dark:text-gray-100">Total</span>
          <span className="text-primary">
            Rp{totalPrice().toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
