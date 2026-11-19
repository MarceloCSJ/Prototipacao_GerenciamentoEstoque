import { useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useProducts } from '@/features/products/hooks/useProducts';
import ScreenHeader from '@/components/shared/ScreenHeader';
import LoadingState from '@/components/shared/LoadingState';
import EmptyState from '@/components/shared/EmptyState';
import ErrorMessage from '@/components/shared/ErrorMessage';
import LowStockAlert from '../components/LowStockAlert';
import InactiveProductAlert from '../components/InactiveProductAlert';

export default function AlertsPage() {
  const { products, loading, error, reload } = useProducts();

  const lowStock = useMemo(() => products.filter((p) => p.is_low_stock), [products]);
  const stale = useMemo(() => products.filter((p) => p.is_stale), [products]);
  const allAlerts = useMemo(() => [...lowStock, ...stale], [lowStock, stale]);
  const hasAlerts = allAlerts.length > 0;

  return (
    <div>
      <ScreenHeader
        title="Alertas"
        subtitle={
          loading
            ? 'Carregando...'
            : hasAlerts
              ? `${allAlerts.length} ${allAlerts.length === 1 ? 'situação pendente' : 'situações pendentes'}`
              : 'Tudo em ordem'
        }
        onRefresh={reload}
        loading={loading}
      />

      <div className="px-5 py-4">
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingState />
        ) : !hasAlerts ? (
          <EmptyState
            icon={CheckCircle2}
            title="Nenhuma situação pendente"
            message="Todos os produtos estão com saldo e movimentação adequados."
            iconClassName="text-success"
            iconBgClassName="bg-success/10"
          />
        ) : (
          <div className="space-y-5">
            <LowStockAlert products={lowStock} />
            <InactiveProductAlert products={stale} />
          </div>
        )}
      </div>
    </div>
  );
}
