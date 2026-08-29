import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ProcurementHero } from '../components/procurement/ProcurementHero';
import { ProcurementKpis } from '../components/procurement/ProcurementKpis';
import { AllocationRadialChart } from '../components/procurement/AllocationRadialChart';
import { SupplierAllocationTable } from '../components/procurement/SupplierAllocationTable';
import { ProcurementInputForm } from '../components/procurement/ProcurementInputForm';
import { optimizeProcurement, type OptimizationResponse } from '../services/api/procurementApi';
import { type MaterialRequirementContract } from '../services/api/sopApi';

interface AppLayoutContext {
  latestSopResult: MaterialRequirementContract | null;
  setLatestProcurementResult?: (result: OptimizationResponse) => void;
}

export const ProcurementPage: React.FC = () => {
  const { latestSopResult, setLatestProcurementResult } = useOutletContext<AppLayoutContext>();
  
  const [result, setResult] = useState<OptimizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleRunProcurement = async (input: MaterialRequirementContract) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await optimizeProcurement(input);
      setResult(response);
      if (setLatestProcurementResult) setLatestProcurementResult(response);
    } catch (err) {
      console.error('Failed to run procurement allocation', err);
      setApiError('Failed to execute procurement allocation. Please check the system connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransitionLayout>
      <PageHeader
        title="Procurement Allocation"
        subtitle="Allocate required material quantity across suppliers using the current procurement logic."
        badgeText="Allocation Engine"
        badgeVariant="cyan"
      />

      {/* Signature 3D Supplier Allocation Canvas - PROTECTED */}
      <ProcurementHero result={result} />

      {/* Input Form */}
      <div style={{ marginBottom: '16px' }}>
        <ProcurementInputForm 
          latestSopResult={latestSopResult} 
          onRunProcurement={handleRunProcurement} 
          isLoading={isLoading} 
          onInputChange={() => setResult(null)}
          apiError={apiError}
        />
      </div>

      {result && (
        <>
          {/* KPI Summary Ribbon */}
          <ProcurementKpis data={result} />

          {/* Allocation Breakdown Chart & Matrix Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AllocationRadialChart data={result.allocation || null} />
            <SupplierAllocationTable data={result.allocation || null} />
          </div>
        </>
      )}
    </PageTransitionLayout>
  );
};

export default ProcurementPage;
