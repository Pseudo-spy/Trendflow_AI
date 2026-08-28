import React, { useState, useEffect, useMemo } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { GlowButton } from '../ui/GlowButton';
import { LoadingState, ErrorState, EmptyState } from '../ui/States';
import { fetchProducts, type ProductItem } from '../../services/api/productsApi';
import { ProductDetailModal } from './ProductDetailModal';
import { ShoppingBag, RefreshCcw, Search, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ProductCatalogTable: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [seasonFilter, setSeasonFilter] = useState<string>('');
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchProducts();
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Derive unique filter values from fetched data
  const categories = useMemo(
    () => [...new Set(products.map(p => p.category).filter(Boolean))] as string[],
    [products]
  );
  const seasons = useMemo(
    () => [...new Set(products.map(p => p.season).filter(Boolean))] as string[],
    [products]
  );

  // Frontend-only filtering
  const filtered = useMemo(() => {
    let result = products;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        p =>
          p.sku.toLowerCase().includes(q) ||
          p.product_name.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (seasonFilter) {
      result = result.filter(p => p.season === seasonFilter);
    }
    return result;
  }, [products, searchQuery, categoryFilter, seasonFilter]);

  const hasActiveFilters = searchQuery || categoryFilter || seasonFilter;

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setSeasonFilter('');
  };

  const formatPrice = (value: number | null | undefined): string => {
    if (value == null) return '—';
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const selectStyle: React.CSSProperties = {
    padding: '6px 10px',
    borderRadius: '8px',
    background: isLight ? '#F8FAFC' : '#0A120D',
    border: isLight ? '1px solid #E2E8F0' : '1px solid #1B3B2B',
    color: isLight ? '#0F172A' : '#F0FDF4',
    fontSize: '12px',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '120px',
  };

  if (loading) return <LoadingState message="Loading Product Catalog..." />;
  if (error) return <ErrorState error={error} onRetry={loadProducts} />;
  if (products.length === 0) return <EmptyState title="No Products Found" message="The product catalog is currently empty." />;

  return (
    <>
      <CinematicCard
        title="Product Catalog"
        subtitle={`${products.length} products in catalog`}
        icon={<ShoppingBag size={18} color="#06B6D4" />}
        glowColor="cyan"
        headerAction={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant="cyan">{filtered.length} Shown</Badge>
            <GlowButton
              variant="ghost"
              size="sm"
              icon={<RefreshCcw size={12} />}
              onClick={loadProducts}
            >
              Refresh
            </GlowButton>
          </div>
        }
      >
        {/* Filters Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
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
              placeholder="Search SKU or product name..."
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

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {/* Season Filter */}
          {seasons.length > 0 && (
            <select
              value={seasonFilter}
              onChange={e => setSeasonFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Seasons</option>
              {seasons.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <GlowButton variant="ghost" size="sm" icon={<X size={12} />} onClick={clearFilters}>
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
                <th style={{ padding: '8px 10px' }}>SKU</th>
                <th style={{ padding: '8px 10px' }}>Product Name</th>
                <th style={{ padding: '8px 10px' }}>Category</th>
                <th style={{ padding: '8px 10px' }}>Season</th>
                <th style={{ padding: '8px 10px' }}>Selling Price</th>
                <th style={{ padding: '8px 10px' }}>Production Cost</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px 0' }}>
                    <EmptyState
                      title="No Matching Products"
                      message="No products match the current filters."
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((product, idx) => (
                  <tr
                    key={product.sku + idx}
                    onClick={() => setSelectedSku(product.sku)}
                    style={{
                      borderBottom: isLight
                        ? '1px solid rgba(15, 23, 42, 0.04)'
                        : '1px solid rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
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
                        color: '#06B6D4',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {product.sku}
                    </td>
                    <td
                      style={{
                        padding: '10px 10px',
                        fontWeight: 700,
                        color: isLight ? '#0F172A' : '#F8FAFC',
                      }}
                    >
                      {product.product_name}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      {product.category ? (
                        <Badge variant="muted">{product.category}</Badge>
                      ) : (
                        <span style={{ color: '#64748B' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      {product.season ? (
                        <Badge variant={product.season?.startsWith('SS') ? 'amber' : 'cyan'}>
                          {product.season}
                        </Badge>
                      ) : (
                        <span style={{ color: '#64748B' }}>—</span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: '10px 10px',
                        fontWeight: 700,
                        color: '#16A34A',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {formatPrice(product.selling_price)}
                    </td>
                    <td
                      style={{
                        padding: '10px 10px',
                        fontWeight: 600,
                        color: isLight ? '#0F172A' : '#F8FAFC',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {formatPrice(product.production_cost)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CinematicCard>

      {/* Product Detail Modal */}
      <ProductDetailModal
        sku={selectedSku}
        isOpen={!!selectedSku}
        onClose={() => setSelectedSku(null)}
      />
    </>
  );
};
