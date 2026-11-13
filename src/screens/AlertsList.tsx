import { AlertTriangle, Clock, TrendingDown, CheckCircle2, Package } from 'lucide-react';
import type { Product } from '@/types';
import { mockProducts } from '@/data/mockData';

interface AlertItem {
  product: Product;
  type: 'low' | 'stale';
  reason: string;
}

export default function AlertsList() {
  const products: Product[] = mockProducts;

  const lowStock: AlertItem[] = products
    .filter((p) => p.quantity <= p.minStock)
    .map((p) => ({
      product: p,
      type: 'low' as const,
      reason: `Saldo ${p.quantity} un. • Mínimo ${p.minStock} un.`,
    }));

  const stale: AlertItem[] = products
    .filter((p) => p.lastMovementDays > 60)
    .map((p) => ({
      product: p,
      type: 'stale' as const,
      reason: `Sem movimentação há ${p.lastMovementDays} dias`,
    }));

  const allAlerts = [...lowStock, ...stale];
  const hasAlerts = allAlerts.length > 0;

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-line bg-surface px-5 pt-5 pb-4">
        <h1 className="text-xl font-bold text-ink">Alertas</h1>
        <p className="text-xs text-accent-300 mt-0.5">
          {hasAlerts
            ? `${allAlerts.length} ${allAlerts.length === 1 ? 'situação pendente' : 'situações pendentes'}`
            : 'Tudo em ordem'}
        </p>
      </header>

      <div className="px-5 py-4">
        {!hasAlerts ? (
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
            {/* Low stock section */}
            {lowStock.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <TrendingDown size={16} className="text-danger" />
                  <h2 className="section-title text-danger">Estoque baixo</h2>
                  <span className="ml-auto text-xs font-semibold text-danger">{lowStock.length}</span>
                </div>
                <ul className="space-y-3">
                  {lowStock.map(({ product, reason }) => (
                    <li key={`low-${product.id}`} className="card p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-danger/10">
                          <AlertTriangle size={18} className="text-danger" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-ink">{product.name}</h3>
                          <p className="text-xs text-accent-300 mt-0.5">{product.category}</p>
                          <p className="text-xs text-danger font-medium mt-1.5">{reason}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Stale products section */}
            {stale.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-warning" />
                  <h2 className="section-title text-warning">Sem movimentação (+60 dias)</h2>
                  <span className="ml-auto text-xs font-semibold text-warning">{stale.length}</span>
                </div>
                <ul className="space-y-3">
                  {stale.map(({ product, reason }) => (
                    <li key={`stale-${product.id}`} className="card p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                          <Clock size={18} className="text-warning" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-ink">{product.name}</h3>
                          <p className="text-xs text-accent-300 mt-0.5">{product.category}</p>
                          <p className="text-xs text-warning font-medium mt-1.5">{reason}</p>
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
