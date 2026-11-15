import { useEffect, useState, useCallback } from 'react';
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, RefreshCw } from 'lucide-react';
import type { Movement } from '@/types';
import { fetchMovements } from '@/services/movements';

type FilterType = 'todas' | 'entrada' | 'saida';

function formatDateGroup(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function Movements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('todas');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMovements();
      setMovements(data);
    } catch {
      setError('Não foi possível carregar as movimentações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filters: { id: FilterType; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'entrada', label: 'Entradas' },
    { id: 'saida', label: 'Saídas' },
  ];

  const filtered = movements.filter((m) => filter === 'todas' || m.tipo === filter);

  const grouped = filtered.reduce<Record<string, Movement[]>>((acc, m) => {
    const key = formatDateGroup(m.data_movimentacao);
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const dates = Object.keys(grouped);

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-line bg-surface px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink">Movimentações</h1>
            <p className="text-xs text-accent-300 mt-0.5">
              {loading ? 'Carregando...' : 'Entradas e saídas registradas'}
            </p>
          </div>
          <button onClick={load} className="btn-ghost px-3" aria-label="Atualizar movimentações">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

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

      <div className="px-5 py-4">
        {error && (
          <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <RefreshCw size={24} className="animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
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
                    const isEntrada = m.tipo === 'entrada';
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
                          <h3 className="truncate text-sm font-semibold text-ink">
                            {m.produto?.titulo ?? 'Produto removido'}
                          </h3>
                          <p className="text-xs text-accent-300 mt-0.5">
                            {isEntrada ? 'Entrada' : 'Saída'} • {formatTime(m.data_movimentacao)}
                          </p>
                        </div>

                        <span
                          className={`text-sm font-bold ${isEntrada ? 'text-success' : 'text-danger'}`}
                        >
                          {isEntrada ? '+' : '−'}
                          {m.quantidade} un.
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
