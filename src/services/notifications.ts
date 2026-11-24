import { supabase } from '@/lib/supabase';
import type { NotificationState } from '@/types';

export async function fetchNotificationStates(): Promise<NotificationState[]> {
  const { data, error } = await supabase
    .from('estado_notificacoes')
    .select('*');

  if (error) throw error;
  return (data ?? []) as unknown as NotificationState[];
}

export async function getNotificationState(produtoId: string): Promise<NotificationState | null> {
  const { data, error } = await supabase
    .from('estado_notificacoes')
    .select('*')
    .eq('produto_id', produtoId)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as NotificationState | null;
}

export async function setAlertaAtivo(produtoId: string, ativo: boolean): Promise<void> {
  const { data: existing } = await supabase
    .from('estado_notificacoes')
    .select('id')
    .eq('produto_id', produtoId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('estado_notificacoes')
      .update({ alerta_ativo: ativo })
      .eq('id', (existing as { id: string }).id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('estado_notificacoes')
      .insert({ produto_id: produtoId, alerta_ativo: ativo });
    if (error) throw error;
  }
}
