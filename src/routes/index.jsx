import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';

// ==========================================
// 1. LAZY LOADING ROUTES SETUP
// ==========================================
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));

// ==========================================
// 2. LOADING STATE FALLBACK COMPONENT
// ==========================================
const RouteLoader = () => (
  <div className="flex items-center justify-center w-full h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <span className="text-xs text-muted font-medium">Loading panel...</span>
    </div>
  </div>
);

// ==========================================
// 3. PROTECTED ROUTE INTERCEPTOR
// ==========================================
const ProtectedRoute = () => {
  const { token } = useAuth();

  // If no token exists, redirect the user immediately to the public Login screen
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the layout skeleton wrapping the active page outlet
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// ==========================================
// 4. MAIN ROUTING Blueprints
// ==========================================
const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard/CRM Panels */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* 404 Fallback Route for any unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
