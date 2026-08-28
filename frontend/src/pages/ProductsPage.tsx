import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ProductCatalogTable } from '../components/products/ProductCatalogTable';

export const ProductsPage: React.FC = () => {
  return (
    <PageTransitionLayout>
      <PageHeader
        title="Product Catalog"
        subtitle="Complete product directory with SKU details, pricing, and seasonal classification"
        badgeText="Catalog"
        badgeVariant="cyan"
      />

      <ProductCatalogTable />
    </PageTransitionLayout>
  );
};

export default ProductsPage;
