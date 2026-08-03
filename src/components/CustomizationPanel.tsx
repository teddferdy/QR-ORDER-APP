import React from 'react';
import type { Product, Size, Spiciness } from '../types';

interface CustomizationPanelProps {
  product: Product;
  selectedSize: Size | undefined;
  selectedSpiciness: Spiciness | undefined;
  selectedAddOns: string[];
  notes: string;
  onSizeChange: (size: Size | undefined) => void;
  onSpicinessChange: (spiciness: Spiciness | undefined) => void;
  onAddOnToggle: (addOnId: string) => void;
  onNotesChange: (notes: string) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  product,
  selectedSize,
  selectedSpiciness,
  selectedAddOns,
  notes,
  onSizeChange,
  onSpicinessChange,
  onAddOnToggle,
  onNotesChange,
}) => {
  return (
    <div className="space-y-6">
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h4 className="font-bold text-sm mb-3">Pilih Ukuran</h4>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() =>
                  onSizeChange(selectedSize === size ? undefined : size)
                }
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedSize === size
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.spicinessLevels && product.spicinessLevels.length > 0 && (
        <div>
          <h4 className="font-bold text-sm mb-3">Level Pedas</h4>
          <div className="flex gap-2 flex-wrap">
            {product.spicinessLevels.map((level) => (
              <button
                key={level}
                onClick={() =>
                  onSpicinessChange(
                    selectedSpiciness === level ? undefined : level
                  )
                }
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedSpiciness === level
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.addOns && product.addOns.length > 0 && (
        <div>
          <h4 className="font-bold text-sm mb-3">Extra Topping</h4>
          <div className="flex gap-2 flex-wrap">
            {product.addOns.map((addOn) => {
              const isSelected = selectedAddOns.includes(addOn.id);
              return (
                <button
                  key={addOn.id}
                  onClick={() => onAddOnToggle(addOn.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    isSelected
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {addOn.name}
                  <span className="ml-1 opacity-70">
                    +Rp{addOn.price.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-bold text-sm mb-3">Catatan Khusus</h4>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Contoh: tanpa bawang, es sedikit, dll."
          className="w-full p-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          rows={3}
        />
      </div>
    </div>
  );
};

export default CustomizationPanel;