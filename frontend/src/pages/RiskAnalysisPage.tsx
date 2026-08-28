import React, { useState, useEffect } from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { RiskKpis } from '../components/risk/RiskKpis';
import { SupplierRiskProfile } from '../components/risk/SupplierRiskProfile';
import { SupplierRiskTable } from '../components/risk/SupplierRiskTable';
import { SupplierRiskComparison } from '../components/risk/SupplierRiskComparison';
import { RiskInputForm } from '../components/risk/RiskInputForm';
import { predictRisk, type RiskPredictionResponse } from '../services/api/riskApi';
import { fetchSuppliers, type SupplierItem } from '../services/api/suppliersApi';
import { fetchMaterials, type MaterialItem } from '../services/api/materialsApi';
import { useOutletContext } from 'react-router-dom';

export const RiskAnalysisPage: React.FC = () => {
  const context = useOutletContext<any>();
  const setLatestRiskResult = context?.setLatestRiskResult;

  const [sessionResults, setSessionResults] = useState<(RiskPredictionResponse & { material_id: string; supplier_name?: string; material_name?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);

  useEffect(() => {
    const loadRefData = async () => {
      try {
        const [suppRes, matRes] = await Promise.all([fetchSuppliers(), fetchMaterials()]);
        setSuppliers(suppRes.data);
        setMaterials(matRes.data);
      } catch (error) {
        console.error('Failed to load reference data', error);
      }
    };
    loadRefData();
  }, []);

  const handleAnalyzeRisk = async (supplierId: string, materialId: string) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await predictRisk({ supplier_id: supplierId, material_id: materialId });
      
      const cleanSupplierId = supplierId.trim();
      const cleanMaterialId = materialId.trim();
      const supplierName = suppliers.find(s => s.supplier_id.trim() === cleanSupplierId)?.supplier_name || supplierId;
      const materialName = materials.find(m => m.material_id.trim() === cleanMaterialId)?.material_name || materialId;

      const enrichedResponse = {
        ...response,
        material_id: materialId,
        supplier_name: supplierName,
        material_name: materialName
      };

      // Update session results
      setSessionResults(prev => {
        const filtered = prev.filter(r => r.supplier_id !== response.supplier_id);
        return [enrichedResponse, ...filtered];
      });
      if (setLatestRiskResult) setLatestRiskResult(enrichedResponse);
    } catch (err) {
      console.error('Failed to run risk prediction', err);
      setApiError('Failed to fetch risk assessment. Please check the backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const latestResult = sessionResults.length > 0 ? sessionResults[0] : null;

  return (
    <PageTransitionLayout>
      <PageHeader
        title="Supplier Risk Analysis"
        subtitle="Evaluate the current backend risk profile for a supplier and material."
        badgeText="Risk Assessment"
        badgeVariant="rose"
      />

      {/* Input Form */}
      <div style={{ marginBottom: '24px' }}>
        <RiskInputForm 
          onAnalyzeRisk={handleAnalyzeRisk} 
          onInputChange={() => setSessionResults([])}
          isLoading={isLoading} 
          suppliers={suppliers} 
          materials={materials} 
        />
        {apiError && (
          <div style={{ color: '#EF4444', fontSize: '13px', marginTop: '8px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {apiError}
          </div>
        )}
      </div>

      {latestResult && (
        <>
          {/* KPI Ribbon */}
          <RiskKpis data={latestResult} />

          {/* Supplier Risk Profile Radar */}
          <div style={{ marginBottom: '24px' }}>
            <SupplierRiskProfile data={latestResult} isLoading={isLoading} suppliers={suppliers} />
          </div>

          {/* Supplier Risk Scoring Table & Comparison Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SupplierRiskTable data={sessionResults} />
            <SupplierRiskComparison data={sessionResults} />
          </div>
        </>
      )}
    </PageTransitionLayout>
  );
};

export default RiskAnalysisPage;
