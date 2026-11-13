export type Category =
  | 'Perfume'
  | 'Maquiagem'
  | 'Cabelo'
  | 'Cosmético';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  quantity: number;
  minStock: number;
  lastMovementDays: number;
}

export interface Movement {
  id: string;
  productName: string;
  type: 'entrada' | 'saida';
  amount: number;
  date: string;
  time: string;
}

export type ScreenId = 'produtos' | 'alertas' | 'movimentacoes' | 'config';
