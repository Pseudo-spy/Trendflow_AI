import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { GlowButton } from '../ui/GlowButton';
import { SupplierDetailDrawer, type SupplierDetailData } from './SupplierDetailDrawer';
import { Factory, MapPin, ExternalLink } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { fetchSuppliers } from '../../services/api/suppliersApi';
import { LoadingState, ErrorState, EmptyState } from '../ui/States';

export const SupplierCardGrid: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSupplier, setActiveSupplier] = useState<SupplierDetailData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchSuppliers();
      if (res.success && res.data) {
        // Map backend schema to existing UI schema
        const mappedSuppliers: SupplierDetailData[] = res.data.map(item => {
          return {
            id: item.supplier_id,
            name: item.supplier_name,
            location: item.location,
            riskLevel: item.risk_level,
          };
        });
        setSuppliers(mappedSuppliers);
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

  if (loading) {
    return <LoadingState message="Connecting to Supply Chain Network..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadSuppliers} />;
  }

  if (suppliers.length === 0) {
    return <EmptyState title="No Suppliers Found" message="There are currently no suppliers in the network." />;
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}
      >
        {suppliers.map((supplier) => (
          <motion.div
            key={supplier.id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            style={{
              borderRadius: '16px',
              background: isLight
                ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)'
                : 'linear-gradient(145deg, rgba(23, 34, 59, 0.8) 0%, rgba(7, 12, 24, 0.9) 100%)',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(6, 182, 212, 0.25)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isLight
                ? '0 10px 30px rgba(0, 0, 0, 0.04)'
                : '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(6, 182, 212, 0.08)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onClick={() => {
              setActiveSupplier(supplier);
              setIsDrawerOpen(true);
            }}
          >
            {/* Top Glow Accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: supplier.riskLevel === 'HIGH'
                  ? 'linear-gradient(90deg, transparent, #F59E0B, transparent)'
                  : (supplier.riskLevel === 'MEDIUM' ? 'linear-gradient(90deg, transparent, #06B6D4, transparent)' : 'linear-gradient(90deg, transparent, #16A34A, transparent)'),
              }}
            />

            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 12px rgba(6, 182, 212, 0.3)',
                    }}
                  >
                    <Factory size={18} color="#FFFFFF" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', lineHeight: '1.2' }}>
                      {supplier.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                      <MapPin size={12} color="#06B6D4" />
                      <span>{supplier.location}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={supplier.riskLevel === 'HIGH' ? 'amber' : (supplier.riskLevel === 'MEDIUM' ? 'cyan' : 'emerald')}>
                  {supplier.riskLevel === 'HIGH' ? 'Watchlist' : (supplier.riskLevel === 'MEDIUM' ? 'Monitoring' : 'Verified')}
                </Badge>
              </div>

              {/* Status / ID */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                <Badge variant="cyan">ID: {supplier.id}</Badge>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Risk Level</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: supplier.riskLevel === 'HIGH' ? '#F59E0B' : (supplier.riskLevel === 'MEDIUM' ? '#06B6D4' : '#16A34A'), fontFamily: "'JetBrains Mono', monospace" }}>
                    {supplier.riskLevel}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                Click to view details
              </span>
              <GlowButton
                variant="ghost"
                size="sm"
                icon={<ExternalLink size={12} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSupplier(supplier);
                  setIsDrawerOpen(true);
                }}
              >
                View
              </GlowButton>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Slide-over Detail Drawer */}
      <SupplierDetailDrawer
        supplier={activeSupplier}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
