/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { sampleLeads } from '../data/sampleLeads';
import { LEAD_STAGES, PRIORITIES, TEMPERATURES, DEFAULT_LEAD_OWNER } from '../constants';

/**
 * Lead object type definition (TypeScript-style schema).
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier (crypto.randomUUID or timestamp string).
 * @property {string} name - Contact person's name.
 * @property {string} company - Organization/company name.
 * @property {string} email - Contact email address.
 * @property {string} phone - Contact phone number.
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} status - Lead stage status.
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} stage - Duplicate mapping for backward-compatibility.
 * @property {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} source - Lead acquisition source.
 * @property {string} createdAt - ISO Date string.
 * @property {number} value - Deal contract value.
 * @property {string} [priority] - Deal priority ('High' | 'Medium' | 'Low').
 * @property {string} [temperature] - Deal temperature ('Hot' | 'Warm' | 'Cold').
 * @property {string} [owner] - Sales executive owner assignment.
 * @property {string} [notes] - Context and initial summary notes.
 * @property {Array<Object>} [history] - Activities updates feed.
 */

const LeadContext = createContext(null);

const initialTasks = [
  { id: 'task-1', text: 'Follow up with Sarah Jenkins (Segment) about security review doc', completed: false, dueDate: 'Today', priority: PRIORITIES.HIGH },
  { id: 'task-2', text: 'Review Vercel contract draft for Elena Rostova', completed: false, dueDate: 'Today', priority: PRIORITIES.HIGH },
  { id: 'task-3', text: 'Send customized pricing pitch deck to Aris Thorne (Retool)', completed: false, dueDate: 'Tomorrow', priority: PRIORITIES.MEDIUM },
  { id: 'task-4', text: 'Prepare pipeline slides for weekly Monday startup sync', completed: true, dueDate: 'Done', priority: PRIORITIES.MEDIUM },
  { id: 'task-5', text: 'Conduct initial qualification call with Neon DB team', completed: false, dueDate: 'Next week', priority: PRIORITIES.LOW }
];

/**
 * LeadProvider Component
 * Context provider wrapping the application node to establish global lead lists and workflows.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child elements.
 * @returns {React.JSX.Element}
 */
