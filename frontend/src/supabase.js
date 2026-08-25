import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const firstValue = (row, keys, fallback = '') => {
  const key = keys.find((candidate) => row[candidate] !== null && row[candidate] !== undefined)
  return key ? row[key] : fallback
}

const statusTone = (status) => {
  const normalized = String(status).toLowerCase()
  if (normalized.includes('risk') || normalized.includes('critical')) return 'red'
  if (normalized.includes('watch') || normalized.includes('pending')) return 'amber'
  return 'green'
}

export const loadSuppliers = async () => {
  if (!supabase) throw new Error('Supabase is not configured')

  const table = import.meta.env.VITE_SUPABASE_SUPPLIERS_TABLE || 'suppliers'
  const { data, error } = await supabase.from(table).select('name, region, category, score, fill, lead_time_days, status').limit(100)
  if (error) throw error

  return data.map((row) => {
    const status = firstValue(row, ['status', 'health_status'], 'On track')
    return {
      name: firstValue(row, ['name'], 'Unnamed supplier'),
      region: firstValue(row, ['region'], 'Region unavailable'),
      category: firstValue(row, ['category'], 'General'),
      score: Number(firstValue(row, ['score'], 0)),
      fill: Number(firstValue(row, ['fill'], 0)),
      lead: `${firstValue(row, ['lead_time_days'], 0)} days`,
      status,
      tone: statusTone(status),
    }
  })
}

export const loadInventory = async () => {
  if (!supabase) throw new Error('Supabase is not configured')

  const table = import.meta.env.VITE_SUPABASE_INVENTORY_TABLE || 'inventory'
  const { data, error } = await supabase.from(table).select('id, product_name, sku, unit_price, quantity').limit(100)
  if (error) throw error

  return data.map((row, index) => ({
    id: firstValue(row, ['id', 'sku', 'product_id'], index + 1),
    title: firstValue(row, ['product_name'], 'Unnamed product'),
    sku: firstValue(row, ['sku'], ''),
    price: Number(firstValue(row, ['unit_price'], 0)),
    stock: Number(firstValue(row, ['quantity'], 0)),
  }))
}

export const deriveDashboardMetrics = (suppliers, inventory) => {
  const totalUnits = inventory.reduce((total, item) => total + item.stock, 0)
  const inventoryValue = inventory.reduce((total, item) => total + item.stock * item.price, 0)
  const lowStock = inventory.filter((item) => item.stock < 10).length
  const averageReliability = suppliers.length
    ? suppliers.reduce((total, supplier) => total + supplier.score, 0) / suppliers.length
    : 0
  const averageFill = suppliers.length
    ? suppliers.reduce((total, supplier) => total + supplier.fill, 0) / suppliers.length
    : 0
  const atRisk = suppliers.filter((supplier) => supplier.tone === 'red').length

  return { totalUnits, inventoryValue, lowStock, averageReliability, averageFill, atRisk }
}
