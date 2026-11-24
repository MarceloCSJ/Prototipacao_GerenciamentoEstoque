export type ScreenId = 'produtos' | 'alertas' | 'movimentacoes' | 'config';

export type MovementType = 'entrada' | 'saida';

export interface Category {
  id: string;
  usuario_id: string;
  nome: string;
  data_criacao: string;
}

export interface Product {
  id: string;
  usuario_id: string;
  titulo: string;
  categoria_id: string | null;
  preco: number;
  estoque: number;
  estoque_minimo: number;
  data_criacao: string;
  data_atualizacao: string;
  categoria?: Category | null;
}

export interface Movement {
  id: string;
  usuario_id: string;
  produto_id: string;
  tipo: MovementType;
  quantidade: number;
  data_movimentacao: string;
  produto?: Pick<Product, 'id' | 'titulo'> | null;
}

export interface ProductInput {
  titulo: string;
  categoria_id: string | null;
  preco: number;
  estoque: number;
  estoque_minimo: number;
}

export interface ProductWithAlert extends Product {
  is_low_stock: boolean;
  is_stale: boolean;
  is_warning: boolean;
  last_movement_date: string | null;
  days_since_movement: number | null;
}

export type Theme = 'claro' | 'escuro';

export interface UserPreferences {
  id: string;
  usuario_id: string;
  tema: Theme;
  notificacoes_estoque_ativas: boolean;
  antecedencia_aviso: number;
  dias_para_considerar_parado: number;
  data_criacao: string;
  data_atualizacao: string;
}

export interface StockMinimumDefault {
  id: string;
  usuario_id: string;
  categoria_id: string | null;
  quantidade_minima: number;
  data_criacao: string;
  data_atualizacao: string;
  categoria?: Category | null;
}

export interface NotificationState {
  id: string;
  usuario_id: string;
  produto_id: string;
  alerta_ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
}

export const DEFAULT_PREFERENCES: Omit<UserPreferences, 'id' | 'usuario_id' | 'data_criacao' | 'data_atualizacao'> = {
  tema: 'claro',
  notificacoes_estoque_ativas: false,
  antecedencia_aviso: 2,
  dias_para_considerar_parado: 60,
};
