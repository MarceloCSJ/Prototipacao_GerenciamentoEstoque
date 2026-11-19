import type { MovementType } from '@/types';

type FilterType = 'todas' | MovementType;

interface MovementFiltersProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { id: FilterType; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'entrada', label: 'Entradas' },
  { id: 'saida', label: 'Saídas' },
];

export default function MovementFilters({ filter, onFilterChange }: MovementFiltersProps) {
  return (
    <div className="border-b border-line bg-surface px-5">
      <div className="flex gap-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`relative px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px] ${
              filter === f.id ? 'text-primary' : 'text-accent-300 hover:text-accent-500'
            }`}
            aria-pressed={filter === f.id}
          >
            {f.label}
            {filter === f.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
