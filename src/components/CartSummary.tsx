import React from 'react';
import { useCartStore } from '../store/useCartStore';

interface CartSummaryProps {
  showDetails?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ showDetails = true }) => {
  const { subtotal, tax, serviceCharge, totalPrice, totalItems } =
    useCartStore();

  return (
    <div className="bg-white rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Total Item</span>
        <span className="font-bold">{totalItems()}</span>
      </div>
      {showDetails && (
        <>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>Rp{subtotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Pajak (11%)</span>
            <span>Rp{tax().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Service Charge (5%)</span>
            <span>Rp{serviceCharge().toLocaleString()}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">
              Rp{totalPrice().toLocaleString()}
            </span>
          </div>
        </>
      )}
      {!showDetails && (
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">
            Rp{totalPrice().toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default CartSummary;