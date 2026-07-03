import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// ==========================================
// 1. LAZY LOADING ROUTES SETUP
// ==========================================
// React.lazy performs code-splitting, dynamically importing page components
// only when the user navigates to their corresponding path. This drastically
// improves the initial bundle download size and overall startup performance.

// Lazy load the Dashboard page component
const Dashboard = lazy(() => import('../pages/Dashboard'));

// Lazy load the Lead Management page component
const Leads = lazy(() => import('../pages/Leads'));

// Lazy load the Analytics page component
const Analytics = lazy(() => import('../pages/Analytics'));

// Lazy load the 404 Fallback page component
const NotFound = lazy(() => import('../pages/NotFound'));

// ==========================================
// 2. LOADING STATE FALLBACK COMPONENT
// ==========================================
// Rendered by Suspense while the chunked javascript files are fetched over the network.
const RouteLoader = () => (
  <div className="flex items-center justify-center w-full h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      {/* Dynamic spinner utilizing primary color theme and spin utility */}
      <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      {/* Understated user-facing progress label */}
      <span className="text-xs text-muted font-medium">Loading panel...</span>
    </div>
  </div>
);

// ==========================================
// 3. MAIN ROUTING Blueprints
// ==========================================
/**
 * AppRoutes Component
 * Contains the routing table configuration mappings.
 * Wraps routes in a Suspense component with fallback loaders to handle lazy imports.
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Render Dashboard at path '/' */}
        <Route path="/" element={<Dashboard />} />

        {/* Render Lead Management at path '/leads' */}
        <Route path="/leads" element={<Leads />} />

        {/* Render Analytics at path '/analytics' */}
        <Route path="/analytics" element={<Analytics />} />

        {/* 404 Fallback Route for any unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
