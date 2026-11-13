import type { Product, Movement } from '@/types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Perfume Floral Bianca 50ml',
    category: 'Perfume',
    price: 89.9,
    quantity: 3,
    minStock: 5,
    lastMovementDays: 2,
  },
  {
    id: 'p2',
    name: 'Batom Matte Cor Rubi',
    category: 'Maquiagem',
    price: 24.5,
    quantity: 18,
    minStock: 6,
    lastMovementDays: 5,
  },
  {
    id: 'p3',
    name: 'Shampoo Reconstrutor 300ml',
    category: 'Cabelo',
    price: 39.9,
    quantity: 0,
    minStock: 4,
    lastMovementDays: 72,
  },
  {
    id: 'p4',
    name: 'Hidratante Facial Vitamina C',
    category: 'Cosmético',
    price: 54.0,
    quantity: 9,
    minStock: 3,
    lastMovementDays: 12,
  },
];

export const mockMovements: Movement[] = [
  {
    id: 'm1',
    productName: 'Batom Matte Cor Rubi',
    type: 'saida',
    amount: 2,
    date: '13/11/2026',
    time: '14:32',
  },
  {
    id: 'm2',
    productName: 'Perfume Floral Bianca 50ml',
    type: 'saida',
    amount: 1,
    date: '13/11/2026',
    time: '10:15',
  },
  {
    id: 'm3',
    productName: 'Hidratante Facial Vitamina C',
    type: 'entrada',
    amount: 12,
    date: '12/11/2026',
    time: '18:40',
  },
  {
    id: 'm4',
    productName: 'Batom Matte Cor Rubi',
    type: 'entrada',
    amount: 10,
    date: '11/11/2026',
    time: '09:20',
  },
  {
    id: 'm5',
    productName: 'Shampoo Reconstrutor 300ml',
    type: 'saida',
    amount: 3,
    date: '01/09/2026',
    time: '16:05',
  },
];
