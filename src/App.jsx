import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

/**
 * Root Application Component
 * Resolves authentication loading fallback and mounts routing pages.
 */
function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <span className="text-sm text-muted font-medium">Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-sans)',
          },
        }}
      />
      <AppRoutes />
    </>
  );
}

export default App;
