import { apiClient } from './client';

export interface SupplierItem {
  id?: number;
  supplier_id: string;
  supplier_name: string;
  location: string;
  risk_level: string;
}

export interface SuppliersResponse {
  success: boolean;
  count: number;
  data: SupplierItem[];
}

export const fetchSuppliers = async (): Promise<SuppliersResponse> => {
  const response = await apiClient.get<SuppliersResponse>('/api/suppliers');
  return response.data;
};
