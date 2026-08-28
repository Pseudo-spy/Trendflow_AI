import { apiClient } from './client';

export type ScenarioName =
  | 'demand_spike'
  | 'capacity_reduction'
  | 'supplier_disruption'
  | 'lead_time_shock';

export interface ScenarioRunRequest {
  scenario_name: ScenarioName;
  material_id: string;
  required_quantity: number;
  required_date: string;
  plant_id: string;
  priority: string;
  target_supplier_id: string | null;
  magnitude: number;
}

export interface ScenarioAllocationDelta {
  supplier_id: string;
  baseline_quantity: number;
  scenario_quantity: number;
  change: number;
}

export interface ScenarioRunResponse {
  scenario_name: string;
  material_id: string;
  feasibility_changed: boolean;
  baseline_status: string;
  scenario_status: string;
  baseline_cost: number;
  scenario_cost: number;
  cost_delta: number;
  cost_delta_pct: number;
  baseline_risk_score: number;
  scenario_risk_score: number;
  risk_delta: number;
  allocation_deltas: ScenarioAllocationDelta[];
  explanation: string;
}

export const runScenarioEngine = async (request: ScenarioRunRequest): Promise<ScenarioRunResponse> => {
  const response = await apiClient.post<ScenarioRunResponse>('/api/scenario/run', request);
  return response.data;
};
