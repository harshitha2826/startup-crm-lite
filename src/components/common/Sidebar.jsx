import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3 } from 'lucide-react';

/**
 * Sidebar Component
 * Renders the global left-hand sidebar navigation structure.
 * Uses NavLink to reactively highlight the active route.
 * 
 * @param {Function} onClose - Optional callback to close mobile sidebar drawer.
 */
const Sidebar = ({ onClose }) => {
  // Define navigation configuration items with sub-labels for desktop
  const navItems = [
    { 
      to: '/', 
      label: 'Dashboard', 
      subLabel: 'Overview & metrics', 
      icon: LayoutDashboard 
    },
    { 
      to: '/leads', 
      label: 'Leads', 
      subLabel: 'Pipeline management', 
      icon: Users 
    },
    { 
      to: '/analytics', 
      label: 'Analytics', 
      subLabel: 'Insights & forecast', 
      icon: BarChart3 
    },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
      {/* Sidebar Header Brand Area */}
      <div className="flex items-center justify-center lg:justify-between h-14 px-4 lg:px-5 border-b border-gray-200 dark:border-gray-700">
        <Link 
          to="/" 
          onClick={onClose}
          className="flex items-center gap-2 font-bold tracking-tight text-primary min-h-[44px]"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white shadow-sm font-sans text-lg font-black shrink-0">
            S
          </span>
          <span className="text-gray-900 dark:text-white font-semibold hidden lg:inline-block">StartupCRM</span>
          <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 rounded font-mono font-medium hidden lg:inline-block">
            Lite
          </span>
        </Link>
      </div>

      {/* Navigation List Area */}
      <nav className="flex-1 px-2 lg:px-3 py-4 space-y-2 lg:space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex flex-col lg:flex-row items-center lg:items-start gap-1 lg:gap-3 px-2 lg:px-3 py-2.5 lg:py-2 text-center lg:text-left rounded-lg transition-all duration-150 group cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-primary/10 text-primary border-l-0 lg:border-l-2 lg:border-primary border-t-2 lg:border-t-0 border-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`
              }
            >
              <Icon className="w-5 h-5 lg:w-4 lg:h-4 shrink-0 mt-0.5" />
              <div className="flex flex-col items-center lg:items-start min-w-0">
                <span className="text-[10px] lg:text-sm font-semibold truncate leading-none">
                  {item.label}
                </span>
                <span className="text-[9px] text-gray-400 dark:text-gray-500 hidden lg:block mt-0.5 font-normal truncate leading-none">
                  {item.subLabel}
                </span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Collaborators Panel (Notion style status log - Hidden on compact tablet view) */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hidden lg:block">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-1">
          Active Team
        </h4>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-900 dark:text-white">
            <span className="w-2 h-2 rounded-full bg-success status-pulse-dot" />
            <span>Alex Rivera</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-900 dark:text-white">
            <span className="w-2 h-2 rounded-full bg-success status-pulse-dot" />
            <span>Michael Chen</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-900 dark:text-white">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-gray-500 dark:text-gray-400">Sarah Jenkins</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
