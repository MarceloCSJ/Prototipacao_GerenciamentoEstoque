import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { X, Plus, Tag, AlertCircle } from 'lucide-react';
import type { Product, Category, ProductInput } from '@/types';
import { fetchCategories, createCategory } from '@/services/categories';

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSave: (input: ProductInput, id: string | null) => Promise<void>;
}

export default function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const [titulo, setTitulo] = useState('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [catLoading, setCatLoading] = useState(false);

  const isEdit = product !== null;

  useEffect(() => {
    loadCategories();
    if (product) {
      setTitulo(product.titulo);
      setCategoriaId(product.categoria_id ?? '');
      setPreco(String(product.preco));
      setEstoque(String(product.estoque));
      setEstoqueMinimo(String(product.estoque_minimo));
    }
  }, [product]);

  async function loadCategories() {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch {
      // categories will just be empty
    }
  }

  async function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    setCatLoading(true);
    try {
      const cat = await createCategory(name);
      setCategories((prev) => [...prev, cat].sort((a, b) => a.nome.localeCompare(b.nome)));
      setCategoriaId(cat.id);
      setNewCategoryName('');
      setShowNewCategory(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('duplicate') || msg.includes('unique')) {
        setError('Esta categoria já existe.');
      } else {
        setError('Não foi possível cadastrar a categoria.');
      }
    } finally {
      setCatLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const precoNum = parseFloat(preco.replace(',', '.'));
    const estoqueNum = parseInt(estoque, 10);
    const minNum = parseInt(estoqueMinimo, 10);

    if (!titulo.trim()) {
      setError('Informe o nome do produto.');
      return;
    }
    if (isNaN(precoNum) || precoNum <= 0) {
      setError('O preço deve ser maior que zero.');
      return;
    }
    if (isNaN(estoqueNum) || estoqueNum < 0) {
      setError('A quantidade em estoque não pode ser negativa.');
      return;
    }
    if (isNaN(minNum) || minNum < 0) {
      setError('O estoque mínimo não pode ser negativo.');
      return;
    }

    setSaving(true);
    try {
      await onSave(
        {
          titulo: titulo.trim(),
          categoria_id: categoriaId || null,
          preco: precoNum,
          estoque: estoqueNum,
          estoque_minimo: minNum,
        },
        product?.id ?? null
      );
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('preco_positivo')) {
        setError('O preço deve ser maior que zero.');
      } else if (msg.includes('estoque_nao_negativo')) {
        setError('O estoque não pode ser negativo.');
      } else if (msg.includes('estoque_minimo_nao_negativo')) {
        setError('O estoque mínimo não pode ser negativo.');
      } else {
        setError('Não foi possível salvar o produto. Tente novamente.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-accent-900/50 sm:items-center">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-surface sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold text-ink">
            {isEdit ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-accent-300 hover:bg-canvas hover:text-accent-500"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div>
            <label htmlFor="titulo" className="mb-1.5 block text-sm font-medium text-ink">
              Nome do produto *
            </label>
            <input
              id="titulo"
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Perfume Floral Bianca 50ml"
              className="w-full rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-accent-300 focus:border-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="categoria" className="mb-1.5 block text-sm font-medium text-ink">
              Categoria
            </label>
            {!showNewCategory ? (
              <div className="flex gap-2">
                <select
                  id="categoria"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="flex-1 rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm text-ink focus:border-primary"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="btn-ghost px-3"
                  aria-label="Cadastrar nova categoria"
                >
                  <Plus size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nome da nova categoria"
                  className="flex-1 rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-accent-300 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={catLoading || !newCategoryName.trim()}
                  className="btn-primary px-3"
                >
                  <Tag size={16} />
                  {catLoading ? '...' : 'OK'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowNewCategory(false); setNewCategoryName(''); }}
                  className="btn-ghost px-3"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="preco" className="mb-1.5 block text-sm font-medium text-ink">
              Preço (R$) *
            </label>
            <input
              id="preco"
              type="text"
              inputMode="decimal"
              required
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="Ex: 89,90"
              className="w-full rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-accent-300 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="estoque" className="mb-1.5 block text-sm font-medium text-ink">
                Estoque {isEdit ? '(atual)' : 'inicial'} *
              </label>
              <input
                id="estoque"
                type="number"
                inputMode="numeric"
                min="0"
                required
                disabled={isEdit}
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-accent-300 focus:border-primary disabled:opacity-60"
              />
              {isEdit && (
                <p className="mt-1 text-xs text-accent-300">
                  Use movimentações para alterar o saldo.
                </p>
              )}
            </div>
            <div>
              <label htmlFor="estoqueMinimo" className="mb-1.5 block text-sm font-medium text-ink">
                Estoque mínimo *
              </label>
              <input
                id="estoqueMinimo"
                type="number"
                inputMode="numeric"
                min="0"
                required
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-accent-300 focus:border-primary"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex gap-3 border-t border-line px-5 py-4">
          <button onClick={onClose} className="btn-ghost flex-1">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary flex-1"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
