import { ProductCardClient } from "./ProductCardClient";

type Variant = {
  id: string;
  size: string;
  priceKes: number;
  stock: number;
  sku: string;
};

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string | null;
    shortDescription: string;
    isBestseller: boolean;
    isNewArrival: boolean;
  };
  variants: Variant[];
};

export function ProductCard({ product, variants }: ProductCardProps) {
  return <ProductCardClient product={product} variants={variants} />;
}