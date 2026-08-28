import { apiClient } from './client';

// --- TypeScript interfaces matching backend/app/models/schemas.py ---

export interface ProductItem {
  id?: number;
  sku: string;
  product_name: string;
  category?: string | null;
  season?: string | null;
  selling_price?: number | null;
  production_cost?: number | null;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  data: ProductItem[];
}

export interface ProductDetailResponse {
  success: boolean;
  data: ProductItem;
}

// --- API Functions ---

export const fetchProducts = async (): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>('/api/products/');
  return response.data;
};

export const fetchProductBySku = async (sku: string): Promise<ProductDetailResponse> => {
  const response = await apiClient.get<ProductDetailResponse>(`/api/products/${encodeURIComponent(sku)}`);
  return response.data;
};
