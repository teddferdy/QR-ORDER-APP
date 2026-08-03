import React from 'react';

interface FilterBarProps {
  filters: { id: string; label: string; icon: string }[];
  activeFilters: string[];
  onToggle: (id: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  activeFilters,
  onToggle,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.id);
        return (
          <button
            key={filter.id}
            onClick={() => onToggle(filter.id)}
            className={`flex items-center gap-1 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all text-sm ${
              isActive
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-gray-600'
            }`}
          >
            <span>{filter.icon}</span>
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;