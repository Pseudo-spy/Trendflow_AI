import React, { useState, useEffect, useMemo } from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { SupplierKpis } from '../components/suppliers/SupplierKpis';
import { SupplierCardGrid } from '../components/suppliers/SupplierCardGrid';
import { type SupplierDetailData } from '../components/suppliers/SupplierDetailDrawer';
import { fetchSuppliers } from '../services/api/suppliersApi';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/States';
import { GlowButton } from '../components/ui/GlowButton';
import { RefreshCcw } from 'lucide-react';

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchSuppliers();
      if (res.success && res.data) {
        const mapped: SupplierDetailData[] = res.data.map(item => ({
          id: item.supplier_id,
          name: item.supplier_name,
          location: item.location,
          riskLevel: item.risk_level,
        }));
        setSuppliers(mapped);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Compute KPI counts from fetched data
  const kpiCounts = useMemo(() => {
    const low = suppliers.filter(s => s.riskLevel === 'LOW').length;
    const medium = suppliers.filter(s => s.riskLevel === 'MEDIUM').length;
    const high = suppliers.filter(s => s.riskLevel === 'HIGH').length;
    return { total: suppliers.length, low, medium, high };
  }, [suppliers]);

  return (
    <PageTransitionLayout>
      <PageHeader
        title="Supplier Intelligence Center"
        subtitle="End-to-end partner directory and risk assessment"
        actions={
          <GlowButton
            variant="secondary"
            size="sm"
            icon={<RefreshCcw size={14} />}
            onClick={loadSuppliers}
            loading={loading}
          >
            Refresh
          </GlowButton>
        }
      />

      {loading && <LoadingState message="Connecting to Supply Chain Network..." />}

      {error && <ErrorState error={error} onRetry={loadSuppliers} />}

      {!loading && !error && suppliers.length === 0 && (
        <EmptyState title="No Suppliers Found" message="There are currently no suppliers in the network." />
      )}

      {!loading && !error && suppliers.length > 0 && (
        <>
          <SupplierKpis
            totalCount={kpiCounts.total}
            lowRiskCount={kpiCounts.low}
            mediumRiskCount={kpiCounts.medium}
            highRiskCount={kpiCounts.high}
          />

          <SupplierCardGrid suppliers={suppliers} />
        </>
      )}
    </PageTransitionLayout>
  );
};

export default SuppliersPage;
