import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AppLayout } from './layouts/AppLayout';
import { LoadingState } from './components/ui/States';

// Lazy load all page routes
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const DemandPlanningPage = React.lazy(() => import('./pages/DemandPlanningPage').then(m => ({ default: m.DemandPlanningPage })));
const SopPlanningPage = React.lazy(() => import('./pages/SopPlanningPage').then(m => ({ default: m.SopPlanningPage })));
const InventoryOptimizationPage = React.lazy(() => import('./pages/InventoryOptimizationPage').then(m => ({ default: m.InventoryOptimizationPage })));
const ProcurementPage = React.lazy(() => import('./pages/ProcurementPage').then(m => ({ default: m.ProcurementPage })));
const SuppliersPage = React.lazy(() => import('./pages/SuppliersPage').then(m => ({ default: m.SuppliersPage })));
const RiskAnalysisPage = React.lazy(() => import('./pages/RiskAnalysisPage').then(m => ({ default: m.RiskAnalysisPage })));
const ScenariosPage = React.lazy(() => import('./pages/ScenariosPage').then(m => ({ default: m.ScenariosPage })));

// Root Route Handler: First page that appears is Login, or redirect to Dashboard if authenticated
const RootRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  const isDevBypass = import.meta.env.DEV && import.meta.env.VITE_DISABLE_AUTH === 'true';
  return (isAuthenticated || isDevBypass) ? <Navigate to="/dashboard" replace /> : <LoginPage />;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingState />;

  const isDevBypass = import.meta.env.DEV && import.meta.env.VITE_DISABLE_AUTH === 'true';

  if (!isAuthenticated && !isDevBypass) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider defaultMode="cinematic">
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingState />}>
            <Routes>
              {/* Root Route: Shows Login page on initial website entry */}
              <Route path="/" element={<RootRoute />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Application Layout with Navigation Shell */}
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="home" element={<LandingPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="demand-planning" element={<DemandPlanningPage />} />
                <Route path="sop" element={<SopPlanningPage />} />
                <Route path="inventory" element={<InventoryOptimizationPage />} />
                <Route path="procurement" element={<ProcurementPage />} />
                <Route path="suppliers" element={<SuppliersPage />} />
                <Route path="risk" element={<RiskAnalysisPage />} />
                <Route path="scenarios" element={<ScenariosPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
