import { useState, useMemo } from 'react';
import { Plus, Package, Trash2 } from 'lucide-react';
import type { Product, ProductInput, ProductWithAlert } from '@/types';
import { useProducts } from '../hooks/useProducts';
import ScreenHeader from '@/components/shared/ScreenHeader';
import LoadingState from '@/components/shared/LoadingState';
import EmptyState from '@/components/shared/EmptyState';
import ErrorMessage from '@/components/shared/ErrorMessage';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ProductList from '../components/ProductList';
import ProductFilters from '../components/ProductFilters';
import ProductForm from '../components/ProductForm';
import ProductActionsMenu from '../components/ProductActionsMenu';
import MovementForm from '@/features/movements/components/MovementForm';

export default function ProductsPage() {
  const { products, loading, error, reload, saveProduct, removeProduct, setError } = useProducts();

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [movementProduct, setMovementProduct] = useState<Product | null>(null);
  const [actionMenuProduct, setActionMenuProduct] = useState<ProductWithAlert | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ProductWithAlert | null>(null);

  const categoriesFromData = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.categoria?.nome).filter(Boolean) as string[])
      ).sort(),
    [products]
  );

  const categories = ['todas', ...categoriesFromData];

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchesQuery = p.titulo.toLowerCase().includes(query.toLowerCase());
        const catName = p.categoria?.nome ?? '';
        const matchesCategory = categoryFilter === 'todas' || catName === categoryFilter;
        return matchesQuery && matchesCategory;
      }),
    [products, query, categoryFilter]
  );

  async function handleSave(input: ProductInput, id: string | null) {
    await saveProduct(input, id);
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    try {
      await removeProduct(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch {
      setError('Não foi possível excluir o produto.');
    }
  }

  return (
    <div>
      <ScreenHeader
        title="Produtos"
        subtitle={
          loading
            ? 'Carregando...'
            : `${products.length} ${products.length === 1 ? 'item' : 'itens'} em estoque`
        }
        onRefresh={reload}
        loading={loading}
        actions={
          <button
            onClick={() => { setEditProduct(null); setShowForm(true); }}
            className="btn-accent"
            aria-label="Cadastrar novo produto"
          >
            <Plus size={18} />
            Novo Produto
          </button>
        }
      >
        <ProductFilters
          query={query}
          onQueryChange={setQuery}
          categories={categories}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
      </ScreenHeader>

      <div className="px-5 py-4">
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Nenhum produto cadastrado"
            message='Toque em "Novo Produto" para adicionar seu primeiro item ao estoque.'
          />
        ) : (
          <ProductList
            products={filtered}
            onSelect={(product) => setActionMenuProduct(product)}
          />
        )}

        {actionMenuProduct && (
          <ProductActionsMenu
            product={actionMenuProduct}
            onClose={() => setActionMenuProduct(null)}
            onMovement={(product) => {
              setMovementProduct(product);
              setActionMenuProduct(null);
            }}
            onEdit={(product) => {
              setEditProduct(product as unknown as Product);
              setShowForm(true);
              setActionMenuProduct(null);
            }}
            onDelete={(product) => {
              setDeleteConfirm(product);
              setActionMenuProduct(null);
            }}
          />
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSave={handleSave}
        />
      )}

      {movementProduct && (
        <MovementForm
          product={movementProduct}
          onClose={() => setMovementProduct(null)}
          onSaved={reload}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          icon={<Trash2 size={24} className="text-danger" />}
          title="Excluir produto?"
          message={`"${deleteConfirm.titulo}" e todas as suas movimentações serão removidos permanentemente.`}
          confirmLabel="Excluir"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
