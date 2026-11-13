import { Plus, Search, Package, AlertTriangle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types';
import { mockProducts } from '@/data/mockData';

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getStockStatus(product: Product) {
  if (product.quantity <= product.minStock) {
    return {
      pill: <span className="pill-danger"><AlertTriangle size={12} /> Estoque baixo</span>,
      qtyClass: 'text-danger',
    };
  }
  if (product.lastMovementDays > 60) {
    return {
      pill: <span className="pill-warning">Sem movimentação</span>,
      qtyClass: 'text-warning',
    };
  }
  return {
    pill: <span className="pill-success">Em dia</span>,
    qtyClass: 'text-ink',
  };
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
        <Package size={36} className="text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-ink">Nenhum produto cadastrado</h3>
      <p className="mt-1 text-sm text-accent-300">
        Toque em "Novo Produto" para adicionar seu primeiro item ao estoque.
      </p>
    </div>
  );
}

interface ProductsListProps {
  onNewProduct: () => void;
}

export default function ProductsList({ onNewProduct }: ProductsListProps) {
  const [products] = useState<Product[]>(mockProducts);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');

  const categories = ['todas', 'Perfume', 'Maquiagem', 'Cabelo', 'Cosmético'];

  const filtered = products.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'todas' || p.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-surface">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h1 className="text-xl font-bold text-ink">Produtos</h1>
            <p className="text-xs text-accent-300 mt-0.5">
              {products.length} {products.length === 1 ? 'item' : 'itens'} em estoque
            </p>
          </div>
          <button onClick={onNewProduct} className="btn-accent" aria-label="Cadastrar novo produto">
            <Plus size={18} />
            Novo Produto
          </button>
        </div>

        {/* Search bar */}
        <div className="px-5 pb-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produto por nome..."
              className="w-full rounded-lg border border-line bg-canvas pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-accent-300 focus:border-primary"
              aria-label="Buscar produtos"
            />
          </div>
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors min-h-[32px] ${
                categoryFilter === cat
                  ? 'bg-primary text-white'
                  : 'bg-canvas text-accent-400 hover:bg-line'
              }`}
              aria-pressed={categoryFilter === cat}
            >
              {cat === 'todas' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      </header>

      {/* Product list or empty state */}
      <div className="px-5 py-4">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-3">
            {filtered.map((product) => {
              const status = getStockStatus(product);
              return (
                <li key={product.id}>
                  <button
                    className="card flex w-full items-center gap-3 p-4 text-left transition-all hover:border-primary hover:shadow-md active:scale-[0.99]"
                    aria-label={`Ver detalhes de ${product.name}`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                      <Package size={22} className="text-primary" strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold text-ink">{product.name}</h3>
                        <ChevronRight size={18} className="shrink-0 text-accent-300" />
                      </div>
                      <p className="text-xs text-accent-300 mt-0.5">{product.category}</p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-ink">{formatPrice(product.price)}</span>
                        <div className="flex items-center gap-2">
                          {status.pill}
                          <span className={`text-sm font-bold ${status.qtyClass}`}>
                            {product.quantity} un.
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
