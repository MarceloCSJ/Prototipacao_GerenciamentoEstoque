import type { ProductWithAlert } from '@/types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: ProductWithAlert[];
  onSelect: (product: ProductWithAlert) => void;
}

export default function ProductList({ products, onSelect }: ProductListProps) {
  return (
    <ul className="space-y-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onClick={onSelect} />
      ))}
    </ul>
  );
}
