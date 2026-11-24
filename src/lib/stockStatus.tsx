import { AlertTriangle } from 'lucide-react';
import type { ProductWithAlert } from '@/types';

export type StockStatusKind = 'low' | 'stale' | 'healthy';

export interface StockStatus {
  kind: StockStatusKind;
  pill: React.ReactNode;
  qtyClass: string;
}

export function getStockStatus(product: ProductWithAlert): StockStatus {
  if (product.is_low_stock) {
    return {
      kind: 'low',
      pill: (
        <span className="pill-danger">
          <AlertTriangle size={12} /> Estoque baixo
        </span>
      ),
      qtyClass: 'text-danger',
    };
  }
  if (product.is_stale) {
    return {
      kind: 'stale',
      pill: <span className="pill-warning">Sem movimentação</span>,
      qtyClass: 'text-warning',
    };
  }
  return {
    kind: 'healthy',
    pill: <span className="pill-success">Em dia</span>,
    qtyClass: 'text-ink',
  };
}
