import React, { useState } from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ScenarioHero } from '../components/scenarios/ScenarioHero';
import { ScenarioControls } from '../components/scenarios/ScenarioControls';
import { ScenarioResultsComparison } from '../components/scenarios/ScenarioResultsComparison';
import { ScenarioAllocationShift } from '../components/scenarios/ScenarioAllocationShift';
import type { ScenarioParameters } from '../types/scenario';
import { runScenarioEngine, type ScenarioRunResponse } from '../services/api/scenarioApi';
import { ErrorState } from '../components/ui/States';





const defaultParams: ScenarioParameters = {
  demandChangePct: 20,
  supplierAvailability: 'all',
  supplierCapacityPct: 100,
  plantCapacityPct: 100,
  materialPriceChangePct: 0,
  leadTimeChangeDays: 0,
};

export const ScenarioLabPage: React.FC = () => {
  const [params, setParams] = useState<ScenarioParameters>(defaultParams);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ScenarioRunResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);



  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setApiError(null);
    try {
      const res = await runScenarioEngine({
        scenario_name: 'Custom User Scenario',
        material_id: 'MAT001',
        quantity_modifier: 1 + params.demandChangePct / 100
      });
      setApiResponse(res);
    } catch (err: any) {
      setApiError(err.message || 'Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetDefaults = () => {
    setParams(defaultParams);
  };

  return (
    <PageTransitionLayout>
      <PageHeader
        title="What-If Planning Lab & Scenario Sandbox"
        subtitle="Stress-test supply chain resilience against demand shocks, supplier outages, tariff spikes, and logistics bottlenecks"
        badgeText="Monte Carlo Simulation • Real-Time"
        badgeVariant="cyan"
      />

      {/* 3D Real-Time Spatial Simulation Canvas */}
      <ScenarioHero
        params={params}
        isSimulating={isSimulating}
        onRunSimulation={handleRunSimulation}
        onResetDefaults={handleResetDefaults}
      />

      {/* 6 Stress-Test Controls & One-Click Presets */}
      <div style={{ marginBottom: '24px' }}>
        <ScenarioControls
          params={params}
          onChangeParams={(newP) => {
            setParams(newP);
            handleRunSimulation();
          }}
        />
      </div>

      {/* Baseline vs Scenario Results Comparison */}
      <div style={{ marginBottom: '24px' }}>
        {apiError && <ErrorState error={apiError} onRetry={handleRunSimulation} />}
        {!apiError && (
          <ScenarioResultsComparison
            isSimulating={isSimulating}
            apiResponse={apiResponse}
          />
        )}
      </div>

      {/* Supplier Allocation Shift Comparison */}
      <div>
        <ScenarioAllocationShift />
      </div>
    </PageTransitionLayout>
  );
};

export default ScenarioLabPage;
