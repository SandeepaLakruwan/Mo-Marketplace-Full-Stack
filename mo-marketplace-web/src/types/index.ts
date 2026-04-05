export interface Variant {
  id: string;
  color: string;
  size: string;
  material: string;
  combination_key: string;
  priceModifier: number;
  stockQuantity: number;
  isActive: boolean;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
  variants: Variant[];
  createdAt: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
}

export interface AuthResponse {
  access_token: string;
  user: { id: string; email: string };
}