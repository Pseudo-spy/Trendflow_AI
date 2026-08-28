import { useState, useEffect } from 'react';
import { fetchDemandHistory, fetchDemandForecast, type DemandHistoryItem, type DemandForecastItem } from '../services/api/demandApi';
import { fetchSuppliers, type SupplierItem } from '../services/api/suppliersApi';
import { fetchProducts, type ProductItem } from '../services/api/productsApi';
import { fetchMaterials, type MaterialItem } from '../services/api/materialsApi';
import { fetchInventory, type InventoryItem } from '../services/api/inventoryApi';

export interface DashboardData {
  demandHistory: DemandHistoryItem[];
  demandForecast: DemandForecastItem[];
  suppliers: SupplierItem[];
  products: ProductItem[];
  materials: MaterialItem[];
  inventory: InventoryItem[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [histRes, fcRes, supRes, prodRes, matRes, invRes] = await Promise.allSettled([
        fetchDemandHistory(),
        fetchDemandForecast(),
        fetchSuppliers(),
        fetchProducts(),
        fetchMaterials(),
        fetchInventory()
      ]);

      setData({
        demandHistory: histRes.status === 'fulfilled' ? histRes.value.data : [],
        demandForecast: fcRes.status === 'fulfilled' ? fcRes.value.data : [],
        suppliers: supRes.status === 'fulfilled' ? supRes.value.data : [],
        products: prodRes.status === 'fulfilled' ? prodRes.value.data : [],
        materials: matRes.status === 'fulfilled' ? matRes.value.data : [],
        inventory: invRes.status === 'fulfilled' ? invRes.value.data : []
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
}
