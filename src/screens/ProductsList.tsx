import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Package, AlertTriangle, ChevronRight, RefreshCw, Pencil, Trash2, ArrowLeftRight } from 'lucide-react';
import type { ProductWithAlert, ProductInput } from '@/types';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/services/products';
import ProductForm from '@/components/ProductForm';
import MovementForm from '@/components/MovementForm';
import type { Product } from '@/types';

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getStockStatus(product: ProductWithAlert) {
  if (product.is_low_stock) {
    return {
      pill: <span className="pill-danger"><AlertTriangle size={12} /> Estoque baixo</span>,
      qtyClass: 'text-danger',
    };
  }
  if (product.is_stale) {
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

export default function ProductsList() {
  const [products, setProducts] = useState<ProductWithAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [movementProduct, setMovementProduct] = useState<Product | null>(null);
  const [actionMenuProduct, setActionMenuProduct] = useState<ProductWithAlert | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ProductWithAlert | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      setError('Não foi possível carregar os produtos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categoriesFromData = Array.from(
    new Set(products.map((p) => p.categoria?.nome).filter(Boolean) as string[])
  ).sort();

  const categories = ['todas', ...categoriesFromData];

  const filtered = products.filter((p) => {
    const matchesQuery = p.titulo.toLowerCase().includes(query.toLowerCase());
    const catName = p.categoria?.nome ?? '';
    const matchesCategory = categoryFilter === 'todas' || catName === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  async function handleSave(input: ProductInput, id: string | null) {
    if (id) {
      await updateProduct(id, input);
    } else {
      await createProduct(input);
    }
    await load();
  }

  async function handleDelete(product: ProductWithAlert) {
    try {
      await deleteProduct(product.id);
      await load();
      setDeleteConfirm(null);
    } catch {
      setError('Não foi possível excluir o produto.');
    }
  }

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-line bg-surface">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h1 className="text-xl font-bold text-ink">Produtos</h1>
            <p className="text-xs text-accent-300 mt-0.5">
              {loading ? 'Carregando...' : `${products.length} ${products.length === 1 ? 'item' : 'itens'} em estoque`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="btn-ghost px-3"
              aria-label="Atualizar lista"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => { setEditProduct(null); setShowForm(true); }}
              className="btn-accent"
              aria-label="Cadastrar novo produto"
            >
              <Plus size={18} />
              Novo Produto
            </button>
          </div>
        </div>

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

        {categories.length > 1 && (
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
        )}
      </header>

      <div className="px-5 py-4">
        {error && (
          <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <RefreshCw size={24} className="animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-3">
            {filtered.map((product) => {
              const status = getStockStatus(product);
              return (
                <li key={product.id} className="relative">
                  <button
                    onClick={() => setActionMenuProduct(product)}
                    className="card flex w-full items-center gap-3 p-4 text-left transition-all hover:border-primary hover:shadow-md active:scale-[0.99]"
                    aria-label={`Ver detalhes de ${product.titulo}`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                      <Package size={22} className="text-primary" strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold text-ink">{product.titulo}</h3>
                        <ChevronRight size={18} className="shrink-0 text-accent-300" />
                      </div>
                      <p className="text-xs text-accent-300 mt-0.5">
                        {product.categoria?.nome ?? 'Sem categoria'}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-ink">{formatPrice(Number(product.preco))}</span>
                        <div className="flex items-center gap-2">
                          {status.pill}
                          <span className={`text-sm font-bold ${status.qtyClass}`}>
                            {product.estoque} un.
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Action menu */}
                  {actionMenuProduct?.id === product.id && (
                    <div className="fixed inset-0 z-40" onClick={() => setActionMenuProduct(null)}>
                      <div className="absolute inset-0 bg-accent-900/30" />
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-surface p-4 shadow-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl sm:w-80 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="mb-3 border-b border-line pb-3">
                          <p className="text-sm font-semibold text-ink">{product.titulo}</p>
                          <p className="text-xs text-accent-300 mt-0.5">
                            {product.estoque} un. em estoque
                          </p>
                        </div>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setMovementProduct(product);
                              setActionMenuProduct(null);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-ink hover:bg-canvas min-h-[44px]"
                          >
                            <ArrowLeftRight size={18} className="text-primary" />
                            Registrar movimentação
                          </button>
                          <button
                            onClick={() => {
                              setEditProduct(product as unknown as Product);
                              setShowForm(true);
                              setActionMenuProduct(null);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-ink hover:bg-canvas min-h-[44px]"
                          >
                            <Pencil size={18} className="text-primary" />
                            Editar produto
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirm(product);
                              setActionMenuProduct(null);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-danger hover:bg-danger/5 min-h-[44px]"
                          >
                            <Trash2 size={18} />
                            Excluir produto
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Product form modal */}
      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSave={handleSave}
        />
      )}

      {/* Movement form modal */}
      {movementProduct && (
        <MovementForm
          product={movementProduct}
          onClose={() => setMovementProduct(null)}
          onSaved={load}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-accent-900/50 sm:items-center">
          <div className="w-full max-w-sm rounded-t-2xl bg-surface p-6 sm:rounded-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
              <Trash2 size={24} className="text-danger" />
            </div>
            <h3 className="text-base font-semibold text-ink">Excluir produto?</h3>
            <p className="mt-1 text-sm text-accent-300">
              "{deleteConfirm.titulo}" e todas as suas movimentações serão removidos permanentemente.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-ghost flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn-accent flex-1 !bg-danger hover:!bg-danger/90"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
