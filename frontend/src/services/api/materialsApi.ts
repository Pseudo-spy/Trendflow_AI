import { apiClient } from './client';

// --- TypeScript interfaces matching backend/app/models/schemas.py MaterialItem ---

export interface MaterialItem {
  id?: number;
  material_id: string;
  material_name: string;
  unit: string;
  lead_time_days?: number | null;
  moq?: number | null;
}

export interface MaterialsResponse {
  success: boolean;
  count: number;
  data: MaterialItem[];
}

// --- API Functions ---

export const fetchMaterials = async (): Promise<MaterialsResponse> => {
  const response = await apiClient.get<MaterialsResponse>('/api/materials');
  return response.data;
};
