export interface DemandForecastItem {
  id: string;
  sku: string;
  category: string;
  predictedDemand: number;
  actualDemand?: number;
  confidenceInterval: [number, number];
  growthRate: number;
  seasonalityFactor: number;
}

export interface InventoryStatus {
  sku: string;
  currentStock: number;
  safetyStock: number;
  reorderPoint: number;
  holdingCost: number;
  stockoutRisk: number; // 0 - 100%
  recommendation: 'reorder' | 'hold' | 'reduce' | 'expedite';
}

export interface SupplierRiskAssessment {
  supplierId: string;
  supplierName: string;
  country: string;
  overallRiskScore: number; // 0 - 100
  financialStability: number;
  geopoliticalRisk: number;
  deliveryPerformance: number;
  carbonFootprint: number;
  status: 'low_risk' | 'medium_risk' | 'high_risk';
}

export interface OptimizationScenario {
  id: string;
  name: string;
  description: string;
  serviceLevelTarget: number; // e.g. 98%
  budgetConstraint: number;
  estimatedCost: number;
  projectedFillRate: number;
  co2EmissionsTonnes: number;
  status: 'draft' | 'running' | 'completed';
}

export interface SystemKPIs {
  forecastAccuracy: number;
  serviceLevel: number;
  inventoryTurnover: number;
  supplierOnTimeDelivery: number;
  totalCostSaved: number;
  carbonReductionPercent: number;
}
