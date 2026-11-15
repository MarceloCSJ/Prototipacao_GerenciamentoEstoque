import { supabase } from '@/lib/supabase';
import type { Product, ProductInput, ProductWithAlert } from '@/types';

function toProductWithAlert(
  product: Product,
  lastMovementDate: string | null
): ProductWithAlert {
  const now = Date.now();
  let daysSinceMovement: number | null = null;

  if (lastMovementDate) {
    const diffMs = now - new Date(lastMovementDate).getTime();
    daysSinceMovement = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } else {
    const diffMs = now - new Date(product.data_criacao).getTime();
    daysSinceMovement = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  return {
    ...product,
    last_movement_date: lastMovementDate,
    days_since_movement: daysSinceMovement,
    is_low_stock: product.estoque <= product.estoque_minimo,
    is_stale: daysSinceMovement > 60,
  };
}

export async function fetchProducts(): Promise<ProductWithAlert[]> {
  const { data, error } = await supabase
    .from('produtos')
    .select('*, categoria:categorias(*)')
    .order('data_criacao', { ascending: false });

  if (error) throw error;
  if (!data) return [];

  const products = data as unknown as Product[];

  const productIds = products.map((p) => p.id);
  if (productIds.length === 0) return [];

  const { data: lastMovements, error: movError } = await supabase
    .rpc('get_last_movement_dates', { p_produto_ids: productIds });

  if (movError) throw movError;

  const movementMap = new Map<string, string | null>();
  if (lastMovements) {
    for (const row of lastMovements as Array<{ produto_id: string; last_date: string | null }>) {
      movementMap.set(row.produto_id, row.last_date);
    }
  }

  return products.map((p) => toProductWithAlert(p, movementMap.get(p.id) ?? null));
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('produtos')
    .select('*, categoria:categorias(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as Product | null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from('produtos')
    .insert({
      titulo: input.titulo,
      categoria_id: input.categoria_id,
      preco: input.preco,
      estoque: input.estoque,
      estoque_minimo: input.estoque_minimo,
    })
    .select('*, categoria:categorias(*)')
    .single();

  if (error) throw error;
  return data as unknown as Product;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  const { data, error } = await supabase
    .from('produtos')
    .update({
      titulo: input.titulo,
      categoria_id: input.categoria_id,
      preco: input.preco,
      estoque_minimo: input.estoque_minimo,
    })
    .eq('id', id)
    .select('*, categoria:categorias(*)')
    .single();

  if (error) throw error;
  return data as unknown as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('produtos').delete().eq('id', id);
  if (error) throw error;
}
