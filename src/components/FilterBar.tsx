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
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full font-medium whitespace-nowrap transition-all text-sm shadow-sm ${
              isActive
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700'
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
