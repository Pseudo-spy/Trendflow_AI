import React, { useState, useEffect, useMemo } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { GlowButton } from '../ui/GlowButton';
import { LoadingState, ErrorState, EmptyState } from '../ui/States';
import { fetchMaterials, type MaterialItem } from '../../services/api/materialsApi';
import { Layers, RefreshCcw, Search, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const MaterialCatalogTable: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMaterials();
      if (res.success && res.data) {
        setMaterials(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  // Frontend-only search
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return materials;
    const q = searchQuery.trim().toLowerCase();
    return materials.filter(
      m =>
        m.material_id.toLowerCase().includes(q) ||
        m.material_name.toLowerCase().includes(q)
    );
  }, [materials, searchQuery]);

  const formatLeadTime = (days: number | null | undefined): string => {
    if (days == null) return '—';
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  const formatMoq = (value: number | null | undefined): string => {
    if (value == null) return '—';
    return value.toLocaleString('en-IN');
  };

  if (loading) return <LoadingState message="Loading Materials Catalog..." />;
  if (error) return <ErrorState error={error} onRetry={loadMaterials} />;
  if (materials.length === 0) return <EmptyState title="No Materials Found" message="The materials catalog is currently empty." />;

  return (
    <CinematicCard
      title="Materials Catalog"
      subtitle={`${materials.length} materials registered`}
      icon={<Layers size={18} color="#16A34A" />}
      glowColor="emerald"
      headerAction={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="emerald">{filtered.length} Shown</Badge>
          <GlowButton
            variant="ghost"
            size="sm"
            icon={<RefreshCcw size={12} />}
            onClick={loadMaterials}
          >
            Refresh
          </GlowButton>
        </div>
      }
    >
      {/* Search Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
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
            flex: '1 1 200px',
            maxWidth: '320px',
          }}
        >
          <Search size={14} color="#64748B" />
          <input
            type="text"
            placeholder="Search material ID or name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
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

        {searchQuery && (
          <GlowButton variant="ghost" size="sm" icon={<X size={12} />} onClick={() => setSearchQuery('')}>
            Clear
          </GlowButton>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr
              style={{
                borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'left',
                color: '#64748B',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <th style={{ padding: '8px 10px' }}>Material ID</th>
              <th style={{ padding: '8px 10px' }}>Material Name</th>
              <th style={{ padding: '8px 10px' }}>Unit</th>
              <th style={{ padding: '8px 10px' }}>Lead Time</th>
              <th style={{ padding: '8px 10px' }}>MOQ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px 0' }}>
                  <EmptyState
                    title="No Matching Materials"
                    message="No materials match the current search."
                  />
                </td>
              </tr>
            ) : (
              filtered.map((material, idx) => (
                <tr
                  key={material.material_id + idx}
                  style={{
                    borderBottom: isLight
                      ? '1px solid rgba(15, 23, 42, 0.04)'
                      : '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.background = isLight
                      ? 'rgba(15, 23, 42, 0.02)'
                      : 'rgba(255, 255, 255, 0.02)')
                  }
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td
                    style={{
                      padding: '10px 10px',
                      fontWeight: 800,
                      color: '#16A34A',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {material.material_id}
                  </td>
                  <td
                    style={{
                      padding: '10px 10px',
                      fontWeight: 700,
                      color: isLight ? '#0F172A' : '#F8FAFC',
                    }}
                  >
                    {material.material_name}
                  </td>
                  <td style={{ padding: '10px 10px', color: '#94A3B8' }}>
                    {material.unit}
                  </td>
                  <td
                    style={{
                      padding: '10px 10px',
                      color: isLight ? '#0F172A' : '#F8FAFC',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {formatLeadTime(material.lead_time_days)}
                  </td>
                  <td
                    style={{
                      padding: '10px 10px',
                      fontWeight: 700,
                      color: isLight ? '#0F172A' : '#F8FAFC',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {formatMoq(material.moq)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </CinematicCard>
  );
};
