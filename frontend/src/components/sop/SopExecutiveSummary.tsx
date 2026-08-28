import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../ui/Badge';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useOutletContext } from 'react-router-dom';
import type { AppOutletContext } from '../../layouts/AppLayout';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const SopExecutiveSummary: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  
  const { data } = useDashboardData();
  const { latestProcurementResult } = useOutletContext<AppOutletContext>();

  // KPI 1 - Forecast Quantity
  const forecastDemand = data?.demandForecast?.reduce((sum, item) => sum + (item.forecast_quantity || 0), 0) || 0;
  const forecastQuantityLabel = `${formatNumber(forecastDemand)} units`;
  
  // KPI 2 - Available Supply
  const availableSupply = data?.inventory?.reduce((sum, item) => sum + ((item.quantity || 0) - (item.reserved_quantity || 0)), 0) || 0;
  const availableSupplyLabel = `${formatNumber(availableSupply)} units`;
  
  // KPI 3 - Demand vs Supply
  const gap = forecastDemand - availableSupply;
  let gapPct = 0;
  if (forecastDemand > 0) {
    gapPct = (gap / forecastDemand) * 100;
  }
  
  let gapStatus = "Balanced";
  let gapDisplay = "0.0%";
  let gapColor = isLight ? "#10B981" : "#34D399"; // balanced

  if (gapPct > 0) {
    gapStatus = "Supply Gap";
    gapDisplay = `+${gapPct.toFixed(1)}%`;
    gapColor = isLight ? "#F59E0B" : "#FBBF24"; // warning
  } else if (gapPct < 0) {
    gapStatus = "Excess Supply";
    gapDisplay = `${gapPct.toFixed(1)}%`; // already negative
    gapColor = isLight ? "#06B6D4" : "#22D3EE"; // excess supply
  }
  
  // KPI 4 - Fabric Availability
  let availabilityPct = 100;
  if (forecastDemand > 0) {
    availabilityPct = Math.min(availableSupply / forecastDemand, 1) * 100;
  }
  const fabricAvailabilityLabel = `${availabilityPct.toFixed(1)}%`;

  // KPI 5 - Procurement Cost
  let procurementCostLabel = 'Not Run';
  if (latestProcurementResult) {
    procurementCostLabel = formatCurrency(latestProcurementResult.total_cost, 'INR');
  }

  // KPI 6 - Supplier Risk
  let supplierRiskLabel = 'Not Run';
  let supplierRiskColor = 'cyan';
  if (latestProcurementResult && latestProcurementResult.allocation.length > 0) {
    let totalScore = 0;
    let totalQty = 0;
    latestProcurementResult.allocation.forEach(alloc => {
      totalScore += alloc.quantity * alloc.risk_score;
      totalQty += alloc.quantity;
    });
    const weightedRisk = totalQty > 0 ? totalScore / totalQty : 0;
    
    if (weightedRisk <= 0.2) {
      supplierRiskLabel = 'LOW';
      supplierRiskColor = 'emerald';
    } else if (weightedRisk <= 0.5) {
      supplierRiskLabel = 'MEDIUM';
      supplierRiskColor = 'amber';
    } else {
      supplierRiskLabel = 'HIGH';
      supplierRiskColor = 'rose';
    }
  }

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ 
        marginBottom: '16px' 
      }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 700, 
          color: isLight ? '#0F172A' : '#F8FAFC',
          margin: 0
        }}>
          S&OP Executive Summary
        </h2>
        <p style={{ 
          fontSize: '13px', 
          color: '#64748B', 
          margin: '4px 0 0 0' 
        }}>
          Demand, supply, and procurement alignment from current planning data.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {/* DEMAND COLUMN */}
        <CinematicCard glowColor="cyan">
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            color: '#8B5CF6',
            marginBottom: '16px'
          }}>
            DEMAND
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Forecast Quantity</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                {forecastQuantityLabel}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Demand vs Supply</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: gapColor }}>
                  {gapDisplay}
                </div>
                <Badge variant={gapPct > 0 ? "amber" : (gapPct < 0 ? "cyan" : "emerald")}>
                  {gapStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CinematicCard>

        {/* SUPPLY COLUMN */}
        <CinematicCard glowColor="emerald">
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            color: '#10B981',
            marginBottom: '16px'
          }}>
            SUPPLY
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Available Supply</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                {availableSupplyLabel}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Fabric Availability</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                {fabricAvailabilityLabel}
              </div>
            </div>
          </div>
        </CinematicCard>

        {/* PROCUREMENT COLUMN */}
        <CinematicCard glowColor="amber">
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            color: '#F59E0B',
            marginBottom: '16px'
          }}>
            PROCUREMENT
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Procurement Cost</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                {latestProcurementResult ? procurementCostLabel : <Badge variant="muted">Not Run</Badge>}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Supplier Risk</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                {latestProcurementResult ? (
                  <Badge variant={supplierRiskColor as any}>{supplierRiskLabel}</Badge>
                ) : (
                  <Badge variant="muted">Not Run</Badge>
                )}
              </div>
            </div>
          </div>
        </CinematicCard>
      </div>
    </div>
  );
};
