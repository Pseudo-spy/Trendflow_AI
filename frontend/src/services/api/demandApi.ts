import { apiClient } from './client';

export interface DemandHistoryItem {
  id: number;
  sku: string;
  demand_date: string;
  quantity_sold: number;
  promotion: boolean;
  markdown_percentage: number;
  sell_through_rate: number;
}

export interface DemandHistoryResponse {
  success: boolean;
  count: number;
  data: DemandHistoryItem[];
}

export interface DemandForecastItem {
  id: number;
  sku: string;
  forecast_date: string;
  forecast_quantity: number;
  confidence: number;
  model_version: string;
}

export interface DemandForecastResponse {
  success: boolean;
  count: number;
  data: DemandForecastItem[];
}

export interface ForecastRunRequest {
  sku: string;
  horizon_months?: number;
}

export interface ForecastRunResponse {
  success: boolean;
  sku: string;
  forecast: number;
  confidence: number;
  model_version: string;
}

export const fetchDemandHistory = async (sku?: string): Promise<DemandHistoryResponse> => {
  const url = sku ? `/api/demand/history?sku=${encodeURIComponent(sku)}` : '/api/demand/history';
  const response = await apiClient.get<DemandHistoryResponse>(url);
  return response.data;
};

export const fetchDemandForecast = async (sku?: string): Promise<DemandForecastResponse> => {
  const url = sku ? `/api/demand/forecast?sku=${encodeURIComponent(sku)}` : '/api/demand/forecast';
  const response = await apiClient.get<DemandForecastResponse>(url);
  return response.data;
};

export const runForecast = async (request: ForecastRunRequest): Promise<ForecastRunResponse> => {
  const response = await apiClient.post<ForecastRunResponse>('/api/forecast/run', request);
  return response.data;
};
