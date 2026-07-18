import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-200">
      {/* Decorative colored glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-xl border border-gray-200/80 dark:border-gray-700/60 relative z-10 transition-all duration-300">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-xs text-muted mt-1.5 font-medium">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Local Error alert if API login fails */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/20 text-danger text-xs font-semibold rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-10 pr-3 text-sm bg-white/50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-primary focus:outline-none transition-colors placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-10 pr-3 text-sm bg-white/50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-primary focus:outline-none transition-colors placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-primary hover:bg-primary/95 active:scale-[0.98] text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none mt-2 shadow-md shadow-primary/10"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Toggle Link */}
        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="text-xs text-primary hover:underline font-medium cursor-pointer"
          >
            Don't have an account? Sign up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
