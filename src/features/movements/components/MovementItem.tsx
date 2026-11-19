import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import type { Movement } from '@/types';
import { formatTime } from '@/lib/format';

interface MovementItemProps {
  movement: Movement;
}

export default function MovementItem({ movement }: MovementItemProps) {
  const isEntrada = movement.tipo === 'entrada';

  return (
    <li className="card flex items-center gap-3 p-3.5">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          isEntrada ? 'bg-success/10' : 'bg-danger/10'
        }`}
      >
        {isEntrada ? (
          <ArrowDownCircle size={20} className="text-success" />
        ) : (
          <ArrowUpCircle size={20} className="text-danger" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-ink">
          {movement.produto?.titulo ?? 'Produto removido'}
        </h3>
        <p className="text-xs text-accent-300 mt-0.5">
          {isEntrada ? 'Entrada' : 'Saída'} • {formatTime(movement.data_movimentacao)}
        </p>
      </div>

      <span
        className={`text-sm font-bold ${isEntrada ? 'text-success' : 'text-danger'}`}
      >
        {isEntrada ? '+' : '−'}
        {movement.quantidade} un.
      </span>
    </li>
  );
}
