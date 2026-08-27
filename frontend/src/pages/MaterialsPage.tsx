import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { MaterialCatalogTable } from '../components/materials/MaterialCatalogTable';

export const MaterialsPage: React.FC = () => {
  return (
    <PageTransitionLayout>
      <PageHeader
        title="Materials Directory"
        subtitle="Raw material specifications, lead times, and minimum order quantities"
        badgeText="Materials"
        badgeVariant="emerald"
      />

      <MaterialCatalogTable />
    </PageTransitionLayout>
  );
};

export default MaterialsPage;
