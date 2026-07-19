/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import leadService from '../services/leadService';
import { LEAD_STAGES, PRIORITIES, TEMPERATURES, DEFAULT_LEAD_OWNER } from '../constants';
import { useAuth } from './AuthContext';

const LeadContext = createContext(null);

const initialTasks = [
  { id: 'task-1', text: 'Follow up with Sarah Jenkins (Segment) about security review doc', completed: false, dueDate: 'Today', priority: PRIORITIES.HIGH },
  { id: 'task-2', text: 'Review Vercel contract draft for Elena Rostova', completed: false, dueDate: 'Today', priority: PRIORITIES.HIGH },
  { id: 'task-3', text: 'Send customized pricing pitch deck to Aris Thorne (Retool)', completed: false, dueDate: 'Tomorrow', priority: PRIORITIES.MEDIUM },
  { id: 'task-4', text: 'Prepare pipeline slides for weekly Monday startup sync', completed: true, dueDate: 'Done', priority: PRIORITIES.MEDIUM },
  { id: 'task-5', text: 'Conduct initial qualification call with Neon DB team', completed: false, dueDate: 'Next week', priority: PRIORITIES.LOW },
];

export const LeadProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // API State
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [error, setError] = useState(null);

  // Task management (persisted locally)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('crm_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  // Sync tasks to localStorage
  useEffect(() => {
    localStorage.setItem('crm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Fetch leads from backend
  const fetchLeads = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const responseData = await leadService.getLeads(params);
      // Backend returns { success: true, data: [...], pagination: { total, page, limit, pages } }
      const normalized = (responseData.data || []).map(lead => ({
        ...lead,
        stage: lead.status || lead.stage
      }));
      setLeads(normalized);
      if (responseData.pagination) {
        setPagination({
          page: responseData.pagination.page,
          limit: responseData.pagination.limit,
          total: responseData.pagination.total,
          totalPages: responseData.pagination.pages
        });
      }
      setError(null);
    } catch (e) {
      console.error(e);
      const errorMsg = e.response?.data?.message || e.message || 'Failed to load leads';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(true); // Keep loading state or set false? Should be false when done
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load leads when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    } else {
      setLeads([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchLeads]);

  // Add lead
  const addLead = useCallback(async (leadData) => {
    const statusVal = leadData.status || leadData.stage || LEAD_STAGES.NEW;
    const payload = {
      ...leadData,
      status: statusVal,
      stage: statusVal,
      priority: leadData.priority || PRIORITIES.MEDIUM,
      temperature: leadData.temperature || TEMPERATURES.WARM,
      owner: leadData.owner || DEFAULT_LEAD_OWNER,
      source: leadData.source || 'Other',
      value: leadData.value !== undefined ? Number(leadData.value) : 0,
    };
    try {
      const responseData = await leadService.createLead(payload);
      const newLead = responseData.data ? { ...responseData.data, stage: responseData.data.status || responseData.data.stage } : null;
      if (newLead) {
        setLeads((prev) => [newLead, ...prev]);
      }
      toast.success(responseData.message || 'Lead created successfully');
    } catch (e) {
      console.error(e);
      const errorMsg = e.response?.data?.message || e.message || 'Failed to create lead';
      toast.error(errorMsg);
    }
  }, []);

  // Update lead - supports both signatures: updateLead(id, data) and updateLead(updatedLeadObject)
  const updateLead = useCallback(async (idOrObject, dataPayload) => {
    let id;
    let payload;

    if (typeof idOrObject === 'object' && idOrObject !== null) {
      id = idOrObject.id || idOrObject._id;
      payload = { ...idOrObject };
    } else {
      id = idOrObject;
      payload = { ...dataPayload };
    }

    // Map frontend 'stage' to backend 'status' so Mongoose can save it properly
    if (payload.stage !== undefined) {
      payload.status = payload.stage;
    }

    try {
      const responseData = await leadService.updateLead(id, payload);
      const updated = responseData.data ? { ...responseData.data, stage: responseData.data.status || responseData.data.stage } : null;
      if (updated) {
        setLeads((prev) => prev.map((l) => (l.id === id || l._id === id ? updated : l)));
        if (selectedLead && (selectedLead.id === id || selectedLead._id === id)) {
          setSelectedLead(updated);
        }
      }
      toast.success(responseData.message || 'Lead updated successfully');
    } catch (e) {
      console.error(e);
      const errorMsg = e.response?.data?.message || e.message || 'Failed to update lead';
      toast.error(errorMsg);
    }
  }, [selectedLead]);

  // Delete lead
  const deleteLead = useCallback(async (leadId) => {
    try {
      const responseData = await leadService.deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId && l._id !== leadId));
      if (selectedLead && (selectedLead.id === leadId || selectedLead._id === leadId)) {
        setSelectedLead(null);
      }
      toast.success(responseData.message || 'Lead deleted successfully');
    } catch (e) {
      console.error(e);
      const errorMsg = e.response?.data?.message || e.message || 'Failed to delete lead';
      toast.error(errorMsg);
    }
  }, [selectedLead]);

  const getLeadById = useCallback((leadId) => {
    return leads.find((l) => l.id === leadId || l._id === leadId);
  }, [leads]);

  // Fast drag & drop / stage change
  const updateLeadStage = useCallback(async (leadId, nextStage) => {
    try {
      const responseData = await leadService.updateLeadStatus(leadId, nextStage);
      const updated = responseData.data ? { ...responseData.data, stage: responseData.data.status || responseData.data.stage } : null;
      if (updated) {
        setLeads((prev) => prev.map((l) => (l.id === leadId || l._id === leadId ? updated : l)));
        if (selectedLead && (selectedLead.id === leadId || selectedLead._id === leadId)) {
          setSelectedLead(updated);
        }
      }
      toast.success(responseData.message || 'Lead status updated');
    } catch (e) {
      console.error(e);
      const errorMsg = e.response?.data?.message || e.message || 'Failed to update status';
      toast.error(errorMsg);
    }
  }, [selectedLead]);

  // Add timeline note
  const addLeadComment = useCallback(async (leadId, comment) => {
    const lead = getLeadById(leadId);
    if (!lead) return;
    const historyEntry = { id: `h-${Date.now()}`, type: 'note', text: comment, time: new Date().toISOString() };
    const updatedHistory = [historyEntry, ...(lead.history || [])];
    await updateLead(leadId, { history: updatedHistory });
  }, [getLeadById, updateLead]);

  // Task helpers
  const addTask = useCallback((text, priority = PRIORITIES.MEDIUM, dueDate = 'Today') => {
    const newTask = { id: `task-${Date.now()}`, text, completed: false, priority, dueDate };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((taskId) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const contextValue = useMemo(
    () => ({
      leads,
      isLoading,
      loading: isLoading, // backwards compatibility
      pagination,
      error,
      tasks,
      searchQuery,
      selectedLead,
      setSearchQuery,
      setSelectedLead,
      fetchLeads,
      addLead,
      updateLead,
      deleteLead,
      getLeadById,
      updateLeadStage,
      addLeadComment,
      addTask,
      toggleTask,
      deleteTask,
    }),
    [leads, isLoading, pagination, error, tasks, searchQuery, selectedLead, fetchLeads, addLead, updateLead, deleteLead, getLeadById, updateLeadStage, addLeadComment, addTask, toggleTask, deleteTask]
  );

  return <LeadContext.Provider value={contextValue}>{children}</LeadContext.Provider>;
};

export const useLeads = () => {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLeads must be used within a LeadProvider');
  return ctx;
};
