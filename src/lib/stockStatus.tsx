import { AlertTriangle, Bell } from 'lucide-react';
import type { ProductWithAlert } from '@/types';

export type StockStatusKind = 'low' | 'stale' | 'warning' | 'healthy';

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
  if (product.is_warning) {
    return {
      kind: 'warning',
      pill: (
        <span className="pill-warning">
          <Bell size={12} /> Aviso de reposição
        </span>
      ),
      qtyClass: 'text-warning',
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

export function computeProductAlerts(
  estoque: number,
  estoqueMinimo: number,
  lastMovementDate: string | null,
  dataCriacao: string,
  antecedencia: number,
  diasParaConsiderarParado: number
): {
  is_low_stock: boolean;
  is_warning: boolean;
  is_stale: boolean;
  days_since_movement: number | null;
} {
  const limiteAviso = estoqueMinimo + antecedencia;
  const is_low_stock = estoque <= estoqueMinimo;
  const is_warning = !is_low_stock && estoque <= limiteAviso;

  const now = Date.now();
  const refDate = lastMovementDate ?? dataCriacao;
  const diffMs = now - new Date(refDate).getTime();
  const days_since_movement = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const is_stale = days_since_movement > diasParaConsiderarParado;

  return { is_low_stock, is_warning, is_stale, days_since_movement };
}
