export interface ScenarioParameters {
  demandChangePct: number; // e.g. -50 to +50
  supplierAvailability: 'all' | 'hanoi_offline' | 'port_strike' | 'shenzhen_cap';
  supplierCapacityPct: number; // e.g. 50 to 150
  plantCapacityPct: number; // e.g. 70 to 130
  materialPriceChangePct: number; // e.g. -20 to +40
  leadTimeChangeDays: number; // e.g. -5 to +15
}

export interface ScenarioOutcome {
  demandUnits: number;
  productionUnits: number;
  materialReqKg: number;
  procurementReqUnits: number;
  totalCost: number;
  riskScore: number;
  leadTimeDays: number;
  plantUtilizationPct: number;
  supplierAllocations: {
    name: string;
    baselineShare: number;
    scenarioShare: number;
    volumeUnits: number;
    status: 'optimal' | 'cap' | 'offline' | 'surge';
  }[];
}

export const BASELINE_OUTCOME: ScenarioOutcome = {
  demandUnits: 184200,
  productionUnits: 168000,
  materialReqKg: 248500,
  procurementReqUnits: 125000,
  totalCost: 4850000,
  riskScore: 18.4,
  leadTimeDays: 6.4,
  plantUtilizationPct: 92.6,
  supplierAllocations: [
    { name: 'Taipei Organic', baselineShare: 38.4, scenarioShare: 38.4, volumeUnits: 48000, status: 'optimal' },
    { name: 'Shenzhen Mega', baselineShare: 28.8, scenarioShare: 28.8, volumeUnits: 36000, status: 'optimal' },
    { name: 'Hanoi Garments', baselineShare: 19.2, scenarioShare: 19.2, volumeUnits: 24000, status: 'optimal' },
    { name: 'Frankfurt Eco', baselineShare: 8.0, scenarioShare: 8.0, volumeUnits: 10000, status: 'optimal' },
    { name: 'Americas Synthetic', baselineShare: 5.6, scenarioShare: 5.6, volumeUnits: 7000, status: 'optimal' },
  ],
};
