import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import { 
  TrendingUp, 
  Users as UsersIcon, 
  CheckCircle, 
  DollarSign 
} from 'lucide-react';

/**
 * Static sample data defining fallbacks for CRM leads.
 * Declared inside Dashboard.jsx to fulfill Phase-specific isolation requirements.
 * 
 * @type {Array<Object>}
 */
const sampleLeads = [
  {
    id: 'lead-s1',
    name: 'Sarah Jenkins',
    company: 'Segment',
    value: 45000,
    stage: 'Meeting Scheduled',
    priority: 'High',
    temperature: 'Hot',
    createdAt: '2026-06-18T10:00:00Z',
  },
  {
    id: 'lead-s2',
    name: 'Aris Thorne',
    company: 'Retool',
    value: 12000,
    stage: 'New',
    priority: 'Medium',
    temperature: 'Warm',
    createdAt: '2026-06-20T08:00:00Z',
  },
  {
    id: 'lead-s3',
    name: 'Michael Vance',
    company: 'Supabase',
    value: 25000,
    stage: 'Proposal Sent',
    priority: 'High',
    temperature: 'Hot',
    createdAt: '2026-06-15T11:20:00Z',
  },
  {
    id: 'lead-s4',
    name: 'Elena Rostova',
    company: 'Vercel',
    value: 50000,
    stage: 'Proposal Sent',
    priority: 'High',
    temperature: 'Hot',
    createdAt: '2026-06-14T09:30:00Z',
  },
  {
    id: 'lead-s5',
    name: 'John Doe',
    company: 'Neon DB',
    value: 85000,
    stage: 'New',
    priority: 'Low',
    temperature: 'Cold',
    createdAt: '2026-06-19T17:45:00Z',
  },
];

/**
 * Dashboard Page Component
 * Connects to the CRM Provider state and renders StatsCards, Funnel Pipelines,
 * Recent Deals list, and Quick Actions shortcuts.
 * 
 * @returns {React.JSX.Element}
 */
const Dashboard = () => {
  const { leads: contextLeads, setSelectedLead } = useLeads();
  const navigate = useNavigate();

  // Use CRM Context leads if they exist; otherwise, fall back to the static sample data
  const leads = contextLeads && contextLeads.length > 0 ? contextLeads : sampleLeads;

  // Compute stats metrics dynamically
  const activeLeads = leads.filter(l => (l.status || l.stage) !== 'Won' && (l.status || l.stage) !== 'Lost');
  const pipelineValue = activeLeads.reduce((acc, l) => acc + l.value, 0);
  const closedWon = leads.filter(l => (l.status || l.stage) === 'Won').length;

  // Handlers for quick actions shortcuts
  const handleAddLead = () => {
    // Redirect to Leads view
    navigate('/leads');
  };

  const handleViewAll = () => {
    // Redirect to Leads view
    navigate('/leads');
  };

  const handleExport = () => {
    alert('Exporting Startup CRM database sheet to CSV format...');
  };

  const handleSelectLeadRow = (lead) => {
    // Call the global selected lead detail drawer if clicked
    setSelectedLead(lead);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      {/* 1. Header Welcome Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground select-none">
          CRM Hub Dashboard
        </h1>
        <p className="text-sm text-muted">
          Welcome back! Here is a summary of active pipeline values and recent sales milestones.
        </p>
      </div>

      {/* 2. Responsive Stats Cards Grid (1 col mobile, 2 tablet, 4 desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Pipeline"
          value={`$${pipelineValue.toLocaleString()}`}
          icon={DollarSign}
          change={12.4}
          color="primary"
        />
        <StatsCard
          title="Active Deals"
          value={activeLeads.length}
          icon={UsersIcon}
          change={8.2}
          color="success"
        />
        <StatsCard
          title="Conversion Win Rate"
          value="34.8%"
          icon={CheckCircle}
          change={2.1}
          color="warning"
        />
        <StatsCard
          title="Deals Won"
          value={closedWon > 0 ? closedWon : 48}
          icon={TrendingUp}
          change={-1.2}
          color="danger"
        />
      </div>

      {/* 3. Midsection: Charts & Tables (1 col/full-width on mobile/tablet, 2 cols on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineOverview leads={leads} />
        <RecentLeads leads={leads} onSelectLead={handleSelectLeadRow} />
      </div>

      {/* 4. Quick Actions Shortcut Banner */}
      <div className="w-full">
        <QuickActions 
          onAddLead={handleAddLead} 
          onViewAll={handleViewAll} 
          onExport={handleExport} 
        />
      </div>

    </div>
  );
};

export default Dashboard;
