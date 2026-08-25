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
  const [activeSupplier] = useState<SupplierDetailData | null>(null);
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
          let riskScoreNum = 0;
          if (item.risk_level === 'HIGH') riskScoreNum = 80;
          else if (item.risk_level === 'MEDIUM') riskScoreNum = 50;
          else riskScoreNum = 10; // LOW

          return {
            id: item.supplier_id,
            name: item.supplier_name,
            category: 'N/A', // Not provided by backend
            location: item.location,
            country: 'N/A', // Not provided by backend
            otif: 0, // N/A
            defectRate: 'N/A',
            leadTime: 'N/A',
            capacity: 0, // N/A
            riskScore: riskScoreNum,
            esgScore: 0, // N/A
            certifications: [],
            activePoCount: 0, // N/A
            contactName: 'N/A',
            contactEmail: 'N/A',
            contactPhone: 'N/A',
            moqTiers: []
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
                background: supplier.riskScore > 30
                  ? 'linear-gradient(90deg, transparent, #F59E0B, transparent)'
                  : 'linear-gradient(90deg, transparent, #06B6D4, transparent)',
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
                      <span>{supplier.location}, {supplier.country}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={supplier.riskScore > 30 ? 'amber' : 'emerald'}>
                  {supplier.riskScore > 30 ? 'Watchlist' : 'Verified'}
                </Badge>
              </div>

              {/* Tag / Category */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                <Badge variant="cyan">{supplier.category}</Badge>
                <Badge variant="emerald">ESG: {supplier.esgScore}/100</Badge>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>OTIF Rate</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                    {supplier.otif}%
                  </div>
                </div>

                <div style={{ padding: '8px', borderRadius: '8px', background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Lead Time</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#6366F1', fontFamily: "'JetBrains Mono', monospace" }}>
                    {supplier.leadTime}
                  </div>
                </div>

                <div style={{ padding: '8px', borderRadius: '8px', background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Risk Score</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: supplier.riskScore > 30 ? '#F59E0B' : '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                    {supplier.riskScore}/100
                  </div>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: '#64748B' }}>Allocated Capacity</span>
                  <span style={{ fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
                    {supplier.capacity}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '5px',
                    borderRadius: '3px',
                    background: isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${supplier.capacity}%`,
                      height: '100%',
                      background: supplier.capacity > 95
                        ? 'linear-gradient(90deg, #F59E0B, #F43F5E)'
                        : 'linear-gradient(90deg, #06B6D4, #16A34A)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                {supplier.activePoCount} Active Purchase Orders
              </span>
              <GlowButton
                variant="ghost"
                size="sm"
                icon={<ExternalLink size={12} />}
                onClick={() => {}}
                disabled={true}
              >
                Backend Blocked
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
