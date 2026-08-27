import { apiClient } from './client';
import { type MaterialRequirementContract } from './sopApi';

// --- TypeScript interfaces matching backend/app/models/schemas.py ---

export interface SupplierAllocationDetail {
  supplier_id: string;
  supplier_name: string;
  quantity: number;
  percentage: number;
  unit_price: number;
  total_cost: number;
  risk_score: number;
  lead_time_days: number;
}

export interface OptimizationResponse {
  status: string;
  material_id: string;
  plant_id: string;
  priority: string;
  required_quantity: number;
  total_allocated: number;
  total_cost: number;
  objective_value: number;
  weighted_lead_time_days: number;
  allocation: SupplierAllocationDetail[];
}

// --- API Functions ---

/**
 * POST /api/procurement/optimize
 * Request body matches MaterialRequirementContract (from sopApi).
 * Response is OptimizationResponse with supplier allocation breakdown.
 */
export const optimizeProcurement = async (
  input: MaterialRequirementContract
): Promise<OptimizationResponse> => {
  const response = await apiClient.post<OptimizationResponse>('/api/procurement/optimize', input);
  return response.data;
};
