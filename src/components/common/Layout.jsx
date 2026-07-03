import { useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext';
import Badge from './Badge';
import Button from './Button';
import Sidebar from './Sidebar';
import DarkModeToggle from './DarkModeToggle';
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  User,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Trash2,
  Send,
  MessageSquare,
  LayoutDashboard,
  Users,
  BarChart3
} from 'lucide-react';

const Layout = ({ children }) => {
  const {
    selectedLead,
    setSelectedLead,
    updateLeadStage,
    deleteLead,
    addLeadComment,
    searchQuery,
    setSearchQuery
  } = useLeads();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const location = useLocation();

  // Get current breadcrumb label
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/leads') return 'Leads';
    if (path === '/analytics') return 'Analytics';
    return 'CRM';
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedLead) return;
    addLeadComment(selectedLead.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      
      {/* 1. Sidebar Navigation (Desktop & Tablet) - Uses our responsive/modular Sidebar component */}
      <aside className="hidden md:flex flex-col md:w-20 lg:w-64 h-full border-r border-gray-200 dark:border-gray-700 shrink-0">
        <Sidebar />
      </aside>

      {/* 2. Mobile Sidebar Overlay Drawer - Implements the same Sidebar wrapped inside mobile drawers */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-64 h-full">
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
            <button 
              onClick={() => setMobileSidebarOpen(false)} 
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Workspace Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Sticky Header Bar */}
        <header className="flex items-center justify-between h-14 px-4 md:px-6 border-b border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <span className="text-gray-500 dark:text-gray-400">Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">{getBreadcrumb()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Search Bar (Linear/Stripe Inspired) */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search leads, companies... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-9 pl-9 pr-3 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:border-gray-300 dark:hover:border-gray-600 focus:border-primary focus:outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Dark Mode toggle */}
            <DarkModeToggle />

            {/* Notifications */}
            <div className="relative">
              <button 
                className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Notifications"
                title="View recent notifications"
              >
                <Bell className="w-4.5 h-4.5" />
              </button>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-danger status-pulse-dot" />
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            
            {/* Quick User Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs">
                AR
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Workspace Area (Cleared from mobile bottom nav padding) */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 relative pb-20 md:pb-6">
          {children}
        </main>

        {/* Bottom Navigation Bar (Mobile only, touch-friendly 48x48 targets) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 h-16 flex md:hidden items-center justify-around px-4 shadow-lg pb-safe">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-12 h-12 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
            aria-label="Dashboard"
          >
            <LayoutDashboard className="w-6 h-6" />
          </NavLink>

          <NavLink
            to="/leads"
            className={({ isActive }) =>
              `w-12 h-12 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
            aria-label="Leads"
          >
            <Users className="w-6 h-6" />
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `w-12 h-12 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
            aria-label="Analytics"
          >
            <BarChart3 className="w-6 h-6" />
          </NavLink>

          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 4. Slide-Out Lead Details Drawer (Integrated Right Drawer) */}
      {selectedLead && (
        <div className="fixed inset-0 z-40 flex justify-end bg-background/40 backdrop-blur-xs">
          {/* Backdrop Click Dismiss */}
          <div className="absolute inset-0" onClick={() => setSelectedLead(null)} />
          
          <div className="relative w-full max-w-lg h-full bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between h-14 px-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {selectedLead.company[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white leading-none">{selectedLead.company}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Lead Owner: {selectedLead.owner}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (window.confirm('Delete this lead?')) {
                      deleteLead(selectedLead.id);
                    }
                  }}
                  className="p-2 hover:bg-danger/10 hover:text-danger text-gray-500 dark:text-gray-400 rounded-lg transition-colors cursor-pointer"
                  title="Delete lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Core Information Grid */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 dark:bg-gray-900/50 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Contact Name</label>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
                    <User className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    <span>{selectedLead.name}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Deal Value</label>
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{selectedLead.value.toLocaleString()}</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email</label>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline text-gray-700 dark:text-gray-300"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedLead.email}</span>
                  </a>
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedLead.phone}</span>
                  </a>
                </div>
              </div>

              {/* Status and Pipeline Management */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metadata & Pipeline</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Lead Stage</label>
                    <select
                      value={selectedLead.stage}
                      onChange={(e) => updateLeadStage(selectedLead.id, e.target.value)}
                      className="w-full h-9 px-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-primary"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Demo Scheduled">Demo Scheduled</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Closed Won">Closed Won</option>
                      <option value="Closed Lost">Closed Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Temperature</label>
                    <div className="h-9 flex items-center">
                      <Badge>{selectedLead.temperature}</Badge>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Lead Source</label>
                    <div className="h-9 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                      {selectedLead.source}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Priority</label>
                    <div className="h-9 flex items-center">
                      <Badge>{selectedLead.priority}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Summary Notes</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-900 p-3.5 rounded-lg border border-gray-200 dark:border-gray-700">
                  {selectedLead.notes || 'No description notes available.'}
                </p>
              </div>

              {/* Lead Action History & Comments */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Timeline & Notes
                  </h4>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{selectedLead.history.length} updates</span>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a new update note..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 h-9 px-3 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-primary"
                  />
                  <Button type="submit" size="sm" variant="primary">
                    <Send className="w-3 h-3" />
                  </Button>
                </form>

                {/* Activity Feed */}
                <div className="space-y-3.5 mt-2">
                  {selectedLead.history.map((log) => (
                    <div key={log.id} className="flex gap-3 text-xs">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3 h-3" />
                      </div>
                      <div className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2.5 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white">{log.text}</p>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 block">
                          {new Date(log.time).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Layout;
