import { ArrowLeftRight, Pencil, Trash2 } from 'lucide-react';
import type { ProductWithAlert } from '@/types';

interface ProductActionsMenuProps {
  product: ProductWithAlert;
  onClose: () => void;
  onMovement: (product: ProductWithAlert) => void;
  onEdit: (product: ProductWithAlert) => void;
  onDelete: (product: ProductWithAlert) => void;
}

export default function ProductActionsMenu({
  product,
  onClose,
  onMovement,
  onEdit,
  onDelete,
}: ProductActionsMenuProps) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-accent-900/30" />
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-surface p-4 shadow-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl sm:w-80 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 dark:bg-surface-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 border-b border-line pb-3 dark:border-line-dark">
          <p className="text-sm font-semibold text-ink dark:text-ink-dark">{product.titulo}</p>
          <p className="text-xs text-accent-300 mt-0.5">
            {product.estoque} un. em estoque
          </p>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => onMovement(product)}
            className="flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-ink hover:bg-canvas min-h-[44px] dark:text-ink-dark dark:hover:bg-canvas-dark"
          >
            <ArrowLeftRight size={18} className="text-primary" />
            Registrar movimentação
          </button>
          <button
            onClick={() => onEdit(product)}
            className="flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-ink hover:bg-canvas min-h-[44px] dark:text-ink-dark dark:hover:bg-canvas-dark"
          >
            <Pencil size={18} className="text-primary" />
            Editar produto
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-danger hover:bg-danger/5 min-h-[44px]"
          >
            <Trash2 size={18} />
            Excluir produto
          </button>
        </div>
      </div>
    </div>
  );
}
