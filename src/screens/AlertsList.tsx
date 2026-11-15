import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Clock, TrendingDown, CheckCircle2, RefreshCw } from 'lucide-react';
import type { ProductWithAlert } from '@/types';
import { fetchProducts } from '@/services/products';

export default function AlertsList() {
  const [products, setProducts] = useState<ProductWithAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      setError('Não foi possível carregar os alertas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const lowStock = products.filter((p) => p.is_low_stock);
  const stale = products.filter((p) => p.is_stale);
  const allAlerts = [...lowStock, ...stale];
  const hasAlerts = allAlerts.length > 0;

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-line bg-surface px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink">Alertas</h1>
            <p className="text-xs text-accent-300 mt-0.5">
              {loading ? 'Carregando...' : hasAlerts
                ? `${allAlerts.length} ${allAlerts.length === 1 ? 'situação pendente' : 'situações pendentes'}`
                : 'Tudo em ordem'}
            </p>
          </div>
          <button onClick={load} className="btn-ghost px-3" aria-label="Atualizar alertas">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <div className="px-5 py-4">
        {error && (
          <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <RefreshCw size={24} className="animate-spin text-primary" />
          </div>
        ) : !hasAlerts ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 size={36} className="text-success" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-ink">Nenhuma situação pendente</h3>
            <p className="mt-1 text-sm text-accent-300">
              Todos os produtos estão com saldo e movimentação adequados.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {lowStock.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <TrendingDown size={16} className="text-danger" />
                  <h2 className="section-title text-danger">Estoque baixo</h2>
                  <span className="ml-auto text-xs font-semibold text-danger">{lowStock.length}</span>
                </div>
                <ul className="space-y-3">
                  {lowStock.map((product) => (
                    <li key={`low-${product.id}`} className="card p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-danger/10">
                          <AlertTriangle size={18} className="text-danger" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-ink">{product.titulo}</h3>
                          <p className="text-xs text-accent-300 mt-0.5">
                            {product.categoria?.nome ?? 'Sem categoria'}
                          </p>
                          <p className="text-xs text-danger font-medium mt-1.5">
                            Saldo {product.estoque} un. • Mínimo {product.estoque_minimo} un.
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {stale.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-warning" />
                  <h2 className="section-title text-warning">Sem movimentação (+60 dias)</h2>
                  <span className="ml-auto text-xs font-semibold text-warning">{stale.length}</span>
                </div>
                <ul className="space-y-3">
                  {stale.map((product) => (
                    <li key={`stale-${product.id}`} className="card p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                          <Clock size={18} className="text-warning" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-ink">{product.titulo}</h3>
                          <p className="text-xs text-accent-300 mt-0.5">
                            {product.categoria?.nome ?? 'Sem categoria'}
                          </p>
                          <p className="text-xs text-warning font-medium mt-1.5">
                            Sem movimentação há {product.days_since_movement} dias
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
