import { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Grid, 
  List, 
  X, 
  Users, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';

/**
 * Leads Page Component
 * Connects to CRM Context, filters lead collections, toggles display layouts,
 * and handles modal creation, updates, deletions, and toast alerts.
 * 
 * @returns {React.JSX.Element}
 */
const Leads = () => {
  const {
    leads = [],
    addLead,
    updateLead,
    deleteLead,
  } = useLeads();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' (cards) or 'table'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter Leads by activeFilter and searchQuery
  const filteredLeads = leads
    .filter((lead) => activeFilter === 'All' || (lead.stage || lead.status) === activeFilter)
    .filter((lead) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;

      return (
        (lead.name || '').toLowerCase().includes(query) ||
        (lead.company || '').toLowerCase().includes(query) ||
        (lead.email || '').toLowerCase().includes(query)
      );
    });

  // Calculate Metrics for Leads page header
  const totalValue = filteredLeads.reduce((sum, lead) => sum + (Number(lead.value) || 0), 0);
  const activeCount = filteredLeads.filter(l => (l.status || l.stage) !== 'Won' && (l.status || l.stage) !== 'Lost').length;

  // Open modal for Create Mode
  const handleAddClick = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit Mode
  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  // Trigger Delete confirmation
  const handleDeleteClick = (leadId) => {
    if (window.confirm('Are you sure you want to permanently delete this lead?')) {
      deleteLead(leadId);
      toast.error('Lead deleted successfully.', {
        style: {
          border: '1px solid var(--danger)',
          background: 'rgba(239, 68, 68, 0.05)',
          color: 'var(--danger)',
        },
        iconTheme: {
          primary: 'var(--danger)',
          secondary: '#fff',
        },
      });
    }
  };

  // Form Submit Handler (both Add & Edit)
  const handleFormSubmit = (data) => {
    if (selectedLead) {
      // Edit mode
      updateLead(data);
      toast.success('Lead updated successfully.', {
        style: {
          border: '1px solid var(--success)',
          background: 'rgba(34, 197, 94, 0.05)',
          color: 'var(--success)',
        },
        iconTheme: {
          primary: 'var(--success)',
          secondary: '#fff',
        },
      });
    } else {
      // Create mode
      addLead(data);
      toast.success('Lead created successfully.', {
        style: {
          border: '1px solid var(--success)',
          background: 'rgba(34, 197, 94, 0.05)',
          color: 'var(--success)',
        },
        iconTheme: {
          primary: 'var(--success)',
          secondary: '#fff',
        },
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      {/* 1. Page Header & Key Metrics Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground select-none">
            Lead Management
          </h1>
          <p className="text-sm text-muted">
            Manage your customer qualification funnel, contacts, and deal pipelines.
          </p>
        </div>
        
        <Button 
          onClick={handleAddClick} 
          variant="primary" 
          className="flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </Button>
      </div>

      {/* Overview stats for context feedback */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Total Deals</span>
            <h3 className="text-xl font-bold text-foreground mt-0.5">{filteredLeads.length}</h3>
          </div>
          <div className="p-2.5 rounded-lg border border-primary/10 bg-primary/5 text-primary">
            <Users className="w-4 h-4" />
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Pipeline Stage Value</span>
            <h3 className="text-xl font-bold text-foreground mt-0.5">${totalValue.toLocaleString()}</h3>
          </div>
          <div className="p-2.5 rounded-lg border border-success/10 bg-success/5 text-success">
            <DollarSign className="w-4 h-4" />
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Active Funnel Deals</span>
            <h3 className="text-xl font-bold text-foreground mt-0.5">{activeCount}</h3>
          </div>
          <div className="p-2.5 rounded-lg border border-warning/10 bg-warning/5 text-warning">
            <TrendingUp className="w-4 h-4" />
          </div>
        </Card>
      </div>

      {/* 2. Search, Filter and Layout Controls Bar */}
      <div className="space-y-4">
        <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* View Toggle (Grid/Card vs Table) - Only visible on tablet (md:flex lg:hidden) */}
          <div className="hidden md:flex lg:hidden bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 p-0.5 rounded-lg shadow-inner">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Card View"
              aria-label="Toggle Card View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Table View"
              aria-label="Toggle Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Filter Bar */}
        <div className="px-1 font-sans">
          <FilterBar 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
            leads={leads} 
          />
        </div>
      </div>

      {/* 3. Main Views (Responsive Card stack on Mobile, Table on Desktop) */}
      <div className="w-full">
        {filteredLeads.length === 0 ? (
          <EmptyState
            totalLeadsCount={leads.length}
            filteredLeadsCount={filteredLeads.length}
            onClearFilters={() => {
              setSearchQuery('');
              setActiveFilter('All');
            }}
          />
        ) : (
          <>
            {/* Table View:
                - Hidden on mobile: `hidden`
                - On tablet: depends on viewMode: `hidden md:block` or `md:hidden`
                - On desktop: always visible: `lg:block`
            */}
            <div className={`hidden ${viewMode === 'table' ? 'md:block' : 'md:hidden'} lg:block`}>
              <LeadTable
                leads={filteredLeads}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </div>

            {/* Card View:
                - Visible on mobile: default
                - On tablet: depends on viewMode: `viewMode === 'grid' ? 'md:grid' : 'md:hidden'`
                - On desktop: always hidden: `lg:hidden`
            */}
            <div className={`${viewMode === 'grid' ? 'md:grid' : 'md:hidden'} lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4`}>
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 4. CRUD Edit/Add Dialog Modal - Mobile full screen, Tablet+ centered max-w-lg */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <Card className="w-full h-full sm:h-auto sm:max-w-lg shadow-2xl border-0 sm:border border-gray-200 dark:border-gray-700 flex flex-col p-6 animate-in zoom-in-95 duration-150 bg-white dark:bg-gray-800 rounded-none sm:rounded-2xl">
            {/* Modal Title Row */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 id="modal-title" className="text-base font-bold text-gray-900 dark:text-white">
                {selectedLead ? 'Edit Lead Details' : 'Create New Lead'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="overflow-y-auto flex-1 sm:flex-initial max-h-[calc(100vh-8rem)] sm:max-h-[75vh] py-4">
              <LeadForm
                key={selectedLead?.id || 'new'}
                initialData={selectedLead}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

export default Leads;
