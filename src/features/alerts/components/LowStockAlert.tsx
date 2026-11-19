import { AlertTriangle, TrendingDown } from 'lucide-react';
import type { ProductWithAlert } from '@/types';

interface LowStockAlertProps {
  products: ProductWithAlert[];
}

export default function LowStockAlert({ products }: LowStockAlertProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <TrendingDown size={16} className="text-danger" />
        <h2 className="section-title text-danger">Estoque baixo</h2>
        <span className="ml-auto text-xs font-semibold text-danger">{products.length}</span>
      </div>
      <ul className="space-y-3">
        {products.map((product) => (
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
  );
}
