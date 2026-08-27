import { apiClient } from './client';

export interface RiskPredictionRequest {
  supplier_id: string;
  material_id: string;
}

export interface RiskPredictionResponse {
  supplier_id: string;
  risk_score: number;
  risk_level: string;
  delivery_risk: number;
  quality_risk: number;
  prediction_date: string;
  model_version: string;
}

export const predictRisk = async (request: RiskPredictionRequest): Promise<RiskPredictionResponse> => {
  const response = await apiClient.post<RiskPredictionResponse>('/api/risk/predict', request);
  return response.data;
};
