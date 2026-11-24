import { supabase } from '@/lib/supabase';
import type { StockMinimumDefault } from '@/types';

export async function fetchStockDefaults(): Promise<StockMinimumDefault[]> {
  const { data, error } = await supabase
    .from('padroes_estoque_minimo')
    .select('*, categoria:categorias(*)')
    .order('categoria_id', { ascending: true, nullsFirst: true });

  if (error) throw error;
  return (data ?? []) as unknown as StockMinimumDefault[];
}

export async function upsertStockDefault(
  categoriaId: string | null,
  quantidadeMinima: number
): Promise<StockMinimumDefault> {
  const { data: existing } = await supabase
    .from('padroes_estoque_minimo')
    .select('id')
    .eq('categoria_id', categoriaId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('padroes_estoque_minimo')
      .update({ quantidade_minima: quantidadeMinima })
      .eq('id', (existing as { id: string }).id)
      .select('*, categoria:categorias(*)')
      .single();
    if (error) throw error;
    return data as unknown as StockMinimumDefault;
  }

  const { data, error } = await supabase
    .from('padroes_estoque_minimo')
    .insert({ categoria_id: categoriaId, quantidade_minima: quantidadeMinima })
    .select('*, categoria:categorias(*)')
    .single();
  if (error) throw error;
  return data as unknown as StockMinimumDefault;
}

export async function deleteStockDefault(id: string): Promise<void> {
  const { error } = await supabase.from('padroes_estoque_minimo').delete().eq('id', id);
  if (error) throw error;
}

export async function applyDefaultToProducts(
  categoriaId: string | null,
  quantidadeMinima: number
): Promise<number> {
  let query = supabase.from('produtos').update({ estoque_minimo: quantidadeMinima });

  if (categoriaId === null) {
    query = query.is('categoria_id', null);
  } else {
    query = query.eq('categoria_id', categoriaId);
  }

  const { data, error } = await query.select('id');
  if (error) throw error;
  return data?.length ?? 0;
}

export function resolveDefaultMinimo(
  categoriaId: string | null,
  defaults: StockMinimumDefault[],
  fallback: number
): number {
  if (categoriaId) {
    const catDefault = defaults.find((d) => d.categoria_id === categoriaId);
    if (catDefault) return catDefault.quantidade_minima;
  }
  const globalDefault = defaults.find((d) => d.categoria_id === null);
  if (globalDefault) return globalDefault.quantidade_minima;
  return fallback;
}
