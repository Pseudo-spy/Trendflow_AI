import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { CinematicCard } from '../components/ui/CinematicCard';
import { Boxes } from 'lucide-react';
import { InventoryTable } from '../components/inventory/InventoryTable';

export const InventoryOptimizationPage: React.FC = () => {
  return (
    <PageTransitionLayout>
      <PageHeader
        title="Inventory Planning"
        subtitle="Current stock, projected demand, shortage visibility and inventory status."
        badgeText="Inventory"
        badgeVariant="emerald"
      />

      <CinematicCard
        title="Inventory Position Overview"
        subtitle="Monitor stock position against projected demand and identify potential shortages."
        icon={<Boxes size={20} />}
        glowColor="emerald"
      >
        <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
          This page foundation is established with routing, Framer Motion motion primitives, and styling tokens. Multi-echelon stock distribution views and stockout mitigation tables will be assembled here.
        </p>
      </CinematicCard>

      <InventoryTable />
    </PageTransitionLayout>
  );
};

export default InventoryOptimizationPage;
