import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nome', { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as Category[];
}

export async function createCategory(nome: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categorias')
    .insert({ nome: nome.trim() })
    .select('*')
    .single();

  if (error) throw error;
  return data as unknown as Category;
}
