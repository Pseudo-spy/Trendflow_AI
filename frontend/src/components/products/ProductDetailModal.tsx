import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { LoadingState, ErrorState } from '../ui/States';
import { fetchProductBySku, type ProductItem } from '../../services/api/productsApi';
import { useTheme } from '../../hooks/useTheme';

interface ProductDetailModalProps {
  sku: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ sku, isOpen, onClose }) => {
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  useEffect(() => {
    if (!sku || !isOpen) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchProductBySku(sku);
        if (res.success && res.data) {
          setProduct(res.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sku, isOpen]);

  const formatPrice = (value: number | null | undefined): string => {
    if (value == null) return '—';
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const detailRow = (label: string, value: React.ReactNode) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.06)' : '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
        {value}
      </span>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product?.product_name || 'Product Details'}
      subtitle={product ? `SKU: ${product.sku}` : undefined}
      maxWidth="sm"
    >
      {loading && <LoadingState message="Loading product details..." />}
      {error && <ErrorState error={error} onRetry={() => sku && fetchProductBySku(sku)} />}
      {!loading && !error && product && (
        <div>
          {detailRow('SKU', (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#06B6D4' }}>
              {product.sku}
            </span>
          ))}
          {detailRow('Product Name', product.product_name)}
          {detailRow('Category', product.category ? (
            <Badge variant="muted">{product.category}</Badge>
          ) : '—')}
          {detailRow('Season', product.season ? (
            <Badge variant={product.season.startsWith('SS') ? 'amber' : 'cyan'}>
              {product.season}
            </Badge>
          ) : '—')}
          {detailRow('Selling Price', (
            <span style={{ color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
              {formatPrice(product.selling_price)}
            </span>
          ))}
          {detailRow('Production Cost', (
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {formatPrice(product.production_cost)}
            </span>
          ))}
        </div>
      )}
    </Modal>
  );
};
