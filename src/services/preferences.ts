import { supabase } from '@/lib/supabase';
import type { UserPreferences, Theme } from '@/types';
import { DEFAULT_PREFERENCES } from '@/types';

export async function fetchPreferences(): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('preferencias_usuario')
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data as unknown as UserPreferences | null;
}

export async function upsertPreferences(
  updates: Partial<Pick<UserPreferences, 'tema' | 'notificacoes_estoque_ativas' | 'antecedencia_aviso' | 'dias_para_considerar_parado'>>
): Promise<UserPreferences> {
  const { data: existing } = await supabase
    .from('preferencias_usuario')
    .select('id')
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('preferencias_usuario')
      .update(updates)
      .eq('id', (existing as { id: string }).id)
      .select('*')
      .single();
    if (error) throw error;
    return data as unknown as UserPreferences;
  }

  const { data, error } = await supabase
    .from('preferencias_usuario')
    .insert({ ...DEFAULT_PREFERENCES, ...updates })
    .select('*')
    .single();
  if (error) throw error;
  return data as unknown as UserPreferences;
}

export async function updateTheme(tema: Theme): Promise<void> {
  await upsertPreferences({ tema });
}

export async function updateNotificationSettings(
  notificacoes_estoque_ativas: boolean,
  antecedencia_aviso: number
): Promise<void> {
  await upsertPreferences({ notificacoes_estoque_ativas, antecedencia_aviso });
}

export async function updateStaleDays(dias_para_considerar_parado: number): Promise<void> {
  await upsertPreferences({ dias_para_considerar_parado });
}
