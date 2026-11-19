import { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import type { MovementType } from '@/types';
import { useMovements } from '../hooks/useMovements';
import ScreenHeader from '@/components/shared/ScreenHeader';
import LoadingState from '@/components/shared/LoadingState';
import EmptyState from '@/components/shared/EmptyState';
import ErrorMessage from '@/components/shared/ErrorMessage';
import MovementFilters from '../components/MovementFilters';
import MovementList from '../components/MovementList';

type FilterType = 'todas' | MovementType;

export default function MovementsPage() {
  const { movements, loading, error, reload } = useMovements();
  const [filter, setFilter] = useState<FilterType>('todas');

  const filtered = useMemo(
    () => movements.filter((m) => filter === 'todas' || m.tipo === filter),
    [movements, filter]
  );

  return (
    <div>
      <ScreenHeader
        title="Movimentações"
        subtitle={loading ? 'Carregando...' : 'Entradas e saídas registradas'}
        onRefresh={reload}
        loading={loading}
      />

      <MovementFilters filter={filter} onFilterChange={setFilter} />

      <div className="px-5 py-4">
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="Nenhuma movimentação"
            message="As entradas e saídas registradas aparecerão aqui."
          />
        ) : (
          <MovementList movements={filtered} />
        )}
      </div>
    </div>
  );
}
