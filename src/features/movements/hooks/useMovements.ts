import { useState, useEffect, useCallback } from 'react';
import type { Movement } from '@/types';
import { fetchMovements } from '@/services/movements';

interface UseMovementsResult {
  movements: Movement[];
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
}

export function useMovements(): UseMovementsResult {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
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
    reload();
  }, [reload]);

  return { movements, loading, error, reload };
}
