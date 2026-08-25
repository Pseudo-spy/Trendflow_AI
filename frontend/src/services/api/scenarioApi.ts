import { apiClient } from './client';

export interface ScenarioRunRequest {
  scenario_name: string;
  material_id: string;
  quantity_modifier?: number;
}

export interface ScenarioRunResponse {
  scenario_name: string;
  material_id: string;
  adjusted_required_quantity: number;
  feasibility: string;
  estimated_cost: number;
  recommended_action: string;
}

export const runScenarioEngine = async (request: ScenarioRunRequest): Promise<ScenarioRunResponse> => {
  const response = await apiClient.post<ScenarioRunResponse>('/api/scenario/run', request);
  return response.data;
};
