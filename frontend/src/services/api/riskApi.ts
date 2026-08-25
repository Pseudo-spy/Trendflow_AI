import { apiClient } from './client';

export interface RiskPredictionRequest {
  supplier_id: string;
  material_id: string;
}

export interface RiskPredictionResponse {
  supplier_id: string;
  material_id: string;
  delay_probability: number;
  predicted_delay_days: number;
  risk_level: string;
  risk_score: number;
}

export const predictRisk = async (request: RiskPredictionRequest): Promise<RiskPredictionResponse> => {
  const response = await apiClient.post<RiskPredictionResponse>('/api/risk/predict', request);
  return response.data;
};
