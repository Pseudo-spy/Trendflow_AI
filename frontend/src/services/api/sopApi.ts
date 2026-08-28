import { apiClient } from './client';

export interface SOPRunRequest {
  sku: string;
  target_date?: string;
}

export interface MaterialRequirementContract {
  material_id: string;
  required_quantity: number;
  required_date: string;
  plant_id: string;
  priority: string;
}

export const runSopEngine = async (request: SOPRunRequest): Promise<MaterialRequirementContract> => {
  const response = await apiClient.post<MaterialRequirementContract>('/api/sop/run', request);
  return response.data;
};
