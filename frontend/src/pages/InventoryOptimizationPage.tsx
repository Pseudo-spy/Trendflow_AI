import React, { useState, useEffect, useMemo } from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { InventoryTable } from '../components/inventory/InventoryTable';
import { LoadingState, ErrorState } from '../components/ui/States';
import { GlowButton } from '../components/ui/GlowButton';
import { RefreshCcw, Search, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { fetchInventory, type InventoryItem } from '../services/api/inventoryApi';
import { MetricCard } from '../components/ui/MetricCard';
import { Boxes, MapPin, PackageCheck, Archive } from 'lucide-react';

interface InventoryKpisProps {
  totalRecords: number;
  totalQuantity: number;
  totalReserved: number;
  totalAvailable: number;
}

const InventoryKpis: React.FC<InventoryKpisProps> = ({
  totalRecords,
  totalQuantity,
  totalReserved,
  totalAvailable,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      <MetricCard
        label="Inventory Records"
        value={totalRecords}
        decimals={0}
        icon={<MapPin size={16} />}
        glowColor="cyan"
      />
      <MetricCard
        label="Total On-Hand"
        value={totalQuantity}
        suffix=" units"
        decimals={0}
        icon={<Boxes size={16} />}
        glowColor="indigo"
      />
      <MetricCard
        label="Total Reserved"
        value={totalReserved}
        suffix=" units"
        decimals={0}
        icon={<Archive size={16} />}
        glowColor="amber"
      />
      <MetricCard
        label="Total Available"
        value={totalAvailable}
        suffix=" units"
        decimals={0}
        icon={<PackageCheck size={16} />}
        glowColor="emerald"
      />
    </div>
  );
};

export const InventoryOptimizationPage: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [skuFilter, setSkuFilter] = useState('');
  const [appliedSku, setAppliedSku] = useState<string | undefined>(undefined);

  const loadData = async (sku?: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchInventory(sku);
      if (res.success) {
        setInventoryData(res.data || []);
      } else {
        setInventoryData([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSkuSearch = () => {
    const sku = skuFilter.trim() || undefined;
    setAppliedSku(sku);
    loadData(sku);
  };

  const handleClearSku = () => {
    setSkuFilter('');
    setAppliedSku(undefined);
    loadData();
  };

  const kpiData = useMemo(() => {
    let totalQ = 0;
    let totalR = 0;
    inventoryData.forEach(item => {
      totalQ += item.quantity || 0;
      totalR += item.reserved_quantity || 0;
    });
    return {
      totalRecords: inventoryData.length,
      totalQuantity: totalQ,
      totalReserved: totalR,
      totalAvailable: totalQ - totalR,
    };
  }, [inventoryData]);

  return (
    <PageTransitionLayout>
      <PageHeader
        title="Inventory View"
        subtitle="Current stock positions and availability across locations."
        badgeText="Inventory"
        badgeVariant="emerald"
        actions={
          <GlowButton
            variant="secondary"
            size="sm"
            icon={<RefreshCcw size={14} />}
            onClick={() => loadData(appliedSku)}
            loading={loading}
          >
            Refresh
          </GlowButton>
        }
      />

      {/* SKU Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            borderRadius: '8px',
            background: isLight ? '#F8FAFC' : '#0A120D',
            border: isLight ? '1px solid #E2E8F0' : '1px solid #1B3B2B',
            maxWidth: '260px',
            flex: '1 1 200px',
          }}
        >
          <Search size={14} color="#64748B" />
          <input
            type="text"
            placeholder="Filter by SKU (e.g. TW001)"
            value={skuFilter}
            onChange={e => setSkuFilter(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSkuSearch()}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: isLight ? '#0F172A' : '#F0FDF4',
              fontSize: '12px',
              width: '100%',
            }}
          />
        </div>
        <GlowButton variant="secondary" size="sm" onClick={handleSkuSearch}>
          Apply
        </GlowButton>
        {appliedSku && (
          <GlowButton variant="ghost" size="sm" icon={<X size={12} />} onClick={handleClearSku}>
            Clear SKU
          </GlowButton>
        )}
      </div>

      {loading && <LoadingState message="Fetching Inventory Data..." />}
      {error && <ErrorState error={error} onRetry={() => loadData(appliedSku)} />}

      {!loading && !error && (
        <>
          <InventoryKpis
            totalRecords={kpiData.totalRecords}
            totalQuantity={kpiData.totalQuantity}
            totalReserved={kpiData.totalReserved}
            totalAvailable={kpiData.totalAvailable}
          />
          <InventoryTable data={inventoryData} />
        </>
      )}
    </PageTransitionLayout>
  );
};

export default InventoryOptimizationPage;
