import { Clock } from 'lucide-react';
import type { ProductWithAlert } from '@/types';

interface InactiveProductAlertProps {
  products: ProductWithAlert[];
}

export default function InactiveProductAlert({ products }: InactiveProductAlertProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Clock size={16} className="text-warning" />
        <h2 className="section-title text-warning">Sem movimentação (+60 dias)</h2>
        <span className="ml-auto text-xs font-semibold text-warning">{products.length}</span>
      </div>
      <ul className="space-y-3">
        {products.map((product) => (
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
  );
}
