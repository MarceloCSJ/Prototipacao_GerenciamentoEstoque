import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductInput, ProductWithAlert } from '@/types';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/products';

interface UseProductsResult {
  products: ProductWithAlert[];
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
  saveProduct: (input: ProductInput, id: string | null) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  setError: (message: string) => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<ProductWithAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      setError('Não foi possível carregar os produtos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveProduct = useCallback(
    async (input: ProductInput, id: string | null) => {
      if (id) {
        await updateProduct(id, input);
      } else {
        await createProduct(input);
      }
      await reload();
    },
    [reload]
  );

  const removeProduct = useCallback(
    async (id: string) => {
      await deleteProduct(id);
      await reload();
    },
    [reload]
  );

  return { products, loading, error, reload, saveProduct, removeProduct, setError };
}

export type { Product };
