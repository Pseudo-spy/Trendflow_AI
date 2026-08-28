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
const ProductsPage = React.lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const MaterialsPage = React.lazy(() => import('./pages/MaterialsPage').then(m => ({ default: m.MaterialsPage })));

// Removing RootRoute since the root path should always show LandingPage
// as the Platform Overview, regardless of auth state.

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingState />;

  if (!isAuthenticated) {
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
              {/* Root Route: Shows Platform Overview on initial website entry */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Application Layout with Navigation Shell */}
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="demand-planning" element={<DemandPlanningPage />} />
                <Route path="sop" element={<SopPlanningPage />} />
                <Route path="inventory" element={<InventoryOptimizationPage />} />
                <Route path="procurement" element={<ProcurementPage />} />
                <Route path="suppliers" element={<SuppliersPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="materials" element={<MaterialsPage />} />
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
