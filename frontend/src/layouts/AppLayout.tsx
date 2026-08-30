import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { CinematicBackground } from './CinematicBackground';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { type MaterialRequirementContract } from '../services/api/sopApi';
import { type OptimizationResponse } from '../services/api/procurementApi';
import { type RiskPredictionResponse } from '../services/api/riskApi';
import { type ScenarioRunResponse } from '../services/api/scenarioApi';

export interface AppOutletContext {
  latestSopResult: MaterialRequirementContract | null;
  setLatestSopResult: (result: MaterialRequirementContract | null) => void;
  latestProcurementResult: OptimizationResponse | null;
  setLatestProcurementResult: (result: OptimizationResponse | null) => void;
  latestRiskResult: RiskPredictionResponse | null;
  setLatestRiskResult: (result: RiskPredictionResponse | null) => void;
  latestScenarioResult: ScenarioRunResponse | null;
  setLatestScenarioResult: (result: ScenarioRunResponse | null) => void;
}

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // Session States
  const [latestSopResult, setLatestSopResult] = useState<MaterialRequirementContract | null>(() => {
    // TODO: Replace sessionStorage fallback with GET /api/sop/latest when persistent backend latest-result endpoint is available.
    try {
      const stored = sessionStorage.getItem('trendflow.latestSopResult');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.material_id && typeof parsed.required_quantity === 'number' && parsed.required_date && parsed.plant_id && parsed.priority) {
          return parsed as MaterialRequirementContract;
        }
        sessionStorage.removeItem('trendflow.latestSopResult');
      }
    } catch (e) {
      sessionStorage.removeItem('trendflow.latestSopResult');
    }
    return null;
  });
  
  const persistLatestSopResult = (result: MaterialRequirementContract | null) => {
    setLatestSopResult(result);
    if (result) {
      sessionStorage.setItem('trendflow.latestSopResult', JSON.stringify(result));
    } else {
      sessionStorage.removeItem('trendflow.latestSopResult');
    }
  };
  
  const [latestProcurementResult, setLatestProcurementResult] = useState<OptimizationResponse | null>(null);
  const [latestRiskResult, setLatestRiskResult] = useState<RiskPredictionResponse | null>(null);
  const [latestScenarioResult, setLatestScenarioResult] = useState<ScenarioRunResponse | null>(null);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Persistent Single 3D Scene Background */}
      <CinematicBackground />

      {/* Global Brand Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isTablet={isTablet} />

      {/* Backdrop for mobile sidebar */}
      {isTablet && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
        />
      )}

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          marginLeft: isTablet ? '0px' : '74px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 10,
          width: isTablet ? '100%' : 'calc(100% - 74px)',
        }}
      >
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          isTablet={isTablet} 
          onSopPlanningComplete={persistLatestSopResult}
        />

        <main
          style={{
            flex: 1,
            padding: '24px 28px',
            maxWidth: '1600px',
            width: '100%',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <Outlet 
            context={{
              latestSopResult,
              setLatestSopResult: persistLatestSopResult,
              latestProcurementResult,
              setLatestProcurementResult,
              latestRiskResult,
              setLatestRiskResult,
              latestScenarioResult,
              setLatestScenarioResult
            } as AppOutletContext}
          />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