export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useLocalStorage('startup-crm-leads', sampleLeads);

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

  /**
   * Adds a new lead to the CRM database.
   * Generates a unique ID and appends a createdAt timestamp automatically.
   * 
   * @param {Omit<Lead, 'id' | 'createdAt'>} leadData - Lead field details.
   */
  const addLead = useCallback((leadData) => {
    const statusVal = leadData.status || leadData.stage || LEAD_STAGES.NEW;
    const newLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      history: [{ id: `h-${Date.now()}`, type: 'create', text: 'Lead created', time: new Date().toISOString() }],
      notes: leadData.notes || '',
      status: statusVal,
      stage: statusVal,
      priority: leadData.priority || PRIORITIES.MEDIUM,
      temperature: leadData.temperature || TEMPERATURES.WARM,
      owner: leadData.owner || DEFAULT_LEAD_OWNER,
      source: leadData.source || 'Other',
      value: leadData.value !== undefined ? Number(leadData.value) : 0,
      ...leadData
    };
    setLeads((prev) => [newLead, ...prev]);
  }, [setLeads]);

  /**
   * Updates an existing lead in the CRM database.
   * 
   * @param {Lead} updatedLeadData - The modified lead information.
   */
  const updateLead = useCallback((updatedLeadData) => {
    const statusVal = updatedLeadData.status || updatedLeadData.stage;
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === updatedLeadData.id) {
          const timestamp = new Date().toISOString();
          const historyEntry = {
            id: `h-${Date.now()}`,
            type: 'edit',
            text: 'Lead details updated',
            time: timestamp
          };
          const updated = {
            ...lead,
            ...updatedLeadData,
            status: statusVal || lead.status,
            stage: statusVal || lead.stage,
            history: [historyEntry, ...(lead.history || [])]
          };
          if (selectedLead && selectedLead.id === lead.id) {
            setSelectedLead(updated);
          }
          return updated;
        }
        return lead;
      })
    );
  }, [setLeads, selectedLead]);

  /**
   * Deletes a lead by ID.
   * 
   * @param {string} leadId - The unique lead identifier.
   */
  const deleteLead = useCallback((leadId) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(null);
    }
  }, [setLeads, selectedLead]);

  /**
   * Fetches a lead by its unique identifier.
   * 
   * @param {string} leadId - The unique lead identifier.
   * @returns {Lead | undefined} The matched lead object or undefined.
   */
  const getLeadById = useCallback((leadId) => {
    return leads.find((lead) => lead.id === leadId);
  }, [leads]);

  /**
   * Updates a lead's qualification pipeline stage.
   * 
   * @param {string} leadId - The unique lead identifier.
   * @param {string} nextStage - The next funnel stage value.
   */
  const updateLeadStage = useCallback((leadId, nextStage) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === leadId) {
          const timestamp = new Date().toISOString();
          const historyEntry = {
            id: `h-${Date.now()}`,
            type: 'status',
            text: `Stage updated to ${nextStage}`,
            time: timestamp
          };
          const updatedLead = {
            ...lead,
            stage: nextStage,
            status: nextStage,
            history: [historyEntry, ...(lead.history || [])]
          };
          if (selectedLead && selectedLead.id === leadId) {
            setSelectedLead(updatedLead);
          }
          return updatedLead;
        }
        return lead;
      })
    );
  }, [setLeads, selectedLead]);

  /**
   * Appends an updates/comments log inside a lead's historical activities feed.
   * 
   * @param {string} leadId - The unique lead identifier.
   * @param {string} commentText - The comments content.
   */
  const addLeadComment = useCallback((leadId, commentText) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === leadId) {
          const timestamp = new Date().toISOString();
          const historyEntry = {
            id: `h-${Date.now()}`,
            type: 'note',
            text: commentText,
            time: timestamp
          };
          const updatedLead = {
            ...lead,
            history: [historyEntry, ...(lead.history || [])]
          };
          if (selectedLead && selectedLead.id === leadId) {
            setSelectedLead(updatedLead);
          }
          return updatedLead;
        }
        return lead;
      })
    );
  }, [setLeads, selectedLead]);

  /**
   * Adds a new check-item task.
   * 
   * @param {string} text - Task descriptions.
   * @param {string} [priority] - Task priority rating.
   * @param {string} [dueDate] - Task target schedule.
   */
  const addTask = useCallback((text, priority = PRIORITIES.MEDIUM, dueDate = 'Today') => {
    const newTask = {
      id: `task-${Date.now()}`,
      text,
      completed: false,
      priority,
      dueDate
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  /**
   * Toggles task completion status.
   * 
   * @param {string} taskId - Unique task ID.
   */
  const toggleTask = useCallback((taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  /**
   * Deletes a check-item task.
   * 
   * @param {string} taskId - Unique task ID.
   */
  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  // Memoize Provider value
  const contextValue = useMemo(() => ({
    leads,
    tasks,
    searchQuery,
    selectedLead,
    setSearchQuery,
    setSelectedLead,
    addLead,
    updateLead,
    deleteLead,
    getLeadById,
    updateLeadStage,
    addLeadComment,
    addTask,
    toggleTask,
    deleteTask
  }), [
    leads,
    tasks,
    searchQuery,
    selectedLead,
    addLead,
    updateLead,
    deleteLead,
    getLeadById,
    updateLeadStage,
    addLeadComment,
    addTask,
    toggleTask,
    deleteTask
  ]);

  return (
    <LeadContext.Provider value={contextValue}>
      {children}
    </LeadContext.Provider>
  );
};

/**
 * useLeads Custom Hook
 * Custom consumer hook fetching leads contextual value states and CRUD mutation triggers.
 * 
 * @returns {Object} Leads context properties and mutations.
 * @throws {Error} If context is used outside a LeadProvider.
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
