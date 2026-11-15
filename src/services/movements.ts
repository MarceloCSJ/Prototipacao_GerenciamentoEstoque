import { supabase } from '@/lib/supabase';
import type { Movement, MovementType } from '@/types';

export async function fetchMovements(): Promise<Movement[]> {
  const { data, error } = await supabase
    .from('movimentacoes')
    .select('*, produto:produtos(id, titulo)')
    .order('data_movimentacao', { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as Movement[];
}

export async function fetchMovementsByProduct(produtoId: string): Promise<Movement[]> {
  const { data, error } = await supabase
    .from('movimentacoes')
    .select('*, produto:produtos(id, titulo)')
    .eq('produto_id', produtoId)
    .order('data_movimentacao', { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as Movement[];
}

export async function registerMovement(
  produtoId: string,
  tipo: MovementType,
  quantidade: number
): Promise<string> {
  const { data, error } = await supabase.rpc('registrar_movimentacao', {
    p_produto_id: produtoId,
    p_tipo: tipo,
    p_quantidade: quantidade,
  });

  if (error) throw error;
  return data as string;
}
