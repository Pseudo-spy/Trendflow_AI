import React, { useState } from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ScenarioHero } from '../components/scenarios/ScenarioHero';
import { ScenarioControls } from '../components/scenarios/ScenarioControls';
import { ScenarioAllocationImpact } from '../components/scenarios/ScenarioAllocationImpact';
import type { ScenarioParameters } from '../types/scenario';
import { useOutletContext } from 'react-router-dom';
import { runScenarioEngine, type ScenarioRunResponse, type ScenarioRunRequest } from '../services/api/scenarioApi';

const defaultParams: ScenarioParameters = {
  demandChangePct: 20,
  supplierAvailability: 'all',
  supplierCapacityPct: 100,
  plantCapacityPct: 100,
  materialPriceChangePct: 0,
  leadTimeChangeDays: 0,
};

export const ScenarioLabPage: React.FC = () => {
  const context = useOutletContext<any>();
  const setLatestScenarioResult = context?.setLatestScenarioResult;

  // Visual-only state for protected ScenarioHero
  const [visualParams] = useState<ScenarioParameters>(defaultParams);
  
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ScenarioRunResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<ScenarioRunRequest | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleRunSimulation = async (request: ScenarioRunRequest) => {
    setIsSimulating(true);
    setApiError(null);
    setLastRequest(request);
    try {
      const res = await runScenarioEngine(request);
      setApiResponse(res);
      if (setLatestScenarioResult) setLatestScenarioResult(res);
    } catch (err: any) {
      setApiError(err.message || 'Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };



  return (
    <PageTransitionLayout>
      <PageHeader
        title="What-If Scenario Analysis"
        subtitle="Compare baseline procurement performance with supported supply-chain disruption scenarios."
        badgeText="Scenario Engine"
        badgeVariant="cyan"
      />

      {/* PROTECTED 3D Real-Time Spatial Simulation Canvas */}
      <ScenarioHero
        params={visualParams}
        isSimulating={isSimulating}
      />

      {/* Backend-driven Scenario Controls */}
      <div style={{ marginBottom: '24px' }}>
        <ScenarioControls
          onRunSimulation={handleRunSimulation}
          isLoading={isSimulating}
          onInputChange={() => setApiResponse(null)}
          apiError={apiError}
        />
      </div>

      {/* Supplier Allocation Impact Comparison */}
      {apiResponse && (
        <div>
          <ScenarioAllocationImpact 
            apiResponse={apiResponse} 
            lastRequest={lastRequest}
            isSimulating={isSimulating}
            apiError={apiError}
          />
        </div>
      )}
    </PageTransitionLayout>
  );
};

export default ScenarioLabPage;
