import { Search } from 'lucide-react';

interface ProductFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  categories: string[];
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
}

export default function ProductFilters({
  query,
  onQueryChange,
  categories,
  categoryFilter,
  onCategoryChange,
}: ProductFiltersProps) {
  return (
    <div className="px-5 pb-3">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar produto por nome..."
          className="form-input pl-10"
          aria-label="Buscar produtos"
        />
      </div>

      {categories.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors min-h-[32px] ${
                categoryFilter === cat
                  ? 'bg-primary text-white'
                  : 'bg-canvas text-accent-400 hover:bg-line dark:bg-canvas-dark dark:text-accent-300 dark:hover:bg-line-dark'
              }`}
              aria-pressed={categoryFilter === cat}
            >
              {cat === 'todas' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
