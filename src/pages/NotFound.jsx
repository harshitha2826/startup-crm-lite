import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { FileQuestion, Home } from 'lucide-react';

/**
 * NotFound Page Component (404 Fallback)
 * Displays a clean, premium themed fallback page when the user visits a route that does not exist.
 */
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      {/* 404 Visual Icon and Badge */}
      <div className="mb-6 p-5 bg-danger/10 text-danger border border-danger/25 rounded-2xl animate-bounce">
        <FileQuestion className="w-12 h-12" />
      </div>

      {/* Primary Headers */}
      <h1 className="text-6xl font-black tracking-tighter text-foreground mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-foreground mb-4">
        Page Not Found
      </h2>

      {/* Informative Subtext */}
      <p className="max-w-md text-sm text-muted mb-8 leading-relaxed">
        The route you are trying to access does not exist or may have been moved.
        Double-check the URL or return to the main dashboard.
      </p>

      {/* Call to Action Button */}
      <Link to="/">
        <Button variant="primary" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
