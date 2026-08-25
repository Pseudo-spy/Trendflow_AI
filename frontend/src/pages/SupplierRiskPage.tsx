import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { CinematicCard } from '../components/ui/CinematicCard';
import { ShieldAlert } from 'lucide-react';

export const SupplierRiskPage: React.FC = () => {
  return (
    <PageTransitionLayout>
      <PageHeader
        title="Supplier Risk & Resilience"
        subtitle="Geopolitical disruption assessment, ESG tracking, and supplier vulnerability indexing"
        badgeText="Risk Radar Active"
        badgeVariant="rose"
      />

      <CinematicCard
        title="Supplier Risk Matrix Foundation"
        subtitle="Configured for supplier risk scoring microservice integration"
        icon={<ShieldAlert size={20} />}
        glowColor="rose"
      >
        <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
          This page foundation connects to the 3D spatial network and is prepared for interactive risk heatmaps, supplier reliability rankings, and automated contingency routing.
        </p>
      </CinematicCard>
    </PageTransitionLayout>
  );
};
