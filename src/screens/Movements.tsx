import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight } from 'lucide-react';
import { useState } from 'react';
import { mockMovements } from '@/data/mockData';
import type { Movement } from '@/types';

type FilterType = 'todas' | 'entrada' | 'saida';

export default function Movements() {
  const [movements] = useState<Movement[]>(mockMovements);
  const [filter, setFilter] = useState<FilterType>('todas');

  const filters: { id: FilterType; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'entrada', label: 'Entradas' },
    { id: 'saida', label: 'Saídas' },
  ];

  const filtered = movements.filter((m) => filter === 'todas' || m.type === filter);

  const grouped = filtered.reduce<Record<string, Movement[]>>((acc, m) => {
    if (!acc[m.date]) acc[m.date] = [];
    acc[m.date].push(m);
    return acc;
  }, {});

  const dates = Object.keys(grouped);

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-line bg-surface px-5 pt-5 pb-3">
        <h1 className="text-xl font-bold text-ink">Movimentações</h1>
        <p className="text-xs text-accent-300 mt-0.5">Entradas e saídas registradas</p>
      </header>

      {/* Filter tabs */}
      <div className="border-b border-line bg-surface px-5">
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`relative px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px] ${
                filter === f.id ? 'text-primary' : 'text-accent-300 hover:text-accent-500'
              }`}
              aria-pressed={filter === f.id}
            >
              {f.label}
              {filter === f.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Movement timeline */}
      <div className="px-5 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
              <ArrowLeftRight size={36} className="text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-ink">Nenhuma movimentação</h3>
            <p className="mt-1 text-sm text-accent-300">
              As entradas e saídas registradas aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {dates.map((date) => (
              <div key={date}>
                <h2 className="section-title mb-3">{date}</h2>
                <ul className="space-y-2.5">
                  {grouped[date].map((m) => {
                    const isEntrada = m.type === 'entrada';
                    return (
                      <li key={m.id} className="card flex items-center gap-3 p-3.5">
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
                          <h3 className="truncate text-sm font-semibold text-ink">{m.productName}</h3>
                          <p className="text-xs text-accent-300 mt-0.5">
                            {isEntrada ? 'Entrada' : 'Saída'} • {m.time}
                          </p>
                        </div>

                        <span
                          className={`text-sm font-bold ${isEntrada ? 'text-success' : 'text-danger'}`}
                        >
                          {isEntrada ? '+' : '−'}
                          {m.amount} un.
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
