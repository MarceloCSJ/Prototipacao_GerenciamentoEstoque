import { ChevronRight, Package } from 'lucide-react';
import type { ProductWithAlert } from '@/types';
import { getStockStatus } from '@/lib/stockStatus';
import { formatPrice } from '@/lib/format';

interface ProductCardProps {
  product: ProductWithAlert;
  onClick: (product: ProductWithAlert) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const status = getStockStatus(product);

  return (
    <li className="relative">
      <button
        onClick={() => onClick(product)}
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
            <span className="text-sm font-semibold text-ink">
              {formatPrice(Number(product.preco))}
            </span>
            <div className="flex items-center gap-2">
              {status.pill}
              <span className={`text-sm font-bold ${status.qtyClass}`}>
                {product.estoque} un.
              </span>
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}
