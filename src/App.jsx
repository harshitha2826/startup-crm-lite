// Import BrowserRouter from react-router-dom to enable HTML5 History API routing
import { BrowserRouter } from 'react-router-dom';
// Import global UI structure shell (comprising sticky header and right sliding drawers)
import Layout from './components/common/Layout';
// Import modular routes engine containing the dynamic lazy loading split declarations
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';

/**
 * Root Application Component
 * Wraps the app hierarchy inside Context Providers and React Router interfaces.
 */
function App() {
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
      
      {/* 2. Instantiate HTML5 History API routing provider */}
      <BrowserRouter>
        
        {/* 3. Wrap canvas in Layout layout (Sidebar navigations, Top Global Bar) */}
        <Layout>
          
          {/* 4. Mount dynamic lazy-loaded page route slots */}
          <AppRoutes />
          
        </Layout>
        
      </BrowserRouter>
    </>
  );
}

export default App;
