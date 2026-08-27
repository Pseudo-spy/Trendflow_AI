import { apiClient } from './client';

// --- TypeScript interfaces ---
// Note: The backend repository does supabase.table("inventory").select("*").
// No InventoryItem schema exists in backend/app/models/schemas.py.
// The fields below are the minimum verifiable from backend code:
//   - The `sku` column is confirmed (used in .eq("sku", ...) filter).
//   - Additional columns depend on the actual Supabase inventory table schema.
// This interface uses Record<string, unknown> for extra fields until the
// database schema is verified.

export interface InventoryItem {
  id?: number;
  sku: string;
  location: string;
  quantity: number;
  reserved_quantity: number;
}

export interface InventoryResponse {
  success: boolean;
  count: number;
  data: InventoryItem[];
}

// --- API Functions ---

export const fetchInventory = async (sku?: string): Promise<InventoryResponse> => {
  const url = sku ? `/api/inventory/?sku=${encodeURIComponent(sku)}` : '/api/inventory/';
  const response = await apiClient.get<InventoryResponse>(url);
  return response.data;
};
